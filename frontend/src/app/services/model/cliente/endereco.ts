export interface Endereco {
  tipo: string; // rua, avenida, etc
  logradouro: string;
  numero: string;
  complemento?: string;
  cep: string;
  cidade: string;
  estado: string;
}
