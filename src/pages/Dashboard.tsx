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
  Sun
} from 'lucide-react';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userName, setUserName] = useState('Iuri'); // Podes mudar para dinâmico depois
  
  // Estado do Tema (Dark Mode)
  const [isDark, setIsDark] = useState(false);

  // Verificar tema inicial ao carregar a página
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  // Alternar Modo Escuro/Claro
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  // Alternar Língua (Ciclo entre as 6 línguas)
  const toggleLanguage = () => {
    const langs = ['pt', 'en', 'fr', 'es', 'de', 'it'];
    const currentIndex = langs.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % langs.length;
    i18n.changeLanguage(langs[nextIndex]);
  };

  const handleLogout = () => {
    navigate('/'); // Redireciona para a Home ou Login
  };

  // Definição dos itens do menu com as chaves de tradução corretas
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* SIDEBAR (Barra Lateral) */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col transition-colors duration-300">
        <div className="p-6 flex items-center gap-2">
          <img src="/logopequena.PNG" alt="Logo" className="h-8 w-8 object-contain" />
          <span className="font-bold text-xl text-gray-900 dark:text-white">EasyCheck</span>
        </div>

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

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('dashboard.menu.logout')}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT (Conteúdo Principal) */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER (Barra de Topo) */}
        <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 transition-colors duration-300">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {menuItems.find(i => i.id === activeTab)?.label}
          </h1>

          <div className="flex items-center gap-4">
            
            {/* Botão de Mudar Língua */}
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              title="Mudar Idioma / Change Language"
            >
              <Globe className="w-5 h-5" />
              <span className="font-bold text-sm uppercase">{i18n.language}</span>
            </button>

            {/* Botão de Tema (Dark/Light) */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              title="Mudar Tema / Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

            {/* Notificações */}
            <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>
            
            {/* Avatar do Utilizador */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                {userName.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTEÚDO */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Cartões de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-300 hover:shadow-md">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.stats.revenue')}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">€0,00</h3>
            </div>
            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-300 hover:shadow-md">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.stats.actions')}</p>
              <h3 className="text-2xl font-bold text-blue-600">0</h3>
            </div>
            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-300 hover:shadow-md">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.stats.invoices')}</p>
              <h3 className="text-2xl font-bold text-orange-500">0</h3>
            </div>
          </div>

          {/* Área de Boas-Vindas */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-3xl p-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('dashboard.welcome')} {userName}! 👋
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