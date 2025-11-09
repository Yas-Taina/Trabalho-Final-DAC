import { ItemExtratoResponse } from "./item-extrato-response.model";
export interface ExtratoResponse {
  conta: string;
  saldo: number;
  movimentacoes: ItemExtratoResponse[];
}
