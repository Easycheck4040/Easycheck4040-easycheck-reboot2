import "dotenv/config";
import express from "express";
import cors from "cors";
import { Groq } from "groq-sdk";
import { createClient } from '@supabase/supabase-client';

const app = express();
const port = process.env.PORT || 3000;

// Configuração da Groq (Vai buscar a chave ao Render)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Configuração do Supabase (Vai buscar as chaves ao Render)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors({
  origin: [
    "https://easycheckglobal.com", 
    "https://www.easycheckglobal.com",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Rota de Teste
app.get("/", (req, res) => res.send("🚀 EasyCheck API (Cérebro) Online!"));

// Rota do Chat IA
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Aqui definimos a personalidade da IA
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "És o assistente IA do EasyCheck, especialista em gestão, contabilidade e fiscalidade portuguesa. Responde de forma profissional e útil." 
        },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Erro na IA:", error);
    res.status(500).json({ error: "Erro ao processar o pedido." });
  }
});

app.listen(port, () => console.log(`✅ Servidor a correr na porta ${port}`));