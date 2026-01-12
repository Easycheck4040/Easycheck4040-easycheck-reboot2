// src/services/aiService.ts

// 1. URL SEM BARRA NO FIM
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000' // Usa 8000 para bater certo com o server
  : 'https://prepared-roby-easycheck-e49dd2b0.koyeb.app'; // O teu link Koyeb

export const askGrok = async (userMessage: string, contextData: any) => {
  try {
    // 2. CHAMADA PARA /api/chat (Igual ao server.js)
    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // 3. ESTRUTURA DO BODY (message + contextData)
      body: JSON.stringify({ 
        message: userMessage, 
        contextData: contextData 
      })
    });

    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    
    return await response.json();

  } catch (error) {
    console.error("Erro Fetch:", error);
    // Fallback simpático
    return { action: "chat", reply: "Erro de conexão. Tenta novamente." };
  }
};