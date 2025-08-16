import { Injectable } from '@angular/core';
import type { estypes } from '@elastic/elasticsearch';
import { ElasticEndpointSearchResponse } from '../../models/elastic/elastic-endpoint-search-response.type';
import { ElasticNodeModel } from '../../models/elastic/elastic-node.model';
import { Direction, NodeModel } from '../../models/node.model';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root',
})
export class SearchHitsService {
  private _hits: estypes.SearchHit<ElasticNodeModel>[] = [];
  constructor(private data: DataService) { }
  private static DEBUG = true;

  parseToNodes(hits: estypes.SearchHit<ElasticNodeModel>[]): NodeModel[] {
    return hits
      .sort((a, b) => {
        return (a._source as any)?.['_score'] - (b._source as any)?.['_score'];
      })
      .map((hit) => hit?._source)
      .filter((hitNode): hitNode is ElasticNodeModel => !!hitNode)
      .map((hitNode) => {
        const node: NodeModel = {
          '@id': [],
          endpointId: [],
        };
        this.data.replaceElasticNodePredSpacesWithPeriods(hitNode);
        for (const [pred, obj] of Object.entries(hitNode)) {
          if (!(pred in node)) {
            node[pred] = [];
          }

          let objValue: string | string[] = obj;

          // TODO: Allow configuration of which field to use as URI if the obj is an object instead of a string
          const hasUriField =
            typeof obj === 'object' && obj !== null && 'uri' in obj;
          if (hasUriField) {
            objValue = obj.uri as string;
          }

          const objValuesAsArray = Array.isArray(objValue)
            ? objValue
            : [objValue];
          for (const value of objValuesAsArray) {
            node[pred].push({ value: value, direction: Direction.Outgoing });
          }
        }
        return node;
      });
  }

  getFromSearchResponses(
    searchResponses: ElasticEndpointSearchResponse<ElasticNodeModel>[],
  ): estypes.SearchHit<ElasticNodeModel>[] {
    // First create a map of hits by their ID to merge duplicates
    const hitsMap = new Map<string, estypes.SearchHit<ElasticNodeModel>>();

    searchResponses.forEach((searchResponse) => {
      const hits = searchResponse?.hits?.hits ?? [];
      totalHits += hits.length;
      if (SearchHitsService.DEBUG) {
        console.log(`Endpoint ${searchResponse.endpointId}: ${hits.length} hits`);
      }

      hits.forEach((hit) => {
        if (!hit._source) {
          return;
        }

        // Add endpointId to the source
        (hit._source as ElasticNodeModel)['endpointId'] =
          searchResponse.endpointId;

        // Gebruik het _id veld van de hit zelf (niet van _source)
        let hitId = hit._id;
        // console.log('Hit _id:', hitId);

        // Probeer eerst '@id' en dan '_id' als fallback uit _source
        let sourceId = hit._source['@id'] || hit._source['_id'];
        // console.log('Source ID uit _source:', sourceId);
        // console.log('Hit _source bevat @id:', !!hit._source['@id']);
        // console.log('Hit _source bevat _id:', !!hit._source['_id']);

        // Gebruik hitId als primaire ID, sourceId als fallback
        const id: string = hitId || (Array.isArray(sourceId) ? sourceId[0] : String(sourceId || ''));
        // console.log('Uiteindelijke ID voor gebruik:', id);

        if (!id) {
          // console.warn('Document zonder ID gevonden:', hit._source);
          return;
        }

        // Zorg ervoor dat het document altijd een '@id' veld heeft voor interne verwerking
        hit._source['@id'] = id;
        // console.log('@id veld ingesteld op:', id);

        // Zorg ervoor dat het document ook een _id veld heeft
        hit._source['_id'] = id;
        // console.log('_id veld ingesteld op:', id);

        // Voeg hit toe aan allHits zonder deduplicatie
        allHits.push(hit);

        // Log de eerste paar hits voor debugging
        if (SearchHitsService.DEBUG && allHits.length <= 3) {
          console.log(`Hit ${allHits.length}:`, {
            id: id,
            source: hit._source
          });
        }
      });
    });

    // console.log(`Totaal aantal hits ontvangen: ${totalHits}, Alle hits: ${allHits.length}`);
    this._hits = allHits;
    return allHits;
  }

  getHits(): estypes.SearchHit<ElasticNodeModel>[] {
    return this._hits;
  }
}
