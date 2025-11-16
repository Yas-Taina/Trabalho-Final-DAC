import express from "express";
import clientesRoutes from "./routes/clientesRoutes.js";
import contasRoutes from "./routes/contasRoutes.js";
import gerentesRoutes from "./routes/gerentesRoutes.js";
//import rebootRoutes from "./routes/rebootRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { validateTokenMiddleware } from "./middlewares/validateTokenMiddleware.js";

const app = express();
app.use(express.json());

app.use(validateTokenMiddleware);

app.use("/api/clientes", clientesRoutes);
app.use("/api/contas", contasRoutes);
app.use("/api/gerentes", gerentesRoutes);
//app.use("/api/reboot", rebootRoutes);
app.use("/api", authRoutes);



app.use((err, req, res, next) => {
  console.error("❌ Erro no gateway:", err.message);
  res.status(500).json({ error: "Erro interno no gateway" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API Gateway rodando na porta ${PORT}`));
