import axios from "axios";
import "../config/axios-logger.js";

import { SERVICES } from "../config/services.js";

class AuthController {

    async login(req, res) {
        try {
            const response = await axios.post(
                `${SERVICES.AUTH}/login`,
                req.body
            );
            return res.status(response.status).json(response.data);

        } catch (err) {
            return res.status(err.response?.status || 500).json(err.response?.data);
        }
    }

    async logout(req, res) {
        try {
            const response = await axios.post(
                `${SERVICES.AUTH}/logout`,
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

export default new AuthController();
