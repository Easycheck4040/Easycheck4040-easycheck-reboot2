import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Calculator, Mail, FileText, Users, TrendingUp, Zap, ArrowRight, CheckCircle2, X } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();

  const categories = [
    { icon: Calculator, title: t('categories.accounting.title'), description: t('categories.accounting.description'), path: '/accounting', gradient: 'from-blue-500 to-cyan-500' },
    { icon: Mail, title: t('categories.communication.title'), description: t('categories.communication.description'), path: '/communication', gradient: 'from-cyan-500 to-teal-500' },
    { icon: FileText, title: t('categories.administrative.title'), description: t('categories.administrative.description'), path: '/administrative', gradient: 'from-teal-500 to-green-500' },
    { icon: Users, title: t('categories.hr.title'), description: t('categories.hr.description'), path: '/hr', gradient: 'from-green-500 to-emerald-500' },
    { icon: TrendingUp, title: t('categories.marketing.title'), description: t('categories.marketing.description'), path: '/marketing', gradient: 'from-emerald-500 to-blue-500' }
  ];

  return (
    <div className="transition-colors duration-300 dark:bg-gray-900 dark:text-white bg-white text-gray-900">
      <section className="pt-20 pb-20 text-center container mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          <Zap className="h-4 w-4" /> {t('hero.savings')}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6">{t('hero.title')}</h1>
        <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">{t('hero.description')}</p>
        <div className="flex justify-center gap-4">
          <Link to="/login?mode=signup"><Button size="lg" className="h-14 px-8 text-lg bg-blue-600 text-white">{t('hero.cta')} <ArrowRight className="ml-2" /></Button></Link>
        </div>
      </section>

      {/* COMPARAÇÃO COM VALORES REAIS */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
         <div className="container mx-auto px-4">
             <h2 className="text-3xl font-bold text-center mb-12">{t('comparison.title')}</h2>
             <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                 <div className="p-8 border rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                     <h3 className="text-xl font-bold mb-6 text-red-500">{t('comparison.traditional')}</h3>
                     <ul className="space-y-4 mb-8">
                         <li className="flex justify-between border-b pb-2"><span>Contabilista</span> <span className="font-bold">€3,500/mês</span></li>
                         <li className="flex justify-between border-b pb-2"><span>Assistente Admin</span> <span className="font-bold">€2,200/mês</span></li>
                         <li className="flex justify-between border-b pb-2"><span>Gestor RH</span> <span className="font-bold">€3,200/mês</span></li>
                         <li className="flex justify-between border-b pb-2"><span>Marketing</span> <span className="font-bold">€2,800/mês</span></li>
                         <li className="flex justify-between border-b pb-2"><span>Suporte</span> <span className="font-bold">€2,000/mês</span></li>
                     </ul>
                     <div className="text-right">
                        <p className="text-sm text-gray-500">Custo Mensal Total:</p>
                        <p className="text-3xl font-bold text-red-500">€13,700/mês</p>
                     </div>
                 </div>

                 <div className="p-8 border-2 border-blue-500 rounded-2xl bg-blue-50 dark:bg-blue-900/10 relative">
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">{t('comparison.recommended')}</div>
                     <h3 className="text-xl font-bold mb-6 text-blue-500">EasyCheck AI</h3>
                     <div className="bg-blue-600 text-white p-6 rounded-xl mb-8">
                        <p className="font-medium">Substitui os 5 funcionários</p>
                        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                           <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Contabilidade</div>
                           <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Admin</div>
                           <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> RH</div>
                           <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Marketing</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm text-gray-500">Custo Mensal Total:</p>
                        <div className="flex items-baseline justify-end gap-2">
                           <p className="text-4xl font-bold text-blue-600">€99/mês</p>
                        </div>
                        <p className="text-green-600 font-bold mt-2">Poupas €13,601 por mês!</p>
                     </div>
                 </div>
             </div>
         </div>
      </section>

      <section className="py-20 container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((c, i) => (
              <Link key={i} to={c.path}>
                <Card className="h-full hover:shadow-xl transition-all border-0 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-4 text-white`}><c.icon /></div>
                    <CardTitle className="dark:text-white">{c.title}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
      </section>
    </div>
  );
}