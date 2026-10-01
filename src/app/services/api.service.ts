import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, Observable, throwError } from 'rxjs';
import { Settings } from '../config/settings';
import { PostCacheService } from './cache/post-cache.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private requestQueue: (() => Promise<any>)[] = [];
  private activeRequests = 0;

  constructor(
    private http: HttpClient,
    private postCache: PostCacheService,
  ) { }

  async postData<T>(
    url: string,
    data: any,
    options?: {
      accept?: string;
      responseType?: 'json' | 'text';
    },
  ): Promise<T> {
    const dataStr = JSON.stringify(data);
    const accept = options?.accept;
    const responseType = options?.responseType || 'json';
    const requestKey = `${url}|||${accept || ''}|||${responseType}|||${dataStr}`;
    const requestIsCached = requestKey in this.postCache.cache;

    if (requestIsCached) {
      return this.postCache.cache[requestKey];
    }

    return new Promise<T>((resolve, reject) => {
      const request = async () => {
        try {
          const headers: HttpHeaders | undefined = accept
            ? new HttpHeaders({
              Accept: accept,
            })
            : undefined;

          const request$: Observable<T | string> =
            responseType === 'text'
              ? (this.http.post(url, data, {
                headers,
                responseType: 'text',
              }) as any)
              : this.http.post<T>(url, data, {
                headers,
              });

          const response = await lastValueFrom(
            request$.pipe(
              catchError((error: any) => {
                console.error(
                  'There was a problem with the API request:',
                  error,
                );
                reject(error);
                return throwError(() => error);
              }),
            ),
          );
          this.postCache.cache[requestKey] = response;
          resolve(response as T);
        } catch (error) {
          reject(error);
        } finally {
          this.activeRequests--;
          this._processQueue();
        }
      };

      this.requestQueue.push(request);
      this._processQueue();
    });
  }

  async postSparql<T>(
    url: string,
    query: string,
    options?: {
      accept?: string;
      responseType?: 'json' | 'text';
    },
  ): Promise<T> {
    const body = new URLSearchParams({ query }).toString();
    const accept = options?.accept ?? 'application/sparql-results+json';
    const responseType = options?.responseType ?? 'json';
    const requestKey = `sparql|||${url}|||${accept}|||${responseType}|||${body}`;
    const requestIsCached = requestKey in this.postCache.cache;

    if (requestIsCached) {
      return this.postCache.cache[requestKey];
    }

    return new Promise<T>((resolve, reject) => {
      const request = async () => {
        try {
          const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: accept,
          });

          const request$: Observable<any> =
            responseType === 'text'
              ? this.http.post(url, body, { headers, responseType: 'text' })
              : this.http.post(url, body, { headers });

          const response = await lastValueFrom(
            request$.pipe(
              catchError((error: any) => {
                console.error(
                  'There was a problem with the SPARQL request:',
                  error,
                );
                reject(error);
                return throwError(() => error);
              }),
            ),
          );

          const result =
            responseType === 'text'
              ? response
              : this._normalizeSparqlBindings(response);
          this.postCache.cache[requestKey] = result;
          resolve(result as T);
        } catch (error) {
          reject(error);
        } finally {
          this.activeRequests--;
          this._processQueue();
        }
      };

      this.requestQueue.push(request);
      this._processQueue();
    });
  }

  private _normalizeSparqlBindings(response: any): Record<string, any>[] {
    const bindings = response?.results?.bindings;
    if (!Array.isArray(bindings)) {
      return response;
    }
    return bindings.map((binding: Record<string, { value: any }>) =>
      Object.fromEntries(
        Object.entries(binding).map(([key, term]) => [key, term.value]),
      ),
    );
  }

  private _processQueue() {
    while (
      this.activeRequests < Settings.endpoints.maxNumParallelRequests &&
      this.requestQueue.length > 0
    ) {
      const nextRequest = this.requestQueue.shift();
      if (nextRequest) {
        this.activeRequests++;
        void nextRequest();
      }
    }
  }
}
