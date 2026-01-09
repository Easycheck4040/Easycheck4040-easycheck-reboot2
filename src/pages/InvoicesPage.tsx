import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { Plus, FileText, Trash2, Eye, Search } from 'lucide-react';
// Importa o formulário que criámos antes
import InvoiceForm from '../components/Invoices/InvoiceForm';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      // Vai buscar faturas e o nome do cliente associado
      const { data, error } = await supabase
        .from('invoices')
        .select('*, clients(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setInvoices(data);
    } catch (error) {
      console.error("Erro ao carregar faturas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem a certeza que deseja anular esta fatura?")) return;

    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (!error) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    } else {
      alert("Erro ao apagar: " + error.message);
    }
  };

  // Filtro de pesquisa
  const filteredInvoices = invoices.filter(inv => 
    inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FileText className="text-blue-600"/> Gestão de Vendas
          </h2>
          <p className="text-sm text-gray-500">Consulte e emita os seus documentos comerciais.</p>
        </div>
        
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus size={20}/> Nova Fatura
        </button>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700 flex gap-2">
        <Search className="text-gray-400"/>
        <input 
          type="text" 
          placeholder="Pesquisar por nº fatura ou cliente..." 
          className="bg-transparent outline-none w-full text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABELA DE FATURAS */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase font-bold text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-4">Nº Doc</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Data</th>
                <th className="p-4">Vencimento</th>
                <th className="p-4 text-right">Total</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center">A carregar...</td></tr>
              ) : filteredInvoices.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Nenhuma fatura encontrada.</td></tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-600">
                      {inv.invoice_number}
                    </td>
                    <td className="p-4 font-medium">
                      {inv.clients?.name || 'Cliente Final'}
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(inv.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(inv.due_date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right font-bold">
                      {inv.total.toFixed(2)} €
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                        inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {inv.status === 'paid' ? 'Pago' : 'Emitido'}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600" title="Ver">
                        <Eye size={16}/>
                      </button>
                      <button 
                        onClick={() => handleDelete(inv.id)}
                        className="p-2 text-gray-400 hover:text-red-600" 
                        title="Anular"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CRIAÇÃO (O Componente que fizemos antes) */}
      {showForm && (
        <InvoiceForm 
          onClose={() => setShowForm(false)} 
          onSuccess={() => {
            fetchInvoices(); // Recarrega a tabela quando acabares de criar a fatura
          }} 
        />
      )}

    </div>
  );
}