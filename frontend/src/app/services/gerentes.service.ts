import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { BaseService } from "./base.service";
import {
  DadoGerente,
  DadoGerenteInsercao,
  DadoGerenteAtualizacao,
  DashboardResponse,
} from "./models";

@Injectable({
  providedIn: "root",
})
export class GerentesService extends BaseService {
  getGerentes(filtro?: "dashboard"): Observable<DadoGerente[] | DashboardResponse> {
    let params = new HttpParams();
    if (filtro) params = params.set("numero", filtro); // conforme OpenAPI
    return this.http.get<DadoGerente[] | DashboardResponse>(
      `${this.apiUrl}/gerentes`,
      { headers: this.headers, params }
    );
  }

  getGerente(cpf: string): Observable<DadoGerente> {
    return this.http.get<DadoGerente>(`${this.apiUrl}/gerentes/${cpf}`, {
      headers: this.headers,
    });
  }

  inserirGerente(data: DadoGerenteInsercao): Observable<DadoGerente> {
    return this.http.post<DadoGerente>(`${this.apiUrl}/gerentes`, data, {
      headers: this.headers,
    });
  }

  atualizarGerente(cpf: string, data: DadoGerenteAtualizacao): Observable<DadoGerente> {
    return this.http.put<DadoGerente>(`${this.apiUrl}/gerentes/${cpf}`, data, {
      headers: this.headers,
    });
  }

  removerGerente(cpf: string): Observable<DadoGerente> {
    return this.http.delete<DadoGerente>(`${this.apiUrl}/gerentes/${cpf}`, {
      headers: this.headers,
    });
  }
}
