import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  // --- INGLÊS (EN) ---
  en: {
    translation: {
      // NAV & HERO
      "nav.login": "Login", "nav.signup": "Sign Up", "nav.home": "Home", "nav.logout": "Log Out", "nav.dashboard": "Dashboard",
      "hero.title": "Run Your Business on Autopilot", "hero.description": "Save 90% on costs and eliminate manual errors.", "hero.cta": "Start Saving Now",
      
      // DASHBOARD MENU
      "dashboard.menu.overview": "Overview", 
      "dashboard.menu.chat": "AI Chat", 
      "dashboard.menu.company": "Company", 
      "dashboard.menu.accounting": "Accounting", 
      "dashboard.menu.communication": "Communication", 
      "dashboard.menu.hr": "Human Resources", 
      "dashboard.menu.marketing": "Marketing", 
      "dashboard.menu.settings": "Settings", 
      "dashboard.menu.logout": "Log Out",
      
      // DASHBOARD CONTENT
      "dashboard.welcome": "Welcome", 
      "dashboard.subtitle": "Your AI assistant is ready to work.", 
      "dashboard.open_chat": "Open AI Chat",
      "dashboard.stats.revenue": "Monthly Revenue", 
      "dashboard.stats.actions": "AI Actions (Today)", 
      "dashboard.stats.invoices": "Pending Invoices",
      "notifications.title": "Notifications", 
      "notifications.empty": "No new notifications.",

      // PROFILE & SETTINGS
      "profile.edit": "Edit Profile", 
      "profile.delete": "Delete Account", 
      "profile.edit_title": "Edit Profile", 
      "profile.success": "Profile updated successfully!",
      "role.owner": "Owner / Admin", 
      "role.employee": "Employee",
      "delete.title": "Danger Zone", 
      "delete.text": "Delete account permanently? Type ELIMINAR:", 
      "delete.confirm_text": "Please type ELIMINAR to confirm.",
      
      // TEAM MANAGEMENT (PATRÃO)
      "settings.company_title": "Company Management",
      "settings.invite_code": "Team Invite Code",
      "settings.invite_text": "Share this code with employees to join.",
      "settings.team_members": "Team Members",
      "settings.no_members": "No employees registered yet.",
      "settings.restricted_title": "Access Restricted",
      "settings.restricted_text": "Only the company owner can manage settings and view the team.",
      
      // TABLES & FORMS
      "table.name": "Name", "table.email": "Email", "table.role": "Role", "table.actions": "Actions",
      "action.edit": "Edit Role", "action.remove": "Remove",
      "team.edit_role": "Edit Role", "team.role_updated": "Role updated successfully!", "team.delete_confirm": "Are you sure you want to remove this employee?", "team.member_removed": "Employee removed.",
      
      // COMMON
      "common.save": "Save", "common.saving": "Saving...", "common.cancel": "Cancel", "common.delete": "Delete",
      "form.email": "Email", "form.fullname": "Full Name", "form.jobtitle": "Job Title", "form.company": "Company", "form.code": "Code"
    }
  },

  // --- PORTUGUÊS (PT) ---
  pt: {
    translation: {
      "nav.login": "Entrar", "nav.signup": "Criar Conta", "nav.home": "Início", "nav.logout": "Sair", "nav.dashboard": "Dashboard",
      "hero.title": "Gere a Tua Empresa em Piloto Automático", "hero.description": "Poupa 90% dos custos e elimina erros manuais.", "hero.cta": "Começar a Poupar",
      
      "dashboard.menu.overview": "Visão Geral", 
      "dashboard.menu.chat": "Chat IA", 
      "dashboard.menu.company": "Empresa", 
      "dashboard.menu.accounting": "Contabilidade", 
      "dashboard.menu.communication": "Comunicação", 
      "dashboard.menu.hr": "Recursos Humanos", 
      "dashboard.menu.marketing": "Marketing", 
      "dashboard.menu.settings": "Definições", 
      "dashboard.menu.logout": "Sair da Conta",
      
      "dashboard.welcome": "Bem-vindo", 
      "dashboard.subtitle": "O teu assistente IA está pronto a trabalhar.", 
      "dashboard.open_chat": "Abrir Chat IA",
      "dashboard.stats.revenue": "Receita Mensal", 
      "dashboard.stats.actions": "Ações da IA (Hoje)", 
      "dashboard.stats.invoices": "Faturas por Enviar",
      "notifications.title": "Notificações", 
      "notifications.empty": "Sem novas notificações.",

      "profile.edit": "Editar Perfil", 
      "profile.delete": "Eliminar Conta", 
      "profile.edit_title": "Editar Perfil", 
      "profile.success": "Perfil atualizado com sucesso!",
      "role.owner": "Patrão / Admin", 
      "role.employee": "Funcionário",
      "delete.title": "Zona de Perigo", 
      "delete.text": "Apagar conta permanentemente? Escreve ELIMINAR:", 
      "delete.confirm_text": "Escreve ELIMINAR para confirmar.",
      
      "settings.company_title": "Gestão da Empresa",
      "settings.invite_code": "Código de Convite da Equipa",
      "settings.invite_text": "Partilha este código com os funcionários para se juntarem.",
      "settings.team_members": "Membros da Equipa",
      "settings.no_members": "Ainda não tens funcionários registados.",
      "settings.restricted_title": "Acesso Restrito",
      "settings.restricted_text": "Apenas o administrador da empresa pode gerir as definições e ver a equipa.",
      
      "table.name": "Nome", "table.email": "Email", "table.role": "Cargo", "table.actions": "Ações",
      "action.edit": "Editar Cargo", "action.remove": "Remover",
      "team.edit_role": "Editar Cargo", "team.role_updated": "Cargo atualizado com sucesso!", "team.delete_confirm": "Tens a certeza que queres remover este funcionário?", "team.member_removed": "Funcionário removido.",
      
      "common.save": "Guardar", "common.saving": "A Guardar...", "common.cancel": "Cancelar", "common.delete": "Apagar",
      "form.email": "Email", "form.fullname": "Nome Completo", "form.jobtitle": "Cargo", "form.company": "Empresa", "form.code": "Código"
    }
  },

  // --- FRANCÊS (FR) ---
  fr: {
    translation: {
      "nav.login": "Connexion", "nav.signup": "S'inscrire", "nav.home": "Accueil", "nav.logout": "Déconnexion", "nav.dashboard": "Tableau de bord",
      "hero.title": "Gérez Votre Entreprise en Pilote Automatique", "hero.description": "Économisez 90% des coûts et éliminez les erreurs manuelles.", "hero.cta": "Commencer",
      
      "dashboard.menu.overview": "Vue d'ensemble", 
      "dashboard.menu.chat": "Chat IA", 
      "dashboard.menu.company": "Entreprise", 
      "dashboard.menu.accounting": "Comptabilité", 
      "dashboard.menu.communication": "Communication", 
      "dashboard.menu.hr": "Ressources Humaines", 
      "dashboard.menu.marketing": "Marketing", 
      "dashboard.menu.settings": "Paramètres", 
      "dashboard.menu.logout": "Déconnexion",
      
      "dashboard.welcome": "Bienvenue", 
      "dashboard.subtitle": "Votre assistant IA est prêt à travailler.", 
      "dashboard.open_chat": "Ouvrir Chat IA",
      "dashboard.stats.revenue": "Revenu Mensuel", 
      "dashboard.stats.actions": "Actions IA (Aujourd'hui)", 
      "dashboard.stats.invoices": "Factures en Attente",
      "notifications.title": "Notifications", 
      "notifications.empty": "Aucune nouvelle notification.",

      "profile.edit": "Modifier Profil", 
      "profile.delete": "Supprimer Compte", 
      "profile.edit_title": "Modifier Profil", 
      "profile.success": "Profil mis à jour avec succès !",
      "role.owner": "Patron / Admin", 
      "role.employee": "Employé",
      "delete.title": "Zone de Danger", 
      "delete.text": "Supprimer le compte définitivement ? Tapez ELIMINAR :", 
      "delete.confirm_text": "Veuillez taper ELIMINAR pour confirmer.",
      
      "settings.company_title": "Gestion de l'Entreprise",
      "settings.invite_code": "Code d'Invitation d'Équipe",
      "settings.invite_text": "Partagez ce code avec les employés pour rejoindre.",
      "settings.team_members": "Membres de l'Équipe",
      "settings.no_members": "Aucun employé enregistré pour le moment.",
      "settings.restricted_title": "Accès Restreint",
      "settings.restricted_text": "Seul l'administrateur de l'entreprise peut gérer les paramètres et voir l'équipe.",
      
      "table.name": "Nom", "table.email": "Email", "table.role": "Poste", "table.actions": "Actions",
      "action.edit": "Modifier Poste", "action.remove": "Retirer",
      "team.edit_role": "Modifier le Poste", "team.role_updated": "Poste mis à jour avec succès !", "team.delete_confirm": "Êtes-vous sûr de vouloir retirer cet employé ?", "team.member_removed": "Employé retiré.",
      
      "common.save": "Enregistrer", "common.saving": "Enregistrement...", "common.cancel": "Annuler", "common.delete": "Supprimer",
      "form.email": "Email", "form.fullname": "Nom Complet", "form.jobtitle": "Poste", "form.company": "Entreprise", "form.code": "Code"
    }
  },

  // --- ESPANHOL (ES) ---
  es: {
    translation: {
      "nav.login": "Acceso", "nav.signup": "Registro", "nav.home": "Inicio", "nav.logout": "Cerrar sesión", "nav.dashboard": "Panel",
      "hero.title": "Gestiona Tu Empresa en Piloto Automático", "hero.description": "Ahorra 90% en costos y elimina errores manuales.", "hero.cta": "Empezar",
      
      "dashboard.menu.overview": "Visión General", 
      "dashboard.menu.chat": "Chat IA", 
      "dashboard.menu.company": "Empresa", 
      "dashboard.menu.accounting": "Contabilidad", 
      "dashboard.menu.communication": "Comunicación", 
      "dashboard.menu.hr": "Recursos Humanos", 
      "dashboard.menu.marketing": "Marketing", 
      "dashboard.menu.settings": "Configuración", 
      "dashboard.menu.logout": "Cerrar Sesión",
      
      "dashboard.welcome": "Bienvenido", 
      "dashboard.subtitle": "Tu asistente de IA está listo para trabajar.", 
      "dashboard.open_chat": "Abrir Chat IA",
      "dashboard.stats.revenue": "Ingresos Mensuales", 
      "dashboard.stats.actions": "Acciones IA (Hoy)", 
      "dashboard.stats.invoices": "Facturas Pendientes",
      "notifications.title": "Notificaciones", 
      "notifications.empty": "Sin notificaciones nuevas.",

      "profile.edit": "Editar Perfil", 
      "profile.delete": "Eliminar Cuenta", 
      "profile.edit_title": "Editar Perfil", 
      "profile.success": "¡Perfil actualizado con éxito!",
      "role.owner": "Dueño / Admin", 
      "role.employee": "Empleado",
      "delete.title": "Zona de Peligro", 
      "delete.text": "¿Eliminar cuenta permanentemente? Escribe ELIMINAR:", 
      "delete.confirm_text": "Por favor escribe ELIMINAR para confirmar.",
      
      "settings.company_title": "Gestión de la Empresa",
      "settings.invite_code": "Código de Invitación del Equipo",
      "settings.invite_text": "Comparte este código con los empleados para unirse.",
      "settings.team_members": "Miembros del Equipo",
      "settings.no_members": "Aún no hay empleados registrados.",
      "settings.restricted_title": "Acceso Restringido",
      "settings.restricted_text": "Solo el administrador de la empresa puede gestionar la configuración y ver el equipo.",
      
      "table.name": "Nombre", "table.email": "Email", "table.role": "Cargo", "table.actions": "Acciones",
      "action.edit": "Editar Cargo", "action.remove": "Eliminar",
      "team.edit_role": "Editar Cargo", "team.role_updated": "¡Cargo actualizado con éxito!", "team.delete_confirm": "¿Estás seguro de que quieres eliminar a este empleado?", "team.member_removed": "Empleado eliminado.",
      
      "common.save": "Guardar", "common.saving": "Guardando...", "common.cancel": "Cancelar", "common.delete": "Eliminar",
      "form.email": "Email", "form.fullname": "Nombre Completo", "form.jobtitle": "Cargo", "form.company": "Empresa", "form.code": "Código"
    }
  },

  // --- ALEMÃO (DE) ---
  de: {
    translation: {
      "nav.login": "Anmelden", "nav.signup": "Registrieren", "nav.home": "Startseite", "nav.logout": "Abmelden", "nav.dashboard": "Dashboard",
      "hero.title": "Führen Sie Ihr Unternehmen auf Autopilot", "hero.description": "Sparen Sie 90% der Kosten und eliminieren Sie manuelle Fehler.", "hero.cta": "Starten",
      
      "dashboard.menu.overview": "Überblick", 
      "dashboard.menu.chat": "KI-Chat", 
      "dashboard.menu.company": "Firma", 
      "dashboard.menu.accounting": "Buchhaltung", 
      "dashboard.menu.communication": "Kommunikation", 
      "dashboard.menu.hr": "Personalwesen", 
      "dashboard.menu.marketing": "Marketing", 
      "dashboard.menu.settings": "Einstellungen", 
      "dashboard.menu.logout": "Abmelden",
      
      "dashboard.welcome": "Willkommen", 
      "dashboard.subtitle": "Ihr KI-Assistent ist bereit zu arbeiten.", 
      "dashboard.open_chat": "KI-Chat Öffnen",
      "dashboard.stats.revenue": "Monatlicher Umsatz", 
      "dashboard.stats.actions": "KI-Aktionen (Heute)", 
      "dashboard.stats.invoices": "Ausstehende Rechnungen",
      "notifications.title": "Benachrichtigungen", 
      "notifications.empty": "Keine neuen Benachrichtigungen.",

      "profile.edit": "Profil Bearbeiten", 
      "profile.delete": "Konto Löschen", 
      "profile.edit_title": "Profil Bearbeiten", 
      "profile.success": "Profil erfolgreich aktualisiert!",
      "role.owner": "Inhaber / Admin", 
      "role.employee": "Mitarbeiter",
      "delete.title": "Gefahrenzone", 
      "delete.text": "Konto dauerhaft löschen? Geben Sie ELIMINAR ein:", 
      "delete.confirm_text": "Bitte geben Sie ELIMINAR ein, um zu bestätigen.",
      
      "settings.company_title": "Unternehmensverwaltung",
      "settings.invite_code": "Team-Einladungscode",
      "settings.invite_text": "Teilen Sie diesen Code mit Mitarbeitern, um beizutreten.",
      "settings.team_members": "Teammitglieder",
      "settings.no_members": "Noch keine Mitarbeiter registriert.",
      "settings.restricted_title": "Zugriff Verweigert",
      "settings.restricted_text": "Nur der Unternehmensadministrator kann Einstellungen verwalten und das Team sehen.",
      
      "table.name": "Name", "table.email": "E-Mail", "table.role": "Position", "table.actions": "Aktionen",
      "action.edit": "Position Bearbeiten", "action.remove": "Entfernen",
      "team.edit_role": "Position Bearbeiten", "team.role_updated": "Position erfolgreich aktualisiert!", "team.delete_confirm": "Sind Sie sicher, dass Sie diesen Mitarbeiter entfernen möchten?", "team.member_removed": "Mitarbeiter entfernt.",
      
      "common.save": "Speichern", "common.saving": "Speichern...", "common.cancel": "Abbrechen", "common.delete": "Löschen",
      "form.email": "E-Mail", "form.fullname": "Vollständiger Name", "form.jobtitle": "Position", "form.company": "Firma", "form.code": "Code"
    }
  },

  // --- ITALIANO (IT) ---
  it: {
    translation: {
      "nav.login": "Accedi", "nav.signup": "Registrati", "nav.home": "Home", "nav.logout": "Esci", "nav.dashboard": "Dashboard",
      "hero.title": "Gestisci la Tua Azienda col Pilota Automatico", "hero.description": "Risparmia il 90% dei costi ed elimina gli errori manuali.", "hero.cta": "Inizia",
      
      "dashboard.menu.overview": "Panoramica", 
      "dashboard.menu.chat": "Chat IA", 
      "dashboard.menu.company": "Azienda", 
      "dashboard.menu.accounting": "Contabilità", 
      "dashboard.menu.communication": "Comunicazione", 
      "dashboard.menu.hr": "Risorse Umane", 
      "dashboard.menu.marketing": "Marketing", 
      "dashboard.menu.settings": "Impostazioni", 
      "dashboard.menu.logout": "Esci",
      
      "dashboard.welcome": "Benvenuto", 
      "dashboard.subtitle": "Il tuo assistente IA è pronto a lavorare.", 
      "dashboard.open_chat": "Apri Chat IA",
      "dashboard.stats.revenue": "Entrate Mensili", 
      "dashboard.stats.actions": "Azioni IA (Oggi)", 
      "dashboard.stats.invoices": "Fatture in Sospeso",
      "notifications.title": "Notifiche", 
      "notifications.empty": "Nessuna nuova notifica.",

      "profile.edit": "Modifica Profilo", 
      "profile.delete": "Elimina Account", 
      "profile.edit_title": "Modifica Profilo", 
      "profile.success": "Profilo aggiornato con successo!",
      "role.owner": "Proprietario / Admin", 
      "role.employee": "Dipendente",
      "delete.title": "Zona Pericolosa", 
      "delete.text": "Eliminare l'account in modo permanente? Scrivi ELIMINAR:", 
      "delete.confirm_text": "Per favore scrivi ELIMINAR per confermare.",
      
      "settings.company_title": "Gestione Aziendale",
      "settings.invite_code": "Codice Invito Team",
      "settings.invite_text": "Condividi questo codice con i dipendenti per unirsi.",
      "settings.team_members": "Membri del Team",
      "settings.no_members": "Nessun dipendente ancora registrato.",
      "settings.restricted_title": "Accesso Limitato",
      "settings.restricted_text": "Solo l'amministratore dell'azienda può gestire le impostazioni e vedere il team.",
      
      "table.name": "Nome", "table.email": "Email", "table.role": "Ruolo", "table.actions": "Azioni",
      "action.edit": "Modifica Ruolo", "action.remove": "Rimuovi",
      "team.edit_role": "Modifica Ruolo", "team.role_updated": "Ruolo aggiornato con successo!", "team.delete_confirm": "Sei sicuro di voler rimuovere questo dipendente?", "team.member_removed": "Dipendente rimosso.",
      
      "common.save": "Salva", "common.saving": "Salvataggio...", "common.cancel": "Annulla", "common.delete": "Elimina",
      "form.email": "Email", "form.fullname": "Nome Completo", "form.jobtitle": "Ruolo", "form.company": "Azienda", "form.code": "Codice"
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