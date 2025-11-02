import {SERVICES} from "../config/services.js";

export async function sagaMiddleware(req, res, next) {
    try {
        const sagaPaths = [
            { method: "POST", regex: /^\/$/ }, // POST /clientes -> /sagas/clientes
            { method: "POST", regex: /^\/[^/]+\/aprovar$/ } // POST /clientes/:cpf/aprovar -> /sagas/clientes/:cpf/aprovar
        ];

        const matched = sagaPaths.find(p => p.method === req.method && p.regex.test(req.path));

        if (matched) {
            const sagaPath = `/sagas/clientes${req.path}`;

            // Chama o Saga Service via proxy interno
            const target = SERVICES.SAGA;
            const fetchUrl = `${target}${sagaPath}`;

            const fetchOptions = {
                method: req.method,
                headers: { ...req.headers },
                body: req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : undefined
            };

            const response = await fetch(fetchUrl, fetchOptions);
            const data = await response.text();
            return res.status(response.status).send(data);
        }

        next();
    } catch (err) {
        console.error("❌ Erro ao redirecionar para saga:", err);
        res.status(500).json({ error: "Erro no redirecionamento para saga" });
    }
});