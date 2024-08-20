import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { MessageService } from './message.service';

interface TokenObject {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor(private http: HttpClient, private message: MessageService) {}

  async processUrl(url: string): Promise<string> {
    let proxyPath = '';
    if (url.includes('opslag.razu.nl')) {
      const lastBit = url.substring(url.lastIndexOf('/') + 1);
      let domain = '';
      if (url.includes('htn.')) {
        domain = 'htn';
      } else {
        domain = 'particulier';
      }
      const token: TokenObject = await firstValueFrom(
        this.generateToken(domain, lastBit),
      );
      url = this._addParamToUrl(url, 'token', token['token']);
    }
    url = url.replaceAll(
      'hetutrechtsarchief.nl/id',
      'hetutrechtsarchief.nl/collectie',
    );
    return url;
  }

  getProxiedDocument(url: string): Observable<any> {
    console.log('getProxiedDocument', url);
    let proxyPath = '';
    if (url.includes('htn.opslag.razu.nl')) {
      proxyPath = '/proxy/htn';
    } else if (url.includes('wbd.opslag.razu.nl')) {
      proxyPath = '/proxy/wbd';
    }

    const proxiedUrl = url.replace(/^https:\/\/[^\/]+/, proxyPath);
    this.message.sendMessage('Loading document...', true, 5);
    return this.http.get(proxiedUrl, { responseType: 'blob' });

  }


  processUrls(urls: string[]): Promise<string[]> {
    const processedUrlsPromises = urls.map((url) => this.processUrl(url));
    return Promise.all(processedUrlsPromises);
  }

  private generateToken(domain: string, file: string): Observable<TokenObject> {
    const headers = new HttpHeaders({
      file: file,
      ip: '192.168.1.1',
      domain: domain,
    });
    return this.http.post<TokenObject>(
      'http://localhost:3000/generate-token',
      {},
      { headers },
    );
  }

  private _addParamToUrl(url: string, param: string, value: string): string {
    // Implementation of adding param to URL
    const urlObj = new URL(url);
    urlObj.searchParams.set(param, value);
    return urlObj.toString();
  }
}
