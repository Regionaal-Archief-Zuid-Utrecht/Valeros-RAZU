import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  private history: string[] = [];

  constructor(
    private router: Router,
    private url: UrlService,
  ) {}

  initHistoryTracking() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
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

  private isLastUrlSameAsUrl(url: string) {
    const lastHistoryUrl = this.history.at(-1);
    const stripFiltersParam = (url: string) => {
      const [path, query] = url.split('?');
      if (!query) return path;
      const params = new URLSearchParams(query);
      params.delete('filters');
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
