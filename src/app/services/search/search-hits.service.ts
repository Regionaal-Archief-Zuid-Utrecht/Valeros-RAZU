import { Injectable } from '@angular/core';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { ElasticEndpointSearchResponse } from '../../models/elastic/elastic-endpoint-search-response.type';
import { ElasticNodeModel } from '../../models/elastic/elastic-node.model';
import { Direction, NodeModel } from '../../models/node.model';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root',
})
export class SearchHitsService {
  private _hits: SearchHit<ElasticNodeModel>[] = [];
  constructor(private data: DataService) { }
  private static DEBUG = true;

  parseToNodes(hits: SearchHit<ElasticNodeModel>[]): NodeModel[] {
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
          const objValuesAsArray = Array.isArray(obj) ? obj : [obj];
          for (const objValue of objValuesAsArray) {
            node[pred].push({ value: objValue, direction: Direction.Outgoing });
          }
        }
        return node;
      });
  }

  getFromSearchResponses(
    searchResponses: ElasticEndpointSearchResponse<ElasticNodeModel>[],
  ): SearchHit<ElasticNodeModel>[] {
    // TIJDELIJK: Deduplicatie uitgeschakeld voor testen
    // Verzamel alle hits zonder deduplicatie
    const allHits: SearchHit<ElasticNodeModel>[] = [];

    // Debug logging
    if (SearchHitsService.DEBUG) {
      console.log('SearchResponses:', searchResponses);
    }
    let totalHits = 0;

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

  getHits(): SearchHit<ElasticNodeModel>[] {
    return this._hits;
  }
}
