import { Router } from "express";
import ClientesController from "../controllers/clientesController.js";
import SagaController from "../controllers/sagaController.js";
import CompositionController from "../controllers/compositionController.js";

const router = Router();

router.get("/:cpf", CompositionController.buscarClienteComContaPorCPF);

router.post("/:cpf/aprovar", SagaController.aprovar);

router.post("/", SagaController.autocadastrar);

router.use("/", ClientesController.proxy);

export default router;
