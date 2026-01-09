import { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Settings, LogOut, Menu, BookOpen 
} from 'lucide-react';
import { supabase } from '../supabase/client';

// IMPORTAR AS NOVAS PÁGINAS
import DashboardHome from './DashboardHome';
import SettingsPage from './Settings';
import AccountingPage from './AccountingPage';
import InvoicesPage from './InvoicesPage'; // Assumo que criaste esta com o InvoiceForm

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Visão Geral', path: '/dashboard' },
    { icon: FileText, label: 'Faturas', path: '/dashboard/invoices' },
    { icon: BookOpen, label: 'Contabilidade', path: '/dashboard/accounting' },
    { icon: Settings, label: 'Definições', path: '/dashboard/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform md:translate-x-0 transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b dark:border-gray-700">
          <span className="font-bold text-xl flex gap-2 items-center">
            <img src="/logopequena.PNG" className="h-8 w-auto" alt="Logo"/> EasyCheck
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium 
                ${location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t dark:border-gray-700">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium">
            <LogOut className="w-5 h-5" /> Sair
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        
        {/* TOPBAR (Cabeçalho Móvel) */}
        <header className="md:hidden h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center px-4 justify-between">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu /></button>
            <span className="font-bold">EasyCheck ERP</span>
            <div className="w-6"></div> {/* Espaçador */}
        </header>

        {/* ÁREA DE PÁGINAS (ROUTER) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="accounting" element={<AccountingPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Rota para 404 dentro do Dashboard */}
            <Route path="*" element={<div>Página não encontrada</div>} />
          </Routes>
        </div>

      </main>
    </div>
  );
}