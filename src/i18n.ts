import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Estrutura base para não dar erros. Depois preenchemos os textos todos.
const resources = {
  en: { translation: { "app.name": "EasyCheck", "welcome": "Welcome" } },
  pt: { translation: { "app.name": "EasyCheck", "welcome": "Bem-vindo" } },
  fr: { translation: { "app.name": "EasyCheck", "welcome": "Bienvenue" } },
  es: { translation: { "app.name": "EasyCheck", "welcome": "Bienvenido" } },
  de: { translation: { "app.name": "EasyCheck", "welcome": "Willkommen" } }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Começa em Inglês como pediste (mas vamos ter botão para mudar)
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;