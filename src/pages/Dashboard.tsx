import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
    Legend, ResponsiveContainer 
} from 'recharts';
import { 
    LayoutDashboard, MessageSquare, FileText, Users, BarChart3, Settings, 
    LogOut, Menu, X, Globe, Moon, Sun, Eye, EyeOff, User, Trash2, 
    AlertTriangle, Building2, Copy, Send, Shield, Mail, Plus, FileCheck, 
    TrendingDown, Landmark, PieChart, FileSpreadsheet, BookOpen, Box, 
    Briefcase, Truck, RefreshCw, CheckCircle, AlertOctagon, 
    TrendingUp as TrendingUpIcon, Palette, Edit2, UploadCloud, Activity, Zap, List
} from 'lucide-react';
import { Routes, Route } from 'react-router-dom';

// IMPORTA A LÓGICA DO CÉREBRO (Máquina de Estados + Dados)
import { useDashboardLogic, countries, invoiceTypes, languages } from '../hooks/useDashboardLogic';

export default function Dashboard() {
  const { t } = useTranslation();
  const location = useLocation();
  
  // ---------------------------------------------------------
  // INICIALIZAÇÃO DA LÓGICA
  // ---------------------------------------------------------
  const logic = useDashboardLogic();

  // Scroll automático para o fundo do chat quando há novas mensagens
  useEffect(() => {
    if (logic.scrollRef.current) {
        logic.scrollRef.current.scrollTop = logic.scrollRef.current.scrollHeight;
    }
  }, [logic.messages]);

  // Ecrã de Carregamento Inicial
  if (logic.loadingUser) {
    return (
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="font-medium animate-pulse">A carregar o seu escritório digital...</p>
            </div>
        </div>
    );
  }

  const isOwner = logic.profileData?.role === 'owner';

  // Configuração do Menu Lateral
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
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform md:translate-x-0 transition-transform ${logic.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b dark:border-gray-700">
            <Link to="/" className="flex items-center gap-3">
                <img src="/logopequena.PNG" className="h-8 w-auto" alt="Logo"/>
                <span className="font-bold text-xl text-gray-900 dark:text-white">EasyCheck</span>
            </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            if (item.hidden) return null;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => logic.setIsMobileMenuOpen(false)} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg' : item.special ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-100 dark:border-purple-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
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

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER SUPERIOR */}
        <header className="h-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between px-8 shadow-sm z-20 items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => logic.setIsMobileMenuOpen(!logic.isMobileMenuOpen)} className="md:hidden text-gray-600 dark:text-gray-200">
                <Menu />
            </button>
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                {logic.profileData?.country && <span className="text-2xl">{logic.profileData.country === 'Portugal' ? '🇵🇹' : logic.profileData.country === 'Brasil' ? '🇧🇷' : ''}</span>}
                {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Seletor de Idioma */}
            <div className="relative">
                <button onClick={() => logic.setIsLangMenuOpen(!logic.isLangMenuOpen)} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <Globe className="w-5 h-5"/>
                </button>
                {logic.isLangMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => logic.setIsLangMenuOpen(false)}></div>
                    <div className="absolute top-12 right-0 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40 overflow-hidden py-1">
                      {languages.map((lang) => (
                          <button key={lang.code} onClick={() => logic.selectLanguage(lang.code)} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-3 items-center text-sm font-medium text-gray-700 dark:text-gray-200">
                              <span>{lang.flag}</span>{lang.label}
                          </button>
                      ))}
                    </div>
                  </>
                )}
            </div>

            {/* Dark Mode Toggle */}
            <button onClick={logic.toggleTheme} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                {logic.isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => logic.setIsProfileDropdownOpen(!logic.isProfileDropdownOpen)} className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full text-white font-bold shadow-md cursor-pointer hover:opacity-90 flex items-center justify-center">
                  {logic.getInitials(logic.profileData?.full_name)}
              </button>
              {logic.isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => logic.setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute top-16 right-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40 overflow-hidden">
                    <div className="px-4 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <p className="font-bold truncate text-gray-800 dark:text-white">{logic.profileData?.full_name}</p>
                      <p className="text-xs text-gray-500 truncate mb-2">{logic.profileData?.company_name}</p>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full inline-block">
                          {isOwner ? t('role.owner') : t('role.employee')}
                      </span>
                    </div>
                    <button onClick={() => {logic.setIsProfileModalOpen(true); logic.setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <User className="w-4 h-4"/> {t('profile.edit')}
                    </button>
                    <button onClick={() => {logic.setIsDeleteModalOpen(true); logic.setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex gap-2 border-t dark:border-gray-700 text-sm font-medium">
                        <Trash2 className="w-4 h-4"/> {t('profile.delete')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ÁREA DE RENDERIZAÇÃO DAS ROTAS */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8">
          <Routes>
            {/* 1. VISÃO GERAL (DASHBOARD) */}
            <Route path="/" element={
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Gráfico Principal */}
                        <div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Evolução Financeira</h3>
                                <button className="text-gray-400 hover:text-blue-600"><Settings size={16}/></button>
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={logic.chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: logic.isDark ? '#1F2937' : '#FFFFFF', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: logic.isDark ? '#fff' : '#000'}} />
                                        <Legend iconType="circle" />
                                        <Bar dataKey="receitas" name="Receitas" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={20} />
                                        <Bar dataKey="despesas" name="Despesas" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        {/* KPIs Rápidos */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Saldo Atual</h3>
                                <p className={`text-3xl font-bold ${logic.currentBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {logic.showFinancials ? `${logic.displaySymbol} ${logic.currentBalance.toFixed(2)}` : '••••••'}
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 flex items-center justify-between">
                                <div><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Faturas</h3><p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{logic.totalInvoicesCount}</p></div>
                                <div className="bg-blue-100 p-3 rounded-xl"><FileText className="text-blue-600"/></div>
                            </div>
                        </div>
                    </div>
                    {/* Atalhos Rápidos & Logs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Zap/> Assistente Rápido</h3>
                                <p className="text-blue-100 text-sm mb-6">Precisa de ajuda? Use o chat ou estes atalhos para gerir a sua empresa.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={()=>{logic.resetInvoiceForm();logic.setShowInvoiceForm(true)}} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"><Plus size={16}/> Nova Fatura</button>
                                <button onClick={()=>{logic.setEditingEntityId(null);logic.setNewEntity({name:'',nif:'',email:'',address:'',city:'',postal_code:'',country:'Portugal'});logic.setEntityType('client');logic.setShowEntityModal(true)}} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"><Users size={16}/> Novo Cliente</button>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 h-64 overflow-hidden flex flex-col">
                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2"><Activity size={16}/> Últimas Atividades</h3>
                            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                                {logic.actionLogs.length === 0 ? <p className="text-xs text-gray-400 text-center py-10">Sem histórico recente.</p> : logic.actionLogs.map(log => (
                                    <div key={log.id} className="flex gap-3 text-sm p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl items-center">
                                        <div className={`w-2 h-2 rounded-full ${log.action_type === 'RISCO' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                        <div>
                                            <p className="font-bold text-gray-700 dark:text-gray-200">{log.description}</p>
                                            <p className="text-[10px] text-gray-400">{new Date(log.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            } />
            
            {/* 2. MÓDULO DE CONTABILIDADE */}
            <Route path="accounting" element={
                <div className="h-full flex flex-col">
                    <div className="flex gap-2 border-b dark:border-gray-700 pb-2 mb-6 overflow-x-auto">
                        {[{id:'overview',l:'Diário',i:PieChart},{id:'coa',l:'Plano de Contas',i:BookOpen},{id:'invoices',l:'Faturas',i:FileText},{id:'purchases',l:'Compras',i:TrendingDown},{id:'banking',l:'Bancos',i:Landmark},{id:'clients',l:'Clientes',i:Briefcase},{id:'suppliers',l:'Fornecedores',i:Truck},{id:'assets',l:'Ativos',i:Box},{id:'taxes',l:'Impostos',i:FileCheck},{id:'reports',l:'Relatórios',i:FileSpreadsheet}].map(t=>(
                            <button key={t.id} onClick={()=>logic.setAccountingTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-colors whitespace-nowrap ${logic.accountingTab===t.id?'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300':'bg-white dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                <t.i size={16}/>{t.l}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
                        
                        {/* TAB: Diário Geral */}
                        {logic.accountingTab === 'overview' && (
                            <div className="p-4 h-full flex flex-col">
                                <div className="flex justify-between mb-4">
                                    <h3 className="font-bold flex gap-2 text-gray-800 dark:text-white"><BookOpen/> Diário Geral (Lançamentos)</h3>
                                    <button onClick={()=>logic.setShowTransactionModal(true)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"><Plus size={16}/> Manual</button>
                                </div>
                                <div className="flex-1 overflow-y-auto border rounded-xl shadow-sm dark:border-gray-700">
                                    <table className="w-full text-xs text-left border-collapse">
                                        <thead className="bg-gray-100 dark:bg-gray-700 uppercase font-bold text-gray-600 dark:text-gray-300 sticky top-0">
                                            <tr>
                                                <th className="p-3 border-b dark:border-gray-600">Data</th>
                                                <th className="p-3 border-b dark:border-gray-600">Doc</th>
                                                <th className="p-3 border-b dark:border-gray-600">Conta</th>
                                                <th className="p-3 border-b dark:border-gray-600">Descrição</th>
                                                <th className="p-3 border-b dark:border-gray-600 text-right">Débito</th>
                                                <th className="p-3 border-b dark:border-gray-600 text-right">Crédito</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                            {logic.journalEntries.length === 0 ? (
                                                <tr><td colSpan={6} className="p-8 text-center text-gray-400">Sem movimentos registados.</td></tr>
                                            ) : (
                                                logic.journalEntries.map(entry => (
                                                    entry.journal_items?.map((item: any, i: number) => (
                                                        <tr key={`${entry.id}-${i}`} className="border-b last:border-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                                                            <td className="p-2 w-24 text-gray-500 dark:text-gray-400 font-mono">{i === 0 ? new Date(entry.date).toLocaleDateString() : ''}</td>
                                                            <td className="p-2 w-24 font-bold text-blue-600 dark:text-blue-400">{i === 0 ? (entry.document_ref || 'MANUAL') : ''}</td>
                                                            <td className="p-2 w-20 font-mono font-bold text-gray-700 dark:text-gray-300">{item.company_accounts?.code}</td>
                                                            <td className="p-2 text-gray-700 dark:text-gray-300">{i === 0 ? entry.description : <span className="text-gray-400 ml-4">↳ {item.company_accounts?.name}</span>}</td>
                                                            <td className="p-2 text-right w-24 font-mono">{item.debit > 0 ? logic.displaySymbol + item.debit.toFixed(2) : ''}</td>
                                                            <td className="p-2 text-right w-24 font-mono text-gray-600 dark:text-gray-400">{item.credit > 0 ? logic.displaySymbol + item.credit.toFixed(2) : ''}</td>
                                                        </tr>
                                                    ))
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB: ATIVOS (Imobilizado) - CORRIGIDA */}
                        {logic.accountingTab === 'assets' && (
                            <div className="h-full flex flex-col">
                                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                                    <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2"><Box size={18}/> Mapa de Imobilizado</h3>
                                    <button onClick={() => {
                                        logic.setEditingAssetId(null); 
                                        logic.setNewAsset({ name: '', category: 'Equipamento', purchase_date: new Date().toISOString().split('T')[0], purchase_value: '', lifespan_years: 3, amortization_method: 'linear' }); 
                                        logic.setShowAssetModal(true)
                                    }} className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-bold flex gap-2 items-center hover:bg-blue-700 transition-colors">
                                        <Plus size={16}/> Novo Ativo
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase font-bold sticky top-0">
                                            <tr>
                                                <th className="px-6 py-3">Ativo</th>
                                                <th className="px-6 py-3">Data Aq.</th>
                                                <th className="px-6 py-3 text-right">Valor Aq.</th>
                                                <th className="px-6 py-3 text-right">Amort. Acumulada</th>
                                                <th className="px-6 py-3 text-right">Valor Líquido (VNC)</th>
                                                <th className="px-6 py-3 text-center">Método</th>
                                                <th className="px-6 py-3 text-center">...</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y dark:divide-gray-700 text-gray-800 dark:text-gray-200">
                                            {logic.assets.length === 0 ? (
                                                <tr><td colSpan={7} className="text-center py-8 text-gray-400">Nenhum ativo registado.</td></tr>
                                            ) : (
                                                logic.assets.map(a => { 
                                                    const currentVal = logic.getCurrentAssetValue(a); 
                                                    const accumulated = a.purchase_value - currentVal; 
                                                    return (
                                                        <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                            <td className="px-6 py-3 font-bold">{a.name}</td>
                                                            <td className="px-6 py-3 font-mono text-gray-500 dark:text-gray-400">{new Date(a.purchase_date).toLocaleDateString()}</td>
                                                            <td className="px-6 py-3 text-right font-mono">{logic.displaySymbol} {(a.purchase_value * logic.conversionRate).toFixed(2)}</td>
                                                            <td className="px-6 py-3 text-right font-mono text-gray-500 dark:text-gray-400">{logic.displaySymbol} {(accumulated * logic.conversionRate).toFixed(2)}</td>
                                                            <td className="px-6 py-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">{logic.displaySymbol} {(currentVal * logic.conversionRate).toFixed(2)}</td>
                                                            <td className="px-6 py-3 text-center"><span className="bg-gray-100 dark:bg-gray-600 dark:text-gray-200 px-2 py-0.5 rounded text-[9px] font-bold uppercase">{a.amortization_method === 'linear' ? 'Linear' : 'Degress.'}</span></td>
                                                            <td className="px-6 py-3 text-center flex justify-center gap-2">
                                                                <button onClick={() => logic.handleShowAmortSchedule(a)} className="text-blue-500 hover:text-blue-700" title="Ver Plano"><List size={14}/></button>
                                                                <button onClick={() => logic.handleDeleteAsset(a.id)} className="text-red-400 hover:text-red-600" title="Abater"><Trash2 size={14}/></button>
                                                            </td>
                                                        </tr>
                                                    ); 
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* OUTRAS ABAS (Banking, etc.) */}
                        {logic.accountingTab === 'banking' && (
                            <div className="p-6 h-full overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <div><h3 className="text-xl font-bold mb-1 text-gray-800 dark:text-white">Reconciliação Bancária Profissional</h3><p className="text-xs text-gray-500">Saldo Contabilístico: <span className="font-bold text-blue-600">{logic.displaySymbol} {logic.currentBalance.toFixed(2)}</span></p></div>
                                    <div className="flex gap-2"><label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all"><UploadCloud size={16}/> {logic.isUploadingCSV ? 'A processar...' : 'Importar Extrato CSV'}<input type="file" accept=".csv" onChange={logic.handleCSVUpload} className="hidden" /></label></div>
                                </div>
                                {logic.bankStatement.length > 0 ? (
                                    <div className="border rounded-2xl overflow-hidden shadow-sm dark:border-gray-700">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-gray-50 dark:bg-gray-900 uppercase font-bold text-gray-600 dark:text-gray-300 border-b dark:border-gray-700"><tr><th className="p-4">Data</th><th className="p-4">Descrição Bancária</th><th className="p-4 text-right">Valor</th><th className="p-4 text-center">Auto-Match</th><th className="p-4 text-center">Estado</th></tr></thead>
                                            <tbody className="text-gray-800 dark:text-gray-200">
                                                {logic.bankStatement.map((line, idx) => (
                                                    <tr key={idx} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                                        <td className="p-4 font-mono">{line.date}</td>
                                                        <td className="p-4">{line.description}</td>
                                                        <td className={`p-4 text-right font-bold ${line.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>{logic.displaySymbol} {line.amount.toFixed(2)}</td>
                                                        <td className="p-4 text-center">{line.suggested_match ? (<span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-100 flex items-center gap-1 justify-center"><RefreshCw size={10}/> {line.suggested_match}</span>) : <span className="text-gray-400">-</span>}</td>
                                                        <td className="p-4 text-center"><button className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${line.matched_invoice_id ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{line.matched_invoice_id ? 'Confirmar' : 'Manualmente'}</button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-20 text-center border-2 border-dashed rounded-3xl border-gray-200 dark:border-gray-700"><Landmark size={48} className="mx-auto text-gray-300 mb-4"/><p className="text-gray-500 font-medium">Nenhum extrato importado.</p><p className="text-xs text-gray-400 mt-1">Carregue um ficheiro CSV para iniciar a reconciliação automática.</p></div>
                                )}
                            </div>
                        )}
                        
                    </div>
                </div>
            } />
            
            {/* ROTA: CHAT COM A IA */}
            <Route path="chat" element={
                <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                    <div ref={logic.scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                        {logic.messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-700 dark:text-white rounded-tl-none'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {logic.isChatLoading && (
                            <div className="flex items-center gap-2 text-xs text-gray-400 ml-4">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <form onSubmit={logic.handleSendChatMessage} className="flex gap-2 relative">
                            <input type="text" value={logic.chatInput} onChange={(e) => logic.setChatInput(e.target.value)} placeholder="Pergunte ao assistente EasyCheck..." className="flex-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm dark:text-white"/>
                            <button type="submit" disabled={logic.isChatLoading || !logic.chatInput.trim()} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow-md disabled:opacity-50 transition-colors">
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            } />

            {/* ROTA: DEFINIÇÕES */}
            <Route path="settings" element={
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
                        <h2 className="text-xl font-bold mb-6 flex gap-2 text-gray-900 dark:text-white"><Settings/> Definições Globais</h2>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div><label className="block text-xs font-bold mb-1 text-gray-600 dark:text-gray-400">País</label><select value={logic.companyForm.country} onChange={logic.handleCountryChange} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white">{countries.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                            <div><label className="block text-xs font-bold mb-1 text-gray-600 dark:text-gray-400">Moeda</label><input value={logic.companyForm.currency} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white bg-gray-100" disabled/></div>
                        </div>
                        <div className="flex justify-end"><button onClick={logic.handleSaveCompany} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700">Guardar</button></div>
                    </div>
                </div>
            } />
          </Routes>
        </div>
      </main>

      {/* --- MODAIS GLOBAIS --- */}
      
      {/* 1. Modal Ativos */}
      {logic.showAssetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl border dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{logic.editingAssetId ? 'Editar Ativo' : 'Novo Ativo'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Bem</label>
                        <input value={logic.newAsset.name} onChange={e => logic.setNewAsset({...logic.newAsset, name: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: MacBook Pro" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor Compra</label>
                            <input type="number" value={logic.newAsset.purchase_value} onChange={e => logic.setNewAsset({...logic.newAsset, purchase_value: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
                            <input type="date" value={logic.newAsset.purchase_date} onChange={e => logic.setNewAsset({...logic.newAsset, purchase_date: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vida Útil (Anos)</label>
                            <input type="number" value={logic.newAsset.lifespan_years} onChange={e => logic.setNewAsset({...logic.newAsset, lifespan_years: parseInt(e.target.value)})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Método</label>
                            <select value={logic.newAsset.amortization_method} onChange={e => logic.setNewAsset({...logic.newAsset, amortization_method: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white">
                                <option value="linear">Linear</option>
                                <option value="degressive">Degressivo</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => logic.setShowAssetModal(false)} className="px-4 py-2 text-gray-500 font-bold hover:text-gray-700 dark:hover:text-gray-300">Cancelar</button>
                        <button onClick={logic.handleCreateAsset} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform active:scale-95">Gravar Ativo</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 2. Modal Transação Manual */}
      {logic.showTransactionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl shadow-2xl border dark:border-gray-700 h-[80vh] flex flex-col">
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900 rounded-t-2xl">
                    <div><h3 className="font-bold text-xl flex gap-2 items-center text-gray-900 dark:text-white"><BookOpen className="text-blue-600"/> Lançamento Contabilístico</h3></div>
                    <button onClick={()=>logic.setShowTransactionModal(false)} className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full"><X className="dark:text-white"/></button>
                </div>
                {/* Nota: O conteúdo do modal de transação seria expandido aqui com a lógica do grid que tens no hook */}
                <div className="p-8 text-center text-gray-500">
                    <p>Funcionalidade de lançamento manual (Grid) disponível no hook.</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}