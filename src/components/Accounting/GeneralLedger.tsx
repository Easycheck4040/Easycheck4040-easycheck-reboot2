import { useAccounting } from '../../hooks/useAccounting';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function GeneralLedger() {
  const { entries, loading } = useAccounting();

  if (loading) return <div>A carregar diário...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6">
        <h3 className="font-bold text-lg mb-4 flex gap-2 items-center">
          <BookOpen className="text-purple-600"/> Diário Geral
        </h3>
        
        {entries.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-xl text-gray-400">
            Sem movimentos contabilísticos registados.
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="border dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 flex justify-between items-center text-sm border-b dark:border-gray-700">
                  <div className="font-bold flex gap-3">
                    <span className="text-gray-500 font-mono">{entry.date}</span>
                    <span>{entry.description}</span>
                  </div>
                  <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    DOC: {entry.document_ref || 'MANUAL'}
                  </span>
                </div>
                <table className="w-full text-xs">
                  <tbody>
                    {entry.journal_items.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b last:border-0 dark:border-gray-700 dark:bg-gray-800">
                        <td className="p-3 w-16 font-mono text-gray-400">{item.company_accounts?.code}</td>
                        <td className="p-3">{item.company_accounts?.name}</td>
                        <td className="p-3 w-32 text-right font-mono">
                          {item.debit > 0 ? <span className="text-gray-700 dark:text-gray-300 font-bold">{Number(item.debit).toFixed(2)} €</span> : '-'}
                        </td>
                        <td className="p-3 w-32 text-right font-mono">
                          {item.credit > 0 ? <span className="text-gray-700 dark:text-gray-300 font-bold">{Number(item.credit).toFixed(2)} €</span> : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}