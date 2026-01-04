import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Pricing() {
  const { t } = useTranslation();

  const plans = [
    {
      name: "Starter",
      price: "29",
      description: t('pricing.starter_desc'),
      features: [
        t('pricing.feat_invoices'),
        t('pricing.feat_clients'),
        t('pricing.feat_basic_support'),
        t('pricing.feat_no_ai')
      ],
      notIncluded: [
        t('pricing.feat_chat'),
        t('pricing.feat_automation')
      ],
      buttonVariant: "outline" as const
    },
    {
      name: "Pro",
      price: "99",
      popular: true,
      description: t('pricing.pro_desc'),
      features: [
        t('pricing.feat_everything_starter'),
        t('pricing.feat_unlimited_ai'),
        t('pricing.feat_chat_247'),
        t('pricing.feat_auto_email'),
        t('pricing.feat_priority')
      ],
      notIncluded: [],
      buttonVariant: "default" as const
    },
    {
      name: "Enterprise",
      price: "299",
      description: t('pricing.enterprise_desc'),
      features: [
        t('pricing.feat_everything_pro'),
        t('pricing.feat_custom_api'),
        t('pricing.feat_dedicated'),
        t('pricing.feat_training')
      ],
      notIncluded: [],
      buttonVariant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">{t('pricing.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative flex flex-col h-full border-2 transition-all duration-300 hover:shadow-2xl ${plan.popular ? 'border-blue-600 dark:border-blue-500 shadow-xl scale-105 z-10' : 'border-gray-200 dark:border-gray-700 hover:-translate-y-2'}`}>
              
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                  {t('pricing.most_popular')}
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl font-bold dark:text-white">{plan.name}</CardTitle>
                <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                  <span className="text-5xl font-extrabold tracking-tight">€{plan.price}</span>
                  <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
                </div>
                <CardDescription className="mt-4 text-gray-500 dark:text-gray-400">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <li key={i} className="flex items-start opacity-50">
                      <X className="h-5 w-5 text-gray-400 shrink-0 mr-2" />
                      <span className="text-gray-500 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/login?mode=signup" className="mt-auto">
                  <Button className={`w-full h-12 text-lg font-bold rounded-xl ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'}`}>
                    {t('pricing.choose_plan')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t('pricing.enterprise_contact')} <a href="#" className="text-blue-600 font-bold hover:underline">Contact Sales</a>
          </p>
        </div>

      </div>
    </div>
  );
}