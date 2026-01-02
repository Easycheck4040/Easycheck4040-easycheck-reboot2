import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Simples */}
      <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">EasyCheck ✅</div>
          <div className="flex gap-4">
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2">
              Entrar
            </Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
              Começar Agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (A parte principal) */}
      <div className="relative overflow-hidden pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Faturação simples para <span className="text-blue-600">empreendedores modernos</span>.
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Deixa de perder tempo com papelada. Cria faturas, gere clientes e envia recibos em segundos. Tudo automático.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
              Criar Conta Grátis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-200 transition">
              Ver Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ultra Rápido</h3>
              <p className="text-gray-600">Cria uma fatura em menos de 30 segundos. O sistema preenche os dados automaticamente.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Seguro e Legal</h3>
              <p className="text-gray-600">Cumprimos todas as regras da Autoridade Tributária. Os teus dados estão protegidos.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tudo Organizado</h3>
              <p className="text-gray-600">Nunca mais percas uma fatura. O painel mostra quem pagou e quem está em atraso.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© 2024 EasyCheck. Feito para vencer.</p>
        </div>
      </footer>
    </div>
  );
}