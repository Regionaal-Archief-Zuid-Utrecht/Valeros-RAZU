import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Settings } from '../config/settings';
import { isValidHttpUrl } from '../helpers/util.helper';
import { NodeModel } from '../models/node.model';
import { NodeService } from './node/node.service';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  showing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private nodes: NodeService,
    private router: Router,
  ) {
    this._updateShowingOnRouteChange();
  }

  private _updateShowingOnRouteChange() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const isShowingDetails = event.url.startsWith(
          `/${Settings.url.urls.details}`,
        );
        const stateChanged = this.showing.value !== isShowingDetails;
        if (stateChanged) {
          this.showing.next(isShowingDetails);
        }
      }
    });
  }

  isShowing(): boolean {
    return this.router.url.startsWith(`/${Settings.url.urls.details}`);
  }

  getLink(node: NodeModel): string {
    const nodeId = this.nodes.getId(node);
    return this.getLinkFromUrl(nodeId);
  }

  getLinkFromUrl(url: string): string {
    const isAlreadyDetailsUrl = decodeURIComponent(url).startsWith(
      `/${Settings.url.urls.details}`,
    );
    if (isAlreadyDetailsUrl || !isValidHttpUrl(url)) {
      return url;
    }

    return `/${Settings.url.urls.details}/` + encodeURIComponent(url);
  }
}
