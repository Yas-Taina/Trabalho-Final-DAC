import { Injectable } from "@angular/core";
import { Observable, catchError, finalize, throwError } from "rxjs";
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
    if (!this.validateString(numero, "Número da conta")) {
      return throwError(() => new Error("Número da conta inválido"));
    }

    this.setLoading(true);

    return this.http.post<SaldoResponse>(
      `${this.apiUrl}/contas/${numero}/saldo`,
      {},
      { headers: this.headers },
    ).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  depositar(numero: string, valor: number): Observable<OperacaoResponse> {
    if (!this.validateString(numero, "Número da conta")) {
      return throwError(() => new Error("Número da conta inválido"));
    }

    if (!this.validateNumber(valor, "Valor do depósito", false)) {
      return throwError(() => new Error("Valor do depósito inválido"));
    }

    this.setLoading(true);

    return this.http.post<OperacaoResponse>(
      `${this.apiUrl}/contas/${numero}/depositar`,
      { valor },
      { headers: this.headers },
    ).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  sacar(numero: string, valor: number): Observable<OperacaoResponse> {
    if (!this.validateString(numero, "Número da conta")) {
      return throwError(() => new Error("Número da conta inválido"));
    }

    if (!this.validateNumber(valor, "Valor do saque", false)) {
      return throwError(() => new Error("Valor do saque inválido"));
    }

    this.setLoading(true);

    return this.http.post<OperacaoResponse>(
      `${this.apiUrl}/contas/${numero}/sacar`,
      { valor },
      { headers: this.headers },
    ).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  transferir(
    numero: string,
    destino: string,
    valor: number,
  ): Observable<TransferenciaResponse> {
    if (!this.validateString(numero, "Número da conta origem")) {
      return throwError(() => new Error("Número da conta origem inválido"));
    }

    if (!this.validateString(destino, "Número da conta destino")) {
      return throwError(() => new Error("Número da conta destino inválido"));
    }

    if (numero === destino) {
      return throwError(() => new Error("Não é permitido transferir para a mesma conta"));
    }

    if (!this.validateNumber(valor, "Valor da transferência", false)) {
      return throwError(() => new Error("Valor da transferência inválido"));
    }

    this.setLoading(true);

    return this.http.post<TransferenciaResponse>(
      `${this.apiUrl}/contas/${numero}/transferir`,
      { destino, valor },
      { headers: this.headers },
    ).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  extrato(numero: string): Observable<ExtratoResponse> {
    if (!this.validateString(numero, "Número da conta")) {
      return throwError(() => new Error("Número da conta inválido"));
    }

    this.setLoading(true);

    return this.http.post<ExtratoResponse>(
      `${this.apiUrl}/contas/${numero}/extrato`,
      {},
      { headers: this.headers },
    ).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false)),
    );
  }
}
