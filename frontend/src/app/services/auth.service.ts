import { Injectable } from "@angular/core";
import { Observable, tap, catchError, finalize, throwError } from "rxjs";
import { BaseService } from "./base.service";
import { LoginInfo, LogoutResponse, LoginResponse } from "./models";

@Injectable({
  providedIn: "root",
})
export class AuthService extends BaseService {
  private readonly SESSION_KEY = "dac_token";

  login(data: LoginInfo): Observable<LoginResponse> {
    if (!this.validateEmail(data.email)) {
      return throwError(() => new Error("Email inválido"));
    }
    if (!this.validateString(data.senha, "Senha")) {
      return throwError(() => new Error("Senha inválida"));
    }

    this.setLoading(true);

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, data, {
        headers: this.headers,
      })
      .pipe(
        tap((session) => {
          if (!session || !session.usuario || !session.tipo) {
            throw new Error("Resposta de login inválida");
          }
          this.saveSession(session);
        }),
        catchError((error) => {
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false)),
      );
  }

  logout(): Observable<LogoutResponse> {
    this.setLoading(true);

    return this.http
      .post<LogoutResponse>(
        `${this.apiUrl}/logout`,
        {},
        {
          headers: this.headers,
        },
      )
      .pipe(
        tap(() => this.clearSession()),
        catchError((error) => {
          this.clearSession();
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false)),
      );
  }

  private saveSession(session: LoginResponse): void {
    try {
      if (!session || !session.usuario || !session.tipo) {
        throw new Error("Dados de sessão inválidos");
      }
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      localStorage.removeItem(this.SESSION_KEY);
    }
  }

  getSession(): LoginResponse | null {
    const json = localStorage.getItem(this.SESSION_KEY);
    if (!json) return null;
    try {
      const session = JSON.parse(json) as LoginResponse;
      if (!session.usuario || !session.tipo || !session.access_token) {
        throw new Error("Sessão corrompida");
      }
      return session;
    } catch (error) {
      localStorage.removeItem(this.SESSION_KEY);
      return null;
    }
  }

  getUserType(): "CLIENTE" | "GERENTE" | "ADMINISTRADOR" | null {
    const tipo = this.getSession()?.tipo;
    if (tipo === "CLIENTE" || tipo === "GERENTE" || tipo === "ADMINISTRADOR") {
      return tipo;
    }
    return null;
  }

  getUserCpf(): string | null {
    const cpf = this.getSession()?.usuario?.cpf;
    if (cpf && this.validateString(cpf, "CPF")) {
      return cpf;
    }
    return null;
  }

  isLoggedIn(): boolean {
    const session = this.getSession();
    return session !== null && !!session.access_token;
  }

  clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      return;
    }
  }
}
