import { Injectable } from "@angular/core";
import { Observable, map, catchError, finalize, throwError } from "rxjs";
import { HttpParams, HttpClient } from "@angular/common/http";
import { BaseService } from "./base.service";
import {
  AutocadastroInfo,
  DadosClienteResponse,
  ParaAprovarResponse,
  RelatorioClientesResponse,
  TodosClientesResponse,
} from "./models";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ClientesService extends BaseService {
  constructor(
    private authService: AuthService,
    http: HttpClient,
  ) {
    super(http);
  }

  getClientes(
    filtro?: "para_aprovar" | "adm_relatorio_clientes" | "melhores_clientes",
  ): Observable<
    TodosClientesResponse | ParaAprovarResponse | RelatorioClientesResponse
  > {
    if (filtro && !this.isValidFilter(filtro)) {
      return throwError(() => new Error("Filtro inválido"));
    }

    let params = new HttpParams();
    if (filtro) params = params.set("filtro", filtro);

    this.setLoading(true);

    return this.http.get<
      TodosClientesResponse | ParaAprovarResponse | RelatorioClientesResponse
    >(`${this.apiUrl}/clientes`, {
      headers: this.headers,
      params,
    }).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  getClientesByGerente(): Observable<TodosClientesResponse> {
    const cpfGerente = this.authService.getUserCpf();
    if (!cpfGerente) {
      return throwError(() => new Error("Não foi possível identificar o gerente logado."));
    }

    this.setLoading(true);

    return this.getClientes().pipe(
      map((clientes) => {
        const lista = clientes as TodosClientesResponse;
        if (Array.isArray(lista)) {
          return lista.filter((cli: any) => cli.gerente === cpfGerente);
        }
        return [];
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  getCliente(cpf: string): Observable<DadosClienteResponse> {
    if (!this.validateString(cpf, "CPF")) {
      return throwError(() => new Error("CPF inválido"));
    }

    this.setLoading(true);

    return this.http.get<DadosClienteResponse>(
      `${this.apiUrl}/clientes/${cpf}`,
      { headers: this.headers },
    ).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  autocadastro(data: AutocadastroInfo): Observable<void> {
    if (!this.validateAutocadastroData(data)) {
      return throwError(() => new Error("Dados de autocadastro inválidos"));
    }

    this.setLoading(true);

    return this.http.post<void>(`${this.apiUrl}/clientes`, data, {
      headers: this.headers,
    }).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  atualizarCliente(cpf: string, data: any): Observable<void> {
    if (!this.validateString(cpf, "CPF")) {
      return throwError(() => new Error("CPF inválido"));
    }

    if (!data || typeof data !== "object") {
      return throwError(() => new Error("Dados de atualização inválidos"));
    }

    this.setLoading(true);

    return this.http.put<void>(`${this.apiUrl}/clientes/${cpf}`, data, {
      headers: this.headers,
    }).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  aprovarCliente(cpf: string): Observable<void> {
    if (!this.validateString(cpf, "CPF")) {
      return throwError(() => new Error("CPF inválido"));
    }

    this.setLoading(true);

    return this.http.post<void>(
      `${this.apiUrl}/clientes/${cpf}/aprovar`,
      {},
      { headers: this.headers },
    ).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  rejeitarCliente(cpf: string, motivo: string): Observable<void> {
    if (!this.validateString(cpf, "CPF")) {
      return throwError(() => new Error("CPF inválido"));
    }

    if (!this.validateString(motivo, "Motivo")) {
      return throwError(() => new Error("Motivo de rejeição inválido"));
    }

    this.setLoading(true);

    return this.http.post<void>(
      `${this.apiUrl}/clientes/${cpf}/rejeitar`,
      { motivo },
      { headers: this.headers },
    ).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  private validateAutocadastroData(data: AutocadastroInfo): boolean {
    const requiredFields = ["cpf", "email", "nome", "telefone", "salario", "endereco", "CEP", "cidade", "estado"];
    
    for (const field of requiredFields) {
      if (!this.validateString(data[field as keyof AutocadastroInfo], field)) {
        return false;
      }
    }

    if (!this.validateEmail(data.email)) {
      return false;
    }

    if (!this.validateNumber(data.salario, "Salário", false)) {
      return false;
    }

    return true;
  }

  private isValidFilter(filtro: string): boolean {
    const validFilters = ["para_aprovar", "adm_relatorio_clientes", "melhores_clientes"];
    return validFilters.includes(filtro);
  }
}
