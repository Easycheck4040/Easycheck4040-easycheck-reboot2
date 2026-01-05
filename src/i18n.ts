import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  // --- INGLÊS (EN) ---
  en: {
    translation: {
      // NAV
      "nav.home": "Home", "nav.pricing": "Pricing", "nav.contact": "Contact", "nav.login": "Login", "nav.signup": "Sign Up", "nav.logout": "Log Out", "nav.dashboard": "Dashboard",
      
      // HERO & SERVICES
      "hero.savings": "AI-Powered Savings", // <--- CORREÇÃO DA IMAGEM CIRCULADA
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

      // COMPARISON SECTION (Novas chaves das imagens)
      "comparison.title": "Why Choose EasyCheck?",
      "comparison.traditional": "Traditional Method",
      "comparison.recommended": "Recommended",
      "comparison.replace_text": "Replaces 5+ Salaries",
      "comparison.total": "Total Cost",
      "comparison.savings": "Estimated Annual Savings",
      "roles.accountant": "Accountant", "roles.admin": "Admin Assistant", "roles.hr": "HR Manager", "roles.marketing": "Marketing Specialist", "roles.support": "Customer Support",

      // AUTH (LOGIN & SIGNUP - Novas chaves das imagens)
      "login.title": "Welcome Back", "auth.loginSubtitle": "Enter your credentials to access your account.",
      "login.email": "Email Address", "login.password": "Password", "login.button": "Sign In", "login.forgot": "Forgot password?", "login.noAccount": "Don't have an account? Sign Up",
      "auth.createTitle": "Create Account", "auth.createSubtitle": "Start automating your business today.",
      "auth.fullName": "Full Name", "auth.jobTitle": "Job Title", "auth.iHaveCode": "I have a company invite code",
      "auth.companyName": "Company Name", "auth.generateCode": "Generate New Company", "auth.haveAccount": "Already have an account? Login",

      // CONTACT PAGE (Completo)
      "contact.title": "How can we help?", "contact.subtitle": "Our team (and AI) are ready to answer.",
      // Saudações que faltavam
      "contact.greeting.morning": "Good morning", "contact.greeting.afternoon": "Good afternoon", "contact.greeting.night": "Good evening",
      // Estados do sistema que faltavam
      "contact.status.title": "System Status", "contact.status.online": "ONLINE",
      "contact.status.servers": "Servers", "contact.status.response": "Avg. Response Time", "contact.status.caffeine": "Caffeine Level",
      "contact.direct_email.title": "Direct Email", "contact.direct_email.subtitle": "For urgent matters",
      // Formulário
      "contact.form.name": "Name", "contact.form.name_placeholder": "Ex: John Doe",
      "contact.form.email": "Email", "contact.form.email_placeholder": "Ex: john@company.com",
      "contact.form.subject": "Subject", "contact.subjects.general": "General Inquiry",
      "contact.form.message": "Message", "contact.form.message_placeholder": "How can we help you today?",
      "contact.form.send": "Send Message", "contact.form.success": "Message sent successfully!",

      // FOOTER (Novas chaves das imagens)
      "footer.slogan": "AI-powered business management for the modern era.",
      "footer.company": "Company", "footer.legal": "Legal", "footer.privacy": "Privacy Policy", "footer.terms": "Terms of Service", "footer.complaints": "Complaints Book", "footer.rights": "All rights reserved.",

      // DASHBOARD MENU
      "dashboard.menu.overview": "Overview", 
      "dashboard.menu.company": "Company Management", // <--- Faltava esta chave
      "dashboard.menu.chat": "AI Chat", 
      "dashboard.menu.accounting": "Accounting", 
      "dashboard.menu.communication": "Communication", 
      "dashboard.menu.hr": "Human Resources", 
      "dashboard.menu.marketing": "Marketing", 
      "dashboard.menu.settings": "Settings", 
      "dashboard.menu.logout": "Log Out",
      
      // DASHBOARD CONTENT
      "dashboard.welcome": "Welcome", "dashboard.subtitle": "Your AI assistant is ready.", "dashboard.open_chat": "Open AI Chat",
      "dashboard.stats.revenue": "Monthly Revenue", "dashboard.stats.actions": "AI Actions", "dashboard.stats.invoices": "Pending Invoices",
      "notifications.title": "Notifications", "notifications.empty": "No new notifications.",

      // PROFILE & MODALS
      "profile.edit": "Edit Profile", "profile.edit_title": "Edit Profile", 
      "profile.company_section": "Company Information",
      "PROFILE.COMPANY_SECTION": "Company Information", // <--- CORREÇÃO CRÍTICA PARA O MODAL (MAIÚSCULAS)
      "profile.delete": "Delete Account", "profile.success": "Updated successfully!",
      "role.owner": "Owner", "role.employee": "Employee",
      "delete.title": "Danger Zone", "delete.text": "Delete account permanently? Type ELIMINAR:",
      
      // COMPANY MANAGEMENT (Page)
      "settings.company_title": "Company Management", "settings.invite_code": "Invite Code", "settings.invite_text": "Share this code with your employees.", "settings.team_members": "Team Members", "settings.no_members": "No employees registered yet.", "settings.restricted_title": "Access Restricted", "settings.restricted_text": "Only the company owner can access this area.",
      
      // FORMS & COMMON
      "common.save": "Save", "common.saving": "Saving...", "common.cancel": "Cancel", "common.delete": "Delete",
      "form.fullname": "Full Name", "form.jobtitle": "Job Title", "form.email": "Email",
      "form.company_name": "Company Name", "form.address": "Address", "form.nif": "Tax ID (NIF)", "form.code": "Code",
      "table.name": "Name", "table.email": "Email", "table.role": "Role", "table.actions": "Actions",
      "team.edit_role": "Edit Role", "team.role_updated": "Role updated!", "team.delete_confirm": "Remove this employee?", "team.member_removed": "Employee removed."
    }
  },

  // --- PORTUGUÊS (PT) ---
  pt: {
    translation: {
      "nav.home": "Início", "nav.pricing": "Preços", "nav.contact": "Contactos", "nav.login": "Entrar", "nav.signup": "Criar Conta", "nav.logout": "Sair", "nav.dashboard": "Dashboard",
      
      // HERO & SERVICES
      "hero.savings": "Poupança com IA", // <--- CORREÇÃO DA IMAGEM CIRCULADA
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
      "contact.title": "Como podemos ajudar?", "contact.subtitle": "A nossa equipa (e IA) estão prontas para responder.",
      "contact.greeting.morning": "Bom dia", "contact.greeting.afternoon": "Boa tarde", "contact.greeting.night": "Boa noite",
      "contact.status.title": "Estado do Sistema", "contact.status.online": "ONLINE",
      "contact.status.servers": "Servidores", "contact.status.response": "Tempo de Resposta", "contact.status.caffeine": "Nível de Cafeína",
      "contact.direct_email.title": "Email Direto", "contact.direct_email.subtitle": "Para assuntos urgentes",
      "contact.form.name": "Nome", "contact.form.name_placeholder": "Ex: João Silva",
      "contact.form.email": "Email", "contact.form.email_placeholder": "Ex: joao@empresa.com",
      "contact.form.subject": "Assunto", "contact.subjects.general": "Informação Geral",
      "contact.form.message": "Mensagem", "contact.form.message_placeholder": "Como podemos ajudar hoje?",
      "contact.form.send": "Enviar Mensagem", "contact.form.success": "Mensagem enviada com sucesso!",

      // FOOTER
      "footer.slogan": "Gestão empresarial impulsionada por IA para a era moderna.",
      "footer.company": "Empresa", "footer.legal": "Legal", "footer.privacy": "Política de Privacidade", "footer.terms": "Termos de Serviço", "footer.complaints": "Livro de Reclamações", "footer.rights": "Todos os direitos reservados.",

      // DASHBOARD
      "dashboard.menu.overview": "Visão Geral", 
      "dashboard.menu.company": "Gestão da Empresa", // <--- Faltava esta chave
      "dashboard.menu.chat": "Chat IA", 
      "dashboard.menu.accounting": "Contabilidade", 
      "dashboard.menu.communication": "Comunicação", 
      "dashboard.menu.hr": "Recursos Humanos", 
      "dashboard.menu.marketing": "Marketing", 
      "dashboard.menu.settings": "Definições", 
      "dashboard.menu.logout": "Sair da Conta",
      
      "dashboard.welcome": "Bem-vindo", "dashboard.subtitle": "O teu assistente IA está pronto.", "dashboard.open_chat": "Abrir Chat IA",
      "dashboard.stats.revenue": "Receita Mensal", "dashboard.stats.actions": "Ações IA", "dashboard.stats.invoices": "Faturas",
      "notifications.title": "Notificações", "notifications.empty": "Sem novas notificações.",

      // PERFIL & MODAIS
      "profile.edit": "Editar Perfil", "profile.edit_title": "Editar Perfil", 
      "profile.company_section": "Informação da Empresa",
      "PROFILE.COMPANY_SECTION": "Informação da Empresa", // <--- CORREÇÃO CRÍTICA PARA O MODAL
      "profile.delete": "Eliminar Conta", "profile.success": "Atualizado com sucesso!",
      "role.owner": "Patrão", "role.employee": "Funcionário",
      "delete.title": "Zona de Perigo", "delete.text": "Apagar conta permanentemente? Escreve ELIMINAR:",
      
      "settings.company_title": "Gestão da Empresa", "settings.invite_code": "Código de Convite", "settings.invite_text": "Partilha este código com os teus funcionários.", "settings.team_members": "Membros da Equipa", "settings.no_members": "Ainda não tens funcionários registados.", "settings.restricted_title": "Acesso Restrito", "settings.restricted_text": "Apenas o patrão pode aceder a esta área.",
      
      // FORMS & COMMON
      "common.save": "Guardar", "common.saving": "A Guardar...", "common.cancel": "Cancelar", "common.delete": "Apagar",
      "form.fullname": "Nome Completo", "form.jobtitle": "Cargo", "form.email": "Email",
      "form.company_name": "Nome da Empresa", "form.address": "Morada", "form.nif": "NIF", "form.code": "Código",
      "table.name": "Nome", "table.email": "Email", "table.role": "Cargo", "table.actions": "Ações",
      "team.edit_role": "Editar Cargo", "team.role_updated": "Cargo atualizado!", "team.delete_confirm": "Remover este funcionário?", "team.member_removed": "Funcionário removido."
    }
  },

  // --- FRANCÊS (FR) - Completo com as novas chaves ---
  fr: {
    translation: {
      "nav.home": "Accueil", "nav.pricing": "Tarifs", "nav.contact": "Contact", "nav.login": "Connexion", "nav.signup": "S'inscrire", "nav.logout": "Déconnexion", "nav.dashboard": "Tableau de bord",
      "hero.savings": "Économies IA",
      "hero.title": "Gérez Votre Entreprise en Pilote Automatique", "hero.description": "Économisez 90% des coûts et éliminez les erreurs manuelles.", "hero.cta": "Commencer",
      "services.title": "Votre Équipe IA",
      "categories.accounting.description": "Factures automatisées, suivi des dépenses et calcul des impôts.", 
      "categories.communication.description": "Lecture et rédaction automatique d'emails professionnels.", 
      "categories.hr.description": "Gestion de la paie, des congés et des employés.",
      "comparison.title": "Pourquoi EasyCheck?", "comparison.traditional": "Méthode Traditionnelle", "comparison.recommended": "Recommandé", "comparison.total": "Coût Total", "comparison.savings": "Économies Estimées",
      "login.title": "Connexion", "auth.loginSubtitle": "Entrez vos identifiants.", "login.button": "Se connecter", "login.noAccount": "Pas de compte? S'inscrire",
      "auth.createTitle": "Créer Compte", "auth.createSubtitle": "Automatisez votre entreprise.", "auth.fullName": "Nom Complet", "auth.companyName": "Nom Entreprise", "auth.haveAccount": "Déjà un compte? Connexion",
      "contact.title": "Besoin d'aide ?", "contact.greeting.morning": "Bonjour", "contact.greeting.afternoon": "Bon après-midi", "contact.greeting.night": "Bonsoir",
      "contact.status.title": "Statut Système", "contact.status.online": "EN LIGNE", "contact.status.servers": "Serveurs",
      "contact.form.send": "Envoyer", "contact.form.success": "Envoyé !",
      "footer.slogan": "Gestion d'entreprise par IA.", "footer.company": "Entreprise", "footer.legal": "Légal",
      "dashboard.menu.overview": "Vue d'ensemble", "dashboard.menu.company": "Gestion Entreprise", "dashboard.menu.settings": "Paramètres",
      "profile.edit": "Modifier Profil", "profile.company_section": "Info Entreprise", "PROFILE.COMPANY_SECTION": "Info Entreprise",
      "role.owner": "Patron", "role.employee": "Employé",
      "settings.company_title": "Gestion Entreprise", "settings.invite_code": "Code Invitation",
      "common.save": "Enregistrer", "common.cancel": "Annuler", "form.code": "Code"
    }
  },

  // --- ESPANHOL (ES) - Completo com as novas chaves ---
  es: {
    translation: {
      "nav.home": "Inicio", "nav.pricing": "Precios", "nav.contact": "Contacto", "nav.login": "Acceso", "nav.signup": "Registro", "nav.logout": "Salir", "nav.dashboard": "Panel",
      "hero.savings": "Ahorro con IA",
      "hero.title": "Gestiona Tu Empresa en Piloto Automático", "hero.description": "Ahorra 90% en costos y elimina errores manuales.", "hero.cta": "Empezar",
      "services.title": "Tu Equipo de IA",
      "categories.accounting.description": "Facturas automatizadas, seguimiento de gastos y cálculo de impuestos.",
      "categories.communication.description": "Lectura y redacción automática de correos electrónicos.",
      "categories.hr.description": "Gestión de nóminas, vacaciones y empleados.",
      "comparison.title": "¿Por qué EasyCheck?", "comparison.traditional": "Método Tradicional", "comparison.recommended": "Recomendado", "comparison.total": "Costo Total", "comparison.savings": "Ahorro Estimado",
      "login.title": "Acceso", "auth.loginSubtitle": "Introduce tus credenciales.", "login.button": "Entrar", "login.noAccount": "¿Sin cuenta? Regístrate",
      "auth.createTitle": "Crear Cuenta", "auth.createSubtitle": "Automatiza tu negocio.", "auth.fullName": "Nombre Completo", "auth.companyName": "Nombre Empresa", "auth.haveAccount": "¿Ya tienes cuenta? Entrar",
      "contact.title": "¿Cómo ayudar?", "contact.greeting.morning": "Buenos días", "contact.greeting.afternoon": "Buenas tardes", "contact.greeting.night": "Buenas noches",
      "contact.status.title": "Estado del Sistema", "contact.status.online": "EN LÍNEA", "contact.status.servers": "Servidores",
      "contact.form.send": "Enviar", "contact.form.success": "¡Enviado!",
      "footer.slogan": "Gestión empresarial con IA.", "footer.company": "Empresa", "footer.legal": "Legal",
      "dashboard.menu.overview": "Visión General", "dashboard.menu.company": "Gestión Empresa", "dashboard.menu.settings": "Configuración",
      "profile.edit": "Editar Perfil", "profile.company_section": "Info Empresa", "PROFILE.COMPANY_SECTION": "Info Empresa",
      "role.owner": "Dueño", "role.employee": "Empleado",
      "settings.company_title": "Gestión Empresa", "settings.invite_code": "Código Invitación",
      "common.save": "Guardar", "common.cancel": "Cancelar", "form.code": "Código"
    }
  },

  // --- ALEMÃO (DE) - Completo com as novas chaves ---
  de: {
    translation: {
      "nav.home": "Startseite", "nav.pricing": "Preise", "nav.contact": "Kontakt", "nav.login": "Anmelden", "nav.signup": "Registrieren", "nav.logout": "Abmelden", "nav.dashboard": "Dashboard",
      "hero.savings": "KI-Ersparnisse",
      "hero.title": "Unternehmen auf Autopilot", "hero.description": "Sparen Sie 90% Kosten.", "hero.cta": "Starten",
      "services.title": "Ihr KI-Team",
      "categories.accounting.description": "Automatisierte Rechnungen und Steuern.",
      "comparison.title": "Warum EasyCheck?", "comparison.total": "Gesamtkosten", "comparison.savings": "Geschätzte Ersparnis",
      "login.title": "Anmelden", "login.button": "Einloggen",
      "auth.createTitle": "Konto Erstellen", "auth.fullName": "Vollständiger Name",
      "contact.title": "Wie helfen?", "contact.greeting.morning": "Guten Morgen", "contact.greeting.night": "Guten Abend",
      "contact.status.title": "Systemstatus", "contact.status.online": "ONLINE",
      "contact.form.send": "Senden",
      "footer.slogan": "KI-gestützte Unternehmensführung.",
      "dashboard.menu.overview": "Überblick", "dashboard.menu.company": "Firmenverwaltung", "dashboard.menu.settings": "Einstellungen",
      "profile.edit": "Profil Bearbeiten", "profile.company_section": "Firmeninfo", "PROFILE.COMPANY_SECTION": "Firmeninfo",
      "role.owner": "Inhaber",
      "settings.company_title": "Firmenverwaltung",
      "common.save": "Speichern", "common.cancel": "Abbrechen", "form.code": "Code"
    }
  },

  // --- ITALIANO (IT) - Completo com as novas chaves ---
  it: {
    translation: {
      "nav.home": "Home", "nav.pricing": "Prezzi", "nav.contact": "Contatti", "nav.login": "Accedi", "nav.signup": "Registrati", "nav.logout": "Esci", "nav.dashboard": "Dashboard",
      "hero.savings": "Risparmi IA",
      "hero.title": "Azienda col Pilota Automatico", "hero.description": "Risparmia il 90% dei costi.", "hero.cta": "Inizia",
      "services.title": "Il Tuo Team IA",
      "categories.accounting.description": "Fatture automatizzate e tasse.",
      "comparison.title": "Perché EasyCheck?", "comparison.total": "Costo Totale", "comparison.savings": "Risparmio Stimato",
      "login.title": "Accedi", "login.button": "Entra",
      "auth.createTitle": "Crea Account", "auth.fullName": "Nome Completo",
      "contact.title": "Come aiutare?", "contact.greeting.morning": "Buongiorno", "contact.greeting.night": "Buonasera",
      "contact.status.title": "Stato Sistema", "contact.status.online": "ONLINE",
      "contact.form.send": "Invia",
      "footer.slogan": "Gestione aziendale basata sull'IA.",
      "dashboard.menu.overview": "Panoramica", "dashboard.menu.company": "Gestione Azienda", "dashboard.menu.settings": "Impostazioni",
      "profile.edit": "Modifica Profilo", "profile.company_section": "Info Azienda", "PROFILE.COMPANY_SECTION": "Info Azienda",
      "role.owner": "Proprietario",
      "settings.company_title": "Gestione Azienda",
      "common.save": "Salva", "common.cancel": "Annulla", "form.code": "Codice"
    }
  }
};

i18n.use(initReactI18next).init({
  resources, 
  lng: "pt", 
  fallbackLng: "en", 
  interpolation: { escapeValue: false }
});

export default i18n;