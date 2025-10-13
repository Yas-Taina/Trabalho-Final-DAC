import express from "express";
import authRoutes from "./routes/auth.js";
import clientesRoutes from "./routes/cliente.js";
import contasRoutes from "./routes/conta.js";
import gerentesRoutes from "./routes/gerente.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/contas", contasRoutes);
app.use("/api/gerentes", gerentesRoutes);

app.use((err, req, res, next) => {
  console.error("❌ Erro no gateway:", err.message);
  res.status(500).json({ error: "Erro interno no gateway" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API Gateway rodando na porta ${PORT}`));
