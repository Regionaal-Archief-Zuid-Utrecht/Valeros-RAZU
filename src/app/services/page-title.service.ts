import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, filter, firstValueFrom, take } from 'rxjs';
import { NodeModel } from '../models/node.model';
import { LabelsCacheService } from './cache/labels-cache.service';
import { DetailsService } from './details.service';
import { NodeService } from './node/node.service';
import { SearchService } from './search/search.service';

@Injectable({
  providedIn: 'root',
})
export class PageTitleService {
  constructor(
    private titleService: Title,
    private router: Router,
    private search: SearchService,
    private translate: TranslateService,
    private details: DetailsService,
    private labelsCache: LabelsCacheService,
    private nodeService: NodeService,
  ) {}

  initPageTitleUpdates() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updatePageTitle();
      }
    });

    // Update details page title based on node label
    this.details.node
      .pipe(
        filter((node): node is NodeModel => !!node && this.details.isShowing()),
        debounceTime(100),
      )
      .subscribe((node) => {
        this.setDetailsPageTitle(node);
      });
  }

  updatePageTitle() {
    const url = this.router.url;
    if (url.startsWith('/colofon')) {
      this.setColofonPageTitle();
    } else if (url.startsWith('/search')) {
      setTimeout(() => {
        this.setSearchPageTitle();
      });
    } else if (url.startsWith('/details')) {
      this.titleService.setTitle('RAZU - Details pagina laden...');
    } else {
      this.setHomePageTitle();
    }
  }

  async setHomePageTitle() {
    const homeTitle = await firstValueFrom(
      this.translate.get('general.page-title'),
    );
    this.titleService.setTitle(homeTitle);
  }

  async setColofonPageTitle() {
    const colofonTitle = await firstValueFrom(
      this.translate.get('general.colofon-title'),
    );
    this.titleService.setTitle(colofonTitle);
  }

  setSearchPageTitle() {
    this.titleService.setTitle(
      `RAZU - Zoekresultaten "${this.search.queryStr?.toString() || ''}"`,
    );
  }

  async setDetailsPageTitle(node: NodeModel) {
    const nodeId = this.nodeService.getId(node);
    await this.labelsCache.cacheLabelForId(nodeId);

    this.labelsCache.labels
      .pipe(
        filter((labels) => {
          const hasLabel = !!labels[nodeId];
          const labelIsNotNodeId = labels[nodeId] !== nodeId;
          return hasLabel && labelIsNotNodeId;
        }),
        take(1),
      )
      .subscribe((labels) => {
        console.log('Updating node details title', nodeId, labels[nodeId]);
        this.titleService.setTitle(`RAZU - ${labels[nodeId]}`);
      });
  }
}
