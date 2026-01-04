import Navbar from '../components/Navbar';
import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Cabeçalho */}
          <div className="text-center mb-16 animate-in slide-in-from-bottom duration-700 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Fala Connosco
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Tens dúvidas sobre como a IA pode transformar a tua empresa? A nossa equipa (humana) está pronta para ajudar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Coluna da Esquerda: Informações */}
            <div className="space-y-8 animate-in slide-in-from-left duration-700 delay-100 fade-in">
              
              {/* Cartão de Email */}
              <div className="flex items-start gap-5 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Email Geral</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Para dúvidas gerais e parcerias.</p>
                  <a href="mailto:suporte@easycheckglobal.com" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                    suporte@easycheckglobal.com
                  </a>
                </div>
              </div>

              {/* Cartão de Sede */}
              <div className="flex items-start gap-5 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Sede EasyCheck</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Avenida da Liberdade, 110<br />
                    1250-146 Lisboa, Portugal 🇵🇹
                  </p>
                </div>
              </div>

              {/* Cartão de Horário */}
              <div className="flex items-start gap-5 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Horário de Suporte</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Segunda a Sexta: 09:00 - 18:00
                  </p>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    *Clientes Enterprise têm acesso a suporte 24/7.
                  </p>
                </div>
              </div>
            </div>

            {/* Coluna da Direita: Formulário */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in slide-in-from-right duration-700 delay-200 fade-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                Envia uma Mensagem
              </h2>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Mensagem enviada! Entraremos em contacto brevemente.'); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                    <input type="text" required placeholder="O teu nome" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input type="email" required placeholder="exemplo@empresa.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Assunto</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    <option>Dúvida Geral</option>
                    <option>Suporte Técnico</option>
                    <option>Parcerias / Enterprise</option>
                    <option>Outro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mensagem</label>
                  <textarea required rows={4} placeholder="Como podemos ajudar?" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"></textarea>
                </div>

                <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Enviar Pedido
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}