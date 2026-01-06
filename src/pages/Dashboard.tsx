import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client';
import { 
  LayoutDashboard, MessageSquare, FileText, Users, BarChart3, Settings, LogOut, Menu, X, Globe, Moon, Sun, ChevronDown, Eye, EyeOff, User, Trash2, AlertTriangle, Building2, Copy, Send, Shield, Mail, Plus, Search, FileCheck, Calculator, TrendingUp, Archive, TrendingDown, Landmark, PieChart, FileSpreadsheet, Bell
} from 'lucide-react';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://easycheck-api.onrender.com';

  // --- ESTADOS GERAIS ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); // Array vazio = sem ponto vermelho
  
  // --- PRIVACIDADE E UI ---
  const [showFinancials, setShowFinancials] = useState(true); 
  const [showModalCode, setShowModalCode] = useState(false);
  const [showPageCode, setShowPageCode] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // --- DADOS ---
  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // --- CONTABILIDADE ---
  const [accountingTab, setAccountingTab] = useState('overview'); 
  const [transactions, setTransactions] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  
  // --- MODAIS ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // --- FORMULÁRIOS ---
  const [editForm, setEditForm] = useState({ fullName: '', jobTitle: '', email: '' });
  const [companyForm, setCompanyForm] = useState({ name: '', country: 'Portugal', currency: 'EUR', address: '', nif: '' });
  const [newTransaction, setNewTransaction] = useState({ description: '', amount: '', type: 'expense', category: 'Geral' });
  const [savingProfile, setSavingProfile] = useState(false);

  // --- CHAT IA ---
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Olá! Sou o seu Contabilista IA. Em que posso ajudar hoje?' }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const countries = ["Portugal", "Brasil", "Angola", "Moçambique", "Cabo Verde", "France", "Deutschland", "United Kingdom", "España", "United States", "Italia", "Belgique", "Suisse", "Luxembourg"];
  
  const languages = [
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  // DETECTAR MOEDA
  const getCurrencySymbol = (country: string) => {
    if (country === 'Brasil') return 'R$';
    if (country === 'United States') return '$';
    if (country === 'United Kingdom') return '£';
    if (country === 'Angola') return 'Kz';
    if (country === 'Moçambique') return 'MT';
    if (country === 'Suisse') return 'CHF';
    return '€';
  };
  const currencySymbol = getCurrencySymbol(profileData?.country || 'Portugal');

  // ✅ CÁLCULOS AUTOMÁTICOS (Dashboard Home)
  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalInvoicesCount = transactions.filter(t => t.type === 'income').length;

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) setIsDark(true);
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData(user);
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
            setProfileData(profile);
            setEditForm({ fullName: profile.full_name, jobTitle: profile.role, email: user.email || '' });
            setCompanyForm({ 
                name: profile.company_name, 
                country: profile.country || 'Portugal', 
                currency: profile.currency || 'EUR',
                address: '', nif: '' 
            });
        }
        const { data: tr } = await supabase.from('transactions').select('*').order('date', { ascending: false });
        if (tr) setTransactions(tr);
        const { data: cl } = await supabase.from('clients').select('*');
        if (cl) setClients(cl);
      }
      setLoadingUser(false);
    };
    fetchData();
  }, []);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const toggleTheme = () => { document.documentElement.classList.toggle('dark'); setIsDark(!isDark); };
  const toggleFinancials = () => setShowFinancials(!showFinancials);
  const selectLanguage = (code: string) => { i18n.changeLanguage(code); setIsLangMenuOpen(false); };
  const getInitials = (name: string) => name ? (name.split(' ').length > 1 ? (name.split(' ')[0][0] + name.split(' ')[name.split(' ').length - 1][0]) : name.substring(0, 2)).toUpperCase() : 'EC';
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };
  const copyCode = () => { navigator.clipboard.writeText(profileData?.company_code); alert("Código copiado!"); };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    const userMessage = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);
    try {
      const context = `[Contexto: Empresa ${companyForm.name} situada em ${companyForm.country}. Moeda: ${currencySymbol}] ${chatInput}`;
      const response = await fetch(`${API_URL}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: context }) });
      const data = await response.json();
      if (data.reply) setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Erro de conexão.' }]); } 
    finally { setIsChatLoading(false); }
  };

  const handleCreateTransaction = async () => {
     if (!newTransaction.amount || !newTransaction.description) return alert("Dados em falta.");
     const { data, error } = await supabase.from('transactions').insert([{
         user_id: userData.id,
         description: newTransaction.description,
         amount: parseFloat(newTransaction.amount),
         type: newTransaction.type,
         category: newTransaction.category,
         date: new Date()
     }]).select();
     if (data) {
         setTransactions([data[0], ...transactions]);
         setShowTransactionModal(false);
         setNewTransaction({ description: '', amount: '', type: 'expense', category: 'Geral' });
     }
  };

  // ✅ NOVA FUNÇÃO: APAGAR TRANSAÇÃO
  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm("Tem a certeza que quer apagar este movimento?")) return;
    
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
        alert("Erro ao apagar.");
    } else {
        // Atualiza a lista removendo o item apagado
        setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const updates = { full_name: editForm.fullName, company_name: companyForm.name, country: companyForm.country, currency: companyForm.currency, updated_at: new Date() };
      await supabase.from('profiles').update(updates).eq('id', userData.id);
      setProfileData({ ...profileData, ...updates });
      alert(`Dados guardados! País fiscal: ${companyForm.country}`);
      setIsProfileModalOpen(false);
    } catch { alert("Erro ao guardar."); } 
    finally { setSavingProfile(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'ELIMINAR') return alert(t('delete.confirm_text'));
    setIsDeleting(true);
    try { await supabase.rpc('delete_user'); await supabase.auth.signOut(); navigate('/'); } 
    catch(e: any) { alert(e.message); } 
    finally { setIsDeleting(false); }
  };

  if (loadingUser) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 dark:text-white">A carregar escritório...</div>;
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans text-gray-900 dark:text-gray-100">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform md:translate-x-0 transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b dark:border-gray-700">
            <Link to="/" className="flex items-center gap-3"><img src="/logopequena.PNG" className="h-8 w-auto"/><span className="font-bold text-xl">EasyCheck</span></Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            if (item.hidden) return null;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-blue-600 text-white shadow-lg' : item.special ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-100 dark:border-purple-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <item.icon className="w-5 h-5" /><span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium"><LogOut className="w-5 h-5" /> {t('nav.logout')}</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between px-8 shadow-sm z-20 items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden"><Menu /></button>
            <h2 className="text-xl font-bold flex items-center gap-2">
                {profileData?.country && <span className="text-2xl">{profileData.country === 'Portugal' ? '🇵🇹' : profileData.country === 'Brasil' ? '🇧🇷' : '🌍'}</span>}
                {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2 flex gap-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Globe className="w-5 h-5"/><ChevronDown className="w-3 h-3"/></button>
              {isLangMenuOpen && <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40">
                {languages.map(l => <button key={l.code} onClick={() => selectLanguage(l.code)} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-2"><span>{l.flag}</span>{l.label}</button>)}
              </div>}
            </div>
            
            <button onClick={toggleTheme} className="p-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}</button>
            
            {/* ✅ NOTIFICAÇÕES (Sem ponto vermelho) */}
            <button className="p-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
                <Bell className="w-5 h-5"/>
                {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            
            <div className="relative">
              <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full text-white font-bold shadow-md cursor-pointer hover:opacity-90">{getInitials(profileData?.full_name)}</button>
              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute top-16 right-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40 overflow-hidden">
                    <div className="px-4 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <p className="font-bold truncate">{profileData?.full_name}</p>
                      <p className="text-xs text-gray-500 truncate mb-2">{profileData?.company_name}</p>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full inline-block">{isOwner ? t('role.owner') : t('role.employee')}</span>
                    </div>
                    <button onClick={() => {setIsProfileModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-2 text-sm font-medium"><User className="w-4 h-4"/> {t('profile.edit')}</button>
                    <button onClick={() => {setIsDeleteModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex gap-2 border-t dark:border-gray-700 text-sm font-medium"><Trash2 className="w-4 h-4"/> {t('profile.delete')}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8">
          <Routes>
            {/* DASHBOARD PRINCIPAL (Agora com Dados Reais) */}
            <Route path="/" element={
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* ✅ RECEITA MENSAL REAL */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                    <div className="flex justify-between"><h3 className="text-gray-500 text-sm font-medium">{t('dashboard.stats.revenue')}</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div>
                    <p className="text-3xl font-bold dark:text-white">
                        {showFinancials ? `${currencySymbol} ${totalRevenue.toFixed(2)}` : '••••••'}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700"><h3 className="text-gray-500 text-sm font-medium">{t('dashboard.stats.actions')}</h3><p className="text-3xl font-bold text-blue-600 mt-2">0</p></div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                    <div className="flex justify-between"><h3 className="text-gray-500 text-sm font-medium">{t('dashboard.stats.invoices')}</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div>
                    <p className="text-3xl font-bold text-orange-500">{showFinancials ? totalInvoicesCount : '•••'}</p>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-8 text-center shadow-lg">
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">{t('dashboard.welcome')}, {profileData?.full_name?.split(' ')[0]}! 👋</h3>
                  <Link to="/dashboard/chat" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg"><MessageSquare className="w-5 h-5" />{t('dashboard.open_chat')}</Link>
                </div>
              </div>
            } />

            <Route path="accounting" element={
                <div className="h-full flex flex-col">
                    <div className="flex gap-2 border-b dark:border-gray-700 pb-2 mb-6 overflow-x-auto">
                        {[
                            { id: 'overview', label: 'Visão Geral', icon: PieChart },
                            { id: 'sales', label: 'Vendas', icon: TrendingUp },
                            { id: 'purchases', label: 'Compras', icon: TrendingDown },
                            { id: 'banking', label: 'Bancos', icon: Landmark },
                            { id: 'assets', label: 'Ativos', icon: Calculator },
                            { id: 'taxes', label: 'Impostos', icon: FileCheck },
                            { id: 'reports', label: 'Relatórios', icon: FileSpreadsheet },
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setAccountingTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${accountingTab === tab.id ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm border dark:border-gray-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                <tab.icon size={16}/> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1">
                        {accountingTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg">Diário de Movimentos</h3>
                                    <button onClick={() => setShowTransactionModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg"><Plus size={18}/> Nova Transação</button>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 uppercase text-xs">
                                            <tr><th className="px-6 py-3">Data</th><th className="px-6 py-3">Descrição</th><th className="px-6 py-3">Categoria</th><th className="px-6 py-3 text-right">Valor</th><th className="px-6 py-3 text-right">Ação</th></tr>
                                        </thead>
                                        <tbody>
                                            {transactions.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Sem movimentos.</td></tr> :
                                                transactions.map(t => (
                                                    <tr key={t.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                        <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 font-medium">{t.description}</td>
                                                        <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">{t.category}</span></td>
                                                        <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>{t.type === 'income' ? '+' : '-'} {currencySymbol} {t.amount}</td>
                                                        {/* ✅ BOTÃO APAGAR */}
                                                        <td className="px-6 py-4 text-right">
                                                            <button onClick={() => handleDeleteTransaction(t.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16}/></button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {['sales', 'purchases', 'banking', 'assets', 'taxes', 'reports'].includes(accountingTab) && (
                            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700">
                                <Archive className="w-16 h-16 text-gray-300 mb-4"/>
                                <h3 className="text-xl font-bold">Módulo {accountingTab.toUpperCase()}</h3>
                                <p className="text-gray-500">Pronto para {profileData?.country}.</p>
                            </div>
                        )}
                    </div>
                </div>
            } />

            <Route path="chat" element={
              <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'}`}>{msg.content}</div>
                    </div>
                  ))}
                  {isChatLoading && <div className="text-xs text-gray-400 ml-4 animate-pulse">A analisar...</div>}
                </div>
                <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <form onSubmit={handleSendChatMessage} className="flex gap-2 relative">
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder={`Fale com o contabilista (${profileData?.country})...`} className="flex-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"/>
                    <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow-md disabled:opacity-50"><Send size={18} /></button>
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
                      <code className="px-2 font-mono text-lg font-bold text-gray-700 dark:text-gray-300">{showPageCode ? profileData?.company_code : '••••••••'}</code>
                      <button onClick={() => setShowPageCode(!showPageCode)} className="p-2 text-gray-400 hover:text-blue-600">{showPageCode ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                      <button onClick={copyCode} className="p-2 text-gray-400 hover:text-blue-600"><Copy className="w-4 h-4"/></button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold dark:text-white mb-4 flex gap-2"><Users className="w-5 h-5"/> {t('settings.team_members')}</h3>
                  <div className="text-center py-12 border-2 border-dashed rounded-xl text-gray-500">{t('settings.no_members')}</div>
                </div>
              ) : <div className="text-center py-12"><Shield className="w-16 h-16 mx-auto mb-4 text-gray-300"/><h3 className="text-xl font-bold dark:text-white">Acesso Restrito</h3></div>
            } />

            <Route path="settings" element={
                 <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
                    <h2 className="text-2xl font-bold mb-6 flex gap-2 items-center"><Settings/> Configuração</h2>
                    <div className="space-y-4">
                        <div><label className="block text-sm font-bold mb-1">Nome da Empresa</label><input value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/></div>
                        <div>
                            <label className="block text-sm font-bold mb-1">País da Sede</label>
                            <select value={companyForm.country} onChange={e => setCompanyForm({...companyForm, country: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900">
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end"><button onClick={handleSaveProfile} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">{savingProfile ? 'A guardar...' : 'Guardar'}</button></div>
                 </div>
            } />
            
            <Route path="hr" element={<div className="text-center py-20 text-gray-500"><Users className="w-16 h-16 mx-auto mb-4 opacity-50"/><h3>Gestão de Recursos Humanos</h3><p>Processamento de salários e férias em breve.</p></div>} />
            <Route path="communication" element={<div className="text-center py-20 text-gray-500"><Mail className="w-16 h-16 mx-auto mb-4 opacity-50"/><h3>Centro de Comunicação</h3><p>E-mails e mensagens internas.</p></div>} />
            <Route path="marketing" element={<div className="text-center py-20 text-gray-500"><BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50"/><h3>Marketing & CRM</h3><p>Gestão de campanhas e leads.</p></div>} />
            <Route path="*" element={<div className="flex justify-center py-10 text-gray-400">Em desenvolvimento...</div>} />
          </Routes>
        </div>
      </main>

      {/* MODAL PERFIL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl border dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
              <h3 className="text-xl font-bold flex items-center gap-2"><User className="text-blue-600"/> {t('profile.edit_title')}</h3>
              <button onClick={() => setIsProfileModalOpen(false)}><X className="text-gray-400"/></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm mb-1">{t('form.email')}</label><input type="email" value={editForm.email} disabled className="w-full p-3 border rounded-xl bg-gray-50 cursor-not-allowed"/></div>
              <div><label className="block text-sm mb-1">{t('form.fullname')}</label><input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/></div>
              {isOwner && (
                <>
                  <div className="pt-4 border-t dark:border-gray-700"><h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2"><Building2 className="w-4 h-4"/> {t('PROFILE.COMPANY_SECTION')}</h4></div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-100 dark:border-purple-800 mb-4">
                     <label className="text-xs font-bold text-purple-700 mb-1 block">{t('form.code') || 'Código'}</label>
                     <div className="flex items-center justify-between">
                        <span className="font-mono font-medium text-purple-900 dark:text-white text-lg">{showModalCode ? profileData?.company_code : '••••••••'}</span>
                        <div className="flex gap-2">
                           <button onClick={() => setShowModalCode(!showModalCode)} className="text-purple-400 hover:text-purple-600 p-1">{showModalCode ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                           <button onClick={copyCode} className="text-purple-400 hover:text-purple-600 p-1"><Copy className="w-4 h-4"/></button>
                        </div>
                     </div>
                  </div>
                  <div><label className="block text-sm mb-1">{t('form.company_name')}</label><input type="text" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/></div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700">
              <button onClick={() => setIsProfileModalOpen(false)} className="px-5 py-2.5 border rounded-xl">{t('common.cancel')}</button>
              <button onClick={handleSaveProfile} disabled={savingProfile} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold">{savingProfile ? 'Guardando...' : t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVA TRANSAÇÃO */}
      {showTransactionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4">Registar Movimento</h3>
                <div className="space-y-3">
                    <input placeholder="Descrição" value={newTransaction.description} onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/>
                    <div className="flex gap-2">
                        <input type="number" placeholder="Valor" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/>
                        <select value={newTransaction.type} onChange={e => setNewTransaction({...newTransaction, type: e.target.value})} className="w-32 p-3 border rounded-xl dark:bg-gray-900">
                            <option value="expense">Despesa</option><option value="income">Receita</option>
                        </select>
                    </div>
                    <select value={newTransaction.category} onChange={e => setNewTransaction({...newTransaction, category: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900">
                        <option value="Geral">Geral</option><option value="Alimentação">Alimentação</option><option value="Transporte">Transporte</option><option value="Serviços">Serviços</option><option value="Vendas">Vendas</option>
                    </select>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={() => setShowTransactionModal(false)} className="px-4 py-2 border rounded-xl">Cancelar</button>
                    <button onClick={handleCreateTransaction} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">Gravar</button>
                </div>
            </div>
        </div>
      )}

      {/* MODAL ELIMINAR CONTA */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border dark:border-gray-700">
            <h3 className="text-xl font-bold text-red-600 mb-4 flex gap-2"><AlertTriangle/> {t('delete.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{t('delete.text')}</p>
            <input type="text" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} className="w-full p-3 border rounded mb-4 uppercase dark:bg-gray-900"/>
            <div className="flex justify-end gap-2"><button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded">{t('common.cancel')}</button><button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded">{t('common.delete')}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}