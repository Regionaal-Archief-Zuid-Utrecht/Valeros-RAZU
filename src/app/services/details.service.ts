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
    console.log('===== START URL PROCESSING =====');
    console.log('Input URL:', url);
    
    const isAlreadyDetailsUrl = decodeURIComponent(url).startsWith(
      `/${Settings.url.urls.details}`,
    );
    if (isAlreadyDetailsUrl || !isValidHttpUrl(url)) {
      console.log('URL is already a details URL or not a valid HTTP URL, returning as-is');
      return url;
    }

    // Controleer of de URL al geëncodeerd is en decodeer volledig
    let fullyDecodedUrl = url;
    try {
      // Blijf decoderen totdat er geen % meer in de URL zit
      while (fullyDecodedUrl.includes('%')) {
        const previousUrl = fullyDecodedUrl;
        fullyDecodedUrl = decodeURIComponent(fullyDecodedUrl);
        
        // Als decoderen geen verandering meer oplevert, stop dan
        if (previousUrl === fullyDecodedUrl) {
          break;
        }
      }
      console.log('Volledig gedecodeerde URL:', fullyDecodedUrl);
    } catch (e) {
      console.warn('Fout bij volledig decoderen URL:', e);
    }
    
    // Vervang &23 door # (als die aanwezig is)
    let processedUrl = fullyDecodedUrl.replace(/&23/g, '#');
    console.log('URL na &23 vervanging:', processedUrl);
    
    // Splits de URL op het # teken om fragment apart te houden
    const [baseUrl, fragment] = processedUrl.split('#');
    console.log('Base URL:', baseUrl);
    console.log('Fragment:', fragment);
    
    // Gebruik een EXACTE handmatige encoding voor het gewenste formaat
    // We willen precies het formaat: https:%2F%2Fdata.razu.nl%2Fid%2Fobject%2Fnl-wbdrazu-k50907905-620-1003
    let encodedUrl = baseUrl
      .replace(/:/g, '%3A')  // Vervang : door %3A
      .replace(/\//g, '%2F'); // Vervang / door %2F
    
    // Controleer of er dubbele encoding is en corrigeer
    if (encodedUrl.includes('%253A') || encodedUrl.includes('%252F')) {
      console.log('Dubbele encoding gedetecteerd, corrigeren...');
      encodedUrl = encodedUrl
        .replace(/%253A/g, '%3A')
        .replace(/%252F/g, '%2F');
    }
    
    // Vervang %3A door : voor het eerste voorkomen (https:%2F%2F in plaats van https%3A%2F%2F)
    encodedUrl = encodedUrl.replace('%3A', ':');
    
    console.log('Handmatig geëncodeerde URL:', encodedUrl);
    
    // Voeg het fragment weer toe als het bestaat
    if (fragment) {
      encodedUrl += '#' + fragment;
    }
    
    const finalUrl = `/${Settings.url.urls.details}/` + encodedUrl;
    console.log('Final URL:', finalUrl);
    console.log('===== END URL PROCESSING =====');
    
    return finalUrl;
  }
}
