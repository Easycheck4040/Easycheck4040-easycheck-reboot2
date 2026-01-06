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

  // --- ESTADOS DE CHAT IA ---
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou a IA do EasyCheck. Como posso ajudar a sua empresa hoje?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef(null);

  // --- ESTADOS DE PRIVACIDADE & MODAIS ---
  const [showFinancials, setShowFinancials] = useState(true); 
  const [showModalCode, setShowModalCode] = useState(false);
  const [showPageCode, setShowPageCode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Auto-scroll do chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) setIsDark(true);
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserData(user);
      setLoadingUser(false);
    };
    fetchUser();
  }, []);

  // --- FUNÇÃO DE ENVIO PARA A IA ---
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

  const toggleTheme = () => { document.documentElement.classList.toggle('dark'); setIsDark(!isDark); };
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  if (loadingUser) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">Iniciando Dashboard...</div>;
  const isOwner = userData?.user_metadata?.role === 'owner';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      
      {/* SIDEBAR ORIGINAL */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform transition-transform duration-200 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b dark:border-gray-700">
          <Link to="/" className="flex items-center gap-3"><img src="/logopequena.PNG" className="h-8 w-auto"/><span className="font-bold text-xl dark:text-white uppercase tracking-tight">EasyCheck</span></Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><LayoutDashboard size={20}/> {t('dashboard.menu.overview')}</Link>
          <Link to="/dashboard/chat" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white shadow-lg"><MessageSquare size={20}/> {t('dashboard.menu.chat')}</Link>
          {/* Outros itens do menu... */}
        </nav>
        <div className="p-4 border-t dark:border-gray-700">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
            <LogOut size={20} /> {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between px-8 items-center z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600 dark:text-white"><Menu /></button>
            <h2 className="text-xl font-bold dark:text-white">EasyCheck IA</h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-gray-500">{isDark ? <Sun size={20}/> : <Moon size={20}/>}</button>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
              {userData?.user_metadata?.full_name?.substring(0, 2).toUpperCase() || 'EC'}
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTEÚDO */}
        <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="chat" element={
              <div className="flex flex-col h-full m-4 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 overflow-hidden">
                {/* Janela de Mensagens */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-gray-100 dark:bg-gray-700 dark:text-white rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-700 px-5 py-3 rounded-2xl animate-pulse text-xs dark:text-gray-300">
                        EasyCheck está a pensar...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input de Texto */}
                <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                  <form onSubmit={handleSendChatMessage} className="flex gap-2 relative">
                    <input 
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Escreva a sua dúvida sobre gestão ou contabilidade..."
                      className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all pr-14"
                    />
                    <button 
                      type="submit" 
                      disabled={isChatLoading || !chatInput.trim()}
                      className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center shadow-lg shadow-blue-500/30"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </div>
            } />
            
            {/* Outras rotas permanecem iguais */}
            <Route path="/" element={<div className="p-10 dark:text-white">Bem-vindo. Seleciona o Chat IA na barra lateral.</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}