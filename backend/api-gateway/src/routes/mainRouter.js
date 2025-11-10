import express from "express";
import directRouter from "./directRoutes.js";
import sagaRouter from "./sagaRoutes.js";
import compositionRouter from "./compositionRoutes.js";

const router = express.Router();

router.use(sagaRouter);

router.use(compositionRouter);

router.use(directRouter);

export default router;