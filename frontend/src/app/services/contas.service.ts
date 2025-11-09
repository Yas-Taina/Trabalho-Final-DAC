import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseService } from "./base.service";
import {
  SaldoResponse,
  OperacaoResponse,
  TransferenciaResponse,
  ExtratoResponse,
} from "./models";

@Injectable({
  providedIn: "root",
})
export class ContasService extends BaseService {

  getSaldo(numero: string): Observable<SaldoResponse> {
    return this.http.post<SaldoResponse>(
      `${this.apiUrl}/contas/${numero}/saldo`,
      {}, 
      { headers: this.headers }
    );
  }

  depositar(numero: string, valor: number): Observable<OperacaoResponse> {
    return this.http.post<OperacaoResponse>(
      `${this.apiUrl}/contas/${numero}/depositar`,
      { valor },
      { headers: this.headers }
    );
  }

  sacar(numero: string, valor: number): Observable<OperacaoResponse> {
    return this.http.post<OperacaoResponse>(
      `${this.apiUrl}/contas/${numero}/sacar`,
      { valor },
      { headers: this.headers }
    );
  }

  transferir(numero: string, destino: string, valor: number): Observable<TransferenciaResponse> {
    return this.http.post<TransferenciaResponse>(
      `${this.apiUrl}/contas/${numero}/transferir`,
      { destino, valor },
      { headers: this.headers }
    );
  }

  extrato(numero: string): Observable<ExtratoResponse> {
    return this.http.post<ExtratoResponse>(
      `${this.apiUrl}/contas/${numero}/extrato`,
      {},
      { headers: this.headers }
    );
  }
}
