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
  
  // --- CONFIGURAÇÃO DA API ---
  const API_URL = window.location.hostname === 'easycheckglobal.com' 
    ? 'https://easycheck4040-easycheck-reboot2.onrender.com' 
    : 'http://localhost:3000';

  // --- ESTADOS GERAIS ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  // --- ESTADOS DE CHAT IA (NOVO) ---
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Olá! Como posso ajudar a sua empresa?' }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef(null);

  // --- ESTADOS DE PRIVACIDADE ---
  const [showFinancials, setShowFinancials] = useState(true); 
  const [showModalCode, setShowModalCode] = useState(false);
  const [showPageCode, setShowPageCode] = useState(false);

  const [isDark, setIsDark] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // --- MODAIS ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<any>(null);
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

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erro ao ligar ao servidor.' }]);
    } finally { setIsChatLoading(false); }
  };

  const toggleTheme = () => { document.documentElement.classList.toggle('dark'); setIsDark(!isDark); };
  const toggleFinancials = () => setShowFinancials(!showFinancials);
  const selectLanguage = (code: string) => { i18n.changeLanguage(code); setIsLangMenuOpen(false); };
  const getInitials = (name: string) => name ? (name.split(' ').length > 1 ? (name.split(' ')[0][0] + name.split(' ')[name.split(' ').length - 1][0]) : name.substring(0, 2)).toUpperCase() : 'EC';
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const updates: any = { full_name: editForm.fullName, job_title: editForm.jobTitle };
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
    } catch (error: any) { alert("Erro: " + error.message); } 
    finally { setSavingProfile(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'ELIMINAR') return alert(t('delete.confirm_text'));
    setIsDeleting(true);
    try { await supabase.rpc('delete_user'); await supabase.auth.signOut(); navigate('/'); } 
    catch(e: any) { alert(e.message); } 
    finally { setIsDeleting(false); }
  };

  const copyCode = () => { navigator.clipboard.writeText(userData?.user_metadata?.company_code); alert("Código copiado!"); };

  if (loadingUser) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">Loading...</div>;
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
      
      {/* SIDEBAR ORIGINAL */}
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
                {getInitials(userData?.user_metadata?.full_name)}
              </button>
              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute top-16 right-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40 overflow-hidden">
                    <div className="px-4 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <p className="font-bold dark:text-white truncate">{userData?.user_metadata?.full_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">{userData?.email}</p>
                    </div>
                    <button onClick={() => {setIsProfileModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-2 dark:text-gray-300 text-sm font-medium"><User className="w-4 h-4"/> {t('profile.edit')}</button>
                    <button onClick={() => {setIsDeleteModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex gap-2 border-t dark:border-gray-700 text-sm font-medium"><Trash2 className="w-4 h-4"/> {t('profile.delete')}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900">
          <Routes>
            {/* VISTA GERAL ORIGINAL */}
            <Route path="/" element={
              <div className="space-y-6">
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
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-8 text-center">
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">{t('dashboard.welcome')}, {userData?.user_metadata?.full_name?.split(' ')[0]}! 👋</h3>
                  <Link to="/dashboard/chat" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg"><MessageSquare className="w-5 h-5" />{t('dashboard.open_chat')}</Link>
                </div>
              </div>
            } />

            {/* CHAT IA INTEGRADO NO LAYOUT (NOVO) */}
            <Route path="chat" element={
              <div className="flex flex-col h-[calc(100vh-160px)] bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 overflow-hidden">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-white'}`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendChat} className="p-4 border-t dark:border-gray-700 flex gap-2">
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Pergunte algo..." className="flex-1 p-3 rounded-xl border dark:bg-gray-900 dark:text-white" />
                  <button type="submit" className="p-3 bg-blue-600 text-white rounded-xl"><Send size={20}/></button>
                </form>
              </div>
            } />

            {/* RESTANTES ROTAS ORIGINAIS */}
            <Route path="company" element={isOwner ? ( <div className="p-8">Gestão de Empresa Original</div> ) : <div className="p-8">Acesso Restrito</div>} />
            <Route path="*" element={<div className="flex justify-center py-10 text-gray-400">Em desenvolvimento...</div>} />
          </Routes>
        </div>
      </main>

      {/* MODAL PERFIL ORIGINAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           {/* ... Mantenha o conteúdo do seu modal original aqui ... */}
           <button onClick={() => setIsProfileModalOpen(false)}><X/></button>
        </div>
      )}
    </div>
  );
}