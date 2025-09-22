import { Endereco } from "./endereco";
import { PerfilInfo } from "./perfilInfo";

export interface DadosClienteResponse { 
    cpf?: string;
    nome?: string;
    email?: string;
    telefone?: string;
    endereco?: Endereco;
    salario?: number;
    conta?: string;
    saldo?: string;
    limite?: number;
    gerente?: string;
    gerente_nome?: string;
    gerente_email?: string;
}

export function toPerfilInfo(cliente: DadosClienteResponse): PerfilInfo {
  return {
    nome: cliente.nome,
    email: cliente.email,
    salario: cliente.salario,
    endereco: cliente.endereco,
    CEP: cliente.endereco?.cep,   // assuming Endereco has `cep`
    cidade: cliente.endereco?.cidade,
    estado: cliente.endereco?.estado,
  };
}