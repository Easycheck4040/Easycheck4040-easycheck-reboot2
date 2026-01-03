import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false); // Controla se é login ou registo
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Vê se a URL diz "?mode=signup" para abrir logo no registo
  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setIsSignUp(true);
    }
  }, [searchParams]);

  const handleAuth = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        // MODO REGISTO
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Conta criada! Verifica o teu email.");
      } else {
        // MODO LOGIN
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isSignUp ? t('auth.createTitle') : t('login.title')}
          </h2>
          <p className="text-gray-500 mt-2">
            {isSignUp ? t('auth.createSubtitle') : t('auth.loginSubtitle')}
          </p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('login.email')}</label>
            <input
              type="email"
              required
              className="w-full p-3 border rounded-lg dark:bg-gray-900 dark:text-white dark:border-gray-600"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('login.password')}</label>
            <input
              type="password"
              required
              className="w-full p-3 border rounded-lg dark:bg-gray-900 dark:text-white dark:border-gray-600"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-all">
            {loading ? '...' : (isSignUp ? t('nav.signup') : t('login.button'))}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {isSignUp ? t('auth.haveAccount') : t('login.noAccount')}
          </button>
        </div>
      </div>
    </div>
  );
}