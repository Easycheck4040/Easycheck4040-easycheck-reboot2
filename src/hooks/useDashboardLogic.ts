import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { askGrok } from '../services/aiService'; 

// ==========================================
// CONFIGURAÇÕES E DADOS ESTÁTICOS
// ==========================================

export const countries = ["Portugal", "Brasil", "France", "United Kingdom", "España", "United States", "Angola", "Moçambique"];
export const invoiceTypes = ["Fatura", "Fatura-Recibo", "Nota de Crédito", "Fatura Proforma"];

export const languages = [
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export const defaultRates: Record<string, number> = { 'EUR': 1, 'USD': 1.05, 'BRL': 6.15, 'AOA': 930 };
export const currencySymbols: Record<string, string> = { 'EUR': '€', 'USD': '$', 'BRL': 'R$', 'AOA': 'Kz' };

// --- INTERFACES ---
interface AIContext {
    intent: 'CREATE_INVOICE' | 'CREATE_CLIENT' | 'CREATE_ASSET' | null;
    step: 'GATHERING_DATA' | 'CONFIRMATION' | null;
    data: any;
}

// ==========================================
// CUSTOM HOOK PRINCIPAL
// ==========================================

export const useDashboardLogic = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    // --- ESTADOS DE UI ---
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [showFinancials, setShowFinancials] = useState(true);
    const [showPageCode, setShowPageCode] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [accountingTab, setAccountingTab] = useState('overview');

    // --- DADOS DA BASE DE DADOS ---
    const [userData, setUserData] = useState<any>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [journalEntries, setJournalEntries] = useState<any[]>([]);
    const [realInvoices, setRealInvoices] = useState<any[]>([]);
    const [purchases, setPurchases] = useState<any[]>([]);
    const [companyAccounts, setCompanyAccounts] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [provisions, setProvisions] = useState<any[]>([]);
    const [actionLogs, setActionLogs] = useState<any[]>([]);
    const [exchangeRates, setExchangeRates] = useState<any>(defaultRates);
    const [bankStatement, setBankStatement] = useState<any[]>([]);

    // --- CÉREBRO DA IA (CONTEXTO) ---
    const [aiContext, setAiContext] = useState<AIContext>({ intent: null, step: null, data: {} });
    const [messages, setMessages] = useState([{ role: 'assistant', content: 'Olá! Sou o Jarvis. Podes pedir para criar faturas, registar ativos ou analisar o saldo.' }]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // --- MODAIS ---
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showAssetModal, setShowAssetModal] = useState(false);
    const [showEntityModal, setShowEntityModal] = useState(false);
    const [showInvoiceForm, setShowInvoiceForm] = useState(false);
    const [showPurchaseForm, setShowPurchaseForm] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showProvisionModal, setShowProvisionModal] = useState(false);
    const [showDoubtfulModal, setShowDoubtfulModal] = useState(false);
    const [showAmortSchedule, setShowAmortSchedule] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // --- FORM STATES ---
    const [invoiceData, setInvoiceData] = useState<any>({
        id: '', client_id: '', type: 'Fatura', invoice_number: '',
        date: new Date().toISOString().split('T')[0],
        due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        exemption_reason: '', items: [{ description: '', quantity: 1, price: 0, tax: 23 }]
    });

    const [newAsset, setNewAsset] = useState({ 
        name: '', purchase_date: new Date().toISOString().split('T')[0], 
        purchase_value: '', lifespan_years: 3, amortization_method: 'linear' 
    });
    
    const [newEntity, setNewEntity] = useState({ 
        name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' 
    });

    const [newPurchase, setNewPurchase] = useState({ 
        supplier_id: '', invoice_number: '', date: new Date().toISOString().split('T')[0], 
        due_date: '', total: '', tax_total: '' 
    });

    const [newTransaction, setNewTransaction] = useState({ description: '', date: new Date().toISOString().split('T')[0] });
    const [newProvision, setNewProvision] = useState({ description: '', amount: '', type: 'Riscos e Encargos', date: new Date().toISOString().split('T')[0] });
    const [journalGrid, setJournalGrid] = useState<any[]>([{ account_id: '', debit: 0, credit: 0 }, { account_id: '', debit: 0, credit: 0 }]);

    const [editingEntityId, setEditingEntityId] = useState<string | null>(null);
    const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
    const [editingProvisionId, setEditingProvisionId] = useState<string | null>(null);
    const [entityType, setEntityType] = useState<'client' | 'supplier'>('client');
    
    const [companyForm, setCompanyForm] = useState<any>({});
    const [editForm, setEditForm] = useState({ fullName: '', jobTitle: '', email: '' });
    const [manualTaxMode, setManualTaxMode] = useState(false);
    const [isUploadingCSV, setIsUploadingCSV] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingTemplate, setUploadingTemplate] = useState(false);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);

    // Variáveis auxiliares
    const [selectedClientForDebt, setSelectedClientForDebt] = useState<any>(null);
    const [debtMethod, setDebtMethod] = useState<'manual' | 'invoices'>('manual');
    const [manualDebtAmount, setManualDebtAmount] = useState('');
    const [selectedDebtInvoices, setSelectedDebtInvoices] = useState<string[]>([]);
    const [selectedAssetForSchedule, setSelectedAssetForSchedule] = useState<any>(null);

    const displaySymbol = profileData?.currency === 'BRL' ? 'R$' : '€';
    const conversionRate = 1; // Simplificado

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    useEffect(() => {
        if (document.documentElement.classList.contains('dark')) setIsDark(true);
        loadData();
    }, []);

    useEffect(() => { 
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; 
    }, [messages]);

    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserData(user);
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (profile) {
                setProfileData(profile);
                setCompanyForm(profile);
                setEditForm({ fullName: profile.full_name, jobTitle: profile.job_title || '', email: user.email || '' });
            }
            
            const [acc, inv, pur, ast, cli, sup, prov, log] = await Promise.all([
                supabase.from('company_accounts').select('*').order('code'),
                supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false }),
                supabase.from('purchases').select('*, suppliers(name)').order('date', { ascending: false }),
                supabase.from('accounting_assets').select('*').order('created_at', { ascending: false }),
                supabase.from('clients').select('*'),
                supabase.from('suppliers').select('*'),
                supabase.from('accounting_provisions').select('*'),
                supabase.from('action_logs').select('*').order('created_at', { ascending: false }).limit(20)
            ]);

            if(acc.data) setCompanyAccounts(acc.data);
            if(inv.data) setRealInvoices(inv.data);
            if(pur.data) setPurchases(pur.data);
            if(ast.data) setAssets(ast.data);
            if(cli.data) setClients(cli.data);
            if(sup.data) setSuppliers(sup.data);
            if(prov.data) setProvisions(prov.data);
            if(log.data) setActionLogs(log.data);
        }
        setLoadingUser(false);
    };

    // ==========================================
    // 🧠 CÉREBRO IA (CORRIGIDO)
    // ==========================================

    const handleSendChatMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isChatLoading) return;

        const userMsg = chatInput;
        setChatInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsChatLoading(true);

        try {
            // Contexto rico para a IA saber o estado atual
            const contextPayload = {
                current_state: aiContext,
                available_clients: clients.map(c => ({ id: c.id, name: c.name })),
                user_intent_hint: "Analisa se o utilizador quer criar fatura, cliente ou ativo."
            };

            // CHAMADA CORRIGIDA: Passar string e objeto separadamente
            const response = await askGrok(userMsg, contextPayload); 
            
            // Assumimos que a resposta vem estruturada ou é texto que parseamos
            // Se o askGrok devolver texto puro, terias de fazer JSON.parse. 
            // Aqui assumo que o teu serviço já devolve o objeto processado.
            const aiData = response; 

            setMessages(prev => [...prev, { role: 'assistant', content: aiData.reply || "Processado." }]);

            // MÁQUINA DE ESTADOS - AÇÃO
            if (aiData.action === 'ask_info') {
                setAiContext(prev => ({
                    ...prev,
                    intent: aiData.intent || prev.intent,
                    data: { ...prev.data, ...aiData.extracted_data }
                }));
            } 
            else if (aiData.action === 'create_client') {
                setNewEntity({ 
                    name: aiData.data?.name || '', 
                    nif: aiData.data?.nif || '', 
                    email: aiData.data?.email || '', 
                    address: '', city: '', postal_code: '', country: 'Portugal' 
                });
                setEntityType('client');
                setShowEntityModal(true);
                setAiContext({ intent: null, step: null, data: {} });
            }
            else if (aiData.action === 'create_invoice') {
                if (aiData.data?.client_id) {
                    resetInvoiceForm();
                    setInvoiceData(prev => ({
                        ...prev,
                        client_id: aiData.data.client_id,
                        items: [{ description: aiData.data.description || 'Serviços', quantity: 1, price: aiData.data.amount || 0, tax: 23 }]
                    }));
                    setShowInvoiceForm(true);
                    setAccountingTab('invoices');
                    navigate('/dashboard/accounting');
                } else {
                     setMessages(prev => [...prev, { role: 'assistant', content: "Preciso de saber qual o cliente. Podes dizer o nome?" }]);
                }
                setAiContext({ intent: null, step: null, data: {} });
            }
            else if (aiData.action === 'create_asset') {
                setNewAsset(prev => ({ ...prev, name: aiData.data?.name || prev.name, purchase_value: aiData.data?.value || prev.purchase_value }));
                setAccountingTab('assets');
                setShowAssetModal(true);
                navigate('/dashboard/accounting');
            }

        } catch (error) {
            console.error("Erro IA:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Erro ao comunicar com o cérebro. Tenta novamente." }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    // ==========================================
    // FUNÇÕES DE AÇÃO (CRUD)
    // ==========================================

    const handleCreateAsset = async () => {
        if (!newAsset.name || !newAsset.purchase_value) return alert("Preencha Nome e Valor.");
        const payload = {
            user_id: userData.id,
            name: newAsset.name,
            purchase_date: newAsset.purchase_date,
            purchase_value: parseFloat(newAsset.purchase_value.toString()),
            lifespan_years: parseInt(newAsset.lifespan_years.toString()),
            amortization_method: newAsset.amortization_method
        };

        let error;
        if (editingAssetId) {
            const res = await supabase.from('accounting_assets').update(payload).eq('id', editingAssetId).select();
            error = res.error;
            if (res.data) setAssets(prev => prev.map(a => a.id === editingAssetId ? res.data[0] : a));
        } else {
            const res = await supabase.from('accounting_assets').insert([payload]).select();
            error = res.error;
            if (res.data) setAssets(prev => [res.data[0], ...prev]);
        }

        if (error) alert("Erro ao guardar ativo: " + error.message);
        else {
            setShowAssetModal(false);
            setEditingAssetId(null);
            setNewAsset({ name: '', purchase_date: new Date().toISOString().split('T')[0], purchase_value: '', lifespan_years: 3, amortization_method: 'linear' });
        }
    };

    const handleDeleteAsset = async (id: string) => {
        if(!window.confirm("Apagar ativo?")) return;
        const { error } = await supabase.from('accounting_assets').delete().eq('id', id);
        if (!error) setAssets(prev => prev.filter(a => a.id !== id));
    };

    const handleCreateEntity = async () => {
        if (!newEntity.name) return alert("Nome obrigatório");
        const table = entityType === 'client' ? 'clients' : 'suppliers';
        let error, data;
        
        const payload = { ...newEntity, user_id: userData.id };
        
        if (editingEntityId) {
            const res = await supabase.from(table).update(payload).eq('id', editingEntityId).select();
            error = res.error; data = res.data;
            if (data) {
                if (entityType === 'client') setClients(prev => prev.map(c => c.id === editingEntityId ? data[0] : c));
                else setSuppliers(prev => prev.map(s => s.id === editingEntityId ? data[0] : s));
            }
        } else {
            const res = await supabase.from(table).insert([payload]).select();
            error = res.error; data = res.data;
            if (data) {
                if (entityType === 'client') setClients([data[0], ...clients]);
                else setSuppliers([data[0], ...suppliers]);
            }
        }

        if (!error) {
            setShowEntityModal(false); setEditingEntityId(null);
            setNewEntity({ name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' });
        } else {
            alert("Erro: " + error.message);
        }
    };

    const handleCreatePurchase = async () => {
        if (!newPurchase.supplier_id || !newPurchase.total) return alert("Dados em falta.");
        const { data, error } = await supabase.from('purchases').insert([{ 
            user_id: userData.id, ...newPurchase, total: parseFloat(newPurchase.total), tax_total: parseFloat(newPurchase.tax_total || '0') 
        }]).select('*, suppliers(name)').single();
        
        if (!error && data) {
            setPurchases([data, ...purchases]);
            setShowPurchaseForm(false);
        } else alert("Erro ao criar compra.");
    };

    const handleSaveInvoice = async () => {
        // Lógica simplificada de gravação
        const totals = calculateInvoiceTotals();
        let docNum = invoiceData.invoice_number || `FT ${new Date().getFullYear()}/${realInvoices.length + 1}`;
        
        const { data, error } = await supabase.from('invoices').insert([{
            user_id: userData.id, client_id: invoiceData.client_id, type: invoiceData.type, invoice_number: docNum,
            date: invoiceData.date, due_date: invoiceData.due_date, total: totals.total, subtotal: totals.subtotal, 
            tax_total: totals.taxTotal, status: 'sent', currency: 'EUR'
        }]).select().single();

        if (!error && data) {
            setRealInvoices([data, ...realInvoices]);
            setShowInvoiceForm(false);
            alert("Fatura criada!");
        } else alert("Erro: " + error?.message);
    };

    // --- HELPERS ---
    const resetInvoiceForm = () => {
        setInvoiceData({
            id: '', client_id: '', type: 'Fatura', invoice_number: '',
            date: new Date().toISOString().split('T')[0],
            due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
            items: [{ description: '', quantity: 1, price: 0, tax: 23 }]
        });
    };

    const calculateInvoiceTotals = () => {
        let subtotal = 0, taxTotal = 0;
        invoiceData.items.forEach((item: any) => {
            const line = item.quantity * item.price;
            subtotal += line;
            taxTotal += line * (item.tax / 100);
        });
        return { subtotal, taxTotal, total: subtotal + taxTotal };
    };

    const getCurrentAssetValue = (asset: any) => {
        const yearsPassed = (new Date().getTime() - new Date(asset.purchase_date).getTime()) / (1000 * 60 * 60 * 24 * 365);
        const depreciation = (asset.purchase_value / asset.lifespan_years) * yearsPassed;
        const val = asset.purchase_value - depreciation;
        return val > 0 ? val : 0;
    };
    
    // Funções placeholder para o componente funcionar sem erros
    const logAction = (t: string, d: string) => console.log(t, d);
    const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };
    const getInitials = (n: string) => n ? n.substring(0,2).toUpperCase() : 'EC';
    const selectLanguage = (c: string) => i18n.changeLanguage(c);
    const toggleTheme = () => setIsDark(!isDark);
    const handleCountryChange = (e: any) => setCompanyForm({...companyForm, country: e.target.value});
    const handleAddInvoiceItem = () => setInvoiceData({...invoiceData, items: [...invoiceData.items, {description:'', quantity:1, price:0, tax:23}]});
    const handleRemoveInvoiceItem = (i: number) => { const it = [...invoiceData.items]; it.splice(i,1); setInvoiceData({...invoiceData, items: it}) };
    const updateInvoiceItem = (i:number, f:string, v:any) => { const it:any = [...invoiceData.items]; it[i][f] = v; setInvoiceData({...invoiceData, items: it}) };
    const handleQuickPreview = () => {}; 
    const handleDownloadPDF = () => {};
    const handleGenerateReminder = () => {};
    const generateFinancialReport = () => {};
    const handleResetFinancials = () => {};
    const handleSaveJournalEntry = () => {};
    const handleOpenDoubtful = (c:any) => { setSelectedClientForDebt(c); setShowDoubtfulModal(true); };
    const saveDoubtfulDebt = () => {};
    const handleCreateProvision = () => {};
    const handleSaveProfile = () => {};
    const handleSaveCompany = () => {};
    const copyCode = () => {};
    const handleCSVUpload = () => {};
    const handleLogoUpload = () => {};
    const handleTemplateUpload = () => {};
    const handleDeleteEntity = (id:string, type:string) => { /* Lógica delete */ };
    const handleEditEntity = (e:any, type: any) => { setEditingEntityId(e.id); setNewEntity(e); setEntityType(type); setShowEntityModal(true); };
    const handleEditInvoice = (i:any) => {};
    const handleDeleteInvoice = (id:string) => {};
    const handleDeleteAccount = () => {};
    const calculateAmortizationSchedule = (a:any) => [];
    const handleShowAmortSchedule = (a:any) => {};
    const addGridLine = () => {};
    const removeGridLine = (i:number) => {};
    const updateGridLine = (i:number, f:string, v:any) => {};
    const getGridTotals = () => ({debit:0, credit:0});
    const isGridBalanced = () => true;
    const getCurrentCountryVatRates = () => [23, 13, 6, 0];
    const getMonthlyFinancials = () => [];
    
    // Cálculos para o dashboard
    const chartData = getMonthlyFinancials();
    const totalRevenue = 0;
    const totalExpenses = 0;
    const currentBalance = 0;
    const totalInvoicesCount = realInvoices.length;

    return {
        isMobileMenuOpen, setIsMobileMenuOpen, isProfileDropdownOpen, setIsProfileDropdownOpen,
        isLangMenuOpen, setIsLangMenuOpen, showFinancials, setShowFinancials, isDark, setIsDark,
        showPageCode, setShowPageCode, loadingUser, accountingTab, setAccountingTab,
        
        userData, profileData, journalEntries, realInvoices, purchases, companyAccounts, 
        assets, clients, suppliers, provisions, actionLogs, exchangeRates, bankStatement,
        
        showTransactionModal, setShowTransactionModal, showAssetModal, setShowAssetModal,
        showEntityModal, setShowEntityModal, showInvoiceForm, setShowInvoiceForm,
        showPurchaseForm, setShowPurchaseForm, showPreviewModal, setShowPreviewModal,
        showProvisionModal, setShowProvisionModal, showDoubtfulModal, setShowDoubtfulModal,
        showAmortSchedule, setShowAmortSchedule, isProfileModalOpen, setIsProfileModalOpen,
        isDeleteModalOpen, setIsDeleteModalOpen,
        
        entityType, setEntityType, editingEntityId, setEditingEntityId,
        editingAssetId, setEditingAssetId, editingProvisionId, setEditingProvisionId,
        
        invoiceData, setInvoiceData, newAsset, setNewAsset, newEntity, setNewEntity,
        newPurchase, setNewPurchase, newTransaction, setNewTransaction, newProvision, setNewProvision,
        companyForm, setCompanyForm, editForm, setEditForm, journalGrid, setJournalGrid,
        
        manualTaxMode, setManualTaxMode, isUploadingCSV, uploadingLogo, uploadingTemplate,
        pdfPreviewUrl, deleteConfirmation, setDeleteConfirmation, savingProfile,
        
        messages, chatInput, setChatInput, isChatLoading, scrollRef,
        
        displaySymbol, conversionRate, chartData, totalRevenue, totalExpenses, currentBalance, totalInvoicesCount,
        
        handleSendChatMessage, handleCreateAsset, handleDeleteAsset, getCurrentAssetValue,
        handleCreateEntity, handleCreatePurchase, handleSaveInvoice,
        
        // Exports de compatibilidade
        logAction, handleLogout, getInitials, selectLanguage, toggleTheme, handleCountryChange,
        handleAddInvoiceItem, handleRemoveInvoiceItem, updateInvoiceItem, resetInvoiceForm,
        handleQuickPreview, handleDownloadPDF, handleGenerateReminder, generateFinancialReport,
        handleResetFinancials, handleSaveJournalEntry, handleOpenDoubtful, saveDoubtfulDebt,
        handleCreateProvision, handleSaveProfile, handleSaveCompany, copyCode, handleCSVUpload,
        handleLogoUpload, handleTemplateUpload, handleDeleteEntity, handleEditEntity,
        handleEditInvoice, handleDeleteInvoice, handleDeleteAccount, calculateAmortizationSchedule,
        handleShowAmortSchedule, addGridLine, removeGridLine, updateGridLine, getGridTotals,
        isGridBalanced, getCurrentCountryVatRates, selectedClientForDebt, debtMethod, setDebtMethod,
        manualDebtAmount, setManualDebtAmount, selectedDebtInvoices, setSelectedDebtInvoices,
        selectedAssetForSchedule
    };
};