import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className={`sticky top-0 z-50 border-b transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white/90 border-gray-200 text-gray-900'} backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* O TEU LOGO AQUI */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logogrande.PNG" alt="Logo" className="h-10 w-auto object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
            {/* Se a imagem falhar, mostra o texto */}
            <span className="text-2xl font-bold tracking-tight">EasyCheck</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Seletor de Línguas Completo */}
            <div className="relative group">
              <button className={`p-2 rounded-lg flex items-center gap-2 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium uppercase">{i18n.language}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden hidden group-hover:block z-50">
                <button onClick={() => changeLanguage('pt')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">🇵🇹 Português</button>
                <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">🇬🇧 English</button>
                <button onClick={() => changeLanguage('fr')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">🇫🇷 Français</button>
                <button onClick={() => changeLanguage('es')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">🇪🇸 Español</button>
                <button onClick={() => changeLanguage('de')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">🇩🇪 Deutsch</button>
                <button onClick={() => changeLanguage('it')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">🇮🇹 Italiano</button>
              </div>
            </div>

            <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg ${isDark ? 'text-yellow-400' : 'text-gray-600'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="hidden md:flex gap-2">
              <Link to="/login"><Button variant="outline">{t('nav.login')}</Button></Link>
              <Link to="/login?mode=signup"><Button className="bg-blue-600 text-white">{t('nav.signup')}</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}