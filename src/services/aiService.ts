// src/services/aiService.ts

/**
 * SERVIÇO DE IA HÍBRIDO (REAL + FALLBACK OFFLINE)
 * 1. Tenta falar com o Backend (Groq Real).
 * 2. Se falhar, usa o motor de regras interno (Simulação Multilíngue).
 */

// URL da tua API (Define VITE_API_URL no .env ou usa o localhost)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ==================================================================================
// PARTE 1: O MOTOR DE SIMULAÇÃO (CÉREBRO DE EMERGÊNCIA 🧠)
// ==================================================================================

const DICTIONARY: any = {
    pt: {
        invoice: ['fatura', 'recibo', 'faturar', 'emitir', 'cobrar'],
        client: ['cliente', 'ficha', 'pessoa', 'comprador'],
        expense: ['despesa', 'gasto', 'compra', 'pagar', 'saída'],
        report: ['relatório', 'balancete', 'contas', 'análise', 'resultados'],
        greetings: ['ola', 'olá', 'boas', 'oi', 'bom dia'],
        prepositions: ['para', 'ao', 'a', 'do', 'da'], 
        responses: {
            greet: "Olá! Como posso ajudar o teu negócio hoje?",
            unknown: "Modo Offline: Não entendi. Tenta 'Criar fatura' ou 'Registar despesa'."
        }
    },
    en: {
        invoice: ['invoice', 'bill', 'receipt', 'charge', 'create'],
        client: ['client', 'customer', 'user'],
        expense: ['expense', 'cost', 'spending', 'payment'],
        report: ['report', 'balance', 'sheet', 'analysis'],
        greetings: ['hello', 'hi', 'hey', 'good morning'],
        prepositions: ['for', 'to'],
        responses: {
            greet: "Hello! How can I help your business today?",
            unknown: "Offline Mode: I didn't catch that. Try 'Create invoice' or 'Add expense'."
        }
    },
    // ... (Podes adicionar ES, FR, DE, IT aqui se quiseres expandir o fallback)
    es: {
        invoice: ['factura', 'recibo', 'cobrar'],
        client: ['cliente', 'usuario'],
        expense: ['gasto', 'compra', 'pagar'],
        report: ['informe', 'reporte', 'balance'],
        greetings: ['hola', 'buenas'],
        prepositions: ['para', 'a'],
        responses: {
            greet: "¡Hola! ¿Cómo puedo ayudar?",
            unknown: "Modo Offline: Intenta 'Crear factura'."
        }
    }
};

const detectLanguage = (text: string) => {
    const words = text.toLowerCase().split(' ');
    let scores: any = { pt: 0, en: 0, es: 0 };

    words.forEach(word => {
        Object.keys(scores).forEach(lang => {
            const d = DICTIONARY[lang];
            const allWords = [...d.invoice, ...d.client, ...d.expense, ...d.report, ...d.greetings];
            if (allWords.some(w => word.includes(w))) scores[lang]++;
        });
    });
    
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b, 'en');
};

const runSimulation = (userMessage: string, contextData: any) => {
    console.warn("⚠️ A usar Modo de Simulação (Fallback)");
    
    const text = userMessage.toLowerCase().trim();
    const cleanText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const lang = detectLanguage(cleanText);
    const dict = DICTIONARY[lang] || DICTIONARY.en;

    // Ações Simuladas
    if (dict.greetings.some((w: string) => cleanText.includes(w))) 
        return { action: "chat", reply: dict.responses.greet };

    if (dict.invoice.some((w: string) => cleanText.includes(w))) {
        const amountMatch = text.match(/(\d+([.,]\d{1,2})?)/);
        const amount = amountMatch ? parseFloat(amountMatch[0].replace(',', '.')) : 0;
        
        let foundClient = contextData?.clients?.find((c: any) => text.includes(c.name.toLowerCase()));
        
        return {
            action: "create_invoice",
            client_name: foundClient ? foundClient.name : "",
            client_id: foundClient ? foundClient.id : null,
            amount: amount
        };
    }

    if (dict.client.some((w: string) => cleanText.includes(w))) return { action: "create_client", client_name: "Novo Cliente" };
    if (dict.expense.some((w: string) => cleanText.includes(w))) return { action: "create_expense" };
    if (dict.report.some((w: string) => cleanText.includes(w))) return { action: "view_report", type: "balancete" };

    return { action: "chat", reply: dict.responses.unknown };
};

// ==================================================================================
// PARTE 2: A FUNÇÃO PRINCIPAL (HÍBRIDA) 🚀
// ==================================================================================

export const askGrok = async (userMessage: string, contextData: any) => {
  
  // TENTATIVA 1: Usar a IA Real (Backend)
  try {
    console.log("📡 A contactar o Cérebro IA no servidor...");
    
    // Define um timeout de 5 segundos. Se o servidor demorar mais, desistimos e usamos a simulação.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_URL}/api/ask-ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage, contextData }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    // TENTATIVA 2: Falhou? Usar a Simulação (Offline/Fallback)
    console.error("❌ Falha na IA Real. A ativar modo offline:", error);
    
    // Pequeno delay para o utilizador não sentir a transição brusca
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return runSimulation(userMessage, contextData);
  }
};