import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Para traduzir
import { supabase } from '../supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      {/* Botão de Voltar */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Voltar
      </Link>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">👋</div>
          <h2 className="text-2xl font-bold text-gray-900">{t('login.title')}</h2>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('login.email')}</label>
            <input
              type="email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">{t('login.password')}</label>
              <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
                {t('login.forgot')}
              </Link>
            </div>
            <input
              type="password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? '...' : t('login.button')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          {t('login.noAccount')} {' '}
          <Link to="/onboard" className="font-bold text-blue-600 hover:underline">
            {t('login.register')}
          </Link>
        </div>
      </div>
    </div>
  );
}