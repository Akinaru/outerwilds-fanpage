import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationFR from "./fr/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: translationFR },
  },
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;