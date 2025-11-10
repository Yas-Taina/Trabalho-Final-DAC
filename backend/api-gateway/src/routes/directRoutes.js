import express from "express";
import { SERVICES } from "../config/services.js";
import { createServiceProxy } from "../utils/proxyHelper.js";

const router = express.Router();

router.use("/contas", createServiceProxy(SERVICES.CONTA, "/api/contas"));
router.use("/gerentes", createServiceProxy(SERVICES.GERENTE, "/api/gerentes"));
router.use("/auth", createServiceProxy(SERVICES.AUTH, "/api/auth"));
router.use("/clientes", createServiceProxy(SERVICES.CLIENTE, "/api/clientes"));

export default router;