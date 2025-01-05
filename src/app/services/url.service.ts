import { Injectable } from '@angular/core';
import { DetailsService } from './details.service';
import { FilterModel } from '../models/filter.model';
import { Config } from '../config/config';
import { FilterService } from './search/filter.service';
import { Router } from '@angular/router';
import { skip } from 'rxjs';
import { DataService } from './data.service';
import { EndpointService } from './endpoint.service';
import { ApiService } from './api.service';
import { SuraResponse } from '../models/sura-response.model';
import { Settings } from '../config/settings';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  ignoreQueryParamChange = false;

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

    this.filters.onlyShowResultsWithImages
      .pipe(skip(1))
      .subscribe(async (onlyWithImages) => {
        void this._updateUrlParam(
          Config.onlyWithImages,
          JSON.stringify(onlyWithImages),
        );
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
      await this._updateUrlParam(Config.endpointsParam, endpointsParam);
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

    void this._updateUrlParam(Config.filtersParam, enabledFiltersParam);
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
    if (url.includes('opslag.razu.nl')) {
      const suraUrl = await this.api.postData<SuraResponse>(
        Settings.sura.url + `?url=${url}`,
        null,
      );
      return suraUrl.url;
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
