import { Injectable } from '@angular/core';
import { BaseService } from '../api.base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../local/models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends BaseService<Cliente> {
  constructor() {
    super('CLIENTE');
  }

  listar(filtro: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.serviceUrl}?filtro=${filtro}`);
  }

  consultarPorCpf(cpf: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.serviceUrl}/${cpf}`);
  }

  criar(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.serviceUrl, cliente);
  }

  atualizar(cpf: string, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.serviceUrl}/${cpf}`, cliente);
  }
}
