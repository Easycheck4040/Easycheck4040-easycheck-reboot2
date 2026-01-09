import { useState } from 'react';
import ChartAccounts from '../components/Accounting/ChartAccounts';
import GeneralLedger from '../components/Accounting/GeneralLedger';
import { BookOpen, FileText } from 'lucide-react';

export default function AccountingPage() {
  const [tab, setTab] = useState<'ledger' | 'chart'>('ledger');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Contabilidade</h2>
        
        {/* TAB SWITCHER */}
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border dark:border-gray-700">
            <button 
                onClick={() => setTab('ledger')}
                className={`px-4 py-2 rounded-md text-sm font-bold flex gap-2 items-center ${tab === 'ledger' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            >
                <BookOpen size={16}/> Diário
            </button>
            <button 
                onClick={() => setTab('chart')}
                className={`px-4 py-2 rounded-md text-sm font-bold flex gap-2 items-center ${tab === 'chart' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            >
                <FileText size={16}/> Plano de Contas
            </button>
        </div>
      </div>

      {tab === 'ledger' ? <GeneralLedger /> : <ChartAccounts />}
    </div>
  );
}