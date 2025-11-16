import axios from "axios";
import { SERVICES } from "../config/services.js";

class GerentesController {

    async proxy(req, res) {
        try {
            const response = await axios({
                method: req.method,
                url: SERVICES.GERENTE + req.path,
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

export default new GerentesController();
