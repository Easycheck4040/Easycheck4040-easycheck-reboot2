import "dotenv/config";
import express from "express";
import cors from "cors";
import { Groq } from "groq-sdk";

const app = express();
const port = process.env.PORT || 10000;

app.use(cors({ origin: "*" }));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.get("/", (req, res) => res.send("🌍 EasyCheck AI Brain is Live"));

app.post('/api/chat', async (req, res) => {
  console.log("📨 Pedido recebido no Cérebro...");

  try {
    const { message, contextData } = req.body;

    // Extração de dados financeiros vindos do Frontend
    const stats = {
        revenue: contextData?.revenue || 0,
        expenses: contextData?.expenses || 0,
        profit: (contextData?.revenue || 0) - (contextData?.expenses || 0),
        pending: contextData?.pending || 0,
        clientsCount: contextData?.clients?.length || 0
    };

    const systemPrompt = `
      You are the Financial Expert AI for EasyCheck ERP. Output MUST be strictly JSON.
      
      --- LANGUAGES & SLANG ---
      Understand PT, EN, ES, FR, IT, DE. Reply in the user's language.
      Convert these to numbers: "paus", "aéreos", "bucks", "pavos", "balles", "k".
      Example: "300 paus" -> 300.00.

      --- REAL-TIME BUSINESS CONTEXT ---
      - Total Invoiced: ${stats.revenue}€
      - Total Expenses: ${stats.expenses}€
      - Current Net Profit: ${stats.profit}€
      - Unpaid Invoices (Pending): ${stats.pending}€
      - Registered Clients: ${stats.clientsCount}
      - Existing Clients List: ${JSON.stringify(contextData?.clients || [])}

      --- LOGIC RULES ---
      1. If the user asks about profit, health, or "how is the company", use the stats above to give a professional analysis.
      2. If money + name are mentioned -> action: "create_invoice".
      3. If only a name is mentioned -> action: "create_client".

      --- JSON FORMATS ---
      A) { "action": "chat", "reply": "Your analysis or answer..." }
      B) { "action": "create_invoice", "client_name": "Name", "amount": 0, "client_id": "UUID or null" }
      C) { "action": "create_client", "client_name": "Name" }
      D) { "action": "view_report", "type": "balancete" }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2, // Um pouco de "calor" para a análise financeira soar natural
      response_format: { type: "json_object" }
    });

    const jsonResponse = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
    console.log("🚀 Resposta IA:", jsonResponse);

    res.json(jsonResponse);

  } catch (error) {
    console.error("🔥 Erro:", error);
    res.status(500).json({ action: "chat", reply: "Erro técnico ao processar inteligência." });
  }
});

app.listen(port, () => console.log(`🚀 Servidor na porta ${port}`));