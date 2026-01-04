import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Parte Superior: Grid de 3 Colunas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Coluna 1: Logo e Slogan */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <img 
                src="/logopequena.PNG" 
                alt="EasyCheck Logo" 
                className="h-8 w-auto object-contain group-hover:opacity-80 transition-opacity" 
              />
              <span className="font-bold text-xl text-gray-900 dark:text-white">EasyCheck</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              Ajudamos empresas a crescer em piloto automático. Automatiza a contabilidade, recursos humanos e marketing com a nossa Inteligência Artificial.
            </p>
          </div>

          {/* Coluna 2: Empresa */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-sm uppercase tracking-wider">Empresa</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Preços
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Contactos
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Login / Registo
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Legal */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Livro de Reclamações
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Parte Inferior: Copyright e Redes Sociais */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
            © {currentYear} EasyCheck Global. Todos os direitos reservados.
          </p>
          
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors">
              <span className="sr-only">Facebook</span>
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-600 dark:hover:text-white transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 dark:hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 dark:hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}