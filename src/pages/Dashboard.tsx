import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client';
import { 
  LayoutDashboard, MessageSquare, FileText, Users, BarChart3, Settings, LogOut, Menu, X, Bell, Mail, User, Trash2, AlertTriangle, Building2, Globe, Moon, Sun, ChevronDown, Eye, EyeOff, Pencil, UserMinus, Shield, Copy, Send
} from 'lucide-react';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- CONFIGURAÇÃO DE AMBIENTE ---
  const API_URL = window.location.hostname === 'easycheckglobal.com' 
    ? 'https://easycheck4040-easycheck-reboot2.onrender.com' 
    : 'http://localhost:3000';

  // --- ESTADOS GERAIS ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // --- ESTADOS DO CHAT IA (A única adição de lógica) ---
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou a IA do EasyCheck. Como posso ajudar?' }
  ]);
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

  // --- FUNÇÃO DO CHAT ---
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erro ao ligar ao servidor de IA.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  if (loadingUser) return <div className="p-10">Carregando...</div>;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      {/* SIDEBAR ORIGINAL */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b dark:border-gray-700">
          <span className="font-bold text-xl dark:text-white">EasyCheck</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"><LayoutDashboard size={20}/> Visão Geral</Link>
          <Link to="/dashboard/chat" className="flex items-center gap-3 p-3 rounded-lg bg-blue-600 text-white shadow-md"><MessageSquare size={20}/> Chat IA</Link>
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-500 w-full"><LogOut size={20}/> Sair</button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER ORIGINAL */}
        <header className="h-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-8">
          <h2 className="text-xl font-bold dark:text-white">Assistente IA</h2>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {userData?.email?.substring(0,2).toUpperCase()}
          </div>
        </header>

        {/* ÁREA DE CONTEÚDO COM O CHAT IA */}
        <div className="flex-1 overflow-hidden p-6">
          <Routes>
            <Route path="chat" element={
              <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 overflow-hidden shadow-sm">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-white'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && <div className="text-gray-400 text-sm animate-pulse">EasyCheck está a escrever...</div>}
                </div>

                <form onSubmit={handleSendChatMessage} className="p-4 border-t dark:border-gray-700 flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Escreva a sua dúvida..."
                    className="flex-1 p-3 border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="submit" disabled={isChatLoading} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors">
                    <Send size={20}/>
                  </button>
                </form>
              </div>
            } />
            <Route path="/" element={<div className="dark:text-white text-center py-20">Bem-vindo ao Dashboard. Clique em Chat IA para começar.</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}