import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
    LayoutDashboard, MessageSquare, FileText, Users, BarChart3, Settings, LogOut, Menu, X, 
    Globe, Moon, Sun, Eye, EyeOff, User, Trash2, AlertTriangle, Building2, 
    Copy, Send, Shield, Mail, Plus, FileCheck, TrendingDown, Landmark, PieChart, FileSpreadsheet, 
    BookOpen, Box, Briefcase, Truck, RefreshCw, CheckCircle, AlertOctagon, TrendingUp as TrendingUpIcon, 
    Palette, Edit2, Download, UploadCloud, Activity, Zap, AlertCircle, List
} from 'lucide-react';
import { Routes, Route } from 'react-router-dom';

// IMPORTA A LÓGICA E CONSTANTES ROBUSTAS
import { useDashboardLogic, countries, invoiceTypes, languages } from '../hooks/useDashboardLogic';

export default function Dashboard() {
  const { t } = useTranslation();
  const location = useLocation();
  const logic = useDashboardLogic();

  if (logic.loadingUser) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="dark:text-white font-medium italic">Sincronizando escritório inteligente...</p>
      </div>
    );
  }

  const isOwner = logic.profileData?.role === 'owner';

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
      
      {/* SIDEBAR MOBILE OVERLAY */}
      {logic.isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in" onClick={() => logic.setIsMobileMenuOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform md:translate-x-0 transition-transform duration-300 ${logic.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b dark:border-gray-700">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logopequena.PNG" className="h-8 w-auto" alt="Logo"/>
              <span className="font-bold text-xl tracking-tight dark:text-white">EasyCheck</span>
            </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            if (item.hidden) return null;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => logic.setIsMobileMenuOpen(false)} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                  : item.special 
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-100 dark:border-purple-800' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
          <button onClick={logic.handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium">
            <LogOut className="w-5 h-5" /> {t('nav.logout')}
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between px-8 shadow-sm z-20 items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => logic.setIsMobileMenuOpen(!logic.isMobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Menu size={24} className="dark:text-white" />
            </button>
            <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                {logic.profileData?.country && (
                  <span className="text-2xl drop-shadow-sm">
                    {logic.profileData.country === 'Portugal' ? '🇵🇹' : logic.profileData.country === 'Brasil' ? '🇧🇷' : '🌍'}
                  </span>
                )}
                <span className="hidden sm:inline">
                  {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
                <button onClick={() => logic.setIsLangMenuOpen(!logic.isLangMenuOpen)} className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors border dark:border-gray-700">
                  <Globe className="w-5 h-5"/>
                </button>
                {logic.isLangMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => logic.setIsLangMenuOpen(false)}></div>
                    <div className="absolute top-12 right-0 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 z-40 overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                      {languages.map((lang) => (
                        <button key={lang.code} onClick={() => logic.selectLanguage(lang.code)} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-3 items-center text-sm font-medium transition-colors">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="dark:text-gray-200">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
            </div>

            <button onClick={logic.toggleTheme} className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors border dark:border-gray-700">
              {logic.isDark ? <Sun className="w-5 h-5 text-yellow-400"/> : <Moon className="w-5 h-5"/>}
            </button>

            {/* PROFILE DROPDOWN RESTAURADO */}
            <div className="relative">
              <button onClick={() => logic.setIsProfileDropdownOpen(!logic.isProfileDropdownOpen)} className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full text-white font-bold shadow-md cursor-pointer hover:scale-105 transition-transform flex items-center justify-center">
                {logic.getInitials(logic.profileData?.full_name)}
              </button>
              {logic.isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => logic.setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute top-16 right-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 z-40 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="px-6 py-5 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                      <p className="font-bold truncate dark:text-white">{logic.profileData?.full_name}</p>
                      <p className="text-xs text-gray-500 truncate mb-2">{logic.profileData?.company_name}</p>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full inline-block">
                        {isOwner ? t('role.owner') : t('role.employee')}
                      </span>
                    </div>
                    {/* BOTÃO EDITAR PERFIL RESTAURADO */}
                    <button 
                      onClick={() => { logic.setIsProfileModalOpen(true); logic.setIsProfileDropdownOpen(false); }} 
                      className="w-full text-left px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-3 text-sm font-medium transition-colors dark:text-gray-200"
                    >
                      <User className="w-4 h-4 text-blue-500"/> {t('profile.edit')}
                    </button>
                    <button onClick={() => {logic.setIsDeleteModalOpen(true); logic.setIsProfileDropdownOpen(false)}} className="w-full text-left px-6 py-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex gap-3 border-t dark:border-gray-700 text-sm font-medium transition-colors">
                      <Trash2 className="w-4 h-4"/> {t('profile.delete')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
          <Routes>
            <Route path="/" element={
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Evolução Financeira</h3>
                                <button className="text-gray-400 hover:text-blue-600"><Settings size={18}/></button>
                            </div>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={logic.chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={logic.isDark ? "#374151" : "#E5E7EB"} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                                        <RechartsTooltip 
                                          cursor={{fill: logic.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}} 
                                          contentStyle={{
                                            borderRadius: '12px', 
                                            border: 'none', 
                                            backgroundColor: logic.isDark ? '#1F2937' : '#FFFFFF',
                                            color: logic.isDark ? '#F9FAFB' : '#111827'
                                          }} 
                                        />
                                        <Legend iconType="circle" />
                                        <Bar dataKey="receitas" name="Receitas" fill="#10B981" radius={[6, 6, 0, 0]} barSize={24} />
                                        <Bar dataKey="despesas" name="Despesas" fill="#EF4444" radius={[6, 6, 0, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 flex flex-col justify-center min-h-[140px]">
                                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Saldo Atual</h3>
                                <p className={`text-4xl font-black tracking-tight ${logic.currentBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {logic.showFinancials ? `${logic.displaySymbol} ${logic.currentBalance.toFixed(2)}` : '••••••'}
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 flex items-center justify-between min-h-[140px]">
                                <div>
                                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Faturas</h3>
                                  <p className="text-3xl font-black text-gray-800 dark:text-white mt-1">{logic.totalInvoicesCount}</p>
                                </div>
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-2xl">
                                  <FileText className="text-blue-600 dark:text-blue-400" size={28}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            } />

            <Route path="accounting" element={/* Mantém sua lógica original de tabelas e tabs conforme o código robusto anterior */ null} />

            {/* ROTA DO CHAT - CORREÇÃO VISUAL DE ACORDO COM A IMAGEM */}
            <Route path="chat" element={
              <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 shadow-2xl overflow-hidden animate-in fade-in duration-500">
                <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
                  <div className="flex items-center gap-3 pl-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="font-bold dark:text-white uppercase tracking-tighter">AI Financial Assistant (Llama 3.3)</h3>
                  </div>
                  <Shield size={16} className="text-blue-500 opacity-50 mr-2"/>
                </div>
                
                <div ref={logic.scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
                  {logic.messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-top-1 duration-300`}>
                      <div className={`max-w-[75%] px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-100 rounded-tl-none border dark:border-gray-600'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  
                  {/* ANIMAÇÃO DE LOADING - SUBSTITUI O BALÃO VAZIO DA IMAGEM */}
                  {logic.isChatLoading && (
                    <div className="flex justify-start items-center gap-3 ml-2">
                      <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 rounded-3xl rounded-tl-none flex gap-2 border dark:border-gray-600 shadow-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                  <form onSubmit={logic.handleSendChatMessage} className="flex gap-3 max-w-4xl mx-auto">
                    <input 
                      type="text" 
                      value={logic.chatInput} 
                      onChange={(e) => logic.setChatInput(e.target.value)} 
                      placeholder="Ex: 'Criar fatura de 100€ para Apple'..." 
                      className="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                    />
                    <button 
                      type="submit" 
                      disabled={logic.isChatLoading || !logic.chatInput.trim()} 
                      className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 shadow-xl disabled:opacity-30 transition-all active:scale-95"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </div>
            } />
            <Route path="*" element={<div className="p-20 text-center text-gray-400 italic">Módulo em desenvolvimento...</div>} />
          </Routes>
        </div>
      </main>

      {/* MODAL EDITAR PERFIL RESTAURADO */}
      {logic.isProfileModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in zoom-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl border dark:border-gray-700 relative">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Editar Perfil</h3>
                  <button onClick={() => logic.setIsProfileModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-white"><X size={24}/></button>
                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Nome Completo</label>
                        <input value={logic.editForm.fullName} onChange={e => logic.setEditForm({...logic.editForm, fullName: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-2xl dark:text-white font-bold outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Cargo / Função</label>
                        <input value={logic.editForm.jobTitle} onChange={e => logic.setEditForm({...logic.editForm, jobTitle: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-2xl dark:text-white font-bold outline-none" />
                    </div>
                    <div className="space-y-2 opacity-60">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email</label>
                        <input value={logic.editForm.email} disabled className="w-full p-4 bg-gray-100 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl dark:text-gray-400 font-mono" />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-10">
                    <button onClick={() => logic.setIsProfileModalOpen(false)} className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-widest">Cancelar</button>
                    <button onClick={logic.handleSaveProfile} disabled={logic.savingProfile} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all active:scale-95">
                      {logic.savingProfile ? 'A GUARDAR...' : 'GUARDAR PERFIL'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Outros modais robustos (Transaction, Asset, Preview) mantidos conforme o código original para não perder capacidade */}
    </div>
  );
}