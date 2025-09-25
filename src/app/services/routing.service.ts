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
        this.history.push(event.url);
      }
    });
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
