import "dotenv/config";
import express from "express";
import cors from "cors";
import { Groq } from "groq-sdk";

const app = express();
// O Koyeb/Render define a PORT automaticamente. Localmente usa 3000.
const port = process.env.PORT || 3000;

// 1. SEGURANÇA (CORS) - Permite que o teu Frontend fale com este Backend
app.use(cors({
  origin: "*", // Permite todas as origens (ideal para evitar erros em testes)
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 2. CONFIGURAÇÃO DA IA (GROQ)
// A chave tem de estar nas "Environment Variables" do Render/Koyeb
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Rota de Teste (Ping)
app.get("/", (req, res) => res.send("✅ Backend EasyCheck está Online!"));

// ==================================================================
// ROTA PRINCIPAL (Como descrito no relatório)
// Endpoint: POST /api/chat
// ==================================================================
app.post('/api/chat', async (req, res) => {
  try {
    console.log("📨 Pedido recebido do Frontend...");

    // O Frontend envia: { message: "Contexto + Pergunta", contextData: {...} }
    const { message, contextData } = req.body;

    // Se quisermos manter a inteligência de criar faturas, injetamos este System Prompt
    const clientsList = contextData?.clients?.map(c => `ID:${c.id}-${c.name}`).join(", ") || "Sem clientes";
    
    const systemPrompt = `
      Tu és o assistente IA do EasyCheck (ERP).
      O teu objetivo é responder em formato JSON para executar ações.
      
      DADOS: Clientes disponíveis: [${clientsList}].
      
      AÇÕES POSSÍVEIS (Responde APENAS o JSON):
      - Criar Fatura: { "action": "create_invoice", "client_name": "Nome", "amount": 0, "client_id": "ID_ou_null" }
      - Criar Cliente: { "action": "create_client", "client_name": "Nome" }
      - Despesa: { "action": "create_expense" }
      - Relatório: { "action": "view_report", "type": "balancete" }
      - Chat Normal: { "action": "chat", "reply": "A tua resposta em texto aqui" }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message } // A mensagem que vem do Dashboard.tsx
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      response_format: { type: "json_object" } // Força JSON
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "{}";
    
    // Devolvemos exatamente o formato que o Frontend espera
    // Nota: O teu relatório dizia que devolvia { reply: ... }, aqui devolvemos o objeto completo
    res.json(JSON.parse(responseContent));

  } catch (error) {
    console.error("🔥 Erro no Backend:", error);
    res.status(500).json({ action: "chat", reply: "Erro de conexão com o cérebro da IA." });
  }
});

app.listen(port, () => console.log(`🚀 Servidor a correr na porta ${port}`));