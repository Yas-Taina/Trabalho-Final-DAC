import { DadosClienteResponse } from "./dadosClienteResponse";

export type TipoGerente = 'ADMINISTRADOR' | 'GERENTE';

export interface DadoGerente { 
    /**
     * CPF do gerente
     */
    cpf?: string;
    /**
     * Nome do gerente
     */
    nome?: string;
    /**
     * Email do gerente
     */
    email?: string;

    telefone?: string;
    /**
     * Tipo do gerente
     */
    tipo?: TipoGerente;
    /**
     * Clientes
     */
    clientes?: DadosClienteResponse[];
}