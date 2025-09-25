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
  skipHistoryTracking = false;

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
    const enabledFiltersParam = JSON.stringify(
      this.data.convertFiltersToIdsFormat(filters),
    );

    console.log(
      'Updating URL to reflect filters',
      enabledFiltersParam.slice(0, 100) + '...',
      filters,
    );

    this.skipHistoryTracking = true;
    void this._updateUrlParam(Settings.url.params.filters, enabledFiltersParam);
    this.skipHistoryTracking = false;
  }

  private async _updateUrlParam(key: string, param: string | null) {
    this.ignoreQueryParamChange = true;
    await this.router.navigate([], {
      queryParams: { [key]: param },
      queryParamsHandling: 'merge',
    });
    this.ignoreQueryParamChange = false;
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
    if (urlProcessor && url && url.includes(urlProcessor.matchSubstring)) {
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

  getPageNumberFromUrl(): number | null {
    const removeQueryParams = (url: string) => {
      const queryParamIndex = url.indexOf('?');
      if (queryParamIndex !== -1) {
        return url.substring(0, queryParamIndex);
      }
      return url;
    };

    let url = removeQueryParams(this.router.url);

    // Double encoded hashtag (%2523): Once by Angular router, once by encodeURIComponent (see Details service)
    const doubleEncodedHashtag = '%2523';
    const urlSplitByHashtag = url.split(doubleEncodedHashtag);
    const urlHasHashtag = urlSplitByHashtag.length > 1;
    if (urlHasHashtag) {
      const pageStr: string = urlSplitByHashtag[1];
      const pageNum = Number(pageStr);
      return !isNaN(pageNum) ? pageNum : null;
    }
    return null;
  }
}
