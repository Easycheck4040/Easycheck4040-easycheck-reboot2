import fetch from "node-fetch";
import pdf from "pdf-parse";
import { extractInvoiceFields } from "../utils/extractInvoiceFields.js";

export async function extractTextFromPdf(buffer) {
  const data = await pdf(buffer);
  return data.text || "";
}

export async function extractTextFromImage(buffer) {
  const key = process.env.OCRSPACE_KEY;
  if (!key) throw new Error("OCRSPACE_KEY not set");
  const formData = new URLSearchParams();
  formData.append("apikey", key);
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");
  // ocr.space expects base64 or URL. We'll send base64.
  const b64 = buffer.toString("base64");
  formData.append("base64Image", "data:image/png;base64," + b64);

  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData
  });
  const json = await res.json();
  const parsed = json?.ParsedResults?.[0]?.ParsedText || "";
  return parsed;
}

export async function scanInvoiceFile({ buffer, mimetype }) {
  let text = "";
  if (mimetype === "application/pdf") {
    text = await extractTextFromPdf(buffer);
  } else if (mimetype.startsWith("image/")) {
    text = await extractTextFromImage(buffer);
  } else {
    throw new Error("Unsupported file type");
  }
  const fields = extractInvoiceFields(text);
  return { text, fields };
}
