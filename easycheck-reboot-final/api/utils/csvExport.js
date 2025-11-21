export function invoicesToBob50CSV(invoices=[]) {
  const header = ["invoice_number","issue_date","client_name","net_amount","vat_rate","vat_amount","total_amount","currency"];
  const rows = invoices.map(i => [
    i.invoice_number,
    i.issue_date,
    i.clients?.name || "",
    i.net_amount,
    i.vat_rate,
    i.vat_amount,
    i.total_amount,
    i.currency || "EUR"
  ]);
  const all = [header, ...rows];
  return all.map(r => r.join(";")).join("\n");
}
