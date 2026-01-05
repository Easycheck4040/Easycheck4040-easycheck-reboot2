import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  // ============================================================
  // INGLÊS (EN)
  // ============================================================
  en: {
    translation: {
      // NAV
      "nav.home": "Home", 
      "nav.pricing": "Pricing", 
      "nav.contact": "Contact Us", // Mudado ligeiramente
      "nav.login": "Login", 
      "nav.signup": "Sign Up", 
      "nav.logout": "Log Out", 
      "nav.dashboard": "Dashboard",
      
      // HERO SECTION (Correção do print 'hero.savings')
      "hero.savings": "AI-Powered Savings",
      "hero.title": "Run Your Business on Autopilot", 
      "hero.description": "Save 90% on costs and eliminate manual errors with AI integration.", 
      "hero.cta": "Start Saving Now",

      // SERVICES (Descrições LONGAS e detalhadas)
      "services.title": "Your AI Workforce",
      "categories.accounting.title": "AI Accounting", 
      "categories.accounting.description": "Automated invoices, expense tracking, OCR receipt scanning, and real-time tax calculation.",
      
      "categories.communication.title": "Smart Communication", 
      "categories.communication.description": "AI reads emails, categorizes them, and drafts professional responses instantly for your review.",
      
      "categories.hr.title": "HR Management", 
      "categories.hr.description": "Streamlined payroll processing, vacation tracking, performance reviews, and automated employee onboarding.",
      
      "categories.marketing.title": "Growth Marketing", 
      "categories.marketing.description": "Auto-create and schedule ad campaigns, generate social media content, and analyze performance metrics.",
      
      "categories.administrative.title": "Admin Automation", 
      "categories.administrative.description": "Digital filing, contract data extraction, scheduling, and automated data entry across platforms.",
      
      "categories.chat.title": "AI Business Assistant", 
      "categories.chat.description": "Your 24/7 intelligent advisor capable of answering queries, generating reports, and executing tasks via chat.",

      // COMPARISON SECTION
      "comparison.title": "Why Choose EasyCheck?",
      "comparison.traditional": "Traditional Method",
      "comparison.recommended": "Recommended",
      "comparison.replace_text": "Replaces 5+ Salaries",
      "comparison.total": "Total Cost",
      "comparison.savings": "Estimated Annual Savings",
      "roles.accountant": "Accountant", 
      "roles.admin": "Admin Assistant", 
      "roles.hr": "HR Manager", 
      "roles.marketing": "Marketing Specialist", 
      "roles.support": "Customer Support",

      // AUTH - LOGIN (Correção do print 'login.title')
      "login.title": "Welcome Back",
      "auth.loginSubtitle": "Enter your credentials to access your account.",
      "login.email": "Email Address",
      "login.password": "Password",
      "login.button": "Sign In",
      "login.forgot": "Forgot password?",
      "login.noAccount": "Don't have an account? Sign Up",
      
      // AUTH - SIGNUP
      "auth.createTitle": "Create Account",
      "auth.createSubtitle": "Start automating your business today.",
      "auth.fullName": "Full Name",
      "auth.jobTitle": "Job Title",
      "auth.iHaveCode": "I have a company invite code",
      "auth.companyName": "Company Name",
      "auth.generateCode": "Generate New Company",
      "auth.haveAccount": "Already have an account? Login",

      // CONTACT PAGE (Correção dos prints 'contact.greeting' e status)
      "contact.title": "How can we help?", 
      "contact.subtitle": "Our team is ready to answer.",
      "contact.greeting.morning": "Good morning", 
      "contact.greeting.afternoon": "Good afternoon", 
      "contact.greeting.night": "Good evening",
      
      "contact.status.title": "System Status",
      "contact.status.online": "ONLINE",
      "contact.status.servers": "Servers", 
      "contact.status.response": "Response Time", 
      "contact.status.caffeine": "Caffeine Level",
      
      "contact.direct_email.title": "Direct Email", 
      "contact.direct_email.subtitle": "For urgent matters",
      
      "contact.form.name": "Name", "contact.form.name_placeholder": "Ex: John Doe",
      "contact.form.email": "Email", "contact.form.email_placeholder": "Ex: john@company.com",
      "contact.form.subject": "Subject", "contact.subjects.general": "General Inquiry",
      "contact.form.message": "Message", "contact.form.message_placeholder": "How can we help?",
      "contact.form.send": "Send Message", "contact.form.success": "Message sent!",

      // FOOTER
      "footer.slogan": "AI-powered business management.", 
      "footer.company": "Company", 
      "footer.legal": "Legal", 
      "footer.privacy": "Privacy Policy", 
      "footer.terms": "Terms of Service", 
      "footer.complaints": "Complaints", 
      "footer.rights": "All rights reserved.",

      // DASHBOARD
      "dashboard.menu.overview": "Overview", 
      "dashboard.menu.company": "Company Management", 
      "dashboard.menu.chat": "AI Chat", 
      "dashboard.menu.accounting": "Accounting", 
      "dashboard.menu.communication": "Communication", 
      "dashboard.menu.hr": "HR", 
      "dashboard.menu.marketing": "Marketing", 
      "dashboard.menu.settings": "Settings", 
      "dashboard.menu.logout": "Log Out",
      
      "dashboard.welcome": "Welcome", 
      "dashboard.subtitle": "Your AI assistant is ready.", 
      "dashboard.open_chat": "Open Chat",
      "dashboard.stats.revenue": "Revenue", 
      "dashboard.stats.actions": "AI Actions", 
      "dashboard.stats.invoices": "Invoices",
      "notifications.title": "Notifications", 
      "notifications.empty": "No new notifications.",

      // PROFILE & SETTINGS
      "profile.edit": "Edit Profile", 
      "profile.edit_title": "Edit Profile", 
      "profile.company_section": "Company Information", 
      "PROFILE.COMPANY_SECTION": "Company Information", // Correção de segurança
      "profile.delete": "Delete Account", 
      "profile.success": "Updated successfully!",
      "role.owner": "Owner", 
      "role.employee": "Employee",
      "delete.title": "Danger Zone", 
      "delete.text": "Delete account? Type ELIMINAR:",
      "delete.confirm_text": "Please type ELIMINAR to confirm.",
      
      // COMPANY MANAGEMENT
      "settings.company_title": "Company Management", 
      "settings.invite_code": "Invite Code", 
      "settings.invite_text": "Share with employees.", 
      "settings.team_members": "Team Members", 
      "settings.no_members": "No employees yet.", 
      "settings.restricted_title": "Restricted", 
      "settings.restricted_text": "Owner only.",
      
      // COMMON FORMS
      "common.save": "Save", "common.cancel": "Cancel", "common.delete": "Delete",
      "form.fullname": "Full Name", "form.jobtitle": "Job Title", "form.email": "Email", "form.company_name": "Company Name", "form.address": "Address", "form.nif": "Tax ID", "form.code": "Company Code",
      "table.name": "Name", "table.email": "Email", "table.role": "Role", "table.actions": "Actions",
      "team.edit_role": "Edit Role", "team.role_updated": "Role updated!", "team.delete_confirm": "Remove employee?", "team.member_removed": "Removed."
    }
  },

  // ============================================================
  // PORTUGUÊS (PT)
  // ============================================================
  pt: {
    translation: {
      "nav.home": "Início", 
      "nav.pricing": "Preços", 
      "nav.contact": "Contactar", // <--- MUDADO AQUI
      "nav.login": "Entrar", 
      "nav.signup": "Criar Conta", 
      "nav.logout": "Sair", 
      "nav.dashboard": "Dashboard",
      
      // HERO
      "hero.savings": "Poupança com IA", // <--- CORREÇÃO
      "hero.title": "Gere a Tua Empresa em Piloto Automático", 
      "hero.description": "Poupa 90% dos custos e elimina erros manuais com a nossa integração de IA.", 
      "hero.cta": "Começar a Poupar",
      
      // SERVICES (Descrições completas)
      "services.title": "A Tua Equipa de IA",
      "categories.accounting.title": "Contabilidade IA", 
      "categories.accounting.description": "Faturas automáticas, rastreio de despesas, leitura OCR de recibos e cálculo de impostos em tempo real.",
      
      "categories.communication.title": "Comunicação Inteligente", 
      "categories.communication.description": "A IA lê emails, categoriza-os e rascunha respostas profissionais instantaneamente para tua revisão.",
      
      "categories.hr.title": "Gestão de RH", 
      "categories.hr.description": "Processamento salarial simplificado, gestão de férias, avaliações de desempenho e onboarding automático.",
      
      "categories.marketing.title": "Marketing Digital", 
      "categories.marketing.description": "Criação e agendamento automático de campanhas, geração de conteúdo para redes sociais e análise de métricas.",
      
      "categories.administrative.title": "Automação Admin", 
      "categories.administrative.description": "Arquivo digital, extração de dados de contratos, agendamento e entrada de dados automática entre plataformas.",
      
      "categories.chat.title": "Assistente de Negócios IA", 
      "categories.chat.description": "O teu consultor inteligente 24/7 capaz de responder a questões, gerar relatórios e executar tarefas via chat.",

      // COMPARISON
      "comparison.title": "Porquê Escolher a EasyCheck?", 
      "comparison.traditional": "Método Tradicional", 
      "comparison.recommended": "Recomendado", 
      "comparison.replace_text": "Substitui 5+ Salários", 
      "comparison.total": "Custo Total", 
      "comparison.savings": "Poupança Anual Estimada",
      "roles.accountant": "Contabilista", 
      "roles.admin": "Assistente Admin", 
      "roles.hr": "Gestor de RH", 
      "roles.marketing": "Especialista Marketing", 
      "roles.support": "Apoio ao Cliente",

      // AUTH
      "login.title": "Bem-vindo de Volta", // <--- CORREÇÃO
      "auth.loginSubtitle": "Insere as tuas credenciais para aceder.",
      "login.email": "Endereço de Email", 
      "login.password": "Palavra-passe", 
      "login.button": "Entrar", 
      "login.forgot": "Esqueceste-te da senha?", 
      "login.noAccount": "Não tens conta? Cria uma",
      
      "auth.createTitle": "Criar Conta", 
      "auth.createSubtitle": "Começa a automatizar o teu negócio hoje.", 
      "auth.fullName": "Nome Completo", 
      "auth.jobTitle": "Cargo", 
      "auth.iHaveCode": "Tenho um código de convite", 
      "auth.companyName": "Nome da Empresa", 
      "auth.generateCode": "Gerar Nova Empresa", 
      "auth.haveAccount": "Já tens conta? Entrar",

      // CONTACTOS
      "contact.title": "Como podemos ajudar?", 
      "contact.subtitle": "A nossa equipa está pronta.",
      "contact.greeting.morning": "Bom dia", 
      "contact.greeting.afternoon": "Boa tarde", 
      "contact.greeting.night": "Boa noite", // <--- CORREÇÃO
      
      "contact.status.title": "Estado do Sistema", // <--- CORREÇÃO
      "contact.status.online": "ONLINE",
      "contact.status.servers": "Servidores", 
      "contact.status.response": "Tempo de Resposta", 
      "contact.status.caffeine": "Nível de Cafeína",
      
      "contact.direct_email.title": "Email Direto", 
      "contact.direct_email.subtitle": "Para assuntos urgentes",
      
      "contact.form.name": "Nome", "contact.form.name_placeholder": "Ex: João Silva",
      "contact.form.email": "Email", "contact.form.email_placeholder": "Ex: joao@empresa.com",
      "contact.form.subject": "Assunto", "contact.subjects.general": "Informação Geral",
      "contact.form.message": "Mensagem", "contact.form.message_placeholder": "Como podemos ajudar?",
      "contact.form.send": "Enviar Mensagem", "contact.form.success": "Mensagem enviada!",

      // FOOTER
      "footer.slogan": "Gestão empresarial com IA.", 
      "footer.company": "Empresa", 
      "footer.legal": "Legal", 
      "footer.privacy": "Privacidade", 
      "footer.terms": "Termos", 
      "footer.complaints": "Livro de Reclamações", 
      "footer.rights": "Todos os direitos reservados.",

      // DASHBOARD
      "dashboard.menu.overview": "Visão Geral", 
      "dashboard.menu.company": "Gestão da Empresa", 
      "dashboard.menu.chat": "Chat IA", 
      "dashboard.menu.accounting": "Contabilidade", 
      "dashboard.menu.communication": "Comunicação", 
      "dashboard.menu.hr": "Recursos Humanos", 
      "dashboard.menu.marketing": "Marketing", 
      "dashboard.menu.settings": "Definições", 
      "dashboard.menu.logout": "Sair da Conta",
      
      "dashboard.welcome": "Bem-vindo", 
      "dashboard.subtitle": "O teu assistente IA está pronto.", 
      "dashboard.open_chat": "Abrir Chat IA",
      "dashboard.stats.revenue": "Receita Mensal", 
      "dashboard.stats.actions": "Ações IA", 
      "dashboard.stats.invoices": "Faturas",
      "notifications.title": "Notificações", "notifications.empty": "Sem notificações.",

      // PERFIL & MODAIS
      "profile.edit": "Editar Perfil", "profile.edit_title": "Editar Perfil", 
      "profile.company_section": "Informação da Empresa", 
      "PROFILE.COMPANY_SECTION": "Informação da Empresa", // <--- CORREÇÃO
      "profile.delete": "Eliminar Conta", "profile.success": "Atualizado!",
      "role.owner": "Patrão", "role.employee": "Funcionário",
      "delete.title": "Zona de Perigo", "delete.text": "Apagar conta? Escreve ELIMINAR:",
      
      // GESTÃO EMPRESA
      "settings.company_title": "Gestão da Empresa", 
      "settings.invite_code": "Código de Convite", 
      "settings.invite_text": "Partilha com funcionários.", 
      "settings.team_members": "Membros", 
      "settings.no_members": "Sem funcionários.", 
      "settings.restricted_title": "Acesso Restrito", 
      "settings.restricted_text": "Apenas o patrão pode ver.",
      
      "common.save": "Guardar", "common.cancel": "Cancelar", "common.delete": "Apagar",
      "form.fullname": "Nome Completo", "form.jobtitle": "Cargo", "form.email": "Email", "form.company_name": "Nome da Empresa", "form.address": "Morada", "form.nif": "NIF", "form.code": "Código da Empresa",
      "table.name": "Nome", "table.email": "Email", "table.role": "Cargo", "table.actions": "Ações",
      "team.edit_role": "Editar Cargo", "team.role_updated": "Cargo atualizado!", "team.delete_confirm": "Remover funcionário?", "team.member_removed": "Removido."
    }
  },

  // ============================================================
  // FRANCÊS (FR) - Completo
  // ============================================================
  fr: {
    translation: {
      "nav.home": "Accueil", "nav.pricing": "Tarifs", "nav.contact": "Nous Contacter", "nav.login": "Connexion", "nav.signup": "S'inscrire", "nav.logout": "Déconnexion", "nav.dashboard": "Tableau de bord",
      
      "hero.savings": "Économies IA",
      "hero.title": "Gérez Votre Entreprise en Pilote Automatique", 
      "hero.description": "Économisez 90% des coûts et éliminez les erreurs manuelles.", 
      "hero.cta": "Commencer",
      
      // Descrições LONGAS para o Francês também
      "services.title": "Votre Équipe IA",
      "categories.accounting.title": "Comptabilité IA",
      "categories.accounting.description": "Factures automatisées, suivi des dépenses, numérisation OCR et calcul des impôts en temps réel.",
      "categories.communication.title": "Communication Intelligente",
      "categories.communication.description": "L'IA lit les emails, les catégorise et rédige des réponses professionnelles instantanément.",
      "categories.hr.title": "Gestion RH",
      "categories.hr.description": "Traitement de la paie, suivi des congés, évaluations de performance et intégration des employés.",
      "categories.marketing.title": "Marketing",
      "categories.marketing.description": "Création automatique de campagnes, contenu pour réseaux sociaux et analyse des performances.",
      "categories.administrative.title": "Automatisation Admin",
      "categories.administrative.description": "Archivage numérique, extraction de données de contrats et saisie automatique.",
      "categories.chat.title": "Assistant IA",
      "categories.chat.description": "Votre conseiller intelligent 24/7 capable de répondre aux questions et générer des rapports.",

      "comparison.title": "Pourquoi EasyCheck?", "comparison.traditional": "Méthode Traditionnelle", "comparison.recommended": "Recommandé", "comparison.replace_text": "Remplace 5+ Salaires", "comparison.total": "Coût Total", "comparison.savings": "Économies Estimées",
      "roles.accountant": "Comptable", "roles.admin": "Assistant Admin", "roles.hr": "Responsable RH", "roles.marketing": "Marketing", "roles.support": "Support Client",

      "login.title": "Connexion", "auth.loginSubtitle": "Entrez vos identifiants.", "login.email": "Email", "login.password": "Mot de passe", "login.button": "Se connecter", "login.noAccount": "Pas de compte? S'inscrire",
      "auth.createTitle": "Créer Compte", "auth.createSubtitle": "Automatisez votre entreprise.", "auth.fullName": "Nom Complet", "auth.jobTitle": "Poste", "auth.iHaveCode": "J'ai un code", "auth.companyName": "Nom Entreprise", "auth.generateCode": "Générer Entreprise", "auth.haveAccount": "Déjà un compte? Connexion",

      "contact.title": "Besoin d'aide ?", "contact.subtitle": "Notre équipe est prête.",
      "contact.greeting.morning": "Bonjour", "contact.greeting.afternoon": "Bon après-midi", "contact.greeting.night": "Bonsoir",
      "contact.status.title": "Statut Système", "contact.status.online": "EN LIGNE", "contact.status.servers": "Serveurs", "contact.status.response": "Temps de Réponse", "contact.status.caffeine": "Niveau de Caféine",
      "contact.direct_email.title": "Email Direct", "contact.direct_email.subtitle": "Pour urgences",
      "contact.form.name": "Nom", "contact.form.name_placeholder": "Ex: Pierre Dupont", "contact.form.email": "Email", "contact.form.subject": "Sujet", "contact.subjects.general": "Général", "contact.form.message": "Message", "contact.form.message_placeholder": "Comment pouvons-nous aider ?", "contact.form.send": "Envoyer", "contact.form.success": "Envoyé !",

      "footer.slogan": "Gestion d'entreprise par IA.", "footer.company": "Entreprise", "footer.legal": "Légal", "footer.privacy": "Confidentialité", "footer.terms": "Conditions", "footer.complaints": "Réclamations", "footer.rights": "Tous droits réservés.",

      "dashboard.menu.overview": "Vue d'ensemble", "dashboard.menu.company": "Gestion Entreprise", "dashboard.menu.chat": "Chat IA", "dashboard.menu.accounting": "Comptabilité", "dashboard.menu.communication": "Communication", "dashboard.menu.hr": "RH", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Paramètres", "dashboard.menu.logout": "Déconnexion",
      "dashboard.welcome": "Bienvenue", "dashboard.subtitle": "Votre assistant IA est prêt.", "dashboard.open_chat": "Ouvrir Chat",
      "dashboard.stats.revenue": "Revenu", "dashboard.stats.actions": "Actions IA", "dashboard.stats.invoices": "Factures",
      "notifications.title": "Notifications", "notifications.empty": "Aucune notification.",

      "profile.edit": "Modifier Profil", "profile.edit_title": "Modifier Profil", 
      "profile.company_section": "Info Entreprise", "PROFILE.COMPANY_SECTION": "Info Entreprise",
      "profile.delete": "Supprimer Compte", "profile.success": "Mis à jour !",
      "role.owner": "Patron", "role.employee": "Employé",
      "delete.title": "Zone de Danger", "delete.text": "Supprimer compte ? Tapez ELIMINAR :",
      "settings.company_title": "Gestion Entreprise", "settings.invite_code": "Code Invitation", "settings.invite_text": "Partagez avec les employés.", "settings.team_members": "Équipe", "settings.no_members": "Aucun employé.", "settings.restricted_title": "Accès Restreint", "settings.restricted_text": "Seul le patron peut voir ceci.",
      
      "common.save": "Enregistrer", "common.cancel": "Annuler", "common.delete": "Supprimer",
      "form.fullname": "Nom Complet", "form.jobtitle": "Poste", "form.email": "Email", "form.company_name": "Nom Entreprise", "form.address": "Adresse", "form.nif": "Numéro Fiscal", "form.code": "Code Entreprise",
      "table.name": "Nom", "table.email": "Email", "table.role": "Poste", "table.actions": "Actions",
      "team.edit_role": "Modifier Poste", "team.role_updated": "Poste mis à jour !", "team.delete_confirm": "Retirer cet employé ?", "team.member_removed": "Employé retiré."
    }
  },

  // ============================================================
  // ESPANHOL (ES) - Completo
  // ============================================================
  es: {
    translation: {
      "nav.home": "Inicio", "nav.pricing": "Precios", "nav.contact": "Contactar", "nav.login": "Acceso", "nav.signup": "Registro", "nav.logout": "Salir", "nav.dashboard": "Panel",
      "hero.savings": "Ahorro con IA",
      "hero.title": "Gestiona Tu Empresa en Piloto Automático", "hero.description": "Ahorra 90% en costos y elimina errores manuales.", "hero.cta": "Empezar",
      "services.title": "Tu Equipo de IA",
      "categories.accounting.title": "Contabilidad IA", "categories.accounting.description": "Facturas automatizadas, seguimiento de gastos y cálculo de impuestos en tiempo real.",
      "categories.communication.title": "Comunicación", "categories.communication.description": "Lectura y redacción automática de correos electrónicos profesionales.",
      "categories.hr.title": "Gestión de RRHH", "categories.hr.description": "Gestión de nóminas, vacaciones, evaluaciones y contratación automática.",
      "categories.marketing.title": "Marketing", "categories.marketing.description": "Creación automática de campañas y contenido para redes sociales.",
      "categories.administrative.title": "Administración", "categories.administrative.description": "Archivo digital y entrada de datos automática entre plataformas.",
      "categories.chat.title": "Asistente IA", "categories.chat.description": "Tu asesor inteligente 24/7 capaz de responder consultas y generar informes.",

      "comparison.title": "¿Por qué EasyCheck?", "comparison.traditional": "Método Tradicional", "comparison.recommended": "Recomendado", "comparison.replace_text": "Reemplaza 5+ Salarios", "comparison.total": "Costo Total", "comparison.savings": "Ahorro Estimado",
      "login.title": "Acceso", "auth.loginSubtitle": "Introduce tus credenciales.", "login.button": "Entrar", "login.noAccount": "¿Sin cuenta? Regístrate",
      "auth.createTitle": "Crear Cuenta", "auth.createSubtitle": "Automatiza tu negocio.", "auth.fullName": "Nombre Completo", "auth.jobTitle": "Cargo", "auth.iHaveCode": "Tengo código", "auth.companyName": "Nombre Empresa", "auth.generateCode": "Generar Empresa", "auth.haveAccount": "¿Ya tienes cuenta? Entrar",

      "contact.title": "¿Cómo ayudar?", "contact.subtitle": "Nuestro equipo está listo.",
      "contact.greeting.morning": "Buenos días", "contact.greeting.afternoon": "Buenas tardes", "contact.greeting.night": "Buenas noches",
      "contact.status.title": "Estado del Sistema", "contact.status.online": "EN LÍNEA", "contact.status.servers": "Servidores", "contact.status.response": "Tiempo Respuesta", "contact.status.caffeine": "Nivel Cafeína",
      "contact.direct_email.title": "Email Directo", "contact.direct_email.subtitle": "Urgencias",
      "contact.form.name": "Nombre", "contact.form.send": "Enviar", "contact.form.success": "¡Enviado!",

      "footer.slogan": "Gestión empresarial con IA.", "footer.company": "Empresa", "footer.legal": "Legal", "footer.privacy": "Privacidad", "footer.terms": "Términos", "footer.rights": "Derechos reservados.",

      "dashboard.menu.overview": "Visión General", "dashboard.menu.company": "Gestión Empresa", "dashboard.menu.chat": "Chat IA", "dashboard.menu.accounting": "Contabilidad", "dashboard.menu.communication": "Comunicación", "dashboard.menu.hr": "RRHH", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Configuración", "dashboard.menu.logout": "Cerrar Sesión",
      "dashboard.welcome": "Bienvenido", "dashboard.open_chat": "Abrir Chat", "dashboard.stats.revenue": "Ingresos", "dashboard.stats.actions": "Acciones IA", "dashboard.stats.invoices": "Facturas",
      "notifications.title": "Notificaciones", "notifications.empty": "Sin notificaciones.",

      "profile.edit": "Editar Perfil", "profile.company_section": "Info Empresa", "PROFILE.COMPANY_SECTION": "Info Empresa",
      "profile.delete": "Eliminar Cuenta", "profile.success": "¡Actualizado!",
      "role.owner": "Dueño", "role.employee": "Empleado",
      "delete.title": "Peligro", "delete.text": "¿Eliminar cuenta? Escribe ELIMINAR:",
      "settings.company_title": "Gestión Empresa", "settings.invite_code": "Código Invitación", "settings.invite_text": "Comparte con empleados.", "settings.team_members": "Equipo", "settings.no_members": "Sin empleados.", "settings.restricted_title": "Acceso Restringido", "settings.restricted_text": "Solo el dueño puede ver esto.",
      
      "common.save": "Guardar", "common.cancel": "Cancelar", "common.delete": "Eliminar",
      "form.fullname": "Nombre", "form.jobtitle": "Cargo", "form.company_name": "Empresa", "form.address": "Dirección", "form.nif": "NIF", "form.code": "Código",
      "table.name": "Nombre", "table.role": "Cargo", "table.actions": "Acciones", "team.edit_role": "Editar Cargo", "team.role_updated": "¡Actualizado!", "team.delete_confirm": "¿Eliminar empleado?", "team.member_removed": "Eliminado."
    }
  },

  // --- ALEMÃO (DE) ---
  de: {
    translation: {
      "nav.home": "Startseite", "nav.contact": "Kontakt", "nav.login": "Anmelden", "nav.logout": "Abmelden", "nav.dashboard": "Dashboard",
      "hero.savings": "KI-Ersparnisse", "hero.title": "Unternehmen auf Autopilot", "hero.description": "Sparen Sie 90% Kosten.", "hero.cta": "Starten",
      "services.title": "Ihr KI-Team", "categories.accounting.title": "KI-Buchhaltung", "categories.accounting.description": "Automatische Rechnungen und Steuern.",
      "contact.title": "Wie helfen?", "contact.greeting.morning": "Guten Morgen", "contact.greeting.afternoon": "Guten Tag", "contact.greeting.night": "Guten Abend",
      "contact.status.title": "Systemstatus", "contact.status.online": "ONLINE",
      "footer.slogan": "KI-gestützte Führung.", "footer.company": "Firma", "footer.legal": "Rechtliches",
      "dashboard.menu.overview": "Überblick", "dashboard.menu.company": "Firmenverwaltung", "dashboard.menu.settings": "Einstellungen",
      "profile.edit": "Profil", "profile.company_section": "Firmeninfo", "PROFILE.COMPANY_SECTION": "Firmeninfo",
      "role.owner": "Inhaber", "common.save": "Speichern", "form.code": "Code", "settings.company_title": "Firmenverwaltung"
    }
  },

  // --- ITALIANO (IT) ---
  it: {
    translation: {
      "nav.home": "Home", "nav.contact": "Contatti", "nav.login": "Accedi", "nav.logout": "Esci", "nav.dashboard": "Dashboard",
      "hero.savings": "Risparmi IA", "hero.title": "Azienda col Pilota Automatico", "hero.description": "Risparmia il 90% dei costi.", "hero.cta": "Inizia",
      "services.title": "Il Tuo Team IA", "categories.accounting.title": "Contabilità IA", "categories.accounting.description": "Fatture automatiche e tasse.",
      "contact.title": "Come aiutare?", "contact.greeting.morning": "Buongiorno", "contact.greeting.afternoon": "Buon pomeriggio", "contact.greeting.night": "Buonasera",
      "contact.status.title": "Stato Sistema", "contact.status.online": "ONLINE",
      "footer.slogan": "Gestione aziendale IA.", "footer.company": "Azienda", "footer.legal": "Legale",
      "dashboard.menu.overview": "Panoramica", "dashboard.menu.company": "Gestione Azienda", "dashboard.menu.settings": "Impostazioni",
      "profile.edit": "Profilo", "profile.company_section": "Info Azienda", "PROFILE.COMPANY_SECTION": "Info Azienda",
      "role.owner": "Proprietario", "common.save": "Salva", "form.code": "Codice", "settings.company_title": "Gestione Azienda"
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