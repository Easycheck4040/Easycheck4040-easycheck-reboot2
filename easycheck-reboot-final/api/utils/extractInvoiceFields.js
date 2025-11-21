// Very simple heuristics to parse invoice text.
// You can improve this later with an LLM without changing structure.
export function extractInvoiceFields(rawText="") {
  const text = rawText.replace(/\s+/g, " ").trim();

  // Total amount
  const totalMatch = text.match(/(?:total|montant total|gesamtbetrag|valor total)\s*[:\-]?\s*([0-9]+[.,][0-9]{2})/i)
    || text.match(/([0-9]+[.,][0-9]{2})\s*(?:€|eur)/i);
  const total = totalMatch ? Number(totalMatch[1].replace(",", ".")) : null;

  // VAT rate
  const vatRateMatch = text.match(/(?:tva|tvá|vat|mwst)\s*[:\-]?\s*([0-9]{1,2}(?:[.,][0-9])?)\s*%/i);
  const vat_rate = vatRateMatch ? Number(vatRateMatch[1].replace(",", ".")) : null;

  // Date
  const dateMatch = text.match(/(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/);
  const issue_date = dateMatch ? dateMatch[1] : null;

  // Client name (weak heuristic)
  let client_name = null;
  const clientMatch = text.match(/(?:client|cliente|destinataire|kunde)\s*[:\-]?\s*([A-Za-z0-9 &\-.]{3,60})/i);
  if (clientMatch) client_name = clientMatch[1].trim();

  return { total, vat_rate, issue_date, client_name, raw: text };
}
