import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { Groq } from "groq-sdk";

// --- IMPORTAÇÕES LOCAIS ---
import { supabase } from "./services/supabase.js";
import { sendMail } from "./services/mailer.js";
import { scanInvoiceFile } from "./services/ocr.js";
import { likeInsensitive } from "./utils/helpers.js";

const app = express();
const upload = multer();
const port = process.env.PORT || 3000;

// Configuração da Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ CONFIGURAÇÃO DE CORS PARA TESTES (Permite localhost e o teu domínio real)
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://easycheckglobal.com"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: "10mb" }));

app.get("/", (_, res) => res.send("🚀 Laboratório IA EasyCheck - Online!"));

// ==========================================
// 🤖 ROTA DE TESTE IA (Focada em Debug)
// ==========================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Log para sabermos que o pedido chegou ao servidor
    console.log("-----------------------------------------");
    console.log("📥 MENSAGEM RECEBIDA DO FRONTEND:", message);

    if (!message) {
      console.log("⚠️ AVISO: Mensagem vazia recebida.");
      return res.status(400).json({ error: "Mensagem vazia." });
    }

    console.log("⏳ A ENVIAR PARA GROQ...");
    
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "És o assistente IA do EasyCheck. Responde de forma curta e profissional em Português de Portugal." 
        },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
    });

    const reply = completion.choices[0].message.content;
    console.log("✅ RESPOSTA DA IA GERADA COM SUCESSO");
    console.log("📤 RESPOSTA:", reply);
    console.log("-----------------------------------------");

    res.json({ reply });
  } catch (error) {
    console.error("❌ ERRO CRÍTICO NA GROQ:", error.message);
    res.status(500).json({ error: "Erro interno no motor de IA." });
  }
});

// --- RESTANTES ROTAS (Mantidas como originais) ---
app.post("/clients", async (req, res) => {
  try {
    const { company_id, name, email, vat_id, phone } = req.body;
    const { data, error } = await supabase.from("clients").insert({ company_id, name, email, vat_id, phone }).select().single();
    if (error) throw error;
    res.json({ ok: true, client: data });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

app.post("/invoices/scan", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) throw new Error("Ficheiro não enviado.");
    const { text, fields } = await scanInvoiceFile({ buffer: file.buffer, mimetype: file.mimetype });
    res.json({ ok: true, extracted_text: text, fields });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

app.listen(port, () => {
  console.log(`✅ Servidor de Teste IA na porta ${port}`);
  console.log(`🔗 URL de Destino: http://localhost:${port}/api/chat`);
});