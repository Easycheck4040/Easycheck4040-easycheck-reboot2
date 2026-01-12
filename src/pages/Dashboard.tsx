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
import { useDashboardLogic, countries, invoiceTypes, languages } from '../hooks/useDashboardLogic';

export default function Dashboard() {
  const { t } = useTranslation();
  const location = useLocation();
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
            <Link to="/" className="flex items-center gap-3"><img src="/logopequena.PNG" className="h-8 w-auto"/><span className="font-bold text-xl dark:text-white">EasyCheck</span></Link>
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

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between px-8 shadow-sm z-20 items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => logic.setIsMobileMenuOpen(!logic.isMobileMenuOpen)} className="md:hidden dark:text-white"><Menu /></button>
            <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                {logic.profileData?.country && <span className="text-2xl">{logic.profileData.country === 'Portugal' ? '🇵🇹' : logic.profileData.country === 'Brasil' ? '🇧🇷' : ''}</span>}
                {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={logic.toggleTheme} className="p-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{logic.isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8">
          <Routes>
            <Route path="/" element={<div>Visão Geral (Placeholder)</div>} />
            
            <Route path="accounting" element={
                <div className="h-full flex flex-col">
                    {/* TABS NAVEGAÇÃO */}
                    <div className="flex gap-2 border-b dark:border-gray-700 pb-2 mb-6 overflow-x-auto">
                        {[{id:'overview',l:'Diário',i:PieChart},{id:'assets',l:'Ativos (Fixed)',i:Box},{id:'invoices',l:'Faturas',i:FileText},{id:'clients',l:'Clientes',i:Briefcase}].map(t=>(
                            <button key={t.id} onClick={()=>logic.setAccountingTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border ${logic.accountingTab===t.id?'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300':'bg-white dark:bg-gray-800 border-transparent dark:text-gray-400'}`}>
                                <t.i size={16}/>{t.l}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
                        
                        {/* TAB ATIVOS (CORRIGIDA) */}
                        {logic.accountingTab === 'assets' && (
                            <div className="h-full flex flex-col">
                                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                                    <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2"><Box size={18}/> Mapa de Imobilizado</h3>
                                    <button onClick={() => {logic.setEditingAssetId(null); logic.setNewAsset({ name: '', purchase_date: new Date().toISOString().split('T')[0], purchase_value: '', lifespan_years: 3, amortization_method: 'linear' }); logic.setShowAssetModal(true)}} className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-bold flex gap-2 items-center hover:bg-blue-700"><Plus size={16}/> Novo Ativo</button>
                                </div>
                                <div className="overflow-auto flex-1">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase font-bold sticky top-0">
                                            <tr><th className="px-6 py-3">Ativo</th><th className="px-6 py-3">Data Aq.</th><th className="px-6 py-3 text-right">Valor Aq.</th><th className="px-6 py-3 text-right">Valor Atual</th><th className="px-6 py-3 text-center">Ações</th></tr>
                                        </thead>
                                        <tbody className="divide-y dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                                            {logic.assets.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Nenhum ativo.</td></tr> : logic.assets.map(a => (
                                                <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="px-6 py-3 font-bold">{a.name}</td>
                                                    <td className="px-6 py-3">{new Date(a.purchase_date).toLocaleDateString()}</td>
                                                    <td className="px-6 py-3 text-right">{logic.displaySymbol} {a.purchase_value}</td>
                                                    <td className="px-6 py-3 text-right font-bold text-blue-600 dark:text-blue-400">{logic.displaySymbol} {logic.getCurrentAssetValue(a).toFixed(2)}</td>
                                                    <td className="px-6 py-3 text-center"><button onClick={() => logic.handleDeleteAsset(a.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* OUTRAS TABS (Placeholders funcionais) */}
                        {logic.accountingTab === 'overview' && <div className="p-8 text-center text-gray-500 dark:text-gray-400">Selecione uma aba acima</div>}
                        {logic.accountingTab === 'invoices' && <div className="p-8 text-center text-gray-500 dark:text-gray-400">Lista de Faturas (Use o Chat para criar)</div>}
                        {logic.accountingTab === 'clients' && <div className="p-8 text-center text-gray-500 dark:text-gray-400">Gestão de Clientes</div>}
                    </div>
                </div>
            } />
            
            {/* CHAT UI */}
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
                        {logic.isChatLoading && <div className="text-xs text-gray-400 ml-4 animate-pulse">A pensar...</div>}
                    </div>
                    <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <form onSubmit={logic.handleSendChatMessage} className="flex gap-2 relative">
                            <input type="text" value={logic.chatInput} onChange={(e) => logic.setChatInput(e.target.value)} placeholder="Diz ao Jarvis o que fazer..." className="flex-1 bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"/>
                            <button type="submit" disabled={logic.isChatLoading || !logic.chatInput.trim()} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow-md disabled:opacity-50"><Send size={18} /></button>
                        </form>
                    </div>
                </div>
            } />
          </Routes>
        </div>
      </main>

      {/* --- MODAIS (Exemplo Ativos) --- */}
      {logic.showAssetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl border dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Novo Ativo</h3>
                <div className="space-y-4">
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome</label><input value={logic.newAsset.name} onChange={e => logic.setNewAsset({...logic.newAsset, name: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor</label><input type="number" value={logic.newAsset.purchase_value} onChange={e => logic.setNewAsset({...logic.newAsset, purchase_value: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white" /></div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => logic.setShowAssetModal(false)} className="px-4 py-2 text-gray-500 font-bold">Cancelar</button>
                    <button onClick={logic.handleCreateAsset} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg">Gravar</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}