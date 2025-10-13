import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { BaseService } from "../api.base.service";
import {
  AutocadastroInfo,
  PerfilInfo,
  ContaResponse,
  DadosClienteResponse,
  LoginResponse,
} from "../model";

@Injectable({
  providedIn: "root",
})
export class ClientesService extends BaseService {
  private getAuthHeaders(): HttpHeaders {
    const stored = localStorage.getItem("token");
    const dados: LoginResponse = stored ? JSON.parse(stored) : "";
    return new HttpHeaders({
      Authorization: `Bearer ${dados.token}`,
    });
  }

  // GET /clientes?filtro=...
  getClientes(
    filtro?: "para_aprovar" | "adm_relatorio_clientes" | "melhores_clientes",
  ): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.get<DadosClienteResponse[]>(
      "/clientes",
      filtro ? { filtro } : {},
      headers,
    );
  }

  // POST /clientes (autocadastro)
  autocadastroCliente(data: AutocadastroInfo): Observable<any> {
    return this.post<any>("/clientes", data);
  }

  // GET /clientes/{cpf}
  getCliente(cpf: string): Observable<DadosClienteResponse> {
    const headers = this.getAuthHeaders();
    return this.get<DadosClienteResponse>(`/clientes/${cpf}`, {}, headers);
  }

  // PUT /clientes/{cpf}
  atualizarCliente(cpf: string, data: PerfilInfo): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.put<any>(`/clientes/${cpf}`, data, headers);
  }

  // POST /clientes/{cpf}/aprovar
  aprovarCliente(cpf: string): Observable<ContaResponse> {
    const headers = this.getAuthHeaders();
    return this.post<ContaResponse>(`/clientes/${cpf}/aprovar`, {}, headers);
  }

  // POST /clientes/{cpf}/rejeitar
  rejeitarCliente(cpf: string, motivo: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.post<any>(`/clientes/${cpf}/rejeitar`, { motivo }, headers);
  }
}
