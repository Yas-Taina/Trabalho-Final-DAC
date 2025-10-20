import { DadosClienteResponse } from "../cliente/dadosClienteResponse";

export type TipoGerente = "ADMINISTRADOR" | "GERENTE";

export interface DadoGerente {
  cpf?: string;
  nome?: string;
  email?: string;
  telefone?: string;
  tipo?: TipoGerente;
  clientes?: DadosClienteResponse[];
}
