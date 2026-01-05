import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  // --- INGLÊS (EN) ---
  en: {
    translation: {
      // NAV
      "nav.home": "Home", "nav.pricing": "Pricing", "nav.contact": "Contact", "nav.login": "Login", "nav.signup": "Sign Up", "nav.logout": "Log Out", "nav.dashboard": "Dashboard",
      
      // HERO & SERVICES (Descrições Detalhadas)
      "hero.title": "Run Your Business on Autopilot", 
      "hero.description": "Save 90% on costs and eliminate manual errors with AI integration.", 
      "hero.cta": "Start Saving Now",
      "services.title": "Your AI Workforce",
      "categories.accounting.title": "AI Accounting", "categories.accounting.description": "Automated invoices, expense tracking, OCR receipt scanning, and real-time tax calculation.",
      "categories.communication.title": "Smart Communication", "categories.communication.description": "AI reads emails, categorizes them, and drafts professional responses instantly for your review.",
      "categories.hr.title": "HR Management", "categories.hr.description": "Streamlined payroll processing, vacation tracking, performance reviews, and automated employee onboarding.",
      "categories.marketing.title": "Growth Marketing", "categories.marketing.description": "Auto-create and schedule ad campaigns, generate social media content, and analyze performance metrics.",
      "categories.administrative.title": "Admin Automation", "categories.administrative.description": "Digital filing, contract data extraction, scheduling, and automated data entry across platforms.",
      "categories.chat.title": "AI Business Assistant", "categories.chat.description": "Your 24/7 intelligent advisor capable of answering queries, generating reports, and executing tasks via chat.",

      // COMPARISON SECTION (Correção dos Prints)
      "comparison.title": "Why Choose EasyCheck?",
      "comparison.traditional": "Traditional Method",
      "comparison.recommended": "Recommended",
      "comparison.replace_text": "Replaces 5+ Salaries",
      "comparison.total": "Total Cost",
      "comparison.savings": "Estimated Annual Savings",
      "roles.accountant": "Accountant", "roles.admin": "Admin Assistant", "roles.hr": "HR Manager", "roles.marketing": "Marketing Specialist", "roles.support": "Customer Support",

      // AUTH (LOGIN & SIGNUP - Correção dos Prints)
      "login.title": "Welcome Back", "auth.loginSubtitle": "Enter your credentials to access your account.",
      "login.email": "Email Address", "login.password": "Password", "login.button": "Sign In", "login.forgot": "Forgot password?", "login.noAccount": "Don't have an account? Sign Up",
      "auth.createTitle": "Create Account", "auth.createSubtitle": "Start automating your business today.",
      "auth.fullName": "Full Name", "auth.jobTitle": "Job Title", "auth.iHaveCode": "I have a company invite code",
      "auth.companyName": "Company Name", "auth.generateCode": "Generate New Company", "auth.haveAccount": "Already have an account? Login",

      // CONTACT PAGE (Correção Completa)
      "contact.title": "How can we help?", "contact.subtitle": "Our team is ready.",
      "contact.greeting.morning": "Good morning", "contact.greeting.afternoon": "Good afternoon", "contact.greeting.night": "Good evening",
      "contact.status.title": "System Status", "contact.status.online": "ONLINE",
      "contact.status.servers": "Servers", "contact.status.response": "Response Time", "contact.status.caffeine": "Caffeine Level",
      "contact.direct_email.title": "Direct Email", "contact.direct_email.subtitle": "For urgent matters",
      "contact.form.name": "Name", "contact.form.name_placeholder": "Ex: John Doe",
      "contact.form.email": "Email", "contact.form.email_placeholder": "Ex: john@company.com",
      "contact.form.subject": "Subject", "contact.subjects.general": "General Inquiry",
      "contact.form.message": "Message", "contact.form.message_placeholder": "How can we help?",
      "contact.form.send": "Send Message", "contact.form.success": "Message sent!",

      // FOOTER (Correção dos Prints)
      "footer.slogan": "AI-powered business management.", "footer.company": "Company", "footer.legal": "Legal", "footer.privacy": "Privacy Policy", "footer.terms": "Terms of Service", "footer.complaints": "Complaints", "footer.rights": "All rights reserved.",

      // DASHBOARD MENU
      "dashboard.menu.overview": "Overview", "dashboard.menu.company": "Company Management", "dashboard.menu.chat": "AI Chat", "dashboard.menu.accounting": "Accounting", "dashboard.menu.communication": "Communication", "dashboard.menu.hr": "HR", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Settings", "dashboard.menu.logout": "Log Out",
      
      // DASHBOARD CONTENT
      "dashboard.welcome": "Welcome", "dashboard.subtitle": "Your AI assistant is ready.", "dashboard.open_chat": "Open Chat",
      "dashboard.stats.revenue": "Revenue", "dashboard.stats.actions": "AI Actions", "dashboard.stats.invoices": "Invoices",
      "notifications.title": "Notifications", "notifications.empty": "No new notifications.",

      // PROFILE & SETTINGS
      "profile.edit": "Edit Profile", "profile.edit_title": "Edit Profile", 
      "profile.company_section": "Company Information", "PROFILE.COMPANY_SECTION": "Company Information",
      "profile.delete": "Delete Account", "profile.success": "Updated successfully!",
      "role.owner": "Owner", "role.employee": "Employee",
      "delete.title": "Danger Zone", "delete.text": "Delete account? Type ELIMINAR:",
      
      // COMPANY MANAGEMENT
      "settings.company_title": "Company Management", "settings.invite_code": "Invite Code", "settings.invite_text": "Share with employees.", "settings.team_members": "Team Members", "settings.no_members": "No employees yet.", "settings.restricted_title": "Restricted", "settings.restricted_text": "Owner only.",
      
      // COMMON
      "common.save": "Save", "common.cancel": "Cancel", "common.delete": "Delete",
      "form.fullname": "Full Name", "form.jobtitle": "Job Title", "form.email": "Email", "form.company_name": "Company Name", "form.address": "Address", "form.nif": "Tax ID", "form.code": "Company Code",
      "table.name": "Name", "table.email": "Email", "table.role": "Role", "table.actions": "Actions",
      "team.edit_role": "Edit Role", "team.role_updated": "Role updated!", "team.delete_confirm": "Remove employee?", "team.member_removed": "Removed."
    }
  },

  // --- PORTUGUÊS (PT) ---
  pt: {
    translation: {
      "nav.home": "Início", "nav.pricing": "Preços", "nav.contact": "Contactos", "nav.login": "Entrar", "nav.signup": "Criar Conta", "nav.logout": "Sair", "nav.dashboard": "Dashboard",
      
      // HERO & SERVICES
      "hero.title": "Gere a Tua Empresa em Piloto Automático", 
      "hero.description": "Poupa 90% dos custos e elimina erros manuais com a nossa integração de IA.", "hero.cta": "Começar a Poupar",
      "services.title": "A Tua Equipa de IA",
      "categories.accounting.title": "Contabilidade IA", "categories.accounting.description": "Faturas automáticas, rastreio de despesas, leitura OCR de recibos e cálculo de impostos em tempo real.",
      "categories.communication.title": "Comunicação Inteligente", "categories.communication.description": "A IA lê emails, categoriza-os e rascunha respostas profissionais instantaneamente para tua revisão.",
      "categories.hr.title": "Gestão de RH", "categories.hr.description": "Processamento salarial simplificado, gestão de férias, avaliações de desempenho e onboarding automático.",
      "categories.marketing.title": "Marketing Digital", "categories.marketing.description": "Criação e agendamento automático de campanhas, geração de conteúdo para redes sociais e análise de métricas.",
      "categories.administrative.title": "Automação Admin", "categories.administrative.description": "Arquivo digital, extração de dados de contratos, agendamento e entrada de dados automática entre plataformas.",
      "categories.chat.title": "Assistente de Negócios IA", "categories.chat.description": "O teu consultor inteligente 24/7 capaz de responder a questões, gerar relatórios e executar tarefas via chat.",

      // COMPARAÇÃO
      "comparison.title": "Porquê Escolher a EasyCheck?", "comparison.traditional": "Método Tradicional", "comparison.recommended": "Recomendado", "comparison.replace_text": "Substitui 5+ Salários", "comparison.total": "Custo Total", "comparison.savings": "Poupança Anual Estimada",
      "roles.accountant": "Contabilista", "roles.admin": "Assistente Admin", "roles.hr": "Gestor de RH", "roles.marketing": "Especialista Marketing", "roles.support": "Apoio ao Cliente",

      // AUTH
      "login.title": "Bem-vindo de Volta", "auth.loginSubtitle": "Insere as tuas credenciais para aceder.",
      "login.email": "Endereço de Email", "login.password": "Palavra-passe", "login.button": "Entrar", "login.forgot": "Esqueceste-te da senha?", "login.noAccount": "Não tens conta? Cria uma",
      "auth.createTitle": "Criar Conta", "auth.createSubtitle": "Começa a automatizar o teu negócio hoje.", "auth.fullName": "Nome Completo", "auth.jobTitle": "Cargo", "auth.iHaveCode": "Tenho um código de convite", "auth.companyName": "Nome da Empresa", "auth.generateCode": "Gerar Nova Empresa", "auth.haveAccount": "Já tens conta? Entrar",

      // CONTACTOS
      "contact.title": "Como podemos ajudar?", "contact.subtitle": "A nossa equipa está pronta.",
      "contact.greeting.morning": "Bom dia", "contact.greeting.afternoon": "Boa tarde", "contact.greeting.night": "Boa noite",
      "contact.status.title": "Estado do Sistema", "contact.status.online": "ONLINE",
      "contact.status.servers": "Servidores", "contact.status.response": "Tempo de Resposta", "contact.status.caffeine": "Nível de Cafeína",
      "contact.direct_email.title": "Email Direto", "contact.direct_email.subtitle": "Para assuntos urgentes",
      "contact.form.name": "Nome", "contact.form.name_placeholder": "Ex: João Silva",
      "contact.form.email": "Email", "contact.form.email_placeholder": "Ex: joao@empresa.com",
      "contact.form.subject": "Assunto", "contact.subjects.general": "Informação Geral",
      "contact.form.message": "Mensagem", "contact.form.message_placeholder": "Como podemos ajudar?",
      "contact.form.send": "Enviar Mensagem", "contact.form.success": "Mensagem enviada!",

      // FOOTER
      "footer.slogan": "Gestão empresarial com IA.", "footer.company": "Empresa", "footer.legal": "Legal", "footer.privacy": "Privacidade", "footer.terms": "Termos", "footer.complaints": "Livro de Reclamações", "footer.rights": "Todos os direitos reservados.",

      // DASHBOARD
      "dashboard.menu.overview": "Visão Geral", "dashboard.menu.company": "Gestão da Empresa", "dashboard.menu.chat": "Chat IA", "dashboard.menu.accounting": "Contabilidade", "dashboard.menu.communication": "Comunicação", "dashboard.menu.hr": "Recursos Humanos", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Definições", "dashboard.menu.logout": "Sair da Conta",
      "dashboard.welcome": "Bem-vindo", "dashboard.subtitle": "O teu assistente IA está pronto.", "dashboard.open_chat": "Abrir Chat IA",
      "dashboard.stats.revenue": "Receita Mensal", "dashboard.stats.actions": "Ações IA", "dashboard.stats.invoices": "Faturas",
      "notifications.title": "Notificações", "notifications.empty": "Sem notificações.",

      // PERFIL & MODAIS
      "profile.edit": "Editar Perfil", "profile.edit_title": "Editar Perfil", 
      "profile.company_section": "Informação da Empresa", "PROFILE.COMPANY_SECTION": "Informação da Empresa",
      "profile.delete": "Eliminar Conta", "profile.success": "Atualizado!",
      "role.owner": "Patrão", "role.employee": "Funcionário",
      "delete.title": "Zona de Perigo", "delete.text": "Apagar conta? Escreve ELIMINAR:",
      
      // GESTÃO EMPRESA
      "settings.company_title": "Gestão da Empresa", "settings.invite_code": "Código de Convite", "settings.invite_text": "Partilha com funcionários.", "settings.team_members": "Membros", "settings.no_members": "Sem funcionários.", "settings.restricted_title": "Acesso Restrito", "settings.restricted_text": "Apenas o patrão pode ver.",
      
      // COMUM
      "common.save": "Guardar", "common.cancel": "Cancelar", "common.delete": "Apagar",
      "form.fullname": "Nome Completo", "form.jobtitle": "Cargo", "form.email": "Email", "form.company_name": "Nome da Empresa", "form.address": "Morada", "form.nif": "NIF", "form.code": "Código da Empresa",
      "table.name": "Nome", "table.email": "Email", "table.role": "Cargo", "table.actions": "Ações",
      "team.edit_role": "Editar Cargo", "team.role_updated": "Cargo atualizado!", "team.delete_confirm": "Remover funcionário?", "team.member_removed": "Removido."
    }
  },

  // --- FRANCÊS (FR) - Resumido mas funcional ---
  fr: { translation: { "login.title": "Connexion", "auth.createTitle": "Créer Compte", "comparison.title": "Pourquoi EasyCheck?", "profile.company_section": "Info Entreprise", "PROFILE.COMPANY_SECTION": "Info Entreprise", "common.save": "Enregistrer", "form.code": "Code Entreprise", "settings.company_title": "Gestion Entreprise" } },
  es: { translation: { "login.title": "Acceso", "auth.createTitle": "Crear Cuenta", "comparison.title": "¿Por qué EasyCheck?", "profile.company_section": "Info Empresa", "PROFILE.COMPANY_SECTION": "Info Empresa", "common.save": "Guardar", "form.code": "Código Empresa", "settings.company_title": "Gestión Empresa" } },
  de: { translation: { "login.title": "Anmelden", "auth.createTitle": "Konto Erstellen", "comparison.title": "Warum EasyCheck?", "profile.company_section": "Firmeninfo", "PROFILE.COMPANY_SECTION": "Firmeninfo", "common.save": "Speichern", "form.code": "Firmencode", "settings.company_title": "Firmenverwaltung" } },
  it: { translation: { "login.title": "Accedi", "auth.createTitle": "Crea Account", "comparison.title": "Perché EasyCheck?", "profile.company_section": "Info Azienda", "PROFILE.COMPANY_SECTION": "Info Azienda", "common.save": "Salva", "form.code": "Codice Azienda", "settings.company_title": "Gestione Azienda" } }
};

i18n.use(initReactI18next).init({
  resources, 
  lng: "pt", 
  fallbackLng: "en", 
  interpolation: { escapeValue: false }
});

export default i18n;