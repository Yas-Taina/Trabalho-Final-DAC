import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {
  protected http = inject(HttpClient);
  private readonly GATEWAY_URL = 'http://localhost:3000/api';
  private readonly SERVICES = {
    AUTH: `${this.GATEWAY_URL}/auth`,
    CLIENTE: `${this.GATEWAY_URL}/clientes`,
    CONTA: `${this.GATEWAY_URL}/contas`,
    GERENTE: `${this.GATEWAY_URL}/gerentes`,
  };
  protected serviceUrl = '';

  constructor(serviceName: keyof BaseService<T>['SERVICES']) {
    this.serviceUrl = this.SERVICES[serviceName];
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.serviceUrl);
  }

  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.serviceUrl}/${id}`);
  }

  create(data: Partial<T>): Observable<T> {
    return this.http.post<T>(this.serviceUrl, data);
  }

  update(id: number | string, data: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.serviceUrl}/${id}`, data);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.serviceUrl}/${id}`);
  }
}
