import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'pt', 
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
        "nav.tryNow": "Try Demo",
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
        "hero.description": "Deixa de perder tempo com papelada. Cria faturas, gere clientes e envia recibos em segundos. Tudo automático.",
        "hero.savings": "Poupança Garantida",
        "hero.cta": "Começar Agora",
        "nav.pricing": "Preços",
        "nav.login": "Entrar",
        "nav.tryNow": "Ver Demo",
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
    }
  }
});

export default i18n;