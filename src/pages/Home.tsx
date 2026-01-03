import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Calculator, Mail, FileText, Users, TrendingUp, Zap, ArrowRight, CheckCircle2, X
} from 'lucide-react';

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
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20">
        <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border dark:border-blue-800">
              <Zap className="h-4 w-4" />
              {t('hero.savings')}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
              {t('hero.description')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/login?mode=signup">
                <Button size="lg" className="h-14 px-8 text-lg rounded-xl shadow-xl bg-blue-600 hover:bg-blue-700 text-white">
                  {t('hero.cta')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl dark:bg-transparent dark:border-gray-700 dark:text-white dark:hover:bg-gray-800">
                 {t('nav.pricing')}
              </Button>
            </div>
        </div>
      </section>

      {/* Tabela de Comparação (Agora Traduzida) */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
         <div className="container mx-auto px-4">
             <h2 className="text-3xl font-bold text-center mb-12">{t('comparison.title')}</h2>
             <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                 {/* Tradicional */}
                 <div className="p-8 border rounded-2xl bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                     <h3 className="text-xl font-bold mb-6 text-red-500">{t('comparison.traditional')}</h3>
                     <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                         <li className="flex gap-3"><X className="text-red-500" /> {t('comparison.item1_bad')}</li>
                         <li className="flex gap-3"><X className="text-red-500" /> {t('comparison.item2_bad')}</li>
                         <li className="flex gap-3"><X className="text-red-500" /> {t('comparison.item3_bad')}</li>
                     </ul>
                 </div>

                 {/* EasyCheck */}
                 <div className="p-8 border-2 border-blue-500 rounded-2xl relative bg-blue-50 dark:bg-blue-900/10">
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                         {t('comparison.recommended')}
                     </div>
                     <h3 className="text-xl font-bold mb-6 text-blue-500">EasyCheck AI</h3>
                     <ul className="space-y-4 text-gray-800 dark:text-gray-200">
                         <li className="flex gap-3"><CheckCircle2 className="text-green-500" /> {t('comparison.item1_good')}</li>
                         <li className="flex gap-3"><CheckCircle2 className="text-green-500" /> {t('comparison.item2_good')}</li>
                         <li className="flex gap-3"><CheckCircle2 className="text-green-500" /> {t('comparison.item3_good')}</li>
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
                <Link key={index} to={category.path}>
                  <Card className="h-full hover:shadow-2xl transition-all cursor-pointer group border-0 bg-white hover:bg-gray-50 shadow-sm dark:bg-gray-800 dark:hover:bg-gray-750">
                    <CardHeader>
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="group-hover:text-blue-500 transition-colors text-gray-900 dark:text-white">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
      </section>
    </div>
  );
}