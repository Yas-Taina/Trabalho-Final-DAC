import axios from "axios";
import "../config/axios-logger.js";

import { SERVICES}  from "../config/services.js";

class SagaController {
  async autocadastrar(req, res) {
    try {
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
}

export default new SagaController();
