import { Endereco } from "./endereco";

export interface ClienteResponse {
  cpf?: string;
  nome?: string;
  email?: string;
  endereco?: Endereco;
  conta?: string;
  saldo?: number;
  limite?: number;
}
