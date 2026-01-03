import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Estado para controlar se é Login ou Criar Conta
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Verifica se o link trazia "?mode=signup" para abrir logo no registo
  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setIsSignUp(true);
    }
  }, [searchParams]);

  const handleAuth = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      if (!isSignUp) {
        navigate('/dashboard');
      } else {
        alert("Conta criada com sucesso! Por favor verifica o teu email.");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        
        {/* Título que muda conforme o modo */}
        <h2 className="text-3xl font-bold text-center mb-2 dark:text-white">
          {isSignUp ? t('auth.createTitle') : t('login.title')}
        </h2>
        
        <form onSubmit={handleAuth} className="space-y-4 mt-8">
          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              {t('login.email')}
            </label>
            <input 
              type="email" 
              required 
              className="w-full p-3 border rounded-lg dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          
          {/* Campo Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium dark:text-gray-300">
                {t('login.password')}
              </label>
              
              {/* CORREÇÃO AQUI: Botão que mostra alerta em vez de mudar de página */}
              {!isSignUp && (
                <button 
                  type="button"
                  onClick={() => alert("A recuperação automática estará disponível em breve. Por favor contacte o suporte.")}
                  className="text-sm text-blue-600 hover:underline bg-transparent border-none cursor-pointer"
                >
                  {t('login.forgot')}
                </button>
              )}
            </div>
            <input 
              type="password" 
              required 
              className="w-full p-3 border rounded-lg dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          {/* Botão Principal (Entrar ou Criar Conta) */}
          <button 
            disabled={loading} 
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? '...' : (isSignUp ? t('nav.signup') : t('login.button'))}
          </button>
        </form>

        {/* Link para alternar entre Login e Registo */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-blue-600 hover:underline text-sm font-medium bg-transparent border-none cursor-pointer"
          >
            {isSignUp ? t('auth.haveAccount') : t('login.noAccount')}
          </button>
        </div>
      </div>
    </div>
  );
}s