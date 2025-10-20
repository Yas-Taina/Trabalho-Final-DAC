import { Endereco } from "./endereco";
export interface ClienteParaAprovarResponse {
  cpf?: string;
  nome?: string;
  email?: string;
  endereco?: Endereco;
}
