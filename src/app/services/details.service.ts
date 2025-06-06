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

    // Controleer of de URL al geëncodeerd is
    let decodedUrl = url;
    try {
      // Probeer de URL te decoderen om dubbele encoding te voorkomen
      if (url.includes('%')) {
        decodedUrl = decodeURIComponent(url);
      }
    } catch (e) {
      // Als decoderen mislukt, gebruik de originele URL
      console.warn('Fout bij decoderen URL:', e);
    }
    
    // Vervang &23 door # (als die aanwezig is)
    let processedUrl = decodedUrl.replace(/&23/g, '#');
    
    // Splits de URL op het # teken om fragment apart te houden
    const [baseUrl, fragment] = processedUrl.split('#');
    
    // Handmatige encoding voor het juiste formaat
    // We willen alleen bepaalde tekens encoderen: /, :, etc.
    let encodedUrl = baseUrl
      .replace(/:/g, '%3A')
      .replace(/\//g, '%2F')
      .replace(/ /g, '%20')
      .replace(/\?/g, '%3F')
      .replace(/&/g, '%26')
      .replace(/=/g, '%3D');
    
    // Log het resultaat voor debugging
    console.log('Handmatig geëncodeerde URL:', encodedUrl);
    
    // Voeg het fragment weer toe als het bestaat
    if (fragment) {
      encodedUrl += '#' + fragment;
    }
    
    console.log('Original URL:', url);
    console.log('Decoded URL:', decodedUrl);
    console.log('Processed URL:', processedUrl);
    console.log('Encoded URL:', encodedUrl);
    
    return `/${Settings.url.urls.details}/` + encodedUrl;
  }
}
