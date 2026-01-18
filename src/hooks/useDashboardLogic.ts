import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { askGrok } from '../services/aiService'; 

// ==========================================
// DADOS ESTÁTICOS (FALLBACK)
// ==========================================
export const ACCOUNTING_TEMPLATES: Record<string, any[]> = {
    "Default": [
        { code: '1000', name: 'Caixa (Fallback)', type: 'ativo' },
        { code: '4000', name: 'Vendas (Fallback)', type: 'rendimentos' }
    ]
};

export const countries = [
    "Portugal", "Brasil", "Angola", "Moçambique", "Cabo Verde",
    "France", "Deutschland", "United Kingdom", "España", "United States",
    "Italia", "Belgique", "Suisse", "Luxembourg"
];

export const invoiceTypesMap: Record<string, string> = {
    "Fatura": "FT", "Fatura-Recibo": "FR", "Fatura Simplificada": "FS", 
    "Fatura Proforma": "FP", "Nota de Crédito": "NC", "Nota de Débito": "ND", 
    "Recibo": "RC", "Fatura Intracomunitária": "FI", 
    "Fatura Isenta / Autoliquidação": "FA"
};

export const invoiceTypes = Object.keys(invoiceTypesMap);

export const languages = [
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' }
];

export const defaultRates: Record<string, number> = {
    'EUR': 1, 'USD': 1.05, 'BRL': 6.15, 'AOA': 930, 'MZN': 69,
    'CVE': 110.27, 'CHF': 0.94, 'GBP': 0.83
};

export const countryCurrencyMap: Record<string, string> = {
    "Portugal": "EUR", "France": "EUR", "Deutschland": "EUR", "España": "EUR",
    "Italia": "EUR", "Belgique": "EUR", "Luxembourg": "EUR", "Brasil": "BRL",
    "United States": "USD", "United Kingdom": "GBP", "Angola": "AOA",
    "Moçambique": "MZN", "Cabo Verde": "CVE", "Suisse": "CHF"
};

export const currencySymbols: Record<string, string> = {
    'EUR': '€', 'USD': '$', 'BRL': 'R$', 'AOA': 'Kz', 'MZN': 'MT',
    'CVE': 'Esc', 'CHF': 'CHF', 'GBP': '£'
};

export const vatRatesByCountry: Record<string, number[]> = {
    "Portugal": [23, 13, 6, 0], "Luxembourg": [17, 14, 8, 3, 0], "Brasil": [17, 18, 12, 0],
    "Angola": [14, 7, 5, 0], "Moçambique": [16, 0], "Cabo Verde": [15, 0],
    "France": [20, 10, 5.5, 0], "Deutschland": [19, 7, 0], "España": [21, 10, 4, 0],
    "Italia": [22, 10, 5, 0], "Belgique": [21, 12, 6, 0], "Suisse": [8.1, 2.6, 0],
    "United Kingdom": [20, 5, 0], "United States": [0, 5, 10]
};

// --- INTERFACES ---
export interface InvoiceItem { 
    description: string; 
    quantity: number; 
    price: number; 
    tax: number; 
}

export interface InvoiceData { 
    id: string; 
    client_id: string; 
    type: string; 
    invoice_number?: string; 
    date: string; 
    due_date: string; 
    exemption_reason: string; 
    items: InvoiceItem[]; 
}

export interface AIMemoryState {
    intent: 'create_invoice' | 'create_client' | 'create_expense' | 'general_chat' | null;
    step: 'idle' | 'awaiting_client' | 'awaiting_amount' | 'awaiting_nif' | 'confirmation';
    data: any; 
}

export interface JournalGridLine { 
    account_id: string; 
    debit: number; 
    credit: number; 
}

export interface BankStatementLine { 
    date: string; 
    description: string; 
    amount: number; 
    matched_invoice_id?: string; 
    suggested_match?: string; 
}

// ==========================================
// CUSTOM HOOK PRINCIPAL
// ==========================================

export const useDashboardLogic = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    // ESTADOS UI
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [showFinancials, setShowFinancials] = useState(true);
    const [showPageCode, setShowPageCode] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [accountingTab, setAccountingTab] = useState('overview');

    // DADOS
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

    // MODAIS
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showAssetModal, setShowAssetModal] = useState(false);
    const [showEntityModal, setShowEntityModal] = useState(false);
    const [showInvoiceForm, setShowInvoiceForm] = useState(false);
    const [showPurchaseForm, setShowPurchaseForm] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showProvisionModal, setShowProvisionModal] = useState(false);
    const [showDoubtfulModal, setShowDoubtfulModal] = useState(false);
    const [showAmortSchedule, setShowAmortSchedule] = useState(false);

    // NAVIGATION FIX
    useEffect(() => {
        if (showInvoiceForm) {
            if (!location.pathname.includes('/accounting')) navigate('/dashboard/accounting');
            if (accountingTab !== 'invoices') setAccountingTab('invoices');
        }
    }, [showInvoiceForm, location.pathname, accountingTab, navigate]);

    useEffect(() => {
        if (showPurchaseForm) {
            if (!location.pathname.includes('/accounting')) navigate('/dashboard/accounting');
            if (accountingTab !== 'purchases') setAccountingTab('purchases');
        }
    }, [showPurchaseForm, location.pathname, accountingTab, navigate]);

    // FORM STATES
    const [bankStatement, setBankStatement] = useState<BankStatementLine[]>([]);
    const [isUploadingCSV, setIsUploadingCSV] = useState(false);
    const [manualTaxMode, setManualTaxMode] = useState(false);
    const [entityType, setEntityType] = useState<'client' | 'supplier'>('client');
    const [editingEntityId, setEditingEntityId] = useState<string | null>(null);
    const [editingProvisionId, setEditingProvisionId] = useState<string | null>(null);
    const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingTemplate, setUploadingTemplate] = useState(false);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [selectedClientForDebt, setSelectedClientForDebt] = useState<any>(null);
    const [debtMethod, setDebtMethod] = useState<'manual' | 'invoices'>('manual');
    const [manualDebtAmount, setManualDebtAmount] = useState('');
    const [selectedDebtInvoices, setSelectedDebtInvoices] = useState<string[]>([]);
    const [selectedAssetForSchedule, setSelectedAssetForSchedule] = useState<any>(null);
    const [editForm, setEditForm] = useState({ fullName: '', jobTitle: '', email: '' });

    const [companyForm, setCompanyForm] = useState({
        name: '', country: 'Portugal', currency: 'EUR', address: '', nif: '', 
        logo_url: '', footer: '', invoice_color: '#2563EB', header_text: '', 
        template_url: '', invoice_template_url: ''
    });

    const [journalGrid, setJournalGrid] = useState<JournalGridLine[]>([
        { account_id: '', debit: 0, credit: 0 }, 
        { account_id: '', debit: 0, credit: 0 }
    ]);

    const [newTransaction, setNewTransaction] = useState({ description: '', date: new Date().toISOString().split('T')[0] });
    const [newAsset, setNewAsset] = useState({ name: '', category: 'Equipamento', purchase_date: new Date().toISOString().split('T')[0], purchase_value: '', lifespan_years: 3, amortization_method: 'linear' });
    const [newEntity, setNewEntity] = useState({ name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' });
    const [newProvision, setNewProvision] = useState({ description: '', amount: '', type: 'Riscos e Encargos', date: new Date().toISOString().split('T')[0] });
    const [newPurchase, setNewPurchase] = useState({ supplier_id: '', invoice_number: '', date: new Date().toISOString().split('T')[0], due_date: '', total: '', tax_total: '' });

    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
        id: '', client_id: '', type: 'Fatura', invoice_number: '',
        date: new Date().toISOString().split('T')[0],
        due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        exemption_reason: '', items: [{ description: '', quantity: 1, price: 0, tax: 23 }]
    });

    const [savingProfile, setSavingProfile] = useState(false);
    const [savingCompany, setSavingCompany] = useState(false);

    // AI STATES
    const [messages, setMessages] = useState([{ role: 'assistant', content: 'Olá! Sou o assistente EasyCheck. Posso ajudar a criar faturas, registar despesas ou gerir clientes.' }]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [aiMemory, setAiMemory] = useState<AIMemoryState>({ intent: null, step: 'idle', data: {} });
    const scrollRef = useRef<HTMLDivElement>(null);

    // HELPERS
    const getCurrencyCode = (country: string) => countryCurrencyMap[country] || 'EUR';
    const getCurrencySymbol = (code: string) => currencySymbols[code] || '€';
    const getCurrentCountryVatRates = () => vatRatesByCountry[companyForm.country || "Portugal"] || [23, 0];
    const currentCurrency = companyForm.currency || 'EUR';
    const conversionRate = exchangeRates[currentCurrency] || 1;
    const displaySymbol = getCurrencySymbol(currentCurrency);

    const getMonthlyFinancials = () => {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const currentYear = new Date().getFullYear();
        const data = months.map(m => ({ name: m, receitas: 0, despesas: 0 }));
        journalEntries.forEach(entry => {
            const date = new Date(entry.date);
            if (date.getFullYear() === currentYear) {
                const monthIdx = date.getMonth();
                entry.journal_items?.forEach((item: any) => {
                    if (item.company_accounts?.code.startsWith('7') || item.company_accounts?.type === 'rendimentos') data[monthIdx].receitas += item.credit;
                    if (item.company_accounts?.code.startsWith('6') || item.company_accounts?.type === 'gastos') data[monthIdx].despesas += item.debit;
                });
            }
        });
        return data;
    };

    const chartData = getMonthlyFinancials();
    const totalRevenue = chartData.reduce((acc, curr) => acc + curr.receitas, 0);
    const totalExpenses = chartData.reduce((acc, curr) => acc + curr.despesas, 0);
    const currentBalance = totalRevenue - totalExpenses;
    const totalInvoicesCount = realInvoices.length;

    const getInitials = (name: string) => name ? (name.split(' ').length > 1 ? (name.split(' ')[0][0] + name.split(' ')[name.split(' ').length - 1][0]) : name.substring(0, 2)).toUpperCase() : 'EC';

    const logAction = async (action: string, description: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: newLog } = await supabase.from('action_logs').insert([{ user_id: user.id, action_type: action, description: description }]).select().single();
        if (newLog) setActionLogs(prev => [newLog, ...prev]);
    };

    const addGridLine = () => setJournalGrid([...journalGrid, { account_id: '', debit: 0, credit: 0 }]);
    const removeGridLine = (index: number) => setJournalGrid(journalGrid.filter((_, i) => i !== index));
    const updateGridLine = (index: number, field: keyof JournalGridLine, value: any) => setJournalGrid(prev => { const newGrid = [...prev]; (newGrid[index] as any)[field] = value; return newGrid; });
    const getGridTotals = () => journalGrid.reduce((acc, line) => ({ debit: acc.debit + (Number(line.debit) || 0), credit: acc.credit + (Number(line.credit) || 0) }), { debit: 0, credit: 0 });
    const isGridBalanced = () => { const t = getGridTotals(); return Math.abs(t.debit - t.credit) < 0.01 && t.debit > 0; };

    const calculateAmortizationSchedule = (asset: any) => {
        if (!asset) return [];
        const schedule = [];
        let currentValue = parseFloat(asset.purchase_value);
        const lifespan = parseInt(asset.lifespan_years);
        const startYear = new Date(asset.purchase_date).getFullYear();
        let coef = 1.0;
        if (asset.amortization_method === 'degressive') {
            if (lifespan >= 5 && lifespan < 6) coef = 1.5;
            else if (lifespan >= 6) coef = 2.0;
            else coef = 2.5;
        }
        const linearRate = 1 / lifespan;
        const degressiveRate = linearRate * coef;
        for (let i = 0; i < lifespan; i++) {
            let annuity = 0;
            if (asset.amortization_method === 'linear') { annuity = asset.purchase_value / lifespan; } 
            else {
                const remainingYears = lifespan - i;
                const currentLinearAnnuity = currentValue / remainingYears;
                const currentDegressiveAnnuity = currentValue * degressiveRate;
                if (currentDegressiveAnnuity < currentLinearAnnuity || i === lifespan - 1) { annuity = currentLinearAnnuity; } 
                else { annuity = currentDegressiveAnnuity; }
            }
            if (currentValue - annuity < 0.01) annuity = currentValue;
            schedule.push({ year: startYear + i, startValue: currentValue, annuity: annuity, accumulated: asset.purchase_value - (currentValue - annuity), endValue: currentValue - annuity });
            currentValue -= annuity;
            if (currentValue < 0) currentValue = 0;
        }
        return schedule;
    };

    const getCurrentAssetValue = (asset: any) => {
        const schedule = calculateAmortizationSchedule(asset);
        const currentYear = new Date().getFullYear();
        const entry = schedule.find((s: any) => s.year === currentYear);
        if (!entry) {
            const last = schedule[schedule.length - 1];
            if (last && currentYear > last.year) return 0;
            return asset.purchase_value;
        }
        return entry.endValue;
    };

    const calculateInvoiceTotals = () => {
        let subtotal = 0; let taxTotal = 0;
        invoiceData.items.forEach(item => {
            const lineTotal = item.quantity * item.price;
            subtotal += lineTotal;
            taxTotal += lineTotal * (item.tax / 100);
        });
        return { subtotal, taxTotal, total: subtotal + taxTotal };
    };

    // EFFECTS
    useEffect(() => {
        if (document.documentElement.classList.contains('dark')) setIsDark(true);
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserData(user);
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (profile) {
                    setProfileData(profile);
                    setEditForm({ fullName: profile.full_name, jobTitle: profile.job_title || '', email: user.email || '' });
                    const initialCurrency = profile.currency || getCurrencyCode(profile.country || 'Portugal');
                    setCompanyForm({
                        name: profile.company_name, country: profile.country || 'Portugal', currency: initialCurrency, address: profile.company_address || '', nif: profile.company_nif || '', logo_url: profile.logo_url || '', footer: profile.company_footer || '', invoice_color: profile.invoice_color || '#2563EB', header_text: profile.header_text || '', template_url: profile.template_url || '', invoice_template_url: profile.invoice_template_url || ''
                    });
                    if (profile.custom_exchange_rates) setExchangeRates({ ...defaultRates, ...profile.custom_exchange_rates });
                }
                const [journal, inv, pur, acc, ass, cl, sup, prov, logs] = await Promise.all([
                    supabase.from('journal_entries').select('*, journal_items(debit, credit, company_accounts(code, name, type))').order('date', { ascending: false }),
                    supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false }),
                    supabase.from('purchases').select('*, suppliers(name)').order('date', { ascending: false }),
                    supabase.from('company_accounts').select('*').order('code', { ascending: true }),
                    supabase.from('accounting_assets').select('*'),
                    supabase.from('clients').select('*'),
                    supabase.from('suppliers').select('*'),
                    supabase.from('accounting_provisions').select('*'),
                    supabase.from('action_logs').select('*').order('created_at', { ascending: false }).limit(20)
                ]);
                if (journal.data) setJournalEntries(journal.data);
                if (inv.data) setRealInvoices(inv.data);
                if (pur.data) setPurchases(pur.data);
                if (acc.data) setCompanyAccounts(acc.data);
                if (ass.data) setAssets(ass.data);
                if (cl.data) setClients(cl.data);
                if (sup.data) setSuppliers(sup.data);
                if (prov.data) setProvisions(prov.data);
                if (logs.data) setActionLogs(logs.data);
            }
            setLoadingUser(false);
        };
        fetchData();
    }, []);

    useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

    useEffect(() => {
        if (!invoiceData.client_id) return;
        const defaultRate = getCurrentCountryVatRates()[0];
        let newTax = defaultRate;
        let exemption = '';
        if (invoiceData.type.includes('Isenta') || invoiceData.type.includes('Intracomunitária')) {
            newTax = 0;
            exemption = invoiceData.type.includes('Intracomunitária') ? 'Isento Artigo 14.º RITI' : 'IVA - Autoliquidação';
        }
        const updatedItems = invoiceData.items.map(item => ({
            ...item,
            tax: (item.tax === 0 && newTax !== 0) || (item.tax !== 0 && newTax === 0) ? newTax : item.tax
        }));
        setInvoiceData(prev => ({ ...prev, items: updatedItems, exemption_reason: exemption }));
    }, [invoiceData.type]);

    // HANDLERS
    const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingCSV(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            const lines = text?.split('\n') || [];
            const parsedLines: BankStatementLine[] = lines.slice(1).filter(l => l.trim()).map(line => {
                const cols = line.split(/[,;]/);
                const val = parseFloat(cols[2]?.trim()?.replace(',', '.') || '0');
                const match = realInvoices.find(inv => Math.abs(inv.total - Math.abs(val)) < 0.01);
                return { 
                    date: cols[0]?.trim() || new Date().toISOString().split('T')[0], 
                    description: cols[1]?.trim() || "Sem descrição", 
                    amount: val || 0, 
                    matched_invoice_id: match?.id, 
                    suggested_match: match?.invoice_number 
                };
            });
            setBankStatement(parsedLines);
            setIsUploadingCSV(false);
        };
        reader.readAsText(file);
    };

    const copyCode = () => { if (profileData?.company_code) navigator.clipboard.writeText(profileData.company_code); };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploadingLogo(true);
        const file = e.target.files[0];
        const fileName = `${userData.id}/logo_${Date.now()}.${file.name.split('.').pop()}`;
        try {
            await supabase.storage.from('company-logos').upload(fileName, file, { upsert: true });
            const { data: { publicUrl } } = supabase.storage.from('company-logos').getPublicUrl(fileName);
            setCompanyForm(prev => ({ ...prev, logo_url: publicUrl }));
            await supabase.from('profiles').update({ logo_url: publicUrl }).eq('id', userData.id);
        } catch (e: any) { alert("Erro: " + e.message); } finally { setUploadingLogo(false); }
    };

    const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploadingTemplate(true);
        const file = e.target.files[0];
        const fileName = `templates/${userData.id}_${Date.now()}.png`;
        try {
            await supabase.storage.from('company-logos').upload(fileName, file, { upsert: true });
            const { data: { publicUrl } } = supabase.storage.from('company-logos').getPublicUrl(fileName);
            setCompanyForm(prev => ({ ...prev, invoice_template_url: publicUrl }));
            await supabase.from('profiles').update({ invoice_template_url: publicUrl }).eq('id', userData.id);
        } catch (e: any) { alert("Erro: " + e.message); } finally { setUploadingTemplate(false); }
    };

    const handleAddInvoiceItem = () => { setInvoiceData({ ...invoiceData, items: [...invoiceData.items, { description: '', quantity: 1, price: 0, tax: getCurrentCountryVatRates()[0] }] }); };
    const handleRemoveInvoiceItem = (index: number) => { const newItems = [...invoiceData.items]; newItems.splice(index, 1); setInvoiceData({ ...invoiceData, items: newItems }); };
    const updateInvoiceItem = (index: number, field: string, value: string) => { const newItems: any = [...invoiceData.items]; newItems[index][field] = field === 'description' ? value : parseFloat(value) || 0; setInvoiceData({ ...invoiceData, items: newItems }); };
    const resetInvoiceForm = () => { setInvoiceData({ id: '', client_id: '', type: 'Fatura', invoice_number: '', date: new Date().toISOString().split('T')[0], due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], exemption_reason: '', items: [{ description: '', quantity: 1, price: 0, tax: 0 }] }); setManualTaxMode(false); };

    const handleSaveInvoice = async () => {
        const totals = calculateInvoiceTotals();
        let docNumber = invoiceData.invoice_number || `${invoiceTypesMap[invoiceData.type] || 'DOC'} ${new Date().getFullYear()}/${realInvoices.length + 1}`;
        let invoiceId;
        
        if (invoiceData.id) {
            const res = await supabase.from('invoices').update({ client_id: invoiceData.client_id, type: invoiceData.type, date: invoiceData.date, due_date: invoiceData.due_date, exemption_reason: invoiceData.exemption_reason, subtotal: totals.subtotal, tax_total: totals.taxTotal, total: totals.total }).eq('id', invoiceData.id).select().single();
            if (res.error) return alert("Erro: " + res.error.message);
            invoiceId = res.data.id;
            await supabase.from('invoice_items').delete().eq('invoice_id', invoiceData.id);
        } else {
            const res = await supabase.from('invoices').insert([{ user_id: userData.id, client_id: invoiceData.client_id, type: invoiceData.type, invoice_number: docNumber, date: invoiceData.date, due_date: invoiceData.due_date, exemption_reason: invoiceData.exemption_reason, subtotal: totals.subtotal, tax_total: totals.taxTotal, total: totals.total, currency: currentCurrency, status: 'sent' }]).select().single();
            if (res.error) return alert("Erro: " + res.error.message);
            invoiceId = res.data.id;
        }
        await supabase.from('invoice_items').insert(invoiceData.items.map(item => ({ invoice_id: invoiceId, description: item.description, quantity: item.quantity, unit_price: item.price, tax_rate: item.tax })));

        const clientAccount = companyAccounts.find(a => a.code.startsWith('211') || a.code.startsWith('411') || a.code.startsWith('1200'));
        const salesAccount = companyAccounts.find(a => a.code.startsWith('71') || a.code.startsWith('701') || a.code.startsWith('4000'));
        if (clientAccount && salesAccount) {
            const { data: entry } = await supabase.from('journal_entries').insert([{ user_id: userData.id, date: invoiceData.date, description: `Fatura ${docNumber}`, document_ref: docNumber }]).select().single();
            if (entry) {
                await supabase.from('journal_items').insert([
                    { entry_id: entry.id, account_id: clientAccount.id, debit: totals.total, credit: 0 },
                    { entry_id: entry.id, account_id: salesAccount.id, debit: 0, credit: totals.subtotal }
                ]);
            }
        }
        
        const { data: updatedInvoices } = await supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false });
        if (updatedInvoices) setRealInvoices(updatedInvoices);
        const { data: updatedJournal } = await supabase.from('journal_entries').select('*, journal_items(debit, credit, company_accounts(code, name))').order('date', { ascending: false });
        if (updatedJournal) setJournalEntries(updatedJournal);
        
        setShowPreviewModal(false); setShowInvoiceForm(false); resetInvoiceForm();
        alert("Fatura emitida!");
    };

    const handleCreateEntity = async () => {
        if (!newEntity.name) return alert("Nome obrigatório");
        const table = entityType === 'client' ? 'clients' : 'suppliers';
        let error = null, data = null;

        if (editingEntityId) {
            const res = await supabase.from(table).update({ ...newEntity, updated_at: new Date() }).eq('id', editingEntityId).select();
            error = res.error; data = res.data;
            if (!error && data) {
                if (entityType === 'client') setClients(prev => prev.map(c => c.id === editingEntityId ? data[0] : c));
                else setSuppliers(prev => prev.map(s => s.id === editingEntityId ? data[0] : s));
            }
        } else {
            const res = await supabase.from(table).insert([{ user_id: userData.id, ...newEntity }]).select();
            error = res.error; data = res.data;
            if (!error && data) {
                if (entityType === 'client') setClients([data[0], ...clients]);
                else setSuppliers([data[0], ...suppliers]);
            }
        }

        if (!error && data) {
            setShowEntityModal(false); setEditingEntityId(null); setNewEntity({ name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' });
            if (entityType === 'client' && aiMemory.intent === 'create_invoice' && aiMemory.step === 'awaiting_client') {
                resetInvoiceForm();
                setInvoiceData(prev => ({ ...prev, client_id: data[0].id, items: [{ ...prev.items[0], price: aiMemory.data?.amount || 0 }] }));
                setShowInvoiceForm(true);
                setAiMemory({ intent: null, step: 'idle', data: {} });
                setMessages(prev => [...prev, { role: 'assistant', content: `Cliente criado! Abri a fatura.` }]);
            }
        } else { alert("Erro: " + error?.message); }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'ELIMINAR') return alert("Escreva ELIMINAR");
        setIsDeleting(true);
        try { await supabase.rpc('delete_user'); await supabase.auth.signOut(); navigate('/'); } catch (e: any) { alert(e.message); } finally { setIsDeleting(false); }
    };

    const handleSendChatMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isChatLoading) return;
        const userText = chatInput;
        setChatInput('');
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setIsChatLoading(true);
        try {
            const contextData = { clients: clients.map(c => ({ id: c.id, name: c.name })), current_state: aiMemory };
            const aiResponse = await askGrok(userText, contextData);
            if (aiResponse.action === 'create_invoice') {
                const amount = parseFloat(aiResponse.amount) || 0;
                const clientName = aiResponse.client_name;
                const existingClient = clients.find(c => c.name.toLowerCase().includes(clientName?.toLowerCase()));
                if (existingClient) {
                    resetInvoiceForm();
                    setInvoiceData(prev => ({ ...prev, client_id: existingClient.id, items: [{ ...prev.items[0], price: amount }] }));
                    setShowInvoiceForm(true);
                    setAiMemory({ intent: null, step: 'idle', data: {} });
                    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse.reply || `A abrir fatura para ${existingClient.name}...` }]);
                } else if (clientName) {
                    setAiMemory({ intent: 'create_invoice', step: 'awaiting_client', data: { amount: amount, tempClientName: clientName } });
                    setNewEntity(prev => ({ ...prev, name: clientName })); setEntityType('client'); setShowEntityModal(true);
                    setMessages(prev => [...prev, { role: 'assistant', content: `O cliente "${clientName}" não existe. Abri a ficha para o criar.` }]);
                }
            } else if (aiResponse.action === 'create_client') {
                setNewEntity(prev => ({ ...prev, name: aiResponse.client_name || '' })); setEntityType('client'); setAccountingTab('clients'); setShowEntityModal(true);
                setAiMemory({ intent: 'create_client', step: 'idle', data: {} });
                setMessages(prev => [...prev, { role: 'assistant', content: aiResponse.reply || "A abrir ficha de novo cliente..." }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: aiResponse.reply || "Não entendi." }]);
            }
        } catch (error) { setMessages(prev => [...prev, { role: 'assistant', content: "Erro no Cérebro IA." }]); } finally { setIsChatLoading(false); }
    };

    const generatePDFBlob = async (dataOverride?: any): Promise<Blob> => {
        const doc = new jsPDF();
        doc.text("Fatura Demonstração", 20, 20);
        return doc.output('blob');
    };

    const handleSaveCompany = async () => {
        setSavingCompany(true);
        try {
            const updates = {
                company_name: companyForm.name, company_nif: companyForm.nif, company_address: companyForm.address, country: companyForm.country, currency: companyForm.currency, custom_exchange_rates: exchangeRates, logo_url: companyForm.logo_url, company_footer: companyForm.footer, invoice_color: companyForm.invoice_color, header_text: companyForm.header_text, template_url: companyForm.template_url, invoice_template_url: companyForm.invoice_template_url, updated_at: new Date()
            };
            await supabase.from('profiles').update(updates).eq('id', userData.id);
            setProfileData({ ...profileData, ...updates });

            if (companyForm.country) {
                // CORREÇÃO CRÍTICA: Se o RPC funcionar, NÃO usamos o fallback do JS.
                const { error: rpcError } = await supabase.rpc('init_company_accounting', { p_user_id: userData.id, p_country: companyForm.country });
                
                if (rpcError) {
                    console.error("RPC Error (usando fallback):", rpcError);
                    // Só usa o fallback se o SQL falhar
                    const templateAccounts = ACCOUNTING_TEMPLATES["Default"];
                    if (templateAccounts) {
                        const accountsToInsert = templateAccounts.map(acc => ({ user_id: userData.id, code: acc.code, name: acc.name, type: acc.type }));
                        await supabase.from('company_accounts').upsert(accountsToInsert, { onConflict: 'user_id,code' });
                    }
                }
                
                const { data: refreshedAccounts } = await supabase.from('company_accounts').select('*').order('code', { ascending: true });
                if (refreshedAccounts) setCompanyAccounts(refreshedAccounts);
            }
            alert(`Configurações de ${companyForm.country} aplicadas!`);
        } catch (e: any) { alert("Erro: " + e.message); } finally { setSavingCompany(false); }
    };

    const handleQuickPreview = async (inv: any) => { const blob = await generatePDFBlob(inv); setPdfPreviewUrl(URL.createObjectURL(blob)); setShowPreviewModal(true); };
    const handleDownloadPDF = () => { if (pdfPreviewUrl) { const link = document.createElement('a'); link.href = pdfPreviewUrl; link.download = `Doc.pdf`; link.click(); } };
    const selectLanguage = (code: string) => { i18n.changeLanguage(code); setIsLangMenuOpen(false); };
    const toggleTheme = () => { document.documentElement.classList.toggle('dark'); setIsDark(!isDark); };
    const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };
    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => { const c = e.target.value; setCompanyForm({ ...companyForm, country: c, currency: getCurrencyCode(c) }); };
    
    // --- FUNÇÕES ESTRUTURAIS ---
    
    // CORREÇÃO: handleEditInvoice agora exportado corretamente
    const handleEditInvoice = (invoice: any) => {
        setInvoiceData({ 
            id: invoice.id, client_id: invoice.client_id, type: invoice.type, invoice_number: invoice.invoice_number, 
            date: invoice.date, due_date: invoice.due_date, exemption_reason: invoice.exemption_reason || '', items: [] 
        });
        setShowInvoiceForm(true);
    };
    
    // CORREÇÃO: handleDeleteInvoice exportado
    const handleDeleteInvoice = async (id: string) => {
        if (!window.confirm("Anular fatura?")) return;
        const { error } = await supabase.from('invoices').delete().eq('id', id);
        if (!error) setRealInvoices(prev => prev.filter(i => i.id !== id));
    };

    // CORREÇÃO: handleCreatePurchase exportado
    const handleCreatePurchase = async () => {
        if (!newPurchase.supplier_id || !newPurchase.total) return alert("Dados em falta");
        const { data, error } = await supabase.from('purchases').insert([{ user_id: userData.id, ...newPurchase, total: parseFloat(newPurchase.total), tax_total: parseFloat(newPurchase.tax_total || '0') }]).select('*, suppliers(name)').single();
        if (!error && data) { setPurchases([data, ...purchases]); setShowPurchaseForm(false); }
    };

    const handleGenerateReminder = (inv: any, lvl: number) => { alert(`Lembrete nível ${lvl} gerado para ${inv.invoice_number}`); };
    const generateFinancialReport = (type: string) => { alert(`A gerar ${type}...`); };
    const handleSaveJournalEntry = async () => { alert("Guardado!"); setShowTransactionModal(false); };
    const handleResetFinancials = async () => { if(confirm("Apagar tudo?")) alert("Reset feito."); };
    const handleOpenDoubtful = (c: any) => { setSelectedClientForDebt(c); setShowDoubtfulModal(true); };
    const saveDoubtfulDebt = async () => { alert("Guardado"); setShowDoubtfulModal(false); };
    const handleDeleteEntity = async (id: string, type: string) => { setClients(prev => prev.filter(c => c.id !== id)); };
    const handleEditEntity = (e: any, type: any) => { setEditingEntityId(e.id); setShowEntityModal(true); };
    const handleDeleteAsset = async (id: string) => { setAssets(prev => prev.filter(a => a.id !== id)); };
    const handleShowAmortSchedule = (a: any) => { setSelectedAssetForSchedule(a); setShowAmortSchedule(true); };
    const handlePayInvoice = async (i: any) => { alert("Pago!"); };

    // CORREÇÃO: handleCreateAsset
    const handleCreateAsset = async () => {
        if (!newAsset.name || !newAsset.purchase_value) return alert("Preencha dados.");
        const val = typeof newAsset.purchase_value === 'string' ? parseFloat(newAsset.purchase_value) : newAsset.purchase_value;
        const { data, error } = await supabase.from('accounting_assets').insert([{ user_id: userData.id, ...newAsset, purchase_value: val }]).select();
        if (!error && data) { setAssets([...assets, data[0]]); setShowAssetModal(false); }
    };

    // CORREÇÃO: handleCreateProvision (Segura)
    const handleCreateProvision = async () => {
        if (!userData) return alert("Erro de autenticação.");
        if (!newProvision.description || !newProvision.amount) return alert("Preencha a descrição e o valor.");
        
        const valString = newProvision.amount.toString().replace(',', '.');
        const amountValue = parseFloat(valString);
        if (isNaN(amountValue)) return alert("Valor inválido.");

        const amountInEur = amountValue / conversionRate;
        const { data, error } = await supabase.from('accounting_provisions').insert([{ user_id: userData.id, ...newProvision, amount: amountInEur }]).select();
        
        if (!error && data) {
            setProvisions([...provisions, data[0]]);
            setShowProvisionModal(false);
            setNewProvision({ description: '', amount: '', type: 'Riscos e Encargos', date: new Date().toISOString().split('T')[0] });
        } else {
            alert("Erro: " + (error?.message || "Desconhecido"));
        }
    };

    // CORREÇÃO: handleSaveProfile (Segura)
    const handleSaveProfile = async () => {
        if (!userData) return;
        setSavingProfile(true);
        try {
            const { error } = await supabase.from('profiles').update({ 
                full_name: editForm.fullName, 
                job_title: editForm.jobTitle, 
                updated_at: new Date() 
            }).eq('id', userData.id);

            if (error) throw error;
            setProfileData({ ...profileData, full_name: editForm.fullName, job_title: editForm.jobTitle });
            alert(`Perfil atualizado!`);
            setIsProfileModalOpen(false);
        } catch (e: any) {
            alert("Erro ao guardar: " + e.message);
        } finally {
            setSavingProfile(false);
        }
    };

    return {
        isMobileMenuOpen, setIsMobileMenuOpen, isProfileDropdownOpen, setIsProfileDropdownOpen,
        isLangMenuOpen, setIsLangMenuOpen, showFinancials, setShowFinancials,
        showPageCode, setShowPageCode, isDark, setIsDark, userData, profileData,
        loadingUser, accountingTab, setAccountingTab,
        journalEntries, realInvoices, purchases, companyAccounts, assets, clients, suppliers,
        provisions, actionLogs, exchangeRates, bankStatement,
        isUploadingCSV, manualTaxMode, setManualTaxMode,
        isDeleteModalOpen, setIsDeleteModalOpen, isProfileModalOpen, setIsProfileModalOpen,
        showTransactionModal, setShowTransactionModal, showAssetModal, setShowAssetModal,
        showEntityModal, setShowEntityModal, showInvoiceForm, setShowInvoiceForm,
        showPurchaseForm, setShowPurchaseForm, showPreviewModal, setShowPreviewModal,
        showProvisionModal, setShowProvisionModal, showDoubtfulModal, setShowDoubtfulModal,
        showAmortSchedule, setShowAmortSchedule,
        entityType, setEntityType, editingEntityId, setEditingEntityId,
        editingProvisionId, setEditingProvisionId, editingAssetId, setEditingAssetId,
        deleteConfirmation, setDeleteConfirmation, isDeleting, uploadingLogo, uploadingTemplate,
        pdfPreviewUrl, selectedClientForDebt, setSelectedClientForDebt, debtMethod, setDebtMethod,
        manualDebtAmount, setManualDebtAmount, selectedDebtInvoices, setSelectedDebtInvoices,
        selectedAssetForSchedule, setSelectedAssetForSchedule, editForm, setEditForm,
        companyForm, setCompanyForm, journalGrid, setJournalGrid, newTransaction, setNewTransaction,
        newAsset, setNewAsset, newEntity, setNewEntity, newProvision, setNewProvision,
        newPurchase, setNewPurchase, invoiceData, setInvoiceData, savingProfile, savingCompany,
        messages, chatInput, setChatInput, isChatLoading, scrollRef,
        getCurrencySymbol, displaySymbol, conversionRate, getCurrentCountryVatRates,
        getMonthlyFinancials, chartData, totalRevenue, totalExpenses, currentBalance,
        totalInvoicesCount, getInitials, logAction, addGridLine, removeGridLine,
        updateGridLine, getGridTotals, isGridBalanced, calculateAmortizationSchedule,
        getCurrentAssetValue, calculateInvoiceTotals, handleCSVUpload, copyCode,
        handleLogoUpload, handleTemplateUpload, handleAddInvoiceItem, handleRemoveInvoiceItem,
        updateInvoiceItem, handleSaveInvoice, resetInvoiceForm, handleEditInvoice,
        handleDeleteAccount, handleDeleteInvoice, handleCreatePurchase, generatePDFBlob,
        handleGenerateReminder, generateFinancialReport, handleSaveJournalEntry,
        handleResetFinancials, handleOpenDoubtful, saveDoubtfulDebt, handleCreateAsset,
        handleDeleteAsset, handleShowAmortSchedule, handleCreateEntity, handleEditEntity,
        handleDeleteEntity, handleCreateProvision, handleSaveProfile, handleSaveCompany,
        handleQuickPreview, handleDownloadPDF, handleSendChatMessage, selectLanguage,
        toggleTheme, handleLogout, handleCountryChange, handlePayInvoice
    };
};