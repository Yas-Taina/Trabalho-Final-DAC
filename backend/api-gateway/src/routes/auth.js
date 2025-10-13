import express from "express";
import { SERVICES } from "../config/services.js";
import { createServiceProxy } from "../utils/proxyHelper.js";


const router = express.Router();

router.use("/", createServiceProxy(SERVICES.AUTH));

export default router;
