import express from "express";
import { getClienteDetalhesCompletos } from "../utils/compositionHelper.js";

const router = express.Router();

router.get("/clientes/:cpf", getClienteDetalhesCompletos);

export default router;