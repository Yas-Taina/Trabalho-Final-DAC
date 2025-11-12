import { Usuario } from "./usuario";

export interface LoginResponse {
  access_token: String;
  token_type: String;
  tipo: "CLIENTE" | "GERENTE" | "ADMINISTRADOR" | null;
  usuario: Usuario;
}
