export interface ItemExtratoResponse { 
    /**
     * Data da movimentação
     */
    data: string;
    /**
     * Tipo da movimentação
     */
    tipo?: ItemExtratoResponse.TipoEnum;
    /**
     * Conta origem dos valores
     */
    origem?: string;
    /**
     * Conta destino dos valores
     */
    destino?: string;
    valor?: number;
}
export namespace ItemExtratoResponse {
    export const TipoEnum = {
        Saque: 'saque',
        Depsito: 'depósito',
        Transferncia: 'transferência'
    } as const;
    export type TipoEnum = typeof TipoEnum[keyof typeof TipoEnum];
}


