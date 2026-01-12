import "dotenv/config";
import express from "express";
import cors from "cors";
import { Groq } from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const app = express();
const port = process.env.PORT || 8000; // Koyeb gosta da porta 8000

// --- CONFIGURAÇÃO DE SEGURANÇA (CORS) ---
// Isto permite que o teu site fale com o servidor sem bloqueios
app.use(cors({
  origin: "*", // ⚠️ PERMISSIVO PARA TESTES (Depois podes restringir ao teu domínio)
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Clientes (Se as chaves falharem, usa strings vazias para não crashar)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "sem_chave" });
// const supabase = createClient(...) // Podes manter se usares

// Rota de Teste Simples (para veres se o servidor está vivo)
app.get("/", (req, res) => {
  res.send("✅ EasyCheck API está online! A rota /api/ask-ai está à espera.");
});

// --- A ROTA QUE ESTÁ A DAR 404 ---
app.post('/api/ask-ai', async (req, res) => {
  console.log("📨 Pedido recebido em /api/ask-ai"); // Log para veres no painel do Koyeb
  
  try {
    const { userMessage, contextData } = req.body;
    
    // Validar se a chave existe antes de tentar
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY não configurada no servidor.");
    }

    const systemPrompt = `
      Tu és um assistente de ERP. Responde APENAS JSON.
      Contexto: ${JSON.stringify(contextData?.clients || [])}
      Ações: create_invoice, create_client, create_expense, view_report, chat.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "{}";
    res.json(JSON.parse(responseContent));

  } catch (error) {
    console.error("🔥 Erro no servidor:", error.message);
    // Retorna erro 500 mas com JSON válido para o frontend não crashar
    res.status(500).json({ action: "chat", reply: "Erro técnico no servidor (Backend)." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor a correr na porta ${port}`);
});