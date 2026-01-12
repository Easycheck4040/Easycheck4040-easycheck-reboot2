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

// IMPORTA A LÓGICA DO OUTRO FICHEIRO
import { useDashboardLogic, countries, invoiceTypes, languages } from './useDashboardLogic';

export default function Dashboard() {
  const { t } = useTranslation();
  const location = useLocation();
  
  // ---------------------------------------------------------
  // TODA A LÓGICA VEM DESTE HOOK
  // ---------------------------------------------------------
  const logic = useDashboardLogic();

  if (logic.loadingUser) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 dark:text-white">A carregar escritório...</div>;
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
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform md:translate-x-0 transition-transform ${logic.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b dark:border-gray-700">
            <Link to="/" className="flex items-center gap-3"><img src="/logopequena.PNG" className="h-8 w-auto"/><span className="font-bold text-xl">EasyCheck</span></Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            if (item.hidden) return null;
            return (
              <Link key={item.path} to={item.path} onClick={() => logic.setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg' : item.special ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-100 dark:border-purple-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <item.icon className="w-5 h-5" /><span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
          <button onClick={logic.handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium"><LogOut className="w-5 h-5" /> {t('nav.logout')}</button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between px-8 shadow-sm z-20 items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => logic.setIsMobileMenuOpen(!logic.isMobileMenuOpen)} className="md:hidden"><Menu /></button>
            <h2 className="text-xl font-bold flex items-center gap-2">
                {logic.profileData?.country && <span className="text-2xl">{logic.profileData.country === 'Portugal' ? '🇵🇹' : logic.profileData.country === 'Brasil' ? '🇧🇷' : ''}</span>}
                {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
                <button onClick={() => logic.setIsLangMenuOpen(!logic.isLangMenuOpen)} className="p-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Globe className="w-5 h-5"/></button>
                {logic.isLangMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => logic.setIsLangMenuOpen(false)}></div>
                    <div className="absolute top-12 right-0 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40 overflow-hidden py-1">
                      {languages.map((lang) => (<button key={lang.code} onClick={() => logic.selectLanguage(lang.code)} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-3 items-center text-sm font-medium"><span>{lang.flag}</span>{lang.label}</button>))}
                    </div>
                  </>
                )}
            </div>
            <button onClick={logic.toggleTheme} className="p-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{logic.isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}</button>
            <div className="relative">
              <button onClick={() => logic.setIsProfileDropdownOpen(!logic.isProfileDropdownOpen)} className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full text-white font-bold shadow-md cursor-pointer hover:opacity-90">{logic.getInitials(logic.profileData?.full_name)}</button>
              {logic.isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => logic.setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute top-16 right-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40 overflow-hidden">
                    <div className="px-4 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <p className="font-bold truncate">{logic.profileData?.full_name}</p>
                      <p className="text-xs text-gray-500 truncate mb-2">{logic.profileData?.company_name}</p>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full inline-block">{isOwner ? t('role.owner') : t('role.employee')}</span>
                    </div>
                    <button onClick={() => {logic.setIsProfileModalOpen(true); logic.setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-2 text-sm font-medium"><User className="w-4 h-4"/> {t('profile.edit')}</button>
                    <button onClick={() => {logic.setIsDeleteModalOpen(true); logic.setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex gap-2 border-t dark:border-gray-700 text-sm font-medium"><Trash2 className="w-4 h-4"/> {t('profile.delete')}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8">
          <Routes>
            <Route path="/" element={
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                        <Legend iconType="circle" />
                                        <Bar dataKey="receitas" name="Receitas" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={20} />
                                        <Bar dataKey="despesas" name="Despesas" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Saldo Atual</h3>
                                <p className={`text-3xl font-bold ${logic.currentBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>{logic.showFinancials ? `${logic.displaySymbol} ${logic.currentBalance.toFixed(2)}` : '••••••'}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 flex items-center justify-between">
                                <div><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Faturas</h3><p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{logic.totalInvoicesCount}</p></div>
                                <div className="bg-blue-100 p-3 rounded-xl"><FileText className="text-blue-600"/></div>
                            </div>
                        </div>
                    </div>
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
            <Route path="accounting" element={
                <div className="h-full flex flex-col">
                    <div className="flex gap-2 border-b dark:border-gray-700 pb-2 mb-6 overflow-x-auto">
                        {[{id:'overview',l:'Diário',i:PieChart},{id:'coa',l:'Plano de Contas',i:BookOpen},{id:'invoices',l:'Faturas',i:FileText},{id:'purchases',l:'Compras',i:TrendingDown},{id:'banking',l:'Bancos',i:Landmark},{id:'clients',l:'Clientes',i:Briefcase},{id:'suppliers',l:'Fornecedores',i:Truck},{id:'assets',l:'Ativos',i:Box},{id:'taxes',l:'Impostos',i:FileCheck},{id:'reports',l:'Relatórios',i:FileSpreadsheet}].map(t=>(<button key={t.id} onClick={()=>logic.setAccountingTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border ${logic.accountingTab===t.id?'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800':'bg-white dark:bg-gray-800 border-transparent'}`}><t.i size={16}/>{t.l}</button>))}
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
                        {logic.accountingTab === 'overview' && (
                            <div className="p-4">
                                <div className="flex justify-between mb-4"><h3 className="font-bold flex gap-2"><BookOpen/> Diário Geral (Lançamentos)</h3><button onClick={()=>logic.setShowTransactionModal(true)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm"><Plus size={16}/></button></div>
                                <div className="overflow-x-auto border rounded-xl shadow-sm">
                                    <table className="w-full text-xs text-left border-collapse">
                                        <thead className="bg-gray-100 dark:bg-gray-700 uppercase font-bold text-gray-600">
                                            <tr>
                                                <th className="p-3 border-b dark:border-gray-600">Data</th>
                                                <th className="p-3 border-b dark:border-gray-600">Doc</th>
                                                <th className="p-3 border-b dark:border-gray-600">Conta</th>
                                                <th className="p-3 border-b dark:border-gray-600">Descrição</th>
                                                <th className="p-3 border-b dark:border-gray-600 text-right">Débito</th>
                                                <th className="p-3 border-b dark:border-gray-600 text-right">Crédito</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logic.journalEntries.length === 0 ? (
                                                <tr><td colSpan={6} className="p-8 text-center text-gray-400">Sem movimentos registados.</td></tr>
                                            ) : (
                                                logic.journalEntries.map(entry => (
                                                    entry.journal_items?.map((item: any, i: number) => (
                                                        <tr key={`${entry.id}-${i}`} className="border-b last:border-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                            <td className="p-2 w-24 text-gray-500 font-mono">{i === 0 ? new Date(entry.date).toLocaleDateString() : ''}</td>
                                                            <td className="p-2 w-24 font-bold text-blue-600">{i === 0 ? (entry.document_ref || 'MANUAL') : ''}</td>
                                                            <td className="p-2 w-20 font-mono font-bold">{item.company_accounts?.code}</td>
                                                            <td className="p-2 text-gray-700 dark:text-gray-300">{i === 0 ? entry.description : <span className="text-gray-400 ml-4">↳ {item.company_accounts?.name}</span>}</td>
                                                            <td className="p-2 text-right w-24 font-mono">{item.debit > 0 ? logic.displaySymbol + item.debit.toFixed(2) : ''}</td>
                                                            <td className="p-2 text-right w-24 font-mono text-gray-600">{item.credit > 0 ? logic.displaySymbol + item.credit.toFixed(2) : ''}</td>
                                                        </tr>
                                                    ))
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {logic.accountingTab === 'coa' && (
                            <div className="p-4">
                                <h3 className="font-bold flex gap-2 mb-4"><List/> Plano de Contas ({logic.companyForm.country})</h3>
                                <div className="overflow-y-auto max-h-[60vh]">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="p-3">Conta</th><th className="p-3">Descrição</th><th className="p-3">Tipo</th></tr></thead>
                                        <tbody>
                                            {logic.companyAccounts.map(acc => (
                                                <tr key={acc.id} className="border-b dark:border-gray-700 hover:bg-gray-50">
                                                    <td className="p-3 font-mono font-bold text-blue-600">{acc.code}</td>
                                                    <td className="p-3">{acc.name}</td>
                                                    <td className="p-3 uppercase text-[10px]"><span className="bg-gray-100 px-2 py-1 rounded">{acc.type}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {logic.companyAccounts.length === 0 && <p className="text-center py-8 text-gray-400">Vá a Definições e guarde o país para gerar o plano.</p>}
                                </div>
                            </div>
                        )}
                        {logic.accountingTab === 'invoices' && (
                            <div>
                                {!logic.showInvoiceForm ? (
                                    <>
                                        <div className="p-4 flex justify-between bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700"><h3 className="font-bold flex gap-2"><FileText/> Faturas Emitidas</h3><button onClick={()=>{logic.resetInvoiceForm();logic.setShowInvoiceForm(true)}} className="bg-blue-600 text-white px-3 py-1.5 rounded flex gap-2 items-center text-sm font-bold"><Plus size={16}/> Nova Fatura</button></div>
                                        <table className="w-full text-xs text-left"><thead className="bg-gray-100 dark:bg-gray-700 uppercase"><tr><th className="p-3">Nº</th><th className="p-3">Cliente</th><th className="p-3">Data</th><th className="p-3 text-right">Total</th><th className="p-3 text-center">Rappel</th><th className="p-3 text-right">...</th></tr></thead>
                                        <tbody>{logic.realInvoices.map(i=>(
                                            <tr key={i.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="p-3 font-mono text-blue-600">{i.invoice_number}</td>
                                                <td className="p-3">{i.clients?.name}</td>
                                                <td className="p-3">{new Date(i.date).toLocaleDateString()}</td>
                                                <td className="p-3 text-right font-bold">{logic.displaySymbol} {i.total}</td>
                                                <td className="p-3 text-center flex justify-center gap-1">
                                                    <button onClick={() => logic.handleGenerateReminder(i, 1)} className="w-6 h-6 bg-blue-100 text-blue-600 rounded text-[10px] font-bold hover:bg-blue-200">1</button>
                                                    <button onClick={() => logic.handleGenerateReminder(i, 2)} className="w-6 h-6 bg-orange-100 text-orange-600 rounded text-[10px] font-bold hover:bg-orange-200">2</button>
                                                    <button onClick={() => logic.handleGenerateReminder(i, 3)} className="w-6 h-6 bg-red-100 text-red-600 rounded text-[10px] font-bold hover:bg-red-200">3</button>
                                                </td>
                                                <td className="p-3 text-right"><button onClick={()=>logic.handleQuickPreview(i)} className="mr-2 text-gray-500 hover:text-blue-600"><Eye size={14}/></button><button onClick={()=>logic.handleDeleteInvoice(i.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button></td>
                                            </tr>
                                        ))}</tbody></table>
                                    </>
                                ) : (
                                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl shadow-2xl border dark:border-gray-700 h-[90vh] flex flex-col">
                                            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900 rounded-t-2xl">
                                                <h3 className="font-bold text-xl flex gap-2 items-center"><FileText className="text-blue-600"/> Editor de Fatura</h3>
                                                <button onClick={()=>logic.setShowInvoiceForm(false)} className="hover:bg-gray-200 p-2 rounded-full"><X/></button>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-8">
                                                <div className="grid grid-cols-3 gap-6 mb-6">
                                                    <div><label className="text-xs font-bold block mb-2 uppercase text-gray-500">Cliente</label><select className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" value={logic.invoiceData.client_id} onChange={e=>logic.setInvoiceData({...logic.invoiceData,client_id:e.target.value})}><option value="">Selecione...</option>{logic.clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                                                    <div><label className="text-xs font-bold block mb-2 uppercase text-gray-500">Tipo Doc.</label><select className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" value={logic.invoiceData.type} onChange={e=>logic.setInvoiceData({...logic.invoiceData,type:e.target.value})}>{invoiceTypes.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
                                                    <div><label className="text-xs font-bold block mb-2 uppercase text-gray-500">Data</label><input type="date" className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" value={logic.invoiceData.date} onChange={e=>logic.setInvoiceData({...logic.invoiceData,date:e.target.value})}/></div>
                                                </div>
                                                <table className="w-full text-sm mb-6 border-collapse">
                                                    <thead><tr className="bg-gray-100 dark:bg-gray-700 text-left">
                                                        <th className="p-3 rounded-l-lg">Descrição</th>
                                                        <th className="p-3 w-20 text-center">Qtd</th>
                                                        <th className="p-3 w-32 text-right">Preço</th>
                                                        <th className="p-3 w-24 text-right">IVA <button onClick={() => logic.setManualTaxMode(!logic.manualTaxMode)} className="ml-1 text-blue-500 hover:text-blue-700"><Edit2 size={12}/></button></th>
                                                        <th className="p-3 w-32 text-right rounded-r-lg">Total</th>
                                                        <th className="p-3 w-10"></th>
                                                    </tr></thead>
                                                    <tbody>
                                                        {logic.invoiceData.items.map((it,ix)=>(
                                                            <tr key={ix} className="border-b dark:border-gray-700 group">
                                                                <td className="p-3"><input className="w-full bg-transparent outline-none font-medium" placeholder="Item" value={it.description} onChange={e=>logic.updateInvoiceItem(ix,'description',e.target.value)}/></td>
                                                                <td className="p-3"><input type="number" className="w-full bg-transparent text-center outline-none" value={it.quantity} onChange={e=>logic.updateInvoiceItem(ix,'quantity',e.target.value)}/></td>
                                                                <td className="p-3"><input type="number" className="w-full bg-transparent text-right outline-none" value={it.price} onChange={e=>logic.updateInvoiceItem(ix,'price',e.target.value)}/></td>
                                                                <td className="p-3">
                                                                    {logic.manualTaxMode ? (
                                                                        <input type="number" className="w-full bg-transparent text-right outline-none border-b border-blue-300" value={it.tax} onChange={e=>logic.updateInvoiceItem(ix,'tax',e.target.value)} autoFocus/>
                                                                    ) : (
                                                                        <select className="w-full bg-transparent outline-none text-right appearance-none cursor-pointer" value={it.tax} onChange={e=>logic.updateInvoiceItem(ix,'tax',e.target.value)}>{logic.getCurrentCountryVatRates().map(r=><option key={r} value={r}>{r}%</option>)}</select>
                                                                    )}
                                                                </td>
                                                                <td className="p-3 text-right font-bold">{logic.displaySymbol} {(it.quantity*it.price).toFixed(2)}</td>
                                                                <td className="p-3 text-center"><button onClick={()=>logic.handleRemoveInvoiceItem(ix)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <button onClick={logic.handleAddInvoiceItem} className="text-blue-600 text-sm font-bold flex items-center gap-2 hover:underline"><Plus size={16}/> Adicionar Linha</button>
                                            </div>
                                            <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-2xl flex justify-end gap-3">
                                                <button onClick={()=>logic.setShowInvoiceForm(false)} className="px-6 py-3 border rounded-xl font-bold text-gray-500 hover:bg-white transition-colors">Cancelar</button>
                                                <button onClick={logic.handleSaveInvoice} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><CheckCircle size={20}/> Emitir Documento</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {logic.accountingTab === 'purchases' && (
                            <div>
                                {!logic.showPurchaseForm ? (
                                    <>
                                        <div className="p-4 flex justify-between bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700"><h3 className="font-bold flex gap-2"><TrendingDown/> Registo de Compras</h3><button onClick={()=>logic.setShowPurchaseForm(true)} className="bg-blue-600 text-white px-3 py-1.5 rounded flex gap-2 items-center text-sm font-bold"><Plus size={16}/> Lançar Compra</button></div>
                                        <table className="w-full text-xs text-left"><thead className="bg-gray-100 dark:bg-gray-700 uppercase"><tr><th className="p-3">Data</th><th className="p-3">Fornecedor</th><th className="p-3">Ref. Fatura</th><th className="p-3 text-right">Total</th></tr></thead>
                                        <tbody>{logic.purchases.map(p=>(<tr key={p.id} className="border-b dark:border-gray-700"><td className="p-3">{new Date(p.date).toLocaleDateString()}</td><td className="p-3">{p.suppliers?.name}</td><td className="p-3">{p.invoice_number}</td><td className="p-3 text-right font-bold text-red-500">{logic.displaySymbol} {p.total}</td></tr>))}</tbody></table>
                                    </>
                                ) : (
                                    <div className="p-6">
                                        <h3 className="font-bold mb-4 text-lg">Registar Fatura de Fornecedor</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div><label className="text-xs font-bold block uppercase text-gray-500 mb-1">Fornecedor</label><select className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" onChange={e=>logic.setNewPurchase({...logic.newPurchase,supplier_id:e.target.value})}><option>Selecione...</option>{logic.suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                                            <div><label className="text-xs font-bold block uppercase text-gray-500 mb-1">Total Com IVA</label><input type="number" className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" onChange={e=>logic.setNewPurchase({...logic.newPurchase,total:e.target.value})}/></div>
                                            <div><label className="text-xs font-bold block uppercase text-gray-500 mb-1">Nº Fatura</label><input className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" onChange={e=>logic.setNewPurchase({...logic.newPurchase,invoice_number:e.target.value})}/></div>
                                            <div><label className="text-xs font-bold block uppercase text-gray-500 mb-1">Valor do IVA</label><input type="number" className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" onChange={e=>logic.setNewPurchase({...logic.newPurchase,tax_total:e.target.value})}/></div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-6">
                                            <button onClick={()=>logic.setShowPurchaseForm(false)} className="px-4 py-2 border rounded-lg font-bold">Cancelar</button>
                                            <button onClick={logic.handleCreatePurchase} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">Gravar Despesa</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {logic.accountingTab === 'banking' && (
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div><h3 className="text-xl font-bold mb-1">Reconciliação Bancária Profissional</h3><p className="text-xs text-gray-500">Saldo Contabilístico: <span className="font-bold text-blue-600">{logic.displaySymbol} {logic.currentBalance.toFixed(2)}</span></p></div>
                                    <div className="flex gap-2"><label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all"><UploadCloud size={16}/> {logic.isUploadingCSV ? 'A processar...' : 'Importar Extrato CSV'}<input type="file" accept=".csv" onChange={logic.handleCSVUpload} className="hidden" /></label></div>
                                </div>
                                {logic.bankStatement.length > 0 ? (
                                    <div className="border rounded-2xl overflow-hidden shadow-sm">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-gray-50 dark:bg-gray-900 uppercase font-bold text-gray-600 border-b"><tr><th className="p-4">Data</th><th className="p-4">Descrição Bancária</th><th className="p-4 text-right">Valor</th><th className="p-4 text-center">Auto-Match</th><th className="p-4 text-center">Estado</th></tr></thead>
                                            <tbody>
                                                {logic.bankStatement.map((line, idx) => (
                                                    <tr key={idx} className="border-b dark:border-gray-700 hover:bg-gray-50 transition-colors">
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
                        {logic.accountingTab === 'reports' && (
                            <div className="p-6 text-center">
                                <h3 className="font-bold text-lg mb-6 text-gray-700 dark:text-white">Relatórios Financeiros Oficiais</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                    <button onClick={() => logic.generateFinancialReport('balancete')} className="p-8 border rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-700 flex flex-col items-center gap-4 transition-all hover:scale-105 shadow-sm group">
                                        <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-200"><List size={32} className="text-blue-600"/></div>
                                        <div><h4 className="font-bold text-xl text-gray-800 dark:text-white">Balancete</h4><p className="text-sm text-gray-500">Resumo de todas as contas e verificação de equilíbrio.</p></div>
                                    </button>
                                    <button onClick={() => logic.generateFinancialReport('dre')} className="p-8 border rounded-2xl hover:bg-green-50 dark:hover:bg-green-900/20 border-gray-200 dark:border-gray-700 flex flex-col items-center gap-4 transition-all hover:scale-105 shadow-sm group">
                                        <div className="bg-green-100 p-4 rounded-full group-hover:bg-green-200"><TrendingUpIcon size={32} className="text-green-600"/></div>
                                        <div><h4 className="font-bold text-xl text-gray-800 dark:text-white">Demonstração de Resultados</h4><p className="text-sm text-gray-500">Análise de Proveitos (Vendas) vs Custos.</p></div>
                                    </button>
                                </div>
                                {logic.journalEntries.length === 0 && <p className="mt-8 text-sm text-red-400 bg-red-50 p-2 rounded inline-block">⚠️ Gere movimentos (Faturas/Despesas) para desbloquear os relatórios.</p>}
                            </div>
                        )}
                        {logic.accountingTab === 'suppliers' && (
                            <div>
                                <div className="p-4 flex justify-between bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700"><h3 className="font-bold flex gap-2"><Truck/> Fornecedores</h3><button onClick={()=>{logic.setEditingEntityId(null);logic.setNewEntity({name:'',nif:'',email:'',address:'',city:'',postal_code:'',country:'Portugal'});logic.setEntityType('supplier');logic.setShowEntityModal(true)}} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-bold flex gap-2"><Plus size={16}/> Novo</button></div>
                                <table className="w-full text-xs text-left"><thead className="bg-gray-100 dark:bg-gray-700 uppercase"><tr><th className="p-3">Nome</th><th className="p-3">NIF</th><th className="p-3">Email</th><th className="p-3">Categoria</th><th className="p-3 text-right">Ações</th></tr></thead>
                                <tbody>{logic.suppliers.map(s=>(<tr key={s.id} className="border-b dark:border-gray-700"><td className="p-3 font-bold">{s.name}</td><td className="p-3 font-mono">{s.nif}</td><td className="p-3">{s.email}</td><td className="p-3"><span className="bg-gray-100 px-2 py-1 rounded text-[10px] uppercase font-bold">Geral</span></td><td className="p-3 text-right flex justify-end gap-2"><button onClick={()=>logic.handleEditEntity(s,'supplier')} className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Edit2 size={14}/></button><button onClick={()=>logic.handleDeleteEntity(s.id, 'supplier')} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14}/></button></td></tr>))}</tbody></table>
                            </div>
                        )}
                        {logic.accountingTab === 'clients' && (
                            <div>
                                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800"><h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2"><Users size={18}/> Gestão de Clientes</h3><button onClick={() => {logic.setEditingEntityId(null); logic.setNewEntity({ name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' }); logic.setEntityType('client'); logic.setShowEntityModal(true)}} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex gap-2 items-center hover:bg-blue-700"><Plus size={16}/> Novo Cliente</button></div>
                                <table className="w-full text-xs text-left"><thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase font-bold"><tr><th className="px-6 py-3">Entidade</th><th className="px-6 py-3">NIF</th><th className="px-6 py-3">Localidade</th><th className="px-6 py-3 text-center">Estado</th><th className="px-6 py-3 text-right">Saldo Corrente</th><th className="px-6 py-3 text-right">Ações</th></tr></thead>
                                <tbody className="divide-y dark:divide-gray-700">{logic.clients.map(c => (<tr key={c.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${c.status === 'doubtful' ? 'bg-red-50 dark:bg-red-900/10' : ''}`}><td className="px-6 py-3 font-bold text-gray-700 dark:text-gray-200">{c.name}</td><td className="px-6 py-3 font-mono">{c.nif || 'N/A'}</td><td className="px-6 py-3 text-gray-500">{c.city}</td><td className="px-6 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.status === 'doubtful' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{c.status === 'doubtful' ? 'Risco' : 'Ativo'}</span></td><td className={`px-6 py-3 text-right font-mono font-bold ${c.status === 'doubtful' ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>{c.doubtful_debt ? `${logic.displaySymbol} ${c.doubtful_debt}` : '-'}</td><td className="px-6 py-3 text-right flex justify-end gap-2"><button onClick={() => logic.handleOpenDoubtful(c)} className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${c.status === 'doubtful' ? 'text-red-500' : 'text-gray-400'}`}><AlertTriangle size={14}/></button><button onClick={() => logic.handleEditEntity(c, 'client')} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Edit2 size={14}/></button><button onClick={() => logic.handleDeleteEntity(c.id, 'client')} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14}/></button></td></tr>))}</tbody></table>
                            </div>
                        )}
                        {logic.accountingTab === 'assets' && (
                            <div>
                                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800"><h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2"><Box size={18}/> Mapa de Imobilizado</h3><button onClick={() => {logic.setEditingAssetId(null); logic.setNewAsset({ name: '', category: 'Equipamento', purchase_date: new Date().toISOString().split('T')[0], purchase_value: '', lifespan_years: 3, amortization_method: 'linear' }); logic.setShowAssetModal(true)}} className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-bold flex gap-2 items-center hover:bg-blue-700"><Plus size={16}/> Novo Ativo</button></div>
                                <table className="w-full text-xs text-left"><thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase font-bold"><tr><th className="px-6 py-3">Ativo</th><th className="px-6 py-3">Data Aq.</th><th className="px-6 py-3 text-right">Valor Aq.</th><th className="px-6 py-3 text-right">Amort. Acumulada</th><th className="px-6 py-3 text-right">Valor Líquido (VNC)</th><th className="px-6 py-3 text-center">Método</th><th className="px-6 py-3 text-center">...</th></tr></thead>
                                <tbody className="divide-y dark:divide-gray-700">{logic.assets.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">Nenhum ativo registado.</td></tr> : logic.assets.map(a => { const currentVal = logic.getCurrentAssetValue(a); const accumulated = a.purchase_value - currentVal; return (<tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700"><td className="px-6 py-3 font-bold text-gray-700 dark:text-gray-200">{a.name}</td><td className="px-6 py-3 font-mono text-gray-500">{new Date(a.purchase_date).toLocaleDateString()}</td><td className="px-6 py-3 text-right font-mono">{logic.displaySymbol} {(a.purchase_value * logic.conversionRate).toFixed(2)}</td><td className="px-6 py-3 text-right font-mono text-gray-500">{logic.displaySymbol} {(accumulated * logic.conversionRate).toFixed(2)}</td><td className="px-6 py-3 text-right font-mono font-bold text-blue-600">{logic.displaySymbol} {(currentVal * logic.conversionRate).toFixed(2)}</td><td className="px-6 py-3 text-center"><span className="bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase">{a.amortization_method === 'linear' ? 'Linear' : 'Degress.'}</span></td><td className="px-6 py-3 text-center flex justify-center gap-2"><button onClick={() => logic.handleShowAmortSchedule(a)} className="text-blue-500 hover:text-blue-700" title="Ver Plano"><List size={14}/></button><button onClick={() => logic.handleDeleteAsset(a.id)} className="text-red-400 hover:text-red-600" title="Abater"><Trash2 size={14}/></button></td></tr>); })}</tbody></table>
                            </div>
                        )}
                    </div>
                </div>
            } />
            <Route path="settings" element={
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
                        <h2 className="text-xl font-bold mb-6 flex gap-2"><Settings/> Definições Globais</h2>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div><label className="block text-xs font-bold mb-1">País</label><select value={logic.companyForm.country} onChange={logic.handleCountryChange} className="w-full p-3 border rounded-xl dark:bg-gray-900">{countries.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                            <div><label className="block text-xs font-bold mb-1">Moeda</label><input value={logic.companyForm.currency} className="w-full p-3 border rounded-xl dark:bg-gray-900 bg-gray-100" disabled/></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
                        <h2 className="text-xl font-bold mb-6 flex gap-2"><Palette/> Personalização Documentos</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div><label className="block text-xs font-bold mb-1">Cor da Marca (Hex)</label><div className="flex gap-2"><input type="color" value={logic.companyForm.invoice_color} onChange={e=>logic.setCompanyForm({...logic.companyForm,invoice_color:e.target.value})} className="h-10 w-10 cursor-pointer"/><input value={logic.companyForm.invoice_color} onChange={e=>logic.setCompanyForm({...logic.companyForm,invoice_color:e.target.value})} className="flex-1 p-2 border rounded-xl dark:bg-gray-900"/></div></div>
                            <div><label className="block text-xs font-bold mb-1">Texto Cabeçalho (Opcional)</label><input placeholder="Ex: Capital Social 5000€" value={logic.companyForm.header_text} onChange={e=>logic.setCompanyForm({...logic.companyForm,header_text:e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/></div>
                            <div className="col-span-2"><label className="block text-xs font-bold mb-1">Texto Rodapé</label><input placeholder="Ex: Processado por Computador" value={logic.companyForm.footer} onChange={e=>logic.setCompanyForm({...logic.companyForm,footer:e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/></div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold mb-1">Logo</label><input type="file" onChange={logic.handleLogoUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>{logic.uploadingLogo && <p className="text-xs text-blue-500 mt-1">A carregar...</p>}</div>
                            <div><label className="block text-xs font-bold mb-1">Template de Fatura (Imagem A4/PDF)</label><input type="file" onChange={logic.handleTemplateUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"/>{logic.uploadingTemplate && <p className="text-xs text-purple-500 mt-1">A carregar...</p>}</div>
                        </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-8">
                        <h2 className="text-xl font-bold mb-4 flex gap-2 text-red-700 dark:text-red-400"><AlertOctagon/> Zona de Perigo</h2>
                        <p className="text-sm text-red-600 dark:text-red-300 mb-4">Se deseja reiniciar a sua contabilidade para começar do zero, use este botão. Isto apagará todas as faturas e movimentos.</p>
                        <button onClick={logic.handleResetFinancials} className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700">Reiniciar Dados Financeiros</button>
                    </div>
                    <div className="flex justify-end pt-4"><button onClick={logic.handleSaveCompany} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Guardar & Inicializar</button></div>
                </div>
            } />
            <Route path="chat" element={<div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden"><div ref={logic.scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">{logic.messages.map((msg, i) => (<div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'}`}>{msg.content}</div></div>))}{logic.isChatLoading && <div className="text-xs text-gray-400 ml-4 animate-pulse">A analisar...</div>}</div><div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900"><form onSubmit={logic.handleSendChatMessage} className="flex gap-2 relative"><input type="text" value={logic.chatInput} onChange={(e) => logic.setChatInput(e.target.value)} placeholder="Pergunte ao assistente EasyCheck..." className="flex-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"/><button type="submit" disabled={logic.isChatLoading || !logic.chatInput.trim()} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow-md disabled:opacity-50"><Send size={18} /></button></form></div></div>} />
            <Route path="company" element={isOwner ? (<div className="max-w-4xl mx-auto space-y-6"><div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6 flex flex-col md:flex-row items-center justify-between gap-6"><div><h4 className="font-bold text-blue-900 dark:text-white mb-1">{t('settings.invite_code')}</h4><p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.invite_text')}</p></div><div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700"><code className="px-2 font-mono text-lg font-bold text-gray-700 dark:text-gray-300">{logic.showPageCode ? logic.profileData?.company_code : '••••••••'}</code><button onClick={() => logic.setShowPageCode(!logic.showPageCode)} className="p-2 text-gray-400 hover:text-blue-600">{logic.showPageCode ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button><button onClick={logic.copyCode} className="p-2 text-gray-400 hover:text-blue-600"><Copy className="w-4 h-4"/></button></div></div><div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8"><h3 className="text-lg font-bold mb-4 flex gap-2 items-center"><Users className="text-blue-600"/> {t('settings.team_members')}</h3><div className="text-center py-12 border-2 border-dashed rounded-xl text-gray-500">{t('settings.no_members')}</div></div></div>) : <div className="text-center py-12"><Shield className="w-16 h-16 mx-auto mb-4 text-gray-300"/><h3 className="text-xl font-bold dark:text-white">Acesso Restrito</h3></div>} />
            <Route path="*" element={<div className="flex justify-center py-10 text-gray-400">Em desenvolvimento...</div>} />
          </Routes>
        </div>
      </main>

      {/* --- MODAIS GLOBAIS --- */}
      {logic.showTransactionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl shadow-2xl border dark:border-gray-700 h-[80vh] flex flex-col">
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900 rounded-t-2xl">
                    <div><h3 className="font-bold text-xl flex gap-2 items-center"><BookOpen className="text-blue-600"/> Lançamento Contabilístico</h3><p className="text-xs text-gray-500">Registe movimentos complexos (Salários, Ajustes, RRR)</p></div>
                    <button onClick={()=>logic.setShowTransactionModal(false)} className="hover:bg-gray-200 p-2 rounded-full"><X/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="col-span-2"><label className="text-xs font-bold block mb-2 uppercase text-gray-500">Descrição do Movimento</label><input className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none font-medium" placeholder="Ex: Pagamento Salários Maio" value={logic.newTransaction.description} onChange={e => logic.setNewTransaction({...logic.newTransaction, description: e.target.value})} /></div>
                        <div><label className="text-xs font-bold block mb-2 uppercase text-gray-500">Data</label><input type="date" className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" value={logic.newTransaction.date} onChange={e => logic.setNewTransaction({...logic.newTransaction, date: e.target.value})} /></div>
                    </div>
                    <div className="border rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm"><thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase font-bold text-gray-600"><tr><th className="p-3 text-left">Conta</th><th className="p-3 text-right w-32">Débito</th><th className="p-3 text-right w-32">Crédito</th><th className="p-3 w-10"></th></tr></thead>
                        <tbody className="divide-y dark:divide-gray-600">
                            {logic.journalGrid.map((line, idx) => (
                                <tr key={idx} className="bg-white dark:bg-gray-800">
                                    <td className="p-2"><select className="w-full p-2 border rounded-lg dark:bg-gray-900 outline-none text-sm" value={line.account_id} onChange={e => logic.updateGridLine(idx, 'account_id', e.target.value)}><option value="">Selecione a conta...</option>{logic.companyAccounts.map(acc => (<option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>))}</select></td>
                                    <td className="p-2"><input type="number" className="w-full p-2 border rounded-lg text-right dark:bg-gray-900 outline-none" placeholder="0.00" value={line.debit || ''} onChange={e => logic.updateGridLine(idx, 'debit', parseFloat(e.target.value))}/></td>
                                    <td className="p-2"><input type="number" className="w-full p-2 border rounded-lg text-right dark:bg-gray-900 outline-none" placeholder="0.00" value={line.credit || ''} onChange={e => logic.updateGridLine(idx, 'credit', parseFloat(e.target.value))}/></td>
                                    <td className="p-2 text-center"><button onClick={() => logic.removeGridLine(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 dark:bg-gray-900 font-bold text-xs uppercase"><tr><td className="p-3 text-right">Totais:</td><td className={`p-3 text-right ${logic.isGridBalanced() ? 'text-green-600' : 'text-red-600'}`}>{logic.displaySymbol} {logic.getGridTotals().debit.toFixed(2)}</td><td className={`p-3 text-right ${logic.isGridBalanced() ? 'text-green-600' : 'text-red-600'}`}>{logic.displaySymbol} {logic.getGridTotals().credit.toFixed(2)}</td><td></td></tr></tfoot>
                        </table>
                    </div>
                    <button onClick={logic.addGridLine} className="mt-2 text-blue-600 font-bold text-sm flex items-center gap-2 hover:underline"><Plus size={16}/> Adicionar Linha</button>
                    {!logic.isGridBalanced() && (<div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2 border border-red-100 dark:border-red-800"><AlertOctagon size={16}/> O lançamento não está balanceado.</div>)}
                </div>
                <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-2xl flex justify-end gap-3"><button onClick={()=>logic.setShowTransactionModal(false)} className="px-6 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button><button onClick={logic.handleSaveJournalEntry} disabled={!logic.isGridBalanced()} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50"><CheckCircle size={20}/> Lançar no Diário</button></div>
            </div>
        </div>
      )}

      {logic.showAssetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl border dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 dark:text-white">{logic.editingAssetId ? 'Editar Ativo' : 'Novo Ativo'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Bem</label>
                        <input value={logic.newAsset.name} onChange={e => logic.setNewAsset({...logic.newAsset, name: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white" placeholder="Ex: MacBook Pro" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor de Compra</label>
                            <input type="number" value={logic.newAsset.purchase_value} onChange={e => logic.setNewAsset({...logic.newAsset, purchase_value: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data Compra</label>
                            <input type="date" value={logic.newAsset.purchase_date} onChange={e => logic.setNewAsset({...logic.newAsset, purchase_date: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white" />
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
                                <option value="linear">Linear (Quota Constante)</option>
                                <option value="degressive">Degressivo</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => logic.setShowAssetModal(false)} className="px-4 py-2 text-gray-500 font-bold">Cancelar</button>
                    <button onClick={logic.handleCreateAsset} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg">Gravar Ativo</button>
                </div>
            </div>
        </div>
      )}

      {logic.showEntityModal && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl border dark:border-gray-700"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex gap-2 items-center text-gray-700 dark:text-white">{logic.entityType === 'client' ? <Briefcase size={20} className="text-blue-500"/> : <Truck size={20} className="text-orange-500"/>} Novo {logic.entityType === 'client' ? 'Cliente' : 'Fornecedor'}</h3></div><div className="space-y-4"><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Nome / Empresa</label><input placeholder="Ex: Tech Solutions Lda" value={logic.newEntity.name} onChange={e => logic.setNewEntity({...logic.newEntity, name: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">NIF</label><input placeholder="999888777" value={logic.newEntity.nif} onChange={e => logic.setNewEntity({...logic.newEntity, nif: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Email</label><input placeholder="geral@cliente.com" value={logic.newEntity.email} onChange={e => logic.setNewEntity({...logic.newEntity, email: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Morada</label><input placeholder="Rua..." value={logic.newEntity.address} onChange={e => logic.setNewEntity({...logic.newEntity, address: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Cidade</label><input placeholder="Lisboa" value={logic.newEntity.city} onChange={e => logic.setNewEntity({...logic.newEntity, city: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">País</label><select value={logic.newEntity.country} onChange={e => logic.setNewEntity({...logic.newEntity, country: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none">{countries.map(c => <option key={c} value={c}>{c}</option>)}</select></div></div></div><div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700"><button onClick={() => logic.setShowEntityModal(false)} className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancelar</button><button onClick={logic.handleCreateEntity} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform active:scale-95">Criar Ficha</button></div></div></div>)}

      {logic.showPurchaseForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl border dark:border-gray-700">
                <h3 className="font-bold mb-4 text-lg">Registar Fatura de Fornecedor</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs font-bold block uppercase text-gray-500 mb-1">Fornecedor</label><select className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" onChange={e=>logic.setNewPurchase({...logic.newPurchase,supplier_id:e.target.value})}><option>Selecione...</option>{logic.suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                    <div><label className="text-xs font-bold block uppercase text-gray-500 mb-1">Total Com IVA</label><input type="number" className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" onChange={e=>logic.setNewPurchase({...logic.newPurchase,total:e.target.value})}/></div>
                    <div><label className="text-xs font-bold block uppercase text-gray-500 mb-1">Nº Fatura</label><input className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" onChange={e=>logic.setNewPurchase({...logic.newPurchase,invoice_number:e.target.value})}/></div>
                    <div><label className="text-xs font-bold block uppercase text-gray-500 mb-1">Valor do IVA</label><input type="number" className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" onChange={e=>logic.setNewPurchase({...logic.newPurchase,tax_total:e.target.value})}/></div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={()=>logic.setShowPurchaseForm(false)} className="px-4 py-2 border rounded-lg font-bold">Cancelar</button>
                    <button onClick={logic.handleCreatePurchase} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">Gravar Despesa</button>
                </div>
            </div>
        </div>
      )}

      {logic.showDoubtfulModal && logic.selectedClientForDebt && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl border dark:border-gray-700"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex gap-2 items-center text-red-600"><AlertTriangle size={20}/> Gerir Dívida Incobrável</h3></div><div className="space-y-4"><p className="text-sm text-gray-500">Ao marcar {logic.selectedClientForDebt.name} como de risco, deve definir o valor em provisão.</p><div className="flex gap-4 mb-4 bg-gray-100 p-1 rounded-lg"><button onClick={() => logic.setDebtMethod('manual')} className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${logic.debtMethod === 'manual' ? 'bg-white shadow text-red-700' : 'text-gray-500'}`}>Valor Manual</button><button onClick={() => logic.setDebtMethod('invoices')} className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${logic.debtMethod === 'invoices' ? 'bg-white shadow text-red-700' : 'text-gray-500'}`}>Selecionar Faturas</button></div>{logic.debtMethod === 'manual' ? (<div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Valor em Dívida ({logic.displaySymbol})</label><input type="number" value={logic.manualDebtAmount} onChange={e => logic.setManualDebtAmount(e.target.value)} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none font-bold text-red-600 text-xl"/></div>) : (<div className="max-h-60 overflow-y-auto border rounded-xl p-2 bg-gray-50">{logic.realInvoices.filter(i => i.client_id === logic.selectedClientForDebt.id).map(inv => (<div key={inv.id} className="flex items-center gap-3 p-3 hover:bg-white border-b last:border-0 cursor-pointer" onClick={() => { if(logic.selectedDebtInvoices.includes(inv.id)) logic.setSelectedDebtInvoices(logic.selectedDebtInvoices.filter(id => id !== inv.id)); else logic.setSelectedDebtInvoices([...logic.selectedDebtInvoices, inv.id]); }}><input type="checkbox" checked={logic.selectedDebtInvoices.includes(inv.id)} readOnly className="w-5 h-5 text-red-600 rounded" /><div className="flex-1"><p className="font-bold text-sm text-gray-700">{inv.invoice_number}</p><p className="text-xs text-gray-500">{new Date(inv.date).toLocaleDateString()}</p></div><span className="font-bold text-red-600">{logic.displaySymbol} {inv.total}</span></div>))}{logic.realInvoices.filter(i => i.client_id === logic.selectedClientForDebt.id).length === 0 && <p className="text-xs text-gray-400 text-center py-4">Sem faturas para este cliente.</p>}</div>)}</div><div className="flex justify-end gap-3 mt-6"><button onClick={() => logic.setShowDoubtfulModal(false)} className="px-4 py-2 text-gray-500">Cancelar</button><button onClick={logic.saveDoubtfulDebt} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-lg">Confirmar Risco</button></div></div></div>)}
      
      {logic.showProvisionModal && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-gray-700"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex gap-2 items-center text-gray-700 dark:white"><AlertOctagon size={20} className="text-yellow-500"/> Nova Provisão</h3></div><div className="space-y-4"><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Descrição do Risco</label><input placeholder="Ex: Processo Judicial em curso" value={logic.newProvision.description} onChange={e => logic.setNewProvision({...logic.newProvision, description: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Valor Estimado ({logic.displaySymbol})</label><input type="number" placeholder="0.00" value={logic.newProvision.amount} onChange={e => logic.setNewProvision({...logic.newProvision, amount: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Tipo</label><select value={logic.newProvision.type} onChange={e => logic.setNewProvision({...logic.newProvision, type: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"><option>Riscos e Encargos</option><option>Impostos</option><option>Garantias a Clientes</option><option>Processos Judiciais</option></select></div></div><div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700"><button onClick={() => logic.setShowProvisionModal(false)} className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancelar</button><button onClick={logic.handleCreateProvision} className="px-6 py-3 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-700 shadow-lg transition-transform active:scale-95">Constituir Provisão</button></div></div></div>)}
      
      {logic.showAmortSchedule && logic.selectedAssetForSchedule && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-4xl shadow-xl border dark:border-gray-700 max-h-[80vh] overflow-y-auto"><div className="flex justify-between items-center mb-6"><div><h3 className="text-xl font-bold flex gap-2 items-center"><TrendingUpIcon className="text-blue-500"/> Mapa de Amortização Financeira</h3><p className="text-sm text-gray-500 mt-1 uppercase font-bold">{logic.selectedAssetForSchedule.name}</p></div><button onClick={() => logic.setShowAmortSchedule(false)}><X className="text-gray-400 hover:text-red-500"/></button></div><table className="w-full text-xs text-left"><thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 uppercase text-xs font-bold border-b border-gray-200 dark:border-gray-600"><tr><th className="px-4 py-3">Ano</th><th className="px-4 py-3 text-right">V. Inicial</th><th className="px-4 py-3 text-right">Quota</th><th className="px-4 py-3 text-right">Acumulado</th><th className="px-4 py-3 text-right">V. Final (VNC)</th></tr></thead><tbody>{logic.calculateAmortizationSchedule(logic.selectedAssetForSchedule).map((row: any, i: number) => (<tr key={row.year} className={`border-b dark:border-gray-700 ${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}`}><td className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">{row.year}</td><td className="px-4 py-3 text-right text-gray-500 font-mono">{logic.displaySymbol} {row.startValue.toFixed(2)}</td><td className="px-4 py-3 text-right font-bold text-blue-600 font-mono">{logic.displaySymbol} {row.annuity.toFixed(2)}</td><td className="px-4 py-3 text-right text-gray-500 font-mono">{logic.displaySymbol} {row.accumulated.toFixed(2)}</td><td className="px-4 py-3 text-right font-bold text-gray-800 dark:text-white font-mono">{logic.displaySymbol} {row.endValue.toFixed(2)}</td></tr>))}</tbody></table></div></div>)}

      {logic.isProfileModalOpen && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl border dark:border-gray-700 max-h-[90vh] overflow-y-auto"><div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700"><h3 className="text-xl font-bold flex items-center gap-2"><User className="text-blue-600"/> {t('profile.edit_title')}</h3><button onClick={() => logic.setIsProfileModalOpen(false)}><X className="text-gray-400"/></button></div><div className="space-y-4"><div><label className="block text-sm mb-1">{t('form.email')}</label><input type="email" value={logic.editForm.email} disabled className="w-full p-3 border rounded-xl bg-gray-50 cursor-not-allowed"/></div><div><label className="block text-sm mb-1">{t('form.fullname')}</label><input type="text" value={logic.editForm.fullName} onChange={e => logic.setEditForm({...logic.editForm, fullName: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/></div><div><label className="block text-sm mb-1">{t('form.jobtitle')}</label><input type="text" value={logic.editForm.jobTitle} onChange={e => logic.setEditForm({...logic.editForm, jobTitle: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/></div></div><div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700"><button onClick={() => logic.setIsProfileModalOpen(false)} className="px-5 py-2.5 border rounded-xl">{t('common.cancel')}</button><button onClick={logic.handleSaveProfile} disabled={logic.savingProfile} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold">{logic.savingProfile ? 'Guardando...' : t('common.save')}</button></div></div></div>)}
      
      {logic.isDeleteModalOpen && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border dark:border-gray-700"><h3 className="text-xl font-bold text-red-600 mb-4 flex gap-2"><AlertTriangle/> {t('delete.title')}</h3><p className="text-gray-600 dark:text-gray-300 mb-4">{t('delete.text')}</p><input type="text" value={logic.deleteConfirmation} onChange={(e) => logic.setDeleteConfirmation(e.target.value)} className="w-full p-3 border rounded mb-4 uppercase dark:bg-gray-900"/><div className="flex justify-end gap-2"><button onClick={() => logic.setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded">{t('common.cancel')}</button><button onClick={logic.handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded">{t('common.delete')}</button></div></div></div>)}
    </div>
  );
}