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

// --- DADOS ESTÁTICOS ---

const countries = [
  "Portugal", "Brasil", "Angola", "Moçambique", "Cabo Verde", 
  "France", "Deutschland", "United Kingdom", "España", "United States", 
  "Italia", "Belgique", "Suisse", "Luxembourg"
];

const invoiceTypesMap: Record<string, string> = {
    "Fatura": "FT", "Fatura-Recibo": "FR", "Fatura Simplificada": "FS", "Fatura Proforma": "FP",
    "Nota de Crédito": "NC", "Nota de Débito": "ND", "Recibo": "RC",
    "Fatura Intracomunitária": "FI", "Fatura Isenta / Autoliquidação": "FA"
};
const invoiceTypes = Object.keys(invoiceTypesMap);

const languages = [ 
  { code: 'pt', label: 'Português', flag: '🇵🇹' }, 
  { code: 'en', label: 'English', flag: '🇬🇧' }, 
  { code: 'fr', label: 'Français', flag: '🇫🇷' }, 
  { code: 'es', label: 'Español', flag: '🇪🇸' }, 
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' }, 
  { code: 'it', label: 'Italiano', flag: '🇮🇹' } 
];

const defaultRates: Record<string, number> = { 
  'EUR': 1, 'USD': 1.05, 'BRL': 6.15, 'AOA': 930, 'MZN': 69, 
  'CVE': 110.27, 'CHF': 0.94, 'GBP': 0.83 
};

const countryCurrencyMap: Record<string, string> = { 
  "Portugal": "EUR", "France": "EUR", "Deutschland": "EUR", "España": "EUR", 
  "Italia": "EUR", "Belgique": "EUR", "Luxembourg": "EUR", "Brasil": "BRL", 
  "United States": "USD", "United Kingdom": "GBP", "Angola": "AOA", 
  "Moçambique": "MZN", "Cabo Verde": "CVE", "Suisse": "CHF" 
};

const currencySymbols: Record<string, string> = { 
  'EUR': '€', 'USD': '$', 'BRL': 'R$', 'AOA': 'Kz', 'MZN': 'MT', 
  'CVE': 'Esc', 'CHF': 'CHF', 'GBP': '£' 
};

const vatRatesByCountry: Record<string, number[]> = {
    "Portugal": [23, 13, 6, 0], "Luxembourg": [17, 14, 8, 3, 0], "Brasil": [17, 18, 12, 0],
    "Angola": [14, 7, 5, 0], "Moçambique": [16, 0], "Cabo Verde": [15, 0],
    "France": [20, 10, 5.5, 0], "Deutschland": [19, 7, 0], "España": [21, 10, 4, 0],
    "Italia": [22, 10, 5, 0], "Belgique": [21, 12, 6, 0], "Suisse": [8.1, 2.6, 0],
    "United Kingdom": [20, 5, 0], "United States": [0, 5, 10]
};

// --- INTERFACES ---
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
  exemption_reason: string;
  items: InvoiceItem[];
}

// --- COMPONENTE PRINCIPAL ---

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://easycheck-api.onrender.com';

  // --- ESTADOS ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [showFinancials, setShowFinancials] = useState(true); 
  const [showPageCode, setShowPageCode] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [accountingTab, setAccountingTab] = useState('overview'); 
  
  // ESTADOS DE DADOS (Ligados à BD nova)
  const [journalEntries, setJournalEntries] = useState<any[]>([]); 
  const [realInvoices, setRealInvoices] = useState<any[]>([]); 
  const [purchases, setPurchases] = useState<any[]>([]); 
  const [companyAccounts, setCompanyAccounts] = useState<any[]>([]); 
  const [assets, setAssets] = useState<any[]>([]); 
  const [clients, setClients] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [provisions, setProvisions] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<any>(defaultRates);

  // Modais
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
  
  // Forms & Edição
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
  
  // Company Form
  const [companyForm, setCompanyForm] = useState({ 
    name: '', country: 'Portugal', currency: 'EUR', 
    address: '', nif: '', logo_url: '', footer: '', 
    invoice_color: '#2563EB', header_text: '', template_url: '',
    invoice_template_url: '' 
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
      exemption_reason: '', items: [{ description: '', quantity: 1, price: 0, tax: 23 }] 
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);

  // Chat
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Olá! Sou o seu assistente EasyCheck IA. Em que posso ajudar hoje?' }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- HELPERS ---

  const getCurrencyCode = (country: string) => countryCurrencyMap[country] || 'EUR';
  const getCurrencySymbol = (code: string) => currencySymbols[code] || '€';
  const getCurrentCountryVatRates = () => vatRatesByCountry[companyForm.country || "Portugal"] || [23, 0];
  const currentCurrency = companyForm.currency || 'EUR';
  const conversionRate = exchangeRates[currentCurrency] || 1;
  const displaySymbol = getCurrencySymbol(currentCurrency);

  const totalRevenue = journalEntries
    .reduce((acc, entry) => {
        const incomeItems = entry.journal_items?.filter((i: any) => i.company_accounts?.type === 'rendimentos' || i.company_accounts?.code.startsWith('7'));
        return acc + (incomeItems?.reduce((sum: number, i: any) => sum + i.credit, 0) || 0);
    }, 0);

  const totalExpenses = purchases.reduce((acc, curr) => acc + curr.total, 0); 
  const currentBalance = totalRevenue - totalExpenses; 
  const totalInvoicesCount = realInvoices.length;

  const getInitials = (name: string) => name ? (name.split(' ').length > 1 ? (name.split(' ')[0][0] + name.split(' ')[name.split(' ').length - 1][0]) : name.substring(0, 2)).toUpperCase() : 'EC';

  // --- AMORTIZAÇÃO ---
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
          if (asset.amortization_method === 'linear') {
              annuity = asset.purchase_value / lifespan;
          } else {
              const remainingYears = lifespan - i;
              const currentLinearAnnuity = currentValue / remainingYears;
              const currentDegressiveAnnuity = currentValue * degressiveRate;
              if (currentDegressiveAnnuity < currentLinearAnnuity || i === lifespan - 1) {
                  annuity = currentLinearAnnuity; 
              } else {
                  annuity = currentDegressiveAnnuity;
              }
          }
          if (currentValue - annuity < 0.01) annuity = currentValue;
          schedule.push({
              year: startYear + i,
              startValue: currentValue,
              annuity: annuity,
              accumulated: asset.purchase_value - (currentValue - annuity),
              endValue: currentValue - annuity
          });
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
      let subtotal = 0;
      let taxTotal = 0;
      invoiceData.items.forEach(item => {
          const lineTotal = item.quantity * item.price;
          subtotal += lineTotal;
          taxTotal += lineTotal * (item.tax / 100);
      });
      return { subtotal, taxTotal, total: subtotal + taxTotal };
  };

  // --- EFEITOS (CARREGAMENTO DE DADOS) ---
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
                name: profile.company_name, 
                country: profile.country || 'Portugal', 
                currency: initialCurrency, 
                address: profile.company_address || '', 
                nif: profile.company_nif || '', 
                logo_url: profile.logo_url || '', 
                footer: profile.company_footer || '', 
                invoice_color: profile.invoice_color || '#2563EB', 
                header_text: profile.header_text || '',
                template_url: profile.template_url || '',
                invoice_template_url: profile.invoice_template_url || '' 
            });
            if (profile.custom_exchange_rates) { setExchangeRates({ ...defaultRates, ...profile.custom_exchange_rates }); }
        }
        
        // BUSCAR DADOS
        const [journal, inv, pur, acc, ass, cl, sup, prov] = await Promise.all([
             supabase.from('journal_entries').select('*, journal_items(debit, credit, company_accounts(code, name, type))').order('date', { ascending: false }),
             supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false }),
             supabase.from('purchases').select('*, suppliers(name)').order('date', { ascending: false }),
             supabase.from('company_accounts').select('*').order('code', { ascending: true }),
             supabase.from('accounting_assets').select('*'),
             supabase.from('clients').select('*'),
             supabase.from('suppliers').select('*'),
             supabase.from('accounting_provisions').select('*')
        ]);

        if (journal.data) setJournalEntries(journal.data);
        if (inv.data) setRealInvoices(inv.data);
        if (pur.data) setPurchases(pur.data);
        if (acc.data) setCompanyAccounts(acc.data);
        if (ass.data) setAssets(ass.data);
        if (cl.data) setClients(cl.data);
        if (sup.data) setSuppliers(sup.data);
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

  // --- ACTIONS ---

  const copyCode = () => { 
      if(profileData?.company_code) { 
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
      } catch (error: any) { alert("Erro: " + error.message); } finally { setUploadingLogo(false); }
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
      } catch (error: any) { alert("Erro: " + error.message); } finally { setUploadingTemplate(false); }
  };

  const handleAddInvoiceItem = () => { const currentTax = getCurrentCountryVatRates()[0]; setInvoiceData({ ...invoiceData, items: [...invoiceData.items, { description: '', quantity: 1, price: 0, tax: currentTax }] }); };
  const handleRemoveInvoiceItem = (index: number) => { const newItems = [...invoiceData.items]; newItems.splice(index, 1); setInvoiceData({ ...invoiceData, items: newItems }); };
  const updateInvoiceItem = (index: number, field: string, value: string) => { const newItems: any = [...invoiceData.items]; newItems[index][field] = field === 'description' ? value : parseFloat(value) || 0; setInvoiceData({ ...invoiceData, items: newItems }); };

  // --- FATURAÇÃO COM LANÇAMENTO CONTABILÍSTICO ---
  const handleSaveInvoice = async () => {
      const totals = calculateInvoiceTotals();
      let docNumber = invoiceData.invoice_number;
      if (!docNumber) {
          const prefix = invoiceTypesMap[invoiceData.type] || 'DOC';
          docNumber = `${prefix} ${new Date().getFullYear()}/${realInvoices.length + 1}`;
      }
      
      let invoiceId, invoiceDataResult;
      
      if (invoiceData.id) {
          const res = await supabase.from('invoices').update({
             client_id: invoiceData.client_id, type: invoiceData.type, date: invoiceData.date, 
             due_date: invoiceData.due_date, exemption_reason: invoiceData.exemption_reason, 
             subtotal: totals.subtotal, tax_total: totals.taxTotal, total: totals.total
          }).eq('id', invoiceData.id).select().single();
          if (res.error) return alert("Erro ao atualizar: " + res.error.message);
          invoiceId = res.data.id;
          invoiceDataResult = res.data;
          await supabase.from('invoice_items').delete().eq('invoice_id', invoiceData.id);
      } else {
          const res = await supabase.from('invoices').insert([{ 
              user_id: userData.id, client_id: invoiceData.client_id, type: invoiceData.type, 
              invoice_number: docNumber, date: invoiceData.date, due_date: invoiceData.due_date, 
              exemption_reason: invoiceData.exemption_reason, subtotal: totals.subtotal, 
              tax_total: totals.taxTotal, total: totals.total, currency: currentCurrency, status: 'sent' 
          }]).select().single();
          if (res.error) return alert("Erro ao criar: " + res.error.message);
          invoiceId = res.data.id;
          invoiceDataResult = res.data;
      }

      const itemsToInsert = invoiceData.items.map(item => ({ invoice_id: invoiceId, description: item.description, quantity: item.quantity, unit_price: item.price, tax_rate: item.tax }));
      await supabase.from('invoice_items').insert(itemsToInsert);

      // --- 3. LANÇAMENTO NO DIÁRIO ---
      const clientAccount = companyAccounts.find(a => a.code.startsWith('211') || a.code.startsWith('311')); 
      const salesAccount = companyAccounts.find(a => a.code.startsWith('71') || a.code.startsWith('61'));
      const taxAccount = companyAccounts.find(a => a.code.startsWith('243') || a.code.startsWith('342'));

      if (clientAccount && salesAccount) {
          const { data: entry, error: entryError } = await supabase.from('journal_entries').insert([{
              user_id: userData.id,
              date: invoiceData.date,
              description: `Fatura ${docNumber} - ${clients.find(c => c.id === invoiceData.client_id)?.name}`,
              document_ref: docNumber
          }]).select().single();

          if (!entryError && entry) {
              const journalItems = [
                  { entry_id: entry.id, account_id: clientAccount.id, debit: totals.total, credit: 0 },
                  { entry_id: entry.id, account_id: salesAccount.id, debit: 0, credit: totals.subtotal }
              ];
              if (totals.taxTotal > 0 && taxAccount) {
                  journalItems.push({ entry_id: entry.id, account_id: taxAccount.id, debit: 0, credit: totals.taxTotal });
              }
              await supabase.from('journal_items').insert(journalItems);
          }
      }

      const { data: updatedInvoices } = await supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false }); 
      if (updatedInvoices) setRealInvoices(updatedInvoices);
      
      const { data: updatedJournal } = await supabase.from('journal_entries').select('*, journal_items(debit, credit, company_accounts(code, name))').order('date', { ascending: false });
      if (updatedJournal) setJournalEntries(updatedJournal);

      setShowPreviewModal(false); setShowInvoiceForm(false);
      resetInvoiceForm();
      alert("Fatura emitida e contabilizada!");
  };

  const resetInvoiceForm = () => {
    setInvoiceData({ id: '', client_id: '', type: 'Fatura', invoice_number: '', date: new Date().toISOString().split('T')[0], due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], exemption_reason: '', items: [{ description: '', quantity: 1, price: 0, tax: 0 }] });
  };

  const handleEditInvoice = async (invoice: any) => {
      const { data: items } = await supabase.from('invoice_items').select('*').eq('invoice_id', invoice.id);
      setInvoiceData({ id: invoice.id, client_id: invoice.client_id, type: invoice.type, invoice_number: invoice.invoice_number, date: invoice.date, due_date: invoice.due_date, exemption_reason: invoice.exemption_reason || '', items: items ? items.map((i: any) => ({ description: i.description, quantity: i.quantity, price: i.unit_price, tax: i.tax_rate })) : [] });
      setShowInvoiceForm(true);
  };

  const handleDeleteInvoice = async (id: string) => { 
      if (window.confirm("ATENÇÃO: Apagar uma fatura emitida pode ter implicações fiscais.\nTem a certeza absoluta?")) { 
          if (window.prompt("Escreva 'APAGAR' para confirmar:") === 'APAGAR') { 
              const { error } = await supabase.from('invoices').delete().eq('id', id); 
              if (!error) setRealInvoices(prev => prev.filter(i => i.id !== id)); 
          } 
      } 
  };

  const handleCreatePurchase = async () => {
      if(!newPurchase.supplier_id || !newPurchase.total) return alert("Preencha fornecedor e total.");
      const { data, error } = await supabase.from('purchases').insert([{
          user_id: userData.id, 
          supplier_id: newPurchase.supplier_id, 
          invoice_number: newPurchase.invoice_number,
          date: newPurchase.date, 
          due_date: newPurchase.due_date, 
          total: parseFloat(newPurchase.total),
          tax_total: parseFloat(newPurchase.tax_total || '0')
      }]).select('*, suppliers(name)').single();

      if(!error && data) { 
          setPurchases([data, ...purchases]); 
          setShowPurchaseForm(false); 
          setNewPurchase({ supplier_id: '', invoice_number: '', date: new Date().toISOString().split('T')[0], due_date: '', total: '', tax_total: '' }); 
      } else {
          alert("Erro ao criar compra.");
      }
  };

  // --- PDF ENGINE ---
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
      if(templateToUse) {
          try {
              const img = new Image(); 
              img.src = templateToUse; 
              img.crossOrigin = "Anonymous";
              await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
              doc.addImage(img, 'PNG', 0, 0, 210, 297); 
          } catch (e) { console.error("Erro template", e); }
      }

      if(!templateToUse) {
          doc.setFillColor(companyForm.invoice_color || '#2563EB'); 
          doc.rect(0, 0, 210, 10, 'F'); 
          if (companyForm.logo_url) {
            try { 
                const img = new Image(); img.src = companyForm.logo_url; img.crossOrigin = "Anonymous"; 
                await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
                doc.addImage(img, 'PNG', 15, 20, 30, 20); 
            } catch {}
          }
          doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(40); 
          doc.text(companyForm.name || 'Minha Empresa', 200, 25, { align: 'right' });
          doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(80); 
          doc.text(companyForm.address || '', 200, 30, { align: 'right' }); 
          doc.text(`NIF: ${companyForm.nif || 'N/A'}`, 200, 35, { align: 'right' });
      }

      doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(0);
      doc.text("FATURA Nº", 140, 50);
      doc.text("DATA", 140, 55);
      doc.setFont("helvetica", "normal");
      const docNum = dataToUse.invoice_number || "RASCUNHO";
      doc.text(docNum, 170, 50, { align: 'right' }); 
      doc.text(dataToUse.date, 170, 55, { align: 'right' });

      doc.setFont("helvetica", "bold"); doc.text("Exmo.(s) Sr.(s)", 15, 60);
      doc.setFont("helvetica", "normal"); doc.setFontSize(11);
      doc.text(client.name, 15, 66);
      doc.setFontSize(10);
      if(client.address) doc.text(client.address, 15, 71);
      if(client.nif) doc.text(`NIF: ${client.nif}`, 15, 76);

      const tableRows = dataToUse.items.map((item: any) => { 
          const price = item.price ?? item.unit_price; 
          const tax = item.tax ?? item.tax_rate; 
          return [ item.description, item.quantity, `${displaySymbol} ${price.toFixed(2)}`, `${tax}%`, `${displaySymbol} ${(item.quantity * price).toFixed(2)}` ]; 
      });
      autoTable(doc, { 
          head: [["Descrição", "Qtd", "Preço Unit.", "IVA", "Total"]], 
          body: tableRows, 
          startY: 90, 
          theme: 'plain', 
          headStyles: { fillColor: companyForm.invoice_color || '#444', textColor: 255, fontStyle: 'bold' },
          styles: { fontSize: 9, cellPadding: 3 },
          columnStyles: { 4: { halign: 'right' } }
      });
      
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text(`Ilíquido:`, 130, finalY); doc.text(`${displaySymbol} ${totals.subtotal.toFixed(2)}`, 195, finalY, { align: 'right' });
      doc.text(`Total IVA:`, 130, finalY + 5); doc.text(`${displaySymbol} ${totals.taxTotal.toFixed(2)}`, 195, finalY + 5, { align: 'right' });
      doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(companyForm.invoice_color || '#2563EB');
      doc.text(`TOTAL:`, 130, finalY + 15); doc.text(`${displaySymbol} ${totals.total.toFixed(2)}`, 195, finalY + 15, { align: 'right' });

      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(7); doc.setTextColor(150); doc.setFont('helvetica', 'normal');
      doc.text("Processado por EasyCheck ERP (Licença Nº 001)", 105, pageHeight - 10, { align: 'center' });
      return doc.output('blob');
  };

  const handleQuickPreview = async (invoice: any) => {
    const { data: items } = await supabase.from('invoice_items').select('*').eq('invoice_id', invoice.id);
    if (!items) return alert("Erro ao carregar itens.");
    const fullInvoiceData = { ...invoice, items: items.map((i: any) => ({ description: i.description, quantity: i.quantity, price: i.unit_price, tax: i.tax_rate })) };
    try { const blob = await generatePDFBlob(fullInvoiceData); setPdfPreviewUrl(URL.createObjectURL(blob)); setShowPreviewModal(true); } catch { alert("Erro ao gerar PDF."); }
  };

  const handleDownloadPDF = async () => {
    const blob = await generatePDFBlob(); const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `EasyCheck_${invoiceData.invoice_number || 'Doc'}.pdf`; link.click();
  };

  // ✅ --- GERADOR DE RELATÓRIOS FINANCEIROS (COM HIERARQUIA) ---
  const generateFinancialReport = (type: 'balancete' | 'dre') => {
    if (journalEntries.length === 0) return alert("Não há movimentos contabilísticos para gerar relatório.");

    const doc = new jsPDF();
    const title = type === 'balancete' ? 'Balancete de Verificação' : 'Demonstração de Resultados';
    
    // Cabeçalho
    doc.setFontSize(16); doc.text(companyForm.name, 15, 15);
    doc.setFontSize(10); doc.text(`NIF: ${companyForm.nif}`, 15, 20);
    doc.setFontSize(14); doc.setTextColor(0, 0, 255); doc.text(title, 15, 30);
    doc.setTextColor(0);

    // 1. Agrupar saldos por conta
    const accountBalances: Record<string, {name: string, debit: number, credit: number}> = {};
    
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

    const rows: any[] = [];
    let totalDebit = 0; let totalCredit = 0;
    let currentClass = "";

    // 2. Criar linhas com Cabeçalhos de Classe
    Object.keys(accountBalances).sort().forEach(code => {
        const acc = accountBalances[code];
        if (type === 'dre' && !code.startsWith('6') && !code.startsWith('7')) return;

        // Inserir Cabeçalho de Classe (Ex: Classe 1, Classe 2...)
        const accountClass = code.charAt(0);
        if (accountClass !== currentClass) {
            currentClass = accountClass;
            // Linha visual para a classe (simulada)
            rows.push([{ content: `CLASSE ${currentClass}`, colSpan: 5, styles: { fillColor: [240, 240, 240], fontStyle: 'bold' } }]);
        }

        const balance = acc.debit - acc.credit;
        rows.push([ code, acc.name, displaySymbol + acc.debit.toFixed(2), displaySymbol + acc.credit.toFixed(2), displaySymbol + balance.toFixed(2) ]);
        
        totalDebit += acc.debit;
        totalCredit += acc.credit;
    });

    autoTable(doc, {
        startY: 40,
        head: [['Conta', 'Descrição', 'Débito', 'Crédito', 'Saldo']],
        body: rows,
        theme: 'grid',
        styles: { fontSize: 8 },
        columnStyles: { 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' } }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    if (type === 'balancete') {
        doc.text(`Total Débito: ${displaySymbol} ${totalDebit.toFixed(2)}`, 15, finalY);
        doc.text(`Total Crédito: ${displaySymbol} ${totalCredit.toFixed(2)}`, 100, finalY);
        if (Math.abs(totalDebit - totalCredit) < 0.01) {
            doc.setTextColor(0, 150, 0); doc.text("✅ Contas Batem Certo", 15, finalY + 10);
        } else {
            doc.setTextColor(200, 0, 0); doc.text("❌ Desequilíbrio!", 15, finalY + 10);
        }
    } else {
        const result = totalCredit - totalDebit; 
        doc.setFontSize(12); doc.text(`Resultado Líquido: ${displaySymbol} ${result.toFixed(2)}`, 15, finalY);
    }
    window.open(URL.createObjectURL(doc.output('blob')), '_blank');
  };

  // --- GENERAL HANDLERS ---
  const handleCreateTransaction = async () => { 
      if (!newTransaction.amount || !newTransaction.description) return alert("Preencha dados."); 
      const { data: entry, error } = await supabase.from('journal_entries').insert([{ 
          user_id: userData.id, description: newTransaction.description, date: newTransaction.date 
      }]).select().single();
      if (!error && entry) { 
          alert("Movimento criado!");
          const { data: updatedJournal } = await supabase.from('journal_entries').select('*, journal_items(debit, credit, company_accounts(code, name))').order('date', { ascending: false });
          if(updatedJournal) setJournalEntries(updatedJournal);
          setShowTransactionModal(false); 
      } 
  };
  
  // ⚠️ NOVO BOTÃO DE RESET (CUIDADO!)
  const handleResetFinancials = async () => {
      if(window.confirm("⚠️ ZONA DE PERIGO ⚠️\n\nIsto vai APAGAR:\n- Todas as Faturas\n- Todas as Compras\n- Todo o Diário\n\nTem a certeza absoluta?")) {
          if(window.prompt("Escreva 'RESET' para confirmar:") === 'RESET') {
              // Apagar tudo (Atenção: A ordem importa por causa das chaves estrangeiras)
              await supabase.from('journal_items').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Hack para apagar tudo
              await supabase.from('journal_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
              await supabase.from('invoice_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
              await supabase.from('invoices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
              await supabase.from('purchases').delete().neq('id', '00000000-0000-0000-0000-000000000000');
              
              setJournalEntries([]); setRealInvoices([]); setPurchases([]);
              alert("Sistema limpo com sucesso! Pode começar a trabalhar.");
          }
      }
  };

  const handleCreateAsset = async () => { if (!newAsset.name || !newAsset.purchase_value) return alert("Preencha dados."); const valueInEur = parseFloat(newAsset.purchase_value) / conversionRate; let error, data; if (editingAssetId) { const res = await supabase.from('accounting_assets').update({ ...newAsset, purchase_value: valueInEur }).eq('id', editingAssetId).select(); error = res.error; data = res.data; if(!error && data) setAssets(prev => prev.map(a => a.id === editingAssetId ? data[0] : a)); } else { const res = await supabase.from('accounting_assets').insert([{ user_id: userData.id, name: newAsset.name, purchase_date: newAsset.purchase_date, purchase_value: valueInEur, lifespan_years: newAsset.lifespan_years, amortization_method: newAsset.amortization_method }]).select(); error = res.error; data = res.data; if(!error && data) setAssets([...assets, data[0]]); } if (!error) { setShowAssetModal(false); setEditingAssetId(null); setNewAsset({ name: '', category: 'Equipamento', purchase_date: new Date().toISOString().split('T')[0], purchase_value: '', lifespan_years: 3, amortization_method: 'linear' }); } };
  const handleDeleteAsset = async (id: string) => { if (!window.confirm("Apagar este ativo?")) return; const { error } = await supabase.from('accounting_assets').delete().eq('id', id); if (!error) setAssets(prev => prev.filter(a => a.id !== id)); };
  const handleEditAsset = (asset: any) => { setEditingAssetId(asset.id); setNewAsset({ name: asset.name, category: 'Equipamento', purchase_date: asset.purchase_date, purchase_value: asset.purchase_value, lifespan_years: asset.lifespan_years, amortization_method: asset.amortization_method }); setShowAssetModal(true); };
  const handleShowAmortSchedule = (asset: any) => { setSelectedAssetForSchedule(asset); setShowAmortSchedule(true); };

  const handleCreateEntity = async () => { if (!newEntity.name) return alert("Nome obrigatório"); const table = entityType === 'client' ? 'clients' : 'suppliers'; let error = null, data = null; if (editingEntityId) { const res = await supabase.from(table).update({ ...newEntity, updated_at: new Date() }).eq('id', editingEntityId).select(); error = res.error; data = res.data; if (!error && data) { if (entityType === 'client') setClients(prev => prev.map(c => c.id === editingEntityId ? data[0] : c)); else setSuppliers(prev => prev.map(s => s.id === editingEntityId ? data[0] : s)); } } else { const res = await supabase.from(table).insert([{ user_id: userData.id, ...newEntity }]).select(); error = res.error; data = res.data; if (!error && data) { if (entityType === 'client') setClients([data[0], ...clients]); else setSuppliers([data[0], ...suppliers]); } } if (!error) { setShowEntityModal(false); setEditingEntityId(null); setNewEntity({ name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' }); } else { alert("Erro: " + error.message); } };
  const handleEditEntity = (entity: any, type: 'client' | 'supplier') => { setNewEntity({ name: entity.name, nif: entity.nif, email: entity.email, address: entity.address || '', city: entity.city || '', postal_code: entity.postal_code || '', country: entity.country || 'Portugal' }); setEntityType(type); setEditingEntityId(entity.id); setShowEntityModal(true); };
  const handleDeleteEntity = async (id: string, type: 'client' | 'supplier') => { if (!window.confirm("Apagar este registo?")) return; const table = type === 'client' ? 'clients' : 'suppliers'; const { error } = await supabase.from(table).delete().eq('id', id); if (!error) { if (type === 'client') setClients(prev => prev.filter(c => c.id !== id)); else setSuppliers(prev => prev.filter(s => s.id !== id)); } };
  const handleDeleteTransaction = async (id: string) => { if (!window.confirm("Eliminar registo?")) return; const { error } = await supabase.from('journal_entries').delete().eq('id', id); if (!error) setJournalEntries(prev => prev.filter(t => t.id !== id)); };
  
  const handleOpenDoubtful = (client: any) => { setSelectedClientForDebt(client); setShowDoubtfulModal(true); };
  const saveDoubtfulDebt = async () => { let amount = 0; if (debtMethod === 'manual') amount = parseFloat(manualDebtAmount) || 0; else { const clientInvoices = realInvoices.filter(inv => inv.client_id === selectedClientForDebt.id && selectedDebtInvoices.includes(inv.id)); amount = clientInvoices.reduce((sum, inv) => sum + inv.total, 0); } const newStatus = selectedClientForDebt.status === 'doubtful' ? 'active' : 'doubtful'; const updates = { status: newStatus, doubtful_debt: newStatus === 'doubtful' ? amount : 0 }; const { error } = await supabase.from('clients').update(updates).eq('id', selectedClientForDebt.id); if (!error) { setClients(prev => prev.map(c => c.id === selectedClientForDebt.id ? { ...c, ...updates } : c)); setShowDoubtfulModal(false); setManualDebtAmount(''); setSelectedDebtInvoices([]); } };

  const handleCreateProvision = async () => { if (!newProvision.description || !newProvision.amount) return alert("Dados insuficientes"); const amountInEur = parseFloat(newProvision.amount) / conversionRate; let error = null, data = null; if (editingProvisionId) { const res = await supabase.from('accounting_provisions').update({ ...newProvision, amount: amountInEur }).eq('id', editingProvisionId).select(); error = res.error; data = res.data; if (!error && data) setProvisions(prev => prev.map(p => p.id === editingProvisionId ? data[0] : p)); } else { const res = await supabase.from('accounting_provisions').insert([{ user_id: userData.id, ...newProvision, amount: amountInEur }]).select(); error = res.error; data = res.data; if (!error && data) setProvisions([data[0], ...provisions]); } if (!error) { setShowProvisionModal(false); setEditingProvisionId(null); setNewProvision({ description: '', amount: '', type: 'Riscos e Encargos', date: new Date().toISOString().split('T')[0] }); } };
  const handleEditProvision = (prov: any) => { setEditingProvisionId(prov.id); setNewProvision({ description: prov.description, amount: prov.amount, type: prov.type, date: prov.date }); setShowProvisionModal(true); };
  const handleDeleteProvision = async (id: string) => { if (window.confirm("Apagar provisão?")) { const { error } = await supabase.from('accounting_provisions').delete().eq('id', id); if (!error) setProvisions(prev => prev.filter(p => p.id !== id)); } };

  const handleSaveProfile = async () => { setSavingProfile(true); try { await supabase.from('profiles').update({ full_name: editForm.fullName, job_title: editForm.jobTitle, updated_at: new Date() }).eq('id', userData.id); setProfileData({ ...profileData, ...{ full_name: editForm.fullName } }); alert(`Perfil atualizado!`); setIsProfileModalOpen(false); } catch { alert("Erro ao guardar."); } finally { setSavingProfile(false); } };
  const handleSaveCompany = async () => { setSavingCompany(true); try { 
      const updates = { 
          company_name: companyForm.name, 
          company_nif: companyForm.nif, 
          company_address: companyForm.address, 
          country: companyForm.country, 
          currency: companyForm.currency, 
          custom_exchange_rates: exchangeRates, 
          logo_url: companyForm.logo_url, 
          company_footer: companyForm.footer, 
          invoice_color: companyForm.invoice_color, 
          header_text: companyForm.header_text, 
          template_url: companyForm.template_url,
          invoice_template_url: companyForm.invoice_template_url, 
          updated_at: new Date() 
      }; 
      await supabase.from('profiles').update(updates).eq('id', userData.id); 
      setProfileData({ ...profileData, ...updates }); 
      if(companyForm.country) {
          const { error: rpcError } = await supabase.rpc('init_company_accounting', { target_user_id: userData.id, target_country: companyForm.country });
          if(!rpcError) {
              const { data: newAccounts } = await supabase.from('company_accounts').select('*').order('code', { ascending: true });
              if(newAccounts) setCompanyAccounts(newAccounts);
          }
      }
      alert(`Dados guardados!`); 
  } catch { alert("Erro ao guardar."); } finally { setSavingCompany(false); } };
  
  const handleDeleteAccount = async () => { if (deleteConfirmation !== 'ELIMINAR') return alert(t('delete.confirm_text')); setIsDeleting(true); try { await supabase.rpc('delete_user'); await supabase.auth.signOut(); navigate('/'); } catch(e: any) { alert(e.message); } finally { setIsDeleting(false); } };
  
  const handleSendChatMessage = async (e: React.FormEvent) => { e.preventDefault(); if (!chatInput.trim() || isChatLoading) return; const userMessage = { role: 'user', content: chatInput }; setMessages(prev => [...prev, userMessage]); setChatInput(''); setIsChatLoading(true); try { const context = `[Empresa: ${companyForm.name}, País: ${companyForm.country}, Moeda: ${currentCurrency}] ${chatInput}`; const response = await fetch(`${API_URL}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: context }) }); const data = await response.json(); if (data.reply) setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]); } catch { setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Erro de conexão.' }]); } finally { setIsChatLoading(false); } };

  const selectLanguage = (code: string) => { i18n.changeLanguage(code); setIsLangMenuOpen(false); };
  const toggleTheme = () => { document.documentElement.classList.toggle('dark'); setIsDark(!isDark); };
  const toggleFinancials = () => setShowFinancials(!showFinancials);
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => { const selectedCountry = e.target.value; const newCurrency = getCurrencyCode(selectedCountry); setCompanyForm({ ...companyForm, country: selectedCountry, currency: newCurrency }); };
  const handleRateChange = (currency: string, value: string) => { setExchangeRates((prev: any) => ({ ...prev, [currency]: parseFloat(value) || 0 })); };

  if (loadingUser) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 dark:text-white">A carregar escritório...</div>;
  const isOwner = profileData?.role === 'owner';

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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform md:translate-x-0 transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b dark:border-gray-700">
            <Link to="/" className="flex items-center gap-3"><img src="/logopequena.PNG" className="h-8 w-auto"/><span className="font-bold text-xl">EasyCheck</span></Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            if (item.hidden) return null;
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg' : item.special ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-100 dark:border-purple-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <item.icon className="w-5 h-5" /><span>{item.label}</span>
              </Link>
            );
          })}
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
                {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Globe className="w-5 h-5"/></button>
                {isLangMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsLangMenuOpen(false)}></div>
                    <div className="absolute top-12 right-0 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40 overflow-hidden py-1">
                      {languages.map((lang) => (<button key={lang.code} onClick={() => selectLanguage(lang.code)} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-3 items-center text-sm font-medium"><span>{lang.flag}</span>{lang.label}</button>))}
                    </div>
                  </>
                )}
            </div>
            <button onClick={toggleTheme} className="p-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}</button>
            <div className="relative">
              <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full text-white font-bold shadow-md cursor-pointer hover:opacity-90">{getInitials(profileData?.full_name)}</button>
              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute top-16 right-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40 overflow-hidden">
                    <div className="px-4 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <p className="font-bold truncate">{profileData?.full_name}</p>
                      <p className="text-xs text-gray-500 truncate mb-2">{profileData?.company_name}</p>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full inline-block">{isOwner ? t('role.owner') : t('role.employee')}</span>
                    </div>
                    <button onClick={() => {setIsProfileModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-2 text-sm font-medium"><User className="w-4 h-4"/> {t('profile.edit')}</button>
                    <button onClick={() => {setIsDeleteModalOpen(true); setIsProfileDropdownOpen(false)}} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex gap-2 border-t dark:border-gray-700 text-sm font-medium"><Trash2 className="w-4 h-4"/> {t('profile.delete')}</button>
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
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                            <div className="flex justify-between items-center mb-2"><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Receita Mensal</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{showFinancials ? `${displaySymbol} ${totalRevenue.toFixed(2)}` : '••••••'}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                            <div className="flex justify-between items-center mb-2"><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Despesas</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div>
                            <p className="text-3xl font-bold text-red-500 dark:text-red-400">{showFinancials ? `${displaySymbol} ${totalExpenses.toFixed(2)}` : '••••••'}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                            <div className="flex justify-between items-center mb-2"><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Saldo Atual</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div>
                            <p className={`text-3xl font-bold ${currentBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>{showFinancials ? `${displaySymbol} ${currentBalance.toFixed(2)}` : '••••••'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 flex items-center justify-between"><div><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Faturas Emitidas</h3><p className="text-3xl font-bold text-orange-500 mt-1">{showFinancials ? totalInvoicesCount : '•••'}</p></div><div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl"><FileText className="w-8 h-8 text-orange-500"/></div></div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 flex items-center justify-between"><div><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Ações Pendentes</h3><p className="text-3xl font-bold text-blue-600 mt-1">0</p></div><div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl"><Bell className="w-8 h-8 text-blue-600"/></div></div>
                    </div>
                </div>
            } />
            <Route path="accounting" element={
                <div className="h-full flex flex-col">
                    <div className="flex gap-2 border-b dark:border-gray-700 pb-2 mb-6 overflow-x-auto">
                        {[{id:'overview',l:'Diário',i:PieChart},{id:'coa',l:'Plano de Contas',i:List},{id:'invoices',l:'Vendas',i:FileText},{id:'purchases',l:'Compras',i:TrendingDown},{id:'banking',l:'Bancos',i:Landmark},{id:'clients',l:'Clientes',i:Briefcase},{id:'suppliers',l:'Fornecedores',i:Truck},{id:'assets',l:'Ativos',i:Box},{id:'taxes',l:'Impostos',i:FileCheck},{id:'reports',l:'Relatórios',i:FileSpreadsheet}].map(t=>(<button key={t.id} onClick={()=>setAccountingTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border ${accountingTab===t.id?'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800':'bg-white dark:bg-gray-800 border-transparent'}`}><t.i size={16}/>{t.l}</button>))}
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
                        {accountingTab === 'overview' && (
                            <div className="p-4">
                                <div className="flex justify-between mb-4"><h3 className="font-bold flex gap-2"><BookOpen/> Diário Geral (Lançamentos)</h3><button onClick={()=>setShowTransactionModal(true)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm"><Plus size={16}/></button></div>
                                
                                {/* ✅ NOVA TABELA DENSA PROFISSIONAL */}
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
                                            {journalEntries.length === 0 ? (
                                                <tr><td colSpan={6} className="p-8 text-center text-gray-400">Sem movimentos registados.</td></tr>
                                            ) : (
                                                journalEntries.map(entry => (
                                                    entry.journal_items?.map((item: any, i: number) => (
                                                        <tr key={`${entry.id}-${i}`} className="border-b last:border-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                            <td className="p-2 w-24 text-gray-500 font-mono">{i === 0 ? new Date(entry.date).toLocaleDateString() : ''}</td>
                                                            <td className="p-2 w-24 font-bold text-blue-600">{i === 0 ? (entry.document_ref || 'MANUAL') : ''}</td>
                                                            <td className="p-2 w-20 font-mono font-bold">{item.company_accounts?.code}</td>
                                                            <td className="p-2 text-gray-700 dark:text-gray-300">{i === 0 ? entry.description : <span className="text-gray-400 ml-4">↳ {item.company_accounts?.name}</span>}</td>
                                                            <td className="p-2 text-right w-24 font-mono">{item.debit > 0 ? displaySymbol + item.debit.toFixed(2) : ''}</td>
                                                            <td className="p-2 text-right w-24 font-mono text-gray-600">{item.credit > 0 ? displaySymbol + item.credit.toFixed(2) : ''}</td>
                                                        </tr>
                                                    ))
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {accountingTab === 'coa' && (
                            <div className="p-4">
                                <h3 className="font-bold flex gap-2 mb-4"><List/> Plano de Contas ({companyForm.country})</h3>
                                <div className="overflow-y-auto max-h-[60vh]">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="p-3">Conta</th><th className="p-3">Descrição</th><th className="p-3">Tipo</th></tr></thead>
                                        <tbody>
                                            {companyAccounts.map(acc => (
                                                <tr key={acc.id} className="border-b dark:border-gray-700 hover:bg-gray-50">
                                                    <td className="p-3 font-mono font-bold text-blue-600">{acc.code}</td>
                                                    <td className="p-3">{acc.name}</td>
                                                    <td className="p-3 uppercase text-[10px]"><span className="bg-gray-100 px-2 py-1 rounded">{acc.type}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {companyAccounts.length === 0 && <p className="text-center py-8 text-gray-400">Vá a Definições e guarde o país para gerar o plano.</p>}
                                </div>
                            </div>
                        )}
                        {accountingTab === 'invoices' && (
                            <div>
                                {!showInvoiceForm ? (
                                    <>
                                        <div className="p-4 flex justify-between bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700"><h3 className="font-bold flex gap-2"><FileText/> Faturas Emitidas</h3><button onClick={()=>{resetInvoiceForm();setShowInvoiceForm(true)}} className="bg-blue-600 text-white px-3 py-1.5 rounded flex gap-2 items-center text-sm font-bold"><Plus size={16}/> Nova Fatura</button></div>
                                        <table className="w-full text-xs text-left"><thead className="bg-gray-100 dark:bg-gray-700 uppercase"><tr><th className="p-3">Nº</th><th className="p-3">Cliente</th><th className="p-3">Data</th><th className="p-3 text-right">Total</th><th className="p-3 text-right">...</th></tr></thead>
                                        <tbody>{realInvoices.map(i=>(<tr key={i.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"><td className="p-3 font-mono text-blue-600">{i.invoice_number}</td><td className="p-3">{i.clients?.name}</td><td className="p-3">{new Date(i.date).toLocaleDateString()}</td><td className="p-3 text-right font-bold">{displaySymbol} {i.total}</td><td className="p-3 text-right"><button onClick={()=>handleQuickPreview(i)} className="mr-2 text-gray-500 hover:text-blue-600"><Eye size={14}/></button><button onClick={()=>handleDeleteInvoice(i.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button></td></tr>))}</tbody></table>
                                    </>
                                ) : (
                                    /* --- FORMULÁRIO COM SCROLL --- */
                                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl shadow-2xl border dark:border-gray-700 h-[90vh] flex flex-col">
                                            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900 rounded-t-2xl">
                                                <h3 className="font-bold text-xl flex gap-2 items-center"><FileText className="text-blue-600"/> Editor de Fatura</h3>
                                                <button onClick={()=>setShowInvoiceForm(false)} className="hover:bg-gray-200 p-2 rounded-full"><X/></button>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-8">
                                                <div className="grid grid-cols-3 gap-6 mb-6">
                                                    <div><label className="text-xs font-bold block mb-2 uppercase text-gray-500">Cliente</label><select className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" value={invoiceData.client_id} onChange={e=>setInvoiceData({...invoiceData,client_id:e.target.value})}><option value="">Selecione...</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                                                    <div><label className="text-xs font-bold block mb-2 uppercase text-gray-500">Tipo Doc.</label><select className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" value={invoiceData.type} onChange={e=>setInvoiceData({...invoiceData,type:e.target.value})}>{invoiceTypes.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
                                                    <div><label className="text-xs font-bold block mb-2 uppercase text-gray-500">Data</label><input type="date" className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" value={invoiceData.date} onChange={e=>setInvoiceData({...invoiceData,date:e.target.value})}/></div>
                                                </div>
                                                <table className="w-full text-sm mb-6 border-collapse">
                                                    <thead><tr className="bg-gray-100 dark:bg-gray-700 text-left"><th className="p-3 rounded-l-lg">Descrição</th><th className="p-3 w-20 text-center">Qtd</th><th className="p-3 w-32 text-right">Preço</th><th className="p-3 w-24 text-right">IVA</th><th className="p-3 w-32 text-right rounded-r-lg">Total</th><th className="p-3 w-10"></th></tr></thead>
                                                    <tbody>
                                                        {invoiceData.items.map((it,ix)=>(
                                                            <tr key={ix} className="border-b dark:border-gray-700 group">
                                                                <td className="p-3"><input className="w-full bg-transparent outline-none font-medium" placeholder="Item" value={it.description} onChange={e=>updateInvoiceItem(ix,'description',e.target.value)}/></td>
                                                                <td className="p-3"><input type="number" className="w-full bg-transparent text-center outline-none" value={it.quantity} onChange={e=>updateInvoiceItem(ix,'quantity',e.target.value)}/></td>
                                                                <td className="p-3"><input type="number" className="w-full bg-transparent text-right outline-none" value={it.price} onChange={e=>updateInvoiceItem(ix,'price',e.target.value)}/></td>
                                                                <td className="p-3"><select className="w-full bg-transparent outline-none text-right appearance-none cursor-pointer" value={it.tax} onChange={e=>updateInvoiceItem(ix,'tax',e.target.value)}>{getCurrentCountryVatRates().map(r=><option key={r} value={r}>{r}%</option>)}</select></td>
                                                                <td className="p-3 text-right font-bold">{displaySymbol} {(it.quantity*it.price).toFixed(2)}</td>
                                                                <td className="p-3 text-center"><button onClick={()=>handleRemoveInvoiceItem(ix)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <button onClick={handleAddInvoiceItem} className="text-blue-600 text-sm font-bold flex items-center gap-2 hover:underline"><Plus size={16}/> Adicionar Linha</button>
                                            </div>
                                            <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-2xl flex justify-end gap-3">
                                                <button onClick={()=>setShowInvoiceForm(false)} className="px-6 py-3 border rounded-xl font-bold text-gray-500 hover:bg-white transition-colors">Cancelar</button>
                                                <button onClick={handleSaveInvoice} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><CheckCircle size={20}/> Emitir Documento</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {accountingTab === 'purchases' && (
                            <div>
                                {!showPurchaseForm ? (
                                    <>
                                        <div className="p-4 flex justify-between bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700"><h3 className="font-bold flex gap-2"><TrendingDown/> Registo de Compras</h3><button onClick={()=>setShowPurchaseForm(true)} className="bg-blue-600 text-white px-3 py-1.5 rounded flex gap-2 items-center text-sm font-bold"><Plus size={16}/> Lançar Compra</button></div>
                                        <table className="w-full text-xs text-left"><thead className="bg-gray-100 dark:bg-gray-700 uppercase"><tr><th className="p-3">Data</th><th className="p-3">Fornecedor</th><th className="p-3">Ref. Fatura</th><th className="p-3 text-right">Total</th></tr></thead>
                                        <tbody>{purchases.map(p=>(<tr key={p.id} className="border-b dark:border-gray-700"><td className="p-3">{new Date(p.date).toLocaleDateString()}</td><td className="p-3">{p.suppliers?.name}</td><td className="p-3">{p.invoice_number}</td><td className="p-3 text-right font-bold text-red-500">{displaySymbol} {p.total}</td></tr>))}</tbody></table>
                                    </>
                                ) : (
                                    <div className="p-6">
                                        <h3 className="font-bold mb-4 text-lg">Registar Fatura de Fornecedor</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div><label className="text-xs font-bold block uppercase text-gray-500 mb-1">Fornecedor</label><select className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" onChange={e=>setNewPurchase({...newPurchase,supplier_id:e.target.value})}><option>Selecione...</option>{suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                                            <div><label className="text-xs font-bold block uppercase text-gray-500 mb-1">Total Com IVA</label><input type="number" className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" onChange={e=>setNewPurchase({...newPurchase,total:e.target.value})}/></div>
                                            <div><label className="text-xs font-bold block uppercase text-gray-500 mb-1">Nº Fatura</label><input className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" onChange={e=>setNewPurchase({...newPurchase,invoice_number:e.target.value})}/></div>
                                            <div><label className="text-xs font-bold block uppercase text-gray-500 mb-1">Valor do IVA</label><input type="number" className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" onChange={e=>setNewPurchase({...newPurchase,tax_total:e.target.value})}/></div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-6">
                                            <button onClick={()=>setShowPurchaseForm(false)} className="px-4 py-2 border rounded-lg font-bold">Cancelar</button>
                                            <button onClick={handleCreatePurchase} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">Gravar Despesa</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {accountingTab === 'banking' && (
                            <div className="p-6 text-center"><h3 className="text-xl font-bold mb-2">Reconciliação Bancária</h3><p className="text-gray-500 mb-4">Saldo Contabilístico: <span className="font-bold text-blue-600">{displaySymbol} {currentBalance.toFixed(2)}</span></p><div className="border rounded-xl overflow-hidden"><table className="w-full text-xs text-left"><thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="p-3">Movimento</th><th className="p-3 text-right">Valor</th><th className="p-3 text-center">Banco?</th></tr></thead><tbody>{journalEntries.map(t=>(<tr key={t.id} className="border-b dark:border-gray-700"><td className="p-3">{t.description}</td><td className="p-3 text-right">{t.amount || '-'}</td><td className="p-3 text-center"><input type="checkbox"/></td></tr>))}</tbody></table></div></div>
                        )}
                        {accountingTab === 'taxes' && (
                            <div className="p-6">
                                <h3 className="font-bold text-lg mb-4 flex gap-2"><FileCheck/> Mapa de IVA (Trimestral)</h3>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100 shadow-sm"><p className="text-xs font-bold uppercase text-green-700 tracking-wider">IVA Liquidado (Vendas)</p><p className="text-3xl font-bold text-green-600 mt-2">{displaySymbol} {realInvoices.reduce((a,c)=>a+c.tax_total,0).toFixed(2)}</p></div>
                                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm"><p className="text-xs font-bold uppercase text-red-700 tracking-wider">IVA Dedutível (Compras)</p><p className="text-3xl font-bold text-red-600 mt-2">{displaySymbol} {purchases.reduce((a,c)=>a+c.tax_total,0).toFixed(2)}</p></div>
                                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm"><p className="text-xs font-bold uppercase text-blue-700 tracking-wider">Estado (A Pagar/Receber)</p><p className="text-3xl font-bold text-blue-600 mt-2">{displaySymbol} {(realInvoices.reduce((a,c)=>a+c.tax_total,0) - purchases.reduce((a,c)=>a+c.tax_total,0)).toFixed(2)}</p></div>
                                </div>
                            </div>
                        )}
                        {accountingTab === 'reports' && (
                            <div className="p-6 text-center">
                                <h3 className="font-bold text-lg mb-6 text-gray-700 dark:text-white">Relatórios Financeiros Oficiais</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                    <button onClick={() => generateFinancialReport('balancete')} className="p-8 border rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-700 flex flex-col items-center gap-4 transition-all hover:scale-105 shadow-sm group">
                                        <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-200"><List size={32} className="text-blue-600"/></div>
                                        <div><h4 className="font-bold text-xl text-gray-800 dark:text-white">Balancete</h4><p className="text-sm text-gray-500">Resumo de todas as contas e verificação de equilíbrio.</p></div>
                                    </button>
                                    <button onClick={() => generateFinancialReport('dre')} className="p-8 border rounded-2xl hover:bg-green-50 dark:hover:bg-green-900/20 border-gray-200 dark:border-gray-700 flex flex-col items-center gap-4 transition-all hover:scale-105 shadow-sm group">
                                        <div className="bg-green-100 p-4 rounded-full group-hover:bg-green-200"><TrendingUpIcon size={32} className="text-green-600"/></div>
                                        <div><h4 className="font-bold text-xl text-gray-800 dark:text-white">Demonstração de Resultados</h4><p className="text-sm text-gray-500">Análise de Proveitos (Vendas) vs Custos.</p></div>
                                    </button>
                                </div>
                                {journalEntries.length === 0 && <p className="mt-8 text-sm text-red-400 bg-red-50 p-2 rounded inline-block">⚠️ Gere movimentos (Faturas/Despesas) para desbloquear os relatórios.</p>}
                            </div>
                        )}
                        {accountingTab === 'suppliers' && (
                            <div>
                                <div className="p-4 flex justify-between bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700"><h3 className="font-bold flex gap-2"><Truck/> Fornecedores</h3><button onClick={()=>{setEditingEntityId(null);setNewEntity({name:'',nif:'',email:'',address:'',city:'',postal_code:'',country:'Portugal'});setEntityType('supplier');setShowEntityModal(true)}} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-bold flex gap-2"><Plus size={16}/> Novo</button></div>
                                <table className="w-full text-xs text-left"><thead className="bg-gray-100 dark:bg-gray-700 uppercase"><tr><th className="p-3">Nome</th><th className="p-3">NIF</th><th className="p-3">Email</th><th className="p-3">Categoria</th><th className="p-3 text-right">Ações</th></tr></thead>
                                <tbody>{suppliers.map(s=>(<tr key={s.id} className="border-b dark:border-gray-700"><td className="p-3 font-bold">{s.name}</td><td className="p-3 font-mono">{s.nif}</td><td className="p-3">{s.email}</td><td className="p-3"><span className="bg-gray-100 px-2 py-1 rounded text-[10px] uppercase font-bold">Geral</span></td><td className="p-3 text-right flex justify-end gap-2"><button onClick={()=>handleEditEntity(s,'supplier')} className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Edit2 size={14}/></button><button onClick={()=>handleDeleteEntity(s.id, 'supplier')} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14}/></button></td></tr>))}</tbody></table>
                            </div>
                        )}
                        {accountingTab === 'clients' && (<div><div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800"><h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2"><Users size={18}/> Gestão de Clientes</h3><button onClick={() => {setEditingEntityId(null); setNewEntity({ name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' }); setEntityType('client'); setShowEntityModal(true)}} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex gap-2 items-center hover:bg-blue-700"><Plus size={16}/> Novo Cliente</button></div><table className="w-full text-xs text-left"><thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase font-bold"><tr><th className="px-6 py-3">Entidade</th><th className="px-6 py-3">NIF</th><th className="px-6 py-3">Localidade</th><th className="px-6 py-3 text-center">Estado</th><th className="px-6 py-3 text-right">Saldo Corrente</th><th className="px-6 py-3 text-right">Ações</th></tr></thead><tbody className="divide-y dark:divide-gray-700">{clients.map(c => (<tr key={c.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${c.status === 'doubtful' ? 'bg-red-50 dark:bg-red-900/10' : ''}`}><td className="px-6 py-3 font-bold text-gray-700 dark:text-gray-200">{c.name}</td><td className="px-6 py-3 font-mono">{c.nif || 'N/A'}</td><td className="px-6 py-3 text-gray-500">{c.city}</td><td className="px-6 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.status === 'doubtful' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{c.status === 'doubtful' ? 'Risco' : 'Ativo'}</span></td><td className={`px-6 py-3 text-right font-mono font-bold ${c.status === 'doubtful' ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>{c.doubtful_debt ? `${displaySymbol} ${c.doubtful_debt}` : '-'}</td><td className="px-6 py-3 text-right flex justify-end gap-2"><button onClick={() => handleOpenDoubtful(c)} className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${c.status === 'doubtful' ? 'text-red-500' : 'text-gray-400'}`}><AlertTriangle size={14}/></button><button onClick={() => handleEditEntity(c, 'client')} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Edit2 size={14}/></button><button onClick={() => handleDeleteEntity(c.id, 'client')} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14}/></button></td></tr>))}</tbody></table></div>)}
                        {accountingTab === 'assets' && (
                            <div><div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800"><h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2"><Box size={18}/> Mapa de Imobilizado</h3><button onClick={() => {setEditingAssetId(null); setNewAsset({ name: '', category: 'Equipamento', purchase_date: new Date().toISOString().split('T')[0], purchase_value: '', lifespan_years: 3, amortization_method: 'linear' }); setShowAssetModal(true)}} className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-bold flex gap-2 items-center hover:bg-blue-700"><Plus size={16}/> Novo Ativo</button></div><table className="w-full text-xs text-left"><thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase font-bold"><tr><th className="px-6 py-3">Ativo</th><th className="px-6 py-3">Data Aq.</th><th className="px-6 py-3 text-right">Valor Aq.</th><th className="px-6 py-3 text-right">Amort. Acumulada</th><th className="px-6 py-3 text-right">Valor Líquido (VNC)</th><th className="px-6 py-3 text-center">Método</th><th className="px-6 py-3 text-center">...</th></tr></thead><tbody className="divide-y dark:divide-gray-700">{assets.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">Nenhum ativo registado.</td></tr> : assets.map(a => { const currentVal = getCurrentAssetValue(a); const accumulated = a.purchase_value - currentVal; return (<tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700"><td className="px-6 py-3 font-bold text-gray-700 dark:text-gray-200">{a.name}</td><td className="px-6 py-3 font-mono text-gray-500">{new Date(a.purchase_date).toLocaleDateString()}</td><td className="px-6 py-3 text-right font-mono">{displaySymbol} {(a.purchase_value * conversionRate).toFixed(2)}</td><td className="px-6 py-3 text-right font-mono text-gray-500">{displaySymbol} {(accumulated * conversionRate).toFixed(2)}</td><td className="px-6 py-3 text-right font-mono font-bold text-blue-600">{displaySymbol} {(currentVal * conversionRate).toFixed(2)}</td><td className="px-6 py-3 text-center"><span className="bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase">{a.amortization_method === 'linear' ? 'Linear' : 'Degress.'}</span></td><td className="px-6 py-3 text-center flex justify-center gap-2"><button onClick={() => handleShowAmortSchedule(a)} className="text-blue-500 hover:text-blue-700" title="Ver Plano"><List size={14}/></button><button onClick={() => handleDeleteAsset(a.id)} className="text-red-400 hover:text-red-600" title="Abater"><Trash2 size={14}/></button></td></tr>); })}</tbody></table></div>
                        )}
                    </div>
                </div>
            } />
            <Route path="settings" element={
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
                        <h2 className="text-xl font-bold mb-6 flex gap-2"><Settings/> Definições Globais</h2>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div><label className="block text-xs font-bold mb-1">País</label><select value={companyForm.country} onChange={handleCountryChange} className="w-full p-3 border rounded-xl dark:bg-gray-900">{countries.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                            <div><label className="block text-xs font-bold mb-1">Moeda</label><input value={companyForm.currency} className="w-full p-3 border rounded-xl dark:bg-gray-900 bg-gray-100" disabled/></div>
                        </div>
                    </div>
                    {/* ✅ SECÇÃO DE PERSONALIZAÇÃO DE FATURA */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
                        <h2 className="text-xl font-bold mb-6 flex gap-2"><Palette/> Personalização Documentos</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div><label className="block text-xs font-bold mb-1">Cor da Marca (Hex)</label><div className="flex gap-2"><input type="color" value={companyForm.invoice_color} onChange={e=>setCompanyForm({...companyForm,invoice_color:e.target.value})} className="h-10 w-10 cursor-pointer"/><input value={companyForm.invoice_color} onChange={e=>setCompanyForm({...companyForm,invoice_color:e.target.value})} className="flex-1 p-2 border rounded-xl dark:bg-gray-900"/></div></div>
                            <div><label className="block text-xs font-bold mb-1">Texto Cabeçalho (Opcional)</label><input placeholder="Ex: Capital Social 5000€" value={companyForm.header_text} onChange={e=>setCompanyForm({...companyForm,header_text:e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/></div>
                            <div className="col-span-2"><label className="block text-xs font-bold mb-1">Texto Rodapé</label><input placeholder="Ex: Processado por Computador" value={companyForm.footer} onChange={e=>setCompanyForm({...companyForm,footer:e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/></div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold mb-1">Logo</label><input type="file" onChange={handleLogoUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>{uploadingLogo && <p className="text-xs text-blue-500 mt-1">A carregar...</p>}</div>
                            <div><label className="block text-xs font-bold mb-1">Template de Fundo (Imagem A4/PDF)</label><input type="file" onChange={handleTemplateUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"/>{uploadingTemplate && <p className="text-xs text-purple-500 mt-1">A carregar...</p>}</div>
                        </div>
                    </div>
                    {/* ✅ ZONA DE PERIGO (RESET) */}
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-8">
                        <h2 className="text-xl font-bold mb-4 flex gap-2 text-red-700 dark:text-red-400"><AlertOctagon/> Zona de Perigo</h2>
                        <p className="text-sm text-red-600 dark:text-red-300 mb-4">Se deseja reiniciar a sua contabilidade para começar do zero, use este botão. Isto apagará todas as faturas e movimentos.</p>
                        <button onClick={handleResetFinancials} className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700">Reiniciar Dados Financeiros</button>
                    </div>
                    <div className="flex justify-end pt-4"><button onClick={handleSaveCompany} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Guardar & Inicializar</button></div>
                </div>
            } />
            <Route path="chat" element={<div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden"><div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">{messages.map((msg, i) => (<div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'}`}>{msg.content}</div></div>))}{isChatLoading && <div className="text-xs text-gray-400 ml-4 animate-pulse">A analisar...</div>}</div><div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900"><form onSubmit={handleSendChatMessage} className="flex gap-2 relative"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Pergunte ao assistente EasyCheck..." className="flex-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"/><button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow-md disabled:opacity-50"><Send size={18} /></button></form></div></div>} />
            <Route path="company" element={isOwner ? (<div className="max-w-4xl mx-auto space-y-6"><div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6 flex flex-col md:flex-row items-center justify-between gap-6"><div><h4 className="font-bold text-blue-900 dark:text-white mb-1">{t('settings.invite_code')}</h4><p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.invite_text')}</p></div><div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700"><code className="px-2 font-mono text-lg font-bold text-gray-700 dark:text-gray-300">{showPageCode ? profileData?.company_code : '••••••••'}</code><button onClick={() => setShowPageCode(!showPageCode)} className="p-2 text-gray-400 hover:text-blue-600">{showPageCode ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button><button onClick={copyCode} className="p-2 text-gray-400 hover:text-blue-600"><Copy className="w-4 h-4"/></button></div></div><div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8"><h3 className="text-lg font-bold mb-4 flex gap-2 items-center"><Users className="text-blue-600"/> {t('settings.team_members')}</h3><div className="text-center py-12 border-2 border-dashed rounded-xl text-gray-500">{t('settings.no_members')}</div></div></div>) : <div className="text-center py-12"><Shield className="w-16 h-16 mx-auto mb-4 text-gray-300"/><h3 className="text-xl font-bold dark:text-white">Acesso Restrito</h3></div>} />
            <Route path="*" element={<div className="flex justify-center py-10 text-gray-400">Em desenvolvimento...</div>} />
          </Routes>
        </div>
      </main>

      {/* --- MODAIS GLOBAIS --- */}
      {showPreviewModal && pdfPreviewUrl && (<div className="fixed inset-0 z-[100] flex flex-col bg-gray-900 bg-opacity-90 backdrop-blur-sm p-4 animate-fade-in"><div className="flex justify-between items-center text-white mb-4"><h3 className="text-xl font-bold flex gap-2"><FileText/> Pré-visualização Profissional</h3><div className="flex gap-4"><button onClick={handleDownloadPDF} className="bg-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-500 flex items-center gap-2"><Download size={18}/> Baixar PDF</button><button onClick={() => setShowPreviewModal(false)} className="bg-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-600"><X size={18}/></button></div></div><div className="flex-1 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl"><iframe src={pdfPreviewUrl} className="w-full h-full" title="PDF Preview"></iframe></div></div>)}
      {showAmortSchedule && selectedAssetForSchedule && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-4xl shadow-xl border dark:border-gray-700 max-h-[80vh] overflow-y-auto"><div className="flex justify-between items-center mb-6"><div><h3 className="text-xl font-bold flex gap-2 items-center"><TrendingUpIcon className="text-blue-500"/> Mapa de Amortização Financeira</h3><p className="text-sm text-gray-500 mt-1 uppercase font-bold">{selectedAssetForSchedule.name}</p></div><button onClick={() => setShowAmortSchedule(false)}><X className="text-gray-400 hover:text-red-500"/></button></div><table className="w-full text-xs text-left"><thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 uppercase text-xs font-bold border-b border-gray-200 dark:border-gray-600"><tr><th className="px-4 py-3">Ano</th><th className="px-4 py-3 text-right">V. Inicial</th><th className="px-4 py-3 text-right">Quota</th><th className="px-4 py-3 text-right">Acumulado</th><th className="px-4 py-3 text-right">V. Final (VNC)</th></tr></thead><tbody>{calculateAmortizationSchedule(selectedAssetForSchedule).map((row: any, i) => (<tr key={row.year} className={`border-b dark:border-gray-700 ${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}`}><td className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">{row.year}</td><td className="px-4 py-3 text-right text-gray-500 font-mono">{displaySymbol} {row.startValue.toFixed(2)}</td><td className="px-4 py-3 text-right font-bold text-blue-600 font-mono">{displaySymbol} {row.annuity.toFixed(2)}</td><td className="px-4 py-3 text-right text-gray-500 font-mono">{displaySymbol} {row.accumulated.toFixed(2)}</td><td className="px-4 py-3 text-right font-bold text-gray-800 dark:text-white font-mono">{displaySymbol} {row.endValue.toFixed(2)}</td></tr>))}</tbody></table></div></div>)}
      {showDoubtfulModal && selectedClientForDebt && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl border dark:border-gray-700"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex gap-2 items-center text-red-600"><AlertTriangle size={20}/> Gerir Dívida Incobrável</h3></div><div className="space-y-4"><p className="text-sm text-gray-500">Ao marcar {selectedClientForDebt.name} como de risco, deve definir o valor em provisão.</p><div className="flex gap-4 mb-4 bg-gray-100 p-1 rounded-lg"><button onClick={() => setDebtMethod('manual')} className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${debtMethod === 'manual' ? 'bg-white shadow text-red-700' : 'text-gray-500'}`}>Valor Manual</button><button onClick={() => setDebtMethod('invoices')} className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${debtMethod === 'invoices' ? 'bg-white shadow text-red-700' : 'text-gray-500'}`}>Selecionar Faturas</button></div>{debtMethod === 'manual' ? (<div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Valor em Dívida ({displaySymbol})</label><input type="number" value={manualDebtAmount} onChange={e => setManualDebtAmount(e.target.value)} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none font-bold text-red-600 text-xl"/></div>) : (<div className="max-h-60 overflow-y-auto border rounded-xl p-2 bg-gray-50">{realInvoices.filter(i => i.client_id === selectedClientForDebt.id).map(inv => (<div key={inv.id} className="flex items-center gap-3 p-3 hover:bg-white border-b last:border-0 cursor-pointer" onClick={() => { if(selectedDebtInvoices.includes(inv.id)) setSelectedDebtInvoices(selectedDebtInvoices.filter(id => id !== inv.id)); else setSelectedDebtInvoices([...selectedDebtInvoices, inv.id]); }}><input type="checkbox" checked={selectedDebtInvoices.includes(inv.id)} readOnly className="w-5 h-5 text-red-600 rounded" /><div className="flex-1"><p className="font-bold text-sm text-gray-700">{inv.invoice_number}</p><p className="text-xs text-gray-500">{new Date(inv.date).toLocaleDateString()}</p></div><span className="font-bold text-red-600">{displaySymbol} {inv.total}</span></div>))}{realInvoices.filter(i => i.client_id === selectedClientForDebt.id).length === 0 && <p className="text-xs text-gray-400 text-center py-4">Sem faturas para este cliente.</p>}</div>)}</div><div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowDoubtfulModal(false)} className="px-4 py-2 text-gray-500">Cancelar</button><button onClick={saveDoubtfulDebt} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-lg">Confirmar Risco</button></div></div></div>)}
      {showProvisionModal && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-gray-700"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex gap-2 items-center text-gray-700 dark:text-white"><AlertOctagon size={20} className="text-yellow-500"/> Nova Provisão</h3></div><div className="space-y-4"><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Descrição do Risco</label><input placeholder="Ex: Processo Judicial em curso" value={newProvision.description} onChange={e => setNewProvision({...newProvision, description: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Valor Estimado ({displaySymbol})</label><input type="number" placeholder="0.00" value={newProvision.amount} onChange={e => setNewProvision({...newProvision, amount: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Tipo</label><select value={newProvision.type} onChange={e => setNewProvision({...newProvision, type: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"><option>Riscos e Encargos</option><option>Impostos</option><option>Garantias a Clientes</option><option>Processos Judiciais</option></select></div></div><div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700"><button onClick={() => setShowProvisionModal(false)} className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancelar</button><button onClick={handleCreateProvision} className="px-6 py-3 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-700 shadow-lg transition-transform active:scale-95">Constituir Provisão</button></div></div></div>)}
      {showTransactionModal && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-gray-700"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex gap-2 items-center text-gray-700 dark:text-white"><FileText size={20} className="text-blue-500"/> Nova Transação</h3></div><div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl"><button onClick={() => setNewTransaction({...newTransaction, type: 'income'})} className={`py-2 rounded-lg font-bold text-sm transition-all ${newTransaction.type === 'income' ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Receita (+)</button><button onClick={() => setNewTransaction({...newTransaction, type: 'expense'})} className={`py-2 rounded-lg font-bold text-sm transition-all ${newTransaction.type === 'expense' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Despesa (-)</button></div><div className="space-y-4"><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Descrição</label><input placeholder="Ex: Venda de Software" value={newTransaction.description} onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"/></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Valor ({displaySymbol})</label><input type="number" placeholder="0.00" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"/></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Data</label><input type="date" value={newTransaction.date} onChange={e => setNewTransaction({...newTransaction, date: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none text-sm"/></div></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Categoria</label><input placeholder="Sem categoria" list="categories" value={newTransaction.category} onChange={e => setNewTransaction({...newTransaction, category: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"/><datalist id="categories"><option value="Geral"/><option value="Alimentação"/><option value="Transporte"/><option value="Serviços"/><option value="Vendas"/><option value="Salários"/></datalist></div></div><div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700"><button onClick={() => setShowTransactionModal(false)} className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancelar</button><button onClick={handleCreateTransaction} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform active:scale-95">Registar</button></div></div></div>)}
      {showAssetModal && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-gray-700"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex gap-2 items-center text-gray-700 dark:text-white"><Box size={20} className="text-blue-500"/> Novo Ativo Imobilizado</h3></div><div className="space-y-4"><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Nome do Ativo</label><input placeholder="Ex: Computador Dell XPS" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Valor Compra ({displaySymbol})</label><input type="number" placeholder="0.00" value={newAsset.purchase_value} onChange={e => setNewAsset({...newAsset, purchase_value: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Data Compra</label><input type="date" value={newAsset.purchase_date} onChange={e => setNewAsset({...newAsset, purchase_date: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none text-sm"/></div></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Categoria</label><select value={newAsset.category} onChange={e => setNewAsset({...newAsset, category: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"><option value="Equipamento">Equipamento Básico</option><option value="Software">Software / Licenças</option><option value="Transporte">Material de Transporte</option><option value="Imobiliario">Edifícios e Construções</option></select></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Vida Útil (Anos)</label><select value={newAsset.lifespan_years} onChange={e => setNewAsset({...newAsset, lifespan_years: parseInt(e.target.value)})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"><option value="3">3 Anos (Hardware/Software)</option><option value="4">4 Anos (Veículos Ligeiros)</option><option value="5">5 Anos (Mobiliário/Equipamento)</option><option value="8">8 Anos (Maquinaria Pesada)</option><option value="20">20 Anos (Edifícios)</option></select></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Método de Amortização</label><select value={newAsset.amortization_method} onChange={e => setNewAsset({...newAsset, amortization_method: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"><option value="linear">Quotas Constantes (Linear)</option><option value="degressive">Quotas Degressivas</option></select></div></div><div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700"><button onClick={() => setShowAssetModal(false)} className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancelar</button><button onClick={handleCreateAsset} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform active:scale-95">Adicionar Ativo</button></div></div></div>)}
      {showEntityModal && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl border dark:border-gray-700"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex gap-2 items-center text-gray-700 dark:text-white">{entityType === 'client' ? <Briefcase size={20} className="text-blue-500"/> : <Truck size={20} className="text-orange-500"/>} Novo {entityType === 'client' ? 'Cliente' : 'Fornecedor'}</h3></div><div className="space-y-4"><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Nome / Empresa</label><input placeholder="Ex: Tech Solutions Lda" value={newEntity.name} onChange={e => setNewEntity({...newEntity, name: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">NIF</label><input placeholder="999888777" value={newEntity.nif} onChange={e => setNewEntity({...newEntity, nif: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Email</label><input placeholder="geral@cliente.com" value={newEntity.email} onChange={e => setNewEntity({...newEntity, email: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Morada</label><input placeholder="Rua..." value={newEntity.address} onChange={e => setNewEntity({...newEntity, address: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Cidade</label><input placeholder="Lisboa" value={newEntity.city} onChange={e => setNewEntity({...newEntity, city: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div><div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">País</label><select value={newEntity.country} onChange={e => setNewEntity({...newEntity, country: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none">{countries.map(c => <option key={c} value={c}>{c}</option>)}</select></div></div></div><div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700"><button onClick={() => setShowEntityModal(false)} className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancelar</button><button onClick={handleCreateEntity} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform active:scale-95">Criar Ficha</button></div></div></div>)}
      {isProfileModalOpen && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl border dark:border-gray-700 max-h-[90vh] overflow-y-auto"><div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700"><h3 className="text-xl font-bold flex items-center gap-2"><User className="text-blue-600"/> {t('profile.edit_title')}</h3><button onClick={() => setIsProfileModalOpen(false)}><X className="text-gray-400"/></button></div><div className="space-y-4"><div><label className="block text-sm mb-1">{t('form.email')}</label><input type="email" value={editForm.email} disabled className="w-full p-3 border rounded-xl bg-gray-50 cursor-not-allowed"/></div><div><label className="block text-sm mb-1">{t('form.fullname')}</label><input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/></div><div><label className="block text-sm mb-1">{t('form.jobtitle')}</label><input type="text" value={editForm.jobTitle} onChange={e => setEditForm({...editForm, jobTitle: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900"/></div></div><div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700"><button onClick={() => setIsProfileModalOpen(false)} className="px-5 py-2.5 border rounded-xl">{t('common.cancel')}</button><button onClick={handleSaveProfile} disabled={savingProfile} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold">{savingProfile ? 'Guardando...' : t('common.save')}</button></div></div></div>)}
      {isDeleteModalOpen && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border dark:border-gray-700"><h3 className="text-xl font-bold text-red-600 mb-4 flex gap-2"><AlertTriangle/> {t('delete.title')}</h3><p className="text-gray-600 dark:text-gray-300 mb-4">{t('delete.text')}</p><input type="text" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} className="w-full p-3 border rounded mb-4 uppercase dark:bg-gray-900"/><div className="flex justify-end gap-2"><button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded">{t('common.cancel')}</button><button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded">{t('common.delete')}</button></div></div></div>)}
    </div>
  );
}