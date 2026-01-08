import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  LayoutDashboard, MessageSquare, FileText, Users, BarChart3, Settings, LogOut, Menu, X, Globe, Moon, Sun, ChevronDown, Eye, EyeOff, User, Trash2, AlertTriangle, Building2, Copy, Send, Shield, Mail, Plus, Search, FileCheck, Calculator, TrendingUp, Archive, TrendingDown, Landmark, PieChart, FileSpreadsheet, Bell, Calendar, Printer, List, BookOpen, CreditCard, Box, Save, Briefcase, Truck, RefreshCw, CheckCircle, AlertCircle, Edit2, Download, Image as ImageIcon, UploadCloud
} from 'lucide-react';

// --- DADOS ESTÁTICOS ---

const countries = ["Portugal", "Brasil", "Angola", "Moçambique", "Cabo Verde", "France", "Deutschland", "United Kingdom", "España", "United States", "Italia", "Belgique", "Suisse", "Luxembourg"];

const invoiceTypesMap: any = {
    "Fatura": "FT", "Fatura-Recibo": "FR", "Fatura Simplificada": "FS", "Fatura Proforma": "FP",
    "Nota de Crédito": "NC", "Nota de Débito": "ND", "Recibo": "RC",
    "Fatura Intracomunitária": "FI", "Fatura Isenta / Autoliquidação": "FA"
};
const invoiceTypes = Object.keys(invoiceTypesMap);

const languages = [ { code: 'pt', label: 'Português', flag: '🇵🇹' }, { code: 'en', label: 'English', flag: '🇬🇧' }, { code: 'fr', label: 'Français', flag: '🇫🇷' }, { code: 'es', label: 'Español', flag: '🇪🇸' }, { code: 'de', label: 'Deutsch', flag: '🇩🇪' }, { code: 'it', label: 'Italiano', flag: '🇮🇹' } ];

const defaultRates: Record<string, number> = { 'EUR': 1, 'USD': 1.05, 'BRL': 6.15, 'AOA': 930, 'MZN': 69, 'CVE': 110.27, 'CHF': 0.94, 'GBP': 0.83 };

const countryCurrencyMap: Record<string, string> = { "Portugal": "EUR", "France": "EUR", "Deutschland": "EUR", "España": "EUR", "Italia": "EUR", "Belgique": "EUR", "Luxembourg": "EUR", "Brasil": "BRL", "United States": "USD", "United Kingdom": "GBP", "Angola": "AOA", "Moçambique": "MZN", "Cabo Verde": "CVE", "Suisse": "CHF" };
const currencySymbols: Record<string, string> = { 'EUR': '€', 'USD': '$', 'BRL': 'R$', 'AOA': 'Kz', 'MZN': 'MT', 'CVE': 'Esc', 'CHF': 'CHF', 'GBP': '£' };
const currencyNames: Record<string, string> = { 'EUR': 'Euro', 'USD': 'Dólar Americano', 'BRL': 'Real Brasileiro', 'AOA': 'Kwanza', 'MZN': 'Metical', 'CVE': 'Escudo', 'CHF': 'Franco Suíço', 'GBP': 'Libra' };

const vatRatesByCountry: Record<string, number[]> = {
    "Portugal": [23, 13, 6, 0], "Luxembourg": [17, 14, 8, 3, 0], "Brasil": [17, 18, 12, 0],
    "Angola": [14, 7, 5, 0], "Moçambique": [16, 0], "Cabo Verde": [15, 0],
    "France": [20, 10, 5.5, 0], "Deutschland": [19, 7, 0], "España": [21, 10, 4, 0],
    "Italia": [22, 10, 5, 0], "Belgique": [21, 12, 6, 0], "Suisse": [8.1, 2.6, 0],
    "United Kingdom": [20, 5, 0], "United States": [0, 5, 10]
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://easycheck-api.onrender.com';

  // --- ESTADOS ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); 
  const [showFinancials, setShowFinancials] = useState(true); 
  const [showModalCode, setShowModalCode] = useState(false);
  const [showPageCode, setShowPageCode] = useState(false);
  const [isDark, setIsDark] = useState(false);

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
  const [exchangeRates, setExchangeRates] = useState<any>(defaultRates);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showEntityModal, setShowEntityModal] = useState(false); 
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false); // ✅ PREVIEW MODAL
  
  const [entityType, setEntityType] = useState<'client' | 'supplier'>('client'); 
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false); // ✅ UPLOAD STATE
  
  const [editForm, setEditForm] = useState({ fullName: '', jobTitle: '', email: '' });
  const [companyForm, setCompanyForm] = useState({ name: '', country: 'Portugal', currency: 'EUR', address: '', nif: '', logo_url: '', footer: '' });
  
  const [newTransaction, setNewTransaction] = useState({ description: '', amount: '', type: 'expense', category: '', date: new Date().toISOString().split('T')[0] });
  const [newAsset, setNewAsset] = useState({ name: '', purchase_date: new Date().toISOString().split('T')[0], purchase_value: '', lifespan_years: 3 });
  const [newEntity, setNewEntity] = useState({ name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' });

  const [invoiceData, setInvoiceData] = useState({
      id: '', // ID para edição
      client_id: '',
      type: 'Fatura',
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      exemption_reason: '',
      items: [{ description: '', quantity: 1, price: 0, tax: 0 }] 
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);

  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Olá! Sou o seu assistente EasyCheck IA. Em que posso ajudar hoje?' }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- HELPERS ---
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
                logo_url: profile.logo_url || '', // ✅ CARREGA LOGO
                footer: profile.company_footer || '' // ✅ CARREGA FOOTER
            });
            if (profile.custom_exchange_rates) { setExchangeRates({ ...defaultRates, ...profile.custom_exchange_rates }); }
        }
        const { data: tr } = await supabase.from('transactions').select('*').order('date', { ascending: false }); if (tr) setTransactions(tr);
        const { data: inv } = await supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false }); if (inv) setRealInvoices(inv);
        const { data: acc } = await supabase.from('accounting_accounts').select('*'); if (acc) setChartOfAccounts(acc);
        const { data: ass } = await supabase.from('accounting_assets').select('*'); if (ass) setAssets(ass);
        const { data: cl } = await supabase.from('clients').select('*'); if (cl) setClients(cl);
        const { data: sup } = await supabase.from('suppliers').select('*'); if (sup) setSuppliers(sup);
      }
      setLoadingUser(false);
    };
    fetchData();
  }, []);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  // IVA INTELIGENTE
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
          tax: item.tax === 0 && newTax !== 0 ? newTax : item.tax 
      }));
      
      setInvoiceData(prev => ({ ...prev, items: updatedItems, exemption_reason: exemption }));

  }, [invoiceData.type]); 

  const toggleTheme = () => { document.documentElement.classList.toggle('dark'); setIsDark(!isDark); };
  const toggleFinancials = () => setShowFinancials(!showFinancials);
  const selectLanguage = (code: string) => { i18n.changeLanguage(code); setIsLangMenuOpen(false); };
  const getInitials = (name: string) => name ? (name.split(' ').length > 1 ? (name.split(' ')[0][0] + name.split(' ')[name.split(' ').length - 1][0]) : name.substring(0, 2)).toUpperCase() : 'EC';
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };
  const copyCode = () => { navigator.clipboard.writeText(profileData?.company_code); alert("Código copiado!"); };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedCountry = e.target.value;
      const newCurrency = getCurrencyCode(selectedCountry);
      setCompanyForm({ ...companyForm, country: selectedCountry, currency: newCurrency });
  };

  const handleRateChange = (currency: string, value: string) => { setExchangeRates((prev: any) => ({ ...prev, [currency]: parseFloat(value) || 0 })); };

  // ✅ UPLOAD DE LOGO
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploadingLogo(true);
      const file = e.target.files[0];
      const fileName = `${userData.id}/logo_${Date.now()}.${file.name.split('.').pop()}`;
      try {
          const { error: uploadError } = await supabase.storage.from('company-logos').upload(fileName, file, { upsert: true });
          if (uploadError) throw uploadError;
          const { data: { publicUrl } } = supabase.storage.from('company-logos').getPublicUrl(fileName);
          setCompanyForm(prev => ({ ...prev, logo_url: publicUrl }));
          alert("Logo carregado!");
      } catch (error: any) { alert("Erro: " + error.message); } finally { setUploadingLogo(false); }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault(); if (!chatInput.trim() || isChatLoading) return;
    const userMessage = { role: 'user', content: chatInput }; setMessages(prev => [...prev, userMessage]); setChatInput(''); setIsChatLoading(true);
    try {
      const context = `[Empresa: ${companyForm.name}, País: ${companyForm.country}, Moeda: ${currentCurrency}] ${chatInput}`;
      const response = await fetch(`${API_URL}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: context }) });
      const data = await response.json();
      if (data.reply) setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Erro de conexão.' }]); } finally { setIsChatLoading(false); }
  };

  // --- ACTIONS ---

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

  const handleSaveInvoice = async () => {
      const totals = calculateInvoiceTotals();
      const prefix = invoiceTypesMap[invoiceData.type] || 'DOC';
      const docNumber = `${prefix} ${new Date().getFullYear()}/${realInvoices.length + 1}`;
      
      let error, data;

      // Se tiver ID, apaga a antiga primeiro (simples update)
      if (invoiceData.id) {
          await supabase.from('invoices').delete().eq('id', invoiceData.id);
      }

      const res = await supabase.from('invoices').insert([{
          user_id: userData.id,
          client_id: invoiceData.client_id,
          type: invoiceData.type,
          invoice_number: docNumber,
          date: invoiceData.date,
          due_date: invoiceData.due_date,
          exemption_reason: invoiceData.exemption_reason,
          subtotal: totals.subtotal,
          tax_total: totals.taxTotal,
          total: totals.total,
          currency: currentCurrency,
          status: 'sent'
      }]).select().single();

      error = res.error;
      data = res.data;

      if (error) return alert("Erro: " + error.message);

      const itemsToInsert = invoiceData.items.map(item => ({
          invoice_id: data.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.price,
          tax_rate: item.tax
      }));

      await supabase.from('invoice_items').insert(itemsToInsert);

      const { data: updatedInvoices } = await supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false });
      if (updatedInvoices) setRealInvoices(updatedInvoices);
      
      setShowInvoiceForm(false);
      setShowPreviewModal(false);
      setInvoiceData({
          id: '',
          client_id: '',
          type: 'Fatura',
          date: new Date().toISOString().split('T')[0],
          due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
          exemption_reason: '',
          items: [{ description: '', quantity: 1, price: 0, tax: 0 }]
      });
  };

  const handleDeleteInvoice = async (id: string) => {
      if (window.confirm("ATENÇÃO: Apagar uma fatura emitida é ilegal em muitos países.\nTem a certeza absoluta?")) {
          if (window.prompt("Escreva 'APAGAR' para confirmar:") === 'APAGAR') {
             const { error } = await supabase.from('invoices').delete().eq('id', id);
             if (!error) setRealInvoices(prev => prev.filter(i => i.id !== id));
          }
      }
  };

  const handleEditInvoice = async (invoice: any) => {
      const { data: items } = await supabase.from('invoice_items').select('*').eq('invoice_id', invoice.id);
      setInvoiceData({
          id: invoice.id,
          client_id: invoice.client_id,
          type: invoice.type,
          date: invoice.date,
          due_date: invoice.due_date,
          exemption_reason: invoice.exemption_reason || '',
          items: items ? items.map((i: any) => ({ description: i.description, quantity: i.quantity, price: i.unit_price, tax: i.tax_rate })) : []
      });
      setShowInvoiceForm(true);
  };

  // ✅ PREVIEW DA LISTA
  const handlePreviewStoredInvoice = async (invoice: any) => {
    const { data: items } = await supabase.from('invoice_items').select('*').eq('invoice_id', invoice.id);
    setInvoiceData({
        id: invoice.id,
        client_id: invoice.client_id,
        type: invoice.type,
        date: invoice.date,
        due_date: invoice.due_date,
        exemption_reason: invoice.exemption_reason || '',
        items: items ? items.map((i: any) => ({ description: i.description, quantity: i.quantity, price: i.unit_price, tax: i.tax_rate })) : []
    });
    setShowPreviewModal(true);
  };

  // ✅ GERADOR DE PDF INTELIGENTE
  const generatePDF = () => {
      const doc = new jsPDF();
      const totals = calculateInvoiceTotals();
      const client = clients.find(c => c.id === invoiceData.client_id) || { name: 'Consumidor Final', address: '', nif: '', city: '', postal_code: '', country: '' };
      
      doc.setFillColor(245, 247, 250);
      doc.rect(0, 0, 210, 45, 'F');

      if (companyForm.logo_url) {
          try {
              doc.addImage(companyForm.logo_url, 'JPEG', 15, 10, 35, 25);
          } catch {
              doc.setFontSize(14); doc.text(companyForm.name.substring(0, 10), 15, 25); 
          }
      }

      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.setFont("helvetica", "bold");
      doc.text(companyForm.name || 'Minha Empresa', 200, 15, { align: 'right' });
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      let companyY = 22;
      doc.text(companyForm.address || '', 200, companyY, { align: 'right' });
      doc.text(`${companyForm.country}, NIF: ${companyForm.nif || 'N/A'}`, 200, companyY + 5, { align: 'right' });

      doc.setFontSize(22);
      doc.setTextColor(0);
      doc.text(invoiceData.type.toUpperCase(), 15, 60);
      const prefix = invoiceTypesMap[invoiceData.type] || 'DOC';
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(invoiceData.id ? `REF: ${realInvoices.find(i => i.id === invoiceData.id)?.invoice_number}` : 'RASCUNHO', 15, 66);

      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text("Exmo.(s) Sr.(s)", 15, 80);
      
      let clientY = 86;
      doc.setFont("helvetica", "bold");
      doc.text(client.name, 15, clientY); clientY += 5;
      
      doc.setFont("helvetica", "normal");
      if (client.address) { doc.text(client.address, 15, clientY); clientY += 5; }
      
      const cityLine = [client.postal_code, client.city, client.country].filter(Boolean).join(' - ');
      if (cityLine) { doc.text(cityLine, 15, clientY); clientY += 5; }
      
      if (client.nif) { doc.text(`NIF: ${client.nif}`, 15, clientY); }

      doc.text(`Data Emissão: ${new Date(invoiceData.date).toLocaleDateString()}`, 140, 86);
      doc.text(`Vencimento: ${new Date(invoiceData.due_date).toLocaleDateString()}`, 140, 91);

      const tableRows = invoiceData.items.map(item => [
          item.description,
          item.quantity,
          `${displaySymbol} ${item.price.toFixed(2)}`,
          `${item.tax}%`,
          `${displaySymbol} ${(item.quantity * item.price).toFixed(2)}`
      ]);

      autoTable(doc, {
        head: [["Descrição", "Qtd", "Preço", "IVA", "Total"]],
        body: tableRows,
        startY: 110,
        theme: 'grid',
        headStyles: { fillColor: [40, 40, 40], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 3 },
      });

      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text(`Subtotal:`, 150, finalY);
      doc.text(`${displaySymbol} ${totals.subtotal.toFixed(2)}`, 195, finalY, { align: 'right' });
      
      doc.text(`IVA / Taxas:`, 150, finalY + 6);
      doc.text(`${displaySymbol} ${totals.taxTotal.toFixed(2)}`, 195, finalY + 6, { align: 'right' });

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`TOTAL:`, 150, finalY + 14);
      doc.text(`${displaySymbol} ${totals.total.toFixed(2)}`, 195, finalY + 14, { align: 'right' });

      if (invoiceData.exemption_reason) {
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.text(`Motivo de Isenção: ${invoiceData.exemption_reason}`, 15, finalY + 25);
      }

      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(150);
      if (companyForm.footer) doc.text(companyForm.footer, 105, pageHeight - 15, { align: 'center' });
      doc.text("Processado por EasyCheck - Software Certificado", 105, pageHeight - 10, { align: 'center' });

      return doc;
  };

  const handleDownloadPDF = () => {
      const doc = generatePDF();
      doc.save(`Fatura_${Date.now()}.pdf`);
      if (!invoiceData.id) handleSaveInvoice(); // Se for nova, grava
  };

  const handlePreview = () => {
      if (!invoiceData.client_id) return alert("Selecione um cliente.");
      if (invoiceData.items.length === 0) return alert("Adicione itens.");
      setShowPreviewModal(true);
  };

  const handleCreateTransaction = async () => {
     if (!newTransaction.amount || !newTransaction.description) return alert("Preencha dados.");
     const amountInEur = parseFloat(newTransaction.amount) / conversionRate;
     const { data } = await supabase.from('transactions').insert([{ user_id: userData.id, description: newTransaction.description, amount: amountInEur, type: newTransaction.type, category: newTransaction.category || 'Geral', date: newTransaction.date }]).select();
     if (data) { setTransactions([data[0], ...transactions]); setShowTransactionModal(false); setNewTransaction({ description: '', amount: '', type: 'expense', category: '', date: new Date().toISOString().split('T')[0] }); }
  };

  const handleCreateAsset = async () => {
    if (!newAsset.name || !newAsset.purchase_value) return alert("Preencha dados.");
    const valueInEur = parseFloat(newAsset.purchase_value) / conversionRate;
    const { data } = await supabase.from('accounting_assets').insert([{ user_id: userData.id, name: newAsset.name, purchase_date: newAsset.purchase_date, purchase_value: valueInEur, lifespan_years: newAsset.lifespan_years }]).select();
    if (data) { setAssets([...assets, data[0]]); setShowAssetModal(false); setNewAsset({ name: '', purchase_date: new Date().toISOString().split('T')[0], purchase_value: '', lifespan_years: 3 }); }
  };

  const handleCreateEntity = async () => {
      if (!newEntity.name) return alert("Nome obrigatório");
      const table = entityType === 'client' ? 'clients' : 'suppliers';
      const { data, error } = await supabase.from(table).insert([{ user_id: userData.id, ...newEntity }]).select();
      if (!error && data) {
          if (entityType === 'client') setClients([data[0], ...clients]); else setSuppliers([data[0], ...suppliers]);
          setShowEntityModal(false); setNewEntity({ name: '', nif: '', email: '', address: '', city: '', postal_code: '', country: 'Portugal' });
      } else { alert("Erro ao criar: " + error?.message); }
  };

  const handleDeleteEntity = async (id: string, type: 'client' | 'supplier') => {
      if (!window.confirm("Apagar este registo?")) return;
      const table = type === 'client' ? 'clients' : 'suppliers';
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (!error) { if (type === 'client') setClients(prev => prev.filter(c => c.id !== id)); else setSuppliers(prev => prev.filter(s => s.id !== id)); }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm("Eliminar registo?")) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const updates = { full_name: editForm.fullName, job_title: editForm.jobTitle, updated_at: new Date() };
      await supabase.from('profiles').update(updates).eq('id', userData.id);
      setProfileData({ ...profileData, ...updates });
      alert(`Perfil Pessoal atualizado!`); setIsProfileModalOpen(false);
    } catch { alert("Erro ao guardar."); } finally { setSavingProfile(false); }
  };

  const handleSaveCompany = async () => {
    setSavingCompany(true);
    try {
        const updates = { 
            company_name: companyForm.name, 
            company_nif: companyForm.nif, 
            company_address: companyForm.address, 
            country: companyForm.country, 
            currency: companyForm.currency, 
            custom_exchange_rates: exchangeRates, 
            logo_url: companyForm.logo_url, // ✅ GRAVA LOGO
            company_footer: companyForm.footer, // ✅ GRAVA FOOTER
            updated_at: new Date() 
        };
        await supabase.from('profiles').update(updates).eq('id', userData.id);
        setProfileData({ ...profileData, ...updates });
        alert(`Dados da Empresa e Moeda (${companyForm.currency}) atualizados!`);
    } catch { alert("Erro ao guardar."); } finally { setSavingCompany(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'ELIMINAR') return alert(t('delete.confirm_text'));
    setIsDeleting(true); try { await supabase.rpc('delete_user'); await supabase.auth.signOut(); navigate('/'); } catch(e: any) { alert(e.message); } finally { setIsDeleting(false); }
  };

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
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-blue-600 text-white shadow-lg' : item.special ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-100 dark:border-purple-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
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
              <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2 flex gap-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Globe className="w-5 h-5"/><ChevronDown className="w-3 h-3"/></button>
              {isLangMenuOpen && <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-40">
                {languages.map(l => <button key={l.code} onClick={() => selectLanguage(l.code)} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-2"><span>{l.flag}</span>{l.label}</button>)}
              </div>}
            </div>
            
            <button onClick={toggleTheme} className="p-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}</button>
            <button className="p-2 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative"><Bell className="w-5 h-5"/>{notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}</button>
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
                  {/* RECEITA */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2"><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Receita Mensal</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div>
                    {/* VALOR CONVERTIDO */}
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{showFinancials ? `${displaySymbol} ${totalRevenue.toFixed(2)}` : '••••••'}</p>
                  </div>
                  {/* DESPESA */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2"><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Despesas</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div>
                    {/* VALOR CONVERTIDO */}
                    <p className="text-3xl font-bold text-red-500 dark:text-red-400">{showFinancials ? `${displaySymbol} ${totalExpenses.toFixed(2)}` : '••••••'}</p>
                  </div>
                  {/* SALDO */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2"><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Saldo Atual</h3><button onClick={toggleFinancials} className="text-gray-400">{showFinancials ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}</button></div>
                    {/* VALOR CONVERTIDO */}
                    <p className={`text-3xl font-bold ${currentBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>{showFinancials ? `${displaySymbol} ${currentBalance.toFixed(2)}` : '••••••'}</p>
                  </div>
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
                            { id: 'chart', label: 'Plano de Contas', icon: List },
                            { id: 'journal', label: 'Lançamentos', icon: BookOpen },
                            { id: 'clients', label: 'Clientes', icon: Briefcase }, 
                            { id: 'invoices', label: 'Faturas', icon: FileText }, 
                            { id: 'purchases', label: 'Compras', icon: TrendingDown },
                            { id: 'suppliers', label: 'Fornecedores', icon: Truck }, 
                            { id: 'assets', label: 'Ativos', icon: Box },
                            { id: 'banking', label: 'Bancos', icon: Landmark },
                            { id: 'taxes', label: 'Impostos', icon: FileCheck },
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
                                                {/* ✅ CONVERTE NA TABELA */}
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
                                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center"><h3 className="font-bold flex items-center gap-2"><Briefcase size={18}/> Clientes</h3><button onClick={() => {setEntityType('client'); setShowEntityModal(true)}} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex gap-2 items-center"><Plus size={16}/> Novo Cliente</button></div>
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 uppercase text-xs"><tr><th className="px-6 py-3">Nome</th><th className="px-6 py-3">NIF</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Cidade</th><th className="px-6 py-3 text-right">Ação</th></tr></thead>
                                    <tbody>{clients.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Nenhum cliente registado.</td></tr> : clients.map(c => (<tr key={c.id} className="border-b dark:border-gray-700"><td className="px-6 py-4 font-medium">{c.name}</td><td className="px-6 py-4">{c.nif || '-'}</td><td className="px-6 py-4">{c.email || '-'}</td><td className="px-6 py-4">{c.city || '-'}</td><td className="px-6 py-4 text-right"><button onClick={() => handleDeleteEntity(c.id, 'client')} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></td></tr>))}</tbody>
                                </table>
                            </div>
                        )}

                        {accountingTab === 'suppliers' && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center"><h3 className="font-bold flex items-center gap-2"><Truck size={18}/> Fornecedores</h3><button onClick={() => {setEntityType('supplier'); setShowEntityModal(true)}} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex gap-2 items-center"><Plus size={16}/> Novo Fornecedor</button></div>
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 uppercase text-xs"><tr><th className="px-6 py-3">Nome</th><th className="px-6 py-3">NIF</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Categoria</th><th className="px-6 py-3 text-right">Ação</th></tr></thead>
                                    <tbody>{suppliers.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Nenhum fornecedor registado.</td></tr> : suppliers.map(s => (<tr key={s.id} className="border-b dark:border-gray-700"><td className="px-6 py-4 font-medium">{s.name}</td><td className="px-6 py-4">{s.nif || '-'}</td><td className="px-6 py-4">{s.email || '-'}</td><td className="px-6 py-4">{s.category || '-'}</td><td className="px-6 py-4 text-right"><button onClick={() => handleDeleteEntity(s.id, 'supplier')} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></td></tr>))}</tbody>
                                </table>
                            </div>
                        )}

                        {accountingTab === 'chart' && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center"><h3 className="font-bold flex items-center gap-2">Plano de Contas ({profileData?.country})</h3><button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex gap-2 items-center"><Plus size={16}/> Criar Conta</button></div>
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 uppercase text-xs"><tr><th className="px-6 py-3">Código</th><th className="px-6 py-3">Nome</th><th className="px-6 py-3">Tipo</th></tr></thead>
                                    <tbody>{chartOfAccounts.length === 0 ? <tr><td colSpan={3} className="text-center py-8 text-gray-400">Sem contas.</td></tr> : chartOfAccounts.map(acc => (<tr key={acc.id} className="border-b dark:border-gray-700"><td className="px-6 py-4 font-mono font-bold text-blue-600">{acc.code}</td><td className="px-6 py-4 font-medium">{acc.name}</td><td className="px-6 py-4 uppercase text-xs">{acc.type}</td></tr>))}</tbody>
                                </table>
                            </div>
                        )}

                        {accountingTab === 'assets' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center"><h3 className="font-bold text-lg">Mapa de Amortizações</h3><button onClick={() => setShowAssetModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg"><Plus size={18}/> Novo Ativo</button></div>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 uppercase text-xs"><tr><th className="px-6 py-3">Ativo</th><th className="px-6 py-3">Data Compra</th><th className="px-6 py-3 text-right">Valor Aquisição</th><th className="px-6 py-3 text-right">Vida Útil</th><th className="px-6 py-3 text-right">Amortização Anual</th></tr></thead>
                                        <tbody>{assets.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Nenhum ativo registado.</td></tr> : assets.map(a => (
                                            <tr key={a.id} className="border-b dark:border-gray-700">
                                                <td className="px-6 py-4 font-medium">{a.name}</td><td className="px-6 py-4">{new Date(a.purchase_date).toLocaleDateString()}</td>
                                                {/* ✅ CONVERTE NA TABELA */}
                                                <td className="px-6 py-4 text-right">{displaySymbol} {(a.purchase_value * conversionRate).toFixed(2)}</td>
                                                <td className="px-6 py-4 text-right">{a.lifespan_years} anos</td>
                                                <td className="px-6 py-4 text-right font-bold text-orange-500">{displaySymbol} {((a.purchase_value / a.lifespan_years) * conversionRate).toFixed(2)}</td>
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ✅ ABA FATURAS (INVOICES) */}
                        {accountingTab === 'invoices' && (
                            <div className="space-y-6">
                                {!showInvoiceForm ? (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-lg">Faturas Emitidas</h3>
                                            <button onClick={() => setShowInvoiceForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg"><Plus size={18}/> Criar Nova Fatura</button>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 uppercase text-xs">
                                                    <tr><th className="px-6 py-3">Número</th><th className="px-6 py-3">Cliente</th><th className="px-6 py-3">Tipo</th><th className="px-6 py-3">Data</th><th className="px-6 py-3 text-right">Total</th><th className="px-6 py-3 text-right">Ações</th></tr>
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
                                                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                                    <button onClick={() => handlePreviewStoredInvoice(inv)} className="text-blue-500 hover:text-blue-700" title="Ver PDF"><Eye size={18}/></button>
                                                                    <button onClick={() => handleEditInvoice(inv)} className="text-gray-500 hover:text-gray-700" title="Editar"><Edit2 size={18}/></button>
                                                                    <button onClick={() => handleDeleteInvoice(inv.id)} className="text-red-400 hover:text-red-600" title="Apagar"><Trash2 size={18}/></button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                ) : (
                                    /* ✅ FORMULÁRIO DE CRIAÇÃO DE FATURA COMPLETO */
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 p-8 animate-fade-in-up">
                                        <div className="flex justify-between items-start mb-8 pb-6 border-b dark:border-gray-700">
                                            <div>
                                                <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-blue-600"/> Emitir Novo Documento</h2>
                                                <p className="text-gray-500 text-sm mt-1">Selecione o tipo de documento e preencha os dados.</p>
                                            </div>
                                            <button onClick={() => setShowInvoiceForm(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                                        </div>

                                        {/* TIPO DE DOCUMENTO */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-bold mb-2">Tipo de Documento</label>
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {invoiceTypes.map(t => (
                                                    <button 
                                                        key={t} 
                                                        onClick={() => setInvoiceData({...invoiceData, type: t})}
                                                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${invoiceData.type === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600 hover:bg-gray-50'}`}
                                                    >
                                                        {t}
                                                    </button>
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
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Data Emissão</label>
                                                <input type="date" className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" value={invoiceData.date} onChange={e => setInvoiceData({...invoiceData, date: e.target.value})}/>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Vencimento</label>
                                                <input type="date" className="w-full p-3 border rounded-xl dark:bg-gray-900 outline-none" value={invoiceData.due_date} onChange={e => setInvoiceData({...invoiceData, due_date: e.target.value})}/>
                                            </div>
                                        </div>

                                        {/* ALERTAS DE IVA */}
                                        {invoiceData.exemption_reason && (
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-xl mb-6 flex gap-3 items-center">
                                                <AlertCircle className="text-yellow-600"/>
                                                <div>
                                                    <p className="font-bold text-yellow-800 dark:text-yellow-200 text-sm">Regime de Isenção Aplicado</p>
                                                    <p className="text-xs text-yellow-700 dark:text-yellow-300">{invoiceData.exemption_reason}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* LINHAS DA FATURA */}
                                        <div className="mb-8">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b dark:border-gray-700 text-left text-gray-500 uppercase text-xs">
                                                        <th className="py-2 w-1/2">Descrição</th>
                                                        <th className="py-2 w-20 text-center">Qtd</th>
                                                        <th className="py-2 w-32 text-right">Preço Un.</th>
                                                        <th className="py-2 w-24 text-right">IVA %</th>
                                                        <th className="py-2 w-32 text-right">Total</th>
                                                        <th className="py-2 w-10"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y dark:divide-gray-700">
                                                    {invoiceData.items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="py-3"><input className="w-full bg-transparent outline-none font-medium" placeholder="Nome do produto/serviço" value={item.description} onChange={e => updateInvoiceItem(index, 'description', e.target.value)}/></td>
                                                            <td className="py-3"><input type="number" className="w-full bg-transparent outline-none text-center" value={item.quantity} onChange={e => updateInvoiceItem(index, 'quantity', e.target.value)}/></td>
                                                            <td className="py-3"><input type="number" className="w-full bg-transparent outline-none text-right" value={item.price} onChange={e => updateInvoiceItem(index, 'price', e.target.value)}/></td>
                                                            
                                                            {/* ✅ IVA HÍBRIDO (INPUT + BOTÃO "LÁPIS") */}
                                                            <td className="py-3 flex items-center justify-end gap-2 relative">
                                                                <input 
                                                                    type="number" 
                                                                    className="w-16 bg-transparent outline-none text-right font-bold border-b border-dashed border-gray-300 focus:border-blue-500" 
                                                                    value={item.tax} 
                                                                    onChange={e => updateInvoiceItem(index, 'tax', e.target.value)}
                                                                />
                                                                {/* Botão Mágico de Sugestões */}
                                                                <div className="relative group">
                                                                    <button className="p-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 text-gray-500 hover:text-blue-600 transition-colors">
                                                                        <Edit2 size={12}/>
                                                                    </button>
                                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-xl rounded-xl p-2 z-50 hidden group-hover:block animate-fade-in-up">
                                                                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-2 px-2 border-b dark:border-gray-700 pb-1">Taxas {companyForm.country}</p>
                                                                        <div className="grid grid-cols-2 gap-1">
                                                                            {getCurrentCountryVatRates().map(rate => (
                                                                                <button 
                                                                                    key={rate} 
                                                                                    onClick={() => updateInvoiceItem(index, 'tax', rate.toString())} 
                                                                                    className="text-center px-2 py-1.5 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors"
                                                                                >
                                                                                    {rate}%
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="py-3 text-right font-bold">{displaySymbol} {(item.quantity * item.price).toFixed(2)}</td>
                                                            <td className="py-3 text-center"><button onClick={() => handleRemoveInvoiceItem(index)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <button onClick={handleAddInvoiceItem} className="mt-4 text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline"><Plus size={16}/> Adicionar Linha</button>
                                        </div>

                                        {/* TOTAIS */}
                                        <div className="flex justify-end border-t dark:border-gray-700 pt-6">
                                            <div className="w-64 space-y-2">
                                                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{displaySymbol} {invoiceTotals.subtotal.toFixed(2)}</span></div>
                                                <div className="flex justify-between text-gray-500"><span>IVA / Taxas</span><span>{displaySymbol} {invoiceTotals.taxTotal.toFixed(2)}</span></div>
                                                <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white pt-2 border-t dark:border-gray-700"><span>Total</span><span>{displaySymbol} {invoiceTotals.total.toFixed(2)}</span></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-4 mt-8">
                                            <button onClick={() => setShowInvoiceForm(false)} className="px-6 py-3 rounded-xl border font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Cancelar</button>
                                            <button onClick={handlePreview} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2"><Eye size={20}/> Pré-visualizar & Emitir</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {['journal', 'purchases', 'banking', 'taxes', 'reports'].includes(accountingTab) && (
                            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700"><Archive className="w-16 h-16 text-gray-300 mb-4"/><h3 className="text-xl font-bold">Módulo {accountingTab.toUpperCase()}</h3><p className="text-gray-500">Pronto para {profileData?.country}.</p></div>
                        )}
                    </div>
                </div>
            } />

            <Route path="company" element={isOwner ? (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div><h4 className="font-bold text-blue-900 dark:text-white mb-1">{t('settings.invite_code')}</h4><p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.invite_text')}</p></div>
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                      <code className="px-2 font-mono text-lg font-bold text-gray-700 dark:text-gray-300">{showPageCode ? profileData?.company_code : '••••••••'}</code>
                      <button onClick={() => setShowPageCode(!showPageCode)} className="p-2 text-gray-400 hover:text-blue-600">{showPageCode ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                      <button onClick={copyCode} className="p-2 text-gray-400 hover:text-blue-600"><Copy className="w-4 h-4"/></button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
                      <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-bold flex items-center gap-2"><Building2 className="text-blue-600"/> Dados Fiscais da Empresa</h2>
                          <button onClick={handleSaveCompany} disabled={savingCompany} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold hover:bg-blue-700 shadow-md transition-all">{savingCompany ? 'A guardar...' : <><Save size={18}/> Guardar Dados</>}</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div><label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Nome da Entidade</label><input value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Minha Empresa Lda"/></div>
                          <div><label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">NIF / VAT Number</label><input value={companyForm.nif} onChange={e => setCompanyForm({...companyForm, nif: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: 500 123 456"/></div>
                          <div className="md:col-span-2"><label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Morada Fiscal (Sede)</label><input value={companyForm.address} onChange={e => setCompanyForm({...companyForm, address: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Av. da Liberdade, 100, Lisboa"/></div>
                      </div>
                      {/* CONFIGURAÇÃO DE LOGO E FOOTER */}
                      <div className="mt-6 pt-6 border-t dark:border-gray-700">
                          <h3 className="text-lg font-bold mb-4">Personalização de Faturas</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div><label className="block text-sm font-bold mb-2">URL do Logótipo</label>
                                  <div className="flex gap-2">
                                      {companyForm.logo_url ? <img src={companyForm.logo_url} className="h-10 w-10 object-contain border p-1 rounded"/> : <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-500"><ImageIcon size={16}/></div>}
                                      <div className="flex-1">
                                         <label className="cursor-pointer bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-100 w-fit">
                                            <UploadCloud size={14}/> Carregar Logo
                                            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo}/>
                                         </label>
                                         <p className="text-[10px] text-gray-400 mt-1">Recomendado: PNG Transparente</p>
                                      </div>
                                  </div>
                              </div>
                              <div><label className="block text-sm font-bold mb-2">Rodapé da Fatura</label><input value={companyForm.footer} onChange={e => setCompanyForm({...companyForm, footer: e.target.value})} className="w-full p-3 border rounded-xl dark:bg-gray-900" placeholder="Ex: Capital Social 5000€ - CRC Lisboa"/></div>
                          </div>
                      </div>
                  </div>
                </div>
              ) : <div className="text-center py-12"><Shield className="w-16 h-16 mx-auto mb-4 text-gray-300"/><h3 className="text-xl font-bold dark:text-white">Acesso Restrito</h3></div>
            } />

            <Route path="*" element={<div className="flex justify-center py-10 text-gray-400">Em desenvolvimento...</div>} />
          </Routes>
        </div>
      </main>

      {/* MODAL PREVIEW PDF */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 w-full h-full max-w-5xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
                <div className="bg-gray-900 text-white p-4 flex justify-between items-center shrink-0">
                    <h3 className="font-bold flex gap-2 items-center"><Eye size={20}/> Pré-visualização da Fatura</h3>
                    <div className="flex gap-4">
                        <button onClick={() => setShowPreviewModal(false)} className="text-gray-400 hover:text-white transition-colors">Fechar</button>
                        <button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Download size={18}/> Baixar PDF</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-gray-100 dark:bg-gray-900 flex justify-center">
                    <div id="invoice-preview" className="bg-white text-gray-900 w-[210mm] min-h-[297mm] p-12 shadow-xl relative">
                        {/* Header Fatura */}
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                {companyForm.logo_url ? <img src={companyForm.logo_url} className="h-16 w-auto object-contain mb-4"/> : <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 mb-4"><ImageIcon/></div>}
                                <h1 className="text-3xl font-bold text-gray-800">{invoiceData.type.toUpperCase()}</h1>
                                <p className="text-gray-500 font-mono mt-1"># RASCUNHO</p>
                            </div>
                            <div className="text-right">
                                <h2 className="font-bold text-xl">{companyForm.name || 'Nome da Empresa'}</h2>
                                <p className="text-sm text-gray-500">{companyForm.address}</p>
                                <p className="text-sm text-gray-500">NIF: {companyForm.nif}</p>
                                <p className="text-sm text-gray-500">{companyForm.country}</p>
                            </div>
                        </div>

                        {/* Dados Cliente e Datas */}
                        <div className="flex justify-between mb-12">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Faturado a:</h3>
                                {clients.find(c => c.id === invoiceData.client_id) && (
                                    <>
                                        <p className="font-bold text-lg">{clients.find(c => c.id === invoiceData.client_id)?.name}</p>
                                        <p className="text-sm text-gray-600">{clients.find(c => c.id === invoiceData.client_id)?.address}</p>
                                        <p className="text-sm text-gray-600">NIF: {clients.find(c => c.id === invoiceData.client_id)?.nif}</p>
                                        <p className="text-sm text-gray-600">{clients.find(c => c.id === invoiceData.client_id)?.city}, {clients.find(c => c.id === invoiceData.client_id)?.country}</p>
                                    </>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="mb-2"><span className="text-gray-500 text-sm">Data de Emissão:</span> <span className="font-bold">{new Date(invoiceData.date).toLocaleDateString()}</span></div>
                                <div><span className="text-gray-500 text-sm">Vencimento:</span> <span className="font-bold">{new Date(invoiceData.due_date).toLocaleDateString()}</span></div>
                            </div>
                        </div>

                        {/* Tabela de Itens */}
                        <table className="w-full mb-8">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="text-left py-3 text-sm font-bold text-gray-600 uppercase">Descrição</th>
                                    <th className="text-center py-3 text-sm font-bold text-gray-600 uppercase">Qtd</th>
                                    <th className="text-right py-3 text-sm font-bold text-gray-600 uppercase">Preço Un.</th>
                                    <th className="text-right py-3 text-sm font-bold text-gray-600 uppercase">IVA</th>
                                    <th className="text-right py-3 text-sm font-bold text-gray-600 uppercase">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceData.items.map((item, i) => (
                                    <tr key={i} className="border-b border-gray-50">
                                        <td className="py-4 text-sm font-medium">{item.description}</td>
                                        <td className="py-4 text-sm text-center">{item.quantity}</td>
                                        <td className="py-4 text-sm text-right">{displaySymbol} {item.price.toFixed(2)}</td>
                                        <td className="py-4 text-sm text-right">{item.tax}%</td>
                                        <td className="py-4 text-sm text-right font-bold">{displaySymbol} {(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totais */}
                        <div className="flex justify-end">
                            <div className="w-64 space-y-2">
                                <div className="flex justify-between text-gray-500 text-sm"><span>Subtotal:</span><span>{displaySymbol} {calculateInvoiceTotals().subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-gray-500 text-sm"><span>Impostos (IVA):</span><span>{displaySymbol} {calculateInvoiceTotals().taxTotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-200"><span>Total:</span><span>{displaySymbol} {calculateInvoiceTotals().total.toFixed(2)}</span></div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="absolute bottom-12 left-12 right-12 text-center border-t pt-8">
                            <p className="text-xs text-gray-400">{companyForm.footer || "Obrigado pela sua preferência."}</p>
                            <p className="text-[10px] text-gray-300 mt-1">Processado por EasyCheck Software Certificado</p>
                        </div>
                    </div>
                </div>
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
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t dark:border-gray-700">
                    <button onClick={() => setShowAssetModal(false)} className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancelar</button>
                    <button onClick={handleCreateAsset} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform active:scale-95">Adicionar Ativo</button>
                </div>
            </div>
        </div>
      )}

      {/* MODAL ELIMINAR CONTA */}
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