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
  Pencil,
  UserMinus,
  Shield,
  Copy,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // ==========================================
  // 1. ESTADOS GERAIS E DE UI
  // ==========================================
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  // Estados de Privacidade (Mascarar dados)
  const [showFinancials, setShowFinancials] = useState(true); // Para o dinheiro
  const [showCompanyCode, setShowCompanyCode] = useState(false); // Para o código da empresa

  // ==========================================
  // 2. DADOS (USER & EMPRESA)
  // ==========================================
  const [userData, setUserData] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // Lista de membros (Começa vazia, será preenchida pelo Supabase)
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // ==========================================
  // 3. ESTADOS DOS MODAIS
  // ==========================================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Modais de Gestão de Equipa
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<any>(null);
  
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // ==========================================
  // 4. FORMULÁRIOS
  // ==========================================
  
  // Formulário de Edição de Perfil (Pessoal)
  const [editForm, setEditForm] = useState({
    fullName: '',
    jobTitle: '',
    email: '' 
  });

  // Formulário de Edição de Empresa (Só Patrão)
  const [companyForm, setCompanyForm] = useState({
    name: '',
    address: '',
    nif: ''
  });

  // Línguas Suportadas
  const languages = [
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  ];

  // ==========================================
  // 5. EFEITOS (CARREGAMENTO INICIAL)
  // ==========================================
  useEffect(() => {
    // Verificar tema
    if (document.documentElement.classList.contains('dark')) setIsDark(true);

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData(user);
        
        // Preencher formulários iniciais
        setEditForm({
          fullName: user.user_metadata.full_name || '',
          jobTitle: user.user_metadata.job_title || '',
          email: user.email || '' 
        });
        
        setCompanyForm({
          name: user.user_metadata.company_name || '',
          address: user.user_metadata.company_address || '',
          nif: user.user_metadata.company_nif || ''
        });

        // Se for Patrão, aqui farias o fetch real dos funcionários
        if (user.user_metadata.role === 'owner') {
           // Exemplo de como seria a query real:
           // const { data } = await supabase.from('profiles').select('*').eq('company_code', user.user_metadata.company_code);
           // setTeamMembers(data || []);
           
           // Para demonstração, vamos deixar vazio ou podes descomentar abaixo para testar:
           // setTeamMembers([{ id: 1, name: 'Teste', email: 'teste@mail.com', jobTitle: 'Dev', role: 'employee' }]);
        }
      }
      setLoadingUser(false);
    };
    fetchUser();
  }, []);

  // ==========================================
  // 6. FUNÇÕES AUXILIARES
  // ==========================================
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const selectLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsLangMenuOpen(false);
  };

  const toggleFinancials = () => setShowFinancials(!showFinancials);
  const toggleCompanyCode = () => setShowCompanyCode(!showCompanyCode);

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

  const copyCode = () => {
    if (userData?.user_metadata?.company_code) {
      navigator.clipboard.writeText(userData.user_metadata.company_code);
      alert("Código copiado!");
    }
  };

  // ==========================================
  // 7. AÇÕES DE PERFIL E CONTA
  // ==========================================
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      // Objeto de atualização
      const updates: any = {
        full_name: editForm.fullName,
        job_title: editForm.jobTitle,
      };

      // Se for patrão, atualiza também os dados da empresa
      if (userData?.user_metadata?.role === 'owner') {
        updates.company_name = companyForm.name;
        updates.company_address = companyForm.address;
        updates.company_nif = companyForm.nif;
      }

      const { error } = await supabase.auth.updateUser({ data: updates });
      if (error) throw error;
      
      alert(t('profile.success') || "Atualizado com sucesso!");
      setIsProfileModalOpen(false);
      
      // Atualizar estado local para refletir mudanças imediatas
      setUserData({
        ...userData,
        user_metadata: { ...userData.user_metadata, ...updates }
      });

    } catch (error: any) {
      alert("Erro ao atualizar: " + error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'ELIMINAR') {
      alert(t('delete.confirm_text') || "Escreve ELIMINAR para confirmar.");
      return;
    }
    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc('delete_user'); // Chama a função no Supabase
      if (error) throw error;
      await supabase.auth.signOut();
      navigate('/');
    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // ==========================================
  // 8. GESTÃO DE EQUIPA (Lógica)
  // ==========================================
  const openEditMember = (member: any) => {
    setMemberToEdit({ ...member });
    setIsEditMemberModalOpen(true);
  };

  const saveMemberRole = () => {
    // Aqui farias o update no Supabase: UPDATE profiles SET job_title = ... WHERE id = ...
    setTeamMembers(prev => prev.map(m => m.id === memberToEdit.id ? memberToEdit : m));
    setIsEditMemberModalOpen(false);
    alert(t('team.role_updated') || "Cargo atualizado!");
  };

  const deleteMember = (id: number) => {
    if (window.confirm(t('team.delete_confirm') || "Remover este funcionário?")) {
      // Aqui farias o delete no Supabase
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      alert(t('team.member_removed') || "Removido.");
    }
  };

  // ==========================================
  // 9. RENDERIZAÇÃO
  // ==========================================
  
  if (loadingUser) return <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">A carregar...</div>;

  const isOwner = userData?.user_metadata?.role === 'owner';

  // Definição do Menu Lateral
  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard.menu.overview') || 'Visão Geral', path: '/dashboard' },
    { icon: MessageSquare, label: t('dashboard.menu.chat') || 'Chat IA', path: '/dashboard/chat' },
    
    // GESTÃO DE EMPRESA (Só aparece para Patrão)
    { icon: Building2, label: t('dashboard.menu.company') || 'Empresa', path: '/dashboard/company', hidden: !isOwner, special: true },
    
    // Ferramentas
    { icon: FileText, label: t('dashboard.menu.accounting') || 'Contabilidade', path: '/dashboard/accounting' },
    { icon: Mail, label: t('dashboard.menu.communication') || 'Comunicação', path: '/dashboard/communication' },
    { icon: Users, label: t('dashboard.menu.hr') || 'RH', path: '/dashboard/hr' },
    { icon: BarChart3, label: t('dashboard.menu.marketing') || 'Marketing', path: '/dashboard/marketing' },
    
    // Definições Gerais
    { icon: Settings, label: t('dashboard.menu.settings') || 'Definições', path: '/dashboard/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b dark:border-gray-700">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logopequena.PNG" alt="Logo" className="h-8 w-auto object-contain" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">EasyCheck</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.hidden) return null; // Esconde se não tiver permissão
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : item.special 
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-100 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
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
      </aside>

      {/* --- ÁREA PRINCIPAL --- */}
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
            
            {/* Seletor de Língua */}
            <div className="relative">
              <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-500 dark:text-gray-400 transition-colors">
                <Globe className="w-5 h-5" />
                <span className="font-bold text-sm uppercase hidden sm:block">{i18n.language}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsLangMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40 animate-in fade-in zoom-in-95 duration-100">
                    {languages.map((lang) => (
                      <button key={lang.code} onClick={() => selectLanguage(lang.code)} className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300">
                        <span className="text-lg">{lang.flag}</span>{lang.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Tema */}
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notificações */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
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

            {/* Perfil & Código da Empresa */}
            <div className="relative">
              <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:opacity-90 transition-opacity">
                {getInitials(userData?.user_metadata?.full_name)}
              </button>
              
              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{userData?.user_metadata?.full_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">{userData?.email}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full inline-block">
                          {isOwner ? (t('role.owner') || 'Patrão') : (t('role.employee') || 'Funcionário')}
                        </span>
                      </div>

                      {/* CAIXA COM CÓDIGO DA EMPRESA (COM OLHO) */}
                      <div className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between group">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">{t('form.code') || 'Código'}</span>
                          <span className="text-xs font-mono font-medium text-gray-700 dark:text-gray-200 tracking-wide select-all">
                            {showCompanyCode ? userData?.user_metadata?.company_code : '••••••••'}
                          </span>
                        </div>
                        <button 
                          onClick={toggleCompanyCode} 
                          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                          title={showCompanyCode ? "Esconder" : "Mostrar"}
                        >
                          {showCompanyCode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>

                    </div>
                    <button onClick={() => { setIsProfileModalOpen(true); setIsProfileDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
                      <User className="w-4 h-4 text-blue-600" /> {t('profile.edit') || 'Editar Perfil'}
                    </button>
                    <button onClick={() => { setIsDeleteModalOpen(true); setIsProfileDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t dark:border-gray-700 transition-colors">
                      <Trash2 className="w-4 h-4" /> {t('profile.delete') || 'Eliminar Conta'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* CARD RECEITA */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('dashboard.stats.revenue') || 'Receita Mensal'}</h3>
                      <button onClick={toggleFinancials} className="text-gray-400 hover:text-blue-600 transition-colors">
                        {showFinancials ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-all">
                      {showFinancials ? '€0,00' : '••••••'}
                    </p>
                  </div>

                  {/* CARD AÇÕES */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('dashboard.stats.actions') || 'Ações da IA'}</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
                  </div>

                  {/* CARD FATURAS */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('dashboard.stats.invoices') || 'Faturas'}</h3>
                      <button onClick={toggleFinancials} className="text-gray-400 hover:text-orange-500 transition-colors">
                        {showFinancials ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-3xl font-bold text-orange-500 mt-1 transition-all">
                      {showFinancials ? '0' : '•••'}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-8 text-center shadow-sm">
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">
                    {t('dashboard.welcome') || 'Bem-vindo'}, {userData?.user_metadata?.full_name?.split(' ')[0]}! 👋
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 mb-6">{t('dashboard.subtitle') || 'O teu assistente IA está pronto.'}</p>
                  <Link to="/dashboard/chat" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                    <MessageSquare className="w-5 h-5" />
                    {t('dashboard.open_chat') || 'Abrir Chat IA'}
                  </Link>
                </div>
              </div>
            } />

            {/* ROTA DA EMPRESA (SÓ PARA PATRÃO) */}
            <Route path="company" element={
              isOwner ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <Building2 className="w-6 h-6 text-blue-600" />
                      {t('settings.company_title') || 'Gestão da Empresa'}
                    </h2>
                    
                    {/* CARTÃO DE CONVITE */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1 text-lg">{t('settings.invite_code') || 'Código de Convite'}</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">{t('settings.invite_text') || 'Partilha este código com a tua equipa.'}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <code className="px-3 font-mono text-lg font-bold text-gray-700 dark:text-gray-300 tracking-wider">
                          {userData?.user_metadata?.company_code}
                        </code>
                        <button onClick={copyCode} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 hover:text-blue-600 transition-colors" title="Copiar">
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-500" />
                        {t('settings.team_members') || 'Membros da Equipa'}
                      </h3>
                      <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">
                        {teamMembers.length} {teamMembers.length === 1 ? 'Membro' : 'Membros'}
                      </span>
                    </div>
                    
                    {/* LISTA DE FUNCIONÁRIOS */}
                    {teamMembers.length === 0 ? (
                       <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                          <div className="bg-gray-50 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="text-gray-900 dark:text-white font-medium mb-1">Equipa Vazia</h4>
                          <p className="text-gray-500 text-sm max-w-xs mx-auto">{t('settings.no_members') || 'Usa o código acima para convidar pessoas.'}</p>
                       </div>
                    ) : (
                      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr className="text-xs text-gray-500 uppercase tracking-wider">
                              <th className="py-4 px-4 font-semibold">{t('table.name') || 'Nome'}</th>
                              <th className="py-4 px-4 font-semibold">{t('table.email') || 'Email'}</th>
                              <th className="py-4 px-4 font-semibold">{t('table.role') || 'Cargo'}</th>
                              <th className="py-4 px-4 font-semibold text-right">{t('table.actions') || 'Ações'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {teamMembers.map((member) => (
                              <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                <td className="py-4 px-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                    {getInitials(member.name)}
                                  </div>
                                  {member.name}
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{member.email}</td>
                                <td className="py-4 px-4">
                                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                    {member.jobTitle}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditMember(member)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Editar">
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => deleteMember(member.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Remover">
                                      <UserMinus className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                 <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                   <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-6">
                     <Shield className="w-12 h-12 text-gray-400" />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('settings.restricted_title') || 'Acesso Restrito'}</h3>
                   <p className="text-gray-500 max-w-md">{t('settings.restricted_text') || 'Esta área é exclusiva para a gestão da empresa e só pode ser acedida pelo proprietário.'}</p>
                 </div>
              )
            } />

            <Route path="settings" element={
               <div className="p-12 text-center text-gray-500">
                  <Settings className="w-16 h-16 mx-auto mb-6 opacity-30" />
                  <h3 className="text-lg font-medium">{t('dashboard.menu.settings') || 'Definições Gerais'}</h3>
                  <p>Preferências da aplicação aparecerão aqui.</p>
               </div>
            } />
            
            <Route path="*" element={<div className="h-full flex items-center justify-center text-gray-400">Em desenvolvimento...</div>} />
          </Routes>
        </div>
      </main>
      
      {/* --- MODAL EDITAR PERFIL --- */}
      {isProfileModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl border dark:border-gray-700 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" /> {t('profile.edit_title') || 'Editar Perfil'}
                </h3>
                <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-5">
                 {/* DADOS PESSOAIS */}
                 <div>
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Informação Pessoal</h4>
                   <div className="grid gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('form.email') || 'Email'}</label>
                       <div className="relative">
                         <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                         <input type="email" value={editForm.email} disabled className="w-full pl-9 p-3 border rounded-xl bg-gray-50 text-gray-500 dark:bg-gray-900 dark:border-gray-700 cursor-not-allowed" />
                       </div>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('form.fullname') || 'Nome Completo'}</label>
                       <input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('form.jobtitle') || 'Cargo'}</label>
                       <input type="text" value={editForm.jobTitle} onChange={e => setEditForm({...editForm, jobTitle: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                     </div>
                   </div>
                 </div>
                 
                 {/* DADOS DA EMPRESA (SÓ PATRÃO) */}
                 {isOwner && (
                   <div className="pt-4 border-t dark:border-gray-700">
                     <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                       <Building2 className="w-4 h-4" /> {t('profile.company_section') || 'Dados da Empresa'}
                     </h4>
                     <div className="grid gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('form.company_name') || 'Nome da Empresa'}</label>
                          <input type="text" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('form.address') || 'Morada'}</label>
                            <input type="text" value={companyForm.address} onChange={e => setCompanyForm({...companyForm, address: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('form.nif') || 'NIF'}</label>
                            <input type="text" value={companyForm.nif} onChange={e => setCompanyForm({...companyForm, nif: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                          </div>
                        </div>
                     </div>
                   </div>
                 )}
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700">
                <button onClick={() => setIsProfileModalOpen(false)} className="px-5 py-2.5 border rounded-xl text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 font-medium transition-colors">{t('common.cancel') || 'Cancelar'}</button>
                <button onClick={handleSaveProfile} disabled={savingProfile} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2 disabled:opacity-50 transition-colors">
                  {savingProfile ? (t('common.saving') || 'A Guardar...') : <><Save className="w-4 h-4"/> {t('common.save') || 'Guardar'}</>}
                </button>
              </div>
            </div>
          </div>
      )}

      {/* --- MODAL EDITAR CARGO (PATRÃO) --- */}
      {isEditMemberModalOpen && memberToEdit && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl border dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('team.edit_role') || 'Editar Cargo'}</h3>
               <p className="text-sm text-gray-500 mb-4">{memberToEdit.name}</p>
               
               <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('form.jobtitle') || 'Novo Cargo'}</label>
                 <input 
                   type="text" 
                   value={memberToEdit.jobTitle} 
                   onChange={e => setMemberToEdit({...memberToEdit, jobTitle: e.target.value})} 
                   className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                   autoFocus
                 />
               </div>
               
               <div className="flex justify-end gap-3">
                  <button onClick={() => setIsEditMemberModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 rounded-lg font-medium">{t('common.cancel') || 'Cancelar'}</button>
                  <button onClick={saveMemberRole} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">{t('common.save') || 'Guardar'}</button>
               </div>
            </div>
         </div>
      )}

      {/* --- MODAL APAGAR CONTA --- */}
      {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full"><AlertTriangle className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('delete.title') || 'Zona de Perigo'}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{t('delete.text') || 'Esta ação é irreversível. Para confirmar, escreve ELIMINAR:'}</p>
              <input type="text" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} placeholder="ELIMINAR" className="w-full p-3 border rounded-xl mb-6 uppercase dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-red-500 outline-none font-bold tracking-widest" />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg font-medium">{t('common.cancel') || 'Cancelar'}</button>
                <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-lg">{t('common.delete') || 'Apagar Conta'}</button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}