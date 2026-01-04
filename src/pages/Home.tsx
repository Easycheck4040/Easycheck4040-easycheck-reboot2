import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // <--- Importámos o Footer aqui
import { 
  ArrowRight, 
  Calculator, 
  Mail, 
  FileText, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  CheckCircle2,
  X
} from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();

  const services = [
    { 
      icon: Calculator, 
      title: t('categories.accounting.title'), 
      desc: t('categories.accounting.description'), 
      color: "text-blue-600", 
      bg: "bg-blue-100 dark:bg-blue-900/30" 
    },
    { 
      icon: Mail, 
      title: t('categories.communication.title'), 
      desc: t('categories.communication.description'), 
      color: "text-green-600", 
      bg: "bg-green-100 dark:bg-green-900/30" 
    },
    { 
      icon: FileText, 
      title: t('categories.administrative.title'), 
      desc: t('categories.administrative.description'), 
      color: "text-purple-600", 
      bg: "bg-purple-100 dark:bg-purple-900/30" 
    },
    { 
      icon: Users, 
      title: t('categories.hr.title'), 
      desc: t('categories.hr.description'), 
      color: "text-orange-600", 
      bg: "bg-orange-100 dark:bg-orange-900/30" 
    },
    { 
      icon: TrendingUp, 
      title: t('categories.marketing.title'), 
      desc: t('categories.marketing.description'), 
      color: "text-pink-600", 
      bg: "bg-pink-100 dark:bg-pink-900/30" 
    },
    { 
      icon: MessageSquare, 
      title: t('categories.chat.title'), 
      desc: t('categories.chat.description'), 
      color: "text-indigo-600", 
      bg: "bg-indigo-100 dark:bg-indigo-900/30" 
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              {t('hero.savings')}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
              {t('hero.title')}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
              <Link 
                to="/login?mode=signup" 
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transform hover:scale-105 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"
              >
                {t('hero.cta')} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/pricing" 
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                {t('nav.pricing')}
              </Link>
            </div>
          </div>
        </section>

        {/* COST COMPARISON SECTION */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('comparison.title')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
              
              {/* LADO VERMELHO (Tradicional) */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all">
                <div className="absolute top-0 right-0 bg-red-100 dark:bg-red-900/50 px-4 py-1 rounded-bl-xl">
                  <span className="text-red-600 dark:text-red-400 font-bold text-sm">{t('comparison.traditional')}</span>
                </div>
                
                <div className="space-y-6 mt-4">
                  {[
                    { role: t('roles.accountant'), cost: "€3,500" },
                    { role: t('roles.admin'), cost: "€2,200" },
                    { role: t('roles.hr'), cost: "€3,200" },
                    { role: t('roles.marketing'), cost: "€2,800" },
                    { role: t('roles.support'), cost: "€2,000" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <X className="w-4 h-4 text-red-400" /> {item.role}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">{item.cost}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 bg-red-50 dark:bg-red-900/10 -mx-8 -mb-8 p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('comparison.total')}</p>
                  <p className="text-4xl font-bold text-red-600">€13,700/mo</p>
                </div>
              </div>

              {/* LADO AZUL (EasyCheck) */}
              <div className="bg-blue-600 p-8 rounded-3xl shadow-2xl relative overflow-hidden transform md:scale-105 z-10">
                <div className="absolute top-0 right-0 bg-white/20 px-4 py-1 rounded-bl-xl backdrop-blur-sm">
                  <span className="text-white font-bold text-sm">{t('comparison.recommended')}</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">EasyCheck AI</h3>
                
                <div className="bg-blue-700/50 p-6 rounded-2xl backdrop-blur-sm border border-blue-500/30 mt-6 mb-8">
                  <p className="text-white font-bold text-lg mb-4 text-center border-b border-blue-500/30 pb-4">
                    {t('comparison.replace_text')}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> {t('categories.accounting.title')}
                    </div>
                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> {t('categories.administrative.title')}
                    </div>
                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> {t('categories.hr.title')}
                    </div>
                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> {t('categories.marketing.title')}
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-blue-100 text-sm mb-1">{t('comparison.total')}</p>
                  <p className="text-5xl font-bold text-white mb-2">€99/mo</p>
                  <p className="text-green-300 font-bold bg-green-500/20 inline-block px-3 py-1 rounded-full text-sm">
                    {t('comparison.savings')}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('services.title')}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="group p-8 rounded-3xl bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-100 dark:hover:border-gray-600 hover:shadow-xl transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl ${service.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`w-7 h-7 ${service.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER NOVO */}
      <Footer />
    </div>
  );
}