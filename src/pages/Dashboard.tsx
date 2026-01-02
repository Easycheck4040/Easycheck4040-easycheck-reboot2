import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-900">EasyCheck Dashboard</h1>
        <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Sair</button>
      </nav>
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-4">Bem-vindo! 👋</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="text-gray-500">Faturas este mês</h3>
            <p className="text-3xl font-bold">0 €</p>
          </div>
          {/* Mais cartões virão aqui depois */}
        </div>
      </div>
    </div>
  );
}