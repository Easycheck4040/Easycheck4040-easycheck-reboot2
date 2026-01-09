import { Eye, EyeOff, FileText, Bell } from 'lucide-react';
import { useState } from 'react';

// Podes importar o hook useAccounting aqui futuramente para ter dados reais
export default function DashboardHome() {
  const [showFinancials, setShowFinancials] = useState(true);
  
  // Exemplo estático (depois ligamos ao useAccounting)
  const stats = { revenue: 15000, expenses: 4000, balance: 11000 };
  const displaySymbol = "€";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Visão Geral</h2>
      
      {/* WIDGETS DE TOPO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Receita Mensal</h3>
            <button onClick={() => setShowFinancials(!showFinancials)} className="text-gray-400">
              {showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}
            </button>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {showFinancials ? `${displaySymbol} ${stats.revenue.toFixed(2)}` : '••••••'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Despesas</h3>
          </div>
          <p className="text-3xl font-bold text-red-500 dark:text-red-400">
            {showFinancials ? `${displaySymbol} ${stats.expenses.toFixed(2)}` : '••••••'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Saldo Atual</h3>
          </div>
          <p className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {showFinancials ? `${displaySymbol} ${stats.balance.toFixed(2)}` : '••••••'}
          </p>
        </div>
      </div>

      {/* OUTRAS SECÇÕES (Atalhos, Alertas, etc.) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 flex items-center justify-between">
            <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Faturas Emitidas</h3>
                <p className="text-3xl font-bold text-orange-500 mt-1">12</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl"><FileText className="w-8 h-8 text-orange-500"/></div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 flex items-center justify-between">
            <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Alertas Pendentes</h3>
                <p className="text-3xl font-bold text-blue-600 mt-1">0</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl"><Bell className="w-8 h-8 text-blue-600"/></div>
          </div>
      </div>
    </div>
  );
}