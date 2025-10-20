export interface ItemExtratoResponse {
  data: string;
  tipo?: ItemExtratoResponse.TipoEnum;
  origem?: string;
  destino?: string;
  valor?: number;
}

// TODO: verificar
export namespace ItemExtratoResponse {
  export const TipoEnum = {
    Saque: "saque",
    Depsito: "depósito",
    Transferncia: "transferência",
  } as const;
  export type TipoEnum = (typeof TipoEnum)[keyof typeof TipoEnum];
}
