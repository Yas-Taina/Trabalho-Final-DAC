import { ContaResponse, DadosClienteResponse } from "../../model";

export interface Cliente extends DadosClienteResponse {
  id: string;
  senha?: string;
  dadosConta?: ContaResponse;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  rejeicaoMotivo?: string;
}