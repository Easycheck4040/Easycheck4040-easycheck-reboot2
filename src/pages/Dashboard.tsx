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
  TrendingUp as TrendingUpIcon, FileInput, MoreVertical, XCircle
} from 'lucide-react';

// --- DADOS ESTÁTICOS & CONFIGURAÇÕES ---

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

const currencyNames: Record<string, string> = { 
  'EUR': 'Euro', 'USD': 'Dólar Americano', 'BRL': 'Real Brasileiro', 
  'AOA': 'Kwanza', 'MZN': 'Metical', 'CVE': 'Escudo', 
  'CHF': 'Franco Suíço', 'GBP': 'Libra' 
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

  // --- ESTADOS DE UI E NAVEGAÇÃO ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showFinancials, setShowFinancials] = useState(true); 
  const [showPageCode, setShowPageCode] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // --- ESTADOS DE DADOS (SUPABASE) ---
  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [accountingTab, setAccountingTab] = useState('overview'); 
  const [transactions, setTransactions] = useState<any[]>([]); 
  const [realInvoices, setRealInvoices] = useState<any[]>([]); 
  const [chartOfAccounts, setChartOfAccounts] = useState<any[]>([]); 
  const [assets, setAssets] = useState<any[]>([]); 
  const [clients, setClients] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [provisions, setProvisions] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<any>(defaultRates);

  // --- ESTADOS DE MODAIS ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showEntityModal, setShowEntityModal] = useState(false); 
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false); // Modal Fullscreen Preview
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [showDoubtfulModal, setShowDoubtfulModal] = useState(false);
  const [showAmortSchedule, setShowAmortSchedule] = useState(false);
  
  // --- ESTADOS DE EDIÇÃO E FORMULÁRIOS ---
  const [entityType, setEntityType] = useState<'client' | 'supplier'>('client'); 
  const [editingEntityId, setEditingEntityId] = useState<string | null>(null);
  const [editingProvisionId, setEditingProvisionId] = useState<string | null>(null);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  // Estados Cliente Duvidoso
  const [selectedClientForDebt, setSelectedClientForDebt] = useState<any>(null);
  const [debtMethod, setDebtMethod] = useState<'manual' | 'invoices'>('manual');
  const [manualDebtAmount, setManualDebtAmount] = useState('');
  const [selectedDebtInvoices, setSelectedDebtInvoices] = useState<string[]>([]);

  // Estado Plano Amortização
  const [selectedAssetForSchedule, setSelectedAssetForSchedule] = useState<any>(null);
  
  // Forms
  const [editForm, setEditForm] = useState({ fullName: '', jobTitle: '', email: '' });
  const [companyForm, setCompanyForm] = useState({ 
    name: '', country: 'Portugal', currency: 'EUR', 
    address: '', nif: '', logo_url: '', footer: '' 
  });
  
  const [newTransaction, setNewTransaction] = useState({ description: '', amount: '', type: 'expense', category: '', date: new Date().toISOString().split('T')[0] });
  const [newAsset, setNewAsset] = useState({ name: '', purchase_date: new Date().toISOString().split('T')[0], purchase_value: '', lifespan_years: 3, amortization_method: 'linear' });
  const [newEntity, setNewEntity] = useState({ name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' });
  const [newProvision, setNewProvision] = useState({ description: '', amount: '', type: 'Riscos e Encargos', date: new Date().toISOString().split('T')[0] });

  // Estado da Fatura Atual
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
      id: '',
      client_id: '',
      type: 'Fatura',
      invoice_number: '',
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      exemption_reason: '',
      items: [{ description: '', quantity: 1, price: 0, tax: 23 }] 
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);

  // Chat IA
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Olá! Sou o seu assistente EasyCheck IA. Em que posso ajudar hoje?' }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- HELPERS E CÁLCULOS ---

  const getCurrencyCode = (country: string) => countryCurrencyMap[country] || 'EUR';
  const getCurrencySymbol = (code: string) => currencySymbols[code] || '€';
  
  const getCurrentCountryVatRates = () => {
      const country = companyForm.country || "Portugal";
      return vatRatesByCountry[country] || [23, 0];
  };

  const currentCurrency = companyForm.currency || 'EUR';
  const conversionRate = exchangeRates[currentCurrency] || 1;
  const displaySymbol = getCurrencySymbol(currentCurrency);

  const totalRevenue = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0) * conversionRate;
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0) * conversionRate;
  const currentBalance = totalRevenue - totalExpenses;
  const totalInvoicesCount = realInvoices.length;

  const getInitials = (name: string) => name ? (name.split(' ').length > 1 ? (name.split(' ')[0][0] + name.split(' ')[name.split(' ').length - 1][0]) : name.substring(0, 2)).toUpperCase() : 'EC';

  // --- LÓGICA DE AMORTIZAÇÃO (LINEAR & DEGRESSIVA) ---
  const calculateAmortizationSchedule = (asset: any) => {
      if (!asset) return [];
      const schedule = [];
      let currentValue = parseFloat(asset.purchase_value);
      const lifespan = parseInt(asset.lifespan_years);
      const startYear = new Date(asset.purchase_date).getFullYear();
      
      // Coeficientes fiscais comuns para degressivo
      let coef = 1.5;
      if (lifespan >= 5 && lifespan < 6) coef = 2.0;
      if (lifespan >= 6) coef = 2.5;

      const linearRate = 1 / lifespan;
      const degressiveRate = linearRate * coef;

      for (let i = 0; i < lifespan; i++) {
          let annuity = 0;
          
          if (asset.amortization_method === 'linear') {
              annuity = asset.purchase_value / lifespan;
          } else {
              // Método Degressivo com passagem a linear quando compensa
              const remainingYears = lifespan - i;
              const currentLinearAnnuity = currentValue / remainingYears;
              const currentDegressiveAnnuity = currentValue * degressiveRate;

              if (currentDegressiveAnnuity < currentLinearAnnuity || i === lifespan - 1) {
                  annuity = currentLinearAnnuity; // Troca para linear no fim
              } else {
                  annuity = currentDegressiveAnnuity;
              }
          }

          // Ajuste final para não ir abaixo de zero
          if (currentValue - annuity < 0.01) annuity = currentValue;

          schedule.push({
              year: startYear + i,
              startValue: currentValue,
              annuity: annuity,
              endValue: currentValue - annuity
          });
          currentValue -= annuity;
          if (currentValue < 0) currentValue = 0;
      }
      return schedule;
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

  // --- EFEITOS (DATA FETCHING) ---

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
                footer: profile.company_footer || ''
            });
            if (profile.custom_exchange_rates) { setExchangeRates({ ...defaultRates, ...profile.custom_exchange_rates }); }
        }
        
        // Fetch Parallel Data
        const [tr, inv, acc, ass, cl, sup, prov] = await Promise.all([
             supabase.from('transactions').select('*').order('date', { ascending: false }),
             supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false }),
             supabase.from('accounting_accounts').select('*'),
             supabase.from('accounting_assets').select('*'),
             supabase.from('clients').select('*'),
             supabase.from('suppliers').select('*'),
             supabase.from('accounting_provisions').select('*')
        ]);

        if (tr.data) setTransactions(tr.data);
        if (inv.data) setRealInvoices(inv.data);
        if (acc.data) setChartOfAccounts(acc.data);
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

  // Atualiza taxa de IVA padrão quando muda o tipo de fatura
  useEffect(() => {
      if (!invoiceData.client_id) return;
      const defaultRate = getCurrentCountryVatRates()[0]; 
      let newTax = defaultRate;
      let exemption = '';
      if (invoiceData.type.includes('Isenta') || invoiceData.type.includes('Intracomunitária')) { 
          newTax = 0; 
          exemption = invoiceData.type.includes('Intracomunitária') ? 'Isento Artigo 14.º RITI' : 'IVA - Autoliquidação'; 
      }
      // Apenas atualiza se o utilizador não editou manualmente (simplificação)
      const updatedItems = invoiceData.items.map(item => ({ 
          ...item, 
          tax: (item.tax === 0 && newTax !== 0) || (item.tax !== 0 && newTax === 0) ? newTax : item.tax 
      }));
      setInvoiceData(prev => ({ ...prev, items: updatedItems, exemption_reason: exemption }));
  }, [invoiceData.type]); 

  // --- ACTIONS GERAIS ---

  const toggleTheme = () => { document.documentElement.classList.toggle('dark'); setIsDark(!isDark); };
  const toggleFinancials = () => setShowFinancials(!showFinancials);
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };
  const copyCode = () => { navigator.clipboard.writeText(profileData?.company_code); alert("Código copiado!"); };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedCountry = e.target.value;
      const newCurrency = getCurrencyCode(selectedCountry);
      setCompanyForm({ ...companyForm, country: selectedCountry, currency: newCurrency });
  };
  
  const handleRateChange = (currency: string, value: string) => { 
      setExchangeRates((prev: any) => ({ ...prev, [currency]: parseFloat(value) || 0 })); 
  };

  // --- UPLOAD LOGO PARA SUPABASE STORAGE ---
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploadingLogo(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userData.id}/logo_${Date.now()}.${fileExt}`;

      try {
          const { error: uploadError } = await supabase.storage
              .from('company-logos')
              .upload(fileName, file, { upsert: true });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
              .from('company-logos')
              .getPublicUrl(fileName);

          setCompanyForm(prev => ({ ...prev, logo_url: publicUrl }));
          // Atualiza logo no profile imediatamente para não perder se sair
          await supabase.from('profiles').update({ logo_url: publicUrl }).eq('id', userData.id);
          
          alert("Logo carregado com sucesso!");
      } catch (error: any) { 
          alert("Erro ao carregar logo: " + error.message); 
      } finally { 
          setUploadingLogo(false); 
      }
  };

  // --- INVOICE ACTIONS ---

  const handleAddInvoiceItem = () => { const currentTax = getCurrentCountryVatRates()[0]; setInvoiceData({ ...invoiceData, items: [...invoiceData.items, { description: '', quantity: 1, price: 0, tax: currentTax }] }); };
  const handleRemoveInvoiceItem = (index: number) => { const newItems = [...invoiceData.items]; newItems.splice(index, 1); setInvoiceData({ ...invoiceData, items: newItems }); };
  const updateInvoiceItem = (index: number, field: string, value: string) => { const newItems: any = [...invoiceData.items]; newItems[index][field] = field === 'description' ? value : parseFloat(value) || 0; setInvoiceData({ ...invoiceData, items: newItems }); };

  const handleSaveInvoice = async () => {
      const totals = calculateInvoiceTotals();
      // Gera número se não existir
      let docNumber = invoiceData.invoice_number;
      if (!docNumber) {
          const prefix = invoiceTypesMap[invoiceData.type] || 'DOC';
          docNumber = `${prefix} ${new Date().getFullYear()}/${realInvoices.length + 1}`;
      }
      
      let error, data;
      // Se tiver ID, apaga antiga para recriar (Simples UPDATE seria melhor, mas estrutura relacional complexa)
      // Para consistência de integridade no exemplo: UPDATE simples no header, delete/insert nos items
      
      if (invoiceData.id) {
          // Update Invoice Header
          const res = await supabase.from('invoices').update({
             client_id: invoiceData.client_id, type: invoiceData.type, date: invoiceData.date, 
             due_date: invoiceData.due_date, exemption_reason: invoiceData.exemption_reason, 
             subtotal: totals.subtotal, tax_total: totals.taxTotal, total: totals.total
          }).eq('id', invoiceData.id).select().single();
          error = res.error; data = res.data;
          
          // Remove old items
          if (!error) await supabase.from('invoice_items').delete().eq('invoice_id', invoiceData.id);
      } else {
          // Insert New
          const res = await supabase.from('invoices').insert([{ 
              user_id: userData.id, client_id: invoiceData.client_id, type: invoiceData.type, 
              invoice_number: docNumber, date: invoiceData.date, due_date: invoiceData.due_date, 
              exemption_reason: invoiceData.exemption_reason, subtotal: totals.subtotal, 
              tax_total: totals.taxTotal, total: totals.total, currency: currentCurrency, status: 'sent' 
          }]).select().single();
          error = res.error; data = res.data;
      }

      if (error) return alert("Erro ao guardar fatura: " + error.message);
      
      // Insert Items
      const itemsToInsert = invoiceData.items.map(item => ({ 
          invoice_id: data.id, description: item.description, quantity: item.quantity, 
          unit_price: item.price, tax_rate: item.tax 
      }));
      await supabase.from('invoice_items').insert(itemsToInsert);

      // Refresh
      const { data: updatedInvoices } = await supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false }); 
      if (updatedInvoices) setRealInvoices(updatedInvoices);
      
      setShowPreviewModal(false); 
      setShowInvoiceForm(false);
      resetInvoiceForm();
      alert("Documento emitido com sucesso!");
  };

  const resetInvoiceForm = () => {
    setInvoiceData({ 
        id: '', client_id: '', type: 'Fatura', invoice_number: '', 
        date: new Date().toISOString().split('T')[0], 
        due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], 
        exemption_reason: '', items: [{ description: '', quantity: 1, price: 0, tax: 0 }] 
    });
  };

  const handleEditInvoice = async (invoice: any) => {
      const { data: items } = await supabase.from('invoice_items').select('*').eq('invoice_id', invoice.id);
      setInvoiceData({
          id: invoice.id,
          client_id: invoice.client_id,
          type: invoice.type,
          invoice_number: invoice.invoice_number,
          date: invoice.date,
          due_date: invoice.due_date,
          exemption_reason: invoice.exemption_reason || '',
          items: items ? items.map((i: any) => ({ description: i.description, quantity: i.quantity, price: i.unit_price, tax: i.tax_rate })) : []
      });
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

  // --- PDF GENERATION ENGINE ---
  const generatePDFBlob = async (): Promise<Blob> => {
      const doc = new jsPDF();
      const totals = calculateInvoiceTotals();
      const client = clients.find(c => c.id === invoiceData.client_id) || { name: 'Cliente Final', address: '', nif: '', city: '', postal_code: '', country: '' };
      
      // Header Background
      doc.setFillColor(245, 247, 250); doc.rect(0, 0, 210, 50, 'F');
      
      // Logo (Async loading helper)
      if (companyForm.logo_url) {
          try {
              const img = new Image();
              img.src = companyForm.logo_url;
              img.crossOrigin = "Anonymous"; 
              await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
              // Draw simple canvas or use direct addImage if CORS allows
              doc.addImage(img, 'PNG', 15, 10, 40, 30);
          } catch (e) {
              console.log("Logo error", e);
              doc.setFontSize(16); doc.text(companyForm.name.substring(0, 5).toUpperCase(), 15, 25);
          }
      }

      // Company Info
      doc.setFontSize(14); doc.setTextColor(40); doc.text(companyForm.name || 'Minha Empresa', 200, 15, { align: 'right' });
      doc.setFontSize(9); doc.setTextColor(100); 
      doc.text(companyForm.address || '', 200, 22, { align: 'right' }); 
      doc.text(`${companyForm.country}, NIF: ${companyForm.nif || 'N/A'}`, 200, 27, { align: 'right' });

      // Invoice Title
      doc.setFontSize(22); doc.setTextColor(0); doc.text(invoiceData.type.toUpperCase(), 15, 70);
      const docNum = invoiceData.invoice_number || "RASCUNHO";
      doc.setFontSize(11); doc.setTextColor(100); doc.text(docNum, 15, 76);

      // Client Info
      doc.setFontSize(10); doc.setTextColor(0); doc.text("Faturar a:", 15, 90); 
      let clientY = 96; doc.setFont("helvetica", "bold"); doc.text(client.name, 15, clientY); clientY += 5;
      doc.setFont("helvetica", "normal"); 
      if(client.address) { doc.text(client.address, 15, clientY); clientY += 5; }
      const cityLine = [client.postal_code, client.city, client.country].filter(Boolean).join(' - '); 
      if(cityLine) { doc.text(cityLine, 15, clientY); clientY += 5; }
      if(client.nif) doc.text(`NIF: ${client.nif}`, 15, clientY);

      // Dates
      doc.text(`Data Emissão: ${invoiceData.date}`, 140, 96); 
      doc.text(`Vencimento: ${invoiceData.due_date}`, 140, 101);

      // Table
      const tableRows = invoiceData.items.map(item => [ 
          item.description, item.quantity, `${displaySymbol} ${item.price.toFixed(2)}`, `${item.tax}%`, `${displaySymbol} ${(item.quantity * item.price).toFixed(2)}` 
      ]);
      
      autoTable(doc, { 
          head: [["Descrição", "Qtd", "Preço", "IVA", "Total"]], 
          body: tableRows, 
          startY: 120, 
          theme: 'grid', 
          headStyles: { fillColor: [59, 130, 246], textColor: 255 },
          styles: { fontSize: 10, cellPadding: 4 }
      });

      const finalY = (doc as any).lastAutoTable.finalY + 10;

      // Totals
      doc.text(`Subtotal:`, 150, finalY); doc.text(`${displaySymbol} ${totals.subtotal.toFixed(2)}`, 195, finalY, { align: 'right' });
      doc.text(`IVA:`, 150, finalY + 6); doc.text(`${displaySymbol} ${totals.taxTotal.toFixed(2)}`, 195, finalY + 6, { align: 'right' });
      doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.text(`TOTAL:`, 150, finalY + 14); doc.text(`${displaySymbol} ${totals.total.toFixed(2)}`, 195, finalY + 14, { align: 'right' });

      // Exemption Reason
      if (invoiceData.exemption_reason) { 
          doc.setFontSize(9); doc.setFont("helvetica", "normal"); 
          doc.text(`Motivo Isenção: ${invoiceData.exemption_reason}`, 15, finalY + 30); 
      }

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setDrawColor(200); doc.line(10, pageHeight - 20, 200, pageHeight - 20);
      doc.setFontSize(8); doc.setTextColor(150); 
      if (companyForm.footer) doc.text(companyForm.footer, 105, pageHeight - 12, { align: 'center' });
      doc.text("Processado por EasyCheck ERP", 105, pageHeight - 8, { align: 'center' });

      return doc.output('blob');
  };

  const handlePreview = async () => { 
      if (!invoiceData.client_id) return alert("Selecione um cliente."); 
      if (invoiceData.items.length === 0) return alert("Adicione itens à fatura."); 
      
      const blob = await generatePDFBlob();
      const url = URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
      setShowPreviewModal(true); 
  };

  const handleDownloadPDF = async () => {
    const blob = await generatePDFBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoiceData.type}_${invoiceData.invoice_number || 'new'}.pdf`;
    link.click();
  };

  // --- ENTITY, TRANSACTION & ASSET HANDLERS ---
  
  const handleCreateTransaction = async () => { if (!newTransaction.amount || !newTransaction.description) return alert("Preencha dados."); const amountInEur = parseFloat(newTransaction.amount) / conversionRate; const { data } = await supabase.from('transactions').insert([{ user_id: userData.id, description: newTransaction.description, amount: amountInEur, type: newTransaction.type, category: newTransaction.category || 'Geral', date: newTransaction.date }]).select(); if (data) { setTransactions([data[0], ...transactions]); setShowTransactionModal(false); setNewTransaction({ description: '', amount: '', type: 'expense', category: '', date: new Date().toISOString().split('T')[0] }); } };
  
  const handleCreateAsset = async () => { if (!newAsset.name || !newAsset.purchase_value) return alert("Preencha dados."); const valueInEur = parseFloat(newAsset.purchase_value) / conversionRate; let error, data; if (editingAssetId) { const res = await supabase.from('accounting_assets').update({ ...newAsset, purchase_value: valueInEur }).eq('id', editingAssetId).select(); error = res.error; data = res.data; if(!error && data) setAssets(prev => prev.map(a => a.id === editingAssetId ? data[0] : a)); } else { const res = await supabase.from('accounting_assets').insert([{ user_id: userData.id, name: newAsset.name, purchase_date: newAsset.purchase_date, purchase_value: valueInEur, lifespan_years: newAsset.lifespan_years, amortization_method: newAsset.amortization_method }]).select(); error = res.error; data = res.data; if(!error && data) setAssets([...assets, data[0]]); } if (!error) { setShowAssetModal(false); setEditingAssetId(null); setNewAsset({ name: '', purchase_date: new Date().toISOString().split('T')[0], purchase_value: '', lifespan_years: 3, amortization_method: 'linear' }); } };
  const handleDeleteAsset = async (id: string) => { if (!window.confirm("Apagar este ativo?")) return; const { error } = await supabase.from('accounting_assets').delete().eq('id', id); if (!error) setAssets(prev => prev.filter(a => a.id !== id)); };
  const handleEditAsset = (asset: any) => { setEditingAssetId(asset.id); setNewAsset({ name: asset.name, purchase_date: asset.purchase_date, purchase_value: asset.purchase_value, lifespan_years: asset.lifespan_years, amortization_method: asset.amortization_method }); setShowAssetModal(true); };
  const handleShowAmortSchedule = (asset: any) => { setSelectedAssetForSchedule(asset); setShowAmortSchedule(true); };

  const handleCreateEntity = async () => { if (!newEntity.name) return alert("Nome obrigatório"); const table = entityType === 'client' ? 'clients' : 'suppliers'; let error = null, data = null; if (editingEntityId) { const res = await supabase.from(table).update({ ...newEntity, updated_at: new Date() }).eq('id', editingEntityId).select(); error = res.error; data = res.data; if (!error && data) { if (entityType === 'client') setClients(prev => prev.map(c => c.id === editingEntityId ? data[0] : c)); else setSuppliers(prev => prev.map(s => s.id === editingEntityId ? data[0] : s)); } } else { const res = await supabase.from(table).insert([{ user_id: userData.id, ...newEntity }]).select(); error = res.error; data = res.data; if (!error && data) { if (entityType === 'client') setClients([data[0], ...clients]); else setSuppliers([data[0], ...suppliers]); } } if (!error) { setShowEntityModal(false); setEditingEntityId(null); setNewEntity({ name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' }); } else { alert("Erro: " + error.message); } };
  const handleEditEntity = (entity: any, type: 'client' | 'supplier') => { setNewEntity({ name: entity.name, nif: entity.nif, email: entity.email, address: entity.address || '', city: entity.city || '', postal_code: entity.postal_code || '', country: entity.country || 'Portugal' }); setEntityType(type); setEditingEntityId(entity.id); setShowEntityModal(true); };
  const handleDeleteEntity = async (id: string, type: 'client' | 'supplier') => { if (!window.confirm("Apagar este registo?")) return; const table = type === 'client' ? 'clients' : 'suppliers'; const { error } = await supabase.from(table).delete().eq('id', id); if (!error) { if (type === 'client') setClients(prev => prev.filter(c => c.id !== id)); else setSuppliers(prev => prev.filter(s => s.id !== id)); } };
  const handleDeleteTransaction = async (id: string) => { if (!window.confirm("Eliminar registo?")) return; const { error } = await supabase.from('transactions').delete().eq('id', id); if (!error) setTransactions(prev => prev.filter(t => t.id !== id)); };
  
  // --- CLIENTE DUVIDOSO LOGIC ---
  const handleOpenDoubtful = (client: any) => { setSelectedClientForDebt(client); setShowDoubtfulModal(true); };
  const saveDoubtfulDebt = async () => { 
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
          setShowDoubtfulModal(false); setManualDebtAmount(''); setSelectedDebtInvoices([]); 
      } 
  };

  const handleCreateProvision = async () => { if (!newProvision.description || !newProvision.amount) return alert("Dados insuficientes"); const amountInEur = parseFloat(newProvision.amount) / conversionRate; let error = null, data = null; if (editingProvisionId) { const res = await supabase.from('accounting_provisions').update({ ...newProvision, amount: amountInEur }).eq('id', editingProvisionId).select(); error = res.error; data = res.data; if (!error && data) setProvisions(prev => prev.map(p => p.id === editingProvisionId ? data[0] : p)); } else { const res = await supabase.from('accounting_provisions').insert([{ user_id: userData.id, ...newProvision, amount: amountInEur }]).select(); error = res.error; data = res.data; if (!error && data) setProvisions([data[0], ...provisions]); } if (!error) { setShowProvisionModal(false); setEditingProvisionId(null); setNewProvision({ description: '', amount: '', type: 'Riscos e Encargos', date: new Date().toISOString().split('T')[0] }); } };
  const handleEditProvision = (prov: any) => { setEditingProvisionId(prov.id); setNewProvision({ description: prov.description, amount: prov.amount, type: prov.type, date: prov.date }); setShowProvisionModal(true); };
  const handleDeleteProvision = async (id: string) => { if (window.confirm("Apagar provisão?")) { const { error } = await supabase.from('accounting_provisions').delete().eq('id', id); if (!error) setProvisions(prev => prev.filter(p => p.id !== id)); } };

  const handleSaveProfile = async () => { setSavingProfile(true); try { await supabase.from('profiles').update({ full_name: editForm.fullName, job_title: editForm.jobTitle, updated_at: new Date() }).eq('id', userData.id); setProfileData({ ...profileData, ...{ full_name: editForm.fullName } }); alert(`Perfil atualizado!`); setIsProfileModalOpen(false); } catch { alert("Erro ao guardar."); } finally { setSavingProfile(false); } };
  const handleSaveCompany = async () => { setSavingCompany(true); try { const updates = { company_name: companyForm.name, company_nif: companyForm.nif, company_address: companyForm.address, country: companyForm.country, currency: companyForm.currency, custom_exchange_rates: exchangeRates, logo_url: companyForm.logo_url, company_footer: companyForm.footer, updated_at: new Date() }; await supabase.from('profiles').update(updates).eq('id', userData.id); setProfileData({ ...profileData, ...updates }); alert(`Dados atualizados!`); } catch { alert("Erro ao guardar."); } finally { setSavingCompany(false); } };
  const handleDeleteAccount = async () => { if (deleteConfirmation !== 'ELIMINAR') return alert(t('delete.confirm_text')); setIsDeleting(true); try { await supabase.rpc('delete_user'); await supabase.auth.signOut(); navigate('/'); } catch(e: any) { alert(e.message); } finally { setIsDeleting(false); } };
  const handleSendChatMessage = async (e: React.FormEvent) => { e.preventDefault(); if (!chatInput.trim() || isChatLoading) return; const userMessage = { role: 'user', content: chatInput }; setMessages(prev => [...prev, userMessage]); setChatInput(''); setIsChatLoading(true); try { const context = `[Empresa: ${companyForm.name}, País: ${companyForm.country}, Moeda: ${currentCurrency}] ${chatInput}`; const response = await fetch(`${API_URL}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: context }) }); const data = await response.json(); if (data.reply) setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]); } catch { setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Erro de conexão.' }]); } finally { setIsChatLoading(false); } };

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

  const invoiceTotals = calculateInvoiceTotals();

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
            {/* DASHBOARD PRINCIPAL */}
            <Route path="/" element={
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700"><div className="flex justify-between items-center mb-2"><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Receita Mensal</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div><p className="text-3xl font-bold text-green-600 dark:text-green-400">{showFinancials ? `${displaySymbol} ${totalRevenue.toFixed(2)}` : '••••••'}</p></div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700"><div className="flex justify-between items-center mb-2"><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Despesas</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div><p className="text-3xl font-bold text-red-500 dark:text-red-400">{showFinancials ? `${displaySymbol} ${totalExpenses.toFixed(2)}` : '••••••'}</p></div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700"><div className="flex justify-between items-center mb-2"><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Saldo Atual</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div><p className={`text-3xl font-bold ${currentBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>{showFinancials ? `${displaySymbol} ${currentBalance.toFixed(2)}` : '••••••'}</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 flex items-center justify-between"><div><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Faturas Emitidas</h3><p className="text-3xl font-bold text-orange-500 mt-1">{showFinancials ? totalInvoicesCount : '•••'}</p></div><div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl"><FileText className="w-8 h-8 text-orange-500"/></div></div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 flex items-center justify-between"><div><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Ações Pendentes</h3><p className="text-3xl font-bold text-blue-600 mt-1">0</p></div><div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl"><Bell className="w-8 h-8 text-blue-600"/></div></div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-8 text-center shadow-lg"><h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">{t('dashboard.welcome')}, {profileData?.full_name?.split(' ')[0]}! 👋</h3><Link to="/dashboard/chat" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg"><MessageSquare className="w-5 h-5" />{t('dashboard.open_chat')}</Link></div>
              </div>
            } />

            {/* CONTABILIDADE */}
            <Route path="accounting" element={
                <div className="h-full flex flex-col">
                    <div className="flex gap-2 border-b dark:border-gray-700 pb-2 mb-6 overflow-x-auto">
                        {[
                            { id: 'overview', label: 'Geral', icon: PieChart },
                            { id: 'clients', label: 'Clientes', icon: Briefcase }, 
                            { id: 'invoices', label: 'Faturas', icon: FileText }, 
                            { id: 'suppliers', label: 'Fornecedores', icon: Truck }, 
                            { id: 'assets', label: 'Ativos', icon: Box },
                            { id: 'provisions', label: 'Provisões', icon: AlertOctagon },
                            { id: 'chart', label: 'Plano de Contas', icon: List },
                            { id: 'reports', label: 'Relatórios', icon: FileSpreadsheet },
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setAccountingTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${accountingTab === tab.id ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm border dark:border-gray-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                <tab.icon size={16}/> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1">
                        {accountingTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center"><h3 className="font-bold text-lg">Diário de Movimentos</h3><button onClick={() => setShowTransactionModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg"><Plus size={18}/> Nova Transação</button></div>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 uppercase text-xs"><tr><th className="px-6 py-3">Data</th><th className="px-6 py-3">Descrição</th><th className="px-6 py-3">Categoria</th><th className="px-6 py-3 text-right">Valor ({displaySymbol})</th><th className="px-6 py-3 text-right">Ação</th></tr></thead>
                                        <tbody>{transactions.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Sem movimentos.</td></tr> : transactions.map(t => (
                                            <tr key={t.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td><td className="px-6 py-4 font-medium">{t.description}</td><td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">{t.category}</span></td>
                                                <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>{t.type === 'income' ? '+' : '-'} {displaySymbol} {(t.amount * conversionRate).toFixed(2)}</td>
                                                <td className="px-6 py-4 text-right"><button onClick={() => handleDeleteTransaction(t.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16}/></button></td>
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {accountingTab === 'clients' && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center"><h3 className="font-bold flex items-center gap-2"><Briefcase size={18}/> Clientes</h3><button onClick={() => {setEditingEntityId(null); setNewEntity({ name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' }); setEntityType('client'); setShowEntityModal(true)}} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex gap-2 items-center"><Plus size={16}/> Novo Cliente</button></div>
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 uppercase text-xs"><tr><th className="px-6 py-3">Nome</th><th className="px-6 py-3">NIF</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Dívida</th><th className="px-6 py-3 text-right">Ação</th></tr></thead>
                                    <tbody>{clients.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">Nenhum cliente registado.</td></tr> : clients.map(c => (
                                        <tr key={c.id} className={`border-b dark:border-gray-700 ${c.status === 'doubtful' ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                                            <td className="px-6 py-4 font-medium">{c.name}</td><td className="px-6 py-4">{c.nif || '-'}</td><td className="px-6 py-4">{c.email || '-'}</td>
                                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${c.status === 'doubtful' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{c.status === 'doubtful' ? 'Duvidoso' : 'Ativo'}</span></td>
                                            <td className={`px-6 py-4 text-right font-bold ${c.status === 'doubtful' ? 'text-red-600' : 'text-gray-400'}`}>{c.doubtful_debt ? `${displaySymbol} ${c.doubtful_debt}` : '-'}</td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <button onClick={() => handleOpenDoubtful(c)} title="Gerir Risco" className={`p-1 rounded-full ${c.status === 'doubtful' ? 'text-red-600 bg-red-100' : 'text-gray-400 hover:bg-gray-100'}`}><AlertTriangle size={16}/></button>
                                                <button onClick={() => handleEditEntity(c, 'client')} className="text-blue-500 hover:text-blue-700"><Edit2 size={16}/></button>
                                                <button onClick={() => handleDeleteEntity(c.id, 'client')} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>))}</tbody>
                                </table>
                            </div>
                        )}

                        {accountingTab === 'provisions' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center"><h3 className="font-bold text-lg">Provisões do Exercício</h3><button onClick={() => {setEditingProvisionId(null); setNewProvision({ description: '', amount: '', type: 'Riscos e Encargos', date: new Date().toISOString().split('T')[0] }); setShowProvisionModal(true)}} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg"><Plus size={18}/> Nova Provisão</button></div>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                                    <table className="w-full text-sm text-left"><thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 uppercase text-xs"><tr><th className="px-6 py-3">Data</th><th className="px-6 py-3">Descrição</th><th className="px-6 py-3">Tipo</th><th className="px-6 py-3 text-right">Valor Estimado</th><th className="px-6 py-3 text-right">Ação</th></tr></thead>
                                    <tbody>{provisions.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Sem provisões registadas.</td></tr> : provisions.map(p => (<tr key={p.id} className="border-b dark:border-gray-700"><td className="px-6 py-4">{new Date(p.date).toLocaleDateString()}</td><td className="px-6 py-4 font-medium">{p.description}</td><td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">{p.type}</span></td><td className="px-6 py-4 text-right font-bold text-yellow-600">{displaySymbol} {(p.amount * conversionRate).toFixed(2)}</td><td className="px-6 py-4 text-right flex justify-end gap-2"><button onClick={() => handleEditProvision(p)} className="text-blue-500 hover:text-blue-700"><Edit2 size={16}/></button><button onClick={() => handleDeleteProvision(p.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></td></tr>))}</tbody></table>
                                </div>
                            </div>
                        )}

                        {accountingTab === 'assets' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center"><h3 className="font-bold text-lg">Mapa de Amortizações</h3><button onClick={() => {setEditingAssetId(null); setNewAsset({ name: '', purchase_date: new Date().toISOString().split('T')[0], purchase_value: '', lifespan_years: 3, amortization_method: 'linear' }); setShowAssetModal(true)}} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg"><Plus size={18}/> Novo Ativo</button></div>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 uppercase text-xs"><tr><th className="px-6 py-3">Ativo</th><th className="px-6 py-3">Data</th><th className="px-6 py-3 text-right">Valor</th><th className="px-6 py-3 text-right">Método</th><th className="px-6 py-3"></th></tr></thead>
                                        <tbody>{assets.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Nenhum ativo registado.</td></tr> : assets.map(a => (
                                            <tr key={a.id} className="border-b dark:border-gray-700">
                                                <td className="px-6 py-4 font-medium">{a.name}</td><td className="px-6 py-4">{new Date(a.purchase_date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right">{displaySymbol} {(a.purchase_value * conversionRate).toFixed(2)}</td>
                                                <td className="px-6 py-4 text-right capitalize">{a.amortization_method || 'Linear'}</td>
                                                <td className="px-6 py-4 text-right flex justify-end gap-2"><button onClick={() => handleShowAmortSchedule(a)} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs uppercase font-bold"><Eye size={16}/> Plano</button><button onClick={() => handleEditAsset(a)} className="text-blue-500 hover:text-blue-700"><Edit2 size={16}/></button><button onClick={() => handleDeleteAsset(a.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></td>
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {accountingTab === 'invoices' && (
                            <div className="space-y-6">
                                {!showInvoiceForm ? (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-lg">Faturas Emitidas</h3>
                                            <button onClick={() => { resetInvoiceForm(); setShowInvoiceForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg"><Plus size={18}/> Criar Nova Fatura</button>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 uppercase text-xs">
                                                    <tr><th className="px-6 py-3">Número</th><th className="px-6 py-3">Cliente</th><th className="px-6 py-3">Tipo</th><th className="px-6 py-3">Data</th><th className="px-6 py-3 text-right">Total</th><th className="px-6 py-3 text-right">Ação</th></tr>
                                                </thead>
                                                <tbody>
                                                    {realInvoices.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">Nenhuma fatura emitida.</td></tr> : 
                                                        realInvoices.map(inv => (
                                                            <tr key={inv.id} className="border-b dark:border-gray-700">
                                                                <td className="px-6 py-4 font-mono font-bold text-blue-600">{inv.invoice_number}</td>
                                                                <td className="px-6 py-4">{inv.clients?.name || 'Cliente Removido'}</td>
                                                                <td className="px-6 py-4 text-xs uppercase font-bold">{inv.type}</td>
                                                                <td className="px-6 py-4">{new Date(inv.date).toLocaleDateString()}</td>
                                                                <td className="px-6 py-4 text-right font-bold">{inv.currency} {inv.total}</td>
                                                                <td className="px-6 py-4 text-right flex justify-end gap-2"><button onClick={() => handleEditInvoice(inv)} className="text-blue-500 hover:text-blue-700"><Edit2 size={16}/></button><button onClick={() => handleDeleteInvoice(inv.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                ) : (
                                    /* ✅ FORMULÁRIO DE FATURA */
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 p-8 animate-fade-in-up">
                                        <div className="flex justify-between items-start mb-8 pb-6 border-b dark:border-gray-700">
                                            <div>
                                                <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-blue-600"/> Emitir Novo Documento</h2>
                                                <p className="text-gray-500 text-sm mt-1">Selecione o tipo de documento e preencha os dados.</p>
                                            </div>
                                            <button onClick={() => setShowInvoiceForm(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-bold mb-2">Tipo de Documento</label>
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {invoiceTypes.map(t => (
                                                    <button key={t} onClick={() => setInvoiceData({...invoiceData, type: t})} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${invoiceData.type === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600 hover:bg-gray-50'}`}>{t}</button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Cliente</label>
                                                <select className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500" value={invoiceData.client_id} onChange={e => setInvoiceData({...invoiceData, client_id: e.target.value})}>
                                                    <option value="">Selecione um cliente...</option>
                                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                                {clients.length === 0 && <p className="text-xs text-red-500 mt-1">Crie um cliente primeiro na aba Clientes.</p>}
                                            </div>
                                            <div><label className="block text-sm font-bold mb-2">Data Emissão</label><input type="date" className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" value={invoiceData.date} onChange={e => setInvoiceData({...invoiceData, date: e.target.value})}/></div>
                                            <div><label className="block text-sm font-bold mb-2">Vencimento</label><input type="date" className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" value={invoiceData.due_date} onChange={e => setInvoiceData({...invoiceData, due_date: e.target.value})}/></div>
                                        </div>

                                        {/* LINHAS DA FATURA */}
                                        <div className="mb-8">
                                            <table className="w-full text-sm">
                                                <thead><tr className="border-b dark:border-gray-700 text-left text-gray-500 uppercase text-xs"><th className="py-2 w-1/2">Descrição</th><th className="py-2 w-20 text-center">Qtd</th><th className="py-2 w-32 text-right">Preço Un.</th><th className="py-2 w-24 text-right">IVA %</th><th className="py-2 w-32 text-right">Total</th><th className="py-2 w-10"></th></tr></thead>
                                                <tbody className="divide-y dark:divide-gray-700">
                                                    {invoiceData.items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="py-3"><input className="w-full bg-transparent outline-none font-medium" placeholder="Nome do produto/serviço" value={item.description} onChange={e => updateInvoiceItem(index, 'description', e.target.value)}/></td>
                                                            <td className="py-3"><input type="number" className="w-full bg-transparent outline-none text-center" value={item.quantity} onChange={e => updateInvoiceItem(index, 'quantity', e.target.value)}/></td>
                                                            <td className="py-3"><input type="number" className="w-full bg-transparent outline-none text-right" value={item.price} onChange={e => updateInvoiceItem(index, 'price', e.target.value)}/></td>
                                                            <td className="py-3 flex items-center justify-end gap-2 relative">
                                                                <input type="number" className="w-16 bg-transparent outline-none text-right font-bold border-b border-dashed border-gray-300 focus:border-blue-500" value={item.tax} onChange={e => updateInvoiceItem(index, 'tax', e.target.value)}/>
                                                                <div className="relative group"><button className="p-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100"><MoreVertical size={12}/></button><div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-xl rounded-xl p-2 z-50 hidden group-hover:block"><p className="text-[10px] uppercase text-gray-400 font-bold mb-2">Taxas {companyForm.country}</p><div className="grid grid-cols-2 gap-1">{getCurrentCountryVatRates().map(rate => (<button key={rate} onClick={() => updateInvoiceItem(index, 'tax', rate.toString())} className="text-center px-2 py-1.5 text-xs hover:bg-blue-50 rounded-lg font-medium">{rate}%</button>))}</div></div></div>
                                                            </td>
                                                            <td className="py-3 text-right font-bold">{displaySymbol} {(item.quantity * item.price).toFixed(2)}</td>
                                                            <td className="py-3 text-center"><button onClick={() => handleRemoveInvoiceItem(index)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <button onClick={handleAddInvoiceItem} className="mt-4 text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline"><Plus size={16}/> Adicionar Linha</button>
                                        </div>

                                        <div className="flex justify-end gap-4 mt-8">
                                            <button onClick={() => setShowInvoiceForm(false)} className="px-6 py-3 rounded-xl border font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Cancelar</button>
                                            <button onClick={handlePreview} className="px-6 py-3 rounded-xl bg-gray-800 dark:bg-gray-600 text-white font-bold hover:opacity-90 flex items-center gap-2"><Eye size={20}/> Pré-visualizar</button>
                                            <button onClick={handleSaveInvoice} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2"><CheckCircle size={20}/> Emitir {invoiceData.type}</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {['chart', 'suppliers', 'reports'].includes(accountingTab) && (
                            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700"><Archive className="w-16 h-16 text-gray-300 mb-4"/><h3 className="text-xl font-bold">Módulo {accountingTab.toUpperCase()}</h3><p className="text-gray-500">Funcionalidade completa em breve.</p></div>
                        )}
                    </div>
                </div>
            } />

            {/* CHAT ROUTE */}
            <Route path="chat" element={
              <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, i) => (<div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'}`}>{msg.content}</div></div>))}
                  {isChatLoading && <div className="text-xs text-gray-400 ml-4 animate-pulse">A analisar...</div>}
                </div>
                <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900"><form onSubmit={handleSendChatMessage} className="flex gap-2 relative"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Pergunte ao assistente EasyCheck..." className="flex-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"/><button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow-md disabled:opacity-50"><Send size={18} /></button></form></div>
              </div>
            } />

            {/* SETTINGS ROUTE */}
            <Route path="settings" element={
                 <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
                        <h2 className="text-2xl font-bold mb-6 flex gap-2 items-center"><Settings/> Definições Globais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-sm font-bold mb-1">País da Sede</label><select value={companyForm.country} onChange={handleCountryChange} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600">{countries.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                            <div><label className="block text-sm font-bold mb-1">Moeda Principal</label><input value={companyForm.currency} onChange={e => setCompanyForm({...companyForm, currency: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600" disabled/></div>
                        </div>
                    </div>
                    
                    {/* LOGO UPLOAD */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
                        <h2 className="text-xl font-bold mb-4 flex gap-2 items-center"><ImageIcon/> Logótipo da Empresa</h2>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                                {companyForm.logo_url ? <img src={companyForm.logo_url} className="w-full h-full object-cover"/> : <UploadCloud className="text-gray-400"/>}
                            </div>
                            <div>
                                <label className="bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                                    Escolher Imagem
                                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload}/>
                                </label>
                                <p className="text-xs text-gray-500 mt-2">Recomendado: PNG ou JPG, fundo transparente.</p>
                                {uploadingLogo && <p className="text-xs text-blue-500 mt-1">A carregar...</p>}
                            </div>
                        </div>
                    </div>

                    {/* MENU DE TAXAS DE CÂMBIO */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
                        <h2 className="text-xl font-bold mb-4 flex gap-2 items-center text-blue-600"><RefreshCw/> Gestão de Taxas de Câmbio</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.keys(defaultRates).filter(k => k !== 'EUR').map(currency => (
                                <div key={currency} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-700 flex items-center justify-between">
                                    <div><p className="font-bold text-lg">{currency}</p><p className="text-xs text-gray-500">{currencyNames[currency]}</p></div>
                                    <div className="flex items-center gap-2"><span className="text-gray-400 text-sm">1 € =</span><input type="number" step="0.01" value={exchangeRates[currency]} onChange={(e) => handleRateChange(currency, e.target.value)} className="w-20 p-2 text-right font-bold rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600"/></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4"><button onClick={handleSaveCompany} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform active:scale-95">Guardar Preferências</button></div>
                 </div>
            } />
            
            <Route path="company" element={isOwner ? (<div className="max-w-4xl mx-auto space-y-6"><div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6 flex flex-col md:flex-row items-center justify-between gap-6"><div><h4 className="font-bold text-blue-900 dark:text-white mb-1">{t('settings.invite_code')}</h4><p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.invite_text')}</p></div><div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700"><code className="px-2 font-mono text-lg font-bold text-gray-700 dark:text-gray-300">{showPageCode ? profileData?.company_code : '••••••••'}</code><button onClick={() => setShowPageCode(!showPageCode)} className="p-2 text-gray-400 hover:text-blue-600">{showPageCode ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button><button onClick={copyCode} className="p-2 text-gray-400 hover:text-blue-600"><Copy className="w-4 h-4"/></button></div></div><div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8"><h3 className="text-lg font-bold mb-4 flex gap-2 items-center"><Users className="text-blue-600"/> {t('settings.team_members')}</h3><div className="text-center py-12 border-2 border-dashed rounded-xl text-gray-500">{t('settings.no_members')}</div></div></div>) : <div className="text-center py-12"><Shield className="w-16 h-16 mx-auto mb-4 text-gray-300"/><h3 className="text-xl font-bold dark:text-white">Acesso Restrito</h3></div>} />
            <Route path="*" element={<div className="flex justify-center py-10 text-gray-400">Em desenvolvimento...</div>} />
          </Routes>
        </div>
      </main>

      {/* --- MODAIS GLOBAIS --- */}

      {/* PREVIEW PDF MODAL */}
      {showPreviewModal && pdfPreviewUrl && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900 bg-opacity-90 backdrop-blur-sm p-4 animate-fade-in">
            <div className="flex justify-between items-center text-white mb-4">
                <h3 className="text-xl font-bold flex gap-2"><FileText/> Pré-visualização</h3>
                <div className="flex gap-4">
                    <button onClick={handleDownloadPDF} className="bg-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-500 flex items-center gap-2"><Download size={18}/> Baixar PDF</button>
                    <button onClick={() => setShowPreviewModal(false)} className="bg-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-600"><X size={18}/></button>
                </div>
            </div>
            <div className="flex-1 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
                <iframe src={pdfPreviewUrl} className="w-full h-full" title="PDF Preview"></iframe>
            </div>
        </div>
      )}

      {/* ASSET SCHEDULE MODAL */}
      {showAmortSchedule && selectedAssetForSchedule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-3xl shadow-xl border dark:border-gray-700 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold flex gap-2 items-center"><TrendingUpIcon className="text-blue-500"/> Plano de Amortização Financeira</h3>
                        <p className="text-sm text-gray-500 mt-1">{selectedAssetForSchedule.name} • Método: {selectedAssetForSchedule.amortization_method === 'linear' ? 'Quotas Constantes' : 'Quotas Degressivas'}</p>
                    </div>
                    <button onClick={() => setShowAmortSchedule(false)}><X className="text-gray-400 hover:text-red-500"/></button>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 uppercase text-xs"><tr><th className="px-4 py-3 rounded-l-lg">Ano</th><th className="px-4 py-3 text-right">Valor Contabilístico Inicial</th><th className="px-4 py-3 text-right">Quota Amortização</th><th className="px-4 py-3 text-right rounded-r-lg">Valor Final</th></tr></thead>
                    <tbody>
                        {calculateAmortizationSchedule(selectedAssetForSchedule).map((row: any, i) => (
                            <tr key={row.year} className={`border-b dark:border-gray-700 ${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}`}>
                                <td className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">{row.year}</td>
                                <td className="px-4 py-3 text-right text-gray-500">{displaySymbol} {row.startValue.toFixed(2)}</td>
                                <td className="px-4 py-3 text-right font-bold text-blue-600">{displaySymbol} {row.annuity.toFixed(2)}</td>
                                <td className="px-4 py-3 text-right font-bold text-gray-800 dark:text-white">{displaySymbol} {row.endValue.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* CLIENTE DUVIDOSO MODAL */}
      {showDoubtfulModal && selectedClientForDebt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl border dark:border-gray-700">
                <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex gap-2 items-center text-red-600"><AlertTriangle size={20}/> Gerir Dívida Incobrável</h3></div>
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">Ao marcar {selectedClientForDebt.name} como de risco, deve definir o valor em provisão.</p>
                    <div className="flex gap-4 mb-4 bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => setDebtMethod('manual')} className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${debtMethod === 'manual' ? 'bg-white shadow text-red-700' : 'text-gray-500'}`}>Valor Manual</button>
                        <button onClick={() => setDebtMethod('invoices')} className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${debtMethod === 'invoices' ? 'bg-white shadow text-red-700' : 'text-gray-500'}`}>Selecionar Faturas</button>
                    </div>
                    {debtMethod === 'manual' ? (
                        <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Valor em Dívida ({displaySymbol})</label><input type="number" value={manualDebtAmount} onChange={e => setManualDebtAmount(e.target.value)} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none font-bold text-red-600 text-xl"/></div>
                    ) : (
                        <div className="max-h-60 overflow-y-auto border rounded-xl p-2 bg-gray-50">
                            {realInvoices.filter(i => i.client_id === selectedClientForDebt.id).map(inv => (
                                <div key={inv.id} className="flex items-center gap-3 p-3 hover:bg-white border-b last:border-0 cursor-pointer" onClick={() => { if(selectedDebtInvoices.includes(inv.id)) setSelectedDebtInvoices(selectedDebtInvoices.filter(id => id !== inv.id)); else setSelectedDebtInvoices([...selectedDebtInvoices, inv.id]); }}>
                                    <input type="checkbox" checked={selectedDebtInvoices.includes(inv.id)} readOnly className="w-5 h-5 text-red-600 rounded" />
                                    <div className="flex-1"><p className="font-bold text-sm text-gray-700">{inv.invoice_number}</p><p className="text-xs text-gray-500">{new Date(inv.date).toLocaleDateString()}</p></div>
                                    <span className="font-bold text-red-600">{displaySymbol} {inv.total}</span>
                                </div>
                            ))}
                            {realInvoices.filter(i => i.client_id === selectedClientForDebt.id).length === 0 && <p className="text-xs text-gray-400 text-center py-4">Sem faturas para este cliente.</p>}
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowDoubtfulModal(false)} className="px-4 py-2 text-gray-500">Cancelar</button><button onClick={saveDoubtfulDebt} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-lg">Confirmar Risco</button></div>
            </div>
        </div>
      )}

      {/* MODAL PROVISÃO */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-gray-700">
                <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex gap-2 items-center text-gray-700 dark:text-white"><AlertOctagon size={20} className="text-yellow-500"/> Nova Provisão</h3></div>
                <div className="space-y-4">
                    <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Descrição do Risco</label><input placeholder="Ex: Processo Judicial em curso" value={newProvision.description} onChange={e => setNewProvision({...newProvision, description: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div>
                    <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Valor Estimado ({displaySymbol})</label><input type="number" placeholder="0.00" value={newProvision.amount} onChange={e => setNewProvision({...newProvision, amount: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div>
                    <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Tipo</label><select value={newProvision.type} onChange={e => setNewProvision({...newProvision, type: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"><option>Riscos e Encargos</option><option>Impostos</option><option>Garantias a Clientes</option><option>Processos Judiciais</option></select></div>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700"><button onClick={() => setShowProvisionModal(false)} className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancelar</button><button onClick={handleCreateProvision} className="px-6 py-3 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-700 shadow-lg transition-transform active:scale-95">Constituir Provisão</button></div>
            </div>
        </div>
      )}

      {/* MODAL NOVA TRANSAÇÃO */}
      {showTransactionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-gray-700">
                <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex gap-2 items-center text-gray-700 dark:text-white"><FileText size={20} className="text-blue-500"/> Nova Transação</h3></div>
                <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                    <button onClick={() => setNewTransaction({...newTransaction, type: 'income'})} className={`py-2 rounded-lg font-bold text-sm transition-all ${newTransaction.type === 'income' ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Receita (+)</button>
                    <button onClick={() => setNewTransaction({...newTransaction, type: 'expense'})} className={`py-2 rounded-lg font-bold text-sm transition-all ${newTransaction.type === 'expense' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Despesa (-)</button>
                </div>
                <div className="space-y-4">
                    <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Descrição</label><input placeholder="Ex: Venda de Software" value={newTransaction.description} onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"/></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Valor ({displaySymbol})</label><input type="number" placeholder="0.00" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"/></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Data</label><input type="date" value={newTransaction.date} onChange={e => setNewTransaction({...newTransaction, date: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none text-sm"/></div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Categoria</label>
                        <input placeholder="Sem categoria" list="categories" value={newTransaction.category} onChange={e => setNewTransaction({...newTransaction, category: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"/>
                        <datalist id="categories"><option value="Geral"/><option value="Alimentação"/><option value="Transporte"/><option value="Serviços"/><option value="Vendas"/><option value="Salários"/></datalist>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700">
                    <button onClick={() => setShowTransactionModal(false)} className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancelar</button>
                    <button onClick={handleCreateTransaction} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform active:scale-95">Registar</button>
                </div>
            </div>
        </div>
      )}

      {/* MODAL NOVO ATIVO */}
      {showAssetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-gray-700">
                <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex gap-2 items-center text-gray-700 dark:text-white"><Box size={20} className="text-blue-500"/> Novo Ativo Imobilizado</h3></div>
                <div className="space-y-4">
                    <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Nome do Ativo</label><input placeholder="Ex: Computador Dell XPS" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Valor Compra ({displaySymbol})</label><input type="number" placeholder="0.00" value={newAsset.purchase_value} onChange={e => setNewAsset({...newAsset, purchase_value: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Data Compra</label><input type="date" value={newAsset.purchase_date} onChange={e => setNewAsset({...newAsset, purchase_date: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none text-sm"/></div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Vida Útil (Anos)</label>
                        <select value={newAsset.lifespan_years} onChange={e => setNewAsset({...newAsset, lifespan_years: parseInt(e.target.value)})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none">
                            <option value="3">3 Anos (Hardware/Software)</option>
                            <option value="4">4 Anos (Veículos Ligeiros)</option>
                            <option value="5">5 Anos (Mobiliário/Equipamento)</option>
                            <option value="8">8 Anos (Maquinaria Pesada)</option>
                            <option value="20">20 Anos (Edifícios)</option>
                        </select>
                    </div>
                    <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Método de Amortização</label><select value={newAsset.amortization_method} onChange={e => setNewAsset({...newAsset, amortization_method: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"><option value="linear">Quotas Constantes (Linear)</option><option value="degressive">Quotas Degressivas</option></select></div>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700">
                    <button onClick={() => setShowAssetModal(false)} className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancelar</button>
                    <button onClick={handleCreateAsset} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform active:scale-95">Adicionar Ativo</button>
                </div>
            </div>
        </div>
      )}

      {/* MODAL ENTITY (CLIENT/SUPPLIER) */}
      {showEntityModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl border dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex gap-2 items-center text-gray-700 dark:text-white">
                        {entityType === 'client' ? <Briefcase size={20} className="text-blue-500"/> : <Truck size={20} className="text-orange-500"/>} 
                        Novo {entityType === 'client' ? 'Cliente' : 'Fornecedor'}
                    </h3>
                </div>
                <div className="space-y-4">
                    <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Nome / Empresa</label><input placeholder="Ex: Tech Solutions Lda" value={newEntity.name} onChange={e => setNewEntity({...newEntity, name: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">NIF</label><input placeholder="999888777" value={newEntity.nif} onChange={e => setNewEntity({...newEntity, nif: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Email</label><input placeholder="geral@cliente.com" value={newEntity.email} onChange={e => setNewEntity({...newEntity, email: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div>
                    </div>
                    <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Morada</label><input placeholder="Rua..." value={newEntity.address} onChange={e => setNewEntity({...newEntity, address: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Cidade</label><input placeholder="Lisboa" value={newEntity.city} onChange={e => setNewEntity({...newEntity, city: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none"/></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">País</label><select value={newEntity.country} onChange={e => setNewEntity({...newEntity, country: e.target.value})} className="w-full p-3 border dark:border-gray-600 rounded-xl dark:bg-gray-900 bg-gray-50 outline-none">{countries.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700">
                    <button onClick={() => setShowEntityModal(false)} className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancelar</button>
                    <button onClick={handleCreateEntity} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform active:scale-95">Criar Ficha</button>
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