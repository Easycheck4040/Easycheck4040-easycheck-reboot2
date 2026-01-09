import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceData {
  invoice_number: string;
  date: string;
  due_date: string;
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  currency_symbol: string;
}

interface CompanySettings {
  name: string;
  nif: string;
  address: string;
  template_url?: string; // URL da imagem de fundo (Word design)
  primary_color?: string;
}

interface ClientData {
  name: string;
  nif: string;
  address: string;
}

export const generateProfessionalInvoice = async (
  invoice: InvoiceData,
  company: CompanySettings,
  client: ClientData
): Promise<Blob> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // 1. CARREGAR TEMPLATE (Word Design) SE EXISTIR
  if (company.template_url) {
    try {
      const img = new Image();
      img.src = company.template_url;
      img.crossOrigin = "Anonymous";
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; // Continua mesmo se falhar
      });
      // Desenha a imagem cobrindo a folha A4 inteira
      doc.addImage(img, 'PNG', 0, 0, 210, 297);
    } catch (e) {
      console.warn("Falha ao carregar template de fundo", e);
    }
  } else {
    // Design Fallback (Se não houver template)
    doc.setFillColor(company.primary_color || '#2563EB');
    doc.rect(0, 0, 210, 10, 'F'); // Barra topo
  }

  // Se o utilizador tem template, assumimos que o LOGO e MORADA da empresa 
  // já estão na imagem de fundo. Se não tiver, imprimimos nós.
  const hasTemplate = !!company.template_url;
  const textColor = hasTemplate ? 0 : 0; // Preto
  doc.setTextColor(textColor);

  if (!hasTemplate) {
    // Cabeçalho Padrão
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(company.name, 15, 25);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(company.address, 15, 30);
    doc.text(`NIF: ${company.nif}`, 15, 35);
  }

  // 2. DADOS DO DOCUMENTO (Posicionamento Estratégico)
  // Normalmente ficam à direita num design profissional
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('FATURA Nº', 140, 40);
  doc.text('DATA EMISSÃO', 140, 50);
  
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoice_number, 170, 40, { align: 'right' });
  doc.text(invoice.date, 170, 50, { align: 'right' });

  // 3. DADOS DO CLIENTE
  doc.setFont('helvetica', 'bold');
  doc.text('Exmo.(s) Sr.(s)', 15, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(client.name, 15, 62);
  doc.setFontSize(10);
  doc.text(client.address, 15, 67);
  doc.text(`NIF: ${client.nif}`, 15, 72);

  // 4. TABELA DE ARTIGOS
  // Usamos autoTable mas com estilo limpo para bater com qualquer template
  const tableData = invoice.items.map(item => [
    item.description,
    item.quantity,
    `${item.price.toFixed(2)}`,
    `${item.tax}%`,
    `${(item.price * item.quantity).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 85,
    head: [['Descrição', 'Qtd', 'Preço Unit.', 'IVA', 'Total']],
    body: tableData,
    theme: 'plain', // Minimalista para não chocar com o design do user
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { 
      fillColor: company.primary_color || '#444444', 
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 80 }, // Descrição larga
      4: { halign: 'right' } // Total alinhado à direita
    }
  });

  // 5. TOTAIS
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.text('Total Ilíquido:', 130, finalY);
  doc.text(`${invoice.currency_symbol} ${invoice.subtotal.toFixed(2)}`, 190, finalY, { align: 'right' });
  
  doc.text('Total IVA:', 130, finalY + 6);
  doc.text(`${invoice.currency_symbol} ${invoice.tax.toFixed(2)}`, 190, finalY + 6, { align: 'right' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(company.primary_color || '#000000');
  doc.text('TOTAL A PAGAR', 130, finalY + 15);
  doc.text(`${invoice.currency_symbol} ${invoice.total.toFixed(2)}`, 190, finalY + 15, { align: 'right' });

  // 6. Rodapé Legal (Obrigatório por lei em PT/AO/BR)
  const softwareSignature = "Processado por EasyCheck ERP (Certificado Nº 0000/AT)"; // Placeholder
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.setFont('helvetica', 'normal');
  doc.text(softwareSignature, 105, pageHeight - 10, { align: 'center' });

  return doc.output('blob');
};