import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { Groq } from "groq-sdk"; // Nova biblioteca

// --- IMPORTAÇÕES LOCAIS ---
import { supabase } from "./services/supabase.js";
import { sendMail } from "./services/mailer.js";
import { scanInvoiceFile } from "./services/ocr.js";
import { likeInsensitive, computeTotals, detectLang } from "./utils/helpers.js";
import { invoicesToBob50CSV } from "./utils/csvExport.js";

const app = express();
const upload = multer();
const port = process.env.PORT || 3000;

// Configuração da Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (_, res) => res.send("🚀 EasyCheck API (Groq Edition) Online!"));

// ==========================================
// 🤖 1. ROTA DO CHAT (Dashboard)
// ==========================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log("💬 Chat recebeu:", message);

    if (!message) return res.status(400).json({ error: "Mensagem vazia." });

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "És o assistente IA do EasyCheck. És especialista em gestão, contabilidade e RH. Responde de forma curta e profissional em Português de Portugal." 
        },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile", // Modelo gratuito e ultra rápido
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("❌ Erro Groq:", error.message);
    res.status(500).json({ error: "Erro ao processar a resposta da IA." });
  }
});

// ==========================================
// 👥 2. CLIENTES & FUNCIONÁRIOS
// ==========================================
app.post("/clients", async (req, res) => {
  try {
    const { company_id, name, email, vat_id, phone } = req.body;
    const { data, error } = await supabase.from("clients").insert({ company_id, name, email, vat_id, phone }).select().single();
    if (error) throw error;
    res.json({ ok: true, client: data });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

app.get("/clients", async (req, res) => {
  try {
    const { company_id, q } = req.query;
    const { data, error } = await supabase.from("clients").select("*").eq("company_id", company_id).order("created_at", { ascending: false });
    if (error) throw error;
    const filtered = q ? data.filter(c => likeInsensitive(c.name, q) || likeInsensitive(c.email, q)) : data;
    res.json({ ok: true, clients: filtered });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

app.post("/employees", async (req, res) => {
  try {
    const { company_id, name, email, role="staff" } = req.body;
    const { data, error } = await supabase.from("employees").insert({ company_id, name, email, role }).select().single();
    if (error) throw error;
    res.json({ ok: true, employee: data });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ==========================================
// 📄 3. FATURAS & OCR
// ==========================================
app.post("/invoices/scan", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) throw new Error("Ficheiro não enviado.");
    const { text, fields } = await scanInvoiceFile({ buffer: file.buffer, mimetype: file.mimetype });
    res.json({ ok: true, extracted_text: text, fields });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ==========================================
// 🌍 4. CHAT PÚBLICO (Com Fallback Groq)
// ==========================================
app.post("/chat/client/message", async (req, res) => {
  try {
    const { text } = req.body;
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: text }],
      model: "llama-3.3-70b-versatile",
    });
    res.json({ ok: true, reply: completion.choices[0].message.content });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// --- LIGAR ---
app.listen(port, () => {
  console.log(`✅ Servidor EasyCheck com IA GRATUITA na porta ${port}`);
});