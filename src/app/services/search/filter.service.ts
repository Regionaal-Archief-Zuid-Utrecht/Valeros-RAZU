import { EventEmitter, Injectable } from '@angular/core';
import { SparqlService } from '../sparql.service';
import { Router } from '@angular/router';
import type { estypes } from '@elastic/elasticsearch';
import { BehaviorSubject } from 'rxjs';
import { Settings } from '../../config/settings';
import {
  DocCountModel,
  ElasticAggregationModel,
} from '../../models/elastic/elastic-aggregation.model';
import { FieldDocCountsModel } from '../../models/elastic/field-doc-counts.model';
import {
  FilterOptionModel,
  FilterOptionValueModel,
  FilterOptionsIdsModel,
  FilterOptionsModel,
} from '../../models/filters/filter-option.model';
import { FilterModel, FilterType } from '../../models/filters/filter.model';
import { ClusterService } from '../cluster.service';
import { DataService } from '../data.service';
import { ElasticService } from './elastic.service';
import { SearchHitsService } from './search-hits.service';

interface SearchTriggerModel {
  clearFilters: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  public setFromUrlParam = false;
  // Set this to true to enable debug logs in updateFilterOptionValues
  private static DEBUG = false;
  searchTrigger: EventEmitter<SearchTriggerModel> =
    new EventEmitter<SearchTriggerModel>();

  prevEnabled: FilterModel[] = [];
  enabled: BehaviorSubject<FilterModel[]> = new BehaviorSubject<FilterModel[]>(
    [],
  );
  options: BehaviorSubject<FilterOptionsModel> =
    new BehaviorSubject<FilterOptionsModel>(Settings.filtering.filterOptions);

  private skipRestoreOnce = false;

  constructor(
    public elastic: ElasticService,
    public data: DataService,
    public clusters: ClusterService,
    public router: Router,
    public searchHitsService: SearchHitsService,
    public sparql: SparqlService,
  ) {
    this._initRestorePreviousFiltersOnOptionsChange();
  }

  private _getFieldDocCountsFromResponses(
    responses: estypes.SearchResponse<any>[],
  ): FieldDocCountsModel {
    const docCountsByFieldId: FieldDocCountsModel = {};

    for (const response of responses) {
      const aggregations = response.aggregations;
      if (!aggregations) {
        continue;
      }

      for (const [elasticFieldId, aggregationsAggregate] of Object.entries(
        aggregations,
      )) {
        const aggregationsData =
          aggregationsAggregate as ElasticAggregationModel;
        for (const docCount of aggregationsData.buckets) {
          const hitIds = docCount?.field_hits?.hits?.hits?.map((h) => h?._id);
          docCount.hitIds = hitIds ?? [];

          if (!(elasticFieldId in docCountsByFieldId)) {
            docCountsByFieldId[elasticFieldId] = [];
          }
          docCountsByFieldId[elasticFieldId].push(docCount);
        }
      }
    }
    return docCountsByFieldId;
  }

  private _initRestorePreviousFiltersOnOptionsChange() {
    this.options.subscribe((newOptions) => {
      if (this.skipRestoreOnce) {
        if (FilterService.DEBUG) {
          console.log('[FilterService] Skipping restore of previous filters due to navigation');
        }
        this.skipRestoreOnce = false;
        return;
      }
      this._restorePreviousFilters();
    });
  }

  private _filterExistsInOptions(filter: FilterModel): boolean {
    const options = this.options.value;
    const filterId = filter?.filterId;
    if (!filterId) {
      console.warn('No filter ID defined', filter);
      return false;
    }
    const isUnknownFilterType =
      filter.type !== FilterType.Field &&
      filter.type !== FilterType.Value &&
      filter.type !== FilterType.FieldAndValue;
    if (isUnknownFilterType) {
      if (FilterService.DEBUG) {
        console.warn(
          'Unknown filter type, enabled filter not checked against current options',
        );
      }
      return false;
    }

    let filterExistsInOptions = false;
    const fieldExistsInOptions = !!(
      filter.fieldId && options[filterId].fieldIds.includes(filter.fieldId)
    );
    const valueExistsInOptions = options[filterId].values.some(
      (a) => filter.valueId && a.ids.includes(filter.valueId),
    );

    const fieldFilterExistsInOptions =
      filter.type === FilterType.Field && fieldExistsInOptions;
    const valueFilterExistsInOptions =
      filter.type === FilterType.Value && valueExistsInOptions;
    const fieldAndValueFilterExistsInOptions =
      filter.type === FilterType.FieldAndValue &&
      fieldExistsInOptions &&
      valueExistsInOptions;
    if (
      fieldFilterExistsInOptions ||
      valueFilterExistsInOptions ||
      fieldAndValueFilterExistsInOptions
    ) {
      filterExistsInOptions = true;
    }

    return filterExistsInOptions;
  }

  private _restorePreviousFilters() {
    const restoredFilters = this.prevEnabled.filter((prevEnabledFilter) =>
      this._filterExistsInOptions(prevEnabledFilter),
    );

    const shouldUpdateEnabledFilters =
      JSON.stringify(restoredFilters) !== JSON.stringify(this.enabled.value);
    if (shouldUpdateEnabledFilters) {
      if (FilterService.DEBUG) {
        console.log(
          'Restoring previously applied filters and triggering new search with these filters:',
          restoredFilters,
          this.enabled.value,
        );
      }
      this.enabled.next(restoredFilters);
      this.searchTrigger.emit({ clearFilters: false });
    }
  }

  onUpdateFromURLParam(filtersParam: string) {
    this.setFromUrlParam = true;
    if (FilterService.DEBUG) {
      console.log(
        '[FilterService] Update filters based on URL param:',
        filtersParam.slice(0, 100),
        '...',
      );
    }
    const urlFilters: FilterOptionsIdsModel = JSON.parse(filtersParam);
    const filters: FilterModel[] =
      this.data.convertFiltersFromIdsFormat(urlFilters);

    this.skipRestoreOnce = true;
    this.enabled.next(filters);

    if (FilterService.DEBUG) {
      console.log('[FilterService] Emitting searchTrigger after URL param update', filters);
    }
    this.searchTrigger.emit({ clearFilters: false });
  }

  // new helper function
  private _getFieldDocCountsFromNodes(
    nodes: any[],
    filterOptions: FilterOptionsModel,
  ): FieldDocCountsModel {
    const docCountsByFieldId: FieldDocCountsModel = {};

    for (const node of nodes) {
      for (const [field, values] of Object.entries(node)) {
        const filterOption = Object.values(filterOptions).find((option) =>
          option.fieldIds.includes(field),
        );

        if (filterOption) {
          if (!docCountsByFieldId[field]) {
            docCountsByFieldId[field] = [];
          }

          for (const valueObj of values as { value: string }[]) {
            docCountsByFieldId[field].push({
              key: valueObj.value,
              hitIds: [node['@id']?.[0]?.value || ''], // Extract hit IDs from `@id` field
            });
          }
        }
      }
    }

    return docCountsByFieldId;
  }

  // Alternative without elastic requests (get directly from node results)
  // async updateFilterOptionValues(query: string, nodes: any[]) {
  //   const filterOptions = this.options.value;
  //   console.log('NODES', nodes);
  //   // Extract filter options directly from the provided `nodes` array
  //   const fieldDocCounts: FieldDocCountsModel = this._getFieldDocCountsFromNodes(
  //     nodes,
  //     filterOptions
  //   );

  //   for (const [_, filter] of Object.entries(filterOptions)) {
  //     const filterValuesMap = new Map<string, string[]>();

  //     filter.fieldIds.forEach((fieldId) => {
  //       const docCountsForField = fieldDocCounts[fieldId] ?? [];
  //       const docCountsToShow = docCountsForField.filter((d) => {
  //         const valueId = d.key;
  //         const shouldHideValueId = filter.hideValueIds?.includes(valueId);
  //         if (!filter.showOnlyValueIds) {
  //           return !shouldHideValueId;
  //         }
  //         return filter.showOnlyValueIds.includes(valueId);
  //       });

  //       docCountsToShow.forEach((d) => {
  //         const id = d.key;
  //         const hitIds = d.hitIds;

  //         if (filterValuesMap.has(id)) {
  //           filterValuesMap.set(id, filterValuesMap.get(id)!.concat(hitIds));
  //         } else {
  //           filterValuesMap.set(id, hitIds);
  //         }
  //       });
  //     });

  //     const filterValues: FilterOptionValueModel[] = Array.from(
  //       filterValuesMap
  //     ).map(([id, filterHitIds]) => ({
  //       ids: [id],
  //       filterHitIds: filterHitIds,
  //     }));

  //     const clusteredFilterValues =
  //       this.clusters.clusterFilterOptionValues(filterValues);
  //     filter.values = clusteredFilterValues;
  //   }

  //   this.options.next(filterOptions);
  // }

  async updateFilterOptionValues(query: string) {
    if (FilterService.DEBUG) {
      console.log('[FilterService] updateFilterOptionValues called with query:', query);
      console.log('[FilterService] all filter options before update:', JSON.parse(JSON.stringify(this.options.value)));
    }

    const filterOptions = { ...this.options.value };
    const hits = this.searchHitsService.getHits ? this.searchHitsService.getHits() : [];

    for (const filterId in filterOptions) {
      const filter = filterOptions[filterId];
      const valueHitMap: Map<string, { hitIds: string[] }> = new Map();
      const hideValueIds = filter.hideValueIds || [];
      for (const hit of hits) {
        for (const fieldId of filter.fieldIds) {
          let value = hit._source ? hit._source[fieldId] : undefined;
          if (Array.isArray(value)) {
            (value as string[]).forEach((v: string) => {
              if (v && !hideValueIds.includes(v)) {
                if (!valueHitMap.has(v)) {
                  valueHitMap.set(v, { hitIds: [] });
                }
                const entry = valueHitMap.get(v);
                if (entry && hit._id && !entry.hitIds.includes(hit._id)) {
                  entry.hitIds.push(hit._id);
                }
              }
            });
          } else if (typeof value === 'string' && value && !hideValueIds.includes(value)) {
            if (!valueHitMap.has(value)) {
              valueHitMap.set(value, { hitIds: [] });
            }
            const entry = valueHitMap.get(value);
            if (entry && hit._id && !entry.hitIds.includes(hit._id)) {
              entry.hitIds.push(hit._id);
            }
          }
        }
      }
      const valueIds = Array.from(valueHitMap.keys());
      let labelsMap: Map<string, string> = new Map();
      if (valueIds.length > 0) {
        try {
          const labelResults = await this.sparql.getLabels(valueIds);
          labelsMap = new Map(labelResults.map((l: { '@id': string, label: string }) => [l['@id'], l.label]));
        } catch (e) {
          console.warn('[FilterService] Failed to fetch labels via SPARQL:', e);
        }
      }
      filter.values = Array.from(valueHitMap.entries()).map(([v, { hitIds }]) => ({
        ids: [v],
        label: labelsMap.get(v) || v,
        filterHitIds: hitIds,
      }));
    }

    if (FilterService.DEBUG) {
      console.log('[FilterService] filterOptions after update:', JSON.parse(JSON.stringify(filterOptions)));
    }
    this.options.next(filterOptions);
  }

  // ... (rest of the code remains the same)
  toggleMultiple(filters: FilterModel[]) {
    const updatedEnabledFilters = this.enabled.value;
    for (const filter of filters) {
      const existingFilterIdx = updatedEnabledFilters.findIndex(
        (f) =>
          f.valueId === filter.valueId &&
          f.fieldId === filter.fieldId &&
          f.type === filter.type,
      );
      const filterAlreadyExists = existingFilterIdx > -1;
      if (filterAlreadyExists) {
        updatedEnabledFilters.splice(existingFilterIdx, 1);
      } else {
        updatedEnabledFilters.push(filter);
      }
    }

    if (FilterService.DEBUG) {
      console.log(
        'Toggled filter, triggering new search (where filters will be temporarily cleared)',
      );
    }

    this.enabled.next(updatedEnabledFilters);
    this.searchTrigger.emit({ clearFilters: true });
  }

  toggle(filter: FilterModel) {
    this.toggleMultiple([filter]);
  }

  has(valueIds: string[], type: FilterType): boolean {
    // TODO: Reduce calls to this function if needed for performance reasons
    // TODO: Make sure this works with other filter types (e.g. filtering on only Field or only Value)
    return (
      this.enabled.value.find(
        (f) => f.valueId && valueIds.includes(f.valueId) && f.type === type,
      ) !== undefined
    );
  }

  getOptionById(filterId: string): FilterOptionModel {
    return this.options.value?.[filterId];
  }

  private _getOptionValueIds(filterId: string): string[] {


    // TODO: Reduce number of calls if necessary for performance reasons
    const option = this.getOptionById(filterId);
    const valueIds = option?.values?.flatMap((v) => v.ids) || [];

    return valueIds;
  }

  shouldShow(filterId: string): boolean {


    const optionValueIds = this._getOptionValueIds(filterId);
    const hasOptionsToShow = optionValueIds.length > 0;

    const option: FilterOptionModel = this.getOptionById(filterId);

    if (!option.showOnlyForSelectedFilters) {

      return hasOptionsToShow;
    }

    const showOnlyForSelectedFilters: FilterOptionsIdsModel =
      option.showOnlyForSelectedFilters;

    const shouldShowBasedOnFilters = this._shouldShowBasedOnFilters(showOnlyForSelectedFilters);
    const result = hasOptionsToShow && shouldShowBasedOnFilters;

    return result;
  }

  private _shouldShowBasedOnFilters(
    showOnlyForSelectedFilters: FilterOptionsIdsModel,
  ): boolean {

    const enabledFilters: FilterOptionsIdsModel =
      this.data.convertFiltersToIdsFormat(this.enabled.value);

    for (const enabledFilter of Object.values(enabledFilters)) {
      for (const showOnlyForSelectedFilter of Object.values(
        showOnlyForSelectedFilters,
      )) {
        const hasFieldIdOverlap = this.data.hasOverlap(
          enabledFilter.fieldIds,
          showOnlyForSelectedFilter.fieldIds,
        );
        const hasValueIdOverlap = this.data.hasOverlap(
          enabledFilter.valueIds,
          showOnlyForSelectedFilter.valueIds,
        );

        switch (showOnlyForSelectedFilter.type) {
          case FilterType.Field:
            if (hasFieldIdOverlap) return true;
            break;
          case FilterType.Value:
            if (hasValueIdOverlap) return true;
            break;
          case FilterType.FieldAndValue:
            if (hasFieldIdOverlap && hasValueIdOverlap) return true;
            break;
          default:
            break;
        }
      }
    }
    return false;
  }

  getEnabledFiltersCountStr(count: number): string | undefined {
    if (count >= 1) {
      return count.toString();
    }
    //
    // if (count > 1) {
    //   return `${count} filters`;
    // }
    // if (count === 1) {
    //   return `${count} filter`;
    // }
    return undefined;
  }

  getOptionEnabledFiltersCount(
    filterId: string,
    type: FilterType,
  ): string | undefined {
    const optionValues: FilterOptionValueModel[] =
      this.getOptionById(filterId).values;
    const count = optionValues.reduce(
      (acc, optionValue) => acc + (this.has(optionValue.ids, type) ? 1 : 0),
      0,
    );

    return this.getEnabledFiltersCountStr(count);
  }

  clearEnabled() {


    this.prevEnabled = this.enabled.value;
    if (FilterService.DEBUG) {
      console.log(
        'Clearing enabled filters, saved current filters',
        this.prevEnabled,
      );
    }
    this.enabled.next([]);
  }
}
