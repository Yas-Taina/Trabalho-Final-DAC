import { ClienteResponse } from "./clienteResponse";
import { DadoGerente } from "./dadoGerente";

export interface LoginResponse { 
    token: string;
    tokenType: string;
    tipo: "CLIENTE" | "GERENTE" | "ADMIN";
    usuario: ClienteResponse | DadoGerente;
}

export interface LogoutResponse { 
    cpf?: string;
    nome?: string;
    email?: string;
    tipo?: string;
}

