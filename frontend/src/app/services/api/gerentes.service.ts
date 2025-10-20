import { Injectable } from '@angular/core';
import { BaseService } from '../api.base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gerente } from '../local/models/gerente';

@Injectable({
  providedIn: 'root'
})
export class GerenteService extends BaseService<Gerente> {
  constructor() {
    super('GERENTE');
  }

  getTodosGerentes(): Observable<Gerente[]> {
    return this.http.get<Gerente[]>(this.serviceUrl);
  }

  obterGerenteByCpf(cpf: string): Observable<Gerente> {
    return this.http.get<Gerente>(`${this.serviceUrl}/${cpf}`);
  }

  inserirGerente(dto: Gerente): Observable<Gerente> {
    return this.http.post<Gerente>(this.serviceUrl, dto);
  }

  alterarGerente(cpf: string, dto: Gerente): Observable<Gerente> {
    return this.http.put<Gerente>(`${this.serviceUrl}/${cpf}`, dto);
  }

  removerGerente(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.serviceUrl}/${cpf}`);
  }
}
