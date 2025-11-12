import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { BaseService } from "./base.service";
import { LoginInfo, LogoutResponse, LoginResponse } from "./models";

@Injectable({
  providedIn: "root",
})
export class AuthService extends BaseService {
  private readonly SESSION_KEY = "dac_token";
  login(data: LoginInfo): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, data, {
        headers: this.headers,
      })
      .pipe(tap((session) => this.saveSession(session)));
  }

  logout(): Observable<LogoutResponse> {
    return this.http
      .post<LogoutResponse>(
        `${this.apiUrl}/logout`,
        {},
        {
          headers: this.headers,
        },
      )
      .pipe(tap(() => this.clearSession()));
  }

  private saveSession(session: LoginResponse): void {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } catch {}
  }

  getSession(): LoginResponse | null {
    const json = localStorage.getItem(this.SESSION_KEY);
    if (!json) return null;
    try {
      return JSON.parse(json) as LoginResponse;
    } catch {
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
    return this.getSession()?.usuario.cpf ?? null;
  }

  isLoggedIn(): boolean {
    return this.getSession() !== null;
  }

  clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }
}
