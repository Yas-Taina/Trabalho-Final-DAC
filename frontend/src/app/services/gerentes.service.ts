import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { Observable, catchError, finalize, throwError } from "rxjs";
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
  getGerentes(
    filtro?: "dashboard",
  ): Observable<DadoGerente[] | DashboardResponse> {
    if (filtro && filtro !== "dashboard") {
      return throwError(() => new Error("Filtro inválido"));
    }

    let params = new HttpParams();
    if (filtro) params = params.set("numero", filtro);

    this.setLoading(true);

    return this.http.get<DadoGerente[] | DashboardResponse>(
      `${this.apiUrl}/gerentes`,
      { headers: this.getAuthHeaders(), params },
    ).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  getGerente(cpf: string): Observable<DadoGerente> {
    if (!this.validateString(cpf, "CPF")) {
      return throwError(() => new Error("CPF inválido"));
    }

    this.setLoading(true);

    return this.http.get<DadoGerente>(`${this.apiUrl}/gerentes/${cpf}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  inserirGerente(data: DadoGerenteInsercao): Observable<DadoGerente> {
    if (!this.validateGerenteInsercaoData(data)) {
      return throwError(() => new Error("Dados de gerente inválidos"));
    }

    this.setLoading(true);

    return this.http.post<DadoGerente>(`${this.apiUrl}/gerentes`, data, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  atualizarGerente(
    cpf: string,
    data: DadoGerenteAtualizacao,
  ): Observable<DadoGerente> {
    if (!this.validateString(cpf, "CPF")) {
      return throwError(() => new Error("CPF inválido"));
    }

    if (!data || typeof data !== "object") {
      return throwError(() => new Error("Dados de atualização inválidos"));
    }

    this.setLoading(true);

    return this.http.put<DadoGerente>(`${this.apiUrl}/gerentes/${cpf}`, data, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  removerGerente(cpf: string): Observable<DadoGerente> {
    if (!this.validateString(cpf, "CPF")) {
      return throwError(() => new Error("CPF inválido"));
    }

    this.setLoading(true);

    return this.http.delete<DadoGerente>(`${this.apiUrl}/gerentes/${cpf}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  private validateGerenteInsercaoData(data: DadoGerenteInsercao): boolean {
    if (!data || typeof data !== "object") {
      return false;
    }

    const requiredFields = ["cpf", "email", "nome", "telefone"];
    for (const field of requiredFields) {
      if (!this.validateString(data[field as keyof DadoGerenteInsercao], field)) {
        return false;
      }
    }

    if (!this.validateEmail(data.email)) {
      return false;
    }

    return true;
  }
}
