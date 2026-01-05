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
  User,
  Building,
  Save,
  X
} from 'lucide-react';

// Interfaces para os tipos de dados
interface UserData {
  name: string;
  email: string;
  role: 'admin' | 'employee'; // admin = Patrão, employee = Empregado
  initials: string;
}

interface CompanyData {
  name: string;
  code: string;
  nif: string;
  address: string;
}

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDark, setIsDark] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  // --- DADOS SIMULADOS (ESTADO) ---
  const [user, setUser] = useState<UserData>({
    name: 'Iuri Santos',
    email: 'iuri@easycheckglobal.com',
    role: 'admin', // Mude para 'employee' para testar a visão do empregado
    initials: 'IS'
  });

  const [company, setCompany] = useState<CompanyData>({
    name: 'EasyCheck Global',
    code: 'EMP-2024-882',
    nif: '500100200',
    address: 'Lisboa, Portugal'
  });

  // Formulários temporários para edição
  const [editUserForm, setEditUserForm] = useState(user);
  const [editCompanyForm, setEditCompanyForm] = useState(company);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) setIsDark(true);
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

  const handleSaveProfile = () => {
    setUser(editUserForm);
    setShowProfileModal(false);
    alert("Perfil atualizado com sucesso!");
  };

  const handleSaveCompany = () => {
    setCompany(editCompanyForm);
    setShowCompanyModal(false);
    alert("Dados da empresa atualizados!");
  };

  // Menu dinâmico (Esconde 'Definições da Empresa' se for empregado)
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
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col transition-colors duration-300">
        <div className="p-6 flex items-center gap-3">
          <img src="/logopequena.PNG" alt="Logo" className="h-8 w-8 object-contain" />
          <span className="font-bold text-xl text-gray-900 dark:text-white">EasyCheck</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
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
           {/* Info da Empresa (Visível para todos, editável só por admin) */}
           <div className="mb-4 px-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Empresa</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{company.name}</p>
                {user.role === 'admin' && (
                  <button onClick={() => setShowCompanyModal(true)} className="text-blue-600 hover:text-blue-700 text-xs font-bold">
                    Editar
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{company.code}</p>
           </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('dashboard.menu.logout')}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER PROFISSIONAL */}
        <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 transition-colors duration-300">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {user.role === 'admin' ? 'Administrador' : 'Colaborador'} • {company.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleLanguage} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 font-bold text-xs uppercase">
              <Globe className="w-4 h-4" />
              {i18n.language}
            </button>

            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

            <button className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
            </button>
            
            {/* PERFIL DO UTILIZADOR (NO CANTO SUPERIOR DIREITO) */}
            <button 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.menu.settings')}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all">
                {user.initials}
              </div>
            </button>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">{t('dashboard.stats.revenue')}</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">€12,450</h3>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">{t('dashboard.stats.actions')}</p>
              <h3 className="text-3xl font-bold text-blue-600">128</h3>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">{t('dashboard.stats.invoices')}</p>
              <h3 className="text-3xl font-bold text-orange-500">7</h3>
            </div>
          </div>

          {/* WELCOME AREA */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-6 shadow-sm">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {t('dashboard.welcome')} {user.name.split(' ')[0]}! 👋
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                {t('dashboard.subtitle')}
              </p>
            </div>
            <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-transform hover:scale-105 flex items-center gap-3 shadow-lg shadow-blue-500/30">
              <MessageSquare className="w-5 h-5" />
              {t('dashboard.open_chat')}
            </button>
          </div>

        </div>

        {/* --- MODAIS DE EDIÇÃO --- */}

        {/* MODAL PERFIL (Para todos) */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Editar Perfil
                </h3>
                <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-red-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    value={editUserForm.name} 
                    onChange={e => setEditUserForm({...editUserForm, name: e.target.value})}
                    className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={editUserForm.email} 
                    onChange={e => setEditUserForm({...editUserForm, email: e.target.value})}
                    className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button onClick={() => setShowProfileModal(false)} className="flex-1 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 font-medium">Cancelar</button>
                  <button onClick={handleSaveProfile} className="flex-1 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold flex justify-center items-center gap-2">
                    <Save className="w-4 h-4" /> Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EMPRESA (Só Admin) */}
        {showCompanyModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  Dados da Empresa
                </h3>
                <button onClick={() => setShowCompanyModal(false)} className="text-gray-400 hover:text-red-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-xs text-yellow-700 dark:text-yellow-400 mb-2">
                  ⚠️ Alterações aqui afetam todos os utilizadores da empresa.
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Empresa</label>
                  <input 
                    type="text" 
                    value={editCompanyForm.name} 
                    onChange={e => setEditCompanyForm({...editCompanyForm, name: e.target.value})}
                    className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">NIF</label>
                  <input 
                    type="text" 
                    value={editCompanyForm.nif} 
                    onChange={e => setEditCompanyForm({...editCompanyForm, nif: e.target.value})}
                    className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Morada</label>
                  <input 
                    type="text" 
                    value={editCompanyForm.address} 
                    onChange={e => setEditCompanyForm({...editCompanyForm, address: e.target.value})}
                    className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none" 
                  />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button onClick={() => setShowCompanyModal(false)} className="flex-1 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 font-medium">Cancelar</button>
                  <button onClick={handleSaveCompany} className="flex-1 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-bold flex justify-center items-center gap-2">
                    <Save className="w-4 h-4" /> Atualizar Empresa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}