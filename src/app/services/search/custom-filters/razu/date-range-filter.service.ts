import { Injectable } from '@angular/core';
import type { estypes } from '@elastic/elasticsearch';
import { ElasticAggregationModel } from '../../../../models/elastic/elastic-aggregation.model';
import { ElasticEndpointSearchResponse } from '../../../../models/elastic/elastic-endpoint-search-response.type';
import { ElasticShouldQueries } from '../../../../models/elastic/elastic-should-queries.type';
import { FilterModel } from '../../../../models/filters/filter.model';
import { DataService } from '../../../data.service';
import { ElasticService } from '../../elastic.service';
import { FilterService } from '../../filter.service';
import { SearchService } from '../../search.service';
import { CustomFilterService } from '../custom-filter.service';

@Injectable({
  providedIn: 'root',
})
export class DateRangeFilterService extends CustomFilterService {
  fromDate?: string;
  toDate?: string;
  fieldId?: string;

  constructor(
    private data: DataService,
    private elastic: ElasticService,
    private filters: FilterService,
    private search: SearchService,
  ) {
    super();
  }

  setFieldId(fieldId: string) {
    this.fieldId = fieldId;
  }

  private _getElasticQueryForMinMaxDates(fieldId: string) {
    // TODO: Construct this query taking into account (other) custom enabled filters as well
    const enabledStandardFilters: FilterModel[] =
      this.filters.enabled.value.filter(
        (f) => !this.filters.isCustomFilter(f.filterId ?? ''),
      );
    const elasticField: string = this.data.replacePeriodsWithSpaces(fieldId);

    const query: estypes.SearchRequest = this.elastic.getNodeSearchQuery(
      this.search.queryStr ?? '',
      enabledStandardFilters,
      0,
      0,
    );
    query.size = 0;
    query['_source'] = '';
    query.aggs = {
      earliest_date: {
        terms: {
          field: elasticField,
          size: 1,
          order: { _key: 'asc' },
        },
      },
      latest_date: {
        terms: {
          field: elasticField,
          size: 1,
          order: { _key: 'desc' },
        },
      },
    };
    return query;
  }

  async getEarliestLatestDates(): Promise<{
    earliest?: string;
    latest?: string;
  }> {
    if (!this.fieldId) {
      console.warn('No fieldId set for date range filter');
      return { earliest: undefined, latest: undefined };
    }
    const query: estypes.SearchRequest = this._getElasticQueryForMinMaxDates(
      this.fieldId,
    );
    const responses: ElasticEndpointSearchResponse<any>[] =
      await this.elastic.searchEndpoints<any>(query);

    let earliestDateAcrossEndpoints: string | undefined;
    let latestDateAcrossEndpoints: string | undefined;
    responses.forEach((res) => {
      const earliestDateAgg = res.aggregations?.[
        'earliest_date'
      ] as ElasticAggregationModel;
      const latestDateAgg = res.aggregations?.[
        'latest_date'
      ] as ElasticAggregationModel;

      const earliestDateStr = earliestDateAgg?.buckets?.[0]?.key;
      const isEarlierThanEarliestDate =
        earliestDateAcrossEndpoints === undefined ||
        earliestDateStr < earliestDateAcrossEndpoints;
      if (isEarlierThanEarliestDate) {
        earliestDateAcrossEndpoints = earliestDateStr;
      }

      const latestDateStr = latestDateAgg?.buckets?.[0]?.key;
      const isLaterThanLatestDate =
        latestDateAcrossEndpoints === undefined ||
        latestDateStr > latestDateAcrossEndpoints;
      if (isLaterThanLatestDate) {
        latestDateAcrossEndpoints = latestDateStr;
      }
    });
    return {
      earliest: earliestDateAcrossEndpoints,
      latest: latestDateAcrossEndpoints,
    };
  }

  override getElasticQueries(): ElasticShouldQueries[] {
    if (!this.fieldId) {
      console.warn('No fieldId set for date range filter');
      return [];
    }

    // TODO: Refactor
    const dateRangeMustQueries: ElasticShouldQueries[] = [];
    const fromVal =
      this.fromDate && this.fromDate.trim().length > 0 ? this.fromDate : '*';
    const toVal =
      this.toDate && this.toDate.trim().length > 0 ? this.toDate : '*';
    const fieldWithDots = this.fieldId as string;
    const fieldWithSpaces = this.data.replacePeriodsWithSpaces(fieldWithDots);
    const escapedSpacesField = fieldWithSpaces.replace(/ /g, '\\ ');
    const qDots = {
      query_string: {
        query: `${fieldWithDots}:[${fromVal} TO ${toVal}]`,
      },
    };
    const qSpaces = {
      query_string: {
        query: `${escapedSpacesField}:[${fromVal} TO ${toVal}]`,
      },
    };
    dateRangeMustQueries.push({ bool: { should: [qDots, qSpaces] } });
    return dateRangeMustQueries;
  }
}
