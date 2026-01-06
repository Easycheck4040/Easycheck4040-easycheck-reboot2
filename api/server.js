import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

// Configuração Básica de CORS
app.use(cors({
  origin: ["http://localhost:5173", "https://easycheckglobal.com", "https://www.easycheckglobal.com"],
  methods: ["GET", "POST"]
}));

app.use(express.json());

// ROTA DE TESTE (Para veres se o servidor está vivo)
app.get("/", (req, res) => {
  res.send("🚀 EasyCheck API Online! (Modo de Manutenção)");
});

// ROTA DO CHAT (Desativada temporariamente para evitar erros de chaves)
app.post('/api/chat', (req, res) => {
  res.status(503).json({ error: "IA em manutenção. Voltamos amanhã!" });
});

app.listen(port, () => {
  console.log(`✅ Servidor estável a correr na porta ${port}`);
});