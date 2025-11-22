import axios from "axios";
import "../config/axios-logger.js";

import {SERVICES} from "../config/services.js";

class CompositionController {

	async buscarClienteComContaPorCPF(req, res) {
		try {
      const {cpf} = req.params;

			const clientePromise = axios.get(
				`${SERVICES.CLIENTE}/${cpf}`,
				{
					headers: {
						...req.headers
					}
				}
			);

			const clienteResponse = await clientePromise;

			const [contasResponse, gerenteResponse] = await Promise.all([
				axios.get(
					`${SERVICES.CONTA}/cliente/${clienteResponse.data.id}`,
					{ headers: { ...req.headers } }
				),
				axios.get(
					`${SERVICES.GERENTE}/${clienteResponse.data.cpf_gerente}`,
					{ headers: { ...req.headers } }
				)
			]);

			return res.json({
				cpf: clienteResponse.data.cpf,
				nome: clienteResponse.data.nome,
				telefone: clienteResponse.data.telefone,
				email: clienteResponse.data.email,
				endereco: clienteResponse.data.endereco,
				cidade: clienteResponse.data.cidade,
				estado: clienteResponse.data.estado,
				CEP: clienteResponse.data.CEP,
				salario: clienteResponse.data.salario,

				conta: contasResponse.data.numeroConta,
				saldo: contasResponse.data.saldo,
				limite: contasResponse.data.limite,

				gerente: clienteResponse.data.cpf_gerente,
				gerente_nome: gerenteResponse.data.nome,
				gerente_email: gerenteResponse.data.email
			});

		} catch (err) {
			console.error(err);
			return res.status(err.response?.status || 500).json(err.response?.data);
		}
	}

	async buscarMelhoresClientes(req, res) {
		try {
			const clientesResponse = await axios.get(
				`${SERVICES.CLIENTE}`,
				{
					headers: {
						...req.headers
					},
				}
			);

			const contasResponse = await axios.get(
				`${SERVICES.CONTA}`,
				{
					headers: {
						...req.headers
					}
				}
			);

			const cpfGerente = clientesResponse.data[0].cpf_gerente;

			const gerenteResponse = await axios.get(
				`${SERVICES.GERENTE}/${cpfGerente}`,
				{
					headers: {
						...req.headers
					}
				}
			);

			const contasGerente = contasResponse.data.filter((conta) => conta.cpfGerente == gerenteResponse.data.cpf);

			const melhores3Contas = contasGerente
				.sort((a, b) => b.saldo - a.saldo)
				.slice(0, 3);

			const melhoresClientes = melhores3Contas.map((conta) => {
				const cliente = clientesResponse.data.find((c) => c.id == conta.clienteId);
				return {
					...cliente,
          conta: conta.numeroConta,
					saldo: conta.saldo,
          limite: conta.limite
				};
			});

			return res.json(melhoresClientes);
		} catch (err) {
			console.error(err);
			return res.status(err.response?.status || 500).json(err.response?.data);
		}
	}

  async buscarTodosClientes(req, res) {
    try {
			const [clienteResponse, contasResponse, gerenteResponse] = await Promise.all([
        axios.get(
          `${SERVICES.CLIENTE}`,
          { headers: { ...req.headers } }
        ),
				axios.get(
					`${SERVICES.CONTA}`,
					{ headers: { ...req.headers } }
				),
				axios.get(
					`${SERVICES.GERENTE}`,
					{ headers: { ...req.headers } }
				)
			]);

      const result = [];

      for (const cliente of clienteResponse.data) {
        const conta = contasResponse.data.find((c) => c.clienteId == cliente.id);
        const gerente = gerenteResponse.data.find((g) => g.cpf == cliente.cpf_gerente);

        result.push({
          cpf: cliente.cpf,
          nome: cliente.nome,
          telefone: cliente.telefone,
          email: cliente.email,
          endereco: cliente.endereco,
          cidade: cliente.cidade,
          estado: cliente.estado,
          CEP: cliente.CEP,
          salario: cliente.salario,

          conta: conta.numeroConta,
          saldo: conta.saldo,
          limite: conta.limite,

          gerente: cliente.cpf_gerente,
          gerente_nome: gerente.nome,
          gerente_email: gerente.email
        });
      }

      return res.json(result);
		} catch (err) {
			console.error(err);
			return res.status(err.response?.status || 500).json(err.response?.data);
		}
  }
}

export default new CompositionController();
