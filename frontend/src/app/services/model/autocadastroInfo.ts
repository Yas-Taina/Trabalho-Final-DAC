import { Endereco } from "./endereco";

export interface AutocadastroInfo {
  cpf?: string;
  email?: string;
  nome?: string;
  salario?: number;
  telefone?: string;
  endereco?: Endereco;
}
