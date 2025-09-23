import { DadoGerente } from "../../model";

export interface Gerente extends DadoGerente {
  id: string;
  senha?: string;
  ativo?: boolean;
}
