import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Mail, 
  FileText, 
  Users, 
  TrendingUp, 
  Zap,
  ArrowRight,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = false; // Mudar para true quando o login estiver ligado

  const categories = [
    {
      icon: Calculator,
      title: 'Contabilidade & Finanças',
      description: 'Automatiza faturas, despesas e relatórios financeiros.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mail,
      title: 'Comunicação',
      description: 'Emails automáticos e gestão de clientes com IA.',
      gradient: 'from-cyan-500 to-teal-500'
    },
    {
      icon: FileText,
      title: 'Administrativo',
      description: 'Organização de documentos e burocracia zero.',
      gradient: 'from-teal-500 to-green-500'
    },
    {
      icon: Users,
      title: 'Recursos Humanos',
      description: 'Gestão de equipas, férias e processamento salarial.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Marketing & Vendas',
      description: 'Análise de crescimento e estratégias automáticas.',
      gradient: 'from-emerald-500 to-blue-500'
    }
  ];

  const benefits = [
    'Reduz custos operacionais em até 70%',
    'Disponível 24/7 sem pausas ou feriados',
    'Processa tarefas 10x mais rápido',
    'Minimiza erro humano com precisão de IA',
    'Escala instantaneamente com o teu negócio',
    'Suporte multilingue nativo'
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
      
      {/* Navbar Premium (Glassmorphism) */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
              <span className="font-bold text-xl tracking-tight text-gray-900">EasyCheck</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Funcionalidades</a>
              <a href="#benefits" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Vantagens</a>
              <Link to="/login" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                Entrar
              </Link>
              <Link to="/login" className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Começar Agora
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-900">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-4">
             <a href="#features" className="block text-gray-600 hover:text-blue-600 font-medium">Funcionalidades</a>
             <Link to="/login" className="block text-gray-600 hover:text-blue-600 font-medium">Entrar</Link>
             <Link to="/login" className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">Começar Agora</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8 animate-fade-in-up">
              <Zap className="h-4 w-4 fill-blue-700" />
              <span>Poupa até 70% em custos administrativos</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight text-gray-900">
              A tua empresa, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                gerida por Inteligência Artificial.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Deixa a burocracia para os robôs. A EasyCheck automatiza contabilidade, emails e gestão para que te foques em crescer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login" className="h-14 px-8 rounded-full bg-gray-900 text-white flex items-center justify-center gap-2 text-lg font-medium hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto">
                Criar Conta Grátis <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/pricing" className="h-14 px-8 rounded-full bg-white text-gray-700 border border-gray-200 flex items-center justify-center gap-2 text-lg font-medium hover:bg-gray-50 transition-all w-full sm:w-auto">
                Ver Preços
              </Link>
            </div>
            
            <div className="mt-12 text-sm text-gray-400 flex justify-center gap-8">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Sem fidelização</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> 14 dias grátis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid (Apple Style Bento Grid) */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900">Serviços Inteligentes</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
              Escolhe o módulo que precisas. A nossa IA trata do resto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link key={index} to={isAuthenticated ? '/dashboard' : '/login'} className="group">
                  <div className="h-full bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent relative overflow-hidden">
                    <div className={`h-14 w-14 rounded-2xl