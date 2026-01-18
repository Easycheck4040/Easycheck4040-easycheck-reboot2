import "dotenv/config";
import express from "express";
import cors from "cors";
import { Groq } from "groq-sdk";

const app = express();
const port = process.env.PORT || 10000;

app.use(cors({ origin: "*" }));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { message, contextData, previousMessages } = req.body;

    // Resumo financeiro rápido para o contexto
    const financialContext = `
      Current Revenue: ${contextData?.revenue || 0}€
      Expenses: ${contextData?.expenses || 0}€
      Clients: ${JSON.stringify(contextData?.clients?.map(c => ({id: c.id, name: c.name})) || [])}
    `;

    const systemPrompt = `
      You are Jarvis, the CTO/AI Assistant of EasyCheck ERP. 
      Your goal is to help the user manage their company via chat.
      
      STATS: ${financialContext}

      RULES:
      1. If the user wants to create an INVOICE but is missing [Client Name] or [Amount], ask for it. Do NOT return action 'create_invoice' until you have both.
      2. If the user provides a Client Name that roughly matches one in the list, use that Client ID.
      3. If the user mentions "Create Client [Name]", return action 'create_client'.
      4. Speak the user's language (PT/EN/FR).

      RESPONSE FORMAT (JSON ONLY):
      {
        "action": "chat" | "create_invoice" | "create_client" | "create_expense",
        "reply": "Text to show the user",
        "data": {
           "client_name": "Tesla",
           "client_id": "uuid-if-found", 
           "amount": 100.50,
           "nif": "optional"
        },
        "missing_info": true (if you need to ask a follow-up question)
      }
    `;

    // Constrói o histórico para a IA ter memória de curto prazo
    const conversation = [
        { role: "system", content: systemPrompt },
        ...(previousMessages || []).map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: message }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: conversation,
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, // Baixa temperatura para ser preciso nos dados
      response_format: { type: "json_object" }
    });

    const jsonResponse = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
    console.log("🤖 Jarvis Action:", jsonResponse);

    res.json(jsonResponse);

  } catch (error) {
    console.error("🔥 Server Error:", error);
    res.status(500).json({ action: "chat", reply: "Estou com dificuldades de conexão ao meu cérebro central." });
  }
});

app.listen(port, () => console.log(`🚀 Jarvis listening on ${port}`));