import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { supabase } from "./services/supabase.js";
import { sendMail } from "./services/mailer.js";
import { likeInsensitive, computeTotals, detectLang } from "./utils/helpers.js";
import { invoicesToBob50CSV } from "./utils/csvExport.js";
import { scanInvoiceFile } from "./services/ocr.js";

const app = express();
const upload = multer();

const allowed = (process.env.ALLOWED_ORIGINS || "").split(",").map(s=>s.trim()).filter(Boolean);
app.use(cors({
  origin: function(origin, cb){
    if (!origin) return cb(null, true);
    if (allowed.length===0 || allowed.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  }
}));
app.use(express.json({ limit: "2mb" }));

app.get("/", (_, res)=>res.send("Easycheck API OK"));

// -------------------------
// Clients CRUD
// -------------------------
app.post("/clients", async (req, res) => {
  try {
    const { company_id, name, email, vat_id, phone } = req.body;
    const { data, error } = await supabase.from("clients")
      .insert({ company_id, name, email, vat_id, phone })
      .select().single();
    if (error) throw error;
    res.json({ ok: true, client: data });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.get("/clients", async (req, res) => {
  try {
    const { company_id, q } = req.query;
    const { data, error } = await supabase.from("clients")
      .select("*")
      .eq("company_id", company_id)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    const filtered = q ? (data||[]).filter(c =>
      likeInsensitive(c.name, q) || likeInsensitive(c.email, q)
    ) : data;
    res.json({ ok: true, clients: filtered });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// -------------------------
// Employees CRUD
// -------------------------
app.post("/employees", async (req, res) => {
  try {
    const { company_id, name, email, role="staff" } = req.body;
    const { data, error } = await supabase.from("employees")
      .insert({ company_id, name, email, role })
      .select().single();
    if (error) throw error;
    res.json({ ok: true, employee: data });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.get("/employees", async (req, res) => {
  try {
    const { company_id, q } = req.query;
    const { data, error } = await supabase.from("employees")
      .select("*")
      .eq("company_id", company_id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    const filtered = q ? (data||[]).filter(e =>
      likeInsensitive(e.name, q) || likeInsensitive(e.email, q) || likeInsensitive(e.role, q)
    ) : data;
    res.json({ ok: true, employees: filtered });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// -------------------------
// Invoices
// -------------------------
app.post("/invoices", async (req, res) => {
  try {
    const { company_id, client_id, issue_date, due_date, currency="EUR", net_amount, vat_rate, description } = req.body;
    const totals = computeTotals(Number(net_amount||0), Number(vat_rate||0));

    const { data, error } = await supabase.from("invoices")
      .insert({
        company_id, client_id, issue_date, due_date, currency,
        net_amount: Number(net_amount||0),
        vat_rate: Number(vat_rate||0),
        vat_amount: totals.vat,
        total_amount: totals.total,
        description
      })
      .select().single();
    if (error) throw error;
    res.json({ ok: true, invoice: data });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// Export CSV (Bob50-ish)
app.get("/invoices/export", async (req, res) => {
  try {
    const { company_id, from, to } = req.query;
    let query = supabase.from("invoices")
      .select("*, clients(name, email)")
      .eq("company_id", company_id)
      .order("issue_date", { ascending: true });
    if (from) query = query.gte("issue_date", from);
    if (to) query = query.lte("issue_date", to);

    const { data, error } = await query;
    if (error) throw error;
    const csv = invoicesToBob50CSV(data||[]);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=invoices.csv");
    res.send(csv);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Scan invoice OCR
app.post("/invoices/scan", upload.single("file"), async (req, res) => {
  try {
    const company_id = req.body.company_id;
    const file = req.file;
    if (!company_id || !file) throw new Error("company_id and file are required");

    const { text, fields } = await scanInvoiceFile({ buffer: file.buffer, mimetype: file.mimetype });

    // try to match client by name/email inside extracted fields
    let client = null;
    if (fields.client_name) {
      const { data: clients } = await supabase.from("clients")
        .select("*").eq("company_id", company_id).limit(200);
      client = (clients||[]).find(c => likeInsensitive(c.name, fields.client_name));
    }

    const net_guess = fields.total && fields.vat_rate ? +(fields.total / (1 + fields.vat_rate/100)).toFixed(2) : (fields.total||0);

    const totals = computeTotals(net_guess, fields.vat_rate || 0);

    const { data: inv, error: invErr } = await supabase.from("invoices")
      .insert({
        company_id,
        client_id: client?.id || null,
        issue_date: fields.issue_date || new Date().toISOString().slice(0,10),
        due_date: null,
        currency: "EUR",
        net_amount: net_guess,
        vat_rate: fields.vat_rate || 0,
        vat_amount: totals.vat,
        total_amount: fields.total || totals.total,
        description: "Scanned invoice (OCR)",
        status: "sent"
      })
      .select().single();
    if (invErr) throw invErr;

    res.json({ ok: true, extracted_text: text, fields, matched_client: client, invoice: inv });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// Send invoice by number to specific email
app.post("/emails/send-invoice", async (req, res) => {
  try {
    const { company_id, invoice_number, to_email } = req.body;
    if (!company_id || !invoice_number || !to_email) throw new Error("company_id, invoice_number, to_email required");

    const { data, error } = await supabase.from("invoices")
      .select("*, clients(name, email)")
      .eq("company_id", company_id)
      .eq("invoice_number", invoice_number)
      .limit(1);
    if (error) throw error;
    const invoice = data?.[0];
    if (!invoice) throw new Error("Invoice not found");

    const subject = `Fatura ${invoice.invoice_number}`;
    const text = `Olá,\n\nSegue a fatura ${invoice.invoice_number} no valor total de ${invoice.total_amount} ${invoice.currency}.\nCliente: ${invoice.clients?.name || "-"}\n\nObrigado.\nEasycheck`;

    await sendMail({ to: to_email, subject, text });
    await supabase.from("emails_outbox").insert({
      company_id, to_address: to_email, subject, body: text, status: "sent", sent_at: new Date().toISOString()
    });

    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// Internal Chat IA rule-based
app.post("/chat/command", async (req, res) => {
  try {
    const { company_id, text } = req.body;
    if (!company_id || !text) throw new Error("company_id and text required");
    const lower = text.toLowerCase();

    const isSendInvoice = lower.includes("manda a fatura") || lower.includes("enviar a fatura") || lower.includes("mandar a fatura");
    if (!isSendInvoice) {
      return res.json({ ok: true, message: "Não entendi. Ex: 'Easycheck IA, manda a fatura do cliente ABC para o gerente'." });
    }

    // best-effort: get client name after 'cliente'
    let clientName = null;
    const idx = lower.indexOf("cliente");
    if (idx !== -1) {
      clientName = text.substring(idx + "cliente".length).trim().replace(/^[:\s\-]*/, "");
    }
    if (!clientName) throw new Error("Diz o nome do cliente no comando.");

    const { data: clients, error: cErr } = await supabase.from("clients")
      .select("*").eq("company_id", company_id).limit(200);
    if (cErr) throw cErr;
    const client = (clients||[]).find(c => likeInsensitive(c.name, clientName));
    if (!client) throw new Error("Não encontrei esse cliente.");

    const { data: invoices, error: iErr } = await supabase.from("invoices")
      .select("*")
      .eq("company_id", company_id)
      .eq("client_id", client.id)
      .order("issue_date", { ascending: false })
      .limit(1);
    if (iErr) throw iErr;
    const invoice = invoices?.[0];
    if (!invoice) throw new Error("Esse cliente ainda não tem faturas.");

    const { data: emps, error: eErr } = await supabase.from("employees")
      .select("*").eq("company_id", company_id).eq("is_active", true);
    if (eErr) throw eErr;
    const manager = (emps||[]).find(e => e.role === "manager") || emps?.[0];
    if (!manager) throw new Error("Não há gerente cadastrado.");

    const subject = `Fatura ${invoice.invoice_number} — Cliente ${client.name}`;
    const body = `Olá ${manager.name},\n\nSegue a fatura ${invoice.invoice_number} do cliente ${client.name}.\nTotal: ${invoice.total_amount} ${invoice.currency}.\n\nEasycheck IA`;
    await sendMail({ to: manager.email, subject, text: body });
    await supabase.from("emails_outbox").insert({
      company_id, to_address: manager.email, subject, body, status: "sent", sent_at: new Date().toISOString()
    });

    res.json({ ok:true, action:"send_invoice_to_manager", client, invoice, sent_to: manager });
  } catch (e) {
    res.status(400).json({ ok:false, error: e.message });
  }
});

// Public Client Chat (free rules)
app.post("/chat/client/start", async (req, res) => {
  try {
    const { company_id, customer_email, lang } = req.body;
    if (!company_id) throw new Error("company_id required");
    const { data, error } = await supabase.from("customer_conversations")
      .insert({ company_id, customer_email, lang: lang || "auto" })
      .select().single();
    if (error) throw error;
    res.json({ ok:true, conversation_id: data.id });
  } catch (e) {
    res.status(400).json({ ok:false, error: e.message });
  }
});

app.post("/chat/client/message", async (req, res) => {
  try {
    const { conversation_id, text } = req.body;
    if (!conversation_id || !text) throw new Error("conversation_id and text required");

    const { data: convo, error: convErr } = await supabase.from("customer_conversations")
      .select("*").eq("id", conversation_id).single();
    if (convErr) throw convErr;

    await supabase.from("customer_messages").insert({
      conversation_id, role: "customer", content: text
    });

    const lang = convo.lang === "auto" ? detectLang(text) : convo.lang;
    const t = text.toLowerCase();

    let reply = "";
    // intents
    const wantsInvoiceCopy = ["2ª via","segunda via","fatura","invoice","facture","rechnung"].some(k => t.includes(k));
    const wantsStatus = ["status","saldo","aberto","overdue","paguei","payment","paiement"].some(k => t.includes(k));
    const wantsMeeting = ["reunião","meeting","rendez","termin"].some(k => t.includes(k));
    const wantsTicket = ["ajuda","suporte","problema","ticket","support"].some(k => t.includes(k));

    // Try match client by email if available
    let client = null;
    if (convo.customer_email) {
      const { data: clients } = await supabase.from("clients")
        .select("*").eq("company_id", convo.company_id).eq("email", convo.customer_email).limit(1);
      client = clients?.[0] || null;
    }

    if (wantsInvoiceCopy && client) {
      const { data: invoices } = await supabase.from("invoices")
        .select("*").eq("company_id", convo.company_id).eq("client_id", client.id)
        .order("issue_date", { ascending:false }).limit(1);
      const inv = invoices?.[0];
      if (inv) {
        // send email copy to customer
        const subject = `Sua fatura ${inv.invoice_number}`;
        const body = `Olá ${client.name},\n\nSegue a segunda via da fatura ${inv.invoice_number} (total ${inv.total_amount} ${inv.currency}).\n\nEasycheck`;
        if (client.email) await sendMail({ to: client.email, subject, text: body });
        reply = lang==="fr" ? "Je viens d’envoyer votre facture par email." :
                lang==="de" ? "Ich habe Ihre Rechnung per E-Mail gesendet." :
                lang==="en" ? "I just emailed your invoice to you." :
                "Acabei de enviar a sua fatura por e-mail.";
      } else {
        reply = lang==="fr" ? "Je n’ai trouvé aucune facture pour vous." :
                lang==="de" ? "Ich habe keine Rechnung für Sie gefunden." :
                lang==="en" ? "I couldn't find any invoice for you yet." :
                "Ainda não encontrei nenhuma fatura sua.";
      }
    }
    else if (wantsStatus && client) {
      const { data: invoices } = await supabase.from("invoices")
        .select("*").eq("company_id", convo.company_id).eq("client_id", client.id)
        .in("status", ["sent","overdue"]);
      const openTotal = (invoices||[]).reduce((s,i)=>s+Number(i.total_amount||0),0).toFixed(2);
      reply = lang==="fr" ? `Vous avez ${openTotal} EUR en attente.` :
              lang==="de" ? `Offener Betrag: ${openTotal} EUR.` :
              lang==="en" ? `You have ${openTotal} EUR outstanding.` :
              `Você tem ${openTotal} EUR em aberto.`;
    }
    else if (wantsMeeting) {
      await supabase.from("tickets").insert({
        company_id: convo.company_id,
        customer_email: convo.customer_email,
        subject: "Pedido de reunião",
        body: text,
        status: "open"
      });
      reply = lang==="fr" ? "Demande de réunion reçue. Nous vous recontacterons." :
              lang==="de" ? "Terminwunsch erhalten. Wir melden uns." :
              lang==="en" ? "Meeting request received. We'll get back to you." :
              "Pedido de reunião recebido. Vamos responder por e-mail.";
    }
    else if (wantsTicket) {
      await supabase.from("tickets").insert({
        company_id: convo.company_id,
        customer_email: convo.customer_email,
        subject: "Suporte",
        body: text,
        status: "open"
      });
      reply = lang==="fr" ? "Ticket créé. Notre équipe vous répondra." :
              lang==="de" ? "Ticket erstellt. Unser Team antwortet bald." :
              lang==="en" ? "Ticket opened. Our team will reply soon." :
              "Ticket criado. Vamos responder em breve.";
    }
    else {
      reply = lang==="fr" ? "Posso ajudar com factures, statut de paiement, rendez-vous ou support." :
              lang==="de" ? "Ich kann bei Rechnungen, Zahlungsstatus, Terminen oder Support helfen." :
              lang==="en" ? "I can help with invoices, payment status, meetings or support." :
              "Posso ajudar com faturas, status de pagamento, reuniões ou suporte.";
    }

    await supabase.from("customer_messages").insert({
      conversation_id, role: "assistant", content: reply
    });

    res.json({ ok:true, reply, lang });
  } catch (e) {
    res.status(400).json({ ok:false, error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log("API running on", port));
