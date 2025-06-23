import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { skip } from 'rxjs';
import { Settings } from '../config/settings';
import { FilterModel } from '../models/filters/filter.model';
import { SuraResponse } from '../models/sura-response.model';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { DetailsService } from './details.service';
import { EndpointService } from './endpoint.service';
import { FilterService } from './search/filter.service';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  ignoreQueryParamChange = false;

  /**
   * Ensure the ignoreQueryParamChange flag is always reset after navigation.
   * This prevents stuck state if navigation is triggered by the user (routerLink).
   */
  constructor(
    private details: DetailsService,
    private filters: FilterService,
    private router: Router,
    private data: DataService,
    private endpoints: EndpointService,
    private api: ApiService,
  ) {
    this._initUpdateUrlOnFilterChange();
    this._initUpdateUrlOnEndpointChange();
    // Always reset ignoreQueryParamChange after navigation
    this.router.events.subscribe((event) => {
      if (event.constructor.name === 'NavigationStart') {
        if (this.ignoreQueryParamChange) {
          console.log('[UrlService] Resetting ignoreQueryParamChange=false on NavigationStart');
        }
        this.ignoreQueryParamChange = false;
      }
    });
  }

  private _initUpdateUrlOnFilterChange() {
    // Skip URL change for initial (empty) enabled filters, as well as filters loaded from URL
    this.filters.enabled.pipe(skip(2)).subscribe((enabledFilters) => {
      void this.updateUrlToReflectFilters(enabledFilters);
    });
  }

  private _initUpdateUrlOnEndpointChange() {
    this.endpoints.enabledIds
      .pipe(skip(1))
      .subscribe((endpointIds: string[]) => {
        void this._updateUrlToReflectEndpoints(endpointIds);
      });
  }

  private async _updateUrlToReflectEndpoints(endpointIds: string[]) {
    let endpointsParam: string | null = null;
    if (endpointIds && endpointIds.length > 0) {
      endpointsParam = endpointIds.join(',');
    }

    setTimeout(async () => {
      await this._updateUrlParam(Settings.url.params.endpoints, endpointsParam);
    });
  }

  async updateUrlToReflectFilters(filters: FilterModel[]) {
    if ((this.filters as any).setFromUrlParam) {
      (this.filters as any).setFromUrlParam = false;
      console.log('[UrlService] Skipping URL update because filters set from URL param');
      return;
    }
    const enabledFiltersParam = JSON.stringify(
      this.data.convertFiltersToIdsFormat(filters),
    );

    console.log(
      'Updating URL to reflect filters',
      enabledFiltersParam.slice(0, 100) + '...',
      filters,
    );

    void this._updateUrlParam(Settings.url.params.filters, enabledFiltersParam);
  }

  private async _updateUrlParam(key: string, param: string | null) {
    // Only set ignoreQueryParamChange for programmatic navigation, NOT for user navigation.
    this.ignoreQueryParamChange = true;
    console.log('[UrlService] Setting ignoreQueryParamChange=true before programmatic navigation');
    await this.router.navigate([], {
      queryParams: { [key]: param },
      queryParamsHandling: 'merge',
    });
    // Instead of resetting here, always reset on NavigationStart (before route activation)
    // so that ignoreQueryParamChange is never true during route/component init.
    // The router.events subscription in the constructor handles this.
  }

  addParamToUrl(url: string, paramName: string, paramValue: string): string {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set(paramName, paramValue);
      return urlObj.toString();
    } catch (error) {
      console.error('Invalid URL:', error);
      return url;
    }
  }

  async processUrls(urls: string[], linkToDetails = true): Promise<string[]> {
    const promises = urls.map(
      async (url) => await this.processUrl(url, linkToDetails),
    );
    const processedUrls: string[] = await Promise.all(promises);
    return processedUrls;
  }

  async processUrl(url: string, linkToDetails = true): Promise<string> {
    const urlProcessor = Settings.endpoints.urlProcessor;
    if (urlProcessor && url.includes(urlProcessor.matchSubstring)) {
      const processedResponse = await this.api.postData<SuraResponse>(
        urlProcessor.url + `?url=${url}`,
        null,
      );
      return processedResponse.url;
      // url = this.addParamToUrl(
      //   url,
      //   'token',
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTE3MDY0NjQsIm5iZiI6MTcxMTcwNjQ2NCwiZXhwIjoxNzQzMjQyNDY0fQ.ViNS0wWml0EwkF0z75G4cNZxKupYQMLiVB_PQ5kNQm8',
      // );
      // return url;
    }

    if (linkToDetails) {
      return this.details.getLinkFromUrl(url);
    }

    url = url.replaceAll(
      'hetutrechtsarchief.nl/id',
      'hetutrechtsarchief.nl/collectie',
    );
    return url;
  }
}
