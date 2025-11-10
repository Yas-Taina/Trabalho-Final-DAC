import axios from 'axios';
import { SERVICES } from '../config/services.js';

export async function getClienteDetalhesCompletos(req, res, next) {
    const { cpf } = req.params;
    let clienteData = null;
    let contaData = null;

    try {
        console.log(`[Composition] Buscando Cliente ${cpf} no MS Cliente...`);

        const clienteResponse = await axios.get(
            `${SERVICES.CLIENTE.URL}/${cpf}`,
            { headers: { Authorization: req.headers.authorization } }
        );
        clienteData = clienteResponse.data;

        if (!clienteData) {
            return res.status(404).json({ message: "Cliente não encontrado." });
        }

        console.log(`[Composition] Buscando Conta para o Cliente ${cpf} no MS Conta...`);

        const contaResponse = await axios.get(
            `${SERVICES.CONTA.URL}/cliente/${cpf}`,
            { headers: { Authorization: req.headers.authorization } }
        );
        contaData = contaResponse.data;

        const detalhesCompletos = {
            ...clienteData,
            conta: contaData
        };

        console.log(`[Composition] Composição concluída com sucesso para Cliente ${cpf}.`);
        return res.status(200).json(detalhesCompletos);

    } catch (error) {
        console.error(`[Composition ERROR] Falha ao compor dados para ${cpf}:`, error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                error: "Erro no serviço downstream",
                service: error.config.url.includes(SERVICES.CLIENTE.URL) ? 'CLIENTE' : 'CONTA',
                details: error.response.data || error.message
            });
        }

        next(error);
    }
}