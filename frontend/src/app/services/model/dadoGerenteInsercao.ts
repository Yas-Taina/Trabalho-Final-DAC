import { TipoGerente } from "./dadoGerente";

export interface DadoGerenteInsercao {
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
  /**
   * Tipo do gerente
   */
  tipo?: TipoGerente;
  /**
   * Senha do novo gerente
   */
  senha?: string;
}
