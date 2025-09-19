import { ContaResponse, DadosClienteResponse } from "../../model";
import { Endereco } from "../../model/endereco";

export interface Cliente extends DadosClienteResponse { 
    id: string; //?
    dadosConta: ContaResponse;
    status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
}