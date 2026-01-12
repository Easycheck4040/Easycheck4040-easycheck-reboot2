import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { useAccounting } from '../../hooks/useAccounting';
import { generateProfessionalInvoice } from './PdfGenerator';
import { Plus, Trash2, Save, FileText, X, Eye } from 'lucide-react';

interface InvoiceFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function InvoiceForm({ onClose, onSuccess }: InvoiceFormProps) {
  const { accounts, createEntry } = useAccounting();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [companySettings, setCompanySettings] = useState<any>(null);

  // Estado do Formulário
  const [formData, setFormData] = useState({
    client_id: '',
    date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
    items: [{ description: 'Serviços de Consultoria', quantity: 1, price: 100, tax: 23 }]
  });

  // Carregar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      // 1. Buscar Clientes
      const { data: clientData } = await supabase.from('clients').select('*');
      if (clientData) setClients(clientData);

      // 2. Buscar Definições da Empresa (para o PDF e Impostos)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setCompanySettings(profile);
      }
    };
    fetchData();
  }, []);

  // --- CÁLCULOS ---
  const calculateTotals = () => {
    let subtotal = 0;
    let taxTotal = 0;
    formData.items.forEach(item => {
      const lineTotal = item.quantity * item.price;
      subtotal += lineTotal;
      taxTotal += lineTotal * (item.tax / 100);
    });
    return { subtotal, taxTotal, total: subtotal + taxTotal };
  };

  // --- MANIPULAÇÃO DE ITENS ---
  const updateItem = (index: number, field: string, value: any) => {
    const newItems: any = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, price: 0, tax: 23 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // --- AÇÃO PRINCIPAL: GRAVAR E CONTABILIZAR ---
  const handleSave = async () => {
    if (!formData.client_id) return alert("Selecione um cliente.");
    setLoading(true);

    try {
      const totals = calculateTotals();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      // 1. Gerar Número de Fatura (Simples)
      const invoiceNumber = `FT ${new Date().getFullYear()}/${Math.floor(Math.random() * 1000)}`;

      // 2. Inserir na tabela de Vendas (Invoices)
      const { data: invoice, error: invError } = await supabase
        .from('invoices')
        .insert([{
          user_id: user.id,
          client_id: formData.client_id,
          invoice_number: invoiceNumber,
          date: formData.date,
          due_date: formData.due_date,
          subtotal: totals.subtotal,
          tax_total: totals.taxTotal,
          total: totals.total,
          status: 'sent'
        }])
        .select()
        .single();

      if (invError) throw invError;

      // 3. Inserir Itens da Fatura
      const invoiceItems = formData.items.map(item => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.price,
        tax_rate: item.tax
      }));
      await supabase.from('invoice_items').insert(invoiceItems);

      // --- AUTOMATIZAÇÃO CONTABILÍSTICA (A MAGIA) ---
      // Vamos procurar as contas certas pelo código (depende do país configurado)
      // Exemplo genérico: Cliente (211/311), Venda (711/61), IVA (243/342)
      
      const clientAccount = accounts.find(a => a.code.startsWith('211') || a.code.startsWith('311')); 
      const salesAccount = accounts.find(a => a.code.startsWith('71') || a.code.startsWith('61'));
      const taxAccount = accounts.find(a => a.code.startsWith('243') || a.code.startsWith('342'));

      if (clientAccount && salesAccount) {
        const journalItems = [
          // DÉBITO: Cliente (Valor Total a Receber)
          { account_id: clientAccount.id, debit: totals.total, credit: 0 },
          // CRÉDITO: Venda (Valor Sem Imposto)
          { account_id: salesAccount.id, debit: 0, credit: totals.subtotal }
        ];

        // CRÉDITO: IVA (Se houver imposto)
        if (totals.taxTotal > 0 && taxAccount) {
          journalItems.push({ account_id: taxAccount.id, debit: 0, credit: totals.taxTotal });
        }

        // Criar o lançamento no Diário usando o nosso Hook
        await createEntry(
          `Emissão Fatura ${invoiceNumber} - ${clients.find(c => c.id === formData.client_id)?.name}`,
          formData.date,
          journalItems
        );
      } else {
        console.warn("Contas contabilísticas não encontradas automaticamente. Verifique o plano de contas.");
      }

      alert("Fatura emitida e contabilizada com sucesso!");
      onSuccess();
      onClose();

    } catch (error: any) {
      alert("Erro ao gravar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PRÉ-VISUALIZAÇÃO PDF ---
  const handlePreview = async () => {
    if (!formData.client_id) return alert("Selecione um cliente primeiro.");
    
    const totals = calculateTotals();
    const client = clients.find(c => c.id === formData.client_id);
    
    // Dados temporários para o PDF
    const mockInvoice = {
      invoice_number: "RASCUNHO",
      date: formData.date,
      due_date: formData.due_date,
      items: formData.items,
      subtotal: totals.subtotal,
      tax: totals.taxTotal,
      total: totals.total,
      currency_symbol: companySettings?.currency === 'AOA' ? 'Kz' : '€'
    };

    const companyData = {
      name: companySettings?.company_name || 'Minha Empresa',
      nif: companySettings?.company_nif || '999999999',
      address: companySettings?.company_address || 'Morada da Empresa',
      template_url: companySettings?.invoice_template_url, // AQUI ENTRA O TEMPLATE WORD
      primary_color: companySettings?.invoice_color
    };

    const clientData = {
      name: client?.name || 'Cliente',
      nif: client?.nif || 'N/A',
      address: client?.address || 'Morada do Cliente'
    };

    const pdfBlob = await generateProfessionalInvoice(mockInvoice, companyData, clientData);
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col border dark:border-gray-700">
        
        {/* Header */}
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900 rounded-t-2xl">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="text-blue-600"/> Nova Fatura Profissional
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><X/></button>
        </div>

        {/* Body com Scroll */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Topo: Cliente e Datas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Cliente</label>
              <select 
                className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600"
                value={formData.client_id}
                onChange={e => setFormData({...formData, client_id: e.target.value})}
              >
                <option value="">Selecione...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Data Emissão</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Vencimento</label>
              <input type="date" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600" />
            </div>
          </div>

          {/* Tabela de Itens */}
          <div>
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700 uppercase text-xs font-bold text-gray-600">
                <tr>
                  <th className="p-3 text-left rounded-l-lg">Descrição</th>
                  <th className="p-3 w-24 text-center">Qtd</th>
                  <th className="p-3 w-32 text-right">Preço</th>
                  <th className="p-3 w-24 text-right">IVA %</th>
                  <th className="p-3 w-32 text-right rounded-r-lg">Total</th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="p-3">
                      <input 
                        className="w-full bg-transparent outline-none font-medium" 
                        placeholder="Nome do produto ou serviço"
                        value={item.description}
                        onChange={e => updateItem(index, 'description', e.target.value)}
                      />
                    </td>
                    <td className="p-3">
                      <input type="number" className="w-full bg-transparent text-center outline-none" value={item.quantity} onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value))} />
                    </td>
                    <td className="p-3">
                      <input type="number" className="w-full bg-transparent text-right outline-none" value={item.price} onChange={e => updateItem(index, 'price', parseFloat(e.target.value))} />
                    </td>
                    <td className="p-3">
                      <input type="number" className="w-full bg-transparent text-right outline-none" value={item.tax} onChange={e => updateItem(index, 'tax', parseFloat(e.target.value))} />
                    </td>
                    <td className="p-3 text-right font-bold">
                      {(item.quantity * item.price).toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <button onClick={() => removeItem(index)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addItem} className="mt-2 text-blue-600 font-bold text-sm flex items-center gap-2 hover:underline">
              <Plus size={16}/> Adicionar Linha
            </button>
          </div>
        </div>

        {/* Footer: Totais e Ações */}
        <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-2xl flex justify-between items-center">
          <div className="text-sm">
            <button onClick={handlePreview} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
              <Eye size={18}/> Pré-visualizar PDF
            </button>
          </div>
          
          <div className="flex gap-6 items-center">
            <div className="text-right mr-4">
              <p className="text-sm text-gray-500">Total Ilíquido: <span className="font-bold text-gray-800 dark:text-gray-200">{calculateTotals().subtotal.toFixed(2)}</span></p>
              <p className="text-sm text-gray-500">Total IVA: <span className="font-bold text-gray-800 dark:text-gray-200">{calculateTotals().taxTotal.toFixed(2)}</span></p>
              <p className="text-xl font-bold text-blue-600">Total: {calculateTotals().total.toFixed(2)}</p>
            </div>
            
            <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50">
              <Save size={20}/> {loading ? 'A Emitir...' : 'Emitir Fatura'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}x