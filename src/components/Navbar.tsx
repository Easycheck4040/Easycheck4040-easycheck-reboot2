import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, Globe, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from './ui/button'; // Certifica-te que este caminho existe

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lógica do Modo Noite
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsMenuOpen(false); // Fecha menu mobile se aberto
  };

  return (
    <nav className={`sticky top-0 z-50 border-b transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white/90 border-gray-200 text-gray-900'} backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. LOGO GRANDE E ÚNICO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <Zap className="w-7 h-7 fill-current" />
            </div>
            <span className="text-3xl font-extrabold tracking-tighter">EasyCheck</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* Seletor de Língua */}
            <div className="relative group">
              <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <Globe className="w-5 h-5" />
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden hidden group-hover:block z-50">
                <button onClick={() => changeLanguage('pt')} className="block w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm dark:text-gray-200">🇵🇹 Português</button>
                <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm dark:text-gray-200">🇬🇧 English</button>
                <button onClick={() => changeLanguage('fr')} className="block w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm dark:text-gray-200">🇫🇷 Français</button>
              </div>
            </div>

            {/* Dark Mode */}
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

            <Link to="/login">
              <Button variant="outline" className={`${isDark ? 'bg-transparent border-gray-700 text-white hover:bg-gray-800' : ''}`}>
                {t('nav.login')}
              </Button>
            </Link>
            <Link to="/login?mode=signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25">
                {t('nav.signup')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}