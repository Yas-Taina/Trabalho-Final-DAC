import { ItemExtratoResponse } from "./itemExtratoResponse";

export interface ExtratoResponse {
  conta?: string;
  saldo?: number;
  movimentacoes?: Array<ItemExtratoResponse>;
}
