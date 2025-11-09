import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
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
  constructor(private authService: AuthService, http: HttpClient) {
    super(http);
  }

  getClientes(
    filtro?: "para_aprovar" | "adm_relatorio_clientes" | "melhores_clientes"
  ): Observable<
    TodosClientesResponse | ParaAprovarResponse | RelatorioClientesResponse
  > {
    let params = new HttpParams();
    if (filtro) params = params.set("filtro", filtro);

    return this.http.get<
      TodosClientesResponse | ParaAprovarResponse | RelatorioClientesResponse
    >(`${this.apiUrl}/clientes`, {
      headers: this.headers,
      params,
    });
  }

  getClientesByGerente(): Observable<TodosClientesResponse> {
    const cpfGerente = this.authService.getUserCpf();
    if (!cpfGerente) {
      throw new Error("Não foi possível identificar o gerente logado.");
    }

    return this.getClientes().pipe(
      map((clientes) => {
        const lista = clientes as TodosClientesResponse;
        if (Array.isArray(lista)) {
          return lista.filter((cli: any) => cli.gerente === cpfGerente);
        }
        return [];
      })
    );
  }

  getCliente(cpf: string): Observable<DadosClienteResponse> {
    return this.http.get<DadosClienteResponse>(
      `${this.apiUrl}/clientes/${cpf}`,
      { headers: this.headers }
    );
  }

  autocadastro(data: AutocadastroInfo): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/clientes`, data, {
      headers: this.headers,
    });
  }

  atualizarCliente(cpf: string, data: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/clientes/${cpf}`, data, {
      headers: this.headers,
    });
  }

  aprovarCliente(cpf: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/clientes/${cpf}/aprovar`,
      {},
      { headers: this.headers }
    );
  }

  rejeitarCliente(cpf: string, motivo: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/clientes/${cpf}/rejeitar`,
      { motivo },
      { headers: this.headers }
    );
  }
}
