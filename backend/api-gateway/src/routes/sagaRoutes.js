import express from "express";
import { sagaMiddleware } from "../middlewares/sagaMiddleware.js";

const router = express.Router();

router.post("/clientes", sagaMiddleware);
// router.post("/gerentes", sagaMiddleware);

export default router;