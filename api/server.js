import "dotenv/config";
import express from "express";
import cors from "cors";
import { Groq } from "groq-sdk";

const app = express();
const port = process.env.PORT || 8000; // Koyeb usa 8000

// --- 1. A CORREÇÃO DO CORS (CRÍTICO) ---
// Isto diz ao servidor: "Aceita pedidos de QUALQUER sítio (*)"
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Garante que pedidos de verificação (OPTIONS) passam sempre
app.options('*', cors());

app.use(express.json());

// --- 2. CONFIGURAÇÃO GROQ ---
// Mantemos a Groq SDK porque é melhor que usar 'fetch' manual
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Rota de Teste
app.get("/", (req, res) => res.send("✅ Backend EasyCheck está a bombar! Rota /api/chat pronta."));

// --- 3. A ROTA DO CHAT (ALINHADA COM O CONSELHO) ---
app.post('/api/chat', async (req, res) => {
  console.log("📨 Pedido recebido na rota /api/chat"); // Log para debug

  try {
    const { message, contextData } = req.body;

    // Se não houver chave, avisar logo
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY em falta no servidor.");
    }

    // Criar o prompt do sistema com os dados dos clientes
    const clientsList = contextData?.clients?.map(c => `ID:${c.id}-${c.name}`).join(", ") || "Sem clientes";
    const systemPrompt = `
      És o assistente EasyCheck. Responde JSON.
      Dados: [${clientsList}].
      Ações: create_invoice, create_client, create_expense, view_report, chat.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    
    // Devolve JSON direto
    res.json(JSON.parse(content));

  } catch (error) {
    console.error("🔥 Erro no Backend:", error.message);
    res.status(500).json({ action: "chat", reply: "Erro técnico no servidor." });
  }
});

app.listen(port, () => console.log(`🚀 Servidor na porta ${port}`));