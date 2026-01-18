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
// Certifica-te que o caminho '../hooks/useDashboardLogic' está correto para a tua estrutura de pastas
import { useDashboardLogic, countries, invoiceTypes, languages } from '../hooks/useDashboardLogic';

export default function Dashboard() {
  const { t } = useTranslation();
  const location = useLocation();
  
  // ---------------------------------------------------------
  // TODA A LÓGICA VEM DESTE HOOK
  // ---------------------------------------------------------
  const logic = useDashboardLogic();

  if (logic.loadingUser) return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      
      {/* ================= SIDEBAR (MANTIDA IGUAL) ================= */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transform transition-transform duration-300 ease-in-out shadow-xl
        ${logic.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
            {/* Logo Area */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        EasyCheck<span className="text-blue-600">.ERP</span>
                    </h1>
                    <p className="text-xs text-gray-500 font-medium">Business OS v2.0</p>
                </div>
                <button onClick={() => logic.setIsMobileMenuOpen(false)} className="md:hidden ml-auto">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Principal</p>
                
                <Link to="/dashboard" onClick={() => logic.setIsMobileMenuOpen(false)} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${location.pathname === '/dashboard' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'}`}>
                    <LayoutDashboard className="w-5 h-5" /> {t('menu.overview')}
                </Link>

                <Link to="/dashboard/accounting" onClick={() => logic.setIsMobileMenuOpen(false)} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${location.pathname.includes('accounting') ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'}`}>
                    <Landmark className="w-5 h-5" /> {t('menu.accounting')}
                </Link>

                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">Gestão</p>

                <Link to="/dashboard/settings" onClick={() => logic.setIsMobileMenuOpen(false)} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${location.pathname.includes('settings') ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'}`}>
                    <Settings className="w-5 h-5" /> {t('menu.settings')}
                </Link>
            </nav>

            {/* Footer Profile */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                        {logic.getInitials(logic.profileData?.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{logic.profileData?.full_name || 'Utilizador'}</p>
                        <p className="text-xs text-gray-500 truncate">{logic.userData?.email}</p>
                    </div>
                    <button onClick={logic.handleLogout} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Sair">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
            <button onClick={() => logic.setIsMobileMenuOpen(true)} className="md:hidden p-2 text-gray-600 dark:text-gray-300">
                <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
                 {/* Country Flag Indicator */}
                 <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300">
                    <Globe className="w-3 h-3" />
                    {logic.companyForm.country} ({logic.displaySymbol})
                </div>

                {/* Theme Toggle */}
                <button onClick={logic.toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                    {logic.isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Language Selector */}
                <div className="relative">
                    <button onClick={() => logic.setIsLangMenuOpen(!logic.isLangMenuOpen)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
                        <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    {logic.isLangMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                            {languages.map(lang => (
                                <button key={lang.code} onClick={() => logic.selectLanguage(lang.code)} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                                    <span>{lang.flag}</span> {lang.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <Routes>
                {/* 1. OVERVIEW DASHBOARD */}
                <Route path="/" element={
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-2">Olá, {logic.profileData?.full_name?.split(' ')[0]}! 👋</h2>
                                <p className="text-blue-100 text-lg opacity-90">Aqui está o resumo financeiro da {logic.companyForm.name}.</p>
                                
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="p-2 bg-green-400/20 rounded-lg"><TrendingUpIcon className="w-5 h-5 text-green-300"/></div>
                                            <span className="text-sm font-medium text-blue-100">Receitas (Ano)</span>
                                        </div>
                                        <div className="text-2xl font-bold">{logic.displaySymbol} {logic.totalRevenue.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="p-2 bg-red-400/20 rounded-lg"><TrendingDown className="w-5 h-5 text-red-300"/></div>
                                            <span className="text-sm font-medium text-blue-100">Despesas (Ano)</span>
                                        </div>
                                        <div className="text-2xl font-bold">{logic.displaySymbol} {logic.totalExpenses.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="p-2 bg-blue-400/20 rounded-lg"><Activity className="w-5 h-5 text-blue-300"/></div>
                                            <span className="text-sm font-medium text-blue-100">Saldo Atual</span>
                                        </div>
                                        <div className="text-2xl font-bold">{logic.displaySymbol} {logic.currentBalance.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* AI CHAT MODULE (ATUALIZADO) */}
                            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[500px]">
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-blue-500"/> Assistente IA
                                        </h3>
                                    </div>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Llama 3.3</span>
                                </div>
                                
                                <div ref={logic.scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
                                    {logic.messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                                msg.role === 'user' 
                                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-600 rounded-tl-none'
                                            }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {logic.isChatLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 border border-gray-100 dark:border-gray-600">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={logic.handleSendChatMessage} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
                                    <div className="flex gap-2">
                                        <input 
                                            value={logic.chatInput}
                                            onChange={(e) => logic.setChatInput(e.target.value)}
                                            placeholder="Ex: Criar fatura de 100€ para a Tesla..." 
                                            className="flex-1 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
                                        />
                                        <button type="submit" disabled={logic.isChatLoading} 
                                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors disabled:opacity-50">
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Main Chart */}
                            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h3 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-gray-500"/> Fluxo de Caixa
                                </h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={logic.chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={logic.isDark ? '#374151' : '#e5e7eb'} />
                                            <XAxis dataKey="name" stroke={logic.isDark ? '#9ca3af' : '#6b7280'} fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke={logic.isDark ? '#9ca3af' : '#6b7280'} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                                            <RechartsTooltip 
                                                cursor={{fill: logic.isDark ? '#374151' : '#f3f4f6'}}
                                                contentStyle={{ backgroundColor: logic.isDark ? '#1f2937' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Legend />
                                            <Bar name="Receitas" dataKey="receitas" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                                            <Bar name="Despesas" dataKey="despesas" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                } />

                {/* 2. ACCOUNTING MODULE */}
                <Route path="/accounting" element={
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col min-h-[80vh]">
                        {/* Accounting Tabs */}
                        <div className="border-b border-gray-200 dark:border-gray-700 p-2 overflow-x-auto">
                            <div className="flex space-x-1">
                                {[
                                    { id: 'overview', label: 'Visão Geral', icon: Activity },
                                    { id: 'invoices', label: 'Vendas', icon: FileText },
                                    { id: 'purchases', label: 'Compras', icon: Truck },
                                    { id: 'assets', label: 'Ativos', icon: Box }, // NOVA ABA ATIVOS
                                    { id: 'journal', label: 'Diário', icon: BookOpen },
                                    { id: 'clients', label: 'Entidades', icon: Users },
                                    { id: 'reports', label: 'Relatórios', icon: PieChart },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => logic.setAccountingTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap
                                            ${logic.accountingTab === tab.id 
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" /> {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Accounting Content */}
                        <div className="p-6 flex-1">
                            {/* --- NOVA ABA: ATIVOS --- */}
                            {logic.accountingTab === 'assets' && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Imobilizado</h3>
                                            <p className="text-sm text-gray-500">Gestão de ativos e depreciações.</p>
                                        </div>
                                        <button onClick={() => logic.setShowAssetModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                            <Plus className="w-4 h-4" /> Novo Ativo
                                        </button>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold border-b dark:border-gray-600">
                                                <tr>
                                                    <th className="px-6 py-3">Bem</th>
                                                    <th className="px-6 py-3">Compra</th>
                                                    <th className="px-6 py-3 text-right">Valor Aquis.</th>
                                                    <th className="px-6 py-3 text-center">Vida Útil</th>
                                                    <th className="px-6 py-3 text-center">Método</th>
                                                    <th className="px-6 py-3 text-right">Valor Atual</th>
                                                    <th className="px-6 py-3 text-center">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {logic.assets.map(asset => (
                                                    <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                        <td className="px-6 py-4 font-medium dark:text-white">{asset.name}</td>
                                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(asset.purchase_date).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 text-right font-mono dark:text-gray-300">{logic.displaySymbol} {asset.purchase_value.toFixed(2)}</td>
                                                        <td className="px-6 py-4 text-center dark:text-gray-300">{asset.lifespan_years} Anos</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900 dark:text-blue-200">
                                                                {asset.amortization_method === 'linear' ? 'Linear' : 'Degressivo'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-bold dark:text-white">
                                                            {logic.displaySymbol} {logic.getCurrentAssetValue(asset).toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 text-center flex justify-center gap-2">
                                                            <button onClick={() => logic.handleShowAmortSchedule(asset)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:hover:bg-gray-700" title="Ver Plano">
                                                                <FileSpreadsheet className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => logic.handleDeleteAsset(asset.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-gray-700" title="Apagar">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {logic.assets.length === 0 && (
                                                    <tr><td colSpan={7} className="p-8 text-center text-gray-500">Ainda não registou ativos.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* INVOICES TAB */}
                            {logic.accountingTab === 'invoices' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold dark:text-white">Faturas Emitidas</h3>
                                        <button onClick={() => logic.setShowInvoiceForm(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
                                            <Plus className="w-4 h-4"/> Criar Fatura
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
                                                <tr>
                                                    <th className="px-6 py-3">Documento</th>
                                                    <th className="px-6 py-3">Cliente</th>
                                                    <th className="px-6 py-3 text-right">Total</th>
                                                    <th className="px-6 py-3 text-center">Estado</th>
                                                    <th className="px-6 py-3 text-center">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                                {logic.realInvoices.map(inv => (
                                                    <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                        <td className="px-6 py-4 font-mono font-medium dark:text-white">{inv.invoice_number}</td>
                                                        <td className="px-6 py-4 dark:text-gray-300">{inv.clients?.name}</td>
                                                        <td className="px-6 py-4 text-right font-bold dark:text-white">{logic.displaySymbol} {inv.total.toFixed(2)}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                {inv.status === 'paid' ? 'PAGO' : 'PENDENTE'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 flex justify-center gap-2">
                                                            <button onClick={() => logic.handleQuickPreview(inv)} className="p-1.5 text-gray-500 hover:text-blue-600"><Eye className="w-4 h-4"/></button>
                                                            {inv.status !== 'paid' && (
                                                                <button onClick={() => logic.handlePayInvoice(inv)} className="p-1.5 text-gray-500 hover:text-green-600" title="Marcar como Pago"><CheckCircle className="w-4 h-4"/></button>
                                                            )}
                                                            <button onClick={() => logic.handleDeleteInvoice(inv.id)} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* JOURNAL TAB */}
                            {logic.accountingTab === 'journal' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold dark:text-white">Diário Contabilístico</h3>
                                        <button onClick={() => logic.setShowTransactionModal(true)} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900">
                                            <Plus className="w-4 h-4"/> Lançamento Manual
                                        </button>
                                    </div>
                                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                        {logic.journalEntries.map(entry => (
                                            <div key={entry.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                                                <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-2 flex justify-between items-center text-xs font-semibold text-gray-500 uppercase">
                                                    <span>{new Date(entry.date).toLocaleDateString()} • {entry.document_ref}</span>
                                                    <span>{entry.description}</span>
                                                </div>
                                                <table className="w-full text-sm">
                                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                        {entry.journal_items?.map((item: any, idx: number) => (
                                                            <tr key={idx}>
                                                                <td className="px-6 py-2 w-20 font-mono text-gray-400">{item.company_accounts?.code}</td>
                                                                <td className="px-6 py-2 text-gray-900 dark:text-gray-200">{item.company_accounts?.name}</td>
                                                                <td className="px-6 py-2 text-right w-32 font-mono text-gray-600 dark:text-gray-400">{item.debit > 0 ? logic.displaySymbol + item.debit.toFixed(2) : '-'}</td>
                                                                <td className="px-6 py-2 text-right w-32 font-mono text-gray-600 dark:text-gray-400">{item.credit > 0 ? logic.displaySymbol + item.credit.toFixed(2) : '-'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* REPORTS TAB */}
                            {logic.accountingTab === 'reports' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 cursor-pointer transition-all" onClick={() => logic.generateFinancialReport('balancete')}>
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit mb-4"><FileText className="w-6 h-6 text-blue-600"/></div>
                                        <h4 className="font-bold text-lg dark:text-white">Balancete</h4>
                                        <p className="text-gray-500 text-sm mt-2">Resumo de todas as contas do razão.</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 cursor-pointer transition-all" onClick={() => logic.generateFinancialReport('dre')}>
                                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg w-fit mb-4"><TrendingUpIcon className="w-6 h-6 text-green-600"/></div>
                                        <h4 className="font-bold text-lg dark:text-white">Demonstração Resultados</h4>
                                        <p className="text-gray-500 text-sm mt-2">Proveitos e Custos do exercício.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                } />

                {/* 3. SETTINGS MODULE */}
                <Route path="/settings" element={
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                            <h3 className="text-xl font-bold mb-6 dark:text-white">Configuração da Empresa</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Empresa</label>
                                    <input value={logic.companyForm.name} onChange={(e) => logic.setCompanyForm({...logic.companyForm, name: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">País Fiscal</label>
                                    <select value={logic.companyForm.country} onChange={logic.handleCountryChange} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 dark:text-white">
                                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <p className="text-xs text-yellow-600 mt-1">⚠️ Mudar o país reinicia o Plano de Contas.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Moeda Base</label>
                                    <input disabled value={logic.companyForm.currency} className="w-full p-3 border rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"/>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button onClick={logic.handleSaveCompany} disabled={logic.savingCompany} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50">
                                    {logic.savingCompany ? 'A configurar...' : 'Guardar Alterações'}
                                </button>
                            </div>
                        </div>
                        
                        {/* Danger Zone */}
                        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/30 p-8">
                            <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2"><AlertTriangle/> Zona de Perigo</h3>
                            <div className="flex gap-4">
                                <button onClick={logic.handleResetFinancials} className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium">Reset Financeiro Total</button>
                                <button onClick={() => logic.setIsDeleteModalOpen(true)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Eliminar Conta</button>
                            </div>
                        </div>
                    </div>
                } />
            </Routes>
        </main>
      </div>

      {/* ================= MODALS ================= */}
      
      {/* 1. ASSET MODAL (NOVO) */}
      {logic.showAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl border dark:border-gray-700">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between">
                    <h3 className="font-bold text-xl dark:text-white">Novo Ativo</h3>
                    <button onClick={() => logic.setShowAssetModal(false)}><X className="dark:text-white"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Designação do Bem</label>
                        <input value={logic.newAsset.name} onChange={e => logic.setNewAsset({...logic.newAsset, name: e.target.value})} className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: Macbook Pro M3"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Valor Aquisição</label>
                            <input type="number" value={logic.newAsset.purchase_value} onChange={e => logic.setNewAsset({...logic.newAsset, purchase_value: e.target.value})} className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Data Compra</label>
                            <input type="date" value={logic.newAsset.purchase_date} onChange={e => logic.setNewAsset({...logic.newAsset, purchase_date: e.target.value})} className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Vida Útil (Anos)</label>
                            <input type="number" value={logic.newAsset.lifespan_years} onChange={e => logic.setNewAsset({...logic.newAsset, lifespan_years: parseInt(e.target.value)})} className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Método</label>
                            <select value={logic.newAsset.amortization_method} onChange={e => logic.setNewAsset({...logic.newAsset, amortization_method: e.target.value})} className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="linear">Linear (Cota Constante)</option>
                                <option value="degressive">Degressivo</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                    <button onClick={() => logic.setShowAssetModal(false)} className="px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-gray-300">Cancelar</button>
                    <button onClick={logic.handleCreateAsset} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Registar Ativo</button>
                </div>
            </div>
        </div>
      )}

      {/* 2. INVOICE MODAL */}
      {logic.showInvoiceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h3 className="font-bold text-xl dark:text-white">Emitir Fatura</h3>
                    <button onClick={() => logic.setShowInvoiceForm(false)}><X className="dark:text-white"/></button>
                </div>
                <div className="p-6 grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-4">
                        <div className="flex gap-4">
                            <select value={logic.invoiceData.type} onChange={e => logic.setInvoiceData({...logic.invoiceData, type: e.target.value})} className="flex-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white font-bold">
                                {invoiceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <input type="date" value={logic.invoiceData.date} onChange={e => logic.setInvoiceData({...logic.invoiceData, date: e.target.value})} className="w-40 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                        </div>
                        <select value={logic.invoiceData.client_id} onChange={e => logic.setInvoiceData({...logic.invoiceData, client_id: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">Selecione o Cliente...</option>
                            {logic.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        
                        {/* Items */}
                        <div className="space-y-2 mt-6">
                            {logic.invoiceData.items.map((item, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <input placeholder="Descrição" value={item.description} onChange={e => logic.updateInvoiceItem(idx, 'description', e.target.value)} className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                                    <input type="number" placeholder="Qtd" value={item.quantity} onChange={e => logic.updateInvoiceItem(idx, 'quantity', e.target.value)} className="w-20 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                                    <input type="number" placeholder="Preço" value={item.price} onChange={e => logic.updateInvoiceItem(idx, 'price', e.target.value)} className="w-24 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                                    <button onClick={() => logic.handleRemoveInvoiceItem(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                                </div>
                            ))}
                            <button onClick={logic.handleAddInvoiceItem} className="text-sm text-blue-600 font-medium hover:underline">+ Adicionar Linha</button>
                        </div>
                    </div>
                    
                    {/* Totals Side */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl h-fit">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span>Subtotal:</span> <span className="font-bold">{logic.calculateInvoiceTotals().subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>IVA:</span> <span className="font-bold">{logic.calculateInvoiceTotals().taxTotal.toFixed(2)}</span></div>
                            <div className="border-t pt-3 flex justify-between text-xl font-bold text-blue-600 dark:text-blue-400">
                                <span>Total:</span> <span>{logic.displaySymbol} {logic.calculateInvoiceTotals().total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button onClick={logic.handleSaveInvoice} className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none">
                            Finalizar Documento
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 3. ENTITY MODAL (CLIENTS/SUPPLIERS) */}
      {logic.showEntityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6 border dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Novo {logic.entityType === 'client' ? 'Cliente' : 'Fornecedor'}</h3>
                <div className="space-y-3">
                    <input placeholder="Nome" value={logic.newEntity.name} onChange={e => logic.setNewEntity({...logic.newEntity, name: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    <input placeholder="NIF" value={logic.newEntity.nif} onChange={e => logic.setNewEntity({...logic.newEntity, nif: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    <input placeholder="Email" value={logic.newEntity.email} onChange={e => logic.setNewEntity({...logic.newEntity, email: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => logic.setShowEntityModal(false)} className="px-4 py-2 border rounded-lg dark:text-white dark:border-gray-600">Cancelar</button>
                    <button onClick={logic.handleCreateEntity} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Criar</button>
                </div>
            </div>
        </div>
      )}
      
      {/* 4. PREVIEW MODAL */}
      {logic.showPreviewModal && logic.pdfPreviewUrl && (
         <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl h-[85vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold">Pré-visualização</h3>
                    <div className="flex gap-2">
                        <button onClick={logic.handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"><Download className="w-4 h-4"/> Download</button>
                        <button onClick={() => logic.setShowPreviewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X/></button>
                    </div>
                </div>
                <iframe src={logic.pdfPreviewUrl} className="flex-1 w-full rounded-b-xl bg-gray-100"/>
            </div>
         </div>
      )}

    </div>
  );
}