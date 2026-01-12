import "dotenv/config";
import express from "express";
import cors from "cors";
import { Groq } from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const app = express();
const port = process.env.PORT || 3000;

// Configuração da Groq (Vai buscar a chave ao Render)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Configuração do Supabase (Vai buscar as chaves ao Render)
// Nota: Certifica-te que estas variáveis existem no Render Environment
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

app.use(cors({
  origin: [
    "https://easycheckglobal.com", 
    "https://www.easycheckglobal.com",
    "http://localhost:5173" // Para testes locais
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Rota de Teste (Ping)
app.get("/", (req, res) => res.send("🚀 EasyCheck API (Cérebro) Online!"));

// ========================================================
// ROTA DA IA (O CÉREBRO)
// ========================================================
app.post('/api/ask-ai', async (req, res) => {
  try {
    // Recebe a mensagem E os dados do contexto (lista de clientes)
    const { userMessage, contextData } = req.body;
    
    // Formata a lista de clientes para a IA ler
    // Se não houver clientes, diz "Nenhum"
    const clientsList = contextData?.clients?.map(c => `ID:${c.id} - Nome:${c.name}`).join(", ") || "Nenhum cliente registado";

    // O Prompt do Sistema (A Inteligência)
    const systemPrompt = `
      Tu és um assistente de ERP experiente (EasyCheck).
      O teu trabalho é EXCLUSIVAMENTE extrair dados do pedido do utilizador e retornar um JSON.
      
      DADOS DO SISTEMA:
      - Clientes Disponíveis: [${clientsList}]
      - Data de Hoje: ${new Date().toLocaleDateString('pt-PT')}

      POSSÍVEIS AÇÕES (Retorna estritamente este formato JSON):
      1. Criar Fatura: { "action": "create_invoice", "client_name": "Nome", "amount": 100.50, "client_id": "ID_SE_EXISTIR_SENAO_NULL" }
      2. Criar Cliente: { "action": "create_client", "client_name": "Nome" }
      3. Registar Despesa: { "action": "create_expense" }
      4. Relatórios: { "action": "view_report", "type": "balancete" }
      5. Conversa Geral: { "action": "chat", "reply": "A tua resposta simpática aqui em PT-PT" }
      
      IMPORTANTE: Se o cliente pedido já existir na lista acima, USA O ID dele no campo client_id.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "llama-3.3-70b-versatile", // Modelo rápido e inteligente
      temperature: 0, // Temperatura 0 para ser preciso e não "alucinar"
      response_format: { type: "json_object" } // FORÇA A RESPOSTA EM JSON
    });

    // Extrai o conteúdo e garante que é enviado como Objeto JSON e não String
    const responseContent = chatCompletion.choices[0]?.message?.content || "{}";
    const jsonResponse = JSON.parse(responseContent);

    res.json(jsonResponse);

  } catch (error) {
    console.error("🔥 Erro na IA:", error);
    // Devolve um JSON de fallback para o frontend não crashar
    res.status(500).json({ action: "chat", reply: "Estou com dificuldades técnicas no servidor. Tenta novamente." });
  }
});

app.listen(port, () => console.log(`✅ Servidor a correr na porta ${port}`));