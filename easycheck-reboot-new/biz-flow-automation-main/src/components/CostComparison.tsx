import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Bot, TrendingDown, CheckCircle2, X } from 'lucide-react';

export const CostComparison = () => {
  const { t } = useTranslation();

  const traditionalEmployees = [
    { role: 'Accountant', salary: '€3,500', icon: '👨‍💼' },
    { role: 'Administrative Assistant', salary: '€2,200', icon: '👩‍💼' },
    { role: 'HR Manager', salary: '€3,200', icon: '👨‍💼' },
    { role: 'Marketing Specialist', salary: '€2,800', icon: '👩‍💼' },
    { role: 'Customer Support', salary: '€2,000', icon: '👨‍💼' }
  ];

  const totalTraditional = 13700;
  const easycheckCost = 99;
  const savings = totalTraditional - easycheckCost;
  const savingsPercentage = Math.round((savings / totalTraditional) * 100);

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Traditional vs Easycheck: Cost Comparison
          </h2>
          <p className="text-lg text-muted-foreground">
            See how much you can save by switching to Easycheck
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Traditional Way */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <X className="h-4 w-4" />
              Expensive
            </div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Traditional Way</h3>
                  <p className="text-sm text-muted-foreground">Multiple employees needed</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {traditionalEmployees.map((employee, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{employee.icon}</span>
                      <span className="font-medium">{employee.role}</span>
                    </div>
                    <span className="font-bold text-destructive">{employee.salary}/mo</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">Total Monthly Cost:</span>
                  <span className="text-2xl font-bold text-destructive">
                    €{totalTraditional.toLocaleString()}/mo
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Plus benefits, training, office space, equipment...
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Easycheck Way */}
          <Card className="relative overflow-hidden border-primary shadow-glow">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Best Choice
            </div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Easycheck Way</h3>
                  <p className="text-sm text-muted-foreground">One AI-powered solution</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Bot className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-bold text-lg">Easycheck AI</h4>
                      <p className="text-sm text-muted-foreground">
                        Replaces all 5 employees
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Accounting</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Admin</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>HR</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Marketing</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>24/7 Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Multilingual</span>
                    </div>
                  </div>
                </div>

                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center gap-3 text-6xl font-bold gradient-text">
                    <TrendingDown className="h-12 w-12 text-green-500" />
                    {savingsPercentage}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Cost Reduction</p>
                </div>
              </div>

              <div className="border-t border-primary/20 pt-4">
                <div className="flex items-center justify-between text-lg mb-4">
                  <span className="font-semibold">Total Monthly Cost:</span>
                  <span className="text-2xl font-bold text-primary">
                    €{easycheckCost}/mo
                  </span>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">You Save</p>
                    <p className="text-3xl font-bold text-green-600">
                      €{savings.toLocaleString()}/mo
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      That's €{(savings * 12).toLocaleString()} per year!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Stats */}
        <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">10x</div>
              <p className="text-sm text-muted-foreground">Faster Processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">24/7</div>
              <p className="text-sm text-muted-foreground">Always Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">0</div>
              <p className="text-sm text-muted-foreground">Sick Days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">4</div>
              <p className="text-sm text-muted-foreground">Languages</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
