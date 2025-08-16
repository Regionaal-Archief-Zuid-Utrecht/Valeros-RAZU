import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, throwError } from 'rxjs';
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

  async postData<T>(url: string, data: any): Promise<T> {
    const dataStr = JSON.stringify(data);
    const requestKey = `${url}|||${dataStr}`;
    const requestIsCached = requestKey in this.postCache.cache;

    if (requestIsCached) {
      return this.postCache.cache[requestKey];
    }

    return new Promise<T>((resolve, reject) => {
      const request = async () => {
        try {
          // Debug request payload
          // eslint-disable-next-line no-console
          console.debug('[ApiService] POST', url, data);
          const response = await lastValueFrom(
            this.http.post<T>(url, data).pipe(
              catchError((error) => {
                // Enhanced error logging to surface ES error details
                // eslint-disable-next-line no-console
                console.error('[ApiService] Request failed', {
                  url,
                  payload: data,
                  status: error?.status,
                  statusText: error?.statusText,
                  message: error?.message,
                  errorBody: error?.error,
                });
                reject(error);
                return throwError(() => error);
              }),
            ),
          );
          this.postCache.cache[requestKey] = response;
          resolve(response);
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
