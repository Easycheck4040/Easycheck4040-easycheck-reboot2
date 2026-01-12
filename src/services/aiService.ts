import Groq from "groq-sdk";

// --- INICIO DO TESTE DE DEBUG ---
const ENV_KEY = import.meta.env.VITE_GROQ_API_KEY;
console.log("========================================");
console.log("🔍 O QUE O CÓDIGO ESTÁ A LER:");
console.log("CHAVE:", ENV_KEY);
console.log("TIPO:", typeof ENV_KEY);
console.log("========================================");
// --- FIM DO TESTE DE DEBUG ---

// ... o resto do código continua aqui ...
// src/services/aiService.ts
const key = import.meta.env.VITE_GROQ_API_KEY;
console.log("TESTE DA CHAVE:", key); // Isto vai aparecer na Consola do Chrome
// 1. Validar a Chave
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

if (!GROQ_API_KEY) {
  console.error("❌ ERRO CRÍTICO: Chave API não encontrada no .env");
}

export const askGrok = async (userMessage: string, contextData: any) => {
  // 2. Preparar a lista de clientes
  const clientsList = contextData.clients.map((c: any) => `ID:${c.id} - Nome:${c.name}`).join(", ");

  // 3. O Prompt do Sistema (Cérebro)
  const systemPrompt = `
    Tu és um assistente de ERP (Software de Gestão).
    O teu trabalho é analisar o pedido do utilizador e responder APENAS com um JSON.
    NÃO escrevas texto introdutório. APENAS o bloco JSON.

    DADOS ATUAIS:
    - Clientes: [${clientsList}]
    - Data: ${new Date().toLocaleDateString()}

    AÇÕES POSSÍVEIS (Usa exatamente este formato):
    1. Para Faturas: { "action": "create_invoice", "client_name": "Nome", "amount": 100.50, "client_id": "ID_OU_NULL" }
    2. Para Criar Cliente: { "action": "create_client", "client_name": "Nome" }
    3. Para Despesas: { "action": "create_expense" }
    4. Para Relatórios: { "action": "view_report", "type": "balancete" }
    5. Conversa: { "action": "chat", "reply": "A tua resposta em PT" }
  `;

  try {
    // 4. Pedido Direto à API (Sem SDK)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        model: "llama-3.3-70b-versatile", // Modelo inteligente e rápido
        temperature: 0,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("🔥 Erro da API Groq:", errorData);
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    // 5. Limpeza e Parse do JSON
    // Às vezes a IA manda o json dentro de blocos de código markdown, vamos limpar
    const jsonString = content.replace(/```json|```/g, '').trim();
    
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("❌ FALHA NO SERVIÇO DE IA:", error);
    // Retornar um fallback para o chat não "morrer"
    return { 
      action: "chat", 
      reply: "Desculpa, tive um erro de conexão. Podes verificar a consola (F12) para ver o detalhe?" 
    };
  }
};