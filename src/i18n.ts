import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav.login": "Login", "nav.signup": "Sign Up",
      "hero.savings": "Guaranteed Savings", "hero.title": "Automate Your Business", "hero.description": "Stop wasting time on paperwork.", "hero.cta": "Start Now",
      "comparison.title": "Traditional vs EasyCheck Cost", "comparison.traditional": "Traditional Way", "comparison.recommended": "Best Choice",
      "categories.accounting.title": "Accounting", "categories.accounting.description": "Automated invoices",
      "categories.communication.title": "Communication", "categories.communication.description": "Smart emails",
      "categories.administrative.title": "Administrative", "categories.administrative.description": "Doc organization",
      "categories.hr.title": "HR", "categories.hr.description": "Team management",
      "categories.marketing.title": "Marketing", "categories.marketing.description": "Growth & Socials",
      "login.title": "Welcome Back", "login.email": "Email", "login.password": "Password", "login.button": "Sign In", "login.forgot": "Forgot password?", "login.noAccount": "No account?", "auth.createTitle": "Create Account", "auth.haveAccount": "Have account?"
    }
  },
  pt: {
    translation: {
      "nav.login": "Entrar", "nav.signup": "Criar Conta",
      "hero.savings": "Poupança Garantida", "hero.title": "Automatiza o Teu Negócio", "hero.description": "Deixa de perder tempo com papelada.", "hero.cta": "Começar Agora",
      "comparison.title": "Custo: Tradicional vs EasyCheck", "comparison.traditional": "Método Tradicional", "comparison.recommended": "Melhor Escolha",
      "categories.accounting.title": "Contabilidade", "categories.accounting.description": "Faturas automáticas",
      "categories.communication.title": "Comunicação", "categories.communication.description": "Emails inteligentes",
      "categories.administrative.title": "Administrativo", "categories.administrative.description": "Organização documental",
      "categories.hr.title": "Recursos Humanos", "categories.hr.description": "Gestão de equipas",
      "categories.marketing.title": "Marketing", "categories.marketing.description": "Crescimento",
      "login.title": "Bem-vindo", "login.email": "Email", "login.password": "Palavra-passe", "login.button": "Entrar", "login.forgot": "Esqueceste a palavra-passe?", "login.noAccount": "Não tens conta?", "auth.createTitle": "Criar Conta", "auth.haveAccount": "Já tens conta?"
    }
  },
  fr: { translation: { "hero.title": "Automatisez Votre Entreprise" } },
  es: { translation: { "hero.title": "Automatiza Tu Negocio" } },
  de: { translation: { "hero.title": "Automatisieren Sie Ihr Geschäft" } },
  it: { translation: { "hero.title": "Automatizza Il Tuo Business" } }
};

i18n.use(initReactI18next).init({
  resources, lng: "pt", fallbackLng: "en", interpolation: { escapeValue: false }
});

export default i18n;