import { HistoricoMovimentacao } from './historico';

export interface Conta {
  numero: string;
  dataCriacao: string;
  saldo: number;
  limite: number;
  gerenteCpf: string;
  historico?: HistoricoMovimentacao[];
}
