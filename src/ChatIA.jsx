import React, { useState } from 'react';

const ChatIA = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou a IA do EasyCheck. Como posso ajudar a sua empresa hoje?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Ligação ao teu Backend na porta 3000
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erro ao ligar ao servidor. Verifica se o backend está ligado!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i} style={msg.role === 'user' ? styles.userRow : styles.aiRow}>
            <div style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && <div style={styles.loading}>A pensar...</div>}
      </div>
      
      <form onSubmit={sendMessage} style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte algo ao EasyCheck..."
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={isLoading}>
          Enviar
        </button>
      </form>
    </div>
  );
};

// Estilos rápidos para teste
const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '400px', width: '100%', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' },
  chatBox: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  userRow: { alignSelf: 'flex-end', maxWidth: '80%' },
  aiRow: { alignSelf: 'flex-start', maxWidth: '80%' },
  userBubble: { background: '#007bff', color: '#fff', padding: '10px', borderRadius: '15px 15px 0 15px' },
  aiBubble: { background: '#f1f1f1', color: '#333', padding: '10px', borderRadius: '15px 15px 15px 0' },
  inputArea: { display: 'flex', padding: '10px', borderTop: '1px solid #ddd' },
  input: { flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' },
  button: { marginLeft: '10px', padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  loading: { fontSize: '12px', color: '#888', fontStyle: 'italic' }
};

export default ChatIA;