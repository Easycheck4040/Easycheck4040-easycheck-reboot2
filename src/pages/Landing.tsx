import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-bold text-blue-900 mb-4">EasyCheck ✅</h1>
      <p className="text-xl text-gray-600 mb-8">Faturação simples e automática para empreendedores.</p>
      <div className="space-x-4">
        <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Entrar na App
        </Link>
      </div>
    </div>
  );
}