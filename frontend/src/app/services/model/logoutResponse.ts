import { ClienteResponse } from "./clienteResponse";
import { DadoGerente } from "./dadoGerente";

export interface LoginResponse { 
    token: string;
    tokenType: string;
    tipo: "CLIENTE" | "GERENTE" | "ADMINISTRADOR";
    usuario: ClienteResponse | DadoGerente;
}

export interface LogoutResponse { 
    cpf?: string;
    nome?: string;
    email?: string;
    tipo?: string;
}

