import axios from "axios";
import { SERVICES } from "../config/services.js";

class RebootController {

    async rebootAll(req, res) {
        try {
            const results = {
                auth: null,
                cliente: null,
                gerente: null,
                conta: null
            };
            const errors = [];

            // Reboot Auth
            try {
                const authResponse = await axios.post(`${SERVICES.AUTH}/reboot`);
                results.auth = { status: "success", message: authResponse.data.message };
            } catch (err) {
                errors.push({ service: "auth", error: err.response?.data || err.message });
                results.auth = { status: "failed", error: err.response?.data || err.message };
            }

            // Reboot Cliente
            try {
                const clienteResponse = await axios.post(`${SERVICES.CLIENTE}/reboot`);
                results.cliente = { status: "success", message: clienteResponse.data.message };
            } catch (err) {
                errors.push({ service: "cliente", error: err.response?.data || err.message });
                results.cliente = { status: "failed", error: err.response?.data || err.message };
            }

            // Reboot Gerente
            try {
                const gerenteResponse = await axios.post(`${SERVICES.GERENTE}/reboot`);
                results.gerente = { status: "success", message: gerenteResponse.data.message };
            } catch (err) {
                errors.push({ service: "gerente", error: err.response?.data || err.message });
                results.gerente = { status: "failed", error: err.response?.data || err.message };
            }

            // Reboot Conta
            try {
                const contaResponse = await axios.post(`${SERVICES.CONTA}/reboot`);
                results.conta = { status: "success", message: contaResponse.data.message };
            } catch (err) {
                errors.push({ service: "conta", error: err.response?.data || err.message });
                results.conta = { status: "failed", error: err.response?.data || err.message };
            }

            const statusCode = errors.length === 0 ? 200 : 207; // 207 Multi-Status se houver falhas
            return res.status(statusCode).json({
                message: "Reboot executado",
                results: results,
                errors: errors.length > 0 ? errors : undefined
            });

        } catch (err) {
            return res.status(500).json({ 
                error: "Erro ao executar reboot geral",
                details: err.message 
            });
        }
    }
}

export default new RebootController();
