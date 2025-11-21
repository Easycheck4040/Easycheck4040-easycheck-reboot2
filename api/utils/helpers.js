export function likeInsensitive(a, b) {
  return String(a || "").toLowerCase().includes(String(b || "").toLowerCase());
}

export function detectLang(text="") {
  const t = text.toLowerCase();
  if (/[áàâãçéêíóôõú]/.test(t) || t.includes("olá") || t.includes("fatura")) return "pt";
  if (t.includes("bonjour") || t.includes("facture")) return "fr";
  if (t.includes("guten") || t.includes("rechnung")) return "de";
  if (t.includes("hello") || t.includes("invoice")) return "en";
  return "auto";
}

export function computeTotals(net, vatRate) {
  const vat = +(net * (vatRate / 100)).toFixed(2);
  const total = +(net + vat).toFixed(2);
  return { vat, total };
}
