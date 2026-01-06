import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client';
import { 
  LayoutDashboard, MessageSquare, FileText, Users, BarChart3, Settings, LogOut, Menu, X, Globe, Moon, Sun, ChevronDown, Eye, EyeOff, User, Trash2, AlertTriangle, Building2, Copy, Send, Shield, Mail, Plus, Search, FileCheck, Calculator, TrendingUp, Archive, CreditCard
} from 'lucide-react';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ CONFIGURAÇÃO API
  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://easycheck-api.onrender.com';

  // --- LISTA DE PAÍSES (Europa + Mundo) ---
  const countries = [
    "Portugal", "Brasil", "France", "Deutschland (Germany)", "España (Spain)", "Italia", "United Kingdom", 
    "Luxembourg", "Belgique (Belgium)", "Suisse (Switzerland)", "Nederland (Netherlands)", "Ireland", "Österreich (Austria)", "Sverige (Sweden)", "Norge (Norway)", "Danmark (Denmark)", "Suomi (Finland)", "Polska (Poland)",
    "United States", "Canada", "Angola", "Moçambique", "Cabo Verde", "China", "Japan", "India", "Australia"
  ];

  // --- ESTADOS GERAIS ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  // --- ESTADOS DO CHAT ---
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou a IA do EasyCheck. Em que posso ajudar na gestão da sua empresa?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- ESTADOS DE DADOS ---
  const [showFinancials, setShowFinancials] = useState(true); 
  const [showModalCode, setShowModalCode] = useState(false);
  const [showPageCode, setShowPageCode] = useState(false);

  const [isDark, setIsDark] = useState(false);
  const [userData, setUserData] = useState<any>(null); 
  const [profileData, setProfileData] = useState<any>(null); 
  const [loadingUser, setLoadingUser] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // --- NOVOS ESTADOS DE CONTABILIDADE ---
  const [accountingTab, setAccountingTab] = useState('overview'); // overview, journal, invoices, clients, assets
  const [clients, setClients] = useState<any[]>([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', nif: '', email: '', country: 'Portugal', address: '' });

  // --- MODAIS ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // --- FORMULÁRIOS ---
  const [editForm, setEditForm] = useState({ fullName: '', jobTitle: '', email: '' });
  const [companyForm, setCompanyForm] = useState({ name: '', address: '', nif: '', country: 'Portugal', currency: 'EUR' });

  const languages = [
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  ];

  // SCROLL DO CHAT
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ BUSCAR DADOS (User, Profile, Clientes)
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) setIsDark(true);
    
    const fetchData = async () => {
      // 1. Buscar utilizador logado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserData(user);
        
        // 2. Buscar Perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
            setProfileData(profile);
            setEditForm({
                fullName: profile.full_name || '',
                jobTitle: profile.role === 'owner' ? 'CEO / Fundador' : 'Colaborador',
                email: user.email || '' 
            });
            setCompanyForm({
                name: profile.company_name || '',
                address: '', 
                nif: '',
                country: profile.country || 'Portugal',
                currency: profile.currency || 'EUR'
            });
        }

        // 3. Buscar Clientes (Novo!)
        const { data: clientsData } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (clientsData) setClients(clientsData);
      }
      setLoadingUser(false);
    };
    
    fetchData();
  }, []);

  // ENVIO DE MENSAGEM CHAT (Com contexto do País)
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      // Envia o país para a IA saber as leis
      const contextMessage = `[Contexto: Empresa em ${companyForm.country}, Moeda: ${companyForm.currency}] ${chatInput}`;
      
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: contextMessage }),
      });
      const data = await response.json();
      if (data.reply) setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      else throw new Error();
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Erro ao ligar ao servidor.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const toggleTheme = () => { document.documentElement.classList.toggle('dark'); setIsDark(!isDark); };
  const toggleFinancials = () => setShowFinancials(!showFinancials);
  const selectLanguage = (code: string) => { i18n.changeLanguage(code); setIsLangMenuOpen(false); };
  const getInitials = (name: string) => name ? (name.split(' ').length > 1 ? (name.split(' ')[0][0] + name.split(' ')[name.split(' ').length - 1][0]) : name.substring(0, 2)).toUpperCase() : 'EC';
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  // ✅ GUARDAR PERFIL + DEFINIÇÕES PAÍS
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      if (!userData) return;
      const updates = {
        full_name: editForm.fullName,
        company_name: companyForm.name,
        country: companyForm.country,
        currency: companyForm.currency,
        updated_at: new Date(),
      };
      const { error } = await supabase.from('profiles').update(updates).eq('id', userData.id);
      if (error) throw error;
      
      alert("Definições guardadas! A IA foi atualizada para a legislação de: " + companyForm.country);
      setIsProfileModalOpen(false);
      setProfileData({ ...profileData, ...updates });
    } catch (error: any) { alert("Erro ao guardar: " + error.message); } 
    finally { setSavingProfile(false); }
  };

  // ✅ CRIAR NOVO CLIENTE
  const handleCreateClient = async () => {
    if (!newClient.name) return alert("O nome é obrigatório.");
    try {
        const { data, error } = await supabase
            .from('clients')
            .insert([{
                user_id: userData.id,
                name: newClient.name,
                nif: newClient.nif,
                email: newClient.email,
                country: newClient.country,
                address: newClient.address
            }])
            .select();
            
        if (error) throw error;
        
        if (data) {
            setClients([data[0], ...clients]);
            setShowClientModal(false);
            setNewClient({ name: '', nif: '', email: '', country: 'Portugal', address: '' });
        }
    } catch (error: any) {
        alert("Erro ao criar cliente: " + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'ELIMINAR') return alert(t('delete.confirm_text'));
    setIsDeleting(true);
    try { await supabase.rpc('delete_user'); await supabase.auth.signOut(); navigate('/'); } 
    catch(e: any) { alert(e.message); } 
    finally { setIsDeleting(false); }
  };

  const copyCode = () => { navigator.clipboard.writeText(profileData?.company_code); alert("Código copiado!"); };

  if (loadingUser) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">Loading...</div>;
  const isOwner = profileData?.role === 'owner';

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard.menu.overview'), path: '/dashboard' },
    { icon: MessageSquare, label: t('dashboard.menu.chat'), path: '/dashboard/chat' },
    { icon: FileText, label: 'Contabilidade', path: '/dashboard/accounting' },
    { icon: Mail, label: t('dashboard.menu.communication'), path: '/dashboard/communication' },
    { icon: Users, label: t('dashboard.menu.hr'), path: '/dashboard/hr' },
    { icon: BarChart3, label: t('dashboard.menu.marketing'), path: '/dashboard/marketing' },
    { icon: Building2, label: t('dashboard.menu.company'), path: '/dashboard/company', hidden: !isOwner, special: true },
    { icon: Settings, label: t('dashboard.menu.settings'), path: '/dashboard/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform transition-transform duration-200 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b dark:border-gray-700">
          <Link to="/" className="flex items-center gap-3"><img src="/logopequena.PNG" className="h-8 w-auto"/><span className="font-bold text-xl dark:text-white">EasyCheck</span></Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.hidden) return null;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-blue-600 text-white shadow-lg' : item.special ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-100 dark:border-purple-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <item.icon className="w-5 h-5" /><span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t dark:border-gray-700">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium">
            <LogOut className="w-5 h-5" /> {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between px-8 shadow-sm z-20 items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden"><Menu /></button>
            <h2 className="text-xl font-bold dark:text-white">{menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2 flex gap-2 dark:text-gray-400"><Globe className="w-5 h-5"/><ChevronDown className="w-3 h-3"/></button>
              {isLangMenuOpen && <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40">
                {languages.map(l => <button key={l.code} onClick={() => selectLanguage(l.code)} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-2"><span>{l.flag}</span>{l.label}</button>)}
              </div>}
            </div>
            <button onClick={toggleTheme} className="p-2 dark:text-gray-400">{isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}</button>
            
            <div className="relative">
              <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full text-white font-bold shadow-md cursor-pointer hover:opacity-90">
                {getInitials(profileData?.full_name || userData?.email)}
              </button>
              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute top-16 right-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40 overflow-hidden">
                    <div className="px-4 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <p className="font-bold dark:text-white truncate">{profileData?.full_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">{userData?.email}</p>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full inline-block">
                        {isOwner ? t('role.owner') : t('role.employee')}
                      </span>
                    </div>
                    <button onClick={() => {setIsProfileModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-2 dark:text-gray-300 text-sm font-medium"><User className="w-4 h-4"/> {t('profile.edit')}</button>
                    <button onClick={() => {setIsDeleteModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex gap-2 border-t dark:border-gray-700 text-sm font-medium"><Trash2 className="w-4 h-4"/> {t('profile.delete')}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={
              <div className="p-8 space-y-6 overflow-y-auto h-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                    <div className="flex justify-between"><h3 className="text-gray-500 text-sm font-medium">{t('dashboard.stats.revenue')}</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div>
                    <p className="text-3xl font-bold dark:text-white">{showFinancials ? '€0,00' : '••••••'}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700"><h3 className="text-gray-500 text-sm font-medium">{t('dashboard.stats.actions')}</h3><p className="text-3xl font-bold text-blue-600 mt-2">0</p></div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                    <div className="flex justify-between"><h3 className="text-gray-500 text-sm font-medium">{t('dashboard.stats.invoices')}</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div>
                    <p className="text-3xl font-bold text-orange-500">{showFinancials ? '0' : '•••'}</p>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-8 text-center shadow-lg">
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">{t('dashboard.welcome')}, {profileData?.full_name?.split(' ')[0] || 'Gestor'}! 👋</h3>
                  <Link to="/dashboard/chat" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg"><MessageSquare className="w-5 h-5" />{t('dashboard.open_chat')}</Link>
                </div>
              </div>
            } />

            {/* ✅ NOVA ROTA: CONTABILIDADE COMPLETA */}
            <Route path="accounting" element={
                <div className="h-full flex flex-col p-6 overflow-y-auto">
                    {/* SUB-HEADER CONTABILIDADE */}
                    <div className="flex gap-2 border-b dark:border-gray-700 pb-4 mb-6 overflow-x-auto">
                        <button onClick={() => setAccountingTab('overview')} className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex gap-2 items-center ${accountingTab === 'overview' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}><BarChart3 size={16}/> Visão Geral</button>
                        <button onClick={() => setAccountingTab('journal')} className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex gap-2 items-center ${accountingTab === 'journal' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}><FileText size={16}/> Diário</button>
                        <button onClick={() => setAccountingTab('invoices')} className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex gap-2 items-center ${accountingTab === 'invoices' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}><FileCheck size={16}/> Faturas (Vendas)</button>
                        <button onClick={() => setAccountingTab('clients')} className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex gap-2 items-center ${accountingTab === 'clients' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}><Users size={16}/> Clientes</button>
                        <button onClick={() => setAccountingTab('assets')} className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex gap-2 items-center ${accountingTab === 'assets' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}><Calculator size={16}/> Ativos</button>
                    </div>

                    <div className="flex-1">
                        {/* 1. VISÃO GERAL */}
                        {accountingTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm">
                                    <h3 className="text-sm text-gray-500 font-bold uppercase flex gap-2 items-center"><TrendingUp size={16}/> Resultado Líquido</h3>
                                    <p className="text-3xl font-bold mt-2 text-green-600">€ 0,00</p>
                                    <p className="text-xs text-gray-400 mt-2">Período atual</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm">
                                    <h3 className="text-sm text-gray-500 font-bold uppercase flex gap-2 items-center"><Archive size={16}/> Impostos a Pagar</h3>
                                    <p className="text-3xl font-bold mt-2 text-red-500">€ 0,00</p>
                                    <p className="text-xs text-gray-400 mt-2">IVA + IRC/IRS estimado</p>
                                </div>
                            </div>
                        )}

                        {/* 2. TABELA DE CLIENTES */}
                        {accountingTab === 'clients' && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                                    <h3 className="font-bold">Base de Dados de Clientes</h3>
                                    <button onClick={() => setShowClientModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex gap-2 items-center hover:bg-blue-700 shadow-sm"><Plus size={16}/> Novo Cliente</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 uppercase text-xs">
                                            <tr><th className="px-6 py-3">Nome</th><th className="px-6 py-3">NIF/VAT</th><th className="px-6 py-3">País</th><th className="px-6 py-3">Ações</th></tr>
                                        </thead>
                                        <tbody>
                                            {clients.length === 0 ? <tr><td colSpan={4} className="text-center py-10 text-gray-400">Nenhum cliente encontrado. Adicione o primeiro!</td></tr> : 
                                                clients.map(client => (
                                                    <tr key={client.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{client.name}</td>
                                                        <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">{client.nif || '-'}</td>
                                                        <td className="px-6 py-4">{client.country}</td>
                                                        <td className="px-6 py-4"><button className="text-blue-600 hover:text-blue-800 font-medium">Editar</button></td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* 3. FATURAS (Placeholder) */}
                        {accountingTab === 'invoices' && (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm">
                                <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                                <h3 className="text-xl font-bold dark:text-white">Emissão de Faturas</h3>
                                <p className="text-gray-500 mb-6">Emita faturas certificadas adaptadas à lei de {companyForm.country}.</p>
                                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105">Criar Primeira Fatura</button>
                            </div>
                        )}

                         {/* 4. ATIVOS (Placeholder) */}
                         {accountingTab === 'assets' && (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm">
                                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                                <h3 className="text-xl font-bold dark:text-white">Gestão de Ativos</h3>
                                <p className="text-gray-500">Cálculo automático de depreciação e mapas de amortização.</p>
                            </div>
                        )}
                    </div>
                </div>
            } />

            <Route path="chat" element={
              <div className="flex flex-col h-full bg-white dark:bg-gray-800 m-4 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-700 dark:text-white rounded-tl-none'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && <div className="text-xs text-gray-400 ml-4 animate-pulse">A EasyCheck está a escrever...</div>}
                </div>
                <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <form onSubmit={handleSendChatMessage} className="flex gap-2 relative">
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Pergunte algo sobre a sua contabilidade..." className="flex-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white shadow-sm"/>
                    <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"><Send size={18} /></button>
                  </form>
                </div>
              </div>
            } />

            <Route path="company" element={isOwner ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8 m-4 overflow-y-auto">
                  <h2 className="text-2xl font-bold dark:text-white mb-6 flex gap-3"><Building2 className="text-blue-600"/> {t('settings.company_title')}</h2>
                  
                  <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div><h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1">{t('settings.invite_code')}</h4><p className="text-sm text-blue-600 dark:text-blue-400">{t('settings.invite_text')}</p></div>
                    <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                      <code className="px-2 font-mono text-lg font-bold text-gray-700 dark:text-gray-300">
                        {showPageCode ? (profileData?.company_code || 'Gera Novo') : '••••••••'}
                      </code>
                      <button onClick={() => setShowPageCode(!showPageCode)} className="p-2 text-gray-400 hover:text-blue-600">{showPageCode ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                      <button onClick={copyCode} className="p-2 text-gray-400 hover:text-blue-600"><Copy className="w-4 h-4"/></button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold dark:text-white mb-4 flex gap-2"><Users className="w-5 h-5"/> {t('settings.team_members')}</h3>
                  {teamMembers.length === 0 ? <div className="text-center py-12 border-2 border-dashed rounded-xl text-gray-500">{t('settings.no_members')}</div> : <div>Tabela aqui...</div>}
                </div>
              ) : <div className="text-center py-12"><Shield className="w-16 h-16 mx-auto mb-4 text-gray-300"/><h3 className="text-xl font-bold dark:text-white">Acesso Restrito</h3></div>
            } />

            {/* ✅ PÁGINA SETTINGS AGORA TEM SELETOR DE PAÍS */}
            <Route path="settings" element={
                 <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8 m-4">
                    <h2 className="text-2xl font-bold mb-6 flex gap-2 items-center dark:text-white"><Settings/> Configuração da Empresa</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-gray-300">Nome da Empresa</label>
                            <input value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-gray-300">País da Sede Fiscal</label>
                            <select value={companyForm.country} onChange={e => setCompanyForm({...companyForm, country: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white">
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <p className="text-xs text-blue-600 mt-1 dark:text-blue-400">ℹ️ A IA usará as leis deste país para calcular impostos.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-bold mb-1 dark:text-gray-300">Moeda Base</label><input value={companyForm.currency} onChange={e => setCompanyForm({...companyForm, currency: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white"/></div>
                            <div><label className="block text-sm font-bold mb-1 dark:text-gray-300">NIF</label><input value={companyForm.nif} placeholder="Opcional" onChange={e => setCompanyForm({...companyForm, nif: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white"/></div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button onClick={handleSaveProfile} disabled={savingProfile} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md">{savingProfile ? 'A guardar...' : 'Guardar Configurações'}</button>
                    </div>
                 </div>
            } />
            <Route path="*" element={<div className="flex justify-center py-10 text-gray-400">Em desenvolvimento...</div>} />
          </Routes>
        </div>
      </main>

      {/* MODAL PERFIL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl border dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
              <h3 className="text-xl font-bold dark:text-white flex items-center gap-2"><User className="text-blue-600"/> {t('profile.edit_title')}</h3>
              <button onClick={() => setIsProfileModalOpen(false)}><X className="text-gray-400"/></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm dark:text-gray-300 mb-1">{t('form.email')}</label><input type="email" value={editForm.email} disabled className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-900 cursor-not-allowed dark:text-gray-400"/></div>
              <div><label className="block text-sm dark:text-gray-300 mb-1">{t('form.fullname')}</label><input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white"/></div>
              
              {isOwner && (
                <>
                  <div className="pt-4 border-t dark:border-gray-700"><h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2"><Building2 className="w-4 h-4"/> {t('PROFILE.COMPANY_SECTION')}</h4></div>
                  <div><label className="block text-sm dark:text-gray-300 mb-1">{t('form.company_name')}</label><input type="text" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white"/></div>
                  <div>
                      <label className="block text-sm dark:text-gray-300 mb-1">País</label>
                      <select value={companyForm.country} onChange={e => setCompanyForm({...companyForm, country: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white">
                          {countries.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700">
              <button onClick={() => setIsProfileModalOpen(false)} className="px-5 py-2.5 border rounded-xl dark:text-gray-300">{t('common.cancel')}</button>
              <button onClick={handleSaveProfile} disabled={savingProfile} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold">{savingProfile ? 'Guardando...' : t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ NOVO MODAL: CRIAR CLIENTE */}
      {showClientModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold dark:text-white">Adicionar Novo Cliente</h3>
                    <button onClick={() => setShowClientModal(false)}><X className="text-gray-400"/></button>
                </div>
                <div className="space-y-3">
                    <input placeholder="Nome da Empresa / Cliente" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"/>
                    <input placeholder="NIF / VAT Number" value={newClient.nif} onChange={e => setNewClient({...newClient, nif: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"/>
                    <input placeholder="Email (Opcional)" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"/>
                    <select value={newClient.country} onChange={e => setNewClient({...newClient, country: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="">Selecione o País...</option>{countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={() => setShowClientModal(false)} className="px-4 py-2 border rounded-xl dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancelar</button>
                    <button onClick={handleCreateClient} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg">Criar Ficha</button>
                </div>
            </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border dark:border-gray-700">
            <h3 className="text-xl font-bold text-red-600 mb-4 flex gap-2"><AlertTriangle/> {t('delete.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{t('delete.text')}</p>
            <input type="text" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} className="w-full p-3 border rounded mb-4 uppercase dark:bg-gray-900 dark:text-white"/>
            <div className="flex justify-end gap-2"><button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded">{t('common.cancel')}</button><button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded">{t('common.delete')}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}