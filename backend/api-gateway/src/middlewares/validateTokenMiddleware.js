import fetch from "node-fetch";
import { SERVICES } from "./../config/services.js";

export async function validateTokenMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const response = await fetch(`${SERVICES.AUTH}/token/validate?token=${token}`);
        
        if (!response.ok) {
            return res.status(response.status).json({ error: "Falha na validação do token" });
        }
        
        const isValid = await response.json();

        if (!isValid) {
            return res.status(401).json({ error: "Token inválido ou revogado" });
        }

        next();
    } catch (err) {
        console.error("❌ Erro ao validar token:", err.message);
        return res.status(500).json({ error: "Erro na validação do token" });
    }
}
