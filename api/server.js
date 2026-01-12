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
  console.log("📨 Pedido recebido...");

  try {
    const { message, contextData } = req.body;

    // --- A CORREÇÃO ESTÁ AQUI (O Prompt Rígido) ---
    const systemPrompt = `
      És o assistente IA do ERP EasyCheck.
      O teu trabalho é responder EXCLUSIVAMENTE em formato JSON.
      
      IMPORTANTE: Tens de usar ESTRITAMENTE estas chaves no JSON. Não inventes outras.

      CASO 1: Conversa normal
      Retorna: { "action": "chat", "reply": "A tua resposta aqui..." }

      CASO 2: Criar Fatura (se o user pedir)
      Retorna: { "action": "create_invoice", "client_name": "Nome", "amount": 0, "client_id": "ID se existir" }

      CASO 3: Criar Cliente
      Retorna: { "action": "create_client", "client_name": "Nome" }

      CASO 4: Despesa
      Retorna: { "action": "create_expense" }

      CASO 5: Relatório
      Retorna: { "action": "view_report", "type": "balancete" }

      Dados do Contexto (Clientes): ${JSON.stringify(contextData?.clients || [])}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0, // Zero criatividade no formato, apenas lógica
      response_format: { type: "json_object" }
    });

    const rawContent = chatCompletion.choices[0]?.message?.content || "{}";
    const jsonResponse = JSON.parse(rawContent);

    // LOG PARA CONFIRMAR SE FICOU CORRIGIDO
    console.log("🚀 Resposta enviada ao site:", jsonResponse);

    res.json(jsonResponse);

  } catch (error) {
    console.error("🔥 Erro:", error);
    res.status(500).json({ action: "chat", reply: "Erro técnico no servidor." });
  }
});

app.listen(port, () => console.log(`🚀 Servidor na porta ${port}`));