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
        "hero.subtitle": "Save time and money with AI.",
        "hero.cta": "Get Started",
        "nav.login": "Login",
        "categories.accounting.title": "Accounting",
        "categories.accounting.description": "Automated invoices and reports",
        // Podes adicionar mais traduções aqui depois
      }
    },
    pt: {
      translation: {
        "hero.title": "Automatiza o Teu Negócio",
        "hero.subtitle": "Poupa tempo e dinheiro com IA.",
        "hero.cta": "Começar Agora",
        "nav.login": "Entrar",
        "nav.pricing": "Preços",
        "hero.savings": "Poupança Garantida",
        "hero.description": "O assistente virtual que nunca dorme.",
        "categories.accounting.title": "Contabilidade",
        "categories.accounting.description": "Faturas e relatórios automáticos",
        "categories.communication.title": "Comunicação",
        "categories.communication.description": "Emails e chat automático",
        "categories.administrative.title": "Administrativo",
        "categories.administrative.description": "Organização de documentos",
        "categories.hr.title": "Recursos Humanos",
        "categories.hr.description": "Gestão de equipas",
        "categories.marketing.title": "Marketing",
        "categories.marketing.description": "Campanhas e redes sociais",
        "nav.tryNow": "Experimentar"
      }
    }
  }
});

export default i18n;