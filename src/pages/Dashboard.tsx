import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  LayoutDashboard, MessageSquare, FileText, Users, BarChart3, Settings, LogOut, Menu, X, 
  Globe, Moon, Sun, ChevronDown, Eye, EyeOff, User, Trash2, AlertTriangle, Building2, 
  Copy, Send, Shield, Mail, Plus, Search, FileCheck, Calculator, TrendingUp, Archive, 
  TrendingDown, Landmark, PieChart, FileSpreadsheet, Bell, Calendar, Printer, List, 
  BookOpen, CreditCard, Box, Save, Briefcase, Truck, RefreshCw, CheckCircle, 
  AlertCircle, Edit2, Download, Image as ImageIcon, UploadCloud, AlertOctagon, 
  TrendingUp as TrendingUpIcon, MoreVertical, Palette, FileInput, Paperclip
} from 'lucide-react';

// ==========================================
// 1. DADOS ESTÁTICOS
// ==========================================

const countries = [
  "Portugal", "Brasil", "Angola", "Moçambique", "Cabo Verde", 
  "France", "Deutschland", "United Kingdom", "España", "United States", 
  "Italia", "Belgique", "Suisse", "Luxembourg"
];

const invoiceTypesMap: Record<string, string> = {
    "Fatura": "FT", "Fatura-Recibo": "FR", "Fatura Simplificada": "FS", "Fatura Proforma": "FP",
    "Nota de Crédito": "NC", "Nota de Débito": "ND", "Recibo": "RC", "Orçamento": "OR",
    "Guia de Transporte": "GT"
};
const invoiceTypes = Object.keys(invoiceTypesMap);

const languages = [ 
  { code: 'pt', label: 'Português', flag: '🇵🇹' }, 
  { code: 'en', label: 'English', flag: '🇬🇧' }, 
  { code: 'fr', label: 'Français', flag: '🇫🇷' }, 
  { code: 'es', label: 'Español', flag: '🇪🇸' }, 
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' }
];

const defaultRates: Record<string, number> = { 
  'EUR': 1, 'USD': 1.05, 'BRL': 6.15, 'AOA': 930, 'MZN': 69, 'CVE': 110.27, 'CHF': 0.94, 'GBP': 0.83 
};

const countryCurrencyMap: Record<string, string> = { 
  "Portugal": "EUR", "France": "EUR", "Deutschland": "EUR", "España": "EUR", 
  "Italia": "EUR", "Belgique": "EUR", "Luxembourg": "EUR", "Brasil": "BRL", 
  "United States": "USD", "United Kingdom": "GBP", "Angola": "AOA", 
  "Moçambique": "MZN", "Cabo Verde": "CVE", "Suisse": "CHF" 
};

const currencySymbols: Record<string, string> = { 
  'EUR': '€', 'USD': '$', 'BRL': 'R$', 'AOA': 'Kz', 'MZN': 'MT', 'CVE': 'Esc', 'CHF': 'CHF', 'GBP': '£' 
};

const vatRatesByCountry: Record<string, number[]> = {
    "Portugal": [23, 13, 6, 0], "Luxembourg": [17, 14, 8, 3, 0], "Brasil": [17, 18, 12, 0],
    "Angola": [14, 7, 5, 0], "Moçambique": [16, 0], "Cabo Verde": [15, 0],
    "France": [20, 10, 5.5, 0], "Deutschland": [19, 7, 0], "España": [21, 10, 4, 0],
    "Italia": [22, 10, 5, 0], "Belgique": [21, 12, 6, 0], "Suisse": [8.1, 2.6, 0],
    "United Kingdom": [20, 5, 0], "United States": [0, 5, 10]
};

// ==========================================
// 2. INTERFACES
// ==========================================

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  tax: number;
}

interface InvoiceData {
  id: string;
  client_id: string;
  type: string;
  invoice_number?: string;
  date: string;
  due_date: string;
  status: 'draft' | 'issued' | 'paid' | 'void';
  exemption_reason: string;
  items: InvoiceItem[];
}

// ==========================================
// 3. COMPONENTE DASHBOARD
// ==========================================

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://easycheck-api.onrender.com';

  // --- ESTADOS DE UI ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [showFinancials, setShowFinancials] = useState(true); 
  const [showPageCode, setShowPageCode] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // --- ESTADOS DE DADOS ---
  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [accountingTab, setAccountingTab] = useState('overview'); 
  
  const [transactions, setTransactions] = useState<any[]>([]); 
  const [realInvoices, setRealInvoices] = useState<any[]>([]); 
  const [purchases, setPurchases] = useState<any[]>([]); 
  const [assets, setAssets] = useState<any[]>([]); 
  const [clients, setClients] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]); 
  const [provisions, setProvisions] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<any>(defaultRates);
  const [chartOfAccounts, setChartOfAccounts] = useState<any[]>([]);

  // --- MODAIS ---
  const [modals, setModals] = useState({
    invoice: false, purchase: false, entity: false, asset: false,
    transaction: false, preview: false, settings: false, delete: false,
    doubtful: false, provision: false, amortSchedule: false
  });
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // --- FORMULÁRIOS & EDIÇÃO ---
  const [entityType, setEntityType] = useState<'client' | 'supplier'>('client'); 
  const [editingEntityId, setEditingEntityId] = useState<string | null>(null);
  const [editingProvisionId, setEditingProvisionId] = useState<string | null>(null);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const [selectedClientForDebt, setSelectedClientForDebt] = useState<any>(null);
  const [debtMethod, setDebtMethod] = useState<'manual' | 'invoices'>('manual');
  const [manualDebtAmount, setManualDebtAmount] = useState('');
  const [selectedDebtInvoices, setSelectedDebtInvoices] = useState<string[]>([]);
  const [selectedAssetForSchedule, setSelectedAssetForSchedule] = useState<any>(null);
  
  const [editForm, setEditForm] = useState({ fullName: '', jobTitle: '', email: '' });
  
  const [companyForm, setCompanyForm] = useState({ 
    name: '', country: 'Portugal', currency: 'EUR', 
    address: '', nif: '', logo_url: '', footer: '', 
    invoice_color: '#2563EB', header_text: '', template_url: '' 
  });
  
  const [newTransaction, setNewTransaction] = useState({ description: '', amount: '', type: 'expense', category: '', date: new Date().toISOString().split('T')[0] });
  const [newAsset, setNewAsset] = useState({ name: '', category: 'Equipamento', purchase_date: new Date().toISOString().split('T')[0], purchase_value: '', lifespan_years: 3, amortization_method: 'linear' });
  const [newEntity, setNewEntity] = useState({ name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' });
  const [newProvision, setNewProvision] = useState({ description: '', amount: '', type: 'Riscos e Encargos', date: new Date().toISOString().split('T')[0] });
  const [newPurchase, setNewPurchase] = useState({ supplier_id: '', invoice_number: '', date: new Date().toISOString().split('T')[0], due_date: '', total: '', tax_total: '' });

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
      id: '', client_id: '', type: 'Fatura', invoice_number: '',
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      status: 'draft', exemption_reason: '',
      items: [{ description: '', quantity: 1, price: 0, tax: 23 }] 
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);

  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Olá! Sou o seu assistente EasyCheck IA. Em que posso ajudar hoje?' }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // 4. HELPERS E CÁLCULOS
  // ==========================================

  const getCurrencyCode = (country: string) => countryCurrencyMap[country] || 'EUR';
  const getCurrencySymbol = (code: string) => currencySymbols[code] || '€';
  const getCurrentCountryVatRates = () => vatRatesByCountry[companyForm.country || "Portugal"] || [23, 0];
  const currentCurrency = companyForm.currency || 'EUR';
  const conversionRate = exchangeRates[currentCurrency] || 1;
  const displaySymbol = getCurrencySymbol(currentCurrency);

  const totalRevenue = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0) * conversionRate;
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0) * conversionRate;
  const currentBalance = totalRevenue - totalExpenses;
  const totalInvoicesCount = realInvoices.length;

  const getInitials = (name: string) => name ? (name.split(' ').length > 1 ? (name.split(' ')[0][0] + name.split(' ')[name.split(' ').length - 1][0]) : name.substring(0, 2)).toUpperCase() : 'EC';

  // --- CÁLCULO DE AMORTIZAÇÃO ---
  const calculateAmortizationSchedule = (asset: any) => {
      if (!asset) return [];
      const schedule = [];
      let currentValue = parseFloat(asset.purchase_value);
      const lifespan = parseInt(asset.lifespan_years);
      const startYear = new Date(asset.purchase_date).getFullYear();
      let coef = 1.0;
      if (asset.amortization_method === 'degressive') { if (lifespan >= 5 && lifespan < 6) coef = 1.5; else if (lifespan >= 6) coef = 2.0; else coef = 2.5; }
      const linearRate = 1 / lifespan;
      const degressiveRate = linearRate * coef;
      for (let i = 0; i < lifespan; i++) {
          let annuity = 0;
          if (asset.amortization_method === 'linear') { annuity = asset.purchase_value / lifespan; } 
          else { 
            const remainingYears = lifespan - i; const currentLinearAnnuity = currentValue / remainingYears; const currentDegressiveAnnuity = currentValue * degressiveRate;
            annuity = (currentDegressiveAnnuity < currentLinearAnnuity || i === lifespan - 1) ? currentLinearAnnuity : currentDegressiveAnnuity;
          }
          if (currentValue - annuity < 0.01) annuity = currentValue;
          schedule.push({ year: startYear + i, startValue: currentValue, annuity: annuity, accumulated: asset.purchase_value - (currentValue - annuity), endValue: currentValue - annuity });
          currentValue -= annuity; if (currentValue < 0) currentValue = 0;
      }
      return schedule;
  };

  const getCurrentAssetValue = (asset: any) => {
      const schedule = calculateAmortizationSchedule(asset);
      const currentYear = new Date().getFullYear();
      const entry = schedule.find((s: any) => s.year === currentYear);
      if (!entry) { const last = schedule[schedule.length - 1]; if (last && currentYear > last.year) return 0; return asset.purchase_value; }
      return entry.endValue;
  };

  const calculateInvoiceTotals = () => {
      let subtotal = 0; let taxTotal = 0;
      invoiceData.items.forEach(item => { const lineTotal = item.quantity * item.price; subtotal += lineTotal; taxTotal += lineTotal * (item.tax / 100); });
      return { subtotal, taxTotal, total: subtotal + taxTotal };
  };

  // ==========================================
  // 5. FETCH DATA (EFEITOS)
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
                name: profile.company_name, country: profile.country || 'Portugal', currency: initialCurrency, 
                address: profile.company_address || '', nif: profile.company_nif || '', 
                logo_url: profile.logo_url || '', footer: profile.company_footer || '', 
                invoice_color: profile.invoice_color || '#2563EB', 
                header_text: profile.header_text || '', template_url: profile.template_url || ''
            });
            if (profile.custom_exchange_rates) { setExchangeRates({ ...defaultRates, ...profile.custom_exchange_rates }); }
        }
        
        const [tr, inv, pur, ass, cl, sup, prov] = await Promise.all([
             supabase.from('transactions').select('*').order('date', { ascending: false }),
             supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false }),
             supabase.from('purchases').select('*, suppliers(name)').order('date', { ascending: false }),
             supabase.from('accounting_assets').select('*'),
             supabase.from('clients').select('*'),
             supabase.from('suppliers').select('*'),
             supabase.from('accounting_provisions').select('*')
        ]);
        if (tr.data) setTransactions(tr.data); if (inv.data) setRealInvoices(inv.data);
        if (pur.data) setPurchases(pur.data); if (ass.data) setAssets(ass.data);
        if (cl.data) setClients(cl.data); if (sup.data) setSuppliers(sup.data);
        if (prov.data) setProvisions(prov.data);
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
      if (invoiceData.type.includes('Isenta') || invoiceData.type.includes('Intracomunitária')) { newTax = 0; exemption = invoiceData.type.includes('Intracomunitária') ? 'Isento Artigo 14.º RITI' : 'IVA - Autoliquidação'; }
      const updatedItems = invoiceData.items.map(item => ({ ...item, tax: (item.tax === 0 && newTax !== 0) || (item.tax !== 0 && newTax === 0) ? newTax : item.tax }));
      setInvoiceData(prev => ({ ...prev, items: updatedItems, exemption_reason: exemption }));
  }, [invoiceData.type]); 

  // ==========================================
  // 6. FUNÇÕES DE AÇÃO (HANDLERS)
  // ==========================================

  const copyCode = () => { if(profileData?.company_code) { navigator.clipboard.writeText(profileData.company_code); alert("Código copiado!"); } };
  const selectLanguage = (code: string) => { i18n.changeLanguage(code); setIsLangMenuOpen(false); };
  const toggleTheme = () => { document.documentElement.classList.toggle('dark'); setIsDark(!isDark); };
  const toggleFinancials = () => setShowFinancials(!showFinancials);
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => { const val = e.target.value; setCompanyForm({ ...companyForm, country: val, currency: getCurrencyCode(val) }); };
  const handleRateChange = (curr: string, val: string) => { setExchangeRates((prev: any) => ({ ...prev, [curr]: parseFloat(val) || 0 })); };

  // --- UPLOADS ---
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploadingLogo(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userData.id}/logo_${Date.now()}.${fileExt}`;
      try {
          const { error: uploadError } = await supabase.storage.from('company-logos').upload(fileName, file, { upsert: true });
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from('company-logos').getPublicUrl(fileName);
          setCompanyForm(prev => ({ ...prev, logo_url: data.publicUrl }));
          await supabase.from('profiles').update({ logo_url: data.publicUrl }).eq('id', userData.id);
          alert("Logo carregado com sucesso!");
      } catch (error: any) { alert("Erro ao carregar logo: " + error.message); } finally { setUploadingLogo(false); }
  };

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploadingLogo(true);
      const file = e.target.files[0];
      const fileName = `${userData.id}/template_${Date.now()}.png`;
      try {
          const { error: uploadError } = await supabase.storage.from('company-logos').upload(fileName, file, { upsert: true });
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from('company-logos').getPublicUrl(fileName);
          setCompanyForm(prev => ({ ...prev, template_url: data.publicUrl }));
          await supabase.from('profiles').update({ template_url: data.publicUrl }).eq('id', userData.id);
          alert("Template carregado!");
      } catch (error: any) { alert("Erro: " + error.message); } finally { setUploadingLogo(false); }
  };

  // --- FATURAÇÃO ---
  const handleAddInvoiceItem = () => { const currentTax = getCurrentCountryVatRates()[0]; setInvoiceData({ ...invoiceData, items: [...invoiceData.items, { description: '', quantity: 1, price: 0, tax: currentTax }] }); };
  const handleRemoveInvoiceItem = (index: number) => { const newItems = [...invoiceData.items]; newItems.splice(index, 1); setInvoiceData({ ...invoiceData, items: newItems }); };
  const updateInvoiceItem = (index: number, field: string, value: string | number) => { const newItems: any = [...invoiceData.items]; newItems[index][field] = value; setInvoiceData({ ...invoiceData, items: newItems }); };

  const handleSaveInvoice = async () => {
      const totals = calculateInvoiceTotals();
      let docNumber = invoiceData.invoice_number;
      if (!docNumber) { const prefix = invoiceTypesMap[invoiceData.type] || 'DOC'; docNumber = `${prefix} ${new Date().getFullYear()}/${realInvoices.length + 1}`; }
      
      let error, data;
      if (invoiceData.id) {
          const res = await supabase.from('invoices').update({ client_id: invoiceData.client_id, type: invoiceData.type, date: invoiceData.date, due_date: invoiceData.due_date, exemption_reason: invoiceData.exemption_reason, subtotal: totals.subtotal, tax_total: totals.taxTotal, total: totals.total, status: invoiceData.status }).eq('id', invoiceData.id).select().single();
          error = res.error; data = res.data;
          if (!error) await supabase.from('invoice_items').delete().eq('invoice_id', invoiceData.id);
      } else {
          const res = await supabase.from('invoices').insert([{ user_id: userData.id, client_id: invoiceData.client_id, type: invoiceData.type, invoice_number: docNumber, date: invoiceData.date, due_date: invoiceData.due_date, exemption_reason: invoiceData.exemption_reason, subtotal: totals.subtotal, tax_total: totals.taxTotal, total: totals.total, currency: currentCurrency, status: 'issued' }]).select().single();
          error = res.error; data = res.data;
      }
      if (error) return alert("Erro ao guardar fatura: " + error.message);
      const itemsToInsert = invoiceData.items.map(item => ({ invoice_id: data.id, description: item.description, quantity: item.quantity, unit_price: item.price, tax_rate: item.tax }));
      await supabase.from('invoice_items').insert(itemsToInsert);
      const { data: updatedInvoices } = await supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false }); 
      if (updatedInvoices) setRealInvoices(updatedInvoices);
      setModals({...modals, invoice: false}); resetInvoiceForm(); alert("Documento emitido com sucesso!");
  };

  const resetInvoiceForm = () => { setInvoiceData({ id: '', client_id: '', type: 'Fatura', invoice_number: '', date: new Date().toISOString().split('T')[0], due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], exemption_reason: '', items: [{ description: '', quantity: 1, price: 0, tax: 0 }], status: 'draft' }); };

  const handleEditInvoice = async (invoice: any) => {
      const { data: items } = await supabase.from('invoice_items').select('*').eq('invoice_id', invoice.id);
      setInvoiceData({ id: invoice.id, client_id: invoice.client_id, type: invoice.type, invoice_number: invoice.invoice_number, date: invoice.date, due_date: invoice.due_date, exemption_reason: invoice.exemption_reason || '', status: invoice.status, items: items ? items.map((i: any) => ({ description: i.description, quantity: i.quantity, price: i.unit_price, tax: i.tax_rate })) : [] });
      setModals({...modals, invoice: true});
  };

  const handleDeleteInvoice = async (id: string) => { if (window.confirm("ATENÇÃO: Apagar uma fatura emitida pode ter implicações fiscais.\nTem a certeza absoluta?")) { const { error } = await supabase.from('invoices').delete().eq('id', id); if (!error) setRealInvoices(prev => prev.filter(i => i.id !== id)); } };

  // --- PDF ENGINE ---
  const generatePDFBlob = async (dataOverride?: any): Promise<Blob> => {
      const doc = new jsPDF();
      const dataToUse = dataOverride || invoiceData;
      let subtotal = 0; let taxTotal = 0;
      dataToUse.items.forEach((item: any) => { const price = item.price ?? item.unit_price; const tax = item.tax ?? item.tax_rate; subtotal += item.quantity * price; taxTotal += (item.quantity * price) * (tax/100); });
      const totals = { subtotal, taxTotal, total: subtotal + taxTotal };
      const client = clients.find(c => c.id === dataToUse.client_id) || { name: 'Cliente Final', address: '', nif: '', city: '', postal_code: '', country: '' };
      
      if(companyForm.template_url) { try { const img = new Image(); img.src = companyForm.template_url; img.crossOrigin = "Anonymous"; await new Promise((r) => { img.onload = r; img.onerror = r; }); doc.addImage(img, 'PNG', 0, 0, 210, 297); } catch {} }
      if(!companyForm.template_url) { doc.setFillColor(companyForm.invoice_color || '#2563EB'); doc.rect(0, 0, 210, 8, 'F'); }
      if (companyForm.logo_url) { try { const img = new Image(); img.src = companyForm.logo_url; img.crossOrigin = "Anonymous"; await new Promise((r) => { img.onload = r; img.onerror = r; }); doc.addImage(img, 'PNG', 15, 15, 30, 20); } catch {} }
      if(companyForm.header_text) { doc.setFontSize(8); doc.setTextColor(100); doc.text(companyForm.header_text, 105, 18, { align: 'center' }); }

      doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(40); doc.text(companyForm.name || 'Minha Empresa', 200, 20, { align: 'right' });
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(80); doc.text(companyForm.address || '', 200, 25, { align: 'right' }); doc.text(`${companyForm.country}, NIF: ${companyForm.nif || 'N/A'}`, 200, 30, { align: 'right' });

      doc.setDrawColor(200); doc.setFillColor(250, 250, 250); doc.rect(15, 45, 180, 20, 'FD');
      doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(companyForm.invoice_color || '#2563EB'); doc.text(dataToUse.type.toUpperCase(), 20, 58);
      doc.setFontSize(10); doc.setTextColor(100); doc.text(`Nº ${dataToUse.invoice_number || "RASCUNHO"}`, 150, 53); doc.text(`Data: ${dataToUse.date}`, 150, 60);

      doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(0); doc.text("Faturar a:", 15, 80); doc.text(client.name, 15, 85);
      doc.setFont("helvetica", "normal"); doc.setTextColor(50); if(client.address) doc.text(client.address, 15, 90); if(client.nif) doc.text(`NIF: ${client.nif}`, 15, 95);

      const tableRows = dataToUse.items.map((item: any) => { const price = item.price ?? item.unit_price; const tax = item.tax ?? item.tax_rate; return [ item.description, item.quantity, `${displaySymbol} ${price.toFixed(2)}`, `${tax}%`, `${displaySymbol} ${(item.quantity * price).toFixed(2)}` ]; });
      autoTable(doc, { head: [["Descrição", "Qtd", "Preço Unit.", "IVA", "Total"]], body: tableRows, startY: 105, theme: 'grid', headStyles: { fillColor: companyForm.invoice_color || '#2563EB', textColor: 255 }, styles: { fontSize: 9 } });
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      const summaryX = 130; doc.setFontSize(10); doc.text(`Ilíquido:`, summaryX, finalY + 5); doc.text(`${displaySymbol} ${totals.subtotal.toFixed(2)}`, 195, finalY + 5, { align: 'right' }); doc.text(`Total IVA:`, summaryX, finalY + 10); doc.text(`${displaySymbol} ${totals.taxTotal.toFixed(2)}`, 195, finalY + 10, { align: 'right' }); doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(companyForm.invoice_color || '#2563EB'); doc.text(`TOTAL:`, summaryX, finalY + 18); doc.text(`${displaySymbol} ${totals.total.toFixed(2)}`, 195, finalY + 18, { align: 'right' });

      if(!companyForm.template_url) { doc.setDrawColor(companyForm.invoice_color || '#2563EB'); doc.line(15, doc.internal.pageSize.height - 15, 195, doc.internal.pageSize.height - 15); }
      doc.setFontSize(7); doc.setTextColor(150); if (companyForm.footer) doc.text(companyForm.footer, 105, doc.internal.pageSize.height - 10, { align: 'center' });
      return doc.output('blob');
  };
  const handleQuickPreview = async (invoice: any) => { const { data: items } = await supabase.from('invoice_items').select('*').eq('invoice_id', invoice.id); if (!items) return alert("Erro itens."); const full = { ...invoice, items: items.map((i: any) => ({ description: i.description, quantity: i.quantity, price: i.unit_price, tax: i.tax_rate })) }; try { const blob = await generatePDFBlob(full); setPdfPreviewUrl(URL.createObjectURL(blob)); setModals({...modals, preview: true}); } catch { alert("Erro PDF."); } };
  const handleDownloadPDF = async () => { const blob = await generatePDFBlob(); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `Doc_${invoiceData.invoice_number || 'Novo'}.pdf`; link.click(); };

  // --- OUTRAS AÇÕES ---
  const handleCreateTransaction = async () => { if (!newTransaction.amount) return; const amount = parseFloat(newTransaction.amount) / conversionRate; const { data } = await supabase.from('transactions').insert([{ user_id: userData.id, description: newTransaction.description, amount: amount, type: newTransaction.type, category: newTransaction.category, date: newTransaction.date }]).select(); if (data) { setTransactions([data[0], ...transactions]); setModals({...modals, transaction: false}); } };
  const handleCreateAsset = async () => { if (!newAsset.purchase_value) return; const val = parseFloat(newAsset.purchase_value) / conversionRate; let err, d; if (editingAssetId) { const res = await supabase.from('accounting_assets').update({ ...newAsset, purchase_value: val }).eq('id', editingAssetId).select(); err = res.error; d = res.data; if(d) setAssets(prev => prev.map(a => a.id === editingAssetId ? d[0] : a)); } else { const res = await supabase.from('accounting_assets').insert([{ user_id: userData.id, ...newAsset, purchase_value: val }]).select(); err = res.error; d = res.data; if(d) setAssets([...assets, d[0]]); } if(!err) { setModals({...modals, asset: false}); setEditingAssetId(null); } };
  const handleDeleteAsset = async (id: string) => { if (confirm("Apagar?")) { const { error } = await supabase.from('accounting_assets').delete().eq('id', id); if (!error) setAssets(prev => prev.filter(a => a.id !== id)); } };
  const handleEditAsset = (a: any) => { setEditingAssetId(a.id); setNewAsset({ ...a }); setModals({...modals, asset: true}); };
  const handleShowAmortSchedule = (asset: any) => { setSelectedAssetForSchedule(asset); setModals({...modals, amortSchedule: true}); };
  
  const handleCreateEntity = async () => { if (!newEntity.name) return; const table = entityType === 'client' ? 'clients' : 'suppliers'; let err, d; if (editingEntityId) { const res = await supabase.from(table).update(newEntity).eq('id', editingEntityId).select(); err = res.error; d = res.data; if(d) { if(entityType === 'client') setClients(prev => prev.map(c => c.id === editingEntityId ? d[0] : c)); else setSuppliers(prev => prev.map(s => s.id === editingEntityId ? d[0] : s)); } } else { const res = await supabase.from(table).insert([{ user_id: userData.id, ...newEntity }]).select(); err = res.error; d = res.data; if(d) { if(entityType === 'client') setClients([d[0], ...clients]); else setSuppliers([d[0], ...suppliers]); } } if(!err) { setModals({...modals, entity: false}); setEditingEntityId(null); } };
  const handleEditEntity = (e: any, type: any) => { setNewEntity({ ...e }); setEntityType(type); setEditingEntityId(e.id); setModals({...modals, entity: true}); };
  const handleDeleteEntity = async (id: string, type: any) => { if (!confirm("Apagar?")) return; const table = type === 'client' ? 'clients' : 'suppliers'; const { error } = await supabase.from(table).delete().eq('id', id); if (!error) { if (type === 'client') setClients(prev => prev.filter(c => c.id !== id)); else setSuppliers(prev => prev.filter(s => s.id !== id)); } };
  const handleDeleteTransaction = async (id: string) => { if (!confirm("Apagar?")) { const { error } = await supabase.from('transactions').delete().eq('id', id); if (!error) setTransactions(prev => prev.filter(t => t.id !== id)); } };
  
  const handleCreatePurchase = async () => { if(!newPurchase.total) return; const { data, error } = await supabase.from('purchases').insert([{ user_id: userData.id, supplier_id: newPurchase.supplier_id, invoice_number: newPurchase.invoice_number, date: newPurchase.date, due_date: newPurchase.due_date, total: parseFloat(newPurchase.total), tax_total: parseFloat(newPurchase.tax_total || '0') }]).select('*, suppliers(name)').single(); if(!error && data) { setPurchases([data, ...purchases]); setModals({...modals, purchase: false}); } };

  const handleSaveProfile = async () => { setSavingProfile(true); try { await supabase.from('profiles').update({ full_name: editForm.fullName, job_title: editForm.jobTitle, updated_at: new Date() }).eq('id', userData.id); setProfileData({ ...profileData, ...{ full_name: editForm.fullName } }); alert("Perfil salvo!"); setIsProfileModalOpen(false); } catch { alert("Erro."); } finally { setSavingProfile(false); } };
  const handleSaveCompany = async () => { setSavingCompany(true); try { await supabase.from('profiles').update({ company_name: companyForm.name, company_nif: companyForm.nif, company_address: companyForm.address, country: companyForm.country, currency: companyForm.currency, custom_exchange_rates: exchangeRates, logo_url: companyForm.logo_url, company_footer: companyForm.footer, invoice_color: companyForm.invoice_color, header_text: companyForm.header_text, template_url: companyForm.template_url }).eq('id', userData.id); alert("Definições salvas!"); } catch { alert("Erro."); } finally { setSavingCompany(false); } };
  const handleDeleteAccount = async () => { if (deleteConfirmation !== 'ELIMINAR') return; setIsDeleting(true); try { await supabase.rpc('delete_user'); await supabase.auth.signOut(); navigate('/'); } catch { alert("Erro ao apagar."); } finally { setIsDeleting(false); } };
  const handleSendChatMessage = async (e: React.FormEvent) => { e.preventDefault(); if (!chatInput.trim() || isChatLoading) return; setMessages(prev => [...prev, { role: 'user', content: chatInput }]); setChatInput(''); setIsChatLoading(true); try { const res = await fetch(`${API_URL}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `[Ctx: ${companyForm.country}] ${chatInput}` }) }); const data = await res.json(); if (data.reply) setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]); } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Erro.' }]); } finally { setIsChatLoading(false); } };

  const generateReport = (type: string) => {
    const doc = new jsPDF();
    doc.text(`Relatório: ${type}`, 10, 10);
    doc.text(`Empresa: ${companyForm.name}`, 10, 20);
    if(type === 'Balancete') {
        autoTable(doc, { startY: 30, head: [['Data', 'Descrição', 'Valor']], body: transactions.map(t => [t.date, t.description, t.amount]) });
    } else {
        doc.text("Resumo gerado.", 10, 30);
    }
    doc.save(`${type}.pdf`);
  };

  if (loadingUser) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 dark:text-white">A carregar escritório...</div>;
  const isOwner = profileData?.role === 'owner';

  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Painel Geral' },
    { id: 'invoices', icon: FileText, label: 'Faturação' },
    { id: 'accounting', icon: BookOpen, label: 'Contabilidade' },
    { id: 'chat', icon: MessageSquare, label: 'Assistente IA' },
    { id: 'settings', icon: Settings, label: 'Definições' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans text-gray-900 dark:text-gray-100">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform md:translate-x-0 transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b dark:border-gray-700">
            <Link to="/" className="flex items-center gap-3"><img src="/logopequena.PNG" className="h-8 w-auto"/><span className="font-bold text-xl">EasyCheck</span></Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto h-[calc(100vh-160px)]">
            {menuItems.map((item) => (
                <button key={item.id} onClick={() => { setAccountingTab(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${accountingTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    <item.icon className="w-5 h-5" /><span>{item.label}</span>
                </button>
            ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium"><LogOut className="w-5 h-5" /> {t('nav.logout')}</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between px-8 shadow-sm z-20 items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden"><Menu /></button>
            <h2 className="text-xl font-bold flex items-center gap-2">
                {profileData?.country && <span className="text-2xl">{profileData.country === 'Portugal' ? '🇵🇹' : profileData.country === 'Brasil' ? '🇧🇷' : ''}</span>}
                Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-4">
            
            <div className="relative">
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Globe className="w-5 h-5"/></button>
                {isLangMenuOpen && (
                  <div className="absolute top-12 right-0 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40 overflow-hidden py-1">
                      {languages.map((lang) => (<button key={lang.code} onClick={() => selectLanguage(lang.code)} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-3 items-center text-sm font-medium"><span>{lang.flag}</span>{lang.label}</button>))}
                  </div>
                )}
            </div>

            <button onClick={toggleTheme} className="p-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}</button>
            
            <div className="relative">
              <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full text-white font-bold shadow-md cursor-pointer hover:opacity-90">{getInitials(profileData?.full_name)}</button>
              {isProfileDropdownOpen && (
                <div className="absolute top-16 right-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40 overflow-hidden">
                    <div className="px-4 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <p className="font-bold truncate">{profileData?.full_name}</p>
                      <p className="text-xs text-gray-500 truncate mb-2">{profileData?.company_name}</p>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full inline-block">{isOwner ? t('role.owner') : t('role.employee')}</span>
                    </div>
                    <button onClick={() => {setIsProfileModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-2 text-sm font-medium"><User className="w-4 h-4"/> {t('profile.edit')}</button>
                    <button onClick={() => {setIsDeleteModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex gap-2 border-t dark:border-gray-700 text-sm font-medium"><Trash2 className="w-4 h-4"/> {t('profile.delete')}</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8">
            {accountingTab === 'overview' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Receita Mensal</h3>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{showFinancials ? `${displaySymbol} ${totalRevenue.toFixed(2)}` : '••••••'}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Despesas</h3>
                            <p className="text-3xl font-bold text-red-500 dark:text-red-400">{showFinancials ? `${displaySymbol} ${totalExpenses.toFixed(2)}` : '••••••'}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Saldo Atual</h3>
                            <p className={`text-3xl font-bold ${currentBalance >= 0 ? 'text-blue-600' : 'text-red-500'}`}>{showFinancials ? `${displaySymbol} ${currentBalance.toFixed(2)}` : '••••••'}</p>
                        </div>
                    </div>
                </div>
            )}

            {accountingTab === 'invoices' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xl">Documentos de Venda</h3>
                        <button onClick={() => { resetInvoiceForm(); setModals({...modals, invoice: true}); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg"><Plus size={18}/> Novo Documento</button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 uppercase text-xs font-bold">
                                <tr><th className="p-4">Data</th><th className="p-4">Nº Doc</th><th className="p-4">Cliente</th><th className="p-4 text-center">Estado</th><th className="p-4 text-right">Total</th><th className="p-4 text-right">Ações</th></tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {realInvoices.map(inv => (
                                    <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="p-4">{new Date(inv.date).toLocaleDateString()}</td>
                                        <td className="p-4 font-mono font-bold text-blue-600">{inv.invoice_number}</td>
                                        <td className="p-4 font-medium">{inv.clients?.name}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${inv.status === 'issued' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {inv.status === 'draft' ? 'Rascunho' : inv.status === 'issued' ? 'Emitido' : 'Pago'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-bold">{displaySymbol} {inv.total}</td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <button onClick={() => handleQuickPreview(inv)} className="p-2 hover:bg-gray-100 rounded text-gray-500" title="Ver PDF"><Eye size={16}/></button>
                                            <button onClick={() => handleEditInvoice(inv)} className="p-2 hover:bg-blue-50 rounded text-blue-500"><Edit2 size={16}/></button>
                                            <button onClick={() => handleDeleteInvoice(inv.id)} className="p-2 hover:bg-red-50 rounded text-red-500"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {accountingTab === 'accounting' && (
                <div className="h-full flex flex-col space-y-6">
                    {/* Sub-Nav */}
                    <div className="flex gap-2 border-b dark:border-gray-700 pb-2 overflow-x-auto">
                        {[{id:'overview',l:'Diário'},{id:'purchases',l:'Compras'},{id:'banking',l:'Bancos'},{id:'clients',l:'Clientes'},{id:'suppliers',l:'Fornecedores'},{id:'assets',l:'Ativos'},{id:'reports',l:'Relatórios'}].map(t => (
                            <button key={t.id} onClick={() => setAccountingTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-bold border ${accountingTab === t.id ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white border-transparent'}`}>{t.l}</button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Diário */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-6">
                            <div className="flex justify-between items-center mb-4"><h3 className="font-bold flex items-center gap-2"><BookOpen/> Diário de Movimentos</h3><button onClick={() => setModals({...modals, transaction: true})} className="bg-blue-600 text-white px-3 py-1 rounded text-sm"><Plus size={16}/></button></div>
                            <table className="w-full text-xs text-left">
                                <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="p-2">Data</th><th className="p-2">Desc.</th><th className="p-2 text-right">Valor</th></tr></thead>
                                <tbody>{transactions.slice(0, 5).map(t => (<tr key={t.id} className="border-b"><td className="p-2">{new Date(t.date).toLocaleDateString()}</td><td className="p-2">{t.description}</td><td className="p-2 text-right">{t.amount}</td></tr>))}</tbody>
                            </table>
                        </div>

                        {/* Fornecedores */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-6">
                            <div className="flex justify-between mb-4"><h3 className="font-bold flex items-center gap-2"><Truck/> Fornecedores</h3><button onClick={() => {setEntityType('supplier'); setModals({...modals, entity: true})}} className="text-xs bg-gray-100 p-1 rounded">Novo</button></div>
                            <table className="w-full text-xs text-left">
                                <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="p-2">Nome</th><th className="p-2">NIF</th><th className="p-2 text-right">Ação</th></tr></thead>
                                <tbody>{suppliers.map(s => (<tr key={s.id} className="border-b"><td className="p-2">{s.name}</td><td className="p-2">{s.nif}</td><td className="p-2 text-right"><button onClick={()=>handleDeleteEntity(s.id, 'supplier')}><Trash2 size={12}/></button></td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2"><Landmark/> Bancos</h3>
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg"><span className="text-sm font-bold text-blue-800">Saldo Contabilístico</span><span className="text-xl font-bold text-blue-600">{displaySymbol} {currentBalance.toFixed(2)}</span></div>
                         </div>
                         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-6">
                             <div className="flex justify-between mb-4"><h3 className="font-bold flex items-center gap-2"><Box/> Ativos</h3><button onClick={() => setModals({...modals, asset: true})} className="text-xs bg-gray-100 p-1 rounded">Novo</button></div>
                             <div className="space-y-2">{assets.map(a => (<div key={a.id} className="flex justify-between text-xs border-b pb-1"><span>{a.name}</span><span className="font-bold">{displaySymbol} {getCurrentAssetValue(a).toFixed(2)}</span></div>))}</div>
                         </div>
                         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-6">
                             <h3 className="font-bold mb-4 flex items-center gap-2"><FileSpreadsheet/> Relatórios</h3>
                             <div className="grid grid-cols-2 gap-2">
                                 {['Balancete', 'Dem. Resultados', 'IVA', 'Fornecedores'].map(r => <button key={r} onClick={() => generateReport(r)} className="p-2 text-xs border rounded hover:bg-gray-50">{r}</button>)}
                             </div>
                         </div>
                    </div>
                </div>
            )}

            {/* SETTINGS */}
            {accountingTab === 'settings' && (
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-8">
                        <h2 className="text-xl font-bold mb-6 flex gap-2"><Settings/> Definições Globais</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div><label className="block text-xs font-bold mb-1">País</label><select value={companyForm.country} onChange={handleCountryChange} className="w-full p-3 border rounded-xl dark:bg-gray-900">{countries.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                            <div><label className="block text-xs font-bold mb-1">Moeda</label><input value={companyForm.currency} className="w-full p-3 border rounded-xl bg-gray-100" disabled/></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-8">
                        <h2 className="text-xl font-bold mb-6 flex gap-2"><Palette/> Personalização Documentos</h2>
                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <div><label className="block text-xs font-bold mb-1">Cor</label><div className="flex gap-2"><input type="color" value={companyForm.invoice_color} onChange={e=>setCompanyForm({...companyForm,invoice_color:e.target.value})} className="h-10 w-10 cursor-pointer"/><input value={companyForm.invoice_color} readOnly className="flex-1 p-2 border rounded-xl"/></div></div>
                            <div><label className="block text-xs font-bold mb-1">Cabeçalho</label><input placeholder="Ex: Capital Social..." value={companyForm.header_text} onChange={e=>setCompanyForm({...companyForm,header_text:e.target.value})} className="w-full p-3 border rounded-xl"/></div>
                            <div className="col-span-2"><label className="block text-xs font-bold mb-1">Rodapé</label><input placeholder="Processado por..." value={companyForm.footer} onChange={e=>setCompanyForm({...companyForm,footer:e.target.value})} className="w-full p-3 border rounded-xl"/></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold mb-1">Logo</label><input type="file" onChange={handleLogoUpload} className="block w-full text-sm"/>{uploadingLogo && <span className="text-xs text-blue-500">A carregar...</span>}</div>
                            <div><label className="block text-xs font-bold mb-1">Template (A4 Imagem)</label><input type="file" onChange={handleTemplateUpload} className="block w-full text-sm"/></div>
                        </div>
                    </div>
                    <div className="flex justify-end"><button onClick={handleSaveCompany} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Guardar</button></div>
                </div>
            )}
        </div>
      </main>

      {/* --- MODAIS --- */}

      {/* 1. FATURA (Modal Scrollable) */}
      {modals.invoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-xl font-bold text-blue-600">Editor de Documento</h3>
                    <button onClick={() => setModals({...modals, invoice: false})} className="p-2 hover:bg-gray-200 rounded-full"><X/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Cliente</label><select className="w-full p-3 border rounded-xl font-bold" value={invoiceData.client_id} onChange={e => setInvoiceData({...invoiceData, client_id: e.target.value})}><option value="">Selecione...</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tipo</label><select className="w-full p-3 border rounded-xl" value={invoiceData.type} onChange={e => setInvoiceData({...invoiceData, type: e.target.value})}>{invoiceTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Data</label><input type="date" className="w-full p-3 border rounded-xl" value={invoiceData.date} onChange={e => setInvoiceData({...invoiceData, date: e.target.value})}/></div>
                    </div>
                    <table className="w-full text-sm mb-6 border-collapse">
                        <thead><tr className="bg-gray-100 dark:bg-gray-800 text-left"><th className="p-3 rounded-l-lg">Descrição</th><th className="p-3 w-24 text-center">Qtd</th><th className="p-3 w-32 text-right">Preço</th><th className="p-3 w-32 text-right">IVA</th><th className="p-3 w-32 text-right rounded-r-lg">Total</th><th className="p-3 w-10"></th></tr></thead>
                        <tbody className="divide-y">
                            {invoiceData.items.map((item, idx) => {
                                const standardRates = getCurrentCountryVatRates();
                                const isManual = !standardRates.includes(item.tax) && item.tax !== 0;
                                return (
                                    <tr key={idx}>
                                        <td className="p-3"><input className="w-full bg-transparent outline-none font-medium" placeholder="Item..." value={item.description} onChange={e => {const n = [...invoiceData.items]; n[idx].description = e.target.value; setInvoiceData({...invoiceData, items: n})}}/></td>
                                        <td className="p-3"><input type="number" className="w-full bg-transparent text-center outline-none" value={item.quantity} onChange={e => {const n = [...invoiceData.items]; n[idx].quantity = parseFloat(e.target.value); setInvoiceData({...invoiceData, items: n})}}/></td>
                                        <td className="p-3"><input type="number" className="w-full bg-transparent text-right outline-none" value={item.price} onChange={e => {const n = [...invoiceData.items]; n[idx].price = parseFloat(e.target.value); setInvoiceData({...invoiceData, items: n})}}/></td>
                                        <td className="p-3 flex items-center justify-end gap-2">
                                            <select className="bg-transparent outline-none text-right appearance-none" value={isManual ? 'manual' : item.tax} onChange={e => { if(e.target.value === 'manual') updateInvoiceItem(idx, 'tax', 0); else updateInvoiceItem(idx, 'tax', parseFloat(e.target.value)); }}>
                                                {standardRates.map(r => <option key={r} value={r}>{r}%</option>)}
                                                <option value="manual">Outra...</option>
                                            </select>
                                            {(isManual || item.tax === 0) && <input className="w-12 p-1 border rounded text-right text-xs" type="number" value={item.tax} onChange={e => updateInvoiceItem(idx, 'tax', parseFloat(e.target.value))} autoFocus/>}
                                        </td>
                                        <td className="p-3 text-right font-bold">{displaySymbol} {(item.quantity * item.price).toFixed(2)}</td>
                                        <td className="p-3 text-center"><button onClick={() => {const n = [...invoiceData.items]; n.splice(idx, 1); setInvoiceData({...invoiceData, items: n})}} className="text-red-500"><Trash2 size={16}/></button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <button onClick={() => setInvoiceData({...invoiceData, items: [...invoiceData.items, {description: '', quantity: 1, price: 0, tax: 23}]})} className="text-blue-600 text-sm font-bold flex items-center gap-2 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"><Plus size={16}/> Adicionar Linha</button>
                    
                    <div className="mt-8 flex justify-end text-right">
                        <div>
                            <p className="text-gray-500">Subtotal: {calculateInvoiceTotals().subtotal.toFixed(2)}</p>
                            <p className="text-gray-500">IVA: {calculateInvoiceTotals().taxTotal.toFixed(2)}</p>
                            <p className="text-xl font-bold text-blue-600 mt-2">Total: {calculateInvoiceTotals().total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3">
                    <button onClick={() => setModals({...modals, invoice: false})} className="px-6 py-3 border rounded-xl font-bold text-gray-500 hover:bg-white">Cancelar</button>
                    <button onClick={handleSaveInvoice} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-2"><CheckCircle size={20}/> Emitir Documento</button>
                </div>
            </div>
        </div>
      )}

      {/* 2. ENTIDADE (CLIENTE/FORNECEDOR) */}
      {modals.entity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-bold mb-6">Novo {entityType === 'client' ? 'Cliente' : 'Fornecedor'}</h3>
                  <div className="space-y-4">
                      <input placeholder="Nome" className="w-full p-3 border rounded-xl" value={newEntity.name} onChange={e => setNewEntity({...newEntity, name: e.target.value})}/>
                      <div className="grid grid-cols-2 gap-4">
                          <input placeholder="NIF" className="w-full p-3 border rounded-xl" value={newEntity.nif} onChange={e => setNewEntity({...newEntity, nif: e.target.value})}/>
                          <input placeholder="Email" className="w-full p-3 border rounded-xl" value={newEntity.email} onChange={e => setNewEntity({...newEntity, email: e.target.value})}/>
                      </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                      <button onClick={() => setModals({...modals, entity: false})} className="px-4 py-2 border rounded font-bold">Cancelar</button>
                      <button onClick={handleCreateEntity} className="px-4 py-2 bg-blue-600 text-white rounded font-bold">Salvar</button>
                  </div>
              </div>
          </div>
      )}

      {/* 3. PREVIEW PDF */}
      {modals.preview && pdfPreviewUrl && (
          <div className="fixed inset-0 z-50 flex flex-col bg-gray-900/95 backdrop-blur-sm p-4">
              <div className="flex justify-between items-center text-white mb-4">
                  <h3 className="text-xl font-bold">Pré-visualização</h3>
                  <div className="flex gap-2">
                      <button onClick={handleDownloadPDF} className="bg-blue-600 px-4 py-2 rounded font-bold flex gap-2"><Download/> Baixar</button>
                      <button onClick={() => setModals({...modals, preview: false})} className="bg-gray-800 p-2 rounded-full"><X/></button>
                  </div>
              </div>
              <iframe src={pdfPreviewUrl} className="flex-1 rounded-xl shadow-2xl bg-gray-800 border border-gray-700"/>
          </div>
      )}

      {/* 4. ATIVO MODAL */}
      {modals.asset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white p-8 rounded-xl w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4">Novo Ativo</h3>
                  <div className="space-y-4">
                      <input placeholder="Nome" className="w-full p-3 border rounded" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})}/>
                      <input placeholder="Valor" type="number" className="w-full p-3 border rounded" value={newAsset.purchase_value} onChange={e => setNewAsset({...newAsset, purchase_value: e.target.value})}/>
                      <select className="w-full p-3 border rounded" value={newAsset.lifespan_years} onChange={e => setNewAsset({...newAsset, lifespan_years: parseInt(e.target.value)})}>
                          <option value="3">3 Anos</option><option value="4">4 Anos</option><option value="5">5 Anos</option><option value="8">8 Anos</option>
                      </select>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                      <button onClick={() => setModals({...modals, asset: false})} className="px-4 py-2 border rounded">Cancelar</button>
                      <button onClick={handleCreateAsset} className="px-4 py-2 bg-blue-600 text-white rounded">Adicionar</button>
                  </div>
              </div>
          </div>
      )}

      {/* 5. TRANSACTION MODAL */}
      {modals.transaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white p-8 rounded-xl w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4">Novo Movimento</h3>
                  <div className="space-y-4">
                      <input placeholder="Descrição" className="w-full p-3 border rounded" value={newTransaction.description} onChange={e => setNewTransaction({...newTransaction, description: e.target.value})}/>
                      <input placeholder="Valor" type="number" className="w-full p-3 border rounded" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})}/>
                      <div className="flex gap-2">
                          <button onClick={() => setNewTransaction({...newTransaction, type: 'income'})} className={`flex-1 p-2 border rounded ${newTransaction.type === 'income' ? 'bg-green-100 border-green-500' : ''}`}>Receita</button>
                          <button onClick={() => setNewTransaction({...newTransaction, type: 'expense'})} className={`flex-1 p-2 border rounded ${newTransaction.type === 'expense' ? 'bg-red-100 border-red-500' : ''}`}>Despesa</button>
                      </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                      <button onClick={() => setModals({...modals, transaction: false})} className="px-4 py-2 border rounded">Cancelar</button>
                      <button onClick={handleCreateTransaction} className="px-4 py-2 bg-blue-600 text-white rounded">Lançar</button>
                  </div>
              </div>
          </div>
      )}

      {/* MODAL PERFIL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl border dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700"><h3 className="text-xl font-bold flex items-center gap-2"><User className="text-blue-600"/> {t('profile.edit_title')}</h3><button onClick={() => setIsProfileModalOpen(false)}><X className="text-gray-400"/></button></div>
            <div className="space-y-4">
              <div><label className="block text-sm mb-1">{t('form.email')}</label><input type="email" value={editForm.email} disabled className="w-full p-3 border rounded-xl bg-gray-50 cursor-not-allowed"/></div>
              <div><label className="block text-sm mb-1">{t('form.fullname')}</label><input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/></div>
              <div><label className="block text-sm mb-1">{t('form.jobtitle')}</label><input type="text" value={editForm.jobTitle} onChange={e => setEditForm({...editForm, jobTitle: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/></div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700">
              <button onClick={() => setIsProfileModalOpen(false)} className="px-5 py-2.5 border rounded-xl">{t('common.cancel')}</button>
              <button onClick={handleSaveProfile} disabled={savingProfile} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold">{savingProfile ? 'Guardando...' : t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE ACCOUNT */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border dark:border-gray-700">
            <h3 className="text-xl font-bold text-red-600 mb-4 flex gap-2"><AlertTriangle/> {t('delete.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{t('delete.text')}</p>
            <input type="text" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} className="w-full p-3 border rounded mb-4 uppercase dark:bg-gray-900"/>
            <div className="flex justify-end gap-2"><button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded">{t('common.cancel')}</button><button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded">{t('common.delete')}</button></div>
          </div>
        </div>
      )}

    </div>
  );
}