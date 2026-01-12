// src/services/aiService.ts

// LÓGICA DE SELEÇÃO AUTOMÁTICA DE URL (Como no relatório)
// Se estiveres no teu PC, usa localhost:3000.
// Se estiveres na net, usa o teu URL do Koyeb/Render.
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://prepared-roby-easycheck-e49dd2b0.koyeb.app'; // <--- CONFIRMA SE ESTE É O TEU LINK KOYEB

export const askGrok = async (userMessage: string, contextData: any) => {
  try {
    // Preparar o contexto (Empresa, Moeda, etc)
    const contextMessage = `[Data: ${new Date().toLocaleDateString()}] ${userMessage}`;

    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: contextMessage, // Envia como "message" conforme o backend espera
        contextData: contextData // Envia dados extra se necessário
      })
    });

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Erro de conexão:", error);
    // Fallback simples se falhar
    return { action: "chat", reply: "Não consegui contactar o servidor. Verifica a conexão." };
  }
};