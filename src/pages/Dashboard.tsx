import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calculator, 
  Mail, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut,
  Bell,
  Globe,
  Moon,
  Sun,
  Copy
} from 'lucide-react';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // DADOS DO UTILIZADOR (Como tínhamos ontem)
  // Depois isto virá do login real, por enquanto fica assim fixo para visualizares
  const [user] = useState({
    name: 'Iuri Santos',
    initials: 'IS',
    role: 'CEO / Founder',
    companyCode: 'EMP-2024-882' // O tal código de empresa
  });
  
  // Estado do Tema (Dark Mode)
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const toggleLanguage = () => {
    const langs = ['pt', 'en', 'fr', 'es', 'de', 'it'];
    const current = langs.indexOf(i18n.language);
    const next = (current + 1) % langs.length;
    i18n.changeLanguage(langs[next]);
  };

  const handleLogout = () => {
    navigate('/'); 
  };

  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: t('dashboard.menu.overview') },
    { id: 'chat', icon: MessageSquare, label: t('dashboard.menu.chat') },
    { id: 'accounting', icon: Calculator, label: t('dashboard.menu.accounting') },
    { id: 'communication', icon: Mail, label: t('dashboard.menu.communication') },
    { id: 'hr', icon: Users, label: t('dashboard.menu.hr') },
    { id: 'marketing', icon: TrendingUp, label: t('dashboard.menu.marketing') },
    { id: 'settings', icon: Settings, label: t('dashboard.menu.settings') },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      
      {/* SIDEBAR (Barra Lateral Completa) */}
      <aside className="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col transition-colors duration-300">
        
        {/* Logo */}
        <div className="p-6 flex items-center gap-2">
          <img src="/logopequena.PNG" alt="Logo" className="h-8 w-8 object-contain" />
          <span className="font-bold text-xl text-gray-900 dark:text-white">EasyCheck</span>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* SECÇÃO DO PERFIL (Aqui está o que faltava!) */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          
          {/* Caixa com info do utilizador */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-3 flex items-center gap-3 border border-gray-100 dark:border-gray-600">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
              {user.initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.role}</p>
            </div>
          </div>

          {/* Caixa com Código da Empresa */}
          <div className="flex items-center justify-between px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4 border border-blue-100 dark:border-blue-900/30">
             <div className="flex flex-col">
               <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Empresa</span>
               <span className="text-xs font-mono font-medium text-gray-700 dark:text-gray-300">{user.companyCode}</span>
             </div>
             <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Copiar Código">
                <Copy className="w-4 h-4" />
             </button>
          </div>

          {/* Botão de Logout */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('dashboard.menu.logout')}
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER (Com os botões novos) */}
        <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 transition-colors duration-300">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {menuItems.find(i => i.id === activeTab)?.label}
          </h1>

          <div className="flex items-center gap-4">
            
            {/* Botão Língua */}
            <button onClick={toggleLanguage} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span className="font-bold text-sm uppercase">{i18n.language}</span>
            </button>

            {/* Botão Tema */}
            <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

            <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>
          </div>
        </header>

        {/* ÁREA DE CONTEÚDO (Cards Simples como ontem) */}
        <div className="flex-1 overflow-y-auto p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.stats.revenue')}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">€0,00</h3>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.stats.actions')}</p>
              <h3 className="text-2xl font-bold text-blue-600">0</h3>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.stats.invoices')}</p>
              <h3 className="text-2xl font-bold text-orange-500">0</h3>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-3xl p-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('dashboard.welcome')} {user.name.split(' ')[0]}! 👋
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t('dashboard.subtitle')}
              </p>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30">
              <MessageSquare className="w-5 h-5" />
              {t('dashboard.open_chat')}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}