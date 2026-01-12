// src/services/aiService.ts

// ✅ O TEU LINK DO RENDER (Já configurado)
const RENDER_URL = "https://easycheck-api.onrender.com";

// Seleciona automaticamente: Localhost (se estiveres no PC) ou Render (se estiveres na net)
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : RENDER_URL;

export const askGrok = async (userMessage: string, contextData: any) => {
  try {
    console.log(`📡 A contactar o servidor: ${API_URL}/api/chat`);

    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: userMessage, 
        contextData: contextData 
      })
    });

    if (!response.ok) {
        // Tenta ler a mensagem de erro do servidor
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    return await response.json();

  } catch (error) {
    console.error("❌ Falha na conexão:", error);
    return { action: "chat", reply: "Erro de conexão com o servidor. Verifica se o Backend no Render está ativo." };
  }
};