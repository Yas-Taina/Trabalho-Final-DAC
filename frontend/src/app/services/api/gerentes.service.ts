import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { BaseService } from '../api.base.service';
import { DadoGerente, DadoGerenteInsercao, DadoGerenteAtualizacao, LoginResponse } from '../model';

@Injectable({
  providedIn: 'root',
})
export class GerentesService extends BaseService {
  private getAuthHeaders(): HttpHeaders {
    const stored = localStorage.getItem('token');
    const dados: LoginResponse = stored ? JSON.parse(stored) : "";

    return new HttpHeaders({
      Authorization: `Bearer ${dados.token}`,
    });
  }

  // GET /gerentes?numero=dashboard
  getGerentes(numero?: 'dashboard'): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.get<any>('/gerentes', numero ? { numero } : {}, headers);
  }

  // POST /gerentes
  inserirGerente(data: DadoGerenteInsercao): Observable<DadoGerente> {
    const headers = this.getAuthHeaders();

    return this.post<DadoGerente>('/gerentes', data, headers);
  }

  // GET /gerentes/{cpf}
  getGerente(cpf: string): Observable<DadoGerente> {
    const headers = this.getAuthHeaders();

    return this.get<DadoGerente>(`/gerentes/${cpf}`, {}, headers);
  }

  // DELETE /gerentes/{cpf}
  removerGerente(cpf: string): Observable<DadoGerente> {
    const headers = this.getAuthHeaders();

    return this.delete<DadoGerente>(`/gerentes/${cpf}`, headers);
  }

  // PUT /gerentes/{cpf}
  atualizarGerente(cpf: string, data: DadoGerenteAtualizacao): Observable<DadoGerente> {
    const headers = this.getAuthHeaders();
    
    return this.put<DadoGerente>(`/gerentes/${cpf}`, data, headers);
  }
}