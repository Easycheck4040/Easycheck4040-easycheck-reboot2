import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  // --- INGLÊS ---
  en: {
    translation: {
      "nav.login": "Login", "nav.signup": "Sign Up", "nav.pricing": "Pricing",
      "hero.savings": "Faster, Cheaper, Smarter",
      "hero.title": "Run Your Entire Business on Autopilot with AI",
      "hero.description": "Why hire 5 employees when one AI can do it all? Save 90% on costs, eliminate manual errors, and get tasks done in seconds, not days.",
      "hero.cta": "Start Saving Now",
      "comparison.title": "Traditional Costs vs EasyCheck",
      "comparison.traditional": "The Expensive Way",
      "comparison.recommended": "The Smart Way",
      "comparison.total": "Total Monthly Cost:",
      "comparison.replace_text": "Replaces 5 Full-time Roles",
      "comparison.savings": "You save €13,601 per month!",
      "roles.accountant": "Accountant", "roles.admin": "Admin Assistant", "roles.hr": "HR Manager", "roles.marketing": "Marketing Specialist", "roles.support": "Customer Support",
      "services.title": "Your AI Workforce",
      "categories.accounting.title": "AI Accounting",
      "categories.accounting.description": "Forget spreadsheets. Our AI automatically generates invoices, tracks every expense, calculates your taxes in real-time.",
      "categories.communication.title": "Smart Communication",
      "categories.communication.description": "Never miss a client email again. The AI reads, categorizes, and drafts professional responses instantly.",
      "categories.administrative.title": "Admin Automation",
      "categories.administrative.description": "Your digital filing cabinet. Upload any contract or receipt, and the AI organizes, reads, and extracts the key data.",
      "categories.hr.title": "HR Management",
      "categories.hr.description": "Manage your team effortlessly. From processing payroll and tracking vacation days to onboarding new employees.",
      "categories.marketing.title": "Growth Marketing",
      "categories.marketing.description": "Scale your business faster. Create ad campaigns, schedule social media posts, and analyze market trends automatically.",
      "categories.chat.title": "EasyCheck AI Chat",
      "categories.chat.description": "Your personal 24/7 business advisor. Ask anything like 'Create an invoice for John' and get instant actions.",
      "login.title": "Welcome Back", "login.email": "Email", "login.password": "Password", "login.button": "Sign In", "login.forgot": "Forgot password?", "login.noAccount": "No account?", "auth.createTitle": "Create Account", "auth.haveAccount": "Have account?", "auth.createSubtitle": "Start your free trial", "auth.loginSubtitle": "Access your dashboard"
    }
  },

  // --- PORTUGUÊS ---
  pt: {
    translation: {
      "nav.login": "Entrar", "nav.signup": "Criar Conta", "nav.pricing": "Preços",
      "hero.savings": "Mais Rápido, Mais Fácil, Mais Barato",
      "hero.title": "Gere a Tua Empresa em Piloto Automático com IA",
      "hero.description": "Porquê contratar 5 funcionários quando uma IA faz tudo? Poupa 90% dos custos, elimina erros manuais e completa tarefas em segundos.",
      "hero.cta": "Começar a Poupar",
      "comparison.title": "Custo Tradicional vs EasyCheck",
      "comparison.traditional": "O Caminho Caro",
      "comparison.recommended": "O Caminho Inteligente",
      "comparison.total": "Custo Mensal Total:",
      "comparison.replace_text": "Substitui 5 Cargos a Tempo Inteiro",
      "comparison.savings": "Poupas €13,601 por mês!",
      "roles.accountant": "Contabilista", "roles.admin": "Assistente Admin", "roles.hr": "Gestor RH", "roles.marketing": "Especialista Marketing", "roles.support": "Suporte Cliente",
      "services.title": "A Tua Equipa de IA",
      "categories.accounting.title": "Contabilidade IA",
      "categories.accounting.description": "Esquece o Excel. A nossa IA gera faturas automaticamente, rastreia todas as despesas e calcula impostos em tempo real.",
      "categories.communication.title": "Comunicação Inteligente",
      "categories.communication.description": "Nunca percas um email. A IA lê, categoriza e rascunha respostas profissionais instantaneamente.",
      "categories.administrative.title": "Automação Admin",
      "categories.administrative.description": "O teu arquivo digital. Carrega qualquer contrato ou recibo e a IA organiza, lê e extrai os dados.",
      "categories.hr.title": "Gestão de RH",
      "categories.hr.description": "Gere a equipa sem esforço. Desde processar salários e controlar férias até contratar novos funcionários.",
      "categories.marketing.title": "Marketing de Crescimento",
      "categories.marketing.description": "Escala o negócio mais rápido. Cria campanhas de anúncios e agenda posts nas redes sociais automaticamente.",
      "categories.chat.title": "Chat EasyCheck IA",
      "categories.chat.description": "O teu consultor pessoal 24/7. Pede qualquer coisa como 'Cria uma fatura para o João' e obtém ações imediatas.",
      "login.title": "Bem-vindo", "login.email": "Email", "login.password": "Palavra-passe", "login.button": "Entrar", "login.forgot": "Esqueceste a palavra-passe?", "login.noAccount": "Não tens conta?", "auth.createTitle": "Criar Conta", "auth.haveAccount": "Já tens conta?", "auth.createSubtitle": "Começa o teu teste grátis", "auth.loginSubtitle": "Acede ao teu painel"
    }
  },

  // --- FRANCÊS ---
  fr: {
    translation: {
      "nav.login": "Connexion", "nav.signup": "S'inscrire", "nav.pricing": "Tarifs",
      "hero.savings": "Plus Rapide, Plus Simple, Moins Cher",
      "hero.title": "Gérez Votre Entreprise en Pilote Automatique avec l'IA",
      "hero.description": "Pourquoi embaucher 5 employés quand une IA peut tout faire ? Économisez 90% des coûts et éliminez les erreurs.",
      "hero.cta": "Commencer à Économiser",
      "comparison.title": "Coût Traditionnel vs EasyCheck",
      "comparison.traditional": "La Méthode Coûteuse",
      "comparison.recommended": "La Méthode Intelligente",
      "comparison.total": "Coût Mensuel Total :",
      "comparison.replace_text": "Remplace 5 Postes à Temps Plein",
      "comparison.savings": "Vous économisez €13,601 par mois !",
      "roles.accountant": "Comptable", "roles.admin": "Assistant Admin", "roles.hr": "Responsable RH", "roles.marketing": "Spécialiste Marketing", "roles.support": "Service Client",
      "services.title": "Votre Équipe IA",
      "categories.accounting.title": "Comptabilité IA",
      "categories.accounting.description": "Oubliez les tableurs. Notre IA génère automatiquement les factures et calcule vos impôts en temps réel.",
      "categories.communication.title": "Communication Intelligente",
      "categories.communication.description": "Ne manquez jamais un email. L'IA rédige des réponses professionnelles instantanément.",
      "categories.administrative.title": "Automatisation Admin",
      "categories.administrative.description": "Votre classeur numérique. Téléchargez n'importe quel contrat et l'IA extrait les données.",
      "categories.hr.title": "Gestion RH",
      "categories.hr.description": "Gérez votre équipe sans effort. Du traitement de la paie à l'intégration des nouveaux employés.",
      "categories.marketing.title": "Marketing de Croissance",
      "categories.marketing.description": "Développez votre entreprise. Créez des campagnes et planifiez des posts automatiquement.",
      "categories.chat.title": "Chat EasyCheck IA",
      "categories.chat.description": "Votre conseiller personnel 24/7. Demandez n'importe quoi et obtenez des actions immédiates.",
      "login.title": "Bienvenue", "login.email": "Email", "login.password": "Mot de passe", "login.button": "Se connecter", "login.forgot": "Mot de passe oublié ?", "login.noAccount": "Pas de compte ?", "auth.createTitle": "Créer un Compte", "auth.haveAccount": "Déjà un compte ?", "auth.createSubtitle": "Commencez votre essai gratuit", "auth.loginSubtitle": "Accédez à votre tableau de bord"
    }
  },

  // --- ESPANHOL ---
  es: {
    translation: {
      "nav.login": "Acceso", "nav.signup": "Registro", "nav.pricing": "Precios",
      "hero.savings": "Más Rápido, Más Barato, Más Inteligente",
      "hero.title": "Dirige Tu Empresa en Piloto Automático con IA",
      "hero.description": "¿Por qué contratar 5 empleados cuando una IA puede hacerlo todo? Ahorra el 90% de los costes y elimina errores manuales.",
      "hero.cta": "Empezar a Ahorrar",
      "comparison.title": "Coste Tradicional vs EasyCheck",
      "comparison.traditional": "El Camino Caro",
      "comparison.recommended": "El Camino Inteligente",
      "comparison.total": "Coste Mensual Total:",
      "comparison.replace_text": "Reemplaza 5 Puestos a Tiempo Completo",
      "comparison.savings": "¡Ahorras €13,601 al mes!",
      "roles.accountant": "Contable", "roles.admin": "Asistente Admin", "roles.hr": "Gerente RRHH", "roles.marketing": "Especialista Marketing", "roles.support": "Atención al Cliente",
      "services.title": "Tu Equipo de IA",
      "categories.accounting.title": "Contabilidad IA",
      "categories.accounting.description": "Olvida Excel. Nuestra IA genera facturas automáticamente y calcula impuestos en tiempo real.",
      "categories.communication.title": "Comunicación Inteligente",
      "categories.communication.description": "Nunca pierdas un email. La IA redacta respuestas profesionales al instante.",
      "categories.administrative.title": "Automatización Admin",
      "categories.administrative.description": "Tu archivo digital. Sube cualquier contrato y la IA extrae los datos clave.",
      "categories.hr.title": "Gestión de RRHH",
      "categories.hr.description": "Gestiona tu equipo sin esfuerzo. Desde nóminas hasta la contratación de nuevos empleados.",
      "categories.marketing.title": "Marketing de Crecimiento",
      "categories.marketing.description": "Escala tu negocio. Crea campañas y programa publicaciones automáticamente.",
      "categories.chat.title": "Chat EasyCheck IA",
      "categories.chat.description": "Tu asesor personal 24/7. Pide lo que sea y obtén acciones inmediatas.",
      "login.title": "Bienvenido", "login.email": "Email", "login.password": "Contraseña", "login.button": "Entrar", "login.forgot": "¿Olvidaste la contraseña?", "login.noAccount": "¿No tienes cuenta?", "auth.createTitle": "Crear Cuenta", "auth.haveAccount": "¿Ya tienes cuenta?", "auth.createSubtitle": "Empieza tu prueba gratuita", "auth.loginSubtitle": "Accede a tu panel"
    }
  },

  // --- ALEMÃO ---
  de: {
    translation: {
      "nav.login": "Anmelden", "nav.signup": "Registrieren", "nav.pricing": "Preise",
      "hero.savings": "Schneller, Billiger, Intelligenter",
      "hero.title": "Führen Sie Ihr Unternehmen auf Autopilot mit KI",
      "hero.description": "Warum 5 Mitarbeiter einstellen, wenn eine KI alles kann? Sparen Sie 90% der Kosten und eliminieren Sie Fehler.",
      "hero.cta": "Jetzt Sparen",
      "comparison.title": "Traditionelle Kosten vs EasyCheck",
      "comparison.traditional": "Der Teure Weg",
      "comparison.recommended": "Der Kluge Weg",
      "comparison.total": "Monatliche Gesamtkosten:",
      "comparison.replace_text": "Ersetzt 5 Vollzeitstellen",
      "comparison.savings": "Sie sparen €13,601 pro Monat!",
      "roles.accountant": "Buchhalter", "roles.admin": "Admin-Assistent", "roles.hr": "Personalmanager", "roles.marketing": "Marketing-Spezialist", "roles.support": "Kundensupport",
      "services.title": "Ihre KI-Belegschaft",
      "categories.accounting.title": "KI-Buchhaltung",
      "categories.accounting.description": "Vergessen Sie Tabellen. Unsere KI erstellt Rechnungen automatisch und berechnet Steuern in Echtzeit.",
      "categories.communication.title": "Smarte Kommunikation",
      "categories.communication.description": "Verpassen Sie nie wieder eine E-Mail. Die KI entwirft sofort professionelle Antworten.",
      "categories.administrative.title": "Admin-Automatisierung",
      "categories.administrative.description": "Ihr digitaler Aktenschrank. Laden Sie Verträge hoch und die KI extrahiert die Daten.",
      "categories.hr.title": "Personalmanagement",
      "categories.hr.description": "Verwalten Sie Ihr Team mühelos. Von der Gehaltsabrechnung bis zum Onboarding.",
      "categories.marketing.title": "Wachstumsmarketing",
      "categories.marketing.description": "Skalieren Sie Ihr Geschäft. Erstellen Sie Kampagnen und planen Sie Posts automatisch.",
      "categories.chat.title": "EasyCheck KI-Chat",
      "categories.chat.description": "Ihr persönlicher 24/7-Berater. Fragen Sie alles und erhalten Sie sofortige Aktionen.",
      "login.title": "Willkommen", "login.email": "E-Mail", "login.password": "Passwort", "login.button": "Anmelden", "login.forgot": "Passwort vergessen?", "login.noAccount": "Kein Konto?", "auth.createTitle": "Konto Erstellen", "auth.haveAccount": "Haben Sie ein Konto?", "auth.createSubtitle": "Starten Sie Ihre kostenlose Testversion", "auth.loginSubtitle": "Zugriff auf Ihr Dashboard"
    }
  },

  // --- ITALIANO ---
  it: {
    translation: {
      "nav.login": "Accedi", "nav.signup": "Registrati", "nav.pricing": "Prezzi",
      "hero.savings": "Più Veloce, Più Economico, Più Intelligente",
      "hero.title": "Gestisci la Tua Azienda col Pilota Automatico IA",
      "hero.description": "Perché assumere 5 dipendenti quando un'IA può fare tutto? Risparmia il 90% dei costi ed elimina gli errori.",
      "hero.cta": "Inizia a Risparmiare",
      "comparison.title": "Costi Tradizionali vs EasyCheck",
      "comparison.traditional": "Il Modo Costoso",
      "comparison.recommended": "Il Modo Intelligente",
      "comparison.total": "Costo Mensile Totale:",
      "comparison.replace_text": "Sostituisce 5 Ruoli a Tempo Pieno",
      "comparison.savings": "Risparmi €13,601 al mese!",
      "roles.accountant": "Commercialista", "roles.admin": "Assistente Ammin.", "roles.hr": "Responsabile HR", "roles.marketing": "Specialista Marketing", "roles.support": "Supporto Clienti",
      "services.title": "La Tua Forza Lavoro IA",
      "categories.accounting.title": "Contabilità IA",
      "categories.accounting.description": "Dimentica Excel. La nostra IA genera fatture automaticamente e calcola le tasse in tempo reale.",
      "categories.communication.title": "Comunicazione Smart",
      "categories.communication.description": "Non perdere mai un'email. L'IA redige risposte professionali istantaneamente.",
      "categories.administrative.title": "Automazione Ammin.",
      "categories.administrative.description": "Il tuo archivio digitale. Carica qualsiasi contratto e l'IA estrae i dati chiave.",
      "categories.hr.title": "Gestione HR",
      "categories.hr.description": "Gestisci il team senza sforzo. Dalle buste paga all'assunzione di nuovi dipendenti.",
      "categories.marketing.title": "Marketing di Crescita",
      "categories.marketing.description": "Scala il tuo business. Crea campagne e pianifica post automaticamente.",
      "categories.chat.title": "Chat EasyCheck IA",
      "categories.chat.description": "Il tuo consulente personale 24/7. Chiedi qualsiasi cosa e ottieni azioni immediate.",
      "login.title": "Benvenuto", "login.email": "Email", "login.password": "Password", "login.button": "Accedi", "login.forgot": "Password dimenticata?", "login.noAccount": "Non hai un account?", "auth.createTitle": "Crea Account", "auth.haveAccount": "Hai già un account?", "auth.createSubtitle": "Inizia la tua prova gratuita", "auth.loginSubtitle": "Accedi alla tua dashboard"
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