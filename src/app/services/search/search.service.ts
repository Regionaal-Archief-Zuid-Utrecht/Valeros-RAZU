import { Injectable } from '@angular/core';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { BehaviorSubject, skip, take } from 'rxjs';
import { Config } from '../../config/config';
import { Settings } from '../../config/settings';
import { ElasticEndpointSearchResponse } from '../../models/elastic/elastic-endpoint-search-response.type';
import { ElasticNodeModel } from '../../models/elastic/elastic-node.model';
import { SearchResultsModel } from '../../models/elastic/search-results.model';
import { NodeModel } from '../../models/node.model';
import { SortOptionModel } from '../../models/settings/sort-option.model';
import { ViewModeSetting } from '../../models/settings/view-mode-setting.enum';
import { DataService } from '../data.service';
import { DetailsService } from '../details.service';
import { ElasticService } from '../elastic.service';
import { EndpointService } from '../endpoint.service';
import { NodeService } from '../node/node.service';
import { SettingsService } from '../settings.service';
import { SortService } from '../sort.service';
import { UiService } from '../ui.service';
import { UrlService } from '../url.service';
import { FilterService } from './filter.service';
import { SearchHitsService } from './search-hits.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  queryStr: string = '';

  results: BehaviorSubject<SearchResultsModel> =
    new BehaviorSubject<SearchResultsModel>({});
  page: number = 0;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  numberOfHits: number = 0;
  numberOfHitsIsCappedByElastic: boolean = false;

  hasDoneInitialSearch: boolean = false;
  hasMoreResultsToLoad = true;

  private _searchQueryId = 0;

  constructor(
    private url: UrlService,
    private elastic: ElasticService,
    private hits: SearchHitsService,
    private nodes: NodeService,
    private filters: FilterService,
    private data: DataService,
    private endpoints: EndpointService,
    private route: ActivatedRoute,
    private details: DetailsService,
    private sort: SortService,
    private router: Router,
    private ui: UiService,
    private settings: SettingsService,
  ) {
    this.initSearchOnUrlChange();
    this.initSearchOnFilterChange();
    this.initSearchOnEndpointChange();
    this.initSearchOnSortChange();
  }

  private _mergeNodesById(
    nodes: NodeModel[],
    otherNodes: NodeModel[],
  ): NodeModel[] {
    const nodesMap = new Map<string, any>();
    nodes.forEach((node) => {
      nodesMap.set(node['@id'][0].value, node);
    });

    otherNodes.forEach((otherNode) => {
      const id = otherNode['@id'][0].value;
      if (nodesMap.has(id)) {
        Object.assign(nodesMap.get(id), otherNode);
      } else {
        nodes.push(otherNode);
      }
    });
    return nodes;
  }

  private async _updateResultsFromSearchResponses(
    responses: ElasticEndpointSearchResponse<ElasticNodeModel>[],
  ) {
    const hits: SearchHit<ElasticNodeModel>[] =
      this.hits.getFromSearchResponses(responses);

    const hitNodes: NodeModel[] = this.hits.parseToNodes(hits);
    // TODO: Run async, show initial hits in the meanwhile
    let enrichedNodes = hitNodes;
    const shouldEnrichWithIncomingRelations = this.settings.hasViewModeSetting(
      ViewModeSetting.EnrichWithIncomingRelations,
    );
    if (shouldEnrichWithIncomingRelations) {
      enrichedNodes = await this.nodes.enrichWithIncomingRelations(hitNodes);
    }

    if (!enrichedNodes || enrichedNodes.length === 0) {
      this.results.next({
        nodes: [],
      });
      return;
    }

    const mergedNodes = this._mergeNodesById(
      this.results.value.nodes ?? [],
      enrichedNodes,
    );

    this.results.next({
      nodes: mergedNodes,
    });
  }

  initSearchOnFilterChange() {
    this.filters.searchTrigger.subscribe((s) => {
      if (s.clearFilters) {
        console.log('-- Searching without filters to retrieve options');
      } else {
        console.log('-- Searching with re-applied filters');
      }
      void this.execute(true, s.clearFilters);
    });

    this.filters.onlyShowResultsWithImages.subscribe(() => {
      void this.execute(true, false);
    });
  }

  initSearchOnEndpointChange() {
    this.endpoints.enabledIds.pipe(skip(1)).subscribe((_) => {
      console.log('Searching because of updated endpoints...');
      void this.execute(true);
    });
  }

  initSearchOnSortChange() {
    this.sort.current
      .pipe(skip(1))
      .subscribe((sortOption: SortOptionModel | undefined) => {
        console.log('Searching because of sort update...', sortOption);
        void this.execute(true);
      });
  }

  private _searchOnUrlChange(queryParams: Params) {
    if (this.url.ignoreQueryParamChange) {
      console.log('Ignoring query param change');
      return;
    }

    const navigatedToDetails = this.details.isShowing();
    if (navigatedToDetails) {
      return;
    }

    const queryStr = queryParams[Config.searchParam];
    const queryStrChanged = queryStr !== this.queryStr;
    if (queryStrChanged) {
      this.queryStr = queryStr;
      console.log('Searching because of query string update');
      void this.execute(true);
      return;
    }
  }

  initSearchOnUrlChange() {
    this.route.queryParams.pipe(take(1)).subscribe((queryParams) => {
      console.log('INITIAL LOAD');
      const filtersParam: string | undefined = queryParams[Config.filtersParam];
      if (filtersParam) {
        this.filters.onUpdateFromURLParam(filtersParam);
      }

      const onlyWithImages: string | undefined =
        queryParams[Config.onlyWithImages];
      if (onlyWithImages) {
        this.filters.onlyShowResultsWithImages.next(JSON.parse(onlyWithImages));
      }

      setTimeout(() => this._searchOnUrlChange(queryParams));
    });

    this.route.queryParams.pipe(skip(1)).subscribe((queryParams: Params) => {
      this._searchOnUrlChange(queryParams);
    });
  }

  clearResults() {
    this.results.next({});
    this.page = 0;
    this.numberOfHits = 0;
    this.numberOfHitsIsCappedByElastic = false;
  }

  async checkHasMoreResultsToLoad() {
    const responses: ElasticEndpointSearchResponse<ElasticNodeModel>[] =
      await this.elastic.searchNodes(
        this.queryStr,
        this.page * Settings.search.resultsPerPagePerEndpoint,
        Settings.search.resultsPerPagePerEndpoint,
        this.filters.enabled.value,
        this.filters.onlyShowResultsWithImages.value,
      );
    const hits: SearchHit<ElasticNodeModel>[] =
      this.hits.getFromSearchResponses(responses);
    this.hasMoreResultsToLoad = hits && hits.length > 0;
  }

  private _calculateTotalHits(
    responses: ElasticEndpointSearchResponse<ElasticNodeModel>[],
  ): { total: number; isCapped: boolean } {
    let isCapped = false;
    const total = responses.reduce((total, response) => {
      const hitTotal = response.hits.total;
      if (typeof hitTotal === 'number') {
        return total + hitTotal;
      } else if (typeof hitTotal === 'object' && hitTotal !== null) {
        if (hitTotal.relation !== 'eq') {
          isCapped = true;
        }
        return (
          total +
          (hitTotal.relation === 'eq'
            ? hitTotal.value
            : Math.min(hitTotal.value, Settings.search.maxResultsForCounting))
        );
      }
      return total;
    }, 0);
    return { total, isCapped };
  }

  async execute(clearResults = false, clearFilters = true) {
    // if (this.queryStr === '') {
    //   return;
    // }

    this.ui.collapseAllAccordions();

    this._searchQueryId++;

    if (this.queryStr !== '') {
      this.hasDoneInitialSearch = true;
    }

    console.log(
      `Searching for: ${this.queryStr}. Clearing results: ${clearResults}, clearing filters: ${clearFilters}`,
    );
    if (clearResults) {
      this.clearResults();
    }
    if (clearFilters) {
      // Filters are cleared for "initial" search to see what filter options exist for this search term
      //  Afterward, previously existing filters are re-applied if they are still applicable for this search term
      this.filters.clearEnabled();
    }

    this.isLoading.next(true);
    try {
      const searchQueryIdOfRequest = this._searchQueryId;

      // Get paginated results for display
      const displayResponses = await this.elastic.searchNodes(
        this.queryStr,
        this.page * Settings.search.resultsPerPagePerEndpoint,
        Settings.search.resultsPerPagePerEndpoint,
        this.filters.enabled.value,
        this.filters.onlyShowResultsWithImages.value,
      );

      const { total, isCapped } = this._calculateTotalHits(displayResponses);
      this.numberOfHits = total;
      this.numberOfHitsIsCappedByElastic = isCapped;

      // TODO: Cancel requests if we know there's a new request already (note: cancelling promises not easily supported at the moment)
      const responsesAreOutdated =
        this._searchQueryId !== searchQueryIdOfRequest;
      if (responsesAreOutdated) {
        return;
      }

      // Update displayed results from the paginated response
      await this._updateResultsFromSearchResponses(displayResponses);

      // Increment page if we got results
      const displayHits = this.hits.getFromSearchResponses(displayResponses);
      if (displayHits && displayHits.length > 0) {
        this.page++;
      }

      // Update filter options
      if (clearFilters) {
        await this.filters.updateFilterOptionValues(this.queryStr);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      this.isLoading.next(false);

      void this.checkHasMoreResultsToLoad();
    }
  }
}
