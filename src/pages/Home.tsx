import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Calculator, Mail, FileText, Users, TrendingUp, Zap, ArrowRight, CheckCircle2,
  Moon, Sun, Globe
} from 'lucide-react';
import { EnhancedChatInterface } from '../components/EnhancedChatInterface';
import { CostComparison } from '../components/CostComparison';

interface HomeProps {
  isAuthenticated?: boolean;
}

export default function Home({ isAuthenticated = false }: HomeProps) {
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(false);

  // Lógica do Dark Mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Função para mudar língua
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const categories = [
    {
      icon: Calculator,
      title: t('categories.accounting.title'),
      description: t('categories.accounting.description'),
      path: '/accounting',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mail,
      title: t('categories.communication.title'),
      description: t('categories.communication.description'),
      path: '/communication',
      gradient: 'from-cyan-500 to-teal-500'
    },
    {
      icon: FileText,
      title: t('categories.administrative.title'),
      description: t('categories.administrative.description'),
      path: '/administrative',
      gradient: 'from-teal-500 to-green-500'
    },
    {
      icon: Users,
      title: t('categories.hr.title'),
      description: t('categories.hr.description'),
      path: '/hr',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: t('categories.marketing.title'),
      description: t('categories.marketing.description'),
      path: '/marketing',
      gradient: 'from-emerald-500 to-blue-500'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      
      {/* Navbar Melhorada */}
      <nav className={`border-b sticky top-0 z-50 transition-colors duration-300 ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LOGO MAIOR AQUI */}
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Zap className="w-6 h-6 fill-current" />
             </div>
             <span className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
               EasyCheck
             </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Seletor de Língua */}
            <div className="relative group">
               <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                  <Globe className="w-5 h-5" />
               </button>
               <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border overflow-hidden hidden group-hover:block text-gray-900">
                  <button onClick={() => changeLanguage('pt')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">🇵🇹 Português</button>
                  <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">🇬🇧 English</button>
                  <button onClick={() => changeLanguage('fr')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">🇫🇷 Français</button>
               </div>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Botões de Login e Criar Conta */}
            <Link to="/login" className={`font-medium px-4 py-2 rounded-lg transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`}>
              {t('nav.login')}
            </Link>
            <Link to="/onboard" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all">
              {t('nav.signup')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20">
        {!isDark && <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50 -z-10" />}
        
        <div className="container mx-auto px-4 text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 ${isDark ? 'bg-blue-900/30 text-blue-400 border border-blue-800' : 'bg-blue-100 text-blue-700'}`}>
              <Zap className="h-4 w-4" />
              {t('hero.savings')}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              {t('hero.title')}
            </h1>
            <p className={`text-xl mb-10 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('hero.description')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/onboard">
                <Button size="lg" className="h-14 px-8 text-lg rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                  {t('hero.cta')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className={`h-14 px-8 text-lg rounded-xl ${isDark ? 'bg-transparent border-gray-700 text-white hover:bg-gray-800' : ''}`}>
                 {t('nav.pricing')}
              </Button>
            </div>
        </div>
      </section>

      {/* Tabela de Comparação (Agora Traduzível e com Dark Mode) */}
      <section className={`py-20 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
         <div className="container mx-auto px-4">
             <h2 className="text-3xl font-bold text-center mb-12">EasyCheck vs Tradicional</h2>
             <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                 {/* Lado Tradicional */}
                 <div className={`p-8 border rounded-2xl ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                     <h3 className="text-xl font-bold mb-6 text-red-500">Tradicional</h3>
                     <ul className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                         <li className="flex gap-3"><div className="text-red-500">✕</div> Contabilista (200€/mês)</li>
                         <li className="flex gap-3"><div className="text-red-500">✕</div> Assistente (800€/mês)</li>
                         <li className="flex gap-3"><div className="text-red-500">✕</div> Erros manuais</li>
                     </ul>
                 </div>

                 {/* Lado EasyCheck */}
                 <div className={`p-8 border-2 border-blue-500 rounded-2xl relative ${isDark ? 'bg-blue-900/10' : 'bg-blue-50'}`}>
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                         Recomendado
                     </div>
                     <h3 className="text-xl font-bold mb-6 text-blue-500">EasyCheck AI</h3>
                     <ul className={`space-y-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                         <li className="flex gap-3"><CheckCircle2 className="text-green-500" /> Desde 29€/mês</li>
                         <li className="flex gap-3"><CheckCircle2 className="text-green-500" /> Disponível 24/7</li>
                         <li className="flex gap-3"><CheckCircle2 className="text-green-500" /> Zero erros</li>
                     </ul>
                 </div>
             </div>
         </div>
      </section>

      {/* Grid de Serviços */}
      <section className="py-20 container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link key={index} to={isAuthenticated ? category.path : '/login'}>
                  <Card className={`h-full hover:shadow-2xl transition-all cursor-pointer group border-0 ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50 shadow-sm'}`}>
                    <CardHeader>
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className={`group-hover:text-blue-500 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {category.title}
                      </CardTitle>
                      <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-blue-500 text-sm font-bold">
                        {t('nav.tryNow')} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
      </section>
    </div>
  );
}