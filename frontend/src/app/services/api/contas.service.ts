import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { BaseService } from "../api.base.service";
import {
  SaldoResponse,
  OperacaoResponse,
  TransferenciaResponse,
  ExtratoResponse,
  LoginResponse,
} from "../model";

@Injectable({
  providedIn: "root",
})
export class ContasService extends BaseService {
  private getAuthHeaders(): HttpHeaders {
    const stored = localStorage.getItem("token");
    const dados: LoginResponse = stored ? JSON.parse(stored) : "";
    return new HttpHeaders({
      Authorization: `Bearer ${dados.token}`,
    });
  }

  // POST /contas/{numero}/saldo
  getSaldo(numero: string): Observable<SaldoResponse> {
    const headers = this.getAuthHeaders();
    return this.post<SaldoResponse>(`/contas/${numero}/saldo`, {}, headers);
  }

  // POST /contas/{numero}/depositar
  depositar(numero: string, valor: number): Observable<OperacaoResponse> {
    const headers = this.getAuthHeaders();
    return this.post<OperacaoResponse>(
      `/contas/${numero}/depositar`,
      { valor },
      headers,
    );
  }

  // POST /contas/{numero}/sacar
  sacar(numero: string, valor: number): Observable<OperacaoResponse> {
    const headers = this.getAuthHeaders();
    return this.post<OperacaoResponse>(
      `/contas/${numero}/sacar`,
      { valor },
      headers,
    );
  }

  // POST /contas/{numero}/transferir
  transferir(
    numero: string,
    destino: string,
    valor: number,
  ): Observable<TransferenciaResponse> {
    const headers = this.getAuthHeaders();
    return this.post<TransferenciaResponse>(
      `/contas/${numero}/transferir`,
      { destino, valor },
      headers,
    );
  }

  // POST /contas/{numero}/extrato
  getExtrato(numero: string): Observable<ExtratoResponse> {
    const headers = this.getAuthHeaders();
    return this.post<ExtratoResponse>(`/contas/${numero}/extrato`, {}, headers);
  }
}
