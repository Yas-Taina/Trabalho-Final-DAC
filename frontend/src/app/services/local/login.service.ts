import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { inject } from "@angular/core";
import {
  ClienteResponse,
  DadoGerente,
  LoginInfo,
  LoginResponse,
  LogoutResponse,
} from "../model";
import { LocalClientesService } from "./clientes.service";
import { LocalGerentesService } from "./gerentes.service";
import { LocalBaseService } from "../local.base.service";
import { Cliente } from "./models/cliente";
import { Gerente } from "./models/gerente";

@Injectable({
  providedIn: "root",
})
export class LocalLoginService {
  private tokenKey = "dac_token";
  private clientesService = inject(LocalClientesService);
  private gerentesService = inject(LocalGerentesService);

  // POST /login
  login(credentials: LoginInfo): Observable<LoginResponse> {
    return new Observable<LoginResponse>((observer) => {
      const email = credentials.email.toLowerCase();

      const gerentes = this.gerentesService.listarTodosGerentes();
      const gerente = gerentes.find(
        (g: Gerente) => g.email!.toLowerCase() === email,
      );

      if (gerente) {
        if (gerente?.senha !== credentials?.senha) {
          observer.error(new Error("Credenciais inválidas"));
          observer.complete();
          return;
        }

        console.log(gerente.tipo);

        const role =
          gerente.tipo!.toUpperCase() === "ADMINISTRADOR"
            ? "ADMINISTRADOR"
            : "GERENTE";

        const res: LoginResponse = {
          token: Math.random().toString(36).slice(2),
          tokenType: "Bearer",
          tipo: role,
          usuario: {
            cpf: gerente.cpf,
            nome: gerente.nome,
            email: gerente.email,
            telefone: gerente.telefone,
            tipo: gerente.tipo,
          } as DadoGerente,
        };

        localStorage.setItem(this.tokenKey, JSON.stringify(res));
        observer.next(res);
        observer.complete();
        return;
      }

      const clientes: Cliente[] = this.clientesService.listarClientes();
      const cliente = clientes.find(
        (c: Cliente) => c.email!.toLowerCase() === email,
      );

      if (cliente) {
        if (cliente?.senha !== credentials?.senha) {
          observer.error(new Error("Credenciais inválidas"));
          observer.complete();
          return;
        }

        const res: LoginResponse = {
          token: Math.random().toString(36).slice(2),
          tokenType: "Bearer",
          tipo: "CLIENTE",
          usuario: {
            cpf: cliente.cpf,
            nome: cliente.nome,
            email: cliente.email,
            endereco: cliente.endereco,
            telefone: cliente.telefone,
            conta: cliente.dadosConta?.numero,
            saldo: cliente.dadosConta?.saldo,
            limite: cliente.dadosConta?.limite,
          } as ClienteResponse,
        };

        localStorage.setItem(this.tokenKey, JSON.stringify(res));
        observer.next(res);
        observer.complete();
        return;
      }

      observer.error(new Error("Credenciais inválidas"));
      observer.complete();
    });
  }

  // POST /logout
  logout(): Observable<LogoutResponse> {
    return new Observable<LogoutResponse>((observer) => {
      const session = this.sessionInfo();
      if (session) {
        const usuario = session.usuario as any;
        const resp: LogoutResponse = {
          cpf: usuario?.cpf,
          nome: usuario?.nome,
          email: usuario?.email,
          tipo: session.tipo,
        };

        localStorage.removeItem(this.tokenKey);
        observer.next(resp);
        observer.complete();
        return;
      }

      localStorage.removeItem(this.tokenKey);
      observer.next({} as LogoutResponse);
      observer.complete();
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  sessionInfo(): LoginResponse | null {
    const sessionData = localStorage.getItem(this.tokenKey);
    return sessionData ? (JSON.parse(sessionData) as LoginResponse) : null;
  }
}
