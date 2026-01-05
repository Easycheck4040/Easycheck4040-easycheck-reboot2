import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  // --- INGLÊS (EN) ---
  en: {
    translation: {
      "nav.login": "Login", "nav.signup": "Sign Up", "nav.pricing": "Pricing", "nav.home": "Home", "nav.contact": "Contact", "nav.dashboard": "Dashboard", "nav.logout": "Log Out",
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
      
      "login.title": "Welcome Back", "login.email": "Email", "login.password": "Password", "login.button": "Sign In", "login.forgot": "Forgot password?", "login.noAccount": "No account?", 
      "auth.createTitle": "Create Business Account", "auth.haveAccount": "Have account?", "auth.createSubtitle": "Start your free trial", "auth.loginSubtitle": "Access your dashboard",
      "auth.fullName": "Full Name", "auth.jobTitle": "Job Title (e.g. Director)", "auth.companyName": "Company Name", "auth.companyCode": "Company Code", "auth.iHaveCode": "I have a company code (Employee)", "auth.iWantCreate": "Register new company", "auth.generateCode": "Company Code will be generated automatically.",

      "pricing.title": "Simple, Transparent Pricing", "pricing.subtitle": "Choose the plan that fits your business size.", "pricing.most_popular": "Most Popular", "pricing.choose_plan": "Choose Plan", "pricing.starter_desc": "Perfect for freelancers.", "pricing.pro_desc": "For growing businesses.", "pricing.enterprise_desc": "For large organizations.", "pricing.feat_invoices": "Unlimited Invoices", "pricing.feat_clients": "Up to 50 Clients", "pricing.feat_basic_support": "Basic Support", "pricing.feat_no_ai": "Basic AI Features", "pricing.feat_chat": "AI Chat Assistant", "pricing.feat_automation": "Full Automation", "pricing.feat_everything_starter": "Everything in Starter", "pricing.feat_unlimited_ai": "Unlimited AI Actions", "pricing.feat_chat_247": "24/7 AI Chat Advisor", "pricing.feat_auto_email": "Automated Email Responses", "pricing.feat_priority": "Priority Support", "pricing.feat_everything_pro": "Everything in Pro", "pricing.feat_custom_api": "Custom API Access", "pricing.feat_dedicated": "Dedicated Account Manager", "pricing.feat_training": "Team Training", "pricing.enterprise_contact": "Need a custom plan?",

      // --- NEW SECTIONS (Footer, Contact, Dashboard) ---
      "footer.slogan": "Helping companies grow on autopilot. Automate accounting, HR, and marketing with our Artificial Intelligence.",
      "footer.company": "Company", "footer.legal": "Legal", "footer.privacy": "Privacy Policy", "footer.terms": "Terms of Use", "footer.complaints": "Complaints Book", "footer.rights": "All rights reserved.",

      "contact.title": "How can we help? 👋",
      "contact.subtitle": "Our team (and our AI) are ready to answer.",
      "contact.greeting.morning": "Good morning", "contact.greeting.afternoon": "Good afternoon", "contact.greeting.night": "Good evening",
      "contact.status.title": "Operational Status", "contact.status.servers": "AI Servers", "contact.status.response": "Response Time", "contact.status.caffeine": "Caffeine Level", "contact.status.online": "ONLINE",
      "contact.direct_email.title": "Direct Email", "contact.direct_email.subtitle": "Prefer using your email client?",
      "contact.form.name": "Name", "contact.form.name_placeholder": "Your name", "contact.form.email": "Email", "contact.form.email_placeholder": "email@company.com", "contact.form.subject": "Subject", "contact.form.message": "Message", "contact.form.message_placeholder": "Tell us everything...", "contact.form.send": "Send Message", "contact.form.sending": "Sending...", "contact.form.success": "Sent Successfully!", "contact.form.error": "Oops! Something went wrong.",
      "contact.subjects.general": "General Inquiry", "contact.subjects.tech": "Technical Support", "contact.subjects.sales": "Sales / Commercial", "contact.subjects.partners": "Partnerships", "contact.subjects.other": "Other",

      "dashboard.welcome": "Welcome back", "dashboard.active_plan": "Active Plan", "dashboard.next_billing": "Next Billing", "dashboard.usage": "AI Usage", "dashboard.recent_activity": "Recent Activity", "dashboard.no_activity": "No recent activity."
    }
  },

  // --- PORTUGUÊS (PT) ---
  pt: {
    translation: {
      "nav.login": "Entrar", "nav.signup": "Criar Conta", "nav.pricing": "Preços", "nav.home": "Início", "nav.contact": "Contactos", "nav.dashboard": "Dashboard", "nav.logout": "Sair",
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
      
      "login.title": "Bem-vindo", "login.email": "Email", "login.password": "Palavra-passe", "login.button": "Entrar", "login.forgot": "Esqueceste a palavra-passe?", "login.noAccount": "Não tens conta?", 
      "auth.createTitle": "Criar Conta Empresarial", "auth.haveAccount": "Já tens conta?", "auth.createSubtitle": "Começa o teu teste grátis", "auth.loginSubtitle": "Acede ao teu painel",
      "auth.fullName": "Nome Completo", "auth.jobTitle": "Cargo (ex: Diretor)", "auth.companyName": "Nome da Empresa", "auth.companyCode": "Código da Empresa", "auth.iHaveCode": "Tenho um código de empresa (Funcionário)", "auth.iWantCreate": "Quero registar uma nova empresa", "auth.generateCode": "O Código da Empresa será gerado automaticamente.",

      "pricing.title": "Preços Simples e Transparentes", "pricing.subtitle": "Escolhe o plano que melhor se adapta ao teu negócio.", "pricing.most_popular": "Mais Popular", "pricing.choose_plan": "Escolher Plano", "pricing.starter_desc": "Perfeito para freelancers e pequenos negócios.", "pricing.pro_desc": "Para empresas em crescimento que precisam de automação total.", "pricing.enterprise_desc": "Para grandes organizações com necessidades personalizadas.", "pricing.feat_invoices": "Faturas Ilimitadas", "pricing.feat_clients": "Até 50 Clientes", "pricing.feat_basic_support": "Suporte Básico", "pricing.feat_no_ai": "Funcionalidades IA Básicas", "pricing.feat_chat": "Chat Assistente IA", "pricing.feat_automation": "Automação Completa", "pricing.feat_everything_starter": "Tudo do Starter", "pricing.feat_unlimited_ai": "Ações IA Ilimitadas", "pricing.feat_chat_247": "Consultor IA 24/7", "pricing.feat_auto_email": "Respostas de Email Auto", "pricing.feat_priority": "Suporte Prioritário", "pricing.feat_everything_pro": "Tudo do Pro", "pricing.feat_custom_api": "Acesso API Personalizado", "pricing.feat_dedicated": "Gestor de Conta Dedicado", "pricing.feat_training": "Formação de Equipa", "pricing.enterprise_contact": "Precisas de um plano à medida?",

      // --- NEW SECTIONS (Footer, Contact, Dashboard) ---
      "footer.slogan": "Ajudamos empresas a crescer em piloto automático. Automatiza a contabilidade, recursos humanos e marketing com a nossa Inteligência Artificial.",
      "footer.company": "Empresa", "footer.legal": "Legal", "footer.privacy": "Política de Privacidade", "footer.terms": "Termos de Uso", "footer.complaints": "Livro de Reclamações", "footer.rights": "Todos os direitos reservados.",

      "contact.title": "Como podemos ajudar? 👋",
      "contact.subtitle": "A nossa equipa (e a nossa IA) estão prontas para responder.",
      "contact.greeting.morning": "Bom dia", "contact.greeting.afternoon": "Boa tarde", "contact.greeting.night": "Boa noite",
      "contact.status.title": "Status Operacional", "contact.status.servers": "Servidores IA", "contact.status.response": "Tempo de Resposta", "contact.status.caffeine": "Nível de Cafeína", "contact.status.online": "ONLINE",
      "contact.direct_email.title": "Email Direto", "contact.direct_email.subtitle": "Preferes usar o teu cliente de email?",
      "contact.form.name": "Nome", "contact.form.name_placeholder": "O teu nome", "contact.form.email": "Email", "contact.form.email_placeholder": "email@empresa.com", "contact.form.subject": "Assunto", "contact.form.message": "Mensagem", "contact.form.message_placeholder": "Conta-nos tudo...", "contact.form.send": "Enviar Mensagem", "contact.form.sending": "A Enviar...", "contact.form.success": "Enviado com Sucesso!", "contact.form.error": "Ups! Algo correu mal.",
      "contact.subjects.general": "Dúvida Geral", "contact.subjects.tech": "Suporte Técnico", "contact.subjects.sales": "Comercial / Vendas", "contact.subjects.partners": "Parcerias", "contact.subjects.other": "Outro",

      "dashboard.welcome": "Bem-vindo de volta", "dashboard.active_plan": "Plano Ativo", "dashboard.next_billing": "Próxima Fatura", "dashboard.usage": "Uso da IA", "dashboard.recent_activity": "Atividade Recente", "dashboard.no_activity": "Sem atividade recente."
    }
  },

  // --- FRANCÊS (FR) ---
  fr: {
    translation: {
      "nav.login": "Connexion", "nav.signup": "S'inscrire", "nav.pricing": "Tarifs", "nav.home": "Accueil", "nav.contact": "Contact", "nav.dashboard": "Tableau de bord", "nav.logout": "Déconnexion",
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
      
      "login.title": "Bienvenue", "login.email": "Email", "login.password": "Mot de passe", "login.button": "Se connecter", "login.forgot": "Mot de passe oublié ?", "login.noAccount": "Pas de compte ?", 
      "auth.createTitle": "Créer un Compte Pro", "auth.haveAccount": "Déjà un compte ?", "auth.createSubtitle": "Commencez votre essai gratuit", "auth.loginSubtitle": "Accédez à votre tableau de bord",
      "auth.fullName": "Nom Complet", "auth.jobTitle": "Poste (ex: Directeur)", "auth.companyName": "Nom de l'entreprise", "auth.companyCode": "Code de l'entreprise", "auth.iHaveCode": "J'ai un code d'entreprise (Employé)", "auth.iWantCreate": "Enregistrer une nouvelle entreprise", "auth.generateCode": "Le code de l'entreprise sera généré automatiquement.",

      "pricing.title": "Tarification Simple", "pricing.subtitle": "Choisissez le plan adapté à votre entreprise.", "pricing.most_popular": "Le Plus Populaire", "pricing.choose_plan": "Choisir ce Plan", "pricing.starter_desc": "Parfait pour les freelances.", "pricing.pro_desc": "Pour les entreprises en croissance.", "pricing.enterprise_desc": "Pour les grandes organisations.", "pricing.feat_invoices": "Factures Illimitées", "pricing.feat_clients": "Jusqu'à 50 Clients", "pricing.feat_basic_support": "Support De Base", "pricing.feat_no_ai": "Fonctions IA de Base", "pricing.feat_chat": "Chat Assistant IA", "pricing.feat_automation": "Automatisation Complète", "pricing.feat_everything_starter": "Tout dans Starter", "pricing.feat_unlimited_ai": "Actions IA Illimitées", "pricing.feat_chat_247": "Conseiller IA 24/7", "pricing.feat_auto_email": "Réponses Email Auto", "pricing.feat_priority": "Support Prioritaire", "pricing.feat_everything_pro": "Tout dans Pro", "pricing.feat_custom_api": "Accès API", "pricing.feat_dedicated": "Gestionnaire Dédié", "pricing.feat_training": "Formation Équipe", "pricing.enterprise_contact": "Besoin d'un plan sur mesure ?",

      // --- NEW SECTIONS (Footer, Contact, Dashboard) ---
      "footer.slogan": "Nous aidons les entreprises à se développer en pilote automatique. Automatisez la comptabilité, les RH et le marketing avec notre IA.",
      "footer.company": "Entreprise", "footer.legal": "Légal", "footer.privacy": "Politique de Confidentialité", "footer.terms": "Conditions d'Utilisation", "footer.complaints": "Livre de Réclamations", "footer.rights": "Tous droits réservés.",

      "contact.title": "Comment pouvons-nous aider? 👋",
      "contact.subtitle": "Notre équipe (et notre IA) sont prêtes à répondre.",
      "contact.greeting.morning": "Bonjour", "contact.greeting.afternoon": "Bon après-midi", "contact.greeting.night": "Bonsoir",
      "contact.status.title": "Statut Opérationnel", "contact.status.servers": "Serveurs IA", "contact.status.response": "Temps de Réponse", "contact.status.caffeine": "Niveau de Caféine", "contact.status.online": "EN LIGNE",
      "contact.direct_email.title": "Email Direct", "contact.direct_email.subtitle": "Préférez-vous utiliser votre client de messagerie ?",
      "contact.form.name": "Nom", "contact.form.name_placeholder": "Votre nom", "contact.form.email": "Email", "contact.form.email_placeholder": "email@entreprise.com", "contact.form.subject": "Sujet", "contact.form.message": "Message", "contact.form.message_placeholder": "Dites-nous tout...", "contact.form.send": "Envoyer le Message", "contact.form.sending": "Envoi...", "contact.form.success": "Envoyé avec Succès!", "contact.form.error": "Oups! Quelque chose s'est mal passé.",
      "contact.subjects.general": "Question Générale", "contact.subjects.tech": "Support Technique", "contact.subjects.sales": "Ventes / Commercial", "contact.subjects.partners": "Partenariats", "contact.subjects.other": "Autre",

      "dashboard.welcome": "Bon retour", "dashboard.active_plan": "Plan Actif", "dashboard.next_billing": "Prochaine Facture", "dashboard.usage": "Utilisation IA", "dashboard.recent_activity": "Activité Récente", "dashboard.no_activity": "Aucune activité récente."
    }
  },

  // --- ESPANHOL (ES) ---
  es: {
    translation: {
      "nav.login": "Acceso", "nav.signup": "Registro", "nav.pricing": "Precios", "nav.home": "Inicio", "nav.contact": "Contacto", "nav.dashboard": "Panel", "nav.logout": "Cerrar sesión",
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
      
      "login.title": "Bienvenido", "login.email": "Email", "login.password": "Contraseña", "login.button": "Entrar", "login.forgot": "¿Olvidaste la contraseña?", "login.noAccount": "¿No tienes cuenta?", 
      "auth.createTitle": "Crear Cuenta de Empresa", "auth.haveAccount": "¿Ya tienes cuenta?", "auth.createSubtitle": "Empieza tu prueba gratuita", "auth.loginSubtitle": "Accede a tu panel",
      "auth.fullName": "Nombre Completo", "auth.jobTitle": "Cargo (ej: Director)", "auth.companyName": "Nombre de la Empresa", "auth.companyCode": "Código de Empresa", "auth.iHaveCode": "Tengo código de empresa (Empleado)", "auth.iWantCreate": "Registrar nueva empresa", "auth.generateCode": "El código de empresa se generará automáticamente.",

      "pricing.title": "Precios Simples", "pricing.subtitle": "Elige el plan que mejor se adapte a tu negocio.", "pricing.most_popular": "Más Popular", "pricing.choose_plan": "Elegir Plan", "pricing.starter_desc": "Perfecto para autónomos.", "pricing.pro_desc": "Para empresas en crecimiento.", "pricing.enterprise_desc": "Para grandes organizaciones.", "pricing.feat_invoices": "Facturas Ilimitadas", "pricing.feat_clients": "Hasta 50 Clientes", "pricing.feat_basic_support": "Soporte Básico", "pricing.feat_no_ai": "Funciones IA Básicas", "pricing.feat_chat": "Chat Asistente IA", "pricing.feat_automation": "Automatización Completa", "pricing.feat_everything_starter": "Todo en Starter", "pricing.feat_unlimited_ai": "Acciones IA Ilimitadas", "pricing.feat_chat_247": "Asesor IA 24/7", "pricing.feat_auto_email": "Respuestas Email Auto", "pricing.feat_priority": "Soporte Prioritario", "pricing.feat_everything_pro": "Todo en Pro", "pricing.feat_custom_api": "Acceso API", "pricing.feat_dedicated": "Gestor Dedicado", "pricing.feat_training": "Formación Equipo", "pricing.enterprise_contact": "¿Necesitas un plan a medida?",

      // --- NEW SECTIONS (Footer, Contact, Dashboard) ---
      "footer.slogan": "Ayudamos a las empresas a crecer en piloto automático. Automatiza la contabilidad, RRHH y marketing con nuestra Inteligencia Artificial.",
      "footer.company": "Empresa", "footer.legal": "Legal", "footer.privacy": "Política de Privacidad", "footer.terms": "Términos de Uso", "footer.complaints": "Libro de Reclamaciones", "footer.rights": "Todos los derechos reservados.",

      "contact.title": "¿Cómo podemos ayudar? 👋",
      "contact.subtitle": "Nuestro equipo (y nuestra IA) están listos para responder.",
      "contact.greeting.morning": "Buenos días", "contact.greeting.afternoon": "Buenas tardes", "contact.greeting.night": "Buenas noches",
      "contact.status.title": "Estado Operativo", "contact.status.servers": "Servidores IA", "contact.status.response": "Tiempo de Respuesta", "contact.status.caffeine": "Nivel de Cafeína", "contact.status.online": "EN LÍNEA",
      "contact.direct_email.title": "Email Directo", "contact.direct_email.subtitle": "¿Prefieres usar tu cliente de correo?",
      "contact.form.name": "Nombre", "contact.form.name_placeholder": "Tu nombre", "contact.form.email": "Email", "contact.form.email_placeholder": "email@empresa.com", "contact.form.subject": "Asunto", "contact.form.message": "Mensaje", "contact.form.message_placeholder": "Cuéntanos todo...", "contact.form.send": "Enviar Mensaje", "contact.form.sending": "Enviando...", "contact.form.success": "¡Enviado con Éxito!", "contact.form.error": "¡Ups! Algo salió mal.",
      "contact.subjects.general": "Consulta General", "contact.subjects.tech": "Soporte Técnico", "contact.subjects.sales": "Ventas / Comercial", "contact.subjects.partners": "Alianzas", "contact.subjects.other": "Otro",

      "dashboard.welcome": "Bienvenido de nuevo", "dashboard.active_plan": "Plan Activo", "dashboard.next_billing": "Próxima Factura", "dashboard.usage": "Uso de IA", "dashboard.recent_activity": "Actividad Reciente", "dashboard.no_activity": "Sin actividad reciente."
    }
  },

  // --- ALEMÃO (DE) ---
  de: {
    translation: {
      "nav.login": "Anmelden", "nav.signup": "Registrieren", "nav.pricing": "Preise", "nav.home": "Startseite", "nav.contact": "Kontakt", "nav.dashboard": "Dashboard", "nav.logout": "Abmelden",
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
      
      "login.title": "Willkommen", "login.email": "E-Mail", "login.password": "Passwort", "login.button": "Anmelden", "login.forgot": "Passwort vergessen?", "login.noAccount": "Kein Konto?", 
      "auth.createTitle": "Geschäftskonto Erstellen", "auth.haveAccount": "Haben Sie ein Konto?", "auth.createSubtitle": "Starten Sie Ihre kostenlose Testversion", "auth.loginSubtitle": "Zugriff auf Ihr Dashboard",
      "auth.fullName": "Vollständiger Name", "auth.jobTitle": "Position (z.B. Direktor)", "auth.companyName": "Firmenname", "auth.companyCode": "Firmencode", "auth.iHaveCode": "Ich habe einen Firmencode (Mitarbeiter)", "auth.iWantCreate": "Neue Firma registrieren", "auth.generateCode": "Der Firmencode wird automatisch generiert.",

      "pricing.title": "Einfache Preise", "pricing.subtitle": "Wählen Sie den Plan, der zu Ihnen passt.", "pricing.most_popular": "Beliebtestes", "pricing.choose_plan": "Plan Wählen", "pricing.starter_desc": "Perfekt für Freelancer.", "pricing.pro_desc": "Für wachsende Unternehmen.", "pricing.enterprise_desc": "Für große Organisationen.", "pricing.feat_invoices": "Unbegrenzte Rechnungen", "pricing.feat_clients": "Bis zu 50 Kunden", "pricing.feat_basic_support": "Basis-Support", "pricing.feat_no_ai": "Basis-KI-Funktionen", "pricing.feat_chat": "KI-Chat-Assistent", "pricing.feat_automation": "Vollständige Automatisierung", "pricing.feat_everything_starter": "Alles in Starter", "pricing.feat_unlimited_ai": "Unbegrenzte KI-Aktionen", "pricing.feat_chat_247": "24/7 KI-Berater", "pricing.feat_auto_email": "Auto-E-Mail-Antworten", "pricing.feat_priority": "Prioritäts-Support", "pricing.feat_everything_pro": "Alles in Pro", "pricing.feat_custom_api": "Benutzerdefinierte API", "pricing.feat_dedicated": "Dedizierter Manager", "pricing.feat_training": "Team-Schulung", "pricing.enterprise_contact": "Benötigen Sie einen individuellen Plan?",

      // --- NEW SECTIONS (Footer, Contact, Dashboard) ---
      "footer.slogan": "Wir helfen Unternehmen, auf Autopilot zu wachsen. Automatisieren Sie Buchhaltung, Personalwesen und Marketing mit unserer Künstlichen Intelligenz.",
      "footer.company": "Unternehmen", "footer.legal": "Rechtliches", "footer.privacy": "Datenschutzerklärung", "footer.terms": "Nutzungsbedingungen", "footer.complaints": "Beschwerdebuch", "footer.rights": "Alle Rechte vorbehalten.",

      "contact.title": "Wie können wir helfen? 👋",
      "contact.subtitle": "Unser Team (und unsere KI) sind bereit zu antworten.",
      "contact.greeting.morning": "Guten Morgen", "contact.greeting.afternoon": "Guten Tag", "contact.greeting.night": "Guten Abend",
      "contact.status.title": "Betriebsstatus", "contact.status.servers": "KI-Server", "contact.status.response": "Antwortzeit", "contact.status.caffeine": "Koffeinspiegel", "contact.status.online": "ONLINE",
      "contact.direct_email.title": "Direkte E-Mail", "contact.direct_email.subtitle": "Lieber Ihr E-Mail-Programm nutzen?",
      "contact.form.name": "Name", "contact.form.name_placeholder": "Ihr Name", "contact.form.email": "E-Mail", "contact.form.email_placeholder": "email@firma.com", "contact.form.subject": "Betreff", "contact.form.message": "Nachricht", "contact.form.message_placeholder": "Erzählen Sie uns alles...", "contact.form.send": "Nachricht Senden", "contact.form.sending": "Senden...", "contact.form.success": "Erfolgreich Gesendet!", "contact.form.error": "Hoppla! Etwas ist schief gelaufen.",
      "contact.subjects.general": "Allgemeine Anfrage", "contact.subjects.tech": "Technischer Support", "contact.subjects.sales": "Vertrieb / Kommerziell", "contact.subjects.partners": "Partnerschaften", "contact.subjects.other": "Sonstiges",

      "dashboard.welcome": "Willkommen zurück", "dashboard.active_plan": "Aktiver Plan", "dashboard.next_billing": "Nächste Rechnung", "dashboard.usage": "KI-Nutzung", "dashboard.recent_activity": "Letzte Aktivität", "dashboard.no_activity": "Keine jüngsten Aktivitäten."
    }
  },

  // --- ITALIANO (IT) ---
  it: {
    translation: {
      "nav.login": "Accedi", "nav.signup": "Registrati", "nav.pricing": "Prezzi", "nav.home": "Home", "nav.contact": "Contatti", "nav.dashboard": "Dashboard", "nav.logout": "Esci",
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
      "roles.accountant": "Commercialista", "roles.admin": "Assistente Ammin.", "roles.hr": "Responsable HR", "roles.marketing": "Specialista Marketing", "roles.support": "Supporto Clienti",
      
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
      
      "login.title": "Benvenuto", "login.email": "Email", "login.password": "Password", "login.button": "Accedi", "login.forgot": "Password dimenticata?", "login.noAccount": "Non hai un account?", 
      "auth.createTitle": "Crea Account Aziendale", "auth.haveAccount": "Hai già un account?", "auth.createSubtitle": "Inizia la tua prova gratuita", "auth.loginSubtitle": "Accedi alla tua dashboard",
      "auth.fullName": "Nome Completo", "auth.jobTitle": "Ruolo (es: Direttore)", "auth.companyName": "Nome Azienda", "auth.companyCode": "Codice Aziendale", "auth.iHaveCode": "Ho un codice aziendale (Dipendente)", "auth.iWantCreate": "Registra nuova azienda", "auth.generateCode": "Il codice aziendale verrà generato automaticamente.",

      "pricing.title": "Prezzi Semplici", "pricing.subtitle": "Scegli il piano più adatto alla tua azienda.", "pricing.most_popular": "Più Popolare", "pricing.choose_plan": "Scegli Piano", "pricing.starter_desc": "Perfetto per freelance.", "pricing.pro_desc": "Per aziende in crescita.", "pricing.enterprise_desc": "Per grandi organizzazioni.", "pricing.feat_invoices": "Fatture Illimitate", "pricing.feat_clients": "Fino a 50 Clienti", "pricing.feat_basic_support": "Supporto Base", "pricing.feat_no_ai": "Funzioni IA Base", "pricing.feat_chat": "Chat Assistente IA", "pricing.feat_automation": "Automazione Completa", "pricing.feat_everything_starter": "Tutto in Starter", "pricing.feat_unlimited_ai": "Azioni IA Illimitate", "pricing.feat_chat_247": "Consulente IA 24/7", "pricing.feat_auto_email": "Risposte Email Auto", "pricing.feat_priority": "Supporto Prioritario", "pricing.feat_everything_pro": "Tutto in Pro", "pricing.feat_custom_api": "Accesso API", "pricing.feat_dedicated": "Gestore Dedicato", "pricing.feat_training": "Formazione Team", "pricing.enterprise_contact": "Hai bisogno di un piano su misura?",

      // --- NEW SECTIONS (Footer, Contact, Dashboard) ---
      "footer.slogan": "Aiutiamo le aziende a crescere col pilota automatico. Automatizza contabilità, risorse umane e marketing con la nostra Intelligenza Artificiale.",
      "footer.company": "Azienda", "footer.legal": "Legale", "footer.privacy": "Privacy Policy", "footer.terms": "Termini d'Uso", "footer.complaints": "Registro dei Reclami", "footer.rights": "Tutti i diritti riservati.",

      "contact.title": "Come possiamo aiutare? 👋",
      "contact.subtitle": "Il nostro team (e la nostra IA) sono pronti a rispondere.",
      "contact.greeting.morning": "Buongiorno", "contact.greeting.afternoon": "Buon pomeriggio", "contact.greeting.night": "Buonasera",
      "contact.status.title": "Stato Operativo", "contact.status.servers": "Server IA", "contact.status.response": "Tempo di Risposta", "contact.status.caffeine": "Livello di Caffeina", "contact.status.online": "ONLINE",
      "contact.direct_email.title": "Email Diretta", "contact.direct_email.subtitle": "Preferisci usare il tuo client email?",
      "contact.form.name": "Nome", "contact.form.name_placeholder": "Il tuo nome", "contact.form.email": "Email", "contact.form.email_placeholder": "email@azienda.com", "contact.form.subject": "Oggetto", "contact.form.message": "Messaggio", "contact.form.message_placeholder": "Raccontaci tutto...", "contact.form.send": "Invia Messaggio", "contact.form.sending": "Invio in corso...", "contact.form.success": "Inviato con Successo!", "contact.form.error": "Ops! Qualcosa è andato storto.",
      "contact.subjects.general": "Richiesta Generale", "contact.subjects.tech": "Supporto Tecnico", "contact.subjects.sales": "Vendite / Commerciale", "contact.subjects.partners": "Partnership", "contact.subjects.other": "Altro",

      "dashboard.welcome": "Bentornato", "dashboard.active_plan": "Piano Attivo", "dashboard.next_billing": "Prossima Fattura", "dashboard.usage": "Utilizzo IA", "dashboard.recent_activity": "Attività Recente", "dashboard.no_activity": "Nessuna attività recente."
    }
  }
};

i18n.use(initReactI18next).init({
  resources, 
  lng: "pt", // Língua padrão ao abrir
  fallbackLng: "en", // Se falhar, usa inglês
  interpolation: { escapeValue: false }
});

export default i18n;