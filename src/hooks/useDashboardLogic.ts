import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { askGrok } from '../services/aiService'; 

// ==========================================
// DADOS ESTÁTICOS E CONSTANTES
// ==========================================

export const ACCOUNTING_TEMPLATES: Record<string, any[]> = {
    "Portugal": [
        { code: '11', name: 'Caixa', type: 'ativo' },
        { code: '12', name: 'Depósitos à Ordem', type: 'ativo' },
        { code: '211', name: 'Clientes c/c', type: 'ativo' },
        { code: '221', name: 'Fornecedores c/c', type: 'passivo' },
        { code: '2432', name: 'IVA Dedutível', type: 'ativo' },
        { code: '2433', name: 'IVA Liquidado', type: 'passivo' },
        { code: '2434', name: 'IVA a Pagar/Recuperar', type: 'passivo' },
        { code: '311', name: 'Mercadorias', type: 'ativo' },
        { code: '431', name: 'Equipamento Básico', type: 'ativo' },
        { code: '611', name: 'Custo Mercadorias Vendidas', type: 'gastos' },
        { code: '621', name: 'Subcontratos', type: 'gastos' },
        { code: '622', name: 'Serviços Especializados', type: 'gastos' },
        { code: '623', name: 'Materiais', type: 'gastos' },
        { code: '624', name: 'Energia e Fluidos', type: 'gastos' },
        { code: '631', name: 'Remunerações Órgãos Sociais', type: 'gastos' },
        { code: '711', name: 'Vendas de Mercadorias', type: 'rendimentos' },
        { code: '721', name: 'Prestações de Serviços', type: 'rendimentos' }
    ],
    "Brasil": [
        { code: '1.01', name: 'Caixa Geral', type: 'ativo' },
        { code: '1.02', name: 'Bancos Conta Movimento', type: 'ativo' },
        { code: '1.03', name: 'Clientes a Receber', type: 'ativo' },
        { code: '2.01', name: 'Fornecedores a Pagar', type: 'passivo' },
        { code: '2.02', name: 'Impostos a Recolher', type: 'passivo' },
        { code: '3.01', name: 'Receita Bruta de Vendas', type: 'rendimentos' },
        { code: '3.02', name: 'Receita de Serviços', type: 'rendimentos' },
        { code: '4.01', name: 'Custo das Mercadorias', type: 'gastos' },
        { code: '4.02', name: 'Despesas Operacionais', type: 'gastos' },
        { code: '4.03', name: 'Despesas com Pessoal', type: 'gastos' }
    ],
    "France": [
        { code: '512', name: 'Banque', type: 'ativo' },
        { code: '530', name: 'Caisse', type: 'ativo' },
        { code: '411', name: 'Clients', type: 'ativo' },
        { code: '401', name: 'Fournisseurs', type: 'passivo' },
        { code: '44566', name: 'TVA Déductible', type: 'ativo' },
        { code: '44571', name: 'TVA Collectée', type: 'passivo' },
        { code: '601', name: 'Achats de matières premières', type: 'gastos' },
        { code: '606', name: 'Achats non stockés', type: 'gastos' },
        { code: '641', name: 'Rémunération du personnel', type: 'gastos' },
        { code: '701', name: 'Ventes de produtos finis', type: 'rendimentos' },
        { code: '706', name: 'Prestations de services', type: 'rendimentos' }
    ],
    "Default": [
        { code: '1000', name: 'Cash', type: 'ativo' },
        { code: '1100', name: 'Bank Accounts', type: 'ativo' },
        { code: '1200', name: 'Accounts Receivable', type: 'ativo' },
        { code: '2000', name: 'Accounts Payable', type: 'passivo' },
        { code: '2100', name: 'Sales Tax Payable', type: 'passivo' },
        { code: '4000', name: 'Sales Income', type: 'rendimentos' },
        { code: '4100', name: 'Service Revenue', type: 'rendimentos' },
        { code: '5000', name: 'Cost of Goods Sold', type: 'gastos' },
        { code: '6000', name: 'Office Supplies', type: 'gastos' },
        { code: '6100', name: 'Rent Expense', type: 'gastos' }
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

    // ----------------------------------
    // ESTADOS DE UI (Menus e Tabs)
    // ----------------------------------
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [showFinancials, setShowFinancials] = useState(true);
    const [showPageCode, setShowPageCode] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [accountingTab, setAccountingTab] = useState('overview');

    // ----------------------------------
    // DADOS (Base de Dados)
    // ----------------------------------
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

    // ----------------------------------
    // ESTADOS DE MODAIS
    // ----------------------------------
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

    // ----------------------------------
    // CORREÇÃO CRÍTICA DE NAVEGAÇÃO
    // ----------------------------------
    
    useEffect(() => {
        if (showInvoiceForm) {
            if (!location.pathname.includes('/accounting')) {
                navigate('/dashboard/accounting');
            }
            if (accountingTab !== 'invoices') {
                setAccountingTab('invoices');
            }
        }
    }, [showInvoiceForm, location.pathname, accountingTab, navigate]);

    useEffect(() => {
        if (showPurchaseForm) {
            if (!location.pathname.includes('/accounting')) {
                navigate('/dashboard/accounting');
            }
            if (accountingTab !== 'purchases') {
                setAccountingTab('purchases');
            }
        }
    }, [showPurchaseForm, location.pathname, accountingTab, navigate]);

    // ----------------------------------
    // ESTADOS DE FORMULÁRIOS
    // ----------------------------------
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

    const [newTransaction, setNewTransaction] = useState({ 
        description: '', date: new Date().toISOString().split('T')[0] 
    });
    
    const [newAsset, setNewAsset] = useState({ 
        name: '', category: 'Equipamento', purchase_date: new Date().toISOString().split('T')[0], 
        purchase_value: '', lifespan_years: 3, amortization_method: 'linear' 
    });
    
    const [newEntity, setNewEntity] = useState({ 
        name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' 
    });
    
    const [newProvision, setNewProvision] = useState({ 
        description: '', amount: '', type: 'Riscos e Encargos', date: new Date().toISOString().split('T')[0] 
    });
    
    const [newPurchase, setNewPurchase] = useState({ 
        supplier_id: '', invoice_number: '', date: new Date().toISOString().split('T')[0], 
        due_date: '', total: '', tax_total: '' 
    });

    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
        id: '', client_id: '', type: 'Fatura', invoice_number: '',
        date: new Date().toISOString().split('T')[0],
        due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        exemption_reason: '', items: [{ description: '', quantity: 1, price: 0, tax: 23 }]
    });

    const [savingProfile, setSavingProfile] = useState(false);
    const [savingCompany, setSavingCompany] = useState(false);

    // ----------------------------------
    // ESTADOS CHAT & IA
    // ----------------------------------
    const [messages, setMessages] = useState([{ role: 'assistant', content: 'Olá! Sou o assistente EasyCheck. Posso ajudar a criar faturas ou gerir clientes.' }]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    
    const [aiIntentMemory, setAiIntentMemory] = useState<{ pendingAction?: string, pendingData?: any } | null>(null);
    
    const scrollRef = useRef<HTMLDivElement>(null);

    // ==========================================
    // FUNÇÕES AUXILIARES E LÓGICA
    // ==========================================

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
                    if (item.company_accounts?.code.startsWith('7') || item.company_accounts?.type === 'rendimentos') {
                        data[monthIdx].receitas += item.credit;
                    }
                    if (item.company_accounts?.code.startsWith('6') || item.company_accounts?.type === 'gastos') {
                        data[monthIdx].despesas += item.debit;
                    }
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
        const { data: newLog } = await supabase.from('action_logs').insert([{
            user_id: user.id, action_type: action, description: description
        }]).select().single();
        if (newLog) setActionLogs(prev => [newLog, ...prev]);
    };

    const addGridLine = () => setJournalGrid([...journalGrid, { account_id: '', debit: 0, credit: 0 }]);
    const removeGridLine = (index: number) => setJournalGrid(journalGrid.filter((_, i) => i !== index));
    const updateGridLine = (index: number, field: keyof JournalGridLine, value: any) => {
        setJournalGrid(prev => {
            const newGrid = [...prev];
            (newGrid[index] as any)[field] = value;
            return newGrid;
        });
    };

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

    // ==========================================
    // EFEITOS DE CARREGAMENTO
    // ==========================================

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
                    if (profile.custom_exchange_rates) { setExchangeRates({ ...defaultRates, ...profile.custom_exchange_rates }); }
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

    useEffect(() => { 
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; 
    }, [messages]);

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

    // ==========================================
    // ACTIONS & HANDLERS
    // ==========================================

    const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingCSV(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            if (!text || typeof text !== 'string') { 
                setIsUploadingCSV(false); 
                return alert("Erro ao ler o ficheiro CSV."); 
            }
            const lines = text.split('\n');
            if (lines.length < 2) { 
                setIsUploadingCSV(false); 
                return alert("O ficheiro CSV parece estar vazio ou sem dados."); 
            }
            const parsedLines: BankStatementLine[] = lines.slice(1).filter(l => l.trim()).map(line => {
                const cols = line.split(/[,;]/);
                const date = cols[0]?.trim();
                const description = cols[1]?.trim();
                const valString = cols[2]?.trim()?.replace(',', '.');
                const val = valString ? parseFloat(valString) : 0;
                const match = realInvoices.find(inv => Math.abs(inv.total - Math.abs(val)) < 0.01);
                return { 
                    date: date || new Date().toISOString().split('T')[0], 
                    description: description || "Sem descrição", 
                    amount: val || 0, 
                    matched_invoice_id: match?.id, 
                    suggested_match: match?.invoice_number 
                };
            });
            setBankStatement(parsedLines);
            setIsUploadingCSV(false);
            logAction('BANCO', `Importado extrato com ${parsedLines.length} linhas`);
        };
        reader.readAsText(file);
    };

    const copyCode = () => { 
        if (profileData?.company_code) { 
            navigator.clipboard.writeText(profileData.company_code); 
            alert("Código copiado!"); 
        } 
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingLogo(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${userData.id}/logo_${Date.now()}.${fileExt}`;
        try {
            const { error: uploadError } = await supabase.storage.from('company-logos').upload(fileName, file, { upsert: true });
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('company-logos').getPublicUrl(fileName);
            setCompanyForm(prev => ({ ...prev, logo_url: publicUrl }));
            await supabase.from('profiles').update({ logo_url: publicUrl }).eq('id', userData.id);
            alert("Logo carregado!");
        } catch (error: any) { 
            alert("Erro: " + error.message); 
        } finally { 
            setUploadingLogo(false); 
        }
    };

    const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingTemplate(true);
        const file = e.target.files[0];
        const fileName = `templates/${userData.id}_${Date.now()}.png`;
        try {
            const { error: uploadError } = await supabase.storage.from('company-logos').upload(fileName, file, { upsert: true });
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('company-logos').getPublicUrl(fileName);
            setCompanyForm(prev => ({ ...prev, invoice_template_url: publicUrl }));
            await supabase.from('profiles').update({ invoice_template_url: publicUrl }).eq('id', userData.id);
            alert("Template carregado com sucesso!");
        } catch (error: any) { 
            alert("Erro: " + error.message); 
        } finally { 
            setUploadingTemplate(false); 
        }
    };

    const handleAddInvoiceItem = () => { 
        const currentTax = getCurrentCountryVatRates()[0]; 
        setInvoiceData({ ...invoiceData, items: [...invoiceData.items, { description: '', quantity: 1, price: 0, tax: currentTax }] }); 
    };

    const handleRemoveInvoiceItem = (index: number) => { 
        const newItems = [...invoiceData.items]; 
        newItems.splice(index, 1); 
        setInvoiceData({ ...invoiceData, items: newItems }); 
    };

    const updateInvoiceItem = (index: number, field: string, value: string) => { 
        const newItems: any = [...invoiceData.items]; 
        newItems[index][field] = field === 'description' ? value : parseFloat(value) || 0; 
        setInvoiceData({ ...invoiceData, items: newItems }); 
    };

    const resetInvoiceForm = () => {
        setInvoiceData({ 
            id: '', client_id: '', type: 'Fatura', invoice_number: '', 
            date: new Date().toISOString().split('T')[0], 
            due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], 
            exemption_reason: '', items: [{ description: '', quantity: 1, price: 0, tax: 0 }] 
        });
        setManualTaxMode(false);
    };

    const handleSaveInvoice = async () => {
        const totals = calculateInvoiceTotals();
        let docNumber = invoiceData.invoice_number;
        if (!docNumber) {
            const prefix = invoiceTypesMap[invoiceData.type] || 'DOC';
            docNumber = `${prefix} ${new Date().getFullYear()}/${realInvoices.length + 1}`;
        }
        let invoiceId;
        if (invoiceData.id) {
            const res = await supabase.from('invoices').update({
                client_id: invoiceData.client_id, type: invoiceData.type, date: invoiceData.date, due_date: invoiceData.due_date, exemption_reason: invoiceData.exemption_reason, subtotal: totals.subtotal, tax_total: totals.taxTotal, total: totals.total
            }).eq('id', invoiceData.id).select().single();
            if (res.error) return alert("Erro ao atualizar: " + res.error.message);
            invoiceId = res.data.id;
            await supabase.from('invoice_items').delete().eq('invoice_id', invoiceData.id);
        } else {
            const res = await supabase.from('invoices').insert([{
                user_id: userData.id, client_id: invoiceData.client_id, type: invoiceData.type, invoice_number: docNumber, date: invoiceData.date, due_date: invoiceData.due_date, exemption_reason: invoiceData.exemption_reason, subtotal: totals.subtotal, tax_total: totals.taxTotal, total: totals.total, currency: currentCurrency, status: 'sent'
            }]).select().single();
            if (res.error) return alert("Erro ao criar: " + res.error.message);
            invoiceId = res.data.id;
        }
        const itemsToInsert = invoiceData.items.map(item => ({ invoice_id: invoiceId, description: item.description, quantity: item.quantity, unit_price: item.price, tax_rate: item.tax }));
        await supabase.from('invoice_items').insert(itemsToInsert);

        const clientAccount = companyAccounts.find(a => a.code.startsWith('211') || a.code.startsWith('311') || a.code.startsWith('411') || a.code.startsWith('1.03') || a.code.startsWith('400'));
        const salesAccount = companyAccounts.find(a => a.code.startsWith('71') || a.code.startsWith('61') || a.code.startsWith('3.01') || a.code.startsWith('701') || a.code.startsWith('4000'));
        const taxAccount = companyAccounts.find(a => a.code.startsWith('243') || a.code.startsWith('342') || a.code.startsWith('2.02') || a.code.startsWith('4457') || a.code.startsWith('2100'));

        if (clientAccount && salesAccount) {
            const { data: entry, error: entryError } = await supabase.from('journal_entries').insert([{ user_id: userData.id, date: invoiceData.date, description: `Fatura ${docNumber} - ${clients.find(c => c.id === invoiceData.client_id)?.name}`, document_ref: docNumber }]).select().single();
            if (!entryError && entry) {
                const journalItems = [{ entry_id: entry.id, account_id: clientAccount.id, debit: totals.total, credit: 0 }, { entry_id: entry.id, account_id: salesAccount.id, debit: 0, credit: totals.subtotal }];
                if (totals.taxTotal > 0 && taxAccount) { journalItems.push({ entry_id: entry.id, account_id: taxAccount.id, debit: 0, credit: totals.taxTotal }); }
                await supabase.from('journal_items').insert(journalItems);
            }
        }
        await logAction('FATURA', `Emitida Fatura ${docNumber} (${totals.total} ${displaySymbol})`);
        const { data: updatedInvoices } = await supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false });
        if (updatedInvoices) setRealInvoices(updatedInvoices);
        const { data: updatedJournal } = await supabase.from('journal_entries').select('*, journal_items(debit, credit, company_accounts(code, name))').order('date', { ascending: false });
        if (updatedJournal) setJournalEntries(updatedJournal);
        setShowPreviewModal(false); setShowInvoiceForm(false);
        resetInvoiceForm();
        alert("Fatura emitida e contabilizada!");
    };

    const handleEditInvoice = async (invoice: any) => {
        const { data: items } = await supabase.from('invoice_items').select('*').eq('invoice_id', invoice.id);
        setInvoiceData({ 
            id: invoice.id, client_id: invoice.client_id, type: invoice.type, 
            invoice_number: invoice.invoice_number, date: invoice.date, 
            due_date: invoice.due_date, exemption_reason: invoice.exemption_reason || '', 
            items: items ? items.map((i: any) => ({ description: i.description, quantity: i.quantity, price: i.unit_price, tax: i.tax_rate })) : [] 
        });
        setShowInvoiceForm(true);
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'ELIMINAR') { return alert("Por favor, escreva ELIMINAR para confirmar."); }
        setIsDeleting(true);
        try { 
            await supabase.rpc('delete_user'); 
            await supabase.auth.signOut(); 
            navigate('/'); 
        } catch (e: any) { 
            alert(e.message); 
        } finally { 
            setIsDeleting(false); 
        }
    };

    const handleDeleteInvoice = async (id: string) => {
        if (window.confirm("ATENÇÃO: Apagar uma fatura emitida pode ter implicações fiscais.\nTem a certeza absoluta?")) {
            if (window.prompt("Escreva 'APAGAR' para confirmar:") === 'APAGAR') {
                const { error } = await supabase.from('invoices').delete().eq('id', id);
                if (!error) { 
                    setRealInvoices(prev => prev.filter(i => i.id !== id)); 
                    logAction('ANULAR', `Fatura ${id} anulada`); 
                }
            }
        }
    };

    const handleCreatePurchase = async () => {
        if (!newPurchase.supplier_id || !newPurchase.total) return alert("Preencha fornecedor e total.");
        const { data, error } = await supabase.from('purchases').insert([{ user_id: userData.id, supplier_id: newPurchase.supplier_id, invoice_number: newPurchase.invoice_number, date: newPurchase.date, due_date: newPurchase.due_date, total: parseFloat(newPurchase.total), tax_total: parseFloat(newPurchase.tax_total || '0') }]).select('*, suppliers(name)').single();
        if (!error && data) {
            setPurchases([data, ...purchases]);
            setShowPurchaseForm(false);
            setNewPurchase({ supplier_id: '', invoice_number: '', date: new Date().toISOString().split('T')[0], due_date: '', total: '', tax_total: '' });
            logAction('DESPESA', `Registada compra ${data.invoice_number} de ${data.total}€`);
        } else { 
            alert("Erro ao criar compra."); 
        }
    };

    const generatePDFBlob = async (dataOverride?: any): Promise<Blob> => {
        const doc = new jsPDF();
        const dataToUse = dataOverride || invoiceData;
        let subtotal = 0; let taxTotal = 0;
        dataToUse.items.forEach((item: any) => {
            const price = item.price !== undefined ? item.price : item.unit_price;
            const tax = item.tax !== undefined ? item.tax : item.tax_rate;
            const qty = item.quantity;
            const lineTotal = qty * price;
            subtotal += lineTotal;
            taxTotal += lineTotal * (tax / 100);
        });
        const totals = { subtotal, taxTotal, total: subtotal + taxTotal };
        const client = clients.find(c => c.id === dataToUse.client_id) || { name: 'Cliente Final', address: '', nif: '', city: '', postal_code: '', country: '' };
        const templateToUse = companyForm.invoice_template_url || companyForm.template_url;
        if (templateToUse) {
            try {
                const img = new Image(); img.src = templateToUse; img.crossOrigin = "Anonymous";
                await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
                doc.addImage(img, 'PNG', 0, 0, 210, 297);
            } catch (e) { console.error("Erro template", e); }
        }
        doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(0);
        if (!templateToUse) doc.text(companyForm.name || 'MINHA EMPRESA', 15, 20);
        doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(80);
        if (!templateToUse) { doc.text(companyForm.address || '', 15, 26); doc.text(`NIF: ${companyForm.nif || 'N/A'} | ${companyForm.country}`, 15, 31); }
        doc.setFillColor(250, 250, 250); doc.rect(110, 45, 85, 35, 'F');
        doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(0);
        doc.text(client.name, 115, 52);
        doc.setFont("helvetica", "normal"); doc.setFontSize(10);
        doc.text(client.address || '', 115, 58); doc.text(`${client.postal_code || ''} ${client.city || ''}`, 115, 63); doc.text(client.country || '', 115, 68);
        if (client.nif) { doc.setFontSize(9); doc.setTextColor(100); doc.text(`NIF: ${client.nif}`, 115, 75); }
        const docNum = dataToUse.invoice_number || "RASCUNHO";
        doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(0);
        doc.text(`${invoiceTypesMap[dataToUse.type] || dataToUse.type} ${docNum}`, 15, 60);
        doc.setFontSize(10); doc.setTextColor(80);
        doc.text(`Data: ${new Date(dataToUse.date).toLocaleDateString()}`, 15, 66);
        doc.text(`Vencimento: ${new Date(dataToUse.due_date).toLocaleDateString()}`, 15, 71);
        const tableRows = dataToUse.items.map((item: any) => {
            const price = item.price ?? item.unit_price;
            const tax = item.tax ?? item.tax_rate;
            return [item.description, item.quantity, `${displaySymbol} ${price.toFixed(2)}`, `${tax}%`, `${displaySymbol} ${(item.quantity * price).toFixed(2)}`];
        });
        autoTable(doc, {
            head: [["DESCRIÇÃO", "QTD", "PREÇO UNIT.", "IVA", "TOTAL"]], body: tableRows, startY: 90, theme: 'plain', headStyles: { fillColor: false, textColor: 0, fontStyle: 'bold', lineWidth: { bottom: 0.5 }, lineColor: 0 }, styles: { fontSize: 9, cellPadding: 3, font: "helvetica", textColor: 50 }, columnStyles: { 0: { cellWidth: 'auto' }, 1: { halign: 'center', cellWidth: 20 }, 2: { halign: 'right', cellWidth: 30 }, 3: { halign: 'center', cellWidth: 20 }, 4: { halign: 'right', cellWidth: 30 } }, didDrawPage: (d: any) => { doc.setDrawColor(0); doc.setLineWidth(0.1); doc.line(15, d.cursor.y, 195, d.cursor.y); }
        });
        const finalY = (doc as any).lastAutoTable?.finalY || 150;
        doc.setDrawColor(0); doc.setLineWidth(0.1); doc.line(130, finalY, 195, finalY);
        doc.setFontSize(10); doc.setTextColor(0);
        doc.text("Total Ilíquido:", 130, finalY + 6); doc.text(`${displaySymbol} ${totals.subtotal.toFixed(2)}`, 195, finalY + 6, { align: 'right' });
        doc.text("Total IVA:", 130, finalY + 12); doc.text(`${displaySymbol} ${totals.taxTotal.toFixed(2)}`, 195, finalY + 12, { align: 'right' });
        doc.setLineWidth(0.5); doc.line(130, finalY + 16, 195, finalY + 16); doc.setLineWidth(0.1); doc.line(130, finalY + 17, 195, finalY + 17);
        doc.setFontSize(12); doc.setFont("helvetica", "bold");
        doc.text("TOTAL A PAGAR:", 130, finalY + 24); doc.text(`${displaySymbol} ${totals.total.toFixed(2)}`, 195, finalY + 24, { align: 'right' });
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8); doc.setTextColor(100); doc.setFont('helvetica', 'normal');
        if (companyForm.footer) { doc.text(companyForm.footer, 105, pageHeight - 20, { align: 'center' }); }
        doc.setDrawColor(200); doc.line(15, pageHeight - 15, 195, pageHeight - 15);
        doc.text(`Processado por EasyCheck ERP - ${companyForm.name} - Pag. 1/1`, 105, pageHeight - 10, { align: 'center' });
        return doc.output('blob');
    };

    const handleGenerateReminder = async (invoice: any, level: number) => {
        const doc = new jsPDF();
        const client = clients.find(c => c.id === invoice.client_id);
        if (!client) return alert("Cliente não encontrado");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10); doc.setTextColor(100);
        doc.text(companyForm.name, 15, 20); doc.text(companyForm.address, 15, 25);
        doc.setFontSize(11); doc.setTextColor(0); doc.setFont("helvetica", "bold");
        doc.text(client.name, 120, 50); doc.setFont("helvetica", "normal");
        doc.text(client.address || '', 120, 55); doc.text(`${client.postal_code || ''} ${client.city || ''}`, 120, 60);
        doc.setFontSize(14); doc.setFont("helvetica", "bold");
        let title = ""; let body = ""; let color = [0, 0, 0];
        if (level === 1) {
            title = "Lembrete de Pagamento";
            body = `Estimado(a) Cliente,\n\nVerificámos que a fatura n.º ${invoice.invoice_number}, vencida a ${new Date(invoice.due_date).toLocaleDateString()}, no valor de ${displaySymbol} ${invoice.total.toFixed(2)}, se encontra pendente de liquidação.\n\nProvavelmente trata-se de um lapso da vossa parte. Agradecemos a regularização da mesma o mais breve possível.\n\nCom os melhores cumprimentos,`;
            color = [0, 100, 200];
        } else if (level === 2) {
            title = "AVISO DE PAGAMENTO EM ATRASO";
            body = `Exmos. Srs.,\n\nApesar dos nossos contactos anteriores, constatamos que a fatura n.º ${invoice.invoice_number} permanece por liquidar.\n\nSolicitamos o pagamento imediato da quantia de ${displaySymbol} ${invoice.total.toFixed(2)} para evitar a suspensão de serviços ou fornecimentos.\n\nSe o pagamento já foi efetuado, por favor ignore este aviso.\n\nAtentamente,`;
            color = [200, 100, 0];
        } else {
            title = "ÚLTIMO AVISO - PRÉ-CONTENCIOSO";
            body = `NOTIFICAÇÃO FORMAL,\n\nInformamos que, não tendo sido regularizada a dívida referente à fatura ${invoice.invoice_number} (${displaySymbol} ${invoice.total.toFixed(2)}), o processo será encaminhado para o nosso departamento jurídico para cobrança coerciva.\n\nDispõe de 48 horas para efetuar o pagamento antes do início das diligências legais e acrescido de juros de mora.\n\nDepartamento Financeiro,`;
            color = [200, 0, 0];
        }
        doc.setTextColor(color[0], color[1], color[2]); doc.text(title, 15, 90);
        doc.setTextColor(0); doc.setFontSize(10); doc.setFont("helvetica", "normal");
        const splitBody = doc.splitTextToSize(body, 170); doc.text(splitBody, 15, 105);
        doc.setDrawColor(200); doc.rect(15, 180, 180, 30);
        doc.setFont("helvetica", "bold"); doc.text("DADOS PARA PAGAMENTO", 20, 190);
        doc.setFont("helvetica", "normal"); doc.text(`Valor: ${displaySymbol} ${invoice.total.toFixed(2)}`, 20, 200); doc.text(`Referência: ${invoice.invoice_number}`, 100, 200);
        window.open(URL.createObjectURL(doc.output('blob')), '_blank');
    };

    const generateFinancialReport = (type: 'balancete' | 'dre') => {
        if (journalEntries.length === 0) return alert("Não há movimentos contabilísticos para gerar relatório.");
        const doc = new jsPDF();
        const title = type === 'balancete' ? 'Balancete de Verificação' : 'Demonstração de Resultados';
        doc.setFontSize(18); doc.setFont("helvetica", "bold"); doc.text(companyForm.name, 15, 20);
        doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.text(`NIF: ${companyForm.nif} | Exercício: ${new Date().getFullYear()}`, 15, 26);
        doc.setFontSize(14); doc.setTextColor(50); doc.text(title.toUpperCase(), 15, 40); doc.setTextColor(0);
        const accountBalances: Record<string, { name: string, debit: number, credit: number }> = {};
        journalEntries.forEach(entry => {
            entry.journal_items.forEach((item: any) => {
                const code = item.company_accounts?.code;
                const name = item.company_accounts?.name;
                if (!code) return;
                if (!accountBalances[code]) accountBalances[code] = { name, debit: 0, credit: 0 };
                accountBalances[code].debit += item.debit;
                accountBalances[code].credit += item.credit;
            });
        });
        const rows: any[] = []; let totalDebit = 0; let totalCredit = 0;
        Object.keys(accountBalances).sort().forEach(code => {
            const acc = accountBalances[code];
            if (type === 'dre' && !code.startsWith('6') && !code.startsWith('7') && !code.startsWith('3') && !code.startsWith('4') && !code.startsWith('5')) return;
            const balance = acc.debit - acc.credit;
            rows.push([code, acc.name, displaySymbol + acc.debit.toFixed(2), displaySymbol + acc.credit.toFixed(2), displaySymbol + balance.toFixed(2)]);
            totalDebit += acc.debit; totalCredit += acc.credit;
        });
        autoTable(doc, { startY: 50, head: [['CONTA', 'DESCRIÇÃO', 'DÉBITO', 'CRÉDITO', 'SALDO']], body: rows, theme: 'striped', styles: { fontSize: 9, cellPadding: 2, font: "helvetica" }, headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: 'bold' }, columnStyles: { 0: { fontStyle: 'bold', cellWidth: 25 }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right', fontStyle: 'bold' } } });
        const finalY = (doc as any).lastAutoTable?.finalY || 100;
        doc.setFont("helvetica", "bold");
        if (type === 'balancete') {
            doc.text(`TOTAL GERAL:`, 15, finalY + 10); doc.text(displaySymbol + totalDebit.toFixed(2), 100, finalY + 10, { align: 'right' }); doc.text(displaySymbol + totalCredit.toFixed(2), 135, finalY + 10, { align: 'right' });
            if (Math.abs(totalDebit - totalCredit) < 0.01) { doc.setTextColor(0, 150, 0); doc.text("OK - BALANCEADO", 150, finalY + 10); } else { doc.setTextColor(200, 0, 0); doc.text("DESEQUILÍBRIO!", 150, finalY + 10); }
        } else {
            const result = totalCredit - totalDebit; doc.setFontSize(12); doc.text(`RESULTADO LÍQUIDO ESTIMADO: ${displaySymbol} ${result.toFixed(2)}`, 15, finalY + 10);
        }
        window.open(URL.createObjectURL(doc.output('blob')), '_blank');
        logAction('RELATÓRIO', `Gerado ${title}`);
    };

    const handleSaveJournalEntry = async () => {
        if (!newTransaction.description) return alert("Indique uma descrição.");
        if (!isGridBalanced()) return alert("O lançamento não está balanceado (Débito ≠ Crédito).");
        const { data: entry, error } = await supabase.from('journal_entries').insert([{ user_id: userData.id, description: newTransaction.description, date: newTransaction.date, document_ref: 'MANUAL' }]).select().single();
        if (error) return alert("Erro ao criar lançamento.");
        const linesToInsert = journalGrid.filter(l => l.account_id && (l.debit > 0 || l.credit > 0)).map(line => ({ entry_id: entry.id, account_id: line.account_id, debit: line.debit, credit: line.credit }));
        await supabase.from('journal_items').insert(linesToInsert);
        const { data: updatedJournal } = await supabase.from('journal_entries').select('*, journal_items(debit, credit, company_accounts(code, name))').order('date', { ascending: false });
        if (updatedJournal) setJournalEntries(updatedJournal);
        logAction('DIARIO', `Lançamento manual: ${newTransaction.description}`);
        setShowTransactionModal(false); setJournalGrid([{ account_id: '', debit: 0, credit: 0 }, { account_id: '', debit: 0, credit: 0 }]);
        alert("Lançamento gravado com sucesso!");
    };

    const handleResetFinancials = async () => {
        if (window.confirm("⚠️ ZONA DE PERIGO ⚠️\n\nIsto vai APAGAR:\n- Todas as Faturas\n- Todas as Compras\n- Todo o Diário\n\nTem a certeza absoluta?")) {
            if (window.prompt("Escreva 'RESET' para confirmar:") === 'RESET') {
                await supabase.from('journal_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                await supabase.from('journal_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                await supabase.from('invoice_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                await supabase.from('invoices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                await supabase.from('purchases').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                await logAction('RESET', 'Reset Financeiro Executado');
                setJournalEntries([]); setRealInvoices([]); setPurchases([]);
                alert("Sistema limpo com sucesso!");
            }
        }
    };

    const handleOpenDoubtful = (client: any) => { 
        setSelectedClientForDebt(client); 
        setShowDoubtfulModal(true); 
    };

    const saveDoubtfulDebt = async () => {
        if (!selectedClientForDebt) return;
        let amount = 0;
        if (debtMethod === 'manual') amount = parseFloat(manualDebtAmount) || 0;
        else {
            const clientInvoices = realInvoices.filter(inv => inv.client_id === selectedClientForDebt.id && selectedDebtInvoices.includes(inv.id));
            amount = clientInvoices.reduce((sum, inv) => sum + inv.total, 0);
        }
        const newStatus = selectedClientForDebt.status === 'doubtful' ? 'active' : 'doubtful';
        const updates = { status: newStatus, doubtful_debt: newStatus === 'doubtful' ? amount : 0 };
        const { error } = await supabase.from('clients').update(updates).eq('id', selectedClientForDebt.id);
        if (!error) {
            setClients(prev => prev.map(c => c.id === selectedClientForDebt.id ? { ...c, ...updates } : c));
            logAction('RISCO', `Cliente ${selectedClientForDebt.name} marcado como ${newStatus} (${amount}€)`);
            setShowDoubtfulModal(false); setManualDebtAmount(''); setSelectedDebtInvoices([]);
        } else { 
            alert("Erro ao atualizar cliente: " + error.message); 
        }
    };

    const handleCreateAsset = async () => {
        if (!newAsset.name || !newAsset.purchase_value) return alert("Preencha dados.");
        const valueInEur = parseFloat(newAsset.purchase_value.toString().replace(',', '.')) / conversionRate;
        let error, data;
        if (editingAssetId) {
            const res = await supabase.from('accounting_assets').update({ ...newAsset, purchase_value: valueInEur }).eq('id', editingAssetId).select();
            error = res.error; data = res.data;
            if (!error && data) setAssets(prev => prev.map(a => a.id === editingAssetId ? data[0] : a));
        } else {
            const res = await supabase.from('accounting_assets').insert([{ user_id: userData.id, name: newAsset.name, purchase_date: newAsset.purchase_date, purchase_value: valueInEur, lifespan_years: newAsset.lifespan_years, amortization_method: newAsset.amortization_method }]).select();
            error = res.error; data = res.data;
            if (!error && data) setAssets([...assets, data[0]]);
        }
        if (!error) {
            setShowAssetModal(false); setEditingAssetId(null);
            setNewAsset({ name: '', category: 'Equipamento', purchase_date: new Date().toISOString().split('T')[0], purchase_value: '', lifespan_years: 3, amortization_method: 'linear' });
        }
    };

    const handleDeleteAsset = async (id: string) => { 
        if (!window.confirm("Apagar este ativo?")) return; 
        const { error } = await supabase.from('accounting_assets').delete().eq('id', id); 
        if (!error) setAssets(prev => prev.filter(a => a.id !== id)); 
    };

    const handleShowAmortSchedule = (asset: any) => { 
        setSelectedAssetForSchedule(asset); 
        setShowAmortSchedule(true); 
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
            setShowEntityModal(false); 
            setEditingEntityId(null); 
            setNewEntity({ name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' });

            if (entityType === 'client' && aiIntentMemory?.pendingAction === 'create_invoice') {
                const newClientId = data[0].id;
                const amount = aiIntentMemory.pendingData?.amount || 0;
                
                resetInvoiceForm();
                setInvoiceData(prev => ({
                    ...prev,
                    client_id: newClientId,
                    items: [{ ...prev.items[0], price: amount }]
                }));
                setShowInvoiceForm(true); 
                setAiIntentMemory(null);
            }
        } else { 
            alert("Erro: " + error?.message); 
        }
    };

    const handleEditEntity = (entity: any, type: 'client' | 'supplier') => { 
        setNewEntity({ name: entity.name, nif: entity.nif, email: entity.email, address: entity.address || '', city: entity.city || '', postal_code: entity.postal_code || '', country: entity.country || 'Portugal' }); 
        setEntityType(type); 
        setEditingEntityId(entity.id); 
        setShowEntityModal(true); 
    };

    const handleDeleteEntity = async (id: string, type: 'client' | 'supplier') => { 
        if (!window.confirm("Apagar este registo?")) return; 
        const table = type === 'client' ? 'clients' : 'suppliers'; 
        const { error } = await supabase.from(table).delete().eq('id', id); 
        if (!error) { 
            if (type === 'client') setClients(prev => prev.filter(c => c.id !== id)); 
            else setSuppliers(prev => prev.filter(s => s.id !== id)); 
        } 
    };

    const handleCreateProvision = async () => {
        if (!newProvision.description || !newProvision.amount) return alert("Dados insuficientes");
        const amountInEur = parseFloat(newProvision.amount) / conversionRate;
        let error = null, data = null;
        if (editingProvisionId) {
            const res = await supabase.from('accounting_provisions').update({ ...newProvision, amount: amountInEur }).eq('id', editingProvisionId).select();
            error = res.error; data = res.data;
            if (!error && data) setProvisions(prev => prev.map(p => p.id === editingProvisionId ? data[0] : p));
        } else {
            const res = await supabase.from('accounting_provisions').insert([{ user_id: userData.id, ...newProvision, amount: amountInEur }]).select();
            error = res.error; data = res.data;
            if (!error && data) setProvisions([data[0], ...provisions]);
        }
        if (!error) {
            setShowProvisionModal(false); setEditingProvisionId(null);
            setNewProvision({ description: '', amount: '', type: 'Riscos e Encargos', date: new Date().toISOString().split('T')[0] });
        }
    };

    const handleSaveProfile = async () => { 
        setSavingProfile(true); 
        try { 
            await supabase.from('profiles').update({ full_name: editForm.fullName, job_title: editForm.jobTitle, updated_at: new Date() }).eq('id', userData.id); 
            setProfileData({ ...profileData, ...{ full_name: editForm.fullName } }); 
            alert(`Perfil atualizado!`); 
            setIsProfileModalOpen(false); 
        } catch { 
            alert("Erro ao guardar."); 
        } finally { 
            setSavingProfile(false); 
        } 
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
                const templateAccounts = ACCOUNTING_TEMPLATES[companyForm.country] || ACCOUNTING_TEMPLATES["Default"];
                if (companyAccounts.length < 5) {
                    const accountsToInsert = templateAccounts.map(acc => ({ user_id: userData.id, code: acc.code, name: acc.name, type: acc.type }));
                    const { data: newAccounts, error } = await supabase.from('company_accounts').upsert(accountsToInsert, { onConflict: 'code, user_id' }).select();
                    if (!error && newAccounts) {
                        const { data: refreshedAccounts } = await supabase.from('company_accounts').select('*').order('code', { ascending: true });
                        if (refreshedAccounts) setCompanyAccounts(refreshedAccounts);
                    }
                }
            }
            alert(`Dados guardados e plano de contas atualizado!`);
        } catch (e: any) { 
            alert("Erro ao guardar: " + e.message); 
        } finally { 
            setSavingCompany(false); 
        }
    };

    const handleQuickPreview = async (inv: any) => { 
        const blob = await generatePDFBlob(inv); 
        setPdfPreviewUrl(URL.createObjectURL(blob)); 
        setShowPreviewModal(true); 
    };

    const handleDownloadPDF = () => { 
        if (pdfPreviewUrl) { 
            const link = document.createElement('a'); 
            link.href = pdfPreviewUrl; 
            link.download = `Documento_${Date.now()}.pdf`; 
            link.click(); 
        } 
    };

    const handleSendChatMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isChatLoading) return;

        const userText = chatInput;
        setChatInput('');
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setIsChatLoading(true);

        try {
            const contextData = { clients: clients };
            const aiResponse = await askGrok(userText, contextData);

            if (aiResponse.action === 'create_invoice') {
                const amount = parseFloat(aiResponse.amount) || 0;
                const clientName = aiResponse.client_name;
                const clientId = aiResponse.client_id;

                if (clientId) {
                    resetInvoiceForm();
                    setInvoiceData(prev => ({
                        ...prev,
                        client_id: clientId,
                        items: [{ ...prev.items[0], price: amount }]
                    }));
                    setShowInvoiceForm(true); 
                    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse.reply || `A abrir fatura para ${clientName}...` }]);
                } 
                else if (clientName) {
                    setNewEntity(prev => ({ ...prev, name: clientName }));
                    setEntityType('client');
                    setAiIntentMemory({
                        pendingAction: 'create_invoice',
                        pendingData: { amount: amount }
                    });
                    setShowEntityModal(true);
                    setMessages(prev => [...prev, { role: 'assistant', content: `O cliente "${clientName}" é novo. Por favor, complete a ficha do cliente (NIF, Morada) e depois abrirei a fatura automaticamente.` }]);
                }
            } 
            else if (aiResponse.action === 'create_client') {
                setNewEntity(prev => ({ ...prev, name: aiResponse.client_name || '' }));
                setEntityType('client');
                setAccountingTab('clients'); 
                setShowEntityModal(true);
                setMessages(prev => [...prev, { role: 'assistant', content: aiResponse.reply }]);
            }
            else if (aiResponse.action === 'create_expense') {
                setShowPurchaseForm(true); 
                setMessages(prev => [...prev, { role: 'assistant', content: "A abrir registo de despesas..." }]);
            }
            else if (aiResponse.action === 'view_report') {
                setAccountingTab('reports');
                navigate('/dashboard/accounting');
                setMessages(prev => [...prev, { role: 'assistant', content: "A abrir área de relatórios..." }]);
            }
            else {
                setMessages(prev => [...prev, { role: 'assistant', content: aiResponse.reply || "Não entendi." }]);
            }

        } catch (error) {
            console.error("Erro no chat:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Erro de conexão com a IA." }]);
        } finally {
            setIsChatLoading(false);
            setTimeout(() => scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 100);
        }
    };

    const selectLanguage = (code: string) => { 
        i18n.changeLanguage(code); 
        setIsLangMenuOpen(false); 
    };

    const toggleTheme = () => { 
        document.documentElement.classList.toggle('dark'); 
        setIsDark(!isDark); 
    };

    const handleLogout = async () => { 
        await supabase.auth.signOut(); 
        navigate('/'); 
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => { 
        const selectedCountry = e.target.value; 
        const newCurrency = getCurrencyCode(selectedCountry); 
        setCompanyForm({ ...companyForm, country: selectedCountry, currency: newCurrency }); 
    };

const handlePayInvoice = async (invoice: any) => {
        if (!window.confirm(`Confirmar o recebimento de ${displaySymbol} ${invoice.total}?`)) return;

        try {
            // 1. Atualiza o estado da fatura para 'paid'
            const { error: invError } = await supabase
                .from('invoices')
                .update({ status: 'paid' })
                .eq('id', invoice.id);

            if (invError) throw invError;

            // 2. Lançamento Contabilístico Automático (Fluxo de Caixa)
            // Procuramos as contas de Banco (12) e Clientes (211)
            const bankAccount = companyAccounts.find(a => a.code.startsWith('12'));
            const clientAccount = companyAccounts.find(a => a.code.startsWith('211'));

            if (bankAccount && clientAccount) {
                const { data: entry } = await supabase.from('journal_entries').insert([{
                    user_id: userData.id,
                    date: new Date().toISOString().split('T')[0],
                    description: `Recebimento Fatura ${invoice.invoice_number}`,
                    document_ref: invoice.invoice_number
                }]).select().single();

                if (entry) {
                    await supabase.from('journal_items').insert([
                        { entry_id: entry.id, account_id: bankAccount.id, debit: invoice.total, credit: 0 },
                        { entry_id: entry.id, account_id: clientAccount.id, debit: 0, credit: invoice.total }
                    ]);
                }
            }

            // 3. Atualiza as listas locais para refletir a mudança no site sem refresh
            setRealInvoices(prev => prev.map(inv => inv.id === invoice.id ? { ...inv, status: 'paid' } : inv));
            
            // Recarrega o diário para o gráfico atualizar
            const { data: updatedJournal } = await supabase.from('journal_entries').select('*, journal_items(debit, credit, company_accounts(code, name, type))').order('date', { ascending: false });
            if (updatedJournal) setJournalEntries(updatedJournal);

            logAction('PAGAMENTO', `Recebimento registado: ${invoice.invoice_number}`);
            alert("Pagamento registado com sucesso!");

        } catch (error: any) {
            alert("Erro ao registar pagamento: " + error.message);
        }
    };
    // ==========================================
    // RETORNO (API DO HOOK)
    // ==========================================
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
        toggleTheme, handleLogout, handleCountryChange
    };
};