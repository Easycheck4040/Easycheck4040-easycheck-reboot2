import React, { useState } from 'react';

export default function TestChat() {
  const [msg, setMsg] = useState('');
  const [res, setRes] = useState('');
  const [loading, setLoading] = useState(false);

  // URL da tua API (Local para já, depois mudamos para o Render)
  const API_URL = "http://localhost:3000/api/chat";

  const testConnection = async () => {
    if (!msg) return;
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await response.json();
      setRes(data.reply || "Erro: Resposta vazia");
    } catch (err) {
      setRes("Erro de conexão: Garante que o servidor na porta 3000 está ligado!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h2>🧪 Laboratório de Teste IA</h2>
      <input 
        type="text" 
        value={msg} 
        onChange={(e) => setMsg(e.target.value)} 
        placeholder="Escreve algo para a Groq..."
        style={{ padding: '10px', width: '300px' }}
      />
      <button onClick={testConnection} disabled={loading} style={{ padding: '10px', marginLeft: '10px' }}>
        {loading ? "A processar..." : "Enviar para Groq"}
      </button>
      
      <div style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <strong>Resposta da IA:</strong>
        <p>{res}</p>
      </div>
    </div>
  );
}