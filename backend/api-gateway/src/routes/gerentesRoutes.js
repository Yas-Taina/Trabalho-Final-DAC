import { Router } from "express";
import GerentesController from "../controllers/gerentesController.js";
import CompositionController from "../controllers/compositionController.js";

const router = Router();

router.get("/", (req, res, next) => {
  if (req.query.numero === 'dashboard') {
    return CompositionController.gerarDashboardGerentes(req, res, next);
  }
  
  next();
});

router.use("/", GerentesController.proxy);

export default router;
