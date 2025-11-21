import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        accounting: 'Accounting & Finance',
        communication: 'Communication & Emails',
        administrative: 'Administrative Assistance',
        hr: 'Human Resources',
        marketing: 'Marketing & Sales',
        pricing: 'Pricing',
        login: 'Log In',
        tryNow: 'Try Now',
        logout: 'Log Out'
      },
      hero: {
        title: 'Your Digital Employee',
        subtitle: 'Replace multiple employees with one AI-powered solution',
        description: 'Easycheck handles accounting, communication, HR, marketing and more - saving you time and money',
        cta: 'Get Started',
        savings: 'Save up to 70% on staffing costs'
      },
      categories: {
        accounting: {
          title: 'Accounting & Finance',
          description: 'Invoice generation, expense management, automatic billing',
          features: {
            invoices: 'Invoice Issuing',
            expenses: 'Expense Management',
            exports: 'Software Exports',
            billing: 'Automatic Billing'
          }
        },
        communication: {
          title: 'Communication & Emails',
          description: 'Automatic email responses, meeting scheduling, follow-ups',
          features: {
            emails: 'Email Management',
            followups: 'Automatic Follow-ups',
            meetings: 'Meeting Scheduling',
            reminders: 'Client Reminders'
          }
        },
        administrative: {
          title: 'Administrative Assistance',
          description: 'Report generation, spreadsheet organization, task management',
          features: {
            reports: 'Report Generation',
            spreadsheets: 'Spreadsheet Organization',
            tasks: 'Task Control',
            projects: 'Project Management'
          }
        },
        hr: {
          title: 'Human Resources',
          description: 'Resume screening, interview scheduling, candidate communication',
          features: {
            screening: 'Resume Screening',
            interviews: 'Interview Scheduling',
            messaging: 'Candidate Messaging',
            onboarding: 'Onboarding Automation'
          }
        },
        marketing: {
          title: 'Marketing & Sales',
          description: 'Content creation, lead responses, campaign generation',
          features: {
            posts: 'Social Media Posts',
            leads: 'Lead Responses',
            campaigns: 'Campaign Generation',
            content: 'Content Creation'
          }
        }
      },
      pricing: {
        title: 'Choose Your Plan',
        monthly: 'Monthly',
        annual: 'Annual',
        save: 'Save 20%',
        free: {
          name: 'Free',
          price: '€0',
          description: 'Try our basic features',
          features: [
            '10 AI requests per month',
            'Email support',
            'Basic features',
            'Single user'
          ]
        },
        essential: {
          name: 'Essential',
          price: '€49',
          priceAnnual: '€39',
          description: 'Perfect for small businesses',
          features: [
            '500 AI requests per month',
            'Priority support',
            'All features',
            'Up to 5 users',
            'Export to accounting software'
          ]
        },
        professional: {
          name: 'Professional',
          price: '€99',
          priceAnnual: '€79',
          description: 'For growing companies',
          features: [
            'Unlimited AI requests',
            '24/7 support',
            'All features',
            'Unlimited users',
            'Custom integrations',
            'API access'
          ]
        },
        cta: 'Get Started'
      },
      auth: {
        login: 'Log In',
        signup: 'Sign Up',
        email: 'Email',
        password: 'Password',
        forgotPassword: 'Forgot password?',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        createAccount: 'Create your account',
        welcomeBack: 'Welcome back'
      },
      chat: {
        placeholder: 'Ask me anything...',
        welcome: 'Hello! How can I help you today?'
      }
    }
  },
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        accounting: 'Comptabilité & Finance',
        communication: 'Communication & Emails',
        administrative: 'Assistance Administrative',
        hr: 'Ressources Humaines',
        marketing: 'Marketing & Ventes',
        pricing: 'Tarifs',
        login: 'Connexion',
        tryNow: 'Essayer',
        logout: 'Déconnexion'
      },
      hero: {
        title: 'Votre Employé Digital',
        subtitle: 'Remplacez plusieurs employés par une solution IA',
        description: 'Easycheck gère la comptabilité, la communication, les RH, le marketing et plus - économisez temps et argent',
        cta: 'Commencer',
        savings: "Économisez jusqu'à 70% sur les coûts de personnel"
      },
      categories: {
        accounting: {
          title: 'Comptabilité & Finance',
          description: 'Génération de factures, gestion des dépenses, facturation automatique',
          features: {
            invoices: 'Émission de Factures',
            expenses: 'Gestion des Dépenses',
            exports: 'Exports Logiciels',
            billing: 'Facturation Automatique'
          }
        },
        communication: {
          title: 'Communication & Emails',
          description: 'Réponses automatiques, planification de réunions, relances',
          features: {
            emails: 'Gestion des Emails',
            followups: 'Relances Automatiques',
            meetings: 'Planification Réunions',
            reminders: 'Rappels Clients'
          }
        },
        administrative: {
          title: 'Assistance Administrative',
          description: 'Génération de rapports, organisation de feuilles de calcul, gestion des tâches',
          features: {
            reports: 'Génération de Rapports',
            spreadsheets: 'Organisation Feuilles',
            tasks: 'Contrôle des Tâches',
            projects: 'Gestion de Projets'
          }
        },
        hr: {
          title: 'Ressources Humaines',
          description: 'Tri de CV, planification entretiens, communication candidats',
          features: {
            screening: 'Tri de CV',
            interviews: 'Planification Entretiens',
            messaging: 'Messagerie Candidats',
            onboarding: 'Automatisation Intégration'
          }
        },
        marketing: {
          title: 'Marketing & Ventes',
          description: 'Création de contenu, réponses aux leads, génération de campagnes',
          features: {
            posts: 'Publications Réseaux Sociaux',
            leads: 'Réponses aux Leads',
            campaigns: 'Génération Campagnes',
            content: 'Création de Contenu'
          }
        }
      },
      pricing: {
        title: 'Choisissez Votre Plan',
        monthly: 'Mensuel',
        annual: 'Annuel',
        save: 'Économisez 20%',
        free: {
          name: 'Gratuit',
          price: '€0',
          description: 'Essayez nos fonctionnalités de base',
          features: [
            '10 requêtes IA par mois',
            'Support par email',
            'Fonctionnalités de base',
            'Utilisateur unique'
          ]
        },
        essential: {
          name: 'Essentiel',
          price: '€49',
          priceAnnual: '€39',
          description: 'Parfait pour les petites entreprises',
          features: [
            '500 requêtes IA par mois',
            'Support prioritaire',
            'Toutes les fonctionnalités',
            "Jusqu'à 5 utilisateurs",
            'Export logiciels comptables'
          ]
        },
        professional: {
          name: 'Professionnel',
          price: '€99',
          priceAnnual: '€79',
          description: 'Pour les entreprises en croissance',
          features: [
            'Requêtes IA illimitées',
            'Support 24/7',
            'Toutes les fonctionnalités',
            'Utilisateurs illimités',
            'Intégrations personnalisées',
            'Accès API'
          ]
        },
        cta: 'Commencer'
      },
      auth: {
        login: 'Connexion',
        signup: 'Inscription',
        email: 'Email',
        password: 'Mot de passe',
        forgotPassword: 'Mot de passe oublié?',
        noAccount: 'Pas de compte?',
        hasAccount: 'Déjà un compte?',
        createAccount: 'Créez votre compte',
        welcomeBack: 'Bon retour'
      },
      chat: {
        placeholder: 'Posez-moi une question...',
        welcome: "Bonjour! Comment puis-je vous aider aujourd'hui?"
      }
    }
  },
  de: {
    translation: {
      nav: {
        home: 'Startseite',
        accounting: 'Buchhaltung & Finanzen',
        communication: 'Kommunikation & E-Mails',
        administrative: 'Verwaltungsunterstützung',
        hr: 'Personalwesen',
        marketing: 'Marketing & Vertrieb',
        pricing: 'Preise',
        login: 'Anmelden',
        tryNow: 'Jetzt testen',
        logout: 'Abmelden'
      },
      hero: {
        title: 'Ihr Digitaler Mitarbeiter',
        subtitle: 'Ersetzen Sie mehrere Mitarbeiter durch eine KI-Lösung',
        description: 'Easycheck kümmert sich um Buchhaltung, Kommunikation, HR, Marketing und mehr - sparen Sie Zeit und Geld',
        cta: 'Loslegen',
        savings: 'Sparen Sie bis zu 70% der Personalkosten'
      },
      categories: {
        accounting: {
          title: 'Buchhaltung & Finanzen',
          description: 'Rechnungserstellung, Spesenverwaltung, automatische Abrechnung',
          features: {
            invoices: 'Rechnungsstellung',
            expenses: 'Spesenverwaltung',
            exports: 'Software-Exporte',
            billing: 'Automatische Abrechnung'
          }
        },
        communication: {
          title: 'Kommunikation & E-Mails',
          description: 'Automatische E-Mail-Antworten, Meeting-Planung, Nachverfolgung',
          features: {
            emails: 'E-Mail-Verwaltung',
            followups: 'Automatische Nachverfolgung',
            meetings: 'Meeting-Planung',
            reminders: 'Kundenerinnerungen'
          }
        },
        administrative: {
          title: 'Verwaltungsunterstützung',
          description: 'Berichtserstellung, Tabellenorganisation, Aufgabenverwaltung',
          features: {
            reports: 'Berichtserstellung',
            spreadsheets: 'Tabellenorganisation',
            tasks: 'Aufgabenkontrolle',
            projects: 'Projektmanagement'
          }
        },
        hr: {
          title: 'Personalwesen',
          description: 'Lebenslauf-Screening, Terminplanung, Kandidatenkommunikation',
          features: {
            screening: 'Lebenslauf-Screening',
            interviews: 'Terminplanung',
            messaging: 'Kandidatennachrichten',
            onboarding: 'Onboarding-Automatisierung'
          }
        },
        marketing: {
          title: 'Marketing & Vertrieb',
          description: 'Content-Erstellung, Lead-Antworten, Kampagnenerstellung',
          features: {
            posts: 'Social-Media-Beiträge',
            leads: 'Lead-Antworten',
            campaigns: 'Kampagnenerstellung',
            content: 'Content-Erstellung'
          }
        }
      },
      pricing: {
        title: 'Wählen Sie Ihren Plan',
        monthly: 'Monatlich',
        annual: 'Jährlich',
        save: '20% sparen',
        free: {
          name: 'Kostenlos',
          price: '€0',
          description: 'Probieren Sie unsere Grundfunktionen',
          features: [
            '10 KI-Anfragen pro Monat',
            'E-Mail-Support',
            'Grundfunktionen',
            'Einzelner Benutzer'
          ]
        },
        essential: {
          name: 'Essential',
          price: '€49',
          priceAnnual: '€39',
          description: 'Perfekt für kleine Unternehmen',
          features: [
            '500 KI-Anfragen pro Monat',
            'Prioritäts-Support',
            'Alle Funktionen',
            'Bis zu 5 Benutzer',
            'Export in Buchhaltungssoftware'
          ]
        },
        professional: {
          name: 'Professional',
          price: '€99',
          priceAnnual: '€79',
          description: 'Für wachsende Unternehmen',
          features: [
            'Unbegrenzte KI-Anfragen',
            '24/7-Support',
            'Alle Funktionen',
            'Unbegrenzte Benutzer',
            'Benutzerdefinierte Integrationen',
            'API-Zugang'
          ]
        },
        cta: 'Loslegen'
      },
      auth: {
        login: 'Anmelden',
        signup: 'Registrieren',
        email: 'E-Mail',
        password: 'Passwort',
        forgotPassword: 'Passwort vergessen?',
        noAccount: 'Noch kein Konto?',
        hasAccount: 'Bereits ein Konto?',
        createAccount: 'Konto erstellen',
        welcomeBack: 'Willkommen zurück'
      },
      chat: {
        placeholder: 'Fragen Sie mich etwas...',
        welcome: 'Hallo! Wie kann ich Ihnen heute helfen?'
      }
    }
  },
  pt: {
    translation: {
      nav: {
        home: 'Início',
        accounting: 'Contabilidade e Financeiro',
        communication: 'Comunicação e Emails',
        administrative: 'Assistência Administrativa',
        hr: 'Recursos Humanos',
        marketing: 'Marketing e Vendas',
        pricing: 'Preços',
        login: 'Entrar',
        tryNow: 'Experimentar',
        logout: 'Sair'
      },
      hero: {
        title: 'O Seu Funcionário Digital',
        subtitle: 'Substitua vários funcionários por uma solução IA',
        description: 'Easycheck cuida da contabilidade, comunicação, RH, marketing e mais - poupe tempo e dinheiro',
        cta: 'Começar',
        savings: 'Poupe até 70% em custos de pessoal'
      },
      categories: {
        accounting: {
          title: 'Contabilidade & Financeiro',
          description: 'Emissão de faturas, gestão de despesas, faturação automática',
          features: {
            invoices: 'Emissão de Faturas',
            expenses: 'Gestão de Despesas',
            exports: 'Exportação de Software',
            billing: 'Faturação Automática'
          }
        },
        communication: {
          title: 'Comunicação & Emails',
          description: 'Respostas automáticas, agendamento de reuniões, follow-ups',
          features: {
            emails: 'Gestão de Emails',
            followups: 'Follow-ups Automáticos',
            meetings: 'Agendamento Reuniões',
            reminders: 'Lembretes Clientes'
          }
        },
        administrative: {
          title: 'Assistência Administrativa',
          description: 'Geração de relatórios, organização de planilhas, controle de tarefas',
          features: {
            reports: 'Geração de Relatórios',
            spreadsheets: 'Organização Planilhas',
            tasks: 'Controle de Tarefas',
            projects: 'Gestão de Projetos'
          }
        },
        hr: {
          title: 'Recursos Humanos',
          description: 'Triagem de currículos, agendamento de entrevistas, comunicação com candidatos',
          features: {
            screening: 'Triagem de Currículos',
            interviews: 'Agendamento Entrevistas',
            messaging: 'Mensagens Candidatos',
            onboarding: 'Automatização Integração'
          }
        },
        marketing: {
          title: 'Marketing & Vendas',
          description: 'Criação de conteúdo, respostas a leads, geração de campanhas',
          features: {
            posts: 'Posts Redes Sociais',
            leads: 'Respostas a Leads',
            campaigns: 'Geração de Campanhas',
            content: 'Criação de Conteúdo'
          }
        }
      },
      pricing: {
        title: 'Escolha o Seu Plano',
        monthly: 'Mensal',
        annual: 'Anual',
        save: 'Poupe 20%',
        free: {
          name: 'Gratuito',
          price: '€0',
          description: 'Experimente as funcionalidades básicas',
          features: [
            '10 pedidos IA por mês',
            'Suporte por email',
            'Funcionalidades básicas',
            'Utilizador único'
          ]
        },
        essential: {
          name: 'Essencial',
          price: '€49',
          priceAnnual: '€39',
          description: 'Perfeito para pequenas empresas',
          features: [
            '500 pedidos IA por mês',
            'Suporte prioritário',
            'Todas as funcionalidades',
            'Até 5 utilizadores',
            'Exportação software contabilidade'
          ]
        },
        professional: {
          name: 'Profissional',
          price: '€99',
          priceAnnual: '€79',
          description: 'Para empresas em crescimento',
          features: [
            'Pedidos IA ilimitados',
            'Suporte 24/7',
            'Todas as funcionalidades',
            'Utilizadores ilimitados',
            'Integrações personalizadas',
            'Acesso API'
          ]
        },
        cta: 'Começar'
      },
      auth: {
        login: 'Entrar',
        signup: 'Registar',
        email: 'Email',
        password: 'Palavra-passe',
        forgotPassword: 'Esqueceu a palavra-passe?',
        noAccount: 'Não tem conta?',
        hasAccount: 'Já tem conta?',
        createAccount: 'Crie a sua conta',
        welcomeBack: 'Bem-vindo de volta'
      },
      chat: {
        placeholder: 'Pergunte-me algo...',
        welcome: 'Olá! Como posso ajudar hoje?'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language.split('-')[0] || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
