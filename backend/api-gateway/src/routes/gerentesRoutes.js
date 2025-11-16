import { Router } from "express";
import GerentesController from "../controllers/gerentesController.js";

const router = Router();
router.use("/", GerentesController.proxy);

export default router;
