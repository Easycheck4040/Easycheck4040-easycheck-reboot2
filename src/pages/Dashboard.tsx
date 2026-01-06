import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client';
import { 
  LayoutDashboard, MessageSquare, FileText, Users, BarChart3, Settings, LogOut, Menu, X, Bell, Mail, User, Trash2, AlertTriangle, Building2, Globe, Moon, Sun, ChevronDown, Eye, EyeOff, Pencil, UserMinus, Shield, Copy
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
  
  // --- ESTADOS DE PRIVACIDADE ---
  const [showFinancials, setShowFinancials] = useState(true); 
  const [showModalCode, setShowModalCode] = useState(false); // Olho dentro do Modal Perfil
  const [showPageCode, setShowPageCode] = useState(false);   // Olho na página Empresa

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

  // Lógica de Equipa (Mock)
  const openEditMember = (member: any) => { setMemberToEdit({ ...member }); setIsEditMemberModalOpen(true); };
  const saveMemberRole = () => { setTeamMembers(prev => prev.map(m => m.id === memberToEdit.id ? memberToEdit : m)); setIsEditMemberModalOpen(false); };
  const deleteMember = (id: number) => { if (window.confirm(t('team.delete_confirm'))) setTeamMembers(prev => prev.filter(m => m.id !== id)); };
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
    // GESTÃO EMPRESA (Só Patrão)
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

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900">
          <Routes>
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

            <Route path="company" element={isOwner ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold dark:text-white mb-6 flex gap-3"><Building2 className="text-blue-600"/> {t('settings.company_title')}</h2>
                  
                  <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div><h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1">{t('settings.invite_code')}</h4><p className="text-sm text-blue-600 dark:text-blue-400">{t('settings.invite_text')}</p></div>
                    <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                      <code className="px-2 font-mono text-lg font-bold text-gray-700 dark:text-gray-300">
                        {showPageCode ? userData?.user_metadata?.company_code : '••••••••'}
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

            <Route path="settings" element={<div className="text-center py-12 text-gray-500"><Settings className="w-16 h-16 mx-auto mb-4 opacity-50"/><h3>{t('dashboard.menu.settings')}</h3></div>} />
            <Route path="*" element={<div className="flex justify-center py-10 text-gray-400">Em desenvolvimento...</div>} />
          </Routes>
        </div>
      </main>

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
              <div><label className="block text-sm dark:text-gray-300 mb-1">{t('form.jobtitle')}</label><input type="text" value={editForm.jobTitle} onChange={e => setEditForm({...editForm, jobTitle: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white"/></div>
              
              {isOwner && (
                <>
                  <div className="pt-4 border-t dark:border-gray-700"><h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2"><Building2 className="w-4 h-4"/> {t('PROFILE.COMPANY_SECTION')}</h4></div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-100 dark:border-purple-800 mb-4">
                     <label className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-1 block">{t('form.code') || 'Código'}</label>
                     <div className="flex items-center justify-between">
                        <span className="font-mono font-medium text-purple-900 dark:text-white text-lg">
                           {showModalCode ? userData?.user_metadata?.company_code : '••••••••'}
                        </span>
                        <div className="flex gap-2">
                           <button onClick={() => setShowModalCode(!showModalCode)} className="text-purple-400 hover:text-purple-600 p-1">
                              {showModalCode ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                           </button>
                           <button onClick={copyCode} className="text-purple-400 hover:text-purple-600 p-1"><Copy className="w-4 h-4"/></button>
                        </div>
                     </div>
                  </div>
                  <div><label className="block text-sm dark:text-gray-300 mb-1">{t('form.company_name')}</label><input type="text" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white"/></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm dark:text-gray-300 mb-1">{t('form.address')}</label><input type="text" value={companyForm.address} onChange={e => setCompanyForm({...companyForm, address: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white"/></div>
                    <div><label className="block text-sm dark:text-gray-300 mb-1">{t('form.nif')}</label><input type="text" value={companyForm.nif} onChange={e => setCompanyForm({...companyForm, nif: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:text-white"/></div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700">
              <button onClick={() => setIsProfileModalOpen(false)} className="px-5 py-2.5 border rounded-xl dark:text-gray-300">{t('common.cancel')}</button>
              <button onClick={handleSaveProfile} disabled={savingProfile} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

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
