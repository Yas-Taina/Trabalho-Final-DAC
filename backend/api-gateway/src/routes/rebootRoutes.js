import express from "express";
import RebootController from "../controllers/rebootController.js";

const router = express.Router();

router.get("/", RebootController.rebootAll.bind(RebootController));

export default router;
