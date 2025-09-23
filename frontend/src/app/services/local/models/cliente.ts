import { Endereco } from './endereco';
import { Conta } from './conta';

export type EstadoCliente = 'AGUARDANDO' | 'APROVADO' | 'RECUSADO';

export interface Cliente {
  nome: string;
  email: string;
  cpf: string;
  endereco: Endereco;
  telefone: string;
  salario: number;
  estado: EstadoCliente;
  dadosConta?: Conta;
  senha?: string; 
  gerenteCpf?: string;
  motivoRecusa?: string;
}
