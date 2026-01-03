import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector) // Deteta se o PC está em PT ou EN
  .use(initReactI18next)
  .init({
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
          // Secção de Comparação
          "comparison.title": "Traditional vs Easycheck: Cost Comparison",
          "comparison.subtitle": "See how much you can save by switching to Easycheck",
          "comparison.traditional": "Traditional Way",
          "comparison.traditional.sub": "Multiple employees needed",
          "comparison.easycheck": "Easycheck Way",
          "comparison.easycheck.sub": "One AI-powered solution",
          "comparison.accountant": "Accountant",
          "comparison.admin": "Admin Assistant",
          "comparison.hr": "HR Manager",
          "comparison.marketing": "Marketing Specialist",
          "comparison.support": "Customer Support",
          "comparison.total": "Total Monthly Cost",
          "comparison.features.all": "Replaces all 5 employees",
          "comparison.features.247": "24/7 Available",
          "comparison.features.multi": "Multilingual",
          "comparison.save": "You Save",
          "comparison.perYear": "per year!",
          // Categorias
          "categories.available": "Available Services",
          "categories.desc": "Explore all the ways EasyCheck can transform your business operations",
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
          // Secção de Comparação
          "comparison.title": "Tradicional vs Easycheck: Comparação",
          "comparison.subtitle": "Vê quanto podes poupar ao mudar para o Easycheck",
          "comparison.traditional": "Método Tradicional",
          "comparison.traditional.sub": "Vários empregados necessários",
          "comparison.easycheck": "Método Easycheck",
          "comparison.easycheck.sub": "Uma solução de IA",
          "comparison.accountant": "Contabilista",
          "comparison.admin": "Assistente Admin",
          "comparison.hr": "Gestor de RH",
          "comparison.marketing": "Especialista Marketing",
          "comparison.support": "Apoio ao Cliente",
          "comparison.total": "Custo Mensal Total",
          "comparison.features.all": "Substitui 5 funções",
          "comparison.features.247": "Disponível 24/7",
          "comparison.features.multi": "Multilingue",
          "comparison.save": "Tu Poupas",
          "comparison.perYear": "por ano!",
          // Categorias
          "categories.available": "Serviços Disponíveis",
          "categories.desc": "Explora como o EasyCheck pode transformar o teu negócio",
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