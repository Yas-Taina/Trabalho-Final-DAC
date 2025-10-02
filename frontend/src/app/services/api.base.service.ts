import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  private readonly apiUrl = 'https://virtserver.swaggerhub.com/RAZERANTHOM/bantads/1.0.1';

  constructor(protected http: HttpClient) {}

  protected get<T>(endpoint: string, params?: any, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(
      `${this.apiUrl}${endpoint}`, 
      {
        headers,
        params: this.buildParams(params),
      });
  }

  protected post<T>(endpoint: string, body?: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(
      `${this.apiUrl}${endpoint}`,
      body,
      { headers });
  }

  protected put<T>(endpoint: string, body?: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(
      `${this.apiUrl}${endpoint}`,
      body,
      { headers });
  }

  protected delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(
      `${this.apiUrl}${endpoint}`,
      { headers });
  }

  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return httpParams;
  }
}
