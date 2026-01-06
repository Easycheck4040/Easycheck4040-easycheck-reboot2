import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client';
import { 
  LayoutDashboard, MessageSquare, FileText, Users, BarChart3, Settings, LogOut, Menu, X, Globe, Moon, Sun, ChevronDown, Eye, EyeOff, User, Trash2, AlertTriangle, Building2, Copy, Send, Shield, Mail, Plus, TrendingUp, TrendingDown, Wallet
} from 'lucide-react';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ CONFIGURAÇÃO DA API
  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://easycheck-api.onrender.com';

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

  // --- ESTADOS DE CONTABILIDADE (NOVO) ---
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    type: 'expense', // 'income' ou 'expense'
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  // --- MODAIS GERAIS ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // --- FORMULÁRIOS PERFIL ---
  const [editForm, setEditForm] = useState({ fullName: '', jobTitle: '', email: '' });
  const [companyForm, setCompanyForm] = useState({ name: '', address: '', nif: '', country: 'Portugal' });

  const languages = [
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  ];

  // SCROLL CHAT
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // CARREGAR DADOS INICIAIS
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) setIsDark(true);
    fetchUserAndProfile();
  }, []);

  // CARREGAR TRANSAÇÕES QUANDO ENTRA NA ABA DE CONTABILIDADE
  useEffect(() => {
    if (location.pathname === '/dashboard/accounting' && userData) {
      fetchTransactions();
    }
  }, [location.pathname, userData]);

  const fetchUserAndProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserData(user);
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) {
          setProfileData(profile);
          setEditForm({
              fullName: profile.full_name || '',
              jobTitle: profile.role === 'owner' ? 'Administrador' : 'Colaborador',
              email: user.email || '' 
          });
          setCompanyForm({
              name: profile.company_name || '',
              address: '', 
              nif: '',
              country: profile.country || 'Portugal' // ✅ Carrega o país
          });
      }
    }
    setLoadingUser(false);
  };

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (data) setTransactions(data);
    setLoadingTransactions(false);
  };

  // ENVIO DE MENSAGEM CHAT (Passando o contexto do País)
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      // ✅ Envia também o país para a IA saber as leis locais
      const countryContext = profileData?.country ? `[Contexto: Empresa em ${profileData.country}] ` : '';
      
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: countryContext + chatInput }),
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

  // SALVAR PERFIL + PAÍS
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      if (!userData) return;
      const updates = {
        full_name: editForm.fullName,
        company_name: companyForm.name,
        country: companyForm.country, // ✅ Salva o país
        updated_at: new Date(),
      };
      const { error } = await supabase.from('profiles').update(updates).eq('id', userData.id);
      if (error) throw error;
      alert("Perfil atualizado!");
      setIsProfileModalOpen(false);
      setProfileData({ ...profileData, ...updates });
    } catch (error: any) { alert("Erro: " + error.message); } 
    finally { setSavingProfile(false); }
  };

  // SALVAR NOVA TRANSAÇÃO (CONTABILIDADE)
  const handleSaveTransaction = async () => {
    if (!transactionForm.amount || !transactionForm.description) return alert("Preencha o valor e a descrição.");
    
    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: userData.id,
        type: transactionForm.type,
        amount: parseFloat(transactionForm.amount),
        description: transactionForm.description,
        category: transactionForm.category,
        date: transactionForm.date
      });

      if (error) throw error;
      
      alert("Transação registada!");
      setIsTransactionModalOpen(false);
      setTransactionForm({ type: 'expense', description: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
      fetchTransactions(); // Atualiza a tabela
    } catch (error: any) {
      alert("Erro ao gravar: " + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'ELIMINAR') return alert(t('delete.confirm_text'));
    setIsDeleting(true);
    try { await supabase.rpc('delete_user'); await supabase.auth.signOut(); navigate('/'); } 
    catch(e: any) { alert(e.message); } 
    finally { setIsDeleting(false); }
  };

  // CÁLCULOS FINANCEIROS SIMPLES
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const toggleTheme = () => { document.documentElement.classList.toggle('dark'); setIsDark(!isDark); };
  const toggleFinancials = () => setShowFinancials(!showFinancials);
  const selectLanguage = (code: string) => { i18n.changeLanguage(code); setIsLangMenuOpen(false); };
  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'EC';
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };
  const copyCode = () => { navigator.clipboard.writeText(profileData?.company_code); alert("Código copiado!"); };

  if (loadingUser) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">Loading...</div>;
  const isOwner = profileData?.role === 'owner';

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard.menu.overview'), path: '/dashboard' },
    { icon: MessageSquare, label: t('dashboard.menu.chat'), path: '/dashboard/chat' },
    { icon: FileText, label: t('dashboard.menu.accounting'), path: '/dashboard/accounting' },
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
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium"><LogOut className="w-5 h-5" /> {t('nav.logout')}</button>
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
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full inline-block">{isOwner ? t('role.owner') : t('role.employee')}</span>
                  </div>
                  <button onClick={() => {setIsProfileModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-2 dark:text-gray-300 text-sm font-medium"><User className="w-4 h-4"/> {t('profile.edit')}</button>
                  <button onClick={() => {setIsDeleteModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex gap-2 border-t dark:border-gray-700 text-sm font-medium"><Trash2 className="w-4 h-4"/> {t('profile.delete')}</button>
                </div>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={
              <div className="p-8 space-y-6 overflow-y-auto h-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                    <div className="flex justify-between"><h3 className="text-gray-500 text-sm font-medium">{t('dashboard.stats.revenue')}</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div>
                    <p className="text-3xl font-bold dark:text-white">{showFinancials ? `€${balance.toFixed(2)}` : '••••••'}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700"><h3 className="text-gray-500 text-sm font-medium">{t('dashboard.stats.actions')}</h3><p className="text-3xl font-bold text-blue-600 mt-2">{transactions.length}</p></div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-8 text-center shadow-lg">
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">{t('dashboard.welcome')}, {profileData?.full_name?.split(' ')[0] || 'Gestor'}! 👋</h3>
                  <Link to="/dashboard/chat" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg"><MessageSquare className="w-5 h-5" />{t('dashboard.open_chat')}</Link>
                </div>
              </div>
            } />

            {/* ✅ ABA DE CONTABILIDADE FUNCIONAL */}
            <Route path="accounting" element={
              <div className="p-8 h-full flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2"><Wallet className="text-blue-600"/> Contabilidade</h2>
                  <button onClick={() => setIsTransactionModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold hover:bg-blue-700 transition-colors shadow-lg"><Plus size={18}/> Nova Transação</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                   <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                      <p className="text-xs text-green-600 font-bold uppercase mb-1">Total Receitas</p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">€{totalIncome.toFixed(2)}</p>
                   </div>
                   <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
                      <p className="text-xs text-red-600 font-bold uppercase mb-1">Total Despesas</p>
                      <p className="text-2xl font-bold text-red-700 dark:text-red-400">€{totalExpense.toFixed(2)}</p>
                   </div>
                   <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700">
                      <p className="text-xs text-gray-500 font-bold uppercase mb-1">Saldo Atual</p>
                      <p className={`text-2xl font-bold ${balance >= 0 ? 'text-gray-800 dark:text-white' : 'text-red-600'}`}>€{balance.toFixed(2)}</p>
                   </div>
                </div>

                <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 overflow-hidden flex flex-col shadow-sm">
                  {loadingTransactions ? (
                    <div className="p-8 text-center text-gray-400">A carregar contas...</div>
                  ) : transactions.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                      <FileText className="w-12 h-12 mb-2 opacity-50"/>
                      <p>Ainda não há movimentos.</p>
                      <p className="text-sm">Registe a sua primeira fatura ou despesa!</p>
                    </div>
                  ) : (
                    <div className="overflow-y-auto flex-1">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                          <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Data</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Descrição</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Categoria</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Valor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                          {transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="p-4 text-sm dark:text-gray-300">{t.date}</td>
                              <td className="p-4 text-sm font-medium dark:text-white flex items-center gap-2">
                                {t.type === 'income' ? <TrendingUp size={16} className="text-green-500"/> : <TrendingDown size={16} className="text-red-500"/>}
                                {t.description}
                              </td>
                              <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">{t.category || 'Geral'}</span>
                              </td>
                              <td className={`p-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {t.type === 'income' ? '+' : '-'}€{t.amount.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                      <code className="px-2 font-mono text-lg font-bold text-gray-700 dark:text-gray-300">{showPageCode ? (profileData?.company_code || 'Gera Novo') : '••••••••'}</code>
                      <button onClick={() => setShowPageCode(!showPageCode)} className="p-2 text-gray-400 hover:text-blue-600">{showPageCode ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                      <button onClick={copyCode} className="p-2 text-gray-400 hover:text-blue-600"><Copy className="w-4 h-4"/></button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold dark:text-white mb-4 flex gap-2"><Users className="w-5 h-5"/> {t('settings.team_members')}</h3>
                  {teamMembers.length === 0 ? <div className="text-center py-12 border-2 border-dashed rounded-xl text-gray-500">{t('settings.no_members')}</div> : <div>Tabela aqui...</div>}
                </div>
              ) : <div className="text-center py-12"><Shield className="w-16 h-16 mx-auto mb-4 text-gray-300"/><h3 className="text-xl font-bold dark:text-white">Acesso Restrito</h3></div>
            } />

            <Route path="settings" element={<div className="text-center py-12 text-gray-500"><Settings className="w-16 h-16 mx-auto mb-4 opacity-50"/><h3>{t('dashboard.menu.settings')}</h3></div>} />
            <Route path="*" element={<div className="flex justify-center py-10 text-gray-400">Em desenvolvimento...</div>} />
          </Routes>
        </div>
      </main>

      {/* MODAL PERFIL + PAÍS */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl border dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
              <h3 className="text-xl font-bold dark:text-white flex items-center gap-2"><User className="text-blue-600"/> {t('profile.edit_title')}</h3>
              <button onClick={() => setIsProfileModalOpen(false)}><X className="text-gray-400"/></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm dark:text-gray-300 mb-1 font-bold">País da Empresa (Para Legislação)</label>
              <select value={companyForm.country} onChange={e => setCompanyForm({...companyForm, country: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                <option value="Portugal">Portugal 🇵🇹</option>
                <option value="Brasil">Brasil 🇧🇷</option>
                <option value="Angola">Angola 🇦🇴</option>
                <option value="Moçambique">Moçambique 🇲🇿</option>
                <option value="França">França 🇫🇷</option>
                <option value="Luxemburgo">Luxemburgo 🇱🇺</option>
              </select>
              </div>
              <div><label className="block text-sm dark:text-gray-300 mb-1">{t('form.email')}</label><input type="email" value={editForm.email} disabled className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-900 cursor-not-allowed dark:text-gray-400"/></div>
              <div><label className="block text-sm dark:text-gray-300 mb-1">{t('form.fullname')}</label><input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white"/></div>
              
              {isOwner && (
                <>
                  <div className="pt-4 border-t dark:border-gray-700"><h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2"><Building2 className="w-4 h-4"/> {t('PROFILE.COMPANY_SECTION')}</h4></div>
                  <div><label className="block text-sm dark:text-gray-300 mb-1">{t('form.company_name')}</label><input type="text" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white"/></div>
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

      {/* NOVO MODAL: TRANSAÇÕES (CONTABILIDADE) */}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border dark:border-gray-700">
            <h3 className="text-xl font-bold dark:text-white mb-4 flex gap-2"><Wallet className="text-blue-600"/> Nova Transação</h3>
            <div className="space-y-4">
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                    <button onClick={() => setTransactionForm({...transactionForm, type: 'income'})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${transactionForm.type === 'income' ? 'bg-green-500 text-white shadow' : 'text-gray-500'}`}>Receita (+)</button>
                    <button onClick={() => setTransactionForm({...transactionForm, type: 'expense'})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${transactionForm.type === 'expense' ? 'bg-red-500 text-white shadow' : 'text-gray-500'}`}>Despesa (-)</button>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                    <input type="text" placeholder="Ex: Venda de Software" value={transactionForm.description} onChange={e => setTransactionForm({...transactionForm, description: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white"/>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor (€)</label>
                        <input type="number" placeholder="0.00" value={transactionForm.amount} onChange={e => setTransactionForm({...transactionForm, amount: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white"/>
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
                        <input type="date" value={transactionForm.date} onChange={e => setTransactionForm({...transactionForm, date: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white"/>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                    <select value={transactionForm.category} onChange={e => setTransactionForm({...transactionForm, category: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white">
                        <option value="">Sem categoria</option>
                        <option value="Serviços">Serviços</option>
                        <option value="Produtos">Produtos</option>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Escritório">Escritório</option>
                        <option value="Impostos">Impostos</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setIsTransactionModalOpen(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl dark:text-white">Cancelar</button>
                <button onClick={handleSaveTransaction} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">Registar</button>
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