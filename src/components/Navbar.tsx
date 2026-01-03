import { Link } from 'react-router-dom';
import { ModeToggle } from './ModeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Lado Esquerdo: Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            {/* Tenta carregar o PNG primeiro, se usaste JPG avisa-me */}
            <img 
              src="/logogrande.png" 
              alt="EasyCheck Logo" 
              className="h-10 w-auto object-contain" 
            />
          </Link>

          {/* Lado Direito: Ferramentas */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" /> {/* Linha separadora */}
            <ModeToggle />
            
            {/* Botão de Login (Pequeno e discreto) */}
            <Link 
              to="/login" 
              className="ml-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              Login
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}