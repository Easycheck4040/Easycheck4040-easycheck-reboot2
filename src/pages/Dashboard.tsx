import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Mail,
  User,
  Trash2,
  AlertTriangle,
  Lock,
  Save,
  Building2,
  Briefcase,
  Globe, 
  Moon,  
  Sun,
  ChevronDown,
  Eye,
  EyeOff,
  Shield,
  Pencil,
  UserMinus
} from 'lucide-react';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- ESTADOS GERAIS ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  // --- ESTADO PRIVACIDADE (OLHO) ---
  const [showFinancials, setShowFinancials] = useState(true);

  // --- ESTADO DO TEMA ---
  const [isDark, setIsDark] = useState(false);

  // --- DADOS DO UTILIZADOR ---
  const [userData, setUserData] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // --- DADOS DA EMPRESA (VAZIO INICIALMENTE) ---
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // --- MODAIS ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FORMULÁRIO PERFIL ---
  const [editForm, setEditForm] = useState({
    fullName: '',
    jobTitle: '',
    companyName: '',
    companyCode: '',
    email: '' 
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // LÍNGUAS DISPONÍVEIS
  const languages = [
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  ];

  // 1. CARREGAR DADOS
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) setIsDark(true);

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData(user);
        setEditForm({
          fullName: user.user_metadata.full_name || '',
          jobTitle: user.user_metadata.job_title || '',
          companyName: user.user_metadata.company_name || '',
          companyCode: user.user_metadata.company_code || '',
          email: user.email || '' 
        });

        // Se for Patrão, carregar equipa (Lógica futura)
        if (user.user_metadata.role === 'owner') {
           // Aqui farias o fetch real ao Supabase
           // setTeamMembers(data);
        }
      }
      setLoadingUser(false);
    };
    fetchUser();
  }, []);

  // --- FUNÇÕES UI ---
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const selectLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsLangMenuOpen(false);
  };

  const togglePrivacy = () => {
    setShowFinancials(!showFinancials);
  };

  const getInitials = (name: string) => {
    if (!name) return 'EC';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // --- AÇÕES DO UTILIZADOR ---
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: editForm.fullName,
          job_title: editForm.jobTitle,
          company_name: editForm.companyName 
        }
      });
      if (error) throw error;
      alert(t('profile.success') || "Perfil atualizado!");
      setIsProfileModalOpen(false);
      setUserData({
        ...userData,
        user_metadata: {
          ...userData.user_metadata,
          full_name: editForm.fullName,
          job_title: editForm.jobTitle,
          company_name: editForm.companyName
        }
      });
    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'ELIMINAR') {
      alert(t('delete.confirm_text'));
      return;
    }
    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      await supabase.auth.signOut();
      alert("Conta eliminada.");
      navigate('/');
    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard.menu.overview') || 'Visão Geral', path: '/dashboard' },
    { icon: MessageSquare, label: t('dashboard.menu.chat') || 'Chat IA', path: '/dashboard/chat' },
    { icon: FileText, label: t('dashboard.menu.accounting') || 'Contabilidade', path: '/dashboard/accounting' },
    { icon: Mail, label: t('dashboard.menu.communication') || 'Comunicação', path: '/dashboard/communication' },
    { icon: Users, label: t('dashboard.menu.hr') || 'Recursos Humanos', path: '/dashboard/hr' },
    { icon: BarChart3, label: t('dashboard.menu.marketing') || 'Marketing', path: '/dashboard/marketing' },
    { icon: Settings, label: t('dashboard.menu.settings') || 'Definições', path: '/dashboard/settings' },
  ];

  if (loadingUser) return <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">A carregar...</div>;

  const isOwner = userData?.user_metadata?.role === 'owner';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center px-6 border-b dark:border-gray-700">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logopequena.PNG" alt="Logo" className="h-8 w-auto object-contain" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">EasyCheck</span>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t dark:border-gray-700">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium">
              <LogOut className="w-5 h-5" />
              {t('dashboard.menu.logout') || 'Sair'}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-4 sm:px-8 shadow-sm z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white capitalize">
              {menuItems.find(i => i.path === location.pathname)?.label || t('dashboard.menu.overview')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            
            {/* LÍNGUAS (DROPDOWN) */}
            <div className="relative">
              <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Globe className="w-5 h-5" />
                <span className="font-bold text-sm uppercase hidden sm:block">{i18n.language}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsLangMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40">
                    {languages.map((lang) => (
                      <button key={lang.code} onClick={() => selectLanguage(lang.code)} className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300">
                        <span className="text-lg">{lang.flag}</span>{lang.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* TEMA (DIA/NOITE) */}
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* NOTIFICAÇÕES */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                <Bell className="w-6 h-6" />
              </button>
              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsNotifOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 p-4 z-40">
                    <h3 className="font-bold mb-3 dark:text-white border-b dark:border-gray-700 pb-2">{t('notifications.title') || 'Notificações'}</h3>
                    <p className="text-center py-4 text-gray-400 text-sm">{t('notifications.empty') || 'Sem novas notificações.'}</p>
                  </div>
                </>
              )}
            </div>

            {/* PERFIL */}
            <div className="relative">
              <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:opacity-90">
                {getInitials(userData?.user_metadata?.full_name)}
              </button>
              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden z-40">
                    <div className="px-4 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{userData?.user_metadata?.full_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">{userData?.email}</p>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full inline-block">
                        {isOwner ? (t('role.owner') || 'Patrão') : (t('role.employee') || 'Funcionário')}
                      </span>
                    </div>
                    <button onClick={() => { setIsProfileModalOpen(true); setIsProfileDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" /> {t('profile.edit') || 'Editar Perfil'}
                    </button>
                    <button onClick={() => { setIsDeleteModalOpen(true); setIsProfileDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t dark:border-gray-700">
                      <Trash2 className="w-4 h-4" /> {t('profile.delete') || 'Eliminar Conta'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* CONTEÚDO DAS ROTAS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* CARD RECEITA (COM OLHO) */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('dashboard.stats.revenue') || 'Receita Mensal'}</h3>
                      <button onClick={togglePrivacy} className="text-gray-400 hover:text-blue-600 transition-colors">
                        {showFinancials ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-all">
                      {showFinancials ? '€0,00' : '••••••'}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('dashboard.stats.actions') || 'Ações IA'}</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
                  </div>

                  {/* CARD FATURAS (COM OLHO) */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('dashboard.stats.invoices') || 'Faturas'}</h3>
                      <button onClick={togglePrivacy} className="text-gray-400 hover:text-orange-500 transition-colors">
                        {showFinancials ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-3xl font-bold text-orange-500 mt-1 transition-all">
                      {showFinancials ? '0' : '•••'}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-8 text-center">
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">
                    {t('dashboard.welcome') || 'Bem-vindo'}, {userData?.user_metadata?.full_name?.split(' ')[0]}! 👋
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 mb-6">{t('dashboard.subtitle') || 'O teu assistente IA está pronto.'}</p>
                  <Link to="/dashboard/chat" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg">
                    <MessageSquare className="w-5 h-5" />
                    {t('dashboard.open_chat') || 'Abrir Chat IA'}
                  </Link>
                </div>
              </div>
            } />

            {/* DEFINIÇÕES (COM GESTÃO DE EMPRESA SE FOR PATRÃO) */}
            <Route path="settings" element={
              <div className="space-y-6">
                {isOwner ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <Building2 className="w-6 h-6 text-blue-600" />
                      {t('settings.company_title') || 'Gestão da Empresa'}
                    </h2>
                    
                    <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                      <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">{t('settings.invite_code') || 'Código de Convite'}</h4>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <code className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg font-mono text-lg border dark:border-gray-700 select-all">
                          {userData?.user_metadata?.company_code}
                        </code>
                        <p className="text-sm text-blue-600 dark:text-blue-400">{t('settings.invite_text') || 'Partilha este código.'}</p>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {t('settings.team_members') || 'Membros da Equipa'}
                    </h3>
                    
                    {/* TABELA DE FUNCIONÁRIOS (OU MENSAGEM VAZIA) */}
                    {teamMembers.length === 0 ? (
                       <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">{t('settings.no_members') || 'Ainda não tens funcionários registados.'}</p>
                       </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b dark:border-gray-700 text-sm text-gray-500 uppercase">
                              <th className="py-3 px-2">{t('table.name') || 'Nome'}</th>
                              <th className="py-3 px-2">{t('table.email') || 'Email'}</th>
                              <th className="py-3 px-2">{t('table.role') || 'Cargo'}</th>
                              <th className="py-3 px-2 text-right">{t('table.actions') || 'Ações'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {teamMembers.map((member) => (
                              <tr key={member.id} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="py-3 px-2 font-medium dark:text-white">{member.name}</td>
                                <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{member.email}</td>
                                <td className="py-3 px-2">{member.jobTitle}</td>
                                <td className="py-3 px-2 text-right">
                                  {/* Botões de Ação na Tabela */}
                                  <div className="flex items-center justify-end gap-2">
                                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><UserMinus className="w-4 h-4" /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('settings.restricted_title') || 'Acesso Restrito'}</h3>
                    <p>{t('settings.restricted_text') || 'Apenas o patrão pode ver isto.'}</p>
                  </div>
                )}
              </div>
            } />
            
            {/* Outras rotas vazias */}
            <Route path="chat" element={<div className="h-full flex items-center justify-center text-gray-400">Chat IA...</div>} />
            <Route path="communication" element={<div className="h-full flex items-center justify-center text-gray-400">Comunicação...</div>} />
            <Route path="accounting" element={<div className="h-full flex items-center justify-center text-gray-400">Contabilidade...</div>} />
            <Route path="hr" element={<div className="h-full flex items-center justify-center text-gray-400">RH...</div>} />
            <Route path="marketing" element={<div className="h-full flex items-center justify-center text-gray-400">Marketing...</div>} />
          </Routes>
        </div>
      </main>
      
      {/* MODAL EDITAR PERFIL */}
      {isProfileModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl border dark:border-gray-700">
              <div className="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" /> {t('profile.edit_title') || 'Editar Perfil'}
                </h3>
                <button onClick={() => setIsProfileModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                 <div>
                   <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('form.email') || 'Email'}</label>
                   <input type="email" value={editForm.email} disabled className="w-full p-2 border rounded bg-gray-100 text-gray-500 dark:bg-gray-800 dark:border-gray-700" />
                 </div>
                 <div>
                   <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('form.fullname') || 'Nome'}</label>
                   <input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-600 dark:text-white" />
                 </div>
                 <div className="flex justify-end gap-2 mt-4">
                   <button onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2 border rounded dark:border-gray-600 dark:text-gray-300">{t('common.cancel') || 'Cancelar'}</button>
                   <button onClick={handleSaveProfile} disabled={savingProfile} className="px-4 py-2 bg-blue-600 text-white rounded">{t('common.save') || 'Guardar'}</button>
                 </div>
              </div>
            </div>
          </div>
      )}

      {/* MODAL APAGAR CONTA */}
      {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border dark:border-gray-700">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('delete.title') || 'Zona de Perigo'}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{t('delete.text') || 'Apagar conta? Escreve ELIMINAR:'}</p>
              <input type="text" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} className="w-full p-3 border rounded-lg mb-6 uppercase dark:bg-gray-900 dark:text-white dark:border-gray-600" />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white">{t('common.cancel') || 'Cancelar'}</button>
                <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold">{t('common.delete') || 'Apagar'}</button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}