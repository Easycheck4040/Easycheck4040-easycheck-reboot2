import { Check, X, TrendingDown, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useTranslation } from 'react-i18next';

export const CostComparison = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('comparison.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('comparison.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional Way */}
          <Card className="border-red-100 bg-red-50/50 dark:bg-red-950/10 dark:border-red-900/50">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">{t('comparison.traditional')}</CardTitle>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase rounded-full dark:bg-red-900/50 dark:text-red-300">
                  $$$
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('comparison.traditional.sub')}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { role: t('comparison.accountant'), cost: '€2,500' },
                { role: t('comparison.admin'), cost: '€1,800' },
                { role: t('comparison.hr'), cost: '€3,200' },
                { role: t('comparison.marketing'), cost: '€2,800' },
                { role: t('comparison.support'), cost: '€2,000' },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-red-100 dark:border-red-900/30">
                  <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="text-xl">👤</span> {item.role}
                  </span>
                  <span className="font-semibold text-red-600 dark:text-red-400">{item.cost}/mo</span>
                </div>
              ))}
              <div className="pt-6 border-t border-red-200 dark:border-red-900/30 mt-6">
                <div className="flex justify-between items-end">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">{t('comparison.total')}</span>
                  <span className="text-3xl font-bold text-red-600 dark:text-red-500">€12.300/mo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EasyCheck Way */}
          <Card className="border-blue-500 bg-white dark:bg-gray-800 shadow-xl relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-bold rounded-bl-xl">
              RECOMMENDED
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">{t('comparison.easycheck')}</CardTitle>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('comparison.easycheck.sub')}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-600 rounded-full text-white">
                    <TrendingDown className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                      {t('comparison.save')}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">€12.271/mo</div>
                  </div>
                </div>
                <div className="text-sm text-center text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 py-2 rounded-lg">
                  €147.252 {t('comparison.perYear')}
                </div>
              </div>

              <div className="space-y-3">
                {[
                  t('comparison.features.all'),
                  t('comparison.features.247'),
                  t('comparison.features.multi')
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-end">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">{t('comparison.total')}</span>
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">€29<span className="text-lg text-gray-500 dark:text-gray-500">/mo</span></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};