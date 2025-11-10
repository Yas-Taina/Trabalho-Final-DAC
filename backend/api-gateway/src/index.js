import express from "express";
import { SERVICES } from "./config/services.js";
import { createServiceProxy } from "./utils/proxyHelper.js";
import { validateTokenMiddleware } from "./middlewares/validateTokenMiddleware.js";
import { sagaMiddleware } from "./middlewares/sagaMiddleware.js";
// import { mainRouter } from "./routes/mainRouter.js";

const app = express();
app.use(express.json());

const router = express.Router();

app.use(validateTokenMiddleware);

// app.use("/api", mainRouter);

app.use("/api/clientes", sagaMiddleware);

app.use("/api/clientes", createServiceProxy(SERVICES.CLIENTE, "/api/clientes"));
app.use("/api", createServiceProxy(SERVICES.AUTH, "/api"));
app.use("/api/contas", createServiceProxy(SERVICES.CONTA, "/api/contas"));
app.use("/api/gerentes", createServiceProxy(SERVICES.GERENTE, "/api/gerentes"));


app.use((err, req, res, next) => {
  console.error("❌ Erro no gateway:", err.message);
  res.status(500).json({ error: "Erro interno no gateway" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API Gateway rodando na porta ${PORT}`));
