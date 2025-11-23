import { Router } from "express";
import ClientesController from "../controllers/clientesController.js";
import SagaController from "../controllers/sagaController.js";
import CompositionController from "../controllers/compositionController.js";

const router = Router();

router.get("/", (req, res, next) => {
  if (req.query.filtro === 'melhores_clientes') {
    return CompositionController.buscarMelhoresClientes(req, res, next);
  }

  if (!req.query.filtro || req.query.filtro === 'adm_relatorio_clientes') {
    return CompositionController.buscarTodosClientes(req, res, next);
  }
  
  next();
});

router.get("/:cpf", CompositionController.buscarClienteComContaPorCPF);

router.post("/:cpf/aprovar", SagaController.aprovar);

router.put("/:cpf", SagaController.atualizarPerfil);

router.post("/", SagaController.autocadastrar);

router.use("/", ClientesController.proxy);

export default router;
