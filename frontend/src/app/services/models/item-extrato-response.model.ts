export interface ItemExtratoResponse {
  data: string;
  tipo: "saque" | "deposito" | "transferencia";
  origem: string;
  destino: string;
  valor: number;
}
