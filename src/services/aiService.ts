import Groq from "groq-sdk";

// ⚠️ VAI AO SITE DA GROQ, CRIA UMA CHAVE E COLA AQUI:
// O Vite expõe variáveis de ambiente através de import.meta.env
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ""; 

if (!GROQ_API_KEY) {
  console.error("ERRO: API Key da Groq não encontrada. Verifica o ficheiro .env");
}

const groq = new Groq({ 
    apiKey: GROQ_API_KEY, 
    dangerouslyAllowBrowser: true // Permite correr no browser (frontend)
});

export const askGrok = async (userMessage: string, contextData: any) => {
  // Prepara a lista de clientes para a IA saber quem existe
  const clientsList = contextData.clients.map((c: any) => `ID:${c.id} - Nome:${c.name}`).join(", ");

  const systemPrompt = `
    Tu és um assistente de ERP experiente.
    O teu trabalho é EXCLUSIVAMENTE extrair dados do pedido do utilizador e retornar um JSON.
    NÃO retornes texto de conversação, APENAS o bloco JSON.

    DADOS DO SISTEMA:
    - Clientes Disponíveis: [${clientsList}]
    - Data de Hoje: ${new Date().toLocaleDateString()}

    POSSÍVEIS AÇÕES (Retorna estritamente este formato JSON):
    1. Criar Fatura:
       { "action": "create_invoice", "client_name": "Nome detetado", "amount": 100.50, "client_id": "ID_SE_EXISTIR_NA_LISTA_ACIMA_SENAO_NULL" }
    
    2. Criar Cliente (Se o utilizador pedir fatura para alguém que não está na lista acima):
       { "action": "create_client", "client_name": "Nome detetado" }
    
    3. Registar Despesa:
       { "action": "create_expense" }
    
    4. Relatórios:
       { "action": "view_report", "type": "balancete" }
    
    5. Conversa Geral (Se não for comando):
       { "action": "chat", "reply": "A tua resposta simpática aqui em PT-PT" }

    EXEMPLO 1:
    User: "Fatura de 50€ para o Rui" (Rui não existe na lista) 
    JSON: { "action": "create_client", "client_name": "Rui" }

    EXEMPLO 2:
    User: "Fatura de 50€ para a Tesla" (Tesla existe com ID 123) 
    JSON: { "action": "create_invoice", "client_name": "Tesla", "amount": 50, "client_id": "123" }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "llama-3.3-70b-versatile", // Modelo rápido e inteligente
      temperature: 0, // Temperatura 0 para ser mais preciso/matemático
      response_format: { type: "json_object" } // Força a resposta em JSON
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "{}";
    return JSON.parse(responseContent);

  } catch (error) {
    console.error("Erro na Groq:", error);
    return { action: "chat", reply: "Estou com dificuldades técnicas. Tenta de novo." };
  }
};