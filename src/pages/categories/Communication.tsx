import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, Calendar, Bell, ArrowRight } from 'lucide-react';

export const Communication = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Mail,
      name: t('categories.communication.features.emails'),
      path: '/communication/emails',
      description: 'Automatic email reading and intelligent responses'
    },
    {
      icon: Send,
      name: t('categories.communication.features.followups'),
      path: '/communication/followups',
      description: 'Never miss a follow-up with automated reminders'
    },
    {
      icon: Calendar,
      name: t('categories.communication.features.meetings'),
      path: '/communication/meetings',
      description: 'Schedule meetings effortlessly with AI assistance'
    },
    {
      icon: Bell,
      name: t('categories.communication.features.reminders'),
      path: '/communication/reminders',
      description: 'Automatic client reminders and notifications'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 mb-6">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                {t('categories.communication.title')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('categories.communication.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Link key={index} to={feature.path}>
                    <Card className="h-full hover:shadow-lg transition-smooth cursor-pointer group">
                      <CardHeader>
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
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
