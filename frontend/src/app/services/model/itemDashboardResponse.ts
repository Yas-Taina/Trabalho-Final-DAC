import { DadoConta } from './dadoConta';
import { DadoGerente } from './dadoGerente';


export interface ItemDashboardResponse { 
    gerente?: String;
    clientes?: number;
    /**
     * Saldo positivo das suas contas
     */
    saldo_positivo?: number;
    /**
     * Saldo negativo das suas contas
     */
    saldo_negativo?: number;
}

