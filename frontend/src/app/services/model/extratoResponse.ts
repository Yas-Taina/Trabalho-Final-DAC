import { ItemExtratoResponse } from "./itemExtratoResponse";

export interface ExtratoResponse {
  /**
   * Número da conta
   */
  conta?: string;
  /**
   * Saldo final da conta
   */
  saldo?: number;
  movimentacoes?: Array<ItemExtratoResponse>;
}
