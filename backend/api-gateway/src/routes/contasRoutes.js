import { Router } from "express";
import ContasController from "../controllers/contasController.js";

const router = Router();
router.use("/", ContasController.proxy);

export default router;
