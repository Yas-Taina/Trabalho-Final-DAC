import { DadosClienteResponse } from "./dadosClienteResponse";
import { Endereco } from "./endereco";

export interface PerfilInfo { 
    nome?: string;
    email?: string;
    salario?: number;
    endereco?: Endereco;
    CEP?: string;
    cidade?: string;
    estado?: string;
}

