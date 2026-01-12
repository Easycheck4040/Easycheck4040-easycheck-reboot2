import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import i18n from '../i18n'; // Assume que tens o i18n configurado

// --- CONFIGURAÇÃO SUPABASE ---
// (Certifica-te que estas variáveis de ambiente estão no teu .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// --- TIPOS ---
export const countries = ['Portugal', 'Brasil', 'França', 'Angola', 'Moçambique', 'Espanha', 'UK', 'USA'];
export const invoiceTypes = ['Fatura', 'Fatura-Recibo', 'Nota de Crédito', 'Orçamento', 'Guia de Transporte'];
export const languages = [
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

// --- INTERFACE DO ESTADO DA IA ---
type AIIntentState = 
  | 'IDLE' 
  | 'AWAITING_CLIENT_FOR_INVOICE' 
  | 'AWAITING_AMOUNT_FOR_INVOICE' 
  | 'CONFIRM_INVOICE_CREATION'
  | 'AWAITING_ASSET_NAME'
  | 'AWAITING_ASSET_VALUE';

interface AIContext {
  intent: AIIntentState;
  tempData: any; // Armazena dados parciais (ex: já tenho o valor, falta o cliente)
}

export const useDashboardLogic = () => {
    const navigate = useNavigate();
    
    // ----------------------------------
    // 1. ESTADOS GLOBAIS & UTILIZADOR
    // ----------------------------------
    const [loadingUser, setLoadingUser] = useState(true);
    const [profileData, setProfileData] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

    // ----------------------------------
    // 2. ESTADOS FINANCEIROS & DADOS
    // ----------------------------------
    const [accountingTab, setAccountingTab] = useState('overview');
    const [realInvoices, setRealInvoices] = useState<any[]>([]);
    const [purchases, setPurchases] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]); // NOVO: Lista de Ativos
    const [journalEntries, setJournalEntries] = useState<any[]>([]);
    const [companyAccounts, setCompanyAccounts] = useState<any[]>([]);
    const [bankStatement, setBankStatement] = useState<any[]>([]);
    
    // KPIs Calculados
    const [currentBalance, setCurrentBalance] = useState(0);
    const [totalInvoicesCount, setTotalInvoicesCount] = useState(0);
    const [showFinancials, setShowFinancials] = useState(true);
    const [actionLogs, setActionLogs] = useState<any[]>([]);

    // ----------------------------------
    // 3. ESTADOS DE FORMULÁRIOS (MODAIS)
    // ----------------------------------
    const [showInvoiceForm, setShowInvoiceForm] = useState(false);
    const [showPurchaseForm, setShowPurchaseForm] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showAssetModal, setShowAssetModal] = useState(false); // NOVO
    const [showEntityModal, setShowEntityModal] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showAmortSchedule, setShowAmortSchedule] = useState(false); // NOVO

    // Dados de Formulários
    const [invoiceData, setInvoiceData] = useState({
        client_id: '', type: 'Fatura', date: new Date().toISOString().split('T')[0], items: [{ description: '', quantity: 1, price: 0, tax: 23 }]
    });
    
    // NOVO: Estado para criação de Ativos
    const [newAsset, setNewAsset] = useState({
        name: '',
        category: 'Equipamento',
        purchase_date: new Date().toISOString().split('T')[0],
        purchase_value: '',
        lifespan_years: 4,
        amortization_method: 'linear' // ou 'degressive'
    });
    const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
    const [selectedAssetForSchedule, setSelectedAssetForSchedule] = useState<any>(null);

    const [newPurchase, setNewPurchase] = useState({ supplier_id: '', total: '', invoice_number: '', tax_total: '' });
    const [manualTaxMode, setManualTaxMode] = useState(false);
    const [conversionRate, setConversionRate] = useState(1);
    const [displaySymbol, setDisplaySymbol] = useState('€');

    // Estado da Empresa
    const [companyForm, setCompanyForm] = useState({
        country: 'Portugal', currency: 'EUR', invoice_color: '#2563EB', header_text: '', footer: ''
    });

    // ----------------------------------
    // 4. ESTADOS DA IA (CÉREBRO)
    // ----------------------------------
    const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
        { role: 'assistant', content: 'Olá! Sou o Jarvis, o teu assistente financeiro. Podes pedir-me para criar faturas, analisar custos ou gerir ativos.' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // A MÁQUINA DE ESTADOS DA IA
    const [aiContext, setAiContext] = useState<AIContext>({ 
        intent: 'IDLE', 
        tempData: {} 
    });

    // ----------------------------------
    // 5. EFFECTS (CARREGAMENTO INICIAL)
    // ----------------------------------
    useEffect(() => {
        fetchUserAndData();
    }, []);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    // ----------------------------------
    // 6. FUNÇÕES DE DADOS (DATA FETCHING)
    // ----------------------------------
    const fetchUserAndData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Modo Demo se não houver user, ou redirecionar
                setLoadingUser(false);
                return; 
            }

            // Buscar Perfil
            let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            setProfileData(profile);

            // Se tivermos perfil, configuramos a moeda e país
            if (profile?.country) {
                setCompanyForm(prev => ({ ...prev, country: profile.country, currency: profile.currency || 'EUR' }));
                setDisplaySymbol(profile.currency === 'BRL' ? 'R$' : '€');
            }

            // Carregar Dados das Tabelas
            const [invRes, cliRes, supRes, purRes, accRes, assetRes] = await Promise.all([
                supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false }),
                supabase.from('clients').select('*'),
                supabase.from('suppliers').select('*'),
                supabase.from('purchases').select('*, suppliers(name)'),
                supabase.from('company_accounts').select('*').order('code', { ascending: true }),
                supabase.from('accounting_assets').select('*') // Busca os ativos reais
            ]);

            if (invRes.data) {
                setRealInvoices(invRes.data);
                setTotalInvoicesCount(invRes.data.length);
                // Calcular Saldo Simples (Receitas - Despesas)
                const totalReceitas = invRes.data.reduce((acc, curr) => acc + (curr.total || 0), 0);
                const totalDespesas = (purRes.data || []).reduce((acc, curr) => acc + (curr.total || 0), 0);
                setCurrentBalance(totalReceitas - totalDespesas);
            }
            if (cliRes.data) setClients(cliRes.data);
            if (supRes.data) setSuppliers(supRes.data);
            if (purRes.data) setPurchases(purRes.data);
            if (accRes.data) setCompanyAccounts(accRes.data);
            if (assetRes.data) setAssets(assetRes.data);

            // Carregar Logs
            const { data: logs } = await supabase.from('action_logs').select('*').order('created_at', { ascending: false }).limit(20);
            if (logs) setActionLogs(logs);

        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setLoadingUser(false);
        }
    };

    // ----------------------------------
    // 7. LÓGICA DE IA (MÁQUINA DE ESTADOS)
    // ----------------------------------
    const handleSendChatMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            // Processamento Local (State Machine) vs LLM Remoto
            const localResponse = await processAICommand(userMsg);
            
            // Simular delay "humano"
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'assistant', content: localResponse }]);
                setIsChatLoading(false);
            }, 600);

        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Desculpa, tive um erro interno." }]);
            setIsChatLoading(false);
        }
    };

    const processAICommand = async (input: string): Promise<string> => {
        const text = input.toLowerCase();

        // --- ESTADO 1: IDLE (À espera de comando inicial) ---
        if (aiContext.intent === 'IDLE') {
            
            // INTENÇÃO: CRIAR FATURA
            if (text.includes('fatura') && (text.includes('criar') || text.includes('nova') || text.includes('emitir'))) {
                // Tentar extrair valor imediatamente
                const amountMatch = text.match(/(\d+([.,]\d{1,2})?)/);
                const extractedAmount = amountMatch ? parseFloat(amountMatch[0].replace(',', '.')) : null;

                setAiContext({
                    intent: 'AWAITING_CLIENT_FOR_INVOICE',
                    tempData: { amount: extractedAmount }
                });

                if (extractedAmount) {
                    return `Entendido. Fatura de ${displaySymbol}${extractedAmount}. Para qual cliente?`;
                } else {
                    return "Claro. Vou preparar uma fatura. Qual é o valor?";
                }
            }

            // INTENÇÃO: LISTAR ATIVOS
            if (text.includes('ativos') || text.includes('imobilizado')) {
                navigate('/dashboard/accounting');
                setAccountingTab('assets');
                return `Tens ${assets.length} ativos registados com um valor total de ${displaySymbol}${assets.reduce((acc, a) => acc + a.purchase_value, 0).toFixed(2)}. Abri a tabela para ti.`;
            }

             // INTENÇÃO: SALDO
            if (text.includes('saldo') || text.includes('quanto tenho')) {
                 return `O teu saldo contabilístico atual é de ${displaySymbol}${currentBalance.toFixed(2)}.`;
            }

            // Fallback para conversação genérica (aqui poderias chamar a API do Groq/OpenAI)
            return "Posso ajudar-te a criar faturas, registar despesas ou consultar o estado dos teus ativos. O que precisas?";
        }

        // --- ESTADO 2: À ESPERA DE CLIENTE (Fluxo Fatura) ---
        if (aiContext.intent === 'AWAITING_CLIENT_FOR_INVOICE') {
            // O utilizador deve ter respondido com o nome do cliente
            const clientName = input;
            
            // Procura simples (fuzzy search seria ideal aqui)
            const client = clients.find(c => c.name.toLowerCase().includes(clientName.toLowerCase()));

            if (client) {
                // Se já temos valor, vamos para confirmação
                if (aiContext.tempData.amount) {
                    setAiContext({
                        intent: 'CONFIRM_INVOICE_CREATION',
                        tempData: { ...aiContext.tempData, client_id: client.id, client_name: client.name }
                    });
                    return `Confirma a emissão da fatura de ${displaySymbol}${aiContext.tempData.amount} para ${client.name}? (Sim/Não)`;
                } else {
                    // Se não temos valor, pede o valor
                    setAiContext({
                        intent: 'AWAITING_AMOUNT_FOR_INVOICE',
                        tempData: { ...aiContext.tempData, client_id: client.id, client_name: client.name }
                    });
                    return `Cliente ${client.name} selecionado. Qual o valor da fatura?`;
                }
            } else {
                return `Não encontrei o cliente "${clientName}". Podes tentar outro nome ou dizer "Cancelar".`;
            }
        }

        // --- ESTADO 3: À ESPERA DE VALOR (Fluxo Fatura) ---
        if (aiContext.intent === 'AWAITING_AMOUNT_FOR_INVOICE') {
             const amountMatch = text.match(/(\d+([.,]\d{1,2})?)/);
             const amount = amountMatch ? parseFloat(amountMatch[0].replace(',', '.')) : null;

             if (amount) {
                setAiContext({
                    intent: 'CONFIRM_INVOICE_CREATION',
                    tempData: { ...aiContext.tempData, amount: amount }
                });
                return `Certo. ${displaySymbol}${amount} para ${aiContext.tempData.client_name}. Posso emitir?`;
             } else {
                 return "Não entendi o valor. Por favor escreve apenas o número (ex: 150.50).";
             }
        }

        // --- ESTADO 4: CONFIRMAÇÃO ---
        if (aiContext.intent === 'CONFIRM_INVOICE_CREATION') {
            if (text.includes('sim') || text.includes('ok') || text.includes('pode')) {
                // EXECUTAR AÇÃO
                await createInvoiceViaAI(aiContext.tempData.client_id, aiContext.tempData.amount);
                setAiContext({ intent: 'IDLE', tempData: {} });
                return "Feito! Fatura emitida e enviada para a contabilidade.";
            } else {
                setAiContext({ intent: 'IDLE', tempData: {} });
                return "Operação cancelada.";
            }
        }

        return "Não entendi. Vamos recomeçar?";
    };

    // Função auxiliar para a IA criar fatura
    const createInvoiceViaAI = async (clientId: string, amount: number) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Criar Fatura
        const { data: inv, error } = await supabase.from('invoices').insert({
            user_id: user.id,
            client_id: clientId,
            date: new Date().toISOString(),
            due_date: new Date().toISOString(),
            total: amount,
            status: 'draft',
            invoice_number: `FT-${new Date().getFullYear()}/${totalInvoicesCount + 1}`
        }).select().single();

        if (inv) {
            setRealInvoices(prev => [inv, ...prev]);
            setTotalInvoicesCount(prev => prev + 1);
            setCurrentBalance(prev => prev + amount);
            
            // 2. Log
            logAction('IA', `Fatura criada via Jarvis: ${inv.invoice_number}`);
        }
    };

    // ----------------------------------
    // 8. LÓGICA DE ATIVOS (IMOBILIZADO)
    // ----------------------------------
    const handleCreateAsset = async () => {
        if (!newAsset.name || !newAsset.purchase_value) return;
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const payload = {
            ...newAsset,
            user_id: user.id,
            purchase_value: parseFloat(newAsset.purchase_value.toString()),
        };

        let result;
        if (editingAssetId) {
             result = await supabase.from('accounting_assets').update(payload).eq('id', editingAssetId).select();
        } else {
             result = await supabase.from('accounting_assets').insert(payload).select();
        }

        if (result.data) {
            if (editingAssetId) {
                setAssets(prev => prev.map(a => a.id === editingAssetId ? result.data[0] : a));
                logAction('ATIVO', `Ativo atualizado: ${newAsset.name}`);
            } else {
                setAssets(prev => [...prev, result.data[0]]);
                logAction('ATIVO', `Novo ativo registado: ${newAsset.name}`);
            }
            setShowAssetModal(false);
            setEditingAssetId(null);
        } else if (result.error) {
            alert("Erro ao gravar ativo: " + result.error.message);
        }
    };

    const handleDeleteAsset = async (id: string) => {
        if (!confirm('Tem a certeza que deseja abater este ativo?')) return;
        
        const { error } = await supabase.from('accounting_assets').delete().eq('id', id);
        if (!error) {
            setAssets(prev => prev.filter(a => a.id !== id));
            logAction('ATIVO', 'Ativo abatido/removido');
        }
    };

    const handleShowAmortSchedule = (asset: any) => {
        setSelectedAssetForSchedule(asset);
        setShowAmortSchedule(true);
    };

    // Cálculo Financeiro de Amortização
    const calculateAmortizationSchedule = (asset: any) => {
        const schedule = [];
        const purchaseYear = new Date(asset.purchase_date).getFullYear();
        let value = asset.purchase_value;
        const rate = 1 / asset.lifespan_years;
        let accumulated = 0;

        for (let i = 0; i < asset.lifespan_years; i++) {
            let annuity = asset.amortization_method === 'linear' 
                ? asset.purchase_value / asset.lifespan_years 
                : value * (rate * 2); // Simplificação de degressivo

            if (value - annuity < 0) annuity = value; // Ajuste final

            accumulated += annuity;
            const startVal = value;
            value -= annuity;

            schedule.push({
                year: purchaseYear + i,
                startValue: startVal,
                annuity: annuity,
                accumulated: accumulated,
                endValue: value
            });
        }
        return schedule;
    };

    const getCurrentAssetValue = (asset: any) => {
        const schedule = calculateAmortizationSchedule(asset);
        const currentYear = new Date().getFullYear();
        const row = schedule.find(s => s.year === currentYear);
        return row ? row.endValue : (currentYear > schedule[schedule.length-1].year ? 0 : asset.purchase_value);
    };

    // ----------------------------------
    // 9. OUTRAS FUNÇÕES (HELPER)
    // ----------------------------------
    const logAction = async (type: string, desc: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const newLog = { user_id: user.id, action_type: type, description: desc, created_at: new Date().toISOString() };
            // Optistic update
            setActionLogs(prev => [newLog, ...prev]);
            // Async save
            supabase.from('action_logs').insert(newLog).then();
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const getInitials = (name: string) => {
        if (!name) return 'EC';
        const parts = name.split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };
    
    // Funções Placeholder para não quebrar o layout antigo
    const handleGenerateReminder = (inv: any, level: number) => alert(`Lembrete nível ${level} enviado para ${inv.clients?.name}`);
    const handleQuickPreview = (inv: any) => alert(`A visualizar fatura ${inv.invoice_number}`);
    const handleDeleteInvoice = async (id: string) => {
         const { error } = await supabase.from('invoices').delete().eq('id', id);
         if(!error) setRealInvoices(prev => prev.filter(i => i.id !== id));
    };
    const resetInvoiceForm = () => setInvoiceData({ client_id: '', type: 'Fatura', date: new Date().toISOString().split('T')[0], items: [{ description: '', quantity: 1, price: 0, tax: 23 }] });
    const handleAddInvoiceItem = () => setInvoiceData({ ...invoiceData, items: [...invoiceData.items, { description: '', quantity: 1, price: 0, tax: 23 }] });
    const handleRemoveInvoiceItem = (index: number) => setInvoiceData({ ...invoiceData, items: invoiceData.items.filter((_, i) => i !== index) });
    const updateInvoiceItem = (index: number, field: string, value: any) => {
        const newItems = [...invoiceData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setInvoiceData({ ...invoiceData, items: newItems });
    };
    const handleSaveInvoice = async () => {
         // Lógica simplificada de guardar
         const total = invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
         await createInvoiceViaAI(invoiceData.client_id, total);
         setShowInvoiceForm(false);
    };
    const getCurrentCountryVatRates = () => [23, 13, 6, 0]; // Exemplo PT

    return {
        // State
        loadingUser, profileData, isMobileMenuOpen, setIsMobileMenuOpen,
        isProfileDropdownOpen, setIsProfileDropdownOpen, isLangMenuOpen, setIsLangMenuOpen, isDark,
        accountingTab, setAccountingTab, realInvoices, purchases, clients, suppliers, assets,
        journalEntries, companyAccounts, bankStatement, currentBalance, totalInvoicesCount, showFinancials,
        actionLogs, showInvoiceForm, setShowInvoiceForm, showPurchaseForm, setShowPurchaseForm,
        showTransactionModal, setShowTransactionModal, showAssetModal, setShowAssetModal,
        showEntityModal, setShowEntityModal, isProfileModalOpen, setIsProfileModalOpen,
        isDeleteModalOpen, setIsDeleteModalOpen, showAmortSchedule, setShowAmortSchedule,
        invoiceData, setInvoiceData, newAsset, setNewAsset, editingAssetId, setEditingAssetId,
        selectedAssetForSchedule, newPurchase, setNewPurchase, manualTaxMode, setManualTaxMode,
        conversionRate, displaySymbol, companyForm, messages, chatInput, setChatInput, isChatLoading,
        scrollRef,
        
        // Actions
        toggleTheme: () => setIsDark(!isDark),
        selectLanguage: (code: string) => i18n.changeLanguage(code),
        handleLogout, getInitials, handleSendChatMessage,
        
        // Assets
        handleCreateAsset, handleDeleteAsset, handleShowAmortSchedule, calculateAmortizationSchedule, getCurrentAssetValue,

        // Placeholders (Mantendo compatibilidade)
        handleGenerateReminder, handleQuickPreview, handleDeleteInvoice, resetInvoiceForm,
        handleAddInvoiceItem, handleRemoveInvoiceItem, updateInvoiceItem, handleSaveInvoice,
        getCurrentCountryVatRates,
        
        // Settings / Utils
        handleCountryChange: (e: any) => setCompanyForm({...companyForm, country: e.target.value}),
        handleLogoUpload: () => {}, // Implementar upload real
        handleTemplateUpload: () => {},
        handleResetFinancials: () => {},
        handleSaveCompany: () => alert('Configurações guardadas'),
        handleSaveProfile: () => {},
        handleDeleteAccount: () => {},
        copyCode: () => {},
        
        // Entities Stub
        setEditingEntityId: () => {}, setNewEntity: () => {}, setEntityType: () => {}, handleCreateEntity: () => {},
        handleEditEntity: () => {}, handleDeleteEntity: () => {},
    };
};