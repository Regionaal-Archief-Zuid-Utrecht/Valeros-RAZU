import { Injectable } from '@angular/core';
import { UrlService } from './url.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FetchJsonService {
  url = '';
  constructor(
    private urlService: UrlService,
    private http: HttpClient,
  ) {}

  async fetchJson(
    iri: string,
    type: string,
  ): Promise<Observable<string | boolean>> {
    // Extract the ID part from the original IRI
    const id = iri.split('/').pop();

    // Construct the new IRI
    const newIri = `https://htn.opslag.razu.nl/${id}.${type}.json`;

    // Use the CDN service to add the JWT token
    const processedUrl = await this.urlService.processUrl(newIri);
    if (this.isUrlValid(processedUrl)) {
      return of(processedUrl);
    } else {
      return of(false);
    }
  }
  private isUrlValid(url: string): Observable<boolean> {
    return this.http.head(url, { observe: 'response' }).pipe(
      map((response) => response.status === 200),
      catchError(() => of(false)),
    );
  }

  async downloadFile(iri: string, type: string) {
    this.fetchJson(iri, type).then((result) => {
      if (typeof result === 'boolean') {
        return;
      } else {
        result.subscribe((value) => {
          this.url = value as string;
        });
      }
    });
    if (!this.url) {
      return;
    }
    this.url = 'http://localhost:3000/NL-WbDRAZU-G999.json'; // Temporary bypass to a fixed json
    this.http
      .get(this.url, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = iri.split('/').pop() ?? 'Origineel.json';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
