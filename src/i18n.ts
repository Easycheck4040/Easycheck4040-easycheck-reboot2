import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  // ============================================================
  // 🇺🇸 INGLÊS (EN)
  // ============================================================
  en: {
    translation: {
      // NAV
      "nav.home": "Home", "nav.pricing": "Pricing", "nav.contact": "Contact Us", "nav.login": "Login", "nav.signup": "Sign Up", "nav.logout": "Log Out", "nav.dashboard": "Dashboard",
      
      // HERO
      "hero.savings": "AI-Powered Savings",
      "hero.title": "Run Your Business on Autopilot", 
      "hero.description": "Save 90% on costs and eliminate manual errors with AI integration.", 
      "hero.cta": "Start Saving Now",

      // SERVICES (DESCRIÇÕES LONGAS)
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

      // COMPARISON
      "comparison.title": "Why Choose EasyCheck?",
      "comparison.traditional": "Traditional Method",
      "comparison.recommended": "Recommended",
      "comparison.replace_text": "Replaces 5+ Salaries",
      "comparison.total": "Total Cost",
      "comparison.savings": "Estimated Annual Savings",
      "roles.accountant": "Accountant", "roles.admin": "Admin Assistant", "roles.hr": "HR Manager", "roles.marketing": "Marketing Specialist", "roles.support": "Customer Support",

      // AUTH
      "login.title": "Welcome Back", 
      "auth.loginSubtitle": "Enter your credentials to access your account.", 
      "login.email": "Email Address", "login.password": "Password", "login.button": "Sign In", "login.forgot": "Forgot password?", "login.noAccount": "Don't have an account? Sign Up",
      "auth.createTitle": "Create Account", "auth.createSubtitle": "Start automating your business today.", "auth.fullName": "Full Name", "auth.jobTitle": "Job Title", "auth.iHaveCode": "I have a company invite code", "auth.companyName": "Company Name", "auth.generateCode": "Generate New Company", "auth.haveAccount": "Already have an account? Login",

      // CONTACT
      "contact.title": "How can we help?", "contact.subtitle": "Our team is ready to answer.",
      "contact.greeting.morning": "Good morning!", "contact.greeting.afternoon": "Good afternoon!", "contact.greeting.night": "Good evening!",
      "contact.status.title": "System Status", "contact.status.online": "ONLINE", "contact.status.servers": "Servers", "contact.status.response": "Response Time", "contact.status.caffeine": "Caffeine Level",
      "contact.direct_email.title": "Direct Email", "contact.direct_email.subtitle": "For urgent matters",
      "contact.form.name": "Name", "contact.form.name_placeholder": "Ex: John Doe",
      "contact.form.email": "Email", "contact.form.email_placeholder": "Ex: john@company.com",
      "contact.form.subject": "Subject", "contact.subjects.general": "General Inquiry",
      "contact.form.message": "Message", "contact.form.message_placeholder": "How can we help you today?",
      "contact.form.send": "Send Message", "contact.form.success": "Message sent!",

      // FOOTER
      "footer.slogan": "AI-powered business management.", "footer.company": "Company", "footer.legal": "Legal", "footer.privacy": "Privacy Policy", "footer.terms": "Terms of Service", "footer.complaints": "Complaints", "footer.rights": "All rights reserved.",

      // DASHBOARD
      "dashboard.menu.overview": "Overview", "dashboard.menu.company": "Company Management", "dashboard.menu.chat": "AI Chat", "dashboard.menu.accounting": "Accounting", "dashboard.menu.communication": "Communication", "dashboard.menu.hr": "HR", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Settings", "dashboard.menu.logout": "Log Out",
      "dashboard.welcome": "Welcome", "dashboard.subtitle": "Your AI assistant is ready.", "dashboard.open_chat": "Open Chat",
      "dashboard.stats.revenue": "Revenue", "dashboard.stats.actions": "AI Actions", "dashboard.stats.invoices": "Invoices",
      "notifications.title": "Notifications", "notifications.empty": "No new notifications.",

      // PROFILE & SETTINGS
      "profile.edit": "Edit Profile", "profile.edit_title": "Edit Profile", 
      "profile.company_section": "Company Information", "PROFILE.COMPANY_SECTION": "Company Information",
      "profile.delete": "Delete Account", "profile.success": "Updated successfully!",
      "role.owner": "Owner", "role.employee": "Employee",
      "delete.title": "Danger Zone", "delete.text": "Delete account? Type ELIMINAR:", "delete.confirm_text": "Please type ELIMINAR to confirm.",
      "settings.company_title": "Company Management", "settings.invite_code": "Invite Code", "settings.invite_text": "Share with employees.", "settings.team_members": "Team Members", "settings.no_members": "No employees yet.", "settings.restricted_title": "Restricted", "settings.restricted_text": "Owner only.",
      
      // COMMON
      "common.save": "Save", "common.cancel": "Cancel", "common.delete": "Delete", "common.saving": "Saving...",
      "form.fullname": "Full Name", "form.jobtitle": "Job Title", "form.email": "Email", "form.company_name": "Company Name", "form.address": "Address", "form.nif": "Tax ID", "form.code": "Code",
      "table.name": "Name", "table.email": "Email", "table.role": "Role", "table.actions": "Actions",
      "team.edit_role": "Edit Role", "team.role_updated": "Role updated!", "team.delete_confirm": "Remove employee?", "team.member_removed": "Removed."
    }
  },

  // ============================================================
  // 🇵🇹 PORTUGUÊS (PT)
  // ============================================================
  pt: {
    translation: {
      "nav.home": "Início", "nav.pricing": "Preços", "nav.contact": "Contactar", "nav.login": "Entrar", "nav.signup": "Criar Conta", "nav.logout": "Sair", "nav.dashboard": "Dashboard",
      
      "hero.savings": "Poupança com IA",
      "hero.title": "Gere a Tua Empresa em Piloto Automático", 
      "hero.description": "Poupa 90% dos custos e elimina erros manuais com a nossa integração de IA.", 
      "hero.cta": "Começar a Poupar",

      "services.title": "A Tua Equipa de IA",
      "categories.accounting.title": "Contabilidade IA", "categories.accounting.description": "Faturas automáticas, rastreio de despesas, leitura OCR de recibos e cálculo de impostos em tempo real.",
      "categories.communication.title": "Comunicação Inteligente", "categories.communication.description": "A IA lê emails, categoriza-os e rascunha respostas profissionais instantaneamente para tua revisão.",
      "categories.hr.title": "Gestão de RH", "categories.hr.description": "Processamento salarial simplificado, gestão de férias, avaliações de desempenho e onboarding automático.",
      "categories.marketing.title": "Marketing Digital", "categories.marketing.description": "Criação e agendamento automático de campanhas, geração de conteúdo para redes sociais e análise de métricas.",
      "categories.administrative.title": "Automação Admin", "categories.administrative.description": "Arquivo digital, extração de dados de contratos, agendamento e entrada de dados automática entre plataformas.",
      "categories.chat.title": "Assistente de Negócios IA", "categories.chat.description": "O teu consultor inteligente 24/7 capaz de responder a questões, gerar relatórios e executar tarefas via chat.",

      "comparison.title": "Porquê Escolher a EasyCheck?", "comparison.traditional": "Método Tradicional", "comparison.recommended": "Recomendado", "comparison.replace_text": "Substitui 5+ Salários", "comparison.total": "Custo Total", "comparison.savings": "Poupança Anual Estimada",
      "roles.accountant": "Contabilista", "roles.admin": "Assistente Admin", "roles.hr": "Gestor de RH", "roles.marketing": "Especialista Marketing", "roles.support": "Apoio ao Cliente",

      "login.title": "Bem-vindo de Volta", "auth.loginSubtitle": "Insere as tuas credenciais para aceder.", "login.email": "Endereço de Email", "login.password": "Palavra-passe", "login.button": "Entrar", "login.forgot": "Esqueceste-te da senha?", "login.noAccount": "Não tens conta? Cria uma",
      "auth.createTitle": "Criar Conta", "auth.createSubtitle": "Começa a automatizar o teu negócio hoje.", "auth.fullName": "Nome Completo", "auth.jobTitle": "Cargo", "auth.iHaveCode": "Tenho um código de convite", "auth.companyName": "Nome da Empresa", "auth.generateCode": "Gerar Nova Empresa", "auth.haveAccount": "Já tens conta? Entrar",

      "contact.title": "Como podemos ajudar?", "contact.subtitle": "A nossa equipa está pronta.",
      "contact.greeting.morning": "Bom dia!", "contact.greeting.afternoon": "Boa tarde!", "contact.greeting.night": "Boa noite!",
      "contact.status.title": "Estado do Sistema", "contact.status.online": "ONLINE", "contact.status.servers": "Servidores", "contact.status.response": "Tempo de Resposta", "contact.status.caffeine": "Nível de Cafeína",
      "contact.direct_email.title": "Email Direto", "contact.direct_email.subtitle": "Para assuntos urgentes",
      "contact.form.name": "Nome", "contact.form.name_placeholder": "Ex: João Silva", "contact.form.email": "Email", "contact.form.email_placeholder": "Ex: joao@empresa.com", "contact.form.subject": "Assunto", "contact.subjects.general": "Informação Geral", "contact.form.message": "Mensagem", "contact.form.message_placeholder": "Como podemos ajudar?", "contact.form.send": "Enviar Mensagem", "contact.form.success": "Mensagem enviada!",

      "footer.slogan": "Gestão empresarial com IA.", "footer.company": "Empresa", "footer.legal": "Legal", "footer.privacy": "Privacidade", "footer.terms": "Termos", "footer.complaints": "Livro de Reclamações", "footer.rights": "Todos os direitos reservados.",

      "dashboard.menu.overview": "Visão Geral", "dashboard.menu.company": "Gestão da Empresa", "dashboard.menu.chat": "Chat IA", "dashboard.menu.accounting": "Contabilidade", "dashboard.menu.communication": "Comunicação", "dashboard.menu.hr": "Recursos Humanos", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Definições", "dashboard.menu.logout": "Sair da Conta",
      "dashboard.welcome": "Bem-vindo", "dashboard.subtitle": "O teu assistente IA está pronto.", "dashboard.open_chat": "Abrir Chat IA",
      "dashboard.stats.revenue": "Receita Mensal", "dashboard.stats.actions": "Ações IA", "dashboard.stats.invoices": "Faturas",
      "notifications.title": "Notificações", "notifications.empty": "Sem notificações.",

      "profile.edit": "Editar Perfil", "profile.edit_title": "Editar Perfil", "profile.company_section": "Informação da Empresa", "PROFILE.COMPANY_SECTION": "Informação da Empresa",
      "profile.delete": "Eliminar Conta", "profile.success": "Atualizado!",
      "role.owner": "Patrão", "role.employee": "Funcionário",
      "delete.title": "Zona de Perigo", "delete.text": "Apagar conta? Escreve ELIMINAR:", "delete.confirm_text": "Escreve ELIMINAR para confirmar.",
      
      "settings.company_title": "Gestão da Empresa", "settings.invite_code": "Código de Convite", "settings.invite_text": "Partilha com funcionários.", "settings.team_members": "Membros", "settings.no_members": "Sem funcionários.", "settings.restricted_title": "Acesso Restrito", "settings.restricted_text": "Apenas o patrão pode ver.",
      
      "common.save": "Guardar", "common.cancel": "Cancelar", "common.delete": "Apagar", "common.saving": "A Guardar...",
      "form.fullname": "Nome Completo", "form.jobtitle": "Cargo", "form.email": "Email", "form.company_name": "Nome da Empresa", "form.address": "Morada", "form.nif": "NIF", "form.code": "Código da Empresa",
      "table.name": "Nome", "table.email": "Email", "table.role": "Cargo", "table.actions": "Ações",
      "team.edit_role": "Editar Cargo", "team.role_updated": "Cargo atualizado!", "team.delete_confirm": "Remover funcionário?", "team.member_removed": "Removido."
    }
  },

  // ============================================================
  // 🇫🇷 FRANCÊS (FR) - EXPANDIDO
  // ============================================================
  fr: {
    translation: {
      "nav.home": "Accueil", "nav.pricing": "Tarifs", "nav.contact": "Nous Contacter", "nav.login": "Connexion", "nav.signup": "S'inscrire", "nav.logout": "Déconnexion", "nav.dashboard": "Tableau de bord",
      
      "hero.savings": "Économies IA",
      "hero.title": "Gérez Votre Entreprise en Pilote Automatique", "hero.description": "Économisez 90% des coûts et éliminez les erreurs manuelles.", "hero.cta": "Commencer",
      
      "services.title": "Votre Équipe IA",
      "categories.accounting.title": "Comptabilité IA", "categories.accounting.description": "Factures automatisées, suivi des dépenses, numérisation OCR et calcul des impôts en temps réel.",
      "categories.communication.title": "Communication Intelligente", "categories.communication.description": "L'IA lit les emails, les catégorise et rédige des réponses professionnelles instantanément.",
      "categories.hr.title": "Gestion RH", "categories.hr.description": "Traitement de la paie, suivi des congés, évaluations de performance et intégration des employés.",
      "categories.marketing.title": "Marketing", "categories.marketing.description": "Création automatique de campagnes, contenu pour réseaux sociaux et analyse des performances.",
      "categories.administrative.title": "Automatisation Admin", "categories.administrative.description": "Archivage numérique, extraction de données de contrats et saisie automatique.",
      "categories.chat.title": "Assistant IA", "categories.chat.description": "Votre conseiller intelligent 24/7 capable de répondre aux questions et générer des rapports.",

      "comparison.title": "Pourquoi EasyCheck?", "comparison.traditional": "Méthode Traditionnelle", "comparison.recommended": "Recommandé", "comparison.replace_text": "Remplace 5+ Salaires", "comparison.total": "Coût Total", "comparison.savings": "Économies Estimées",
      "roles.accountant": "Comptable", "roles.admin": "Assistant Admin", "roles.hr": "Responsable RH", "roles.marketing": "Marketing", "roles.support": "Support Client",

      "login.title": "Connexion", "auth.loginSubtitle": "Entrez vos identifiants pour accéder.", "login.email": "Email", "login.password": "Mot de passe", "login.button": "Se connecter", "login.forgot": "Mot de passe oublié ?", "login.noAccount": "Pas de compte? S'inscrire",
      "auth.createTitle": "Créer Compte", "auth.createSubtitle": "Automatisez votre entreprise dès aujourd'hui.", "auth.fullName": "Nom Complet", "auth.jobTitle": "Poste", "auth.iHaveCode": "J'ai un code d'invitation", "auth.companyName": "Nom Entreprise", "auth.generateCode": "Générer Nouvelle Entreprise", "auth.haveAccount": "Déjà un compte? Connexion",

      "contact.title": "Besoin d'aide ?", "contact.subtitle": "Notre équipe est prête à répondre.",
      "contact.greeting.morning": "Bonjour !", "contact.greeting.afternoon": "Bon après-midi !", "contact.greeting.night": "Bonsoir !",
      "contact.status.title": "Statut Système", "contact.status.online": "EN LIGNE", "contact.status.servers": "Serveurs", "contact.status.response": "Temps de Réponse", "contact.status.caffeine": "Niveau de Caféine",
      "contact.direct_email.title": "Email Direct", "contact.direct_email.subtitle": "Pour urgences",
      "contact.form.name": "Nom", "contact.form.name_placeholder": "Ex: Pierre Dupont", "contact.form.email": "Email", "contact.form.email_placeholder": "Ex: pierre@societe.com", "contact.form.subject": "Sujet", "contact.subjects.general": "Général", "contact.form.message": "Message", "contact.form.message_placeholder": "Comment pouvons-nous aider ?", "contact.form.send": "Envoyer", "contact.form.success": "Message envoyé avec succès !",

      "footer.slogan": "Gestion d'entreprise par IA.", "footer.company": "Entreprise", "footer.legal": "Légal", "footer.privacy": "Confidentialité", "footer.terms": "Conditions", "footer.complaints": "Réclamations", "footer.rights": "Tous droits réservés.",

      "dashboard.menu.overview": "Vue d'ensemble", "dashboard.menu.company": "Gestion Entreprise", "dashboard.menu.chat": "Chat IA", "dashboard.menu.accounting": "Comptabilité", "dashboard.menu.communication": "Communication", "dashboard.menu.hr": "RH", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Paramètres", "dashboard.menu.logout": "Déconnexion",
      "dashboard.welcome": "Bienvenue", "dashboard.subtitle": "Votre assistant IA est prêt.", "dashboard.open_chat": "Ouvrir Chat",
      "dashboard.stats.revenue": "Revenu", "dashboard.stats.actions": "Actions IA", "dashboard.stats.invoices": "Factures",
      "notifications.title": "Notifications", "notifications.empty": "Aucune nouvelle notification.",

      "profile.edit": "Modifier Profil", "profile.edit_title": "Modifier Profil", 
      "profile.company_section": "Info Entreprise", "PROFILE.COMPANY_SECTION": "Info Entreprise",
      "profile.delete": "Supprimer Compte", "profile.success": "Mis à jour avec succès !",
      "role.owner": "Patron", "role.employee": "Employé",
      "delete.title": "Zone de Danger", "delete.text": "Supprimer compte ? Tapez ELIMINAR :", "delete.confirm_text": "Tapez ELIMINAR pour confirmer.",
      
      "settings.company_title": "Gestion Entreprise", "settings.invite_code": "Code Invitation", "settings.invite_text": "Partagez avec les employés.", "settings.team_members": "Membres de l'Équipe", "settings.no_members": "Aucun employé enregistré.", "settings.restricted_title": "Accès Restreint", "settings.restricted_text": "Seul le patron peut voir ceci.",
      
      "common.save": "Enregistrer", "common.cancel": "Annuler", "common.delete": "Supprimer", "common.saving": "Enregistrement...",
      "form.fullname": "Nom Complet", "form.jobtitle": "Poste", "form.email": "Email", "form.company_name": "Nom Entreprise", "form.address": "Adresse", "form.nif": "Numéro Fiscal", "form.code": "Code Entreprise",
      "table.name": "Nom", "table.email": "Email", "table.role": "Poste", "table.actions": "Actions",
      "team.edit_role": "Modifier Poste", "team.role_updated": "Poste mis à jour !", "team.delete_confirm": "Retirer cet employé ?", "team.member_removed": "Employé retiré."
    }
  },

  // ============================================================
  // 🇪🇸 ESPANHOL (ES) - EXPANDIDO
  // ============================================================
  es: {
    translation: {
      "nav.home": "Inicio", "nav.pricing": "Precios", "nav.contact": "Contactar", "nav.login": "Acceso", "nav.signup": "Registro", "nav.logout": "Salir", "nav.dashboard": "Panel",
      
      "hero.savings": "Ahorro con IA",
      "hero.title": "Gestiona Tu Empresa en Piloto Automático", "hero.description": "Ahorra 90% en costos y elimina errores manuales con IA.", "hero.cta": "Empezar",
      
      "services.title": "Tu Equipo de IA",
      "categories.accounting.title": "Contabilidad IA", "categories.accounting.description": "Facturas automatizadas, seguimiento de gastos y cálculo de impuestos en tiempo real.",
      "categories.communication.title": "Comunicación Inteligente", "categories.communication.description": "Lectura y redacción automática de correos electrónicos profesionales.",
      "categories.hr.title": "Gestión de RRHH", "categories.hr.description": "Gestión de nóminas, vacaciones, evaluaciones y contratación automática.",
      "categories.marketing.title": "Marketing", "categories.marketing.description": "Creación automática de campañas y contenido para redes sociales.",
      "categories.administrative.title": "Administración", "categories.administrative.description": "Archivo digital y entrada de datos automática entre plataformas.",
      "categories.chat.title": "Asistente IA", "categories.chat.description": "Tu asesor inteligente 24/7 capaz de responder consultas y generar informes.",

      "comparison.title": "¿Por qué EasyCheck?", "comparison.traditional": "Método Tradicional", "comparison.recommended": "Recomendado", "comparison.replace_text": "Reemplaza 5+ Salarios", "comparison.total": "Costo Total", "comparison.savings": "Ahorro Estimado",
      "roles.accountant": "Contador", "roles.admin": "Admin", "roles.hr": "Gerente RRHH", "roles.marketing": "Marketing", "roles.support": "Soporte",

      "login.title": "Acceso", "auth.loginSubtitle": "Introduce tus credenciales para acceder.", "login.email": "Correo", "login.password": "Contraseña", "login.button": "Entrar", "login.forgot": "¿Olvidaste contraseña?", "login.noAccount": "¿Sin cuenta? Regístrate",
      "auth.createTitle": "Crear Cuenta", "auth.createSubtitle": "Automatiza tu negocio hoy.", "auth.fullName": "Nombre Completo", "auth.jobTitle": "Cargo", "auth.iHaveCode": "Tengo código", "auth.companyName": "Nombre Empresa", "auth.generateCode": "Generar Empresa", "auth.haveAccount": "¿Ya tienes cuenta? Entrar",

      "contact.title": "¿Cómo ayudar?", "contact.subtitle": "Nuestro equipo está listo.",
      "contact.greeting.morning": "¡Buenos días!", "contact.greeting.afternoon": "¡Buenas tardes!", "contact.greeting.night": "¡Buenas noches!",
      "contact.status.title": "Estado del Sistema", "contact.status.online": "EN LÍNEA", "contact.status.servers": "Servidores", "contact.status.response": "Tiempo Respuesta", "contact.status.caffeine": "Nivel Cafeína",
      "contact.direct_email.title": "Email Directo", "contact.direct_email.subtitle": "Urgencias",
      "contact.form.name": "Nombre", "contact.form.name_placeholder": "Ej: Juan Pérez", "contact.form.email": "Email", "contact.form.email_placeholder": "Ej: juan@empresa.com", "contact.form.subject": "Asunto", "contact.subjects.general": "General", "contact.form.message": "Mensaje", "contact.form.message_placeholder": "¿Cómo podemos ayudar?", "contact.form.send": "Enviar", "contact.form.success": "¡Mensaje enviado!",

      "footer.slogan": "Gestión empresarial con IA.", "footer.company": "Empresa", "footer.legal": "Legal", "footer.privacy": "Privacidad", "footer.terms": "Términos", "footer.complaints": "Quejas", "footer.rights": "Derechos reservados.",

      "dashboard.menu.overview": "Visión General", "dashboard.menu.company": "Gestión Empresa", "dashboard.menu.chat": "Chat IA", "dashboard.menu.accounting": "Contabilidad", "dashboard.menu.communication": "Comunicación", "dashboard.menu.hr": "RRHH", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Configuración", "dashboard.menu.logout": "Cerrar Sesión",
      "dashboard.welcome": "Bienvenido", "dashboard.subtitle": "Tu asistente IA está listo.", "dashboard.open_chat": "Abrir Chat", "dashboard.stats.revenue": "Ingresos", "dashboard.stats.actions": "Acciones IA", "dashboard.stats.invoices": "Facturas",
      "notifications.title": "Notificaciones", "notifications.empty": "Sin notificaciones.",

      "profile.edit": "Editar Perfil", "profile.edit_title": "Editar Perfil", "profile.company_section": "Info Empresa", "PROFILE.COMPANY_SECTION": "Info Empresa",
      "profile.delete": "Eliminar Cuenta", "profile.success": "¡Actualizado con éxito!",
      "role.owner": "Dueño", "role.employee": "Empleado",
      "delete.title": "Peligro", "delete.text": "¿Eliminar cuenta permanentemente? Escribe ELIMINAR:", "delete.confirm_text": "Escribe ELIMINAR para confirmar.",
      
      "settings.company_title": "Gestión Empresa", "settings.invite_code": "Código Invitación", "settings.invite_text": "Comparte con empleados.", "settings.team_members": "Miembros del Equipo", "settings.no_members": "Sin empleados.", "settings.restricted_title": "Acceso Restringido", "settings.restricted_text": "Solo el dueño puede ver esto.",
      
      "common.save": "Guardar", "common.cancel": "Cancelar", "common.delete": "Eliminar", "common.saving": "Guardando...",
      "form.fullname": "Nombre", "form.jobtitle": "Cargo", "form.email": "Email", "form.company_name": "Empresa", "form.address": "Dirección", "form.nif": "NIF", "form.code": "Código",
      "table.name": "Nombre", "table.email": "Email", "table.role": "Cargo", "table.actions": "Acciones", "team.edit_role": "Editar Cargo", "team.role_updated": "¡Actualizado!", "team.delete_confirm": "¿Eliminar empleado?", "team.member_removed": "Eliminado."
    }
  },

  // ============================================================
  // 🇩🇪 ALEMÃO (DE) - EXPANDIDO
  // ============================================================
  de: {
    translation: {
      "nav.home": "Startseite", "nav.pricing": "Preise", "nav.contact": "Kontakt", "nav.login": "Anmelden", "nav.signup": "Registrieren", "nav.logout": "Abmelden", "nav.dashboard": "Dashboard",
      
      "hero.savings": "KI-Ersparnisse",
      "hero.title": "Unternehmen auf Autopilot", "hero.description": "Sparen Sie 90% Kosten und eliminieren Sie Fehler.", "hero.cta": "Starten",
      
      "services.title": "Ihr KI-Team",
      "categories.accounting.title": "KI-Buchhaltung", "categories.accounting.description": "Automatische Rechnungen, Ausgabenverfolgung und Steuern.",
      "categories.communication.title": "Kommunikation", "categories.communication.description": "Automatische E-Mail-Antworten und Entwürfe.",
      "categories.hr.title": "Personalwesen", "categories.hr.description": "Gehaltsabrechnung, Urlaubsverwaltung und Onboarding.",
      "categories.marketing.title": "Marketing", "categories.marketing.description": "Automatische Kampagnen und Social Media.",
      "categories.administrative.title": "Verwaltung", "categories.administrative.description": "Digitale Ablage und Dateneingabe.",
      "categories.chat.title": "KI-Assistent", "categories.chat.description": "Ihr 24/7 intelligenter Berater.",

      "comparison.title": "Warum EasyCheck?", "comparison.traditional": "Traditionell", "comparison.recommended": "Empfohlen", "comparison.replace_text": "Ersetzt 5+ Gehälter", "comparison.total": "Gesamtkosten", "comparison.savings": "Geschätzte Ersparnis",
      "roles.accountant": "Buchhalter", "roles.admin": "Admin", "roles.hr": "HR-Manager", "roles.marketing": "Marketing", "roles.support": "Support",

      "login.title": "Anmelden", "auth.loginSubtitle": "Geben Sie Ihre Daten ein.", "login.email": "E-Mail", "login.password": "Passwort", "login.button": "Einloggen", "login.forgot": "Passwort vergessen?", "login.noAccount": "Kein Konto? Registrieren",
      "auth.createTitle": "Konto Erstellen", "auth.createSubtitle": "Automatisieren Sie Ihr Geschäft.", "auth.fullName": "Name", "auth.jobTitle": "Position", "auth.iHaveCode": "Ich habe einen Code", "auth.companyName": "Firmenname", "auth.generateCode": "Firma Erstellen", "auth.haveAccount": "Bereits ein Konto? Login",

      "contact.title": "Wie helfen?", "contact.subtitle": "Unser Team ist bereit.",
      "contact.greeting.morning": "Guten Morgen!", "contact.greeting.afternoon": "Guten Tag!", "contact.greeting.night": "Guten Abend!",
      "contact.status.title": "Systemstatus", "contact.status.online": "ONLINE", "contact.status.servers": "Server", "contact.status.response": "Reaktionszeit", "contact.status.caffeine": "Koffeinpegel",
      "contact.direct_email.title": "Direkt-E-Mail", "contact.direct_email.subtitle": "Für Notfälle",
      "contact.form.name": "Name", "contact.form.name_placeholder": "z.B. Max Mustermann", "contact.form.email": "E-Mail", "contact.form.email_placeholder": "z.B. max@firma.de", "contact.form.subject": "Betreff", "contact.subjects.general": "Allgemein", "contact.form.message": "Nachricht", "contact.form.message_placeholder": "Wie können wir helfen?", "contact.form.send": "Senden", "contact.form.success": "Gesendet!",

      "footer.slogan": "KI-gestützte Unternehmensführung.", "footer.company": "Firma", "footer.legal": "Rechtliches", "footer.privacy": "Datenschutz", "footer.terms": "AGB", "footer.complaints": "Beschwerden", "footer.rights": "Alle Rechte vorbehalten.",

      "dashboard.menu.overview": "Überblick", "dashboard.menu.company": "Firmenverwaltung", "dashboard.menu.chat": "KI-Chat", "dashboard.menu.accounting": "Buchhaltung", "dashboard.menu.communication": "Kommunikation", "dashboard.menu.hr": "Personal", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Einstellungen", "dashboard.menu.logout": "Abmelden",
      "dashboard.welcome": "Willkommen", "dashboard.subtitle": "KI-Assistent bereit.", "dashboard.open_chat": "Chat Öffnen", "dashboard.stats.revenue": "Umsatz", "dashboard.stats.actions": "KI-Aktionen", "dashboard.stats.invoices": "Rechnungen",
      "notifications.title": "Benachrichtigungen", "notifications.empty": "Keine Nachrichten.",

      "profile.edit": "Profil Bearbeiten", "profile.edit_title": "Profil Bearbeiten", "profile.company_section": "Firmeninfo", "PROFILE.COMPANY_SECTION": "Firmeninfo",
      "profile.delete": "Konto Löschen", "profile.success": "Aktualisiert!",
      "role.owner": "Inhaber", "role.employee": "Mitarbeiter",
      "delete.title": "Gefahr", "delete.text": "Konto löschen? ELIMINAR eingeben:", "delete.confirm_text": "ELIMINAR zur Bestätigung eingeben.",
      
      "settings.company_title": "Firmenverwaltung", "settings.invite_code": "Einladungscode", "settings.invite_text": "Mit Mitarbeitern teilen.", "settings.team_members": "Team", "settings.no_members": "Keine Mitarbeiter.", "settings.restricted_title": "Zugriff Verweigert", "settings.restricted_text": "Nur der Inhaber darf dies sehen.",
      
      "common.save": "Speichern", "common.saving": "Speichern...", "common.cancel": "Abbrechen", "common.delete": "Löschen",
      "form.fullname": "Name", "form.jobtitle": "Position", "form.email": "E-Mail", "form.company_name": "Firma", "form.address": "Adresse", "form.nif": "Steuernummer", "form.code": "Code",
      "table.name": "Name", "table.email": "E-Mail", "table.role": "Position", "table.actions": "Aktionen", "team.edit_role": "Position Bearbeiten", "team.role_updated": "Aktualisiert!", "team.delete_confirm": "Mitarbeiter entfernen?", "team.member_removed": "Entfernt."
    }
  },

  // ============================================================
  // 🇮🇹 ITALIANO (IT) - EXPANDIDO
  // ============================================================
  it: {
    translation: {
      "nav.home": "Home", "nav.pricing": "Prezzi", "nav.contact": "Contattaci", "nav.login": "Accedi", "nav.signup": "Registrati", "nav.logout": "Esci", "nav.dashboard": "Dashboard",
      
      "hero.savings": "Risparmi IA",
      "hero.title": "Azienda col Pilota Automatico", "hero.description": "Risparmia il 90% dei costi ed elimina errori manuali.", "hero.cta": "Inizia",
      
      "services.title": "Il Tuo Team IA",
      "categories.accounting.title": "Contabilità IA", "categories.accounting.description": "Fatture automatizzate, monitoraggio spese e calcolo tasse.",
      "categories.communication.title": "Comunicazione", "categories.communication.description": "Lettura e redazione automatica di email.",
      "categories.hr.title": "Risorse Umane", "categories.hr.description": "Gestione paghe, ferie e dipendenti.",
      "categories.marketing.title": "Marketing", "categories.marketing.description": "Creazione campagne e contenuti social.",
      "categories.administrative.title": "Amministrazione", "categories.administrative.description": "Archiviazione digitale e inserimento dati.",
      "categories.chat.title": "Assistente IA", "categories.chat.description": "Il tuo consulente intelligente 24/7.",

      "comparison.title": "Perché EasyCheck?", "comparison.traditional": "Tradizionale", "comparison.recommended": "Consigliato", "comparison.replace_text": "Sostituisce 5+ Stipendi", "comparison.total": "Costo Totale", "comparison.savings": "Risparmio Stimato",
      "roles.accountant": "Contabile", "roles.admin": "Admin", "roles.hr": "Manager HR", "roles.marketing": "Marketing", "roles.support": "Supporto",

      "login.title": "Accedi", "auth.loginSubtitle": "Inserisci le tue credenziali.", "login.email": "Email", "login.password": "Password", "login.button": "Entra", "login.forgot": "Password dimenticata?", "login.noAccount": "Non hai un account? Registrati",
      "auth.createTitle": "Crea Account", "auth.createSubtitle": "Automatizza la tua azienda.", "auth.fullName": "Nome Completo", "auth.jobTitle": "Ruolo", "auth.iHaveCode": "Ho un codice", "auth.companyName": "Nome Azienda", "auth.generateCode": "Genera Azienda", "auth.haveAccount": "Hai già un account? Accedi",

      "contact.title": "Come aiutare?", "contact.subtitle": "Il nostro team è pronto.",
      "contact.greeting.morning": "Buongiorno!", "contact.greeting.afternoon": "Buon pomeriggio!", "contact.greeting.night": "Buonasera!",
      "contact.status.title": "Stato Sistema", "contact.status.online": "ONLINE", "contact.status.servers": "Server", "contact.status.response": "Tempo Risposta", "contact.status.caffeine": "Livello Caffeina",
      "contact.direct_email.title": "Email Diretta", "contact.direct_email.subtitle": "Per urgenze",
      "contact.form.name": "Nome", "contact.form.name_placeholder": "Es: Mario Rossi", "contact.form.email": "Email", "contact.form.email_placeholder": "Es: mario@azienda.it", "contact.form.subject": "Oggetto", "contact.subjects.general": "Generale", "contact.form.message": "Messaggio", "contact.form.message_placeholder": "Come possiamo aiutare?", "contact.form.send": "Invia", "contact.form.success": "Inviato!",

      "footer.slogan": "Gestione aziendale IA.", "footer.company": "Azienda", "footer.legal": "Legale", "footer.privacy": "Privacy", "footer.terms": "Termini", "footer.complaints": "Reclami", "footer.rights": "Tutti i diritti riservati.",

      "dashboard.menu.overview": "Panoramica", "dashboard.menu.company": "Gestione Azienda", "dashboard.menu.chat": "Chat IA", "dashboard.menu.accounting": "Contabilità", "dashboard.menu.communication": "Comunicazione", "dashboard.menu.hr": "Risorse Umane", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Impostazioni", "dashboard.menu.logout": "Esci",
      "dashboard.welcome": "Benvenuto", "dashboard.subtitle": "Assistente IA pronto.", "dashboard.open_chat": "Apri Chat", "dashboard.stats.revenue": "Entrate", "dashboard.stats.actions": "Azioni IA", "dashboard.stats.invoices": "Fatture",
      "notifications.title": "Notifiche", "notifications.empty": "Nessuna notifica.",

      "profile.edit": "Modifica Profilo", "profile.edit_title": "Modifica Profilo", "profile.company_section": "Info Azienda", "PROFILE.COMPANY_SECTION": "Info Azienda",
      "profile.delete": "Elimina Account", "profile.success": "Aggiornato!",
      "role.owner": "Proprietario", "role.employee": "Dipendente",
      "delete.title": "Pericolo", "delete.text": "Eliminare account? Scrivi ELIMINAR:", "delete.confirm_text": "Scrivi ELIMINAR per confermare.",
      
      "settings.company_title": "Gestione Azienda", "settings.invite_code": "Codice Invito", "settings.invite_text": "Condividi con i dipendenti.", "settings.team_members": "Team", "settings.no_members": "Nessun dipendente.", "settings.restricted_title": "Accesso Limitato", "settings.restricted_text": "Solo il proprietario può vedere questo.",
      
      "common.save": "Salva", "common.saving": "Salvataggio...", "common.cancel": "Annulla", "common.delete": "Elimina",
      "form.fullname": "Nome", "form.jobtitle": "Ruolo", "form.email": "Email", "form.company_name": "Azienda", "form.address": "Indirizzo", "form.nif": "Codice Fiscale", "form.code": "Codice",
      "table.name": "Nome", "table.email": "Email", "table.role": "Ruolo", "table.actions": "Azioni", "team.edit_role": "Modifica Ruolo", "team.role_updated": "Aggiornato!", "team.delete_confirm": "Rimuovere dipendente?", "team.member_removed": "Rimosso."
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