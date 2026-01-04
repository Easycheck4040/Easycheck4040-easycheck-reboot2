import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, User, Briefcase, KeyRound } from 'lucide-react';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Dados do Formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Dados Extra (Perfil Profissional)
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [isEmployee, setIsEmployee] = useState(false); // Checkbox: Sou funcionário?

  const [loading, setLoading] = useState(false);

  // Deteta se viemos do botão "Sign Up" da Home
  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setIsSignUp(true);
    }
  }, [searchParams]);

  // Função para gerar código aleatório para novas empresas (ex: EMP-X92A)
  const generateCompanyCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'EMP-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleAuth = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // --- LÓGICA DE REGISTO (CRIAR CONTA) ---
        
        // 1. Validar se preencheu Nome e Cargo
        if (!fullName || !jobTitle) throw new Error("Por favor preenche o Nome e o Cargo.");
        
        let finalCompanyCode = companyCode;
        let finalCompanyName = companyName;

        if (isEmployee) {
          // Se é FUNCIONÁRIO, é obrigatório ter o código
          if (!companyCode) throw new Error("Insere o Código da Empresa que o teu chefe te deu.");
          // (Aqui assumimos que o funcionário sabe o nome da empresa, ou deixamos em branco para o sistema preencher depois,
          // mas para simplificar, se ele souber o nome pode pôr, senão fica vazio até o sistema associar)
        } else {
          // Se é DONO, é obrigatório ter o nome da empresa
          if (!companyName) throw new Error("Insere o Nome da Empresa.");
          // Gerar um código novo para esta empresa
          finalCompanyCode = generateCompanyCode();
        }

        // 2. Criar a conta no Supabase com os METADADOS (O Carimbo)
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,       // Nome que vai aparecer no perfil
              job_title: jobTitle,       // Cargo
              company_name: finalCompanyName,
              company_code: finalCompanyCode,
              role: isEmployee ? 'employee' : 'owner' // <--- AQUI É QUE SE DECIDE QUEM MANDA
            }
          }
        });

        if (error) throw error;

        // 3. Verificação de segurança (se o email já existe)
        if (data?.user?.identities?.length === 0) {
             alert("Este email já está registado! Por favor faz Login.");
             setLoading(false);
             return;
        }

        // 4. Sucesso!
        if (!isEmployee) {
          // Se for dono, mostramos o código gerado
          alert(`Conta criada com sucesso!\n\nO CÓDIGO DA TUA EMPRESA É: ${finalCompanyCode}\n\nGuarda este código. Os teus funcionários vão precisar dele para se registarem.`);
        } else {
          alert("Conta criada! Bem-vindo à equipa.");
        }

      } else {
        // --- LÓGICA DE LOGIN (ENTRAR) ---
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
    <div className="flex min-h-[90vh] items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 my-8">
        
        {/* Cabeçalho do Cartão */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isSignUp ? t('auth.createTitle') : t('login.title')}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            {isSignUp ? t('auth.createSubtitle') : t('auth.loginSubtitle')}
          </p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-5">
          
          {/* --- CAMPOS EXTRAS (APENAS NO REGISTO) --- */}
          {isSignUp && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              
              {/* Nome e Cargo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t('auth.fullName')}</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text" 
                      className="w-full pl-9 p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="João Silva" 
                      value={fullName} 
                      onChange={e => setFullName(e.target.value)} 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t('auth.jobTitle')}</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text" 
                      className="w-full pl-9 p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="Diretor" 
                      value={jobTitle} 
                      onChange={e => setJobTitle(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              {/* Toggle: Dono vs Funcionário */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer mb-3 select-none">
                  <input 
                    type="checkbox" 
                    checked={isEmployee} 
                    onChange={e => setIsEmployee(e.target.checked)} 
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                  />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    {t('auth.iHaveCode')}
                  </span>
                </label>

                {!isEmployee ? (
                  // MOSTRA SE FOR DONO (NOVA EMPRESA)
                  <div className="animate-in fade-in duration-200">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t('auth.companyName')}</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="text" 
                        className="w-full pl-9 p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Minha Empresa Lda" 
                        value={companyName} 
                        onChange={e => setCompanyName(e.target.value)} 
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 italic flex items-center gap-1">
                       ✨ {t('auth.generateCode')}
                    </p>
                  </div>
                ) : (
                  // MOSTRA SE FOR FUNCIONÁRIO (TEM CÓDIGO)
                  <div className="animate-in fade-in duration-200">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t('auth.companyCode')}</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="text" 
                        className="w-full pl-9 p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm uppercase tracking-wider font-mono focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="EMP-XXXX" 
                        value={companyCode} 
                        onChange={e => setCompanyCode(e.target.value.toUpperCase())} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- EMAIL E PASSWORD (COMUM A LOGIN E REGISTO) --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('login.email')}</label>
            <input 
              type="email" 
              required 
              className="w-full p-3 border rounded-lg dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('login.password')}</label>
              {!isSignUp && (
                <button 
                  type="button" 
                  onClick={() => alert("Função em breve! Contacte o suporte.")} 
                  className="text-xs text-blue-600 hover:underline"
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

          <button 
            disabled={loading} 
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'A processar...' : (isSignUp ? t('nav.signup') : t('login.button'))}
          </button>
        </form>

        <div className="mt-6 text-center border-t dark:border-gray-700 pt-4">
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