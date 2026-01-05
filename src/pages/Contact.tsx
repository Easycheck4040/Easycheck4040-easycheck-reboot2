import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { Mail, Clock, Send, Check, Coffee, Server, Zap, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  // Estado para o formulário
  const [form, setForm] = useState({ name: '', email: '', subject: 'Dúvida Geral', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  
  // Estado para a saudação dinâmica (Bom dia / Boa tarde)
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Preparar os dados para o EmailJS
    const templateParams = {
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message
    };

    // ENVIO REAL COM OS TEUS DADOS
    emailjs.send(
      'service_60rf77e',      // Teu Service ID
      'template_nyz0z8r',     // Teu Template ID
      templateParams,
      'Ge7iFCc1jF-Q87xqW'     // Tua Public Key
    )
    .then((response) => {
       console.log('SUCESSO!', response.status, response.text);
       setStatus('success');
       // Limpar formulário e resetar status após 3 segundos
       setTimeout(() => {
         setStatus('idle');
         setForm({ name: '', email: '', subject: 'Dúvida Geral', message: '' });
       }, 3000);
    }, (err) => {
       console.log('ERRO...', err);
       setStatus('error');
       setTimeout(() => setStatus('idle'), 4000);
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300">
      
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 animate-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {greeting}! Como podemos ajudar? 👋
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A nossa equipa (e a nossa IA) estão prontas para responder.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* ESQUERDA: Status do Sistema (A "Brincadeirinha") */}
            <div className="space-y-8 animate-in slide-in-from-left duration-700 delay-100">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                
                {/* Efeito decorativo */}
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Zap className="w-24 h-24 text-blue-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  Status Operacional 🟢
                </h3>

                <div className="space-y-6">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600">
                        <Server className="w-5 h-5" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 font-medium">Servidores IA</span>
                    </div>
                    <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full animate-pulse">
                      ONLINE
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 font-medium">Tempo de Resposta</span>
                    </div>
                    <span className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                      &lt; 2 Horas
                    </span>
                  </div>

                  {/* Item 3 - Café */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 group-hover:rotate-12 transition-transform">
                        <Coffee className="w-5 h-5" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 font-medium">Nível de Cafeína</span>
                    </div>
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 w-[98%]"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Email Direto</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Preferes usar o teu cliente de email?</p>
                      <a href="mailto:contact@easycheckglobal.com" className="text-blue-600 font-bold hover:underline">contact@easycheckglobal.com</a>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* DIREITA: Formulário */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in slide-in-from-right duration-700 delay-200">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Nome</label>
                    <input 
                      type="text" 
                      required
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      placeholder="O teu nome" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email</label>
                    <input 
                      type="email" 
                      required
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      placeholder="email@empresa.com" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Assunto</label>
                  <select 
                    value={form.subject}
                    onChange={(e) => setForm({...form, subject: e.target.value})}
                    className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                  >
                    <option>Dúvida Geral</option>
                    <option>Suporte Técnico</option>
                    <option>Comercial / Vendas</option>
                    <option>Parcerias</option>
                    <option>Outro</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Mensagem</label>
                  <textarea 
                    rows={4} 
                    required
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" 
                    placeholder="Conta-nos tudo..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'sending' || status === 'success'}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-500 transform
                    ${status === 'success' ? 'bg-green-500 scale-100' : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]'}
                    ${status === 'error' ? 'bg-red-500' : ''}
                    ${status === 'sending' ? 'opacity-80 cursor-wait' : ''}
                  `}
                >
                  {status === 'idle' && (
                    <>
                      Enviar Mensagem <Send className="w-5 h-5" />
                    </>
                  )}
                  {status === 'sending' && (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      A Enviar...
                    </>
                  )}
                  {status === 'success' && (
                    <>
                      Enviado com Sucesso! <Check className="w-5 h-5" />
                    </>
                  )}
                  {status === 'error' && (
                    <>
                      Erro no Envio <AlertCircle className="w-5 h-5" />
                    </>
                  )}
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