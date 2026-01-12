import "dotenv/config";
import express from "express";
import cors from "cors";
import { Groq } from "groq-sdk";

const app = express();
const port = process.env.PORT || 10000; // Render costuma usar 10000

app.use(cors({ origin: "*" }));
app.use(express.json());

// LOG 1: Verificar se a chave existe logo ao arrancar
console.log("🏁 INICIANDO SERVIDOR...");
if (process.env.GROQ_API_KEY) {
    console.log(`🔑 Chave Groq detetada: ${process.env.GROQ_API_KEY.substring(0, 5)}...`);
} else {
    console.error("❌ ERRO CRÍTICO: Nenhuma chave GROQ_API_KEY encontrada nas variáveis!");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/chat', async (req, res) => {
  console.log("--- 📨 NOVO PEDIDO RECEBIDO ---");

  try {
    // LOG 2: Ver o que o Frontend enviou
    console.log("📦 Dados recebidos (Body):", JSON.stringify(req.body));
    
    const { message, contextData } = req.body;

    if (!message) {
        console.error("❌ Erro: O campo 'message' veio vazio.");
        return res.status(400).json({ reply: "Erro: Mensagem vazia." });
    }

    // LOG 3: Preparar para chamar a IA
    console.log("🤖 A contactar a Groq (Llama-3.3)...");

    const systemPrompt = `
      És o assistente EasyCheck. Responde APENAS JSON.
      Contexto: ${JSON.stringify(contextData?.clients || [])}
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

    // LOG 4: A IA respondeu?
    const rawContent = chatCompletion.choices[0]?.message?.content;
    console.log("✅ Resposta Bruta da IA:", rawContent);

    if (!rawContent) throw new Error("A IA devolveu uma resposta vazia.");

    // LOG 5: Tentar converter para JSON
    const jsonResponse = JSON.parse(rawContent);
    console.log("🚀 Resposta JSON final:", jsonResponse);

    res.json(jsonResponse);

  } catch (error) {
    // LOG DE ERRO DETALHADO
    console.error("🔥 ERRO FATAL:", error);
    
    // Devolvemos um JSON válido de erro para o site não ficar pendurado
    res.status(500).json({ 
        action: "chat", 
        reply: `Erro no servidor: ${error.message}` 
    });
  }
});

app.listen(port, () => console.log(`🚀 Servidor a ouvir na porta ${port}`));