import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
// CAMINHOS CORRIGIDOS (../ em vez de @/) para funcionar no teu projeto
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Calculator, 
  Mail, 
  FileText, 
  Users, 
  TrendingUp, 
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { EnhancedChatInterface } from '../components/EnhancedChatInterface';
import { CostComparison } from '../components/CostComparison';

interface HomeProps {
  isAuthenticated?: boolean;
}

export default function Home({ isAuthenticated = false }: HomeProps) {
  const { t } = useTranslation();

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

  const benefits = [
    'Reduce operational costs by up to 70%',
    'Available 24/7 without breaks or holidays',
    'Process tasks 10x faster than manual work',
    'Minimize human error with AI precision',
    'Scale instantly as your business grows',
    'Multilingual support in 4 languages'
  ];

  return (
    <div className="min-h-screen pt-16 bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradiente de fundo original */}
        <div className="absolute inset-0 bg-blue-50/50 opacity-50" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              {t('hero.savings')}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {t('hero.subtitle')}
            </p>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              {t('hero.description')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to={isAuthenticated ? '/dashboard' : '/login'}>
                <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
                  {t('hero.cta')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline">
                  {t('nav.pricing')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Comparison Section */}
      <CostComparison />

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose EasyCheck?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {isAuthenticated ? 'Your AI Services' : 'Available Services'}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {isAuthenticated
                ? 'Click on any service to start using AI-powered automation'
                : 'Explore all the ways EasyCheck can transform your business operations'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link key={index} to={isAuthenticated ? category.path : '/login'}>
                  <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-gray-200">
                    <CardHeader>
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="group-hover:text-blue-600 transition-colors">
                        {category.title}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        {isAuthenticated ? 'Open Service' : t('nav.tryNow')}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {!isAuthenticated && (
            <div className="text-center mt-12">
              <Link to="/login">
                <Button size="lg" className="px-8">
                  {t('nav.login')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Chat Section */}
      {isAuthenticated && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">AI Chat Assistant</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  Your intelligent assistant with access to all your business data.
                </p>
              </div>
              <div className="h-[700px]">
                <EnhancedChatInterface />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};