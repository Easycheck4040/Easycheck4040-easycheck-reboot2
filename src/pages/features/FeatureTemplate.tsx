import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface FeatureTemplateProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
  children?: ReactNode;
}

export const FeatureTemplate = ({
  icon,
  title,
  description,
  gradient,
  children
}: FeatureTemplateProps) => {
  return (
    <div className="min-h-screen pt-16">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} mb-6`}>
                {icon}
              </div>
              <h1 className="text-4xl font-bold mb-4">{title}</h1>
              <p className="text-lg text-muted-foreground">{description}</p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>AI-Powered Feature</CardTitle>
                    <CardDescription>
                      This feature uses advanced AI to automate your workflow
                    </CardDescription>
                  </div>
                  <Button className="shadow-glow">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate with AI
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {children || (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      This is a demo interface. In production, this would connect to AI services
                      to provide real-time automation for {title.toLowerCase()}.
                    </p>
                    <div className="bg-muted rounded-lg p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Click "Generate with AI" to see this feature in action
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fast Processing</CardTitle>
                  <CardDescription>
                    Get results in seconds, not hours
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">High Accuracy</CardTitle>
                  <CardDescription>
                    AI-powered precision and quality
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Multilingual</CardTitle>
                  <CardDescription>
                    Works in FR, EN, DE, and PT
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
