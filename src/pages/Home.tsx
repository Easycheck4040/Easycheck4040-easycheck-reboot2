import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navbar Simples e Elegante */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600 tracking-tight flex items-center gap-2">
            EasyCheck <span className="text-gray-400 text-sm font-normal">v1.0</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2 transition-colors">
              Entrar
            </Link>
            <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
              Começar Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (A "Cara" do Site) */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold tracking-wide uppercase">
            🚀 A nova era da faturação
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight">
            Faturação automática para <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              quem não tem tempo a perder.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Esquece as folhas de Excel e os contabilistas caros. Cria faturas, gere clientes e envia recibos em segundos.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
            <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Criar Conta Grátis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-200 transition-colors">
              Ver Demonstração
            </Link>
          </div>
        </div>
        
        {/* Elemento decorativo de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
      </div>

      {/* Features Grid (Benefícios) */}
      <div className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Ultra Rápido</h3>
              <p className="text-gray-600 leading-relaxed">
                Preenchemos os dados da empresa automaticamente através do NIF. Faturas prontas em menos de 30 segundos.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">100% Legal</h3>
              <p className="text-gray-600 leading-relaxed">
                Certificado pela Autoridade Tributária. Cumprimos todas as regras para que durmas descansado.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Tudo Organizado</h3>
              <p className="text-gray-600 leading-relaxed">
                Painel intuitivo que te mostra quem pagou, quem deve e quanto vais receber este mês.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Simples */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">© 2024 EasyCheck Lda. Feito em Portugal 🇵🇹</p>
        </div>
      </footer>
    </div>
  );
}