import Footer from '../components/Footer';
import { Mail, MapPin, Clock, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* A Navbar foi removida daqui porque o App.tsx já a coloca automaticamente */}
      
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Entra em Contacto
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Tens dúvidas sobre o EasyCheck? A nossa equipa está pronta para ajudar a tua empresa a crescer.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Esquerda: Informações */}
            <div className="space-y-8">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border dark:border-gray-700">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">A nossa equipa responde em menos de 2h.</p>
                    <a href="mailto:suporte@easycheckglobal.com" className="text-blue-600 font-bold hover:underline">suporte@easycheckglobal.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Localização</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Lisboa, Portugal 🇵🇹<br/>
                      (Disponível globalmente)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Horário</h3>
                    <p className="text-gray-600 dark:text-gray-400">Segunda a Sexta: 9h - 18h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direita: Formulário */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border dark:border-gray-700">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome</label>
                    <input type="text" className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="O teu nome" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input type="email" className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="email@empresa.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mensagem</label>
                  <textarea rows={4} className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Como podemos ajudar?"></textarea>
                </div>
                <button type="button" onClick={() => alert("Obrigado! Recebemos a tua mensagem.")} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Enviar Mensagem
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}