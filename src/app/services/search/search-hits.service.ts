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
  constructor(private data: DataService) {}

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
    // First create a map of hits by their ID to merge duplicates
    const hitsMap = new Map<string, SearchHit<ElasticNodeModel>>();

    searchResponses.forEach((searchResponse) => {
      const hits = searchResponse?.hits?.hits ?? [];
      hits.forEach((hit) => {
        if (!hit._source) {
          return;
        }

        // Add endpointId to the source
        (hit._source as ElasticNodeModel)['endpointId'] =
          searchResponse.endpointId;

        // Probeer eerst '@id' en dan '_id' als fallback
        const id = hit._source['@id'] || hit._source['_id'];
        if (!id) {
          console.warn('Document zonder ID gevonden:', hit._source);
          return;
        }
        
        // Zorg ervoor dat het document altijd een '@id' veld heeft voor interne verwerking
        if (!hit._source['@id']) {
          hit._source['@id'] = id;
        }

        if (hitsMap.has(id)) {
          // Merge the sources if we already have this ID
          const existingHit = hitsMap.get(id)!;
          if (!existingHit._source) {
            return;
          }

          const mergedSource: ElasticNodeModel = {
            ...existingHit._source,
            ...hit._source,
            // Keep track of all endpoints this record came from
            endpointId: Array.isArray((existingHit._source as any).endpointId)
              ? [
                  ...(existingHit._source as any).endpointId,
                  searchResponse.endpointId,
                ]
              : [
                  (existingHit._source as any).endpointId,
                  searchResponse.endpointId,
                ],
          };

          existingHit._source = mergedSource;
          // Use the highest score if available
          existingHit._score = Math.max(
            existingHit._score ?? 0,
            hit._score ?? 0,
          );
        } else {
          // New ID, just add it to the map
          hitsMap.set(id, hit);
        }
      });
    });

    // Convert map back to array
    return Array.from(hitsMap.values());
  }
}
