import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { Groq } from "groq-sdk";

// --- IMPORTAÇÕES LOCAIS ---
import { supabase } from "./services/supabase.js";
import { scanInvoiceFile } from "./services/ocr.js";
import { likeInsensitive } from "./utils/helpers.js";

const app = express();
const upload = multer();
const port = process.env.PORT || 3000;

// Configuração da Groq (Garante que a chave está no Environment do Render)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ CONFIGURAÇÃO DE CORS PARA PRODUÇÃO
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:5174", 
    "https://easycheckglobal.com",
    "https://www.easycheckglobal.com"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: "10mb" }));

app.get("/", (_, res) => res.send("🚀 EasyCheck API Online!"));

// ==========================================
// 🤖 ROTA DO CHAT IA
// ==========================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) return res.status(400).json({ error: "Mensagem vazia." });

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "És o assistente IA do EasyCheck. Especialista em gestão e contabilidade. Responde de forma curta e profissional em Português de Portugal." 
        },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("❌ Erro Groq:", error.message);
    res.status(500).json({ error: "Erro ao processar a resposta da IA." });
  }
});

// --- RESTANTES ROTAS (Mantidas como originais) ---
app.post("/invoices/scan", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) throw new Error("Ficheiro não enviado.");
    const { text, fields } = await scanInvoiceFile({ buffer: file.buffer, mimetype: file.mimetype });
    res.json({ ok: true, extracted_text: text, fields });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

app.listen(port, () => {
  console.log(`✅ Servidor EasyCheck na porta ${port}`);
});