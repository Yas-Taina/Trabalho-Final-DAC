import { ContaResponse, DadosClienteResponse } from "../../model";

// não pode ser repassada diretamente para as telas, é um equivalente do que seria o modelo no backend
export interface Cliente extends DadosClienteResponse { 
    id: string;
    dadosConta?: ContaResponse;
    status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
    rejeicaoMotivo?: string;
}