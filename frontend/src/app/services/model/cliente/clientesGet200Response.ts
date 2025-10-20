import { ClienteResponse } from "./clienteResponse";
import { DadosClienteResponse } from "./dadosClienteResponse";
import { ClienteParaAprovarResponse } from "./clienteParaAprovarResponse";

/**
 * @type ClientesGet200Response
 * @export
 */
export type ClientesGet200Response =
  | Array<ClienteParaAprovarResponse>
  | Array<ClienteResponse>
  | Array<DadosClienteResponse>;
