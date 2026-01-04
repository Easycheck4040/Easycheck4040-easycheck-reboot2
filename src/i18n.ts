import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav.login": "Login", "nav.signup": "Sign Up", "nav.pricing": "Pricing",
      "hero.savings": "Faster, Cheaper, Smarter",
      "hero.title": "Run Your Entire Business on Autopilot with AI",
      "hero.description": "Why hire 5 employees when one AI can do it all? Save 90% on costs.",
      "hero.cta": "Start Saving Now",
      "login.title": "Welcome Back", "login.email": "Email", "login.password": "Password", "login.button": "Sign In", "login.forgot": "Forgot password?", "login.noAccount": "No account?", 
      "auth.createTitle": "Create Business Account", "auth.haveAccount": "Have account?", "auth.createSubtitle": "Start your free trial", "auth.loginSubtitle": "Access your dashboard",
      
      // NOVOS CAMPOS
      "auth.fullName": "Full Name",
      "auth.jobTitle": "Job Title (e.g. Director)",
      "auth.companyName": "Company Name",
      "auth.companyCode": "Company Code",
      "auth.iHaveCode": "I have a company code (I am an Employee)",
      "auth.iWantCreate": "Register new company",
      "auth.generateCode": "Company Code will be generated automatically.",
      
      // ... resto das traduções (mantém igual ou copia do passo anterior se preferires completo)
      "comparison.title": "Traditional Costs vs EasyCheck", "comparison.traditional": "The Expensive Way", "comparison.recommended": "The Smart Way", "comparison.total": "Total Monthly Cost:", "comparison.replace_text": "Replaces 5 Full-time Roles", "comparison.savings": "You save €13,601 per month!", "services.title": "Your AI Workforce", "categories.accounting.title": "AI Accounting", "categories.accounting.description": "Automated invoices.", "categories.communication.title": "Smart Communication", "categories.communication.description": "Smart emails.", "categories.administrative.title": "Admin Automation", "categories.administrative.description": "Doc organization.", "categories.hr.title": "HR Management", "categories.hr.description": "Team management.", "categories.marketing.title": "Growth Marketing", "categories.marketing.description": "Campaigns.", "categories.chat.title": "EasyCheck AI Chat", "categories.chat.description": "Your 24/7 advisor."
    }
  },
  pt: {
    translation: {
      "nav.login": "Entrar", "nav.signup": "Criar Conta", "nav.pricing": "Preços",
      "hero.savings": "Mais Rápido, Mais Fácil, Mais Barato",
      "hero.title": "Gere a Tua Empresa em Piloto Automático com IA",
      "hero.description": "Porquê contratar 5 funcionários quando uma IA faz tudo? Poupa 90% dos custos.",
      "hero.cta": "Começar a Poupar",
      "login.title": "Bem-vindo", "login.email": "Email", "login.password": "Palavra-passe", "login.button": "Entrar", "login.forgot": "Esqueceste a palavra-passe?", "login.noAccount": "Não tens conta?", 
      "auth.createTitle": "Criar Conta Empresarial", "auth.haveAccount": "Já tens conta?", "auth.createSubtitle": "Começa o teu teste grátis", "auth.loginSubtitle": "Acede ao teu painel",

      // NOVOS CAMPOS
      "auth.fullName": "Nome Completo",
      "auth.jobTitle": "Cargo (ex: Diretor, Vendedor)",
      "auth.companyName": "Nome da Empresa",
      "auth.companyCode": "Código da Empresa",
      "auth.iHaveCode": "Tenho um código de empresa (Sou Funcionário)",
      "auth.iWantCreate": "Quero registar uma nova empresa",
      "auth.generateCode": "O Código da Empresa será gerado automaticamente.",

      // ... resto das traduções
      "comparison.title": "Custo Tradicional vs EasyCheck", "comparison.traditional": "O Caminho Caro", "comparison.recommended": "O Caminho Inteligente", "comparison.total": "Custo Mensal Total:", "comparison.replace_text": "Substitui 5 Cargos a Tempo Inteiro", "comparison.savings": "Poupas €13,601 por mês!", "services.title": "A Tua Equipa de IA", "categories.accounting.title": "Contabilidade IA", "categories.accounting.description": "Faturas automáticas.", "categories.communication.title": "Comunicação Inteligente", "categories.communication.description": "Emails inteligentes.", "categories.administrative.title": "Automação Admin", "categories.administrative.description": "Organização documental.", "categories.hr.title": "Gestão de RH", "categories.hr.description": "Gestão de equipas.", "categories.marketing.title": "Marketing de Crescimento", "categories.marketing.description": "Campanhas.", "categories.chat.title": "Chat EasyCheck IA", "categories.chat.description": "O teu consultor 24/7."
    }
  },
  // Mantém as outras línguas resumidas para não ocupar espaço
  fr: { translation: { "nav.login": "Connexion", "auth.createTitle": "Créer un Compte" } },
  es: { translation: { "nav.login": "Acceso", "auth.createTitle": "Crear Cuenta" } },
  de: { translation: { "nav.login": "Anmelden", "auth.createTitle": "Konto Erstellen" } },
  it: { translation: { "nav.login": "Accedi", "auth.createTitle": "Crea Account" } }
};

i18n.use(initReactI18next).init({ resources, lng: "pt", fallbackLng: "en", interpolation: { escapeValue: false } });
export default i18n;