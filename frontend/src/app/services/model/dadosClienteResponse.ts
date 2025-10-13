import { Endereco } from "./endereco";

export interface DadosClienteResponse {
  cpf?: string;
  nome?: string;
  email?: string;
  endereco?: Endereco;
  telefone?: string;
  salario?: number;
  conta?: string;
  saldo?: string;
  limite?: number;
  gerente?: string;
  gerente_nome?: string;
  gerente_email?: string;
}
