import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Share2, Users, FileText, ArrowRight } from 'lucide-react';

export const Marketing = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Share2,
      name: t('categories.marketing.features.posts'),
      path: '/marketing/posts',
      description: 'Create engaging social media content with AI'
    },
    {
      icon: Users,
      name: t('categories.marketing.features.leads'),
      path: '/marketing/leads',
      description: 'Respond to leads instantly and intelligently'
    },
    {
      icon: TrendingUp,
      name: t('categories.marketing.features.campaigns'),
      path: '/marketing/campaigns',
      description: 'Generate complete marketing campaigns'
    },
    {
      icon: FileText,
      name: t('categories.marketing.features.content'),
      path: '/marketing/content',
      description: 'Create high-quality content for all channels'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                {t('categories.marketing.title')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('categories.marketing.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Link key={index} to={feature.path}>
                    <Card className="h-full hover:shadow-lg transition-smooth cursor-pointer group">
                      <CardHeader>
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="group-hover:text-primary transition-smooth">
                          {feature.name}
                        </CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-primary text-sm font-medium">
                          Open Feature
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-smooth" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
