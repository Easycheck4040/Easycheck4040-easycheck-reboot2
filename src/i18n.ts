import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  // --- INGLÊS (EN) ---
  en: {
    translation: {
      // NAV
      "nav.home": "Home", "nav.pricing": "Pricing", "nav.contact": "Contact", "nav.login": "Login", "nav.signup": "Sign Up", "nav.logout": "Log Out", "nav.dashboard": "Dashboard",
      
      // HERO & SERVICES (Textos dos cartões que faltavam)
      "hero.title": "Run Your Business on Autopilot", 
      "hero.description": "Save 90% on costs and eliminate manual errors.",
      "services.title": "Your AI Team",
      "categories.accounting.title": "AI Accounting", "categories.accounting.description": "Automated invoices and tax calculations.",
      "categories.communication.title": "Smart Communication", "categories.communication.description": "AI email responses and drafting.",
      "categories.hr.title": "HR Management", "categories.hr.description": "Payroll and employee management.",
      "categories.marketing.title": "Marketing", "categories.marketing.description": "Ad campaigns and social media posts.",
      "categories.administrative.title": "Admin Automation", "categories.administrative.description": "File organization and data entry.",
      "categories.chat.title": "AI Chat", "categories.chat.description": "24/7 business assistant.",

      // CONTACT PAGE (Correção dos prints)
      "contact.title": "How can we help?", 
      "contact.subtitle": "Our team is ready.",
      "contact.greeting.morning": "Good morning!", 
      "contact.greeting.afternoon": "Good afternoon!", 
      "contact.greeting.night": "Good evening!",
      "contact.status.servers": "System Status",
      "contact.status.response": "Avg. Response Time",
      "contact.status.caffeine": "Caffeine Level",
      "contact.direct_email.title": "Direct Email",
      "contact.direct_email.subtitle": "For urgent matters",
      "contact.form.name": "Name", "contact.form.name_placeholder": "Ex: John Doe",
      "contact.form.email": "Email", "contact.form.email_placeholder": "Ex: john@company.com",
      "contact.form.subject": "Subject", "contact.subjects.general": "General Inquiry",
      "contact.form.message": "Message", "contact.form.message_placeholder": "How can we help you today?",
      "contact.form.send": "Send Message", "contact.form.success": "Message sent!",

      // DASHBOARD MENU
      "dashboard.menu.overview": "Overview", 
      "dashboard.menu.company": "Company Management", // Correção do print 3
      "dashboard.menu.chat": "AI Chat", 
      "dashboard.menu.accounting": "Accounting", 
      "dashboard.menu.communication": "Communication", 
      "dashboard.menu.hr": "Human Resources", 
      "dashboard.menu.marketing": "Marketing", 
      "dashboard.menu.settings": "Settings", 
      "dashboard.menu.logout": "Log Out",
      
      // DASHBOARD CONTENT
      "dashboard.welcome": "Welcome", "dashboard.subtitle": "Your AI assistant is ready.", "dashboard.open_chat": "Open Chat",
      "dashboard.stats.revenue": "Revenue", "dashboard.stats.actions": "AI Actions", "dashboard.stats.invoices": "Invoices",
      "notifications.title": "Notifications", "notifications.empty": "No new notifications.",

      // PROFILE & SETTINGS (Correção do print 4)
      "profile.edit": "Edit Profile", 
      "profile.edit_title": "Edit Profile", 
      "profile.company_section": "Company Information", // Correção da chave maiúscula/minúscula
      "PROFILE.COMPANY_SECTION": "Company Information", // Fallback caso o código use maiúsculas
      "profile.delete": "Delete Account", "profile.success": "Updated!",
      "role.owner": "Owner", "role.employee": "Employee",
      "delete.title": "Danger Zone", "delete.text": "Delete account? Type ELIMINAR:",
      
      // COMPANY MANAGEMENT
      "settings.company_title": "Company Management", "settings.invite_code": "Invite Code", "settings.invite_text": "Share with employees.", "settings.team_members": "Team", "settings.no_members": "No employees.", "settings.restricted_title": "Restricted", "settings.restricted_text": "Owner only.",
      
      // FORMS
      "table.name": "Name", "table.email": "Email", "table.role": "Role", "table.actions": "Actions",
      "common.save": "Save", "common.cancel": "Cancel", "common.delete": "Delete",
      "form.email": "Email", "form.fullname": "Full Name", "form.jobtitle": "Job Title", 
      "form.company_name": "Company Name", "form.address": "Address", "form.nif": "Tax ID (NIF)", "form.code": "Code"
    }
  },

  // --- PORTUGUÊS (PT) ---
  pt: {
    translation: {
      "nav.home": "Início", "nav.pricing": "Preços", "nav.contact": "Contactos", "nav.login": "Entrar", "nav.signup": "Criar Conta", "nav.logout": "Sair", "nav.dashboard": "Dashboard",
      
      // HERO & SERVICES
      "hero.title": "Gere a Tua Empresa em Piloto Automático", 
      "hero.description": "Poupa 90% dos custos e elimina erros manuais.",
      "services.title": "A Tua Equipa de IA",
      "categories.accounting.title": "Contabilidade IA", "categories.accounting.description": "Faturas automáticas e cálculo de impostos.",
      "categories.communication.title": "Comunicação", "categories.communication.description": "Respostas de email automáticas e inteligentes.",
      "categories.hr.title": "Gestão de RH", "categories.hr.description": "Processamento salarial e gestão de equipa.",
      "categories.marketing.title": "Marketing", "categories.marketing.description": "Campanhas e posts para redes sociais.",
      "categories.administrative.title": "Automação Admin", "categories.administrative.description": "Organização de arquivos e dados.",
      "categories.chat.title": "Chat IA", "categories.chat.description": "O teu assistente 24/7.",

      // CONTACTOS
      "contact.title": "Como podemos ajudar?", 
      "contact.subtitle": "A nossa equipa está pronta.",
      "contact.greeting.morning": "Bom dia!", 
      "contact.greeting.afternoon": "Boa tarde!", 
      "contact.greeting.night": "Boa noite!",
      "contact.status.servers": "Estado do Sistema",
      "contact.status.response": "Tempo de Resposta",
      "contact.status.caffeine": "Nível de Cafeína",
      "contact.direct_email.title": "Email Direto",
      "contact.direct_email.subtitle": "Para assuntos urgentes",
      "contact.form.name": "Nome", "contact.form.name_placeholder": "Ex: João Silva",
      "contact.form.email": "Email", "contact.form.email_placeholder": "Ex: joao@empresa.com",
      "contact.form.subject": "Assunto", "contact.subjects.general": "Informação Geral",
      "contact.form.message": "Mensagem", "contact.form.message_placeholder": "Como podemos ajudar hoje?",
      "contact.form.send": "Enviar Mensagem", "contact.form.success": "Mensagem enviada!",

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
      
      "dashboard.welcome": "Bem-vindo", "dashboard.subtitle": "O assistente está pronto.", "dashboard.open_chat": "Abrir Chat",
      "dashboard.stats.revenue": "Receita", "dashboard.stats.actions": "Ações IA", "dashboard.stats.invoices": "Faturas",
      "notifications.title": "Notificações", "notifications.empty": "Sem notificações.",

      // PERFIL
      "profile.edit": "Editar Perfil", 
      "profile.edit_title": "Editar Perfil", 
      "profile.company_section": "Informação da Empresa",
      "PROFILE.COMPANY_SECTION": "Informação da Empresa",
      "profile.delete": "Eliminar Conta", "profile.success": "Atualizado!",
      "role.owner": "Patrão", "role.employee": "Funcionário",
      "delete.title": "Zona de Perigo", "delete.text": "Apagar conta? Escreve ELIMINAR:",
      
      "settings.company_title": "Gestão da Empresa", "settings.invite_code": "Código de Convite", "settings.invite_text": "Partilha com funcionários.", "settings.team_members": "Membros", "settings.no_members": "Sem funcionários.", "settings.restricted_title": "Acesso Restrito", "settings.restricted_text": "Apenas o patrão pode ver.",
      
      "table.name": "Nome", "table.email": "Email", "table.role": "Cargo", "table.actions": "Ações",
      "common.save": "Guardar", "common.cancel": "Cancelar", "common.delete": "Apagar",
      "form.email": "Email", "form.fullname": "Nome Completo", "form.jobtitle": "Cargo", 
      "form.company_name": "Nome da Empresa", "form.address": "Morada", "form.nif": "NIF", "form.code": "Código"
    }
  },

  // --- FRANCÊS (FR) ---
  fr: {
    translation: {
      "nav.home": "Accueil", "nav.contact": "Contact", "nav.login": "Connexion", "nav.logout": "Déconnexion", "nav.dashboard": "Tableau de bord",
      
      "hero.title": "Gérez Votre Entreprise en Pilote Automatique", "hero.description": "Économisez 90% des coûts.",
      "services.title": "Votre Équipe IA",
      "categories.accounting.description": "Factures et impôts.", "categories.communication.description": "Réponses emails.", "categories.hr.description": "Paie et employés.", "categories.marketing.description": "Marketing digital.", "categories.administrative.description": "Administration.", "categories.chat.description": "Assistant 24/7.",

      "contact.title": "Besoin d'aide ?", "contact.greeting.night": "Bonsoir !", "contact.form.send": "Envoyer", "contact.status.servers": "Statut Système",

      "dashboard.menu.overview": "Vue d'ensemble", "dashboard.menu.company": "Gestion Entreprise", "dashboard.menu.settings": "Paramètres",
      "profile.edit": "Modifier Profil", "profile.company_section": "Info Entreprise", "PROFILE.COMPANY_SECTION": "Info Entreprise",
      "form.company_name": "Nom Entreprise", "form.address": "Adresse", "form.nif": "Numéro Fiscal"
    }
  },

  // --- ESPANHOL (ES) ---
  es: {
    translation: {
      "nav.home": "Inicio", "nav.contact": "Contacto", "nav.login": "Acceso", "nav.logout": "Salir", "nav.dashboard": "Panel",
      
      "hero.title": "Gestiona Tu Empresa en Piloto Automático", "hero.description": "Ahorra 90% en costos.",
      "services.title": "Tu Equipo de IA",
      "categories.accounting.description": "Facturas e impuestos.", "categories.communication.description": "Respuestas emails.", "categories.hr.description": "Nóminas y empleados.", "categories.marketing.description": "Marketing digital.", "categories.administrative.description": "Administración.", "categories.chat.description": "Asistente 24/7.",

      "contact.title": "¿Ayuda?", "contact.greeting.night": "¡Buenas noches!", "contact.form.send": "Enviar", "contact.status.servers": "Estado Sistema",

      "dashboard.menu.overview": "Visión General", "dashboard.menu.company": "Gestión Empresa", "dashboard.menu.settings": "Configuración",
      "profile.edit": "Editar Perfil", "profile.company_section": "Info Empresa", "PROFILE.COMPANY_SECTION": "Info Empresa",
      "form.company_name": "Nombre Empresa", "form.address": "Dirección", "form.nif": "NIF"
    }
  },

  // --- ALEMÃO (DE) ---
  de: {
    translation: {
      "nav.home": "Startseite", "nav.contact": "Kontakt", "nav.login": "Anmelden", "nav.logout": "Abmelden", "nav.dashboard": "Dashboard",
      "services.title": "Ihr KI-Team",
      "categories.accounting.description": "Rechnungen & Steuern.", "categories.communication.description": "E-Mail-Antworten.", "categories.hr.description": "Personalwesen.", "categories.marketing.description": "Marketing.", "categories.administrative.description": "Verwaltung.", "categories.chat.description": "24/7 Assistent.",
      
      "contact.greeting.night": "Guten Abend!", "contact.status.servers": "Systemstatus",
      "dashboard.menu.overview": "Überblick", "dashboard.menu.company": "Firmenverwaltung", "dashboard.menu.settings": "Einstellungen",
      "profile.company_section": "Firmeninfo", "PROFILE.COMPANY_SECTION": "Firmeninfo",
      "form.company_name": "Firmenname", "form.address": "Adresse", "form.nif": "Steuernummer"
    }
  },

  // --- ITALIANO (IT) ---
  it: {
    translation: {
      "nav.home": "Home", "nav.contact": "Contatti", "nav.login": "Accedi", "nav.logout": "Esci", "nav.dashboard": "Dashboard",
      "services.title": "Il Tuo Team IA",
      "categories.accounting.description": "Fatture e tasse.", "categories.communication.description": "Risposte email.", "categories.hr.description": "Risorse Umane.", "categories.marketing.description": "Marketing.", "categories.administrative.description": "Amministrazione.", "categories.chat.description": "Assistente 24/7.",
      
      "contact.greeting.night": "Buonasera!", "contact.status.servers": "Stato Sistema",
      "dashboard.menu.overview": "Panoramica", "dashboard.menu.company": "Gestione Azienda", "dashboard.menu.settings": "Impostazioni",
      "profile.company_section": "Info Azienda", "PROFILE.COMPANY_SECTION": "Info Azienda",
      "form.company_name": "Nome Azienda", "form.address": "Indirizzo", "form.nif": "Codice Fiscale"
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