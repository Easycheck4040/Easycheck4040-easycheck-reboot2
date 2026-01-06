import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client';
import { 
  LayoutDashboard, MessageSquare, FileText, Users, BarChart3, Settings, LogOut, Menu, X, Building2, Globe, Moon, Sun, ChevronDown, Eye, EyeOff, Shield, Copy, Send
} from 'lucide-react';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ URL DINÂMICA: Ajusta automaticamente entre Local e Render
  const API_URL = window.location.hostname === 'easycheckglobal.com' 
    ? 'https://easycheck4040-easycheck-reboot2.onrender.com' 
    : 'http://localhost:3000';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // --- ESTADOS DO CHAT ---
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Olá! Sou a IA do EasyCheck. Como posso ajudar?' }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserData(user);
      setLoadingUser(false);
    };
    fetchUser();
  }, []);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erro ao conectar ao servidor.' }]);
    } finally {
      setIsChatLoading(true);
      setIsChatLoading(false);
    }
  };

  if (loadingUser) return <div className="h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">Carregando...</div>;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform`}>
        <div className="h-20 flex items-center px-6 border-b dark:border-gray-700 font-bold text-xl dark:text-white">EasyCheck</div>
        <nav className="p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-xl dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><LayoutDashboard size={20}/> Visão Geral</Link>
          <Link to="/dashboard/chat" className="flex items-center gap-3 p-3 rounded-xl bg-blue-600 text-white shadow-lg"><MessageSquare size={20}/> Chat IA</Link>
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 flex flex-col h-screen">
        <header className="h-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center px-8 justify-between">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden dark:text-white"><Menu/></button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">{userData?.email?.substring(0,2).toUpperCase()}</div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden p-4">
          <Routes>
            <Route path="chat" element={
              <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 overflow-hidden shadow-sm">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-white'}`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendChat} className="p-4 border-t dark:border-gray-700 flex gap-2">
                  <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} className="flex-1 p-3 rounded-xl border dark:bg-gray-900 dark:text-white outline-none" placeholder="Escreva aqui..." />
                  <button type="submit" className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"><Send size={20}/></button>
                </form>
              </div>
            } />
            <Route path="/" element={<div className="dark:text-white p-10">Bem-vindo. Escolha o Chat IA para começar.</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}