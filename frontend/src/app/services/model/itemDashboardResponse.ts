import { DadoConta } from './dadoConta';
import { DadoGerente } from './dadoGerente';


export interface ItemDashboardResponse { 
    gerente?: DadoGerente;
    clientes?: Array<DadoConta>;
    /**
     * Saldo positivo das suas contas
     */
    saldo_positivo?: number;
    /**
     * Saldo negativo das suas contas
     */
    saldo_negativo?: number;
}

