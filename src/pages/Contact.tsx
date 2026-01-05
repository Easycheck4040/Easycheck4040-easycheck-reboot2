import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import Footer from '../components/Footer';
import { Mail, Clock, Send, Check, Coffee, Server, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Importante

export default function Contact() {
  const { t } = useTranslation();
  
  const [form, setForm] = useState({ name: '', email: '', subject: 'contact.subjects.general', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [greetingKey, setGreetingKey] = useState('morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreetingKey('morning');
    else if (hour < 18) setGreetingKey('afternoon');
    else setGreetingKey('night');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Traduzir o assunto para enviar no email (para ficar bonito no teu inbox)
    const translatedSubject = t(form.subject);

    const templateParams = {
      name: form.name,
      email: form.email,
      subject: translatedSubject,
      message: form.message
    };

    // ENVIO REAL DO EMAIL
    emailjs.send('service_otbmz08', 'template_nyz0z8r', templateParams, 'Ge7iFCc1jF-Q87xqW')
      .then((response) => {
         console.log('SUCESSO!', response.status, response.text);
         setStatus('success');
         
         setTimeout(() => {
           setStatus('idle');
           setForm({ name: '', email: '', subject: 'contact.subjects.general', message: '' });
         }, 3000);
      }, (err) => {
         console.log('ERRO...', err);
         alert(t('contact.form.error')); // Alerta traduzido
         setStatus('idle');
      });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300">
      
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 animate-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t(`contact.greeting.${greetingKey}`)}! {t('contact.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* ESQUERDA: Status */}
            <div className="space-y-8 animate-in slide-in-from-left duration-700 delay-100">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Zap className="w-24 h-24 text-blue-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  {t('contact.status.title')} 🟢
                </h3>

                <div className="space-y-6">
                  {/* Servidores */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600">
                        <Server className="w-5 h-5" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 font-medium">{t('contact.status.servers')}</span>
                    </div>
                    <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full animate-pulse">
                      {t('contact.status.online')}
                    </span>
                  </div>

                  {/* Tempo de Resposta */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 font-medium">{t('contact.status.response')}</span>
                    </div>
                    <span className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                      &lt; 2h
                    </span>
                  </div>

                  {/* Cafeína */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 group-hover:rotate-12 transition-transform">
                        <Coffee className="w-5 h-5" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 font-medium">{t('contact.status.caffeine')}</span>
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
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{t('contact.direct_email.title')}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('contact.direct_email.subtitle')}</p>
                      <a href="mailto:suporte@easycheckglobal.com" className="text-blue-600 font-bold hover:underline">suporte@easycheckglobal.com</a>
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{t('contact.form.name')}</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      placeholder={t('contact.form.name_placeholder')} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{t('contact.form.email')}</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      placeholder={t('contact.form.email_placeholder')} 
                    />
                  </div>
                </div>

                {/* Assunto */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{t('contact.form.subject')}</label>
                  <select 
                    name="subject"
                    value={form.subject}
                    onChange={(e) => setForm({...form, subject: e.target.value})}
                    className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="contact.subjects.general">{t('contact.subjects.general')}</option>
                    <option value="contact.subjects.tech">{t('contact.subjects.tech')}</option>
                    <option value="contact.subjects.sales">{t('contact.subjects.sales')}</option>
                    <option value="contact.subjects.partners">{t('contact.subjects.partners')}</option>
                    <option value="contact.subjects.other">{t('contact.subjects.other')}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{t('contact.form.message')}</label>
                  <textarea 
                    name="message"
                    rows={4} 
                    required
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" 
                    placeholder={t('contact.form.message_placeholder')}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status !== 'idle'}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-500 transform
                    ${status === 'success' ? 'bg-green-500 scale-100' : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]'}
                    ${status === 'sending' ? 'opacity-80 cursor-wait' : ''}
                  `}
                >
                  {status === 'idle' && (
                    <>
                      {t('contact.form.send')} <Send className="w-5 h-5" />
                    </>
                  )}
                  {status === 'sending' && (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {t('contact.form.sending')}
                    </>
                  )}
                  {status === 'success' && (
                    <>
                      {t('contact.form.success')} <Check className="w-5 h-5" />
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