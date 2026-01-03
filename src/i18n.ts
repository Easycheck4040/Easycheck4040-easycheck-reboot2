import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'pt', // Começa em Português
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  resources: {
    en: {
      translation: {
        "hero.title": "Automate Your Business",
        "hero.subtitle": "AI-powered management for modern entrepreneurs.",
        "hero.description": "Stop wasting time on paperwork. Generate invoices, manage clients, and track payments automatically.",
        "hero.savings": "Guaranteed Savings",
        "hero.cta": "Start Now",
        "nav.pricing": "Pricing",
        "nav.login": "Login",
        "nav.signup": "Create Account", // Novo
        "nav.tryNow": "Try Demo",
        "login.title": "Welcome Back",
        "login.email": "Your Email",
        "login.password": "Your Password",
        "login.button": "Sign In",
        "login.forgot": "Forgot password?",
        "login.noAccount": "Don't have an account?",
        "login.register": "Sign up",
        "categories.accounting.title": "Accounting",
        "categories.accounting.description": "Automated invoices & tax",
        "categories.communication.title": "Communication",
        "categories.communication.description": "Smart emails & chat",
        "categories.administrative.title": "Admin",
        "categories.administrative.description": "Document organization",
        "categories.hr.title": "HR",
        "categories.hr.description": "Team management",
        "categories.marketing.title": "Marketing",
        "categories.marketing.description": "Growth & Socials"
      }
    },
    pt: {
      translation: {
        "hero.title": "Automatiza o Teu Negócio",
        "hero.subtitle": "Gestão inteligente para empreendedores modernos.",
        "hero.description": "Deixa de perder tempo com papelada. Cria faturas, gere clientes e envia recibos em segundos.",
        "hero.savings": "Poupança Garantida",
        "hero.cta": "Começar Agora",
        "nav.pricing": "Preços",
        "nav.login": "Entrar",
        "nav.signup": "Criar Conta", // Novo
        "nav.tryNow": "Ver Demo",
        "login.title": "Bem-vindo de volta",
        "login.email": "O teu email",
        "login.password": "A tua palavra-passe",
        "login.button": "Entrar",
        "login.forgot": "Esqueceste a palavra-passe?",
        "login.noAccount": "Ainda não tens conta?",
        "login.register": "Criar conta",
        "categories.accounting.title": "Contabilidade",
        "categories.accounting.description": "Faturas e impostos auto",
        "categories.communication.title": "Comunicação",
        "categories.communication.description": "Emails e chat inteligente",
        "categories.administrative.title": "Administrativo",
        "categories.administrative.description": "Organização documental",
        "categories.hr.title": "Recursos Humanos",
        "categories.hr.description": "Gestão de equipas",
        "categories.marketing.title": "Marketing",
        "categories.marketing.description": "Crescimento e Redes"
      }
    },
    fr: {
      translation: {
        "hero.title": "Automatisez Votre Entreprise",
        "hero.subtitle": "Gestion intelligente pour les entrepreneurs modernes.",
        "hero.description": "Arrêtez de perdre du temps avec la paperasse. Créez des factures et gérez vos clients automatiquement.",
        "hero.savings": "Économies Garanties",
        "hero.cta": "Commencer",
        "nav.pricing": "Tarifs",
        "nav.login": "Connexion",
        "nav.signup": "Créer un compte",
        "nav.tryNow": "Démo",
        "categories.accounting.title": "Comptabilité",
        "categories.accounting.description": "Factures automatisées",
        "categories.communication.title": "Communication",
        "categories.communication.description": "Emails intelligents",
        "categories.administrative.title": "Administratif",
        "categories.administrative.description": "Organisation de documents",
        "categories.hr.title": "RH",
        "categories.hr.description": "Gestion d'équipe",
        "categories.marketing.title": "Marketing",
        "categories.marketing.description": "Croissance et Réseaux"
      }
    }
  }
});

export default i18n;