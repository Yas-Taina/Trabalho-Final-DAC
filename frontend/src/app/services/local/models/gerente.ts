export type TipoGerente = 'ADMINISTRADOR' | 'GERENTE';

export interface Gerente {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  tipo: TipoGerente;
  senha?: string;
}
