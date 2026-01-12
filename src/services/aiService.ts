// src/services/aiService.ts

/**
 * IA SIMULADA MULTILÍNGUE (PT, EN, ES, FR, DE, IT)
 * Funciona offline, sem API Keys, deteta a língua automaticamente.
 */

// --- 1. DICIONÁRIO DE INTENÇÕES (CÉREBRO DA IA) ---
const DICTIONARY: any = {
    pt: {
        invoice: ['fatura', 'recibo', 'faturar', 'emitir', 'cobrar'],
        client: ['cliente', 'ficha', 'pessoa', 'comprador'],
        expense: ['despesa', 'gasto', 'compra', 'pagar', 'saída'],
        report: ['relatório', 'balancete', 'contas', 'análise', 'resultados'],
        greetings: ['ola', 'olá', 'boas', 'oi', 'bom dia', 'boa tarde'],
        prepositions: ['para', 'ao', 'a', 'do', 'da'], 
        responses: {
            greet: "Olá! Como posso ajudar o teu negócio hoje?",
            unknown: "Não entendi bem. Tenta 'Criar fatura' ou 'Registar despesa'.",
            invoice_created: "A abrir nova fatura...",
            client_created: "A criar ficha de cliente..."
        }
    },
    en: {
        invoice: ['invoice', 'bill', 'receipt', 'charge', 'create'],
        client: ['client', 'customer', 'user'],
        expense: ['expense', 'cost', 'spending', 'payment', 'bought'],
        report: ['report', 'balance', 'sheet', 'analysis', 'profit'],
        greetings: ['hello', 'hi', 'hey', 'good morning'],
        prepositions: ['for', 'to'],
        responses: {
            greet: "Hello! How can I help your business today?",
            unknown: "I didn't catch that. Try 'Create invoice' or 'Add expense'.",
            invoice_created: "Opening new invoice...",
            client_created: "Creating client profile..."
        }
    },
    es: {
        invoice: ['factura', 'recibo', 'cobrar', 'cuenta'],
        client: ['cliente', 'comprador', 'usuario'],
        expense: ['gasto', 'compra', 'pagar', 'salida', 'costo'],
        report: ['informe', 'reporte', 'balance', 'cuentas'],
        greetings: ['hola', 'buenos dias', 'buenas'],
        prepositions: ['para', 'a'],
        responses: {
            greet: "¡Hola! ¿Cómo puedo ayudar a tu negocio hoy?",
            unknown: "No entendí bien. Intenta 'Crear factura' o 'Registrar gasto'.",
            invoice_created: "Abriendo nueva factura...",
            client_created: "Creando perfil de cliente..."
        }
    },
    fr: {
        invoice: ['facture', 'recu', 'addition', 'facturer', 'créer'],
        client: ['client', 'acheteur', 'utilisateur'],
        expense: ['depense', 'dépense', 'cout', 'achat', 'payer'],
        report: ['rapport', 'bilan', 'compte', 'analyse'],
        greetings: ['bonjour', 'salut', 'coucou', 'bonsoir'],
        prepositions: ['pour', 'a', 'à'],
        responses: {
            greet: "Bonjour ! Comment puis-je aider votre entreprise ?",
            unknown: "Je n'ai pas bien compris. Essayez 'Créer facture' ou 'Ajouter dépense'.",
            invoice_created: "Ouverture de la nouvelle facture...",
            client_created: "Création du profil client..."
        }
    },
    de: { // Alemão
        invoice: ['rechnung', 'beleg', 'erstellen'],
        client: ['kunde', 'klient', 'käufer'],
        expense: ['ausgabe', 'kosten', 'kauf', 'bezahlen'],
        report: ['bericht', 'bilanz', 'analyse'],
        greetings: ['hallo', 'guten tag', 'morgen', 'hi'],
        prepositions: ['für', 'an'],
        responses: {
            greet: "Hallo! Wie kann ich Ihrem Unternehmen heute helfen?",
            unknown: "Ich habe das nicht verstanden. Versuchen Sie 'Rechnung erstellen'.",
            invoice_created: "Neue Rechnung wird geöffnet...",
            client_created: "Kundenprofil wird erstellt..."
        }
    },
    it: { // Italiano
        invoice: ['fattura', 'ricevuta', 'conto', 'creare'],
        client: ['cliente', 'acquirente', 'utente'],
        expense: ['spesa', 'costo', 'pagamento', 'acquisto'],
        report: ['rapporto', 'bilancio', 'analisi', 'report'],
        greetings: ['ciao', 'buongiorno', 'salve'],
        prepositions: ['per', 'a'],
        responses: {
            greet: "Ciao! Come posso aiutare la tua azienda oggi?",
            unknown: "Non ho capito bene. Prova 'Crea fattura' o 'Registra spesa'.",
            invoice_created: "Apertura nuova fattura...",
            client_created: "Creazione profilo cliente..."
        }
    }
};

// --- HELPER: Detetar Língua Baseado no Texto ---
const detectLanguage = (text: string) => {
    const words = text.toLowerCase().split(' ');
    // Pontuação para cada língua
    let scores: any = { pt: 0, en: 0, es: 0, fr: 0, de: 0, it: 0 };

    words.forEach(word => {
        Object.keys(DICTIONARY).forEach(lang => {
            const allWords = [
                ...DICTIONARY[lang].invoice,
                ...DICTIONARY[lang].client,
                ...DICTIONARY[lang].expense,
                ...DICTIONARY[lang].report,
                ...DICTIONARY[lang].greetings
            ];
            // Correspondência parcial (ex: "faturar" bate com "fatura")
            if (allWords.some(w => word.includes(w))) scores[lang]++;
        });
    });

    // Retorna a língua com maior pontuação, ou 'en' (inglês) por defeito se empate
    const winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    return scores[winner] > 0 ? winner : 'en'; // Se ninguém pontuar, usa inglês
};

export const askGrok = async (userMessage: string, contextData: any) => {
    
    // 1. Simular pensamento (delay aleatório para parecer real)
    const delay = Math.floor(Math.random() * 800) + 400;
    await new Promise(resolve => setTimeout(resolve, delay));

    const text = userMessage.toLowerCase().trim();
    const cleanText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos

    // 2. Detetar a língua
    const langCode = detectLanguage(cleanText); 
    const dict = DICTIONARY[langCode];

    console.log(`🌍 Língua detetada: ${langCode.toUpperCase()}`); // Debug na consola

    // --- AÇÕES ---

    // A. CUMPRIMENTOS
    if (dict.greetings.some((w: string) => cleanText.includes(w))) {
        return { action: "chat", reply: dict.responses.greet };
    }

    // B. FATURAS (INVOICES)
    // Verifica se alguma palavra-chave de fatura está na frase
    if (dict.invoice.some((w: string) => cleanText.includes(w))) {
        
        // 1. Extrair Valor (ex: 50, 50.00, 50,00)
        const amountMatch = text.match(/(\d+([.,]\d{1,2})?)/);
        let amount = amountMatch ? parseFloat(amountMatch[0].replace(',', '.')) : 0;

        // 2. Extrair Cliente (Da Base de Dados)
        let foundClient = null;
        if (contextData && contextData.clients) {
            foundClient = contextData.clients.find((c: any) => 
                text.includes(c.name.toLowerCase())
            );
        }

        // 3. Extrair Nome Desconhecido (após preposição: "para", "for", "für")
        let extractedName = "";
        if (!foundClient) {
            // Cria regex dinâmica baseada nas preposições da língua
            const prepString = dict.prepositions.join('|');
            const regex = new RegExp(`(?:${prepString})\\s+(?:o|a|the|el|la|le|la|der|die|das\\s+)?([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+)`, 'i');
            
            const nameMatch = text.match(regex);
            if (nameMatch && nameMatch[1]) {
                extractedName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
            }
        }

        // Resposta
        if (foundClient) {
            return {
                action: "create_invoice",
                client_name: foundClient.name,
                client_id: foundClient.id,
                amount: amount
            };
        } else if (extractedName) {
            return {
                action: "create_invoice", // Dashboard deve lidar com criação de cliente on-the-fly
                client_name: extractedName,
                client_id: null,
                amount: amount
            };
        } else {
            return {
                action: "create_invoice",
                client_name: "",
                client_id: null,
                amount: amount
            };
        }
    }

    // C. CLIENTES (CLIENTS)
    if (dict.client.some((w: string) => cleanText.includes(w))) {
        return {
            action: "create_client",
            client_name: "Novo Cliente"
        };
    }

    // D. DESPESAS (EXPENSES)
    if (dict.expense.some((w: string) => cleanText.includes(w))) {
        return { action: "create_expense" };
    }

    // E. RELATÓRIOS (REPORTS)
    if (dict.report.some((w: string) => cleanText.includes(w))) {
        const type = cleanText.includes('resultados') || cleanText.includes('profit') ? 'dre' : 'balancete';
        return { action: "view_report", type: type };
    }

    // F. FALLBACK (NÃO ENTENDEU)
    return {
        action: "chat",
        reply: dict.responses.unknown
    };
};