import { Injectable } from '@angular/core';
import { ElasticNodeModel } from '../models/elastic/elastic-node.model';
import { FilterOptionsIdsModel } from '../models/filter-option.model';
import { FilterModel, FilterType } from '../models/filter.model';
import { SparqlNodeParentModel } from '../models/sparql/sparql-node-parent.model';
import { ThingWithLabelModel } from '../models/thing-with-label.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  replaceElasticNodePredSpacesWithPeriods(node: ElasticNodeModel): void {
    Object.entries(node)
      .filter(([pred]) => pred.includes(' ') || pred.includes('.'))
      .forEach(([pred, obj]) => {
        // First normalize any spaces to dots
        let normalizedPred = pred.replaceAll(' ', '.');
        // Then clean up any potential double dots that might occur
        normalizedPred = normalizedPred.replaceAll('..', '.');

        // Only update if we actually changed something
        if (normalizedPred !== pred) {
          node[normalizedPred] = obj;
          delete node[pred];
        }
      });
  }

  replacePeriodsWithSpaces(s: string): string {
    // First ensure we don't have any double dots
    let normalized = s.replaceAll('..', '.');
    // Then convert to spaces
    return normalized.replaceAll('.', ' ');
  }

  getOrderedParentsFromSparqlResults(
    nodeId: string,
    sparqlParentsData: SparqlNodeParentModel[],
  ): ThingWithLabelModel[] {
    const nodeParents: ThingWithLabelModel[] = [];
    let currentNodeId: string | null = nodeId;

    sparqlParentsData = sparqlParentsData.sort((a, b) => {
      if (a.parent && !b.parent) return -1;
      if (!a.parent && b.parent) return 1;
      return 0;
    });

    while (currentNodeId !== null) {
      const sparqlNodeParentData = sparqlParentsData.find(
        (d) => d.id === currentNodeId,
      );
      if (sparqlNodeParentData) {
        const nodeInfo: ThingWithLabelModel = {
          '@id': sparqlNodeParentData.id,
          label: sparqlNodeParentData.title,
        };
        nodeParents.push(nodeInfo);
        currentNodeId = sparqlNodeParentData.parent;
      } else {
        currentNodeId = null;
      }
    }

    return nodeParents.reverse().slice(0, -1);
  }

  convertFiltersFromIdsFormat(
    filterIdsFormat: FilterOptionsIdsModel,
  ): FilterModel[] {
    const filters: FilterModel[] = [];

    for (const [filterId, { type, valueIds, fieldIds }] of Object.entries(
      filterIdsFormat,
    )) {
      if (type === FilterType.Value && valueIds && valueIds.length > 0) {
        valueIds.forEach((valueId) => {
          filters.push({ filterId, valueId, type });
        });
      }

      if (type === FilterType.Field && fieldIds && fieldIds.length > 0) {
        fieldIds.forEach((fieldId) => {
          filters.push({ filterId, fieldId, type });
        });
      }

      if (
        type === FilterType.FieldAndValue &&
        valueIds &&
        valueIds.length > 0 &&
        fieldIds &&
        fieldIds.length > 0
      ) {
        fieldIds.forEach((fieldId) => {
          valueIds.forEach((valueId) => {
            filters.push({ filterId, fieldId, valueId, type });
          });
        });
      }
    }

    return filters;
  }

  convertFiltersToIdsFormat(filters: FilterModel[]): FilterOptionsIdsModel {
    const enabledFiltersIdsFormat: FilterOptionsIdsModel = {};

    for (const { filterId, fieldId, valueId } of filters) {
      if (!filterId || !fieldId || !valueId) {
        console.warn('Filter is missing ID(s)');
        continue;
      }

      if (!enabledFiltersIdsFormat[filterId]) {
        // TODO: Support other filter types as well (only field or only value)
        enabledFiltersIdsFormat[filterId] = {
          type: FilterType.FieldAndValue,
          fieldIds: [],
          valueIds: [],
        };
      }

      const filterData = enabledFiltersIdsFormat[filterId];
      if (!filterData.fieldIds.includes(fieldId)) {
        filterData.fieldIds.push(fieldId);
      }

      if (!filterData.valueIds.includes(valueId)) {
        filterData.valueIds.push(valueId);
      }
    }

    return enabledFiltersIdsFormat;
  }

  hasOverlap(arr1: any[], arr2: any[]): boolean {
    return arr1.some((o) => arr2.includes(o));
  }
}
