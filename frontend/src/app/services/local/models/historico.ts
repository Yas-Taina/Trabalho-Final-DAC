export type TipoMovimento = "DEPOSITO" | "SAQUE" | "TRANSFERENCIA";

export interface HistoricoMovimentacao {
  dataHora: string;
  tipo: TipoMovimento;
  clienteOrigemCpf?: string;
  clienteDestinoCpf?: string;
  valor: number;
}
