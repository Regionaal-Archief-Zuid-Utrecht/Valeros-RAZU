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
  ) {}

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
