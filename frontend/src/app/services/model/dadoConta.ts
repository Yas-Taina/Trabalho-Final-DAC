export interface DadoConta { 
    /**
     * CPF do cliente
     */
    cliente?: string;
    /**
     * Número da conta
     */
    numero?: string;
    /**
     * Saldo da conta
     */
    saldo?: number;
    /**
     * Limite da conta
     */
    limite?: number;
    /**
     * CPF do gerente
     */
    gerente?: string;
    /**
     * Data da Criação da conta
     */
    criacao?: string;
}

