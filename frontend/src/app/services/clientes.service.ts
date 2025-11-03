import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseService } from './base.service';
import { AutocadastroInfo, DadosClienteResponse, ParaAprovarResponse, RelatorioClientesResponse, TodosClientesResponse } from './models';

@Injectable({
  providedIn: 'root'
})
export class ClientesService extends BaseService {
  getClientes(filtro?: string): Observable<TodosClientesResponse | ParaAprovarResponse | RelatorioClientesResponse> {
    let params = new HttpParams();
    if (filtro) params = params.set('filtro', filtro);
    return this.http.get<TodosClientesResponse | ParaAprovarResponse | RelatorioClientesResponse>(
      `${this.apiUrl}/clientes`,
      { headers: this.headers, params }
    );
  }

  getCliente(cpf: string): Observable<DadosClienteResponse> {
    return this.http.get<DadosClienteResponse>(`${this.apiUrl}/clientes/${cpf}`, { headers: this.headers });
  }

  autocadastro(data: AutocadastroInfo): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/clientes`, data, { headers: this.headers });
  }

  atualizarCliente(cpf: string, data: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/clientes/${cpf}`, data, { headers: this.headers });
  }

  aprovarCliente(cpf: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/clientes/${cpf}/aprovar`, {}, { headers: this.headers });
  }

  rejeitarCliente(cpf: string, motivo: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/clientes/${cpf}/rejeitar`, { motivo }, { headers: this.headers });
  }
}
