import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Calculator, Mail, FileText, Users, TrendingUp, Zap, ArrowRight, CheckCircle2, X, MessageSquare } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();

  const categories = [
    { icon: Calculator, title: t('categories.accounting.title'), description: t('categories.accounting.description'), path: '/accounting', gradient: 'from-blue-500 to-cyan-500' },
    { icon: Mail, title: t('categories.communication.title'), description: t('categories.communication.description'), path: '/communication', gradient: 'from-cyan-500 to-teal-500' },
    { icon: FileText, title: t('categories.administrative.title'), description: t('categories.administrative.description'), path: '/administrative', gradient: 'from-teal-500 to-green-500' },
    { icon: Users, title: t('categories.hr.title'), description: t('categories.hr.description'), path: '/hr', gradient: 'from-green-500 to-emerald-500' },
    { icon: TrendingUp, title: t('categories.marketing.title'), description: t('categories.marketing.description'), path: '/marketing', gradient: 'from-emerald-500 to-blue-500' },
    // NOVO: Adicionei o Chat IA aqui para ficar ao lado das funções
    { icon: MessageSquare, title: t('categories.chat.title'), description: t('categories.chat.description'), path: '/dashboard', gradient: 'from-purple-500 to-pink-500' }
  ];

  return (
    <div className="transition-colors duration-300 dark:bg-gray-900 dark:text-white bg-white text-gray-900">
      
      {/* Hero Section - Atualizado para focar em Rapidez/Preço */}
      <section className="pt-24 pb-20 text-center container mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          <Zap className="h-4 w-4" /> {t('hero.savings')}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 max-w-5xl mx-auto leading-tight">{t('hero.title')}</h1>
        <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-600 dark:text-gray-400">{t('hero.description')}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login?mode=signup"><Button size="lg" className="h-14 px-8 text-lg bg-blue-600 text-white w-full sm:w-auto">{t('hero.cta')} <ArrowRight className="ml-2" /></Button></Link>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto dark:bg-transparent dark:border-gray-700">{t('nav.pricing')}</Button>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
         <div className="container mx-auto px-4">
             <h2 className="text-3xl font-bold text-center mb-12">{t('comparison.title')}</h2>
             <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                 <div className="p-8 border rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                     <h3 className="text-xl font-bold mb-6 text-red-500">{t('comparison.traditional')}</h3>
                     <ul className="space-y-4 mb-8">
                         <li className="flex justify-between border-b dark:border-gray-700 pb-2"><span>{t('roles.accountant')}</span> <span className="font-bold">€3,500</span></li>
                         <li className="flex justify-between border-b dark:border-gray-700 pb-2"><span>{t('roles.admin')}</span> <span className="font-bold">€2,200</span></li>
                         <li className="flex justify-between border-b dark:border-gray-700 pb-2"><span>{t('roles.hr')}</span> <span className="font-bold">€3,200</span></li>
                         <li className="flex justify-between border-b dark:border-gray-700 pb-2"><span>{t('roles.marketing')}</span> <span className="font-bold">€2,800</span></li>
                         <li className="flex justify-between border-b dark:border-gray-700 pb-2"><span>{t('roles.support')}</span> <span className="font-bold">€2,000</span></li>
                     </ul>
                     <div className="text-right">
                        <p className="text-sm text-gray-500">{t('comparison.total')}</p>
                        <p className="text-3xl font-bold text-red-500">€13,700/mo</p>
                     </div>
                 </div>

                 <div className="p-8 border-2 border-blue-500 rounded-2xl bg-blue-50 dark:bg-blue-900/10 relative">
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">{t('comparison.recommended')}</div>
                     <h3 className="text-xl font-bold mb-6 text-blue-500">EasyCheck AI</h3>
                     <div className="bg-blue-600 text-white p-6 rounded-xl mb-8 shadow-lg">
                        <p className="font-bold text-lg mb-2">{t('comparison.replace_text')}</p>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                           <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {t('categories.accounting.title')}</div>
                           <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {t('categories.administrative.title')}</div>
                           <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {t('categories.hr.title')}</div>
                           <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {t('categories.marketing.title')}</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm text-gray-500">{t('comparison.total')}</p>
                        <div className="flex items-baseline justify-end gap-2">
                           <p className="text-4xl font-bold text-blue-600">€99/mo</p>
                        </div>
                        <p className="text-green-600 font-bold mt-2">{t('comparison.savings')}</p>
                     </div>
                 </div>
             </div>
         </div>
      </section>

      {/* Services Grid com descrições elaboradas */}
      <section className="py-20 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('services.title')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {categories.map((c, i) => (
              <Link key={i} to={c.path}>
                <Card className="h-full hover:shadow-2xl hover:-translate-y-1 transition-all border-0 bg-white dark:bg-gray-800 group">
                  <CardHeader>
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <c.icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-xl mb-2 dark:text-white">{c.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                      {c.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
      </section>
    </div>
  );
}