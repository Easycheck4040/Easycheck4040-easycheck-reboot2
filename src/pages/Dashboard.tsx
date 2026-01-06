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
  
  // --- CONFIGURAÇÃO DE AMBIENTE DINÂMICA ---
  const API_URL = window.location.hostname === 'easycheckglobal.com' 
    ? 'https://easycheck4040-easycheck-reboot2.onrender.com' 
    : 'http://localhost:3000';

  // --- ESTADOS GERAIS ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // --- ESTADOS DE CHAT IA ---
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou a IA do EasyCheck. Como posso ajudar a sua empresa hoje?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef(null);

  // --- ESTADOS DE PRIVACIDADE & MODAIS ---
  const [showFinancials, setShowFinancials] = useState(true); 
  const [showModalCode, setShowModalCode] = useState(false);
  const [showPageCode, setShowPageCode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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

  // --- LÓGICA DO CHAT IA ---
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput }),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '⚠️ Erro ao ligar ao servidor de IA. Verifica se o backend está ativo no Render.' 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- LÓGICA DE ELIMINAÇÃO DE CONTA CORRIGIDA ---
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'ELIMINAR') return alert(t('delete.confirm_text'));
    setIsDeleting(true);
    try {
      const { error: rpcError } = await supabase.rpc('delete_user');
      if (rpcError) throw rpcError;
      await supabase.auth.signOut();
      navigate('/');
    } catch (err) {
      alert(err.message || "Erro ao eliminar conta.");
    } finally {
      setIsDeleting(false);
    }
  };

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
    } catch (error) { alert(error.message); } 
    finally { setSavingProfile(false); }
  };

  const toggleTheme = () => { document.documentElement.classList.toggle('dark'); setIsDark(!isDark); };
  const selectLanguage = (code) => { i18n.changeLanguage(code); setIsLangMenuOpen(false); };
  const getInitials = (name) => name ? (name.split(' ').length > 1 ? (name.split(' ')[0][0] + name.split(' ')[name.split(' ').length - 1][0]) : name.substring(0, 2)).toUpperCase() : 'EC';
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };
  const copyCode = () => { navigator.clipboard.writeText(userData?.user_metadata?.company_code); alert("Código copiado!"); };

  if (loadingUser) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-blue-600 font-bold tracking-widest animate-pulse">EASYCHECK...</div>;
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
          <Link to="/" className="flex items-center gap-3"><img src="/logopequena.PNG" className="h-8 w-auto"/><span className="font-bold text-xl dark:text-white uppercase tracking-tight">EasyCheck</span></Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.hidden) return null;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${isActive ? 'bg-blue-600 text-white shadow-lg' : item.special ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-100 dark:border-purple-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <item.icon className="w-5 h-5" /><span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t dark:border-gray-700">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors font-medium">
            <LogOut className="w-5 h-5" /> {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between px-8 shadow-sm z-20 items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600 dark:text-white"><Menu /></button>
            <h2 className="text-lg font-bold dark:text-white">{menuItems.find(i => i.path === location.pathname)?.label || 'Painel'}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"><Globe className="w-5 h-5"/></button>
            {isLangMenuOpen && (
              <div className="absolute top-16 right-32 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-50 py-2">
                {languages.map(l => <button key={l.code} onClick={() => selectLanguage(l.code)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-2 dark:text-white"><span>{l.flag}</span>{l.label}</button>)}
              </div>
            )}
            <button onClick={toggleTheme} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">{isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}</button>
            <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="w-10 h-10 bg-blue-600 rounded-full text-white font-bold shadow-md hover:scale-105 transition-transform flex items-center justify-center">
              {getInitials(userData?.user_metadata?.full_name)}
            </button>
            {isProfileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsProfileDropdownOpen(false)}></div>
                <div className="absolute top-16 right-8 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 z-40 p-2">
                  <div className="px-4 py-3 border-b dark:border-gray-700 mb-1">
                    <p className="font-bold text-sm dark:text-white truncate">{userData?.user_metadata?.full_name}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{isOwner ? 'Proprietário' : 'Funcionário'}</p>
                  </div>
                  <button onClick={() => {setIsProfileModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl flex gap-2 dark:text-gray-300"><User className="w-4 h-4"/> Editar Perfil</button>
                  <button onClick={() => {setIsDeleteModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl flex gap-2 border-t dark:border-gray-700 mt-1"><Trash2 className="w-4 h-4"/> Eliminar Conta</button>
                </div>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={
              <div className="p-8 space-y-6 overflow-y-auto h-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700 transition-all hover:shadow-md">
                    <div className="flex justify-between items-center mb-2"><h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Faturação Bruta</h3><button onClick={() => setShowFinancials(!showFinancials)} className="text-gray-300 hover:text-blue-500 transition-colors">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div>
                    <p className="text-3xl font-black dark:text-white">{showFinancials ? '€0,00' : '••••••'}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700"><h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Ações Pendentes</h3><p className="text-3xl font-black text-blue-600">0</p></div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700 flex flex-col justify-between">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Documentos OCR</h3>
                    <p className="text-3xl font-black text-orange-500">0</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-12 text-center shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all"></div>
                  <h3 className="text-3xl font-black text-white mb-4 leading-tight">Bem-vindo à sua<br/>Gestão Inteligente.</h3>
                  <p className="text-blue-100 mb-8 max-w-sm mx-auto text-sm font-medium opacity-90">O EasyCheck está pronto para otimizar os seus processos com IA.</p>
                  <Link to="/dashboard/chat" className="inline-flex items-center gap-3 bg-white text-blue-700 px-10 py-4 rounded-2xl font-black hover:bg-gray-50 transition-all active:scale-95 shadow-lg shadow-black/10"><MessageSquare className="w-5 h-5" /> Abrir Assistente</Link>
                </div>
              </div>
            } />

            {/* --- PÁGINA DE CHAT IA --- */}
            <Route path="chat" element={
              <div className="flex flex-col h-full bg-white dark:bg-gray-800 m-4 rounded-[2rem] shadow-sm border dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/50">
                   <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                      <span className="font-bold text-sm dark:text-white">Assistente Digital EasyCheck</span>
                   </div>
                   <button onClick={() => setMessages([{ role: 'assistant', content: 'Sessão reiniciada. Como posso ajudar?' }])} className="text-[10px] uppercase font-black text-gray-400 hover:text-blue-600 tracking-tighter transition-colors">Limpar Chat</button>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-5 py-3.5 rounded-3xl text-sm shadow-sm font-medium ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-100 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-700 px-5 py-3 rounded-2xl flex gap-1.5 items-center">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t dark:border-gray-700">
                  <form onSubmit={handleSendChatMessage} className="flex gap-3 relative">
                    <input 
                      type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Coloque uma questão sobre Marketing, Finanças ou RH..."
                      className="flex-1 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none dark:text-white transition-all pr-16 shadow-inner"
                    />
                    <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center shadow-lg shadow-blue-500/30">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            } />

            <Route path="company" element={isOwner ? (
                <div className="p-8 space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border dark:border-gray-700 p-10">
                    <h2 className="text-2xl font-black dark:text-white mb-8 flex gap-3 items-center"><Building2 className="text-blue-600 w-8 h-8"/> Gestão da Empresa</h2>
                    <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left"><h4 className="font-black text-blue-900 dark:text-blue-300 mb-1">Código de Equipa</h4><p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Usa este código para convidar colaboradores.</p></div>
                      <div className="flex items-center gap-4 bg-white dark:bg-gray-950 px-6 py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <code className="font-mono text-xl font-black text-gray-700 dark:text-blue-400 tracking-tighter">{showPageCode ? userData?.user_metadata?.company_code : '••••••••'}</code>
                        <div className="flex gap-2">
                          <button onClick={() => setShowPageCode(!showPageCode)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">{showPageCode ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}</button>
                          <button onClick={copyCode} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Copy className="w-5 h-5"/></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4 opacity-50 font-bold uppercase tracking-widest"><Shield className="w-16 h-16"/> Acesso Reservado</div>
            } />

            <Route path="*" element={<div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 opacity-20 font-black uppercase tracking-[0.5em]"><AlertTriangle className="w-16 h-16"/> EM BREVE</div>} />
          </Routes>
        </div>
      </main>

      {/* MODAL PERFIL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl p-4">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl border dark:border-gray-700">
            <h3 className="text-2xl font-black dark:text-white mb-8 flex items-center gap-3"><User className="text-blue-600 w-8 h-8"/> Editar Perfil</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 block ml-2">Dados Pessoais</label>
                <input type="text" placeholder="Nome Completo" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"/>
                <input type="text" placeholder="Cargo" value={editForm.jobTitle} onChange={e => setEditForm({...editForm, jobTitle: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"/>
              </div>
              {isOwner && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-purple-400 block ml-2">Empresa</label>
                  <input type="text" placeholder="Nome Empresa" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full p-4 bg-purple-50/50 dark:bg-gray-900 border-none rounded-2xl text-sm dark:text-white focus:ring-2 focus:ring-purple-500 transition-all"/>
                  <div className="flex gap-4 p-4 bg-purple-100/30 dark:bg-purple-900/10 rounded-2xl border border-purple-100/50 justify-between items-center">
                    <span className="font-mono font-black text-purple-700 dark:text-purple-300 text-lg tracking-tight">{showModalCode ? userData?.user_metadata?.company_code : '••••••••'}</span>
                    <button onClick={() => setShowModalCode(!showModalCode)} className="text-purple-400">{showModalCode ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-10">
              <button onClick={() => setIsProfileModalOpen(false)} className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">Cancelar</button>
              <button onClick={handleSaveProfile} disabled={savingProfile} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all">Guardar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-12 w-full max-w-md shadow-2xl">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6"><AlertTriangle className="text-red-600 w-10 h-10"/></div>
            <h3 className="text-2xl font-black text-red-600 mb-2">Atenção!</h3>
            <p className="text-gray-500 dark:text-gray-300 text-sm mb-8 leading-relaxed">Esta ação é irreversível. Todos os dados serão apagados. Escreve <b className="text-red-600">ELIMINAR</b> para confirmar.</p>
            <input type="text" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value.toUpperCase())} className="w-full p-5 bg-red-50 dark:bg-gray-900 border-2 border-red-100 dark:border-red-900/30 rounded-3xl text-center font-black text-red-600 placeholder:text-red-200 focus:ring-0 outline-none mb-6"/>
            <div className="flex gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 font-bold text-gray-400">Voltar</button>
              <button onClick={handleDeleteAccount} disabled={isDeleting} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all">Eliminar Agora</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}