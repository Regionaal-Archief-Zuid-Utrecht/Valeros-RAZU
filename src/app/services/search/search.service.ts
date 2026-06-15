import { Injectable } from '@angular/core';

import { ActivatedRoute, Params, Router } from '@angular/router';
import type { estypes } from '@elastic/elasticsearch';
import { BehaviorSubject, filter, skip, take } from 'rxjs';
import { Settings } from '../../config/settings';
import { ElasticEndpointSearchResponse } from '../../models/elastic/elastic-endpoint-search-response.type';
import { ElasticNodeModel } from '../../models/elastic/elastic-node.model';
import { SearchResultsModel } from '../../models/elastic/search-results.model';
import { NodeModel } from '../../models/node.model';
import { SortOptionModel } from '../../models/settings/sort-option.model';
import { ViewModeSetting } from '../../models/settings/view-mode-setting.enum';
import { DataService } from '../data.service';
import { DetailsService } from '../details.service';
import { EndpointService } from '../endpoint.service';
import { NodeService } from '../node/node.service';
import { SettingsService } from '../settings.service';
import { SortService } from '../sort.service';
import { ScrollService } from '../ui/scroll.service';
import { UiService } from '../ui/ui.service';
import { UrlService } from '../url.service';
import { ElasticService } from './elastic.service';
import { FilterService } from './filter.service';
import { SearchHitsService } from './search-hits.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  queryStr: string | undefined;

  results: BehaviorSubject<SearchResultsModel> =
    new BehaviorSubject<SearchResultsModel>({});
  currentPage: number = 1;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  numberOfHits: number = 0;
  numberOfHitsIsCappedByElastic: boolean = false;

  private _searchQueryId = 0;
  private _isInitialized = false;

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
    private scroll: ScrollService,
  ) {
    this.initSearchOnUrlChange();
    this.initSearchOnFilterChange();
    this.initSearchOnEndpointChange();
    this.initSearchOnSortChange();
  }

  private async _resetToFirstPage() {
    this.currentPage = 1;
    this.url.ignoreQueryParamChange = true;
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [Settings.url.params.page]: 1 },
      queryParamsHandling: 'merge',
    });
    this.url.ignoreQueryParamChange = false;
  }

  private async _updateResultsFromSearchResponses(
    responses: ElasticEndpointSearchResponse<ElasticNodeModel>[],
  ) {
    const hits: estypes.SearchHit<ElasticNodeModel>[] =
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

    this.results.next({
      nodes: enrichedNodes,
    });
  }

  initSearchOnFilterChange() {
    this.filters.searchTrigger.pipe(skip(1)).subscribe(async (s) => {
      if (s.clearFilters) {
        console.log('-- Searching without filters to retrieve options');
      } else {
        console.log('-- Searching with re-applied filters');
      }
      await this._resetToFirstPage();
      void this.execute(true, s.clearFilters);
    });
  }

  initSearchOnEndpointChange() {
    this.endpoints.enabledIds.pipe(skip(1)).subscribe(async (_) => {
      console.log('Searching because of updated endpoints...');
      await this._resetToFirstPage();
      void this.execute(true);
    });
  }

  initSearchOnSortChange() {
    this.sort.current
      .pipe(skip(1))
      .subscribe(async (sortOption: SortOptionModel | undefined) => {
        console.log('Searching because of sort update...', sortOption);
        await this._resetToFirstPage();
        void this.execute(true);
      });
  }

  private _searchOnUrlChange(queryParams: Params) {
    if (this.url.ignoreQueryParamChange) {
      console.log('Ignoring query param change');
      return;
    }

    const queryStr = queryParams[Settings.url.params.search];
    const pageParam = queryParams[Settings.url.params.page];
    const newPage = pageParam ? parseInt(pageParam, 10) : 1;

    if (!this._isInitialized) {
      this._isInitialized = true;
      this.queryStr = queryStr;
      this.currentPage = newPage;
      console.log(`Initial load with query: "${queryStr}", page: ${newPage}`);
      void this.execute(true);
      return;
    }

    const queryStrChanged = queryStr !== this.queryStr;
    const pageChanged = newPage !== this.currentPage;

    if (queryStrChanged) {
      this.queryStr = queryStr;
      console.log('Searching because of query string update');
      this._resetToFirstPage().then(() => {
        void this.execute(true);
      });
      return;
    }

    if (pageChanged) {
      this.currentPage = newPage;
      console.log('Searching because of page change to:', newPage);
      void this.execute(false, false);
      this.scroll.scrollToTop();
      return;
    }
  }

  initSearchOnUrlChange() {
    this.route.queryParams
      .pipe(
        filter((params) => Object.keys(params).length > 0),
        take(1),
      )
      .subscribe((queryParams) => {
        const filtersParam: string | undefined =
          queryParams[Settings.url.params.filters];
        if (filtersParam) {
          this.filters.onUpdateFromURLParam(filtersParam);
        }

        setTimeout(() => this._searchOnUrlChange(queryParams));
      });

    this.route.queryParams.pipe(skip(1)).subscribe((queryParams: Params) => {
      setTimeout(() => {
        this._searchOnUrlChange(queryParams);
      });
    });
  }

  clearResults() {
    this.results.next({});
    this.currentPage = 1;
    this.numberOfHits = 0;
    this.numberOfHitsIsCappedByElastic = false;
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
        return total + hitTotal.value;
      }
      return total;
    }, 0);
    return { total, isCapped };
  }

  async execute(clearResults = false, clearFilters = true) {
    // if (this.queryStr === '') {
    //   return;
    // }

    // this.ui.collapseAllAccordions();

    this._searchQueryId++;

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
      const offset =
        (this.currentPage - 1) * Settings.search.resultsPerPagePerEndpoint;
      const displayResponses = await this.elastic.searchNodes(
        this.queryStr ?? '',
        offset,
        Settings.search.resultsPerPagePerEndpoint,
        this.filters.enabled.value,
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

      // Update filter options
      await this.filters.updateFilterOptionValues(this.queryStr ?? '');
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      this.isLoading.next(false);
    }
  }
}
