import axios from "axios";
import "../config/axios-logger.js";

import { SERVICES } from "../config/services.js";

class ClientesController {

async proxy(req, res) {
  try {
    const response = await axios({
      method: req.method,
      url: SERVICES.CLIENTE.replace(/\/$/, '') + (req.path === '/' ? '' : req.path),
      data: req.body,
      headers: {
        ...req.headers
    }
    });

    return res.status(response.status).json(response.data);

  } catch (err) {
    return res.status(err.response?.status || 500).json(err.response?.data);
  }
}

}

export default new ClientesController();
