import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">EasyCheck ✅</div>
          <div className="flex gap-4">
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2">
              Entrar
            </Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
              Começar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-20 pb-32 text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Faturação simples e <span className="text-blue-600">automática</span>.
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Cria faturas, gere clientes e organiza o teu negócio sem dores de cabeça.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
            Criar Conta Grátis <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <Zap className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Rápido</h3>
            <p className="text-gray-600">Faturas prontas em segundos.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <Shield className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Seguro</h3>
            <p className="text-gray-600">Os teus dados protegidos.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <CheckCircle className="w-10 h-10 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Simples</h3>
            <p className="text-gray-600">Feito para quem não é contabilista.</p>
          </div>
        </div>
      </div>
    </div>
  );
}