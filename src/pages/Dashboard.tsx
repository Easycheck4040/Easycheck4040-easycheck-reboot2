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
  ArrowUpRight,
  Clock,
  CheckCircle,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userName] = useState('Iuri'); 
  
  // Estado do Tema (Dark Mode)
  const [isDark, setIsDark] = useState(false);

  // Verificar tema inicial
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

  // Dados fictícios para dar vida ao dashboard
  const recentActivities = [
    { id: 1, text: "Fatura #2024-001 gerada", time: "2 min atrás", icon: Calculator, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { id: 2, text: "Email respondido: Cliente John", time: "15 min atrás", icon: Mail, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { id: 3, text: "Novo funcionário registado", time: "1 hora atrás", icon: Users, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col transition-colors duration-300">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
             <img src="/logopequena.PNG" alt="Logo" className="h-6 w-6 object-contain brightness-0 invert" />
          </div>
          <span className="font-bold text-2xl text-gray-900 dark:text-white tracking-tight">EasyCheck</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'animate-pulse' : ''}`} />
              {item.label}
              {activeTab === item.id && <ArrowUpRight className="w-4 h-4 ml-auto opacity-50" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl mb-4 border border-gray-100 dark:border-gray-600">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {userName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                   <p className="text-sm font-bold text-gray-900 dark:text-white">{userName}</p>
                   <p className="text-xs text-gray-500 dark:text-gray-400">Pro Plan</p>
                </div>
             </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('dashboard.menu.logout')}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-24 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 z-10 sticky top-0 transition-colors duration-300">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
               {new Date().toLocaleDateString(i18n.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm font-bold shadow-sm"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{i18n.language}</span>
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800 animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* DASHBOARD SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* WELCOME BANNER */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Zap className="w-64 h-64" />
             </div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                   <h2 className="text-3xl font-bold mb-2">{t('dashboard.welcome')} {userName}! 👋</h2>
                   <p className="text-blue-100 text-lg max-w-xl">{t('dashboard.subtitle')}</p>
                </div>
                <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2 transform hover:scale-105">
                   <MessageSquare className="w-5 h-5" />
                   {t('dashboard.open_chat')}
                </button>
             </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl text-green-600">
                    <TrendingUp className="w-6 h-6" />
                 </div>
                 <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    +12% <ArrowUpRight className="w-3 h-3 ml-1" />
                 </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{t('dashboard.stats.revenue')}</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">€12,450</h3>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600">
                    <Zap className="w-6 h-6" />
                 </div>
                 <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                    +45 {t('nav.today') || 'Hoje'}
                 </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{t('dashboard.stats.actions')}</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">128</h3>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl text-orange-600">
                    <Clock className="w-6 h-6" />
                 </div>
                 <span className="text-xs font-bold text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-full">
                    3 Urgentes
                 </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{t('dashboard.stats.invoices')}</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">7</h3>
            </div>
          </div>

          {/* RECENT ACTIVITY & QUICK ACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Left Column: Activity */}
             <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                   <Clock className="w-5 h-5 text-gray-400" />
                   Atividade Recente da IA
                </h3>
                <div className="space-y-6">
                   {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 group">
                         <div className={`p-3 rounded-xl ${activity.bg} ${activity.color} group-hover:scale-110 transition-transform`}>
                            <activity.icon className="w-5 h-5" />
                         </div>
                         <div className="flex-1">
                            <p className="text-gray-900 dark:text-white font-medium">{activity.text}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                         </div>
                         <button className="text-gray-400 hover:text-blue-600 transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                         </button>
                      </div>
                   ))}
                </div>
             </div>

             {/* Right Column: Status */}
             <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                <div>
                   <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Status do Sistema</h3>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-900/30">
                         <span className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold">
                            <CheckCircle className="w-5 h-5" /> Online
                         </span>
                         <span className="text-sm text-green-600 dark:text-green-500">100% Uptime</span>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                         <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Uso Mensal da IA</span>
                            <span className="text-sm font-bold text-blue-600">65%</span>
                         </div>
                         <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full w-[65%]"></div>
                         </div>
                      </div>
                   </div>
                </div>
                
                <button className="w-full py-4 mt-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-bold flex items-center justify-center gap-2">
                   + Nova Automação
                </button>
             </div>

          </div>

        </div>
      </main>
    </div>
  );
}