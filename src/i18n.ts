import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  // --- INGLÊS (EN) ---
  en: {
    translation: {
      // NAV
      "nav.home": "Home", "nav.pricing": "Pricing", "nav.contact": "Contact", "nav.login": "Login", "nav.signup": "Sign Up", "nav.dashboard": "Dashboard", "nav.logout": "Log Out",
      
      // HERO SECTION
      "hero.savings": "Faster, Cheaper, Smarter",
      "hero.title": "Run Your Business on Autopilot with AI",
      "hero.description": "Why hire 5 employees when one AI can do it all? Save 90% on costs, eliminate manual errors, and get tasks done in seconds.",
      "hero.cta": "Start Saving Now",

      // COMPARISON TABLE
      "comparison.title": "Traditional Costs vs EasyCheck",
      "comparison.traditional": "The Expensive Way",
      "comparison.recommended": "The Smart Way",
      "comparison.total": "Total Monthly Cost:",
      "comparison.replace_text": "Replaces 5 Full-time Roles",
      "comparison.savings": "You save €13,601 per month!",
      "roles.accountant": "Accountant", "roles.admin": "Admin Assistant", "roles.hr": "HR Manager", "roles.marketing": "Marketing Specialist", "roles.support": "Customer Support",

      // SERVICES
      "services.title": "Your AI Workforce",
      "categories.accounting.title": "AI Accounting", "categories.accounting.desc": "Automated invoices & tax calculation.",
      "categories.communication.title": "Smart Communication", "categories.communication.desc": "AI drafts professional emails instantly.",
      "categories.administrative.title": "Admin Automation", "categories.administrative.desc": "Organizes contracts & data entry.",
      "categories.hr.title": "HR Management", "categories.hr.desc": "Payroll & employee onboarding.",
      "categories.marketing.title": "Growth Marketing", "categories.marketing.desc": "Ad campaigns & social media.",
      "categories.chat.title": "EasyCheck AI Chat", "categories.chat.desc": "Your 24/7 business advisor.",

      // PRICING PAGE
      "pricing.title": "Simple Pricing", "pricing.subtitle": "Choose the plan that fits your business.", "pricing.starter": "Starter", "pricing.pro": "Pro", "pricing.enterprise": "Enterprise", "pricing.feat_invoices": "Unlimited Invoices", "pricing.feat_chat": "AI Chat Assistant", "pricing.choose": "Choose Plan",

      // CONTACT PAGE
      "contact.title": "How can we help?", "contact.subtitle": "Our team (and AI) are ready to answer.",
      "contact.form.name": "Name", "contact.form.email": "Email", "contact.form.subject": "Subject", "contact.form.message": "Message", "contact.form.send": "Send Message", "contact.form.success": "Sent Successfully!",
      "contact.status.title": "Operational Status", "contact.status.online": "ONLINE",

      // FOOTER
      "footer.slogan": "Helping companies grow on autopilot.", "footer.company": "Company", "footer.legal": "Legal", "footer.privacy": "Privacy Policy", "footer.terms": "Terms of Use", "footer.rights": "All rights reserved.",

      // LOGIN / AUTH
      "login.title": "Welcome Back", "login.button": "Sign In", "auth.createTitle": "Create Account", "auth.companyName": "Company Name", "auth.companyCode": "Company Code",

      // DASHBOARD MENU
      "dashboard.menu.overview": "Overview", "dashboard.menu.chat": "AI Chat", "dashboard.menu.accounting": "Accounting", "dashboard.menu.communication": "Communication", "dashboard.menu.hr": "Human Resources", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Settings", "dashboard.menu.logout": "Log Out",
      
      // DASHBOARD CONTENT
      "dashboard.welcome": "Welcome", "dashboard.subtitle": "Your AI assistant is ready to work.", "dashboard.open_chat": "Open AI Chat",
      "dashboard.stats.revenue": "Monthly Revenue", "dashboard.stats.actions": "AI Actions", "dashboard.stats.invoices": "Pending Invoices",
      "notifications.title": "Notifications", "notifications.empty": "No new notifications.",

      // DASHBOARD SETTINGS & PROFILE
      "profile.edit": "Edit Profile", "profile.delete": "Delete Account", "profile.edit_title": "Edit Profile", "profile.success": "Profile updated successfully!",
      "role.owner": "Owner / Admin", "role.employee": "Employee",
      "delete.title": "Danger Zone", "delete.text": "Delete account permanently? Type ELIMINAR:", "delete.confirm_text": "Please type ELIMINAR to confirm.",
      
      // TEAM MANAGEMENT
      "settings.company_title": "Company Management", "settings.invite_code": "Team Invite Code", "settings.invite_text": "Share this code with employees to join.",
      "settings.team_members": "Team Members", "settings.no_members": "No employees registered yet.",
      "settings.restricted_title": "Access Restricted", "settings.restricted_text": "Only the company owner can manage settings and view the team.",
      
      // TABLES & FORMS (COMMON)
      "table.name": "Name", "table.email": "Email", "table.role": "Role", "table.actions": "Actions",
      "common.save": "Save", "common.cancel": "Cancel", "common.delete": "Delete", "form.fullname": "Full Name", "form.jobtitle": "Job Title"
    }
  },

  // --- PORTUGUÊS (PT) ---
  pt: {
    translation: {
      // NAV
      "nav.home": "Início", "nav.pricing": "Preços", "nav.contact": "Contactos", "nav.login": "Entrar", "nav.signup": "Criar Conta", "nav.dashboard": "Dashboard", "nav.logout": "Sair",
      
      // HERO
      "hero.savings": "Mais Rápido, Mais Fácil, Mais Barato",
      "hero.title": "Gere a Tua Empresa em Piloto Automático",
      "hero.description": "Porquê contratar 5 funcionários quando uma IA faz tudo? Poupa 90% dos custos, elimina erros manuais e completa tarefas em segundos.",
      "hero.cta": "Começar a Poupar",

      // COMPARAÇÃO
      "comparison.title": "Custo Tradicional vs EasyCheck",
      "comparison.traditional": "O Caminho Caro",
      "comparison.recommended": "O Caminho Inteligente",
      "comparison.total": "Custo Mensal Total:",
      "comparison.replace_text": "Substitui 5 Cargos a Tempo Inteiro",
      "comparison.savings": "Poupas €13,601 por mês!",
      "roles.accountant": "Contabilista", "roles.admin": "Assistente Admin", "roles.hr": "Gestor RH", "roles.marketing": "Marketing", "roles.support": "Suporte",

      // SERVIÇOS
      "services.title": "A Tua Equipa de IA",
      "categories.accounting.title": "Contabilidade IA", "categories.accounting.desc": "Faturas automáticas e impostos.",
      "categories.communication.title": "Comunicação Smart", "categories.communication.desc": "Respostas de email automáticas.",
      "categories.administrative.title": "Automação Admin", "categories.administrative.desc": "Organização de documentos.",
      "categories.hr.title": "Gestão RH", "categories.hr.desc": "Salários e gestão de equipa.",
      "categories.marketing.title": "Marketing", "categories.marketing.desc": "Campanhas e redes sociais.",
      "categories.chat.title": "Chat IA", "categories.chat.desc": "O teu consultor 24/7.",

      // PREÇOS
      "pricing.title": "Preços Simples", "pricing.subtitle": "Escolhe o plano ideal.", "pricing.starter": "Iniciante", "pricing.pro": "Profissional", "pricing.enterprise": "Empresarial", "pricing.feat_invoices": "Faturas Ilimitadas", "pricing.feat_chat": "Chat Assistente IA", "pricing.choose": "Escolher Plano",

      // CONTACTOS
      "contact.title": "Como podemos ajudar?", "contact.subtitle": "A nossa equipa (e IA) estão prontas.",
      "contact.form.name": "Nome", "contact.form.email": "Email", "contact.form.subject": "Assunto", "contact.form.message": "Mensagem", "contact.form.send": "Enviar Mensagem", "contact.form.success": "Enviado com Sucesso!",
      "contact.status.title": "Status Operacional", "contact.status.online": "ONLINE",

      // FOOTER
      "footer.slogan": "Ajudamos empresas a crescer em piloto automático.", "footer.company": "Empresa", "footer.legal": "Legal", "footer.privacy": "Política de Privacidade", "footer.terms": "Termos de Uso", "footer.rights": "Todos os direitos reservados.",

      // LOGIN
      "login.title": "Bem-vindo", "login.button": "Entrar", "auth.createTitle": "Criar Conta", "auth.companyName": "Nome da Empresa", "auth.companyCode": "Código da Empresa",

      // DASHBOARD MENU
      "dashboard.menu.overview": "Visão Geral", "dashboard.menu.chat": "Chat IA", "dashboard.menu.accounting": "Contabilidade", "dashboard.menu.communication": "Comunicação", "dashboard.menu.hr": "Recursos Humanos", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Definições", "dashboard.menu.logout": "Sair da Conta",
      
      // DASHBOARD CONTENT
      "dashboard.welcome": "Bem-vindo", "dashboard.subtitle": "O teu assistente IA está pronto a trabalhar.", "dashboard.open_chat": "Abrir Chat IA",
      "dashboard.stats.revenue": "Receita Mensal", "dashboard.stats.actions": "Ações IA", "dashboard.stats.invoices": "Faturas",
      "notifications.title": "Notificações", "notifications.empty": "Sem novas notificações.",

      // DASHBOARD SETTINGS & PROFILE
      "profile.edit": "Editar Perfil", "profile.delete": "Eliminar Conta", "profile.edit_title": "Editar Perfil", "profile.success": "Perfil atualizado com sucesso!",
      "role.owner": "Patrão / Admin", "role.employee": "Funcionário",
      "delete.title": "Zona de Perigo", "delete.text": "Apagar conta permanentemente? Escreve ELIMINAR:", "delete.confirm_text": "Escreve ELIMINAR para confirmar.",
      
      // TEAM MANAGEMENT
      "settings.company_title": "Gestão da Empresa", "settings.invite_code": "Código de Convite", "settings.invite_text": "Partilha este código com os funcionários.", "settings.team_members": "Membros da Equipa", "settings.no_members": "Ainda não tens funcionários registados.", "settings.restricted_title": "Acesso Restrito", "settings.restricted_text": "Apenas o administrador da empresa pode gerir as definições.",
      
      // TABLES & FORMS
      "table.name": "Nome", "table.email": "Email", "table.role": "Cargo", "table.actions": "Ações",
      "common.save": "Guardar", "common.cancel": "Cancelar", "common.delete": "Apagar", "form.fullname": "Nome Completo", "form.jobtitle": "Cargo"
    }
  },

  // --- FRANCÊS (FR) ---
  fr: {
    translation: {
      "nav.home": "Accueil", "nav.pricing": "Tarifs", "nav.contact": "Contact", "nav.login": "Connexion", "nav.signup": "S'inscrire", "nav.dashboard": "Tableau de bord", "nav.logout": "Déconnexion",
      "hero.savings": "Plus Rapide, Moins Cher", "hero.title": "Gérez Votre Entreprise en Pilote Automatique", "hero.description": "Économisez 90% des coûts.", "hero.cta": "Commencer",
      "comparison.title": "Coûts Traditionnels vs EasyCheck", "comparison.total": "Coût Mensuel Total :", "comparison.savings": "Vous économisez €13,601 par mois !",
      "services.title": "Votre Équipe IA", "pricing.title": "Tarifs Simples", "contact.title": "Besoin d'aide ?", "footer.slogan": "Automatisez votre entreprise.",
      
      "dashboard.menu.overview": "Vue d'ensemble", "dashboard.menu.chat": "Chat IA", "dashboard.menu.accounting": "Comptabilité", "dashboard.menu.communication": "Communication", "dashboard.menu.hr": "RH", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Paramètres",
      "dashboard.welcome": "Bienvenue", "dashboard.subtitle": "Votre assistant IA est prêt.", "dashboard.open_chat": "Ouvrir Chat IA",
      "dashboard.stats.revenue": "Revenu Mensuel", "dashboard.stats.actions": "Actions IA", "dashboard.stats.invoices": "Factures",
      
      "profile.edit": "Modifier Profil", "profile.delete": "Supprimer Compte", "role.owner": "Patron", "role.employee": "Employé",
      "settings.company_title": "Gestion Entreprise", "settings.invite_code": "Code d'Invitation", "settings.restricted_title": "Accès Restreint",
      "table.name": "Nom", "table.role": "Poste", "table.actions": "Actions", "common.save": "Enregistrer", "common.cancel": "Annuler"
    }
  },

  // --- ESPANHOL (ES) ---
  es: {
    translation: {
      "nav.home": "Inicio", "nav.pricing": "Precios", "nav.contact": "Contacto", "nav.login": "Acceso", "nav.signup": "Registro", "nav.dashboard": "Panel", "nav.logout": "Salir",
      "hero.savings": "Más Rápido, Más Barato", "hero.title": "Gestiona Tu Empresa en Piloto Automático", "hero.description": "Ahorra 90% en costos.", "hero.cta": "Empezar",
      "comparison.title": "Costos Tradicionales vs EasyCheck", "comparison.total": "Costo Mensual Total:", "comparison.savings": "¡Ahorras €13,601 al mes!",
      "services.title": "Tu Equipo de IA", "pricing.title": "Precios Simples", "contact.title": "¿Ayuda?", "footer.slogan": "Automatiza tu empresa.",
      
      "dashboard.menu.overview": "Visión General", "dashboard.menu.chat": "Chat IA", "dashboard.menu.accounting": "Contabilidad", "dashboard.menu.communication": "Comunicación", "dashboard.menu.hr": "RRHH", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Configuración",
      "dashboard.welcome": "Bienvenido", "dashboard.subtitle": "Tu asistente IA está listo.", "dashboard.open_chat": "Abrir Chat IA",
      "dashboard.stats.revenue": "Ingresos", "dashboard.stats.actions": "Acciones IA", "dashboard.stats.invoices": "Facturas",
      
      "profile.edit": "Editar Perfil", "profile.delete": "Eliminar Cuenta", "role.owner": "Dueño", "role.employee": "Empleado",
      "settings.company_title": "Gestión Empresa", "settings.invite_code": "Código Invitación", "settings.restricted_title": "Acceso Restringido",
      "table.name": "Nombre", "table.role": "Cargo", "table.actions": "Acciones", "common.save": "Guardar", "common.cancel": "Cancelar"
    }
  },

  // --- ALEMÃO (DE) ---
  de: {
    translation: {
      "nav.home": "Startseite", "nav.pricing": "Preise", "nav.contact": "Kontakt", "nav.login": "Anmelden", "nav.signup": "Registrieren", "nav.dashboard": "Dashboard", "nav.logout": "Abmelden",
      "hero.savings": "Schneller, Billiger", "hero.title": "Führen Sie Ihr Unternehmen auf Autopilot", "hero.description": "Sparen Sie 90% der Kosten.", "hero.cta": "Starten",
      "comparison.title": "Kostenvergleich", "comparison.total": "Gesamtkosten:", "comparison.savings": "Sie sparen €13,601!",
      "services.title": "Ihr KI-Team", "pricing.title": "Einfache Preise", "contact.title": "Hilfe?", "footer.slogan": "Automatisieren Sie Ihr Geschäft.",
      
      "dashboard.menu.overview": "Überblick", "dashboard.menu.chat": "KI-Chat", "dashboard.menu.accounting": "Buchhaltung", "dashboard.menu.communication": "Kommunikation", "dashboard.menu.hr": "Personal", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Einstellungen",
      "dashboard.welcome": "Willkommen", "dashboard.subtitle": "KI-Assistent bereit.", "dashboard.open_chat": "KI-Chat Öffnen",
      "dashboard.stats.revenue": "Umsatz", "dashboard.stats.actions": "KI-Aktionen", "dashboard.stats.invoices": "Rechnungen",
      
      "profile.edit": "Profil Bearbeiten", "profile.delete": "Konto Löschen", "role.owner": "Inhaber", "role.employee": "Mitarbeiter",
      "settings.company_title": "Firmenverwaltung", "settings.invite_code": "Einladungscode", "settings.restricted_title": "Zugriff Verweigert",
      "table.name": "Name", "table.role": "Position", "table.actions": "Aktionen", "common.save": "Speichern", "common.cancel": "Abbrechen"
    }
  },

  // --- ITALIANO (IT) ---
  it: {
    translation: {
      "nav.home": "Home", "nav.pricing": "Prezzi", "nav.contact": "Contatti", "nav.login": "Accedi", "nav.signup": "Registrati", "nav.dashboard": "Dashboard", "nav.logout": "Esci",
      "hero.savings": "Più Veloce, Più Economico", "hero.title": "Gestisci la Tua Azienda col Pilota Automatico", "hero.description": "Risparmia il 90% dei costi.", "hero.cta": "Inizia",
      "comparison.title": "Confronto Costi", "comparison.total": "Costo Totale:", "comparison.savings": "Risparmi €13,601!",
      "services.title": "Il Tuo Team IA", "pricing.title": "Prezzi Semplici", "contact.title": "Aiuto?", "footer.slogan": "Automatizza la tua azienda.",
      
      "dashboard.menu.overview": "Panoramica", "dashboard.menu.chat": "Chat IA", "dashboard.menu.accounting": "Contabilità", "dashboard.menu.communication": "Comunicazione", "dashboard.menu.hr": "Risorse Umane", "dashboard.menu.marketing": "Marketing", "dashboard.menu.settings": "Impostazioni",
      "dashboard.welcome": "Benvenuto", "dashboard.subtitle": "Assistente IA pronto.", "dashboard.open_chat": "Apri Chat IA",
      "dashboard.stats.revenue": "Entrate", "dashboard.stats.actions": "Azioni IA", "dashboard.stats.invoices": "Fatture",
      
      "profile.edit": "Modifica Profilo", "profile.delete": "Elimina Account", "role.owner": "Proprietario", "role.employee": "Dipendente",
      "settings.company_title": "Gestione Azienda", "settings.invite_code": "Codice Invito", "settings.restricted_title": "Accesso Limitato",
      "table.name": "Nome", "table.role": "Ruolo", "table.actions": "Azioni", "common.save": "Salva", "common.cancel": "Annulla"
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