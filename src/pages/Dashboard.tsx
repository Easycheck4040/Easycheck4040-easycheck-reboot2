import { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Mail,
  User,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Estados para controlar Menus e Modais
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Função de Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Função de Eliminar Conta (Simulada com segurança)
  const handleDeleteAccount = async () => {
    if (deleteConfirmation === 'ELIMINAR') {
      // Aqui entraria a lógica real de apagar no Supabase
      alert("A tua conta foi agendada para eliminação. Adeus!");
      await supabase.auth.signOut();
      navigate('/');
    } else {
      alert("Por favor escreve ELIMINAR para confirmar.");
    }
  };

  // Itens do Menu (Agora com Comunicação)
  const menuItems = [
    { icon: LayoutDashboard, label: 'Visão Geral', path: '/dashboard' },
    { icon: MessageSquare, label: 'Chat IA', path: '/dashboard/chat' },
    { icon: FileText, label: 'Contabilidade', path: '/dashboard/accounting' },
    { icon: Mail, label: 'Comunicação', path: '/dashboard/communication' }, // <--- NOVO
    { icon: Users, label: 'Recursos Humanos', path: '/dashboard/hr' },
    { icon: BarChart3, label: 'Marketing', path: '/dashboard/marketing' },
    { icon: Settings, label: 'Definições', path: '/dashboard/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* --- 1. SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          
          {/* LOGO DO UTILIZADOR */}
          <div className="h-20 flex items-center px-6 border-b dark:border-gray-700">
            <Link to="/" className="flex items-center gap-2 group">
              {/* Usa a imagem logopequena.PNG que tens na pasta public */}
              <img 
                src="/logopequena.PNG" 
                alt="EasyCheck Logo" 
                className="h-10 w-auto object-contain" 
              />
              <span className="font-bold text-xl text-gray-900 dark:text-white ml-2">EasyCheck</span>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t dark:border-gray-700">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sair da Conta
            </button>
          </div>
        </div>
      </aside>

      {/* --- 2. ÁREA PRINCIPAL --- */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-4 sm:px-8 shadow-sm z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            
            {/* NOTIFICAÇÕES (Dropdown) */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              </button>
              
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 p-4 z-50">
                  <h3 className="font-bold mb-2 dark:text-white">Notificações</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3 text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                      <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full shrink-0"></div>
                      <p className="text-gray-600 dark:text-gray-300">A tua fatura #1023 foi paga.</p>
                    </div>
                    <div className="flex gap-3 text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                      <div className="w-2 h-2 mt-1.5 bg-green-500 rounded-full shrink-0"></div>
                      <p className="text-gray-600 dark:text-gray-300">Novo relatório de IA pronto.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PERFIL (Dropdown com Iniciais) */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:opacity-90 transition-opacity"
              >
                EC {/* Iniciais "Easy Check" ou do Utilizador */}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Admin EasyCheck</p>
                    <p className="text-xs text-gray-500">admin@easycheck.com</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" /> O meu Perfil
                  </button>
                  <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar Conta
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* --- MODAL DE ELIMINAR CONTA (Segurança) --- */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border dark:border-gray-700">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <AlertTriangle className="w-8 h-8" />
                <h3 className="text-xl font-bold">Zona de Perigo</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Estás prestes a apagar a tua conta e todos os dados permanentemente. Esta ação <strong>não pode ser desfeita</strong>.
              </p>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                Para confirmar, escreve <span className="font-bold select-all">ELIMINAR</span> abaixo:
              </label>
              <input 
                type="text" 
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Escreve ELIMINAR"
                className="w-full p-3 border rounded-lg mb-6 dark:bg-gray-900 dark:text-white dark:border-gray-600 uppercase"
              />
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== 'ELIMINAR'}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apagar Tudo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTEÚDO DAS PÁGINAS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Receita Mensal</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">€0,00</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Ações da IA (Hoje)</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Faturas por Enviar</h3>
                    <p className="text-3xl font-bold text-orange-500 mt-2">0</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-8 text-center">
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">Bem-vindo ao EasyCheck! 👋</h3>
                  <p className="text-blue-600 dark:text-blue-400 mb-6">O teu assistente IA está pronto a trabalhar. Experimenta o Chat!</p>
                  <Link to="/dashboard/chat" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg">
                    <MessageSquare className="w-5 h-5" />
                    Abrir Chat IA
                  </Link>
                </div>
              </div>
            } />
            <Route path="chat" element={<div className="h-full flex items-center justify-center text-gray-400">O Chat IA vai aparecer aqui em breve... 🤖</div>} />
            <Route path="communication" element={<div className="h-full flex items-center justify-center text-gray-400">Emails e Comunicações aqui... ✉️</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}