import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Settings } from '../config/settings';
import { DetailsService } from './details.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  private history: string[] = [];

  constructor(
    private router: Router,
    private url: UrlService,
    private details: DetailsService,
  ) {}

  initHistoryTracking() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.handlePageParameterOnNavigation();

        if (this.isLastUrlSameAsUrl(event.url)) {
          console.log(
            'Same URL (ignoring filters param), skipping history update',
            event.url,
          );
          return;
        }
        this.history.push(event.url);
        console.log(event.url, this.history);
      }
    });
  }

  private handlePageParameterOnNavigation() {
    const urlParams = new URLSearchParams(window.location.search);

    // Remove search page parameter when not on search page
    const hasSearchPageParam = urlParams.has(Settings.url.params.page);
    if (hasSearchPageParam) {
      const isOnSearchPage = this.isOnSearchPage();
      if (!isOnSearchPage) {
        void this.url.updateSearchPageInUrl(null);
      }
    }

    // Remove IIIF page parameter when not on details page
    const hasIiifPageParam = urlParams.has(Settings.url.params.iiifPage);
    if (hasIiifPageParam) {
      const isOnDetailsPage = this.details.isShowing();
      if (!isOnDetailsPage) {
        void this.url.updateIiifPageInUrl(null);
      }
    }
  }

  isOnSearchPage(): boolean {
    return this.router.url.startsWith(`/${Settings.url.urls.search}`);
  }

  private isLastUrlSameAsUrl(url: string) {
    const lastHistoryUrl = this.history.at(-1);
    const stripFiltersParam = (url: string) => {
      const [path, query] = url.split('?');
      if (!query) return path;
      const params = new URLSearchParams(query);
      params.delete(Settings.url.params.filters);
      params.delete(Settings.url.params.page);
      const filteredQuery = params.toString();
      return filteredQuery ? `${path}?${filteredQuery}` : path;
    };
    return (
      lastHistoryUrl &&
      stripFiltersParam(lastHistoryUrl) === stripFiltersParam(url)
    );
  }

  goBackOrDefault(defaultUrl: string = '/') {
    if (this.history.length > 1) {
      this.history.pop();
      const previousUrl = this.history.pop();
      void this.router.navigateByUrl(previousUrl || defaultUrl);
    } else {
      void this.router.navigateByUrl(defaultUrl);
    }
  }

  hasHistory(): boolean {
    return this.history.length > 1;
  }
}
