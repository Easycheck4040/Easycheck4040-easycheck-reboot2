import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client';
import { 
  LayoutDashboard, MessageSquare, FileText, Users, BarChart3, Settings, LogOut, Menu, X, Bell, Mail, User, Trash2, AlertTriangle, Building2, Globe, Moon, Sun, ChevronDown, Eye, EyeOff, Pencil, UserMinus, Shield, Copy, Send
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
  
  // --- ESTADOS DE CHAT IA ---
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou a IA do EasyCheck. Como posso ajudar a sua empresa hoje?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef(null);

  // --- ESTADOS DE PRIVACIDADE ---
  const [showFinancials, setShowFinancials] = useState(true); 
  const [showModalCode, setShowModalCode] = useState(false);
  const [showPageCode, setShowPageCode] = useState(false);

  const [isDark, setIsDark] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);

  // --- MODAIS ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // --- FORMULÁRIOS ---
  const [editForm, setEditForm] = useState({ fullName: '', jobTitle: '', email: '' });
  const [companyForm, setCompanyForm] = useState({ name: '', address: '', nif: '' });

  const languages = [
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  ];

  // Auto-scroll do chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) setIsDark(true);
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData(user);
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
      }
      setLoadingUser(false);
    };
    fetchUser();
  }, []);

  // --- FUNÇÃO DE CONEXÃO COM A IA ---
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erro ao conectar ao servidor de IA.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const toggleTheme = () => { document.documentElement.classList.toggle('dark'); setIsDark(!isDark); };
  const toggleFinancials = () => setShowFinancials(!showFinancials);
  const selectLanguage = (code) => { i18n.changeLanguage(code); setIsLangMenuOpen(false); };
  const getInitials = (name) => name ? (name.split(' ').length > 1 ? (name.split(' ')[0][0] + name.split(' ')[name.split(' ').length - 1][0]) : name.substring(0, 2)).toUpperCase() : 'EC';
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const updates = { full_name: editForm.fullName, job_title: editForm.jobTitle };
      if (userData?.user_metadata?.role === 'owner') {
        updates.company_name = companyForm.name;
        updates.company_address = companyForm.address;
        updates.company_nif = companyForm.nif;
      }
      const { error } = await supabase.auth.updateUser({ data: updates });
      if (error) throw error;
      alert(t('profile.success'));
      setIsProfileModalOpen(false);
      setUserData({ ...userData, user_metadata: { ...userData.user_metadata, ...updates } });
    } catch (error) { alert("Erro: " + error.message); } 
    finally { setSavingProfile(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'ELIMINAR') return alert(t('delete.confirm_text'));
    setIsDeleting(true);
    try { await supabase.rpc('delete_user'); await supabase.auth.signOut(); navigate('/'); } 
    catch(e) { alert(e.message); } 
    finally { setIsDeleting(false); }
  };

  const copyCode = () => { navigator.clipboard.writeText(userData?.user_metadata?.company_code); alert("Código copiado!"); };

  if (loadingUser) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-blue-600 font-bold">Iniciando EasyCheck...</div>;
  const isOwner = userData?.user_metadata?.role === 'owner';

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
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium">
            <LogOut className="w-5 h-5" /> {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between px-8 shadow-sm z-20 items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600 dark:text-white"><Menu /></button>
            <h2 className="text-xl font-bold dark:text-white">{menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2 flex gap-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><Globe className="w-5 h-5"/><ChevronDown className="w-3 h-3"/></button>
              {isLangMenuOpen && <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-50 overflow-hidden">
                {languages.map(l => <button key={l.code} onClick={() => selectLanguage(l.code)} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-2 transition-colors"><span>{l.flag}</span>{l.label}</button>)}
              </div>}
            </div>
            <button onClick={toggleTheme} className="p-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">{isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}</button>
            
            <div className="relative">
              <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full text-white font-bold shadow-md cursor-pointer hover:scale-105 transition-transform">
                {getInitials(userData?.user_metadata?.full_name)}
              </button>
              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute top-16 right-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40 overflow-hidden">
                    <div className="px-4 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <p className="font-bold dark:text-white truncate">{userData?.user_metadata?.full_name}</p>
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

        <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={
              <div className="p-8 space-y-6 overflow-y-auto h-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                    <div className="flex justify-between"><h3 className="text-gray-500 text-sm font-medium">{t('dashboard.stats.revenue')}</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div>
                    <p className="text-3xl font-bold dark:text-white mt-1">{showFinancials ? '€0,00' : '••••••'}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700"><h3 className="text-gray-500 text-sm font-medium">{t('dashboard.stats.actions')}</h3><p className="text-3xl font-bold text-blue-600 mt-1">0</p></div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                    <div className="flex justify-between"><h3 className="text-gray-500 text-sm font-medium">{t('dashboard.stats.invoices')}</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div>
                    <p className="text-3xl font-bold text-orange-500 mt-1">{showFinancials ? '0' : '•••'}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900/40 dark:to-blue-800/20 border border-blue-100 dark:border-blue-800 rounded-3xl p-10 text-center shadow-xl">
                  <h3 className="text-2xl font-bold text-white mb-3">{t('dashboard.welcome')}, {userData?.user_metadata?.full_name?.split(' ')[0]}! 👋</h3>
                  <p className="text-blue-100 mb-6 max-w-md mx-auto">A sua gestão empresarial nunca foi tão simples. Como posso ajudar a sua empresa hoje?</p>
                  <Link to="/dashboard/chat" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 shadow-lg transition-all active:scale-95"><MessageSquare className="w-5 h-5" />{t('dashboard.open_chat')}</Link>
                </div>
              </div>
            } />

            {/* --- INTEGRANDO O CHAT IA NO LAYOUT --- */}
            <Route path="chat" element={
              <div className="flex flex-col h-full bg-white dark:bg-gray-800 m-4 rounded-3xl shadow-sm border dark:border-gray-700 overflow-hidden">
                {/* Header do Chat */}
                <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-bold dark:text-white">EasyCheck IA Assistente</span>
                   </div>
                   <button onClick={() => setMessages([{ role: 'assistant', content: 'Chat reiniciado. Como posso ajudar?' }])} className="text-xs text-gray-400 hover:text-blue-600 font-medium">Limpar conversa</button>
                </div>

                {/* Log de Mensagens */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-gray-100 dark:bg-gray-700 dark:text-white rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-tl-none flex gap-1 items-center">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                  <form onSubmit={handleSendChatMessage} className="flex gap-2 relative">
                    <input 
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Escreva a sua dúvida sobre RH, Marketing ou Contabilidade..."
                      className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all pr-14"
                    />
                    <button 
                      type="submit" 
                      disabled={isChatLoading || !chatInput.trim()}
                      className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                  <p className="text-[10px] text-center text-gray-400 mt-2">A IA do EasyCheck pode cometer erros. Verifique informações importantes.</p>
                </div>
              </div>
            } />

            <Route path="company" element={isOwner ? (
                <div className="p-8 space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
                    <h2 className="text-2xl font-bold dark:text-white mb-6 flex gap-3"><Building2 className="text-blue-600"/> {t('settings.company_title')}</h2>
                    <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div><h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1">{t('settings.invite_code')}</h4><p className="text-sm text-blue-600 dark:text-blue-400">{t('settings.invite_text')}</p></div>
                      <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <code className="px-2 font-mono text-lg font-bold text-gray-700 dark:text-gray-300">{showPageCode ? userData?.user_metadata?.company_code : '••••••••'}</code>
                        <button onClick={() => setShowPageCode(!showPageCode)} className="p-2 text-gray-400 hover:text-blue-600">{showPageCode ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                        <button onClick={copyCode} className="p-2 text-gray-400 hover:text-blue-600"><Copy className="w-4 h-4"/></button>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold dark:text-white mb-4 flex gap-2"><Users className="w-5 h-5"/> {t('settings.team_members')}</h3>
                    <div className="text-center py-12 border-2 border-dashed rounded-2xl border-gray-200 dark:border-gray-700 text-gray-500">{t('settings.no_members')}</div>
                  </div>
                </div>
              ) : <div className="text-center py-12 h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900"><Shield className="w-16 h-16 mb-4 text-gray-300"/><h3 className="text-xl font-bold dark:text-white">Acesso Restrito ao Gestor</h3></div>
            } />

            <Route path="*" element={<div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 opacity-50"><AlertTriangle className="w-12 h-12"/><h3>Página em desenvolvimento...</h3></div>} />
          </Routes>
        </div>
      </main>

      {/* MODAL EDITAR PERFIL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl border dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
              <h3 className="text-xl font-bold dark:text-white flex items-center gap-2"><User className="text-blue-600"/> {t('profile.edit_title')}</h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors"><X className="text-gray-400"/></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('form.email')}</label><input type="email" value={editForm.email} disabled className="w-full p-4 border rounded-2xl bg-gray-50 dark:bg-gray-900 cursor-not-allowed dark:text-gray-400 text-sm"/></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('form.fullname')}</label><input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full p-4 border rounded-2xl dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"/></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('form.jobtitle')}</label><input type="text" value={editForm.jobTitle} onChange={e => setEditForm({...editForm, jobTitle: e.target.value})} className="w-full p-4 border rounded-2xl dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"/></div>
              
              {isOwner && (
                <>
                  <div className="pt-6 border-t dark:border-gray-700"><h4 className="text-xs font-bold text-purple-600 uppercase mb-4 flex items-center gap-2"><Building2 className="w-4 h-4"/> {t('PROFILE.COMPANY_SECTION')}</h4></div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-800 mb-6">
                     <label className="text-[10px] font-bold text-purple-700 dark:text-purple-300 mb-1 block uppercase tracking-tighter">Código Único de Empresa</label>
                     <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-purple-900 dark:text-white text-xl tracking-widest">{showModalCode ? userData?.user_metadata?.company_code : '••••••••'}</span>
                        <div className="flex gap-2">
                           <button onClick={() => setShowModalCode(!showModalCode)} className="bg-white dark:bg-gray-800 p-2 rounded-lg text-purple-400 hover:text-purple-600 shadow-sm transition-colors">{showModalCode ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                           <button onClick={copyCode} className="bg-white dark:dark:bg-gray-800 p-2 rounded-lg text-purple-400 hover:text-purple-600 shadow-sm transition-colors"><Copy className="w-4 h-4"/></button>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4">
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('form.company_name')}</label><input type="text" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full p-4 border rounded-2xl dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"/></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('form.address')}</label><input type="text" value={companyForm.address} onChange={e => setCompanyForm({...companyForm, address: e.target.value})} className="w-full p-4 border rounded-2xl dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"/></div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('form.nif')}</label><input type="text" value={companyForm.nif} onChange={e => setCompanyForm({...companyForm, nif: e.target.value})} className="w-full p-4 border rounded-2xl dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"/></div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t dark:border-gray-700">
              <button onClick={() => setIsProfileModalOpen(false)} className="px-6 py-3 border rounded-2xl dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">{t('common.cancel')}</button>
              <button onClick={handleSaveProfile} disabled={savingProfile} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL APAGAR CONTA */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl border dark:border-gray-700">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="text-red-600 w-8 h-8"/></div>
            <h3 className="text-xl font-bold text-red-600 mb-2 text-center">{t('delete.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center text-sm">{t('delete.text')}</p>
            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 text-center">Escreva "ELIMINAR" para confirmar</p>
              <input type="text" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} placeholder="ELIMINAR" className="w-full p-4 border rounded-2xl mb-4 text-center uppercase font-bold dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"/>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-2xl font-bold hover:bg-gray-200 transition-colors">{t('common.cancel')}</button>
              <button onClick={handleDeleteAccount} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg active:scale-95 transition-all">{t('common.delete')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}