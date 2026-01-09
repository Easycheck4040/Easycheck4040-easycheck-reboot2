import { useAccounting } from '../../hooks/useAccounting';
import { FileText, RefreshCw } from 'lucide-react';

export default function ChartAccounts() {
  const { accounts, loading, refresh } = useAccounting();

  if (loading) return <div className="p-4 text-gray-400">A carregar plano de contas...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FileText className="text-blue-600"/> Plano de Contas
          </h3>
          <p className="text-xs text-gray-500">
            Estrutura fiscal baseada no país configurado.
          </p>
        </div>
        <button onClick={refresh} className="p-2 hover:bg-gray-200 rounded-full">
          <RefreshCw size={16}/>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 uppercase text-xs font-bold text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-6 py-3 w-24">Conta</th>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3 w-32 text-center">Tipo</th>
              <th className="px-6 py-3 w-32 text-right">Saldo</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">
                  Nenhuma conta encontrada.<br/>
                  Vá a <b>Definições</b> e selecione o País para gerar o plano.
                </td>
              </tr>
            ) : (
              accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-3 font-mono font-bold text-blue-600">
                    {acc.code}
                  </td>
                  <td className="px-6 py-3 font-medium">
                    {acc.name}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider
                      ${acc.type === 'ativo' ? 'bg-green-100 text-green-700' : 
                        acc.type === 'passivo' ? 'bg-red-100 text-red-700' : 
                        acc.type === 'rendimentos' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                      {acc.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-gray-500">
                    € 0,00
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}