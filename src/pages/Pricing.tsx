import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Pricing = () => {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: t('pricing.free.name'),
      price: t('pricing.free.price'),
      priceAnnual: t('pricing.free.price'),
      description: t('pricing.free.description'),
      features: t('pricing.free.features', { returnObjects: true }) as string[],
      popular: false
    },
    {
      name: t('pricing.essential.name'),
      price: t('pricing.essential.price'),
      priceAnnual: t('pricing.essential.priceAnnual'),
      description: t('pricing.essential.description'),
      features: t('pricing.essential.features', { returnObjects: true }) as string[],
      popular: true
    },
    {
      name: t('pricing.professional.name'),
      price: t('pricing.professional.price'),
      priceAnnual: t('pricing.professional.priceAnnual'),
      description: t('pricing.professional.description'),
      features: t('pricing.professional.features', { returnObjects: true }) as string[],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('pricing.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Simple, transparent pricing that grows with you
            </p>

            {/* Annual/Monthly Toggle */}
            <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setIsAnnual(false)}
                className={cn(
                  "px-6 py-2 rounded-md text-sm font-medium transition-smooth",
                  !isAnnual
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t('pricing.monthly')}
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={cn(
                  "px-6 py-2 rounded-md text-sm font-medium transition-smooth flex items-center gap-2",
                  isAnnual
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t('pricing.annual')}
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  {t('pricing.save')}
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={cn(
                  "relative",
                  plan.popular && "border-primary shadow-glow"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {isAnnual ? plan.priceAnnual : plan.price}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link to="/auth">
                    <Button
                      className="w-full mb-6"
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {t('pricing.cta')}
                    </Button>
                  </Link>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
