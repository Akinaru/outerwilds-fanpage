import { useEffect } from 'react';
import { useParams, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './lang/i18n';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  const { i18n } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();


  useEffect(() => {
    if (lang && (lang === "en" || lang === "fr")) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  return (
    <div className="overflow-x-hidden relative">
      <LanguageSwitcher />
      <Outlet />
    </div>
  );
}

export default App;