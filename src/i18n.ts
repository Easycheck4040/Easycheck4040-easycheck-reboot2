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
      "categories.accounting.description": "Forget spreadsheets. Our AI automatically generates invoices, tracks every expense, calculates your taxes in real-time, and ensures you remain 100% compliant with the law without lifting a finger.",
      
      "categories.communication.title": "Smart Communication",
      "categories.communication.description": "Never miss a client email again. The AI reads, categorizes, and drafts professional responses instantly. It handles your scheduling and customer inquiries 24/7.",
      
      "categories.administrative.title": "Admin Automation",
      "categories.administrative.description": "Your digital filing cabinet. Upload any contract or receipt, and the AI organizes, reads, and extracts the key data. Generate contracts and reports in seconds.",
      
      "categories.hr.title": "HR Management",
      "categories.hr.description": "Manage your team effortlessly. From processing payroll and tracking vacation days to onboarding new employees, the AI handles the paperwork so you can lead.",
      
      "categories.marketing.title": "Growth Marketing",
      "categories.marketing.description": "Scale your business faster. Create ad campaigns, schedule social media posts, and analyze market trends automatically to reach more customers with less effort.",
      
      "categories.chat.title": "EasyCheck AI Chat",
      "categories.chat.description": "Your personal 24/7 business advisor. Ask anything like 'Create an invoice for John' or 'How much profit did we make today?' and get instant actions.",

      "login.title": "Welcome Back", "login.email": "Email", "login.password": "Password", "login.button": "Sign In", "login.forgot": "Forgot password?", "login.noAccount": "No account?", "auth.createTitle": "Create Account", "auth.haveAccount": "Have account?"
    }
  },

  // --- PORTUGUÊS ---
  pt: {
    translation: {
      "nav.login": "Entrar", "nav.signup": "Criar Conta", "nav.pricing": "Preços",
      "hero.savings": "Mais Rápido, Mais Fácil, Mais Barato",
      "hero.title": "Gere a Tua Empresa em Piloto Automático com IA",
      "hero.description": "Porquê contratar 5 funcionários quando uma IA faz tudo? Poupa 90% dos custos, elimina erros manuais e completa tarefas em segundos, não em dias.",
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
      "categories.accounting.description": "Esquece o Excel. A nossa IA gera faturas automaticamente, rastreia todas as despesas, calcula impostos em tempo real e garante conformidade legal sem levantares um dedo.",
      
      "categories.communication.title": "Comunicação Inteligente",
      "categories.communication.description": "Nunca percas um email. A IA lê, categoriza e rascunha respostas profissionais instantaneamente. Gere a tua agenda e responde a clientes 24 horas por dia.",
      
      "categories.administrative.title": "Automação Admin",
      "categories.administrative.description": "O teu arquivo digital. Carrega qualquer contrato ou recibo e a IA organiza, lê e extrai os dados. Gera contratos e relatórios detalhados em segundos.",
      
      "categories.hr.title": "Gestão de RH",
      "categories.hr.description": "Gere a equipa sem esforço. Desde processar salários e controlar férias até contratar novos funcionários, a IA trata da burocracia para tu liderares.",
      
      "categories.marketing.title": "Marketing de Crescimento",
      "categories.marketing.description": "Escala o negócio mais rápido. Cria campanhas de anúncios, agenda posts nas redes sociais e analisa tendências de mercado para chegares a mais clientes.",
      
      "categories.chat.title": "Chat EasyCheck IA",
      "categories.chat.description": "O teu consultor pessoal 24/7. Pede qualquer coisa como 'Cria uma fatura para o João' ou 'Qual foi o lucro de hoje?' e obtém ações imediatas.",

      "login.title": "Bem-vindo", "login.email": "Email", "login.password": "Palavra-passe", "login.button": "Entrar", "login.forgot": "Esqueceste a palavra-passe?", "login.noAccount": "Não tens conta?", "auth.createTitle": "Criar Conta", "auth.haveAccount": "Já tens conta?"
    }
  },

  // --- FRANCÊS (CORRIGIDO E COMPLETO) ---
  fr: {
    translation: {
      "nav.login": "Connexion", "nav.signup": "Créer un compte", "nav.pricing": "Tarifs",
      "hero.savings": "Plus Rapide, Plus Simple, Moins Cher",
      "hero.title": "Gérez Votre Entreprise en Pilote Automatique avec l'IA",
      "hero.description": "Pourquoi embaucher 5 employés quand une IA peut tout faire ? Économisez 90% des coûts, éliminez les erreurs et accomplissez vos tâches en quelques secondes.",
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
      "categories.accounting.description": "Oubliez les tableurs. Notre IA génère automatiquement les factures, suit chaque dépense, calcule vos impôts en temps réel et assure votre conformité légale.",
      
      "categories.communication.title": "Communication Intelligente",
      "categories.communication.description": "Ne manquez jamais un email. L'IA lit, catégorise et rédige des réponses professionnelles instantanément. Elle gère votre agenda et répond aux clients 24/7.",
      
      "categories.administrative.title": "Automatisation Admin",
      "categories.administrative.description": "Votre classeur numérique. Téléchargez n'importe quel contrat ou reçu, et l'IA organise, lit et extrait les données. Générez des rapports en quelques secondes.",
      
      "categories.hr.title": "Gestion RH",
      "categories.hr.description": "Gérez votre équipe sans effort. Du traitement de la paie et des congés à l'intégration des nouveaux employés, l'IA gère la paperasse pour que vous puissiez diriger.",
      
      "categories.marketing.title": "Marketing de Croissance",
      "categories.marketing.description": "Développez votre entreprise plus rapidement. Créez des campagnes publicitaires, planifiez des posts sur les réseaux sociaux et analysez le marché automatiquement.",
      
      "categories.chat.title": "Chat EasyCheck IA",
      "categories.chat.description": "Votre conseiller personnel 24/7. Demandez n'importe quoi comme 'Crée une facture pour Jean' ou 'Quel est le profit d'aujourd'hui ?' et obtenez des actions immédiates.",

      "login.title": "Bienvenue", "login.email": "Email", "login.password": "Mot de passe", "login.button": "Se connecter", "login.forgot": "Mot de passe oublié ?", "login.noAccount": "Pas de compte ?", "auth.createTitle": "Créer un Compte", "auth.haveAccount": "Déjà un compte ?"
    }
  },
  
  // (Podes manter es, de, it aqui também, se quiseres completo para todos)
  es: { translation: { "hero.title": "Automatiza Tu Negocio" } }, // Exemplo curto
  de: { translation: { "hero.title": "Automatisieren Sie Ihr Geschäft" } },
  it: { translation: { "hero.title": "Automatizza Il Tuo Business" } }
};

i18n.use(initReactI18next).init({
  resources, 
  lng: "pt", 
  fallbackLng: "en", 
  interpolation: { escapeValue: false }
});

export default i18n;