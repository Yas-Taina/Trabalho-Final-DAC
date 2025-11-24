import axios from "axios";
import "../config/axios-logger.js";

import { SERVICES } from "../config/services.js";

class SagaController {
  async autocadastrar(req, res) {
    try {

     const clienteExistente = await axios.get(
        `${SERVICES.CLIENTE}/${req.body.cpf}/exists`,
         {}
     );

        if (clienteExistente.data === true) {
            return res.status(409).json({ message: "Cliente já cadastrado ou aguardando aprovação, CPF duplicado" });
        }

      const response = await axios.post(
          `${SERVICES.SAGA}/clientes`,
          req.body,
          { headers: {
              ...req.headers
            } }
      );

      return res.status(response.status).json(response.data);

    } catch (err) {
      return res.status(err.response?.status || 500).json(err.response?.data);
    }
  }

  async aprovar(req, res) {
    try {
      const { cpf } = req.params;
      const response = await axios.post(
          `${SERVICES.SAGA}/clientes/${cpf}/aprovar`,
          {},
          { headers: {
              ...req.headers
            } }
      );
      return res.status(response.status).json(response.data);
    } catch (err) {
      return res.status(err.response?.status || 500).json(err.response?.data);
    }
  }

  async criarGerente(req, res) {
    try {
      const response = await axios.post(
          `${SERVICES.SAGA}/gerentes`,
          req.body,
          { headers: {
              ...req.headers
            } }
      );

      return res.status(response.status).json(response.data);

    } catch (err) {
      return res.status(err.response?.status || 500).json(err.response?.data);
    }
  }

  async deletarGerente(req, res) {
    try {
      const { cpf } = req.params;
      const response = await axios.delete(
          `${SERVICES.SAGA}/gerentes/${cpf}`,
          { headers: {
              ...req.headers
            } }
      );

      return res.status(response.status).json(response.data);

    } catch (err) {
      return res.status(err.response?.status || 500).json(err.response?.data);
    }
  }

  async atualizarGerente(req, res) {
    try {
      const { cpf } = req.params;
      const response = await axios.put(
          `${SERVICES.SAGA}/gerentes/${cpf}`,
          req.body,
          { headers: {
              ...req.headers
            } }
      );

      return res.status(response.status).json(response.data);

    } catch (err) {
      return res.status(err.response?.status || 500).json(err.response?.data);
    }
  }

async atualizarPerfil(req, res) {
    try {
      const { cpf } = req.params;
      const response = await axios.put(
          `${SERVICES.SAGA}/clientes/${cpf}`,
          req.body,
          { headers: {
              ...req.headers
            } }
      );

      return res.status(response.status).json(response.data);

    } catch (err) {
      return res.status(err.response?.status || 500).json(err.response?.data);
    }
  }

}

export default new SagaController();
