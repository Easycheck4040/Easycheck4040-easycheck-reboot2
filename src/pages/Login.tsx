import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') setIsSignUp(true);
  }, [searchParams]);

  const handleAuth = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!isSignUp) navigate('/dashboard');
      else alert("Conta criada! Verifica o email.");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-2 dark:text-white">
          {isSignUp ? t('auth.createTitle') : t('login.title')}
        </h2>
        
        <form onSubmit={handleAuth} className="space-y-4 mt-8">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t('login.email')}</label>
            <input type="email" required className="w-full p-3 border rounded-lg dark:bg-gray-900 dark:text-white" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium dark:text-gray-300">{t('login.password')}</label>
              {/* LINK RECUPERADO AQUI */}
              {!isSignUp && (
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  {t('login.forgot')}
                </Link>
              )}
            </div>
            <input type="password" required className="w-full p-3 border rounded-lg dark:bg-gray-900 dark:text-white" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">
            {loading ? '...' : (isSignUp ? t('nav.signup') : t('login.button'))}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 hover:underline text-sm">
            {isSignUp ? t('auth.haveAccount') : t('login.noAccount')}
          </button>
        </div>
      </div>
    </div>
  );
}