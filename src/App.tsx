import { useEffect } from 'react';
import { useParams, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './lang/i18n';
import LanguageSwitcher from './components/LanguageSwitcher';
import { languages } from './lang/i18n';

function App() {
  const { i18n } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();

  // Liste des langues actives
  const activeLangCodes = languages.filter(l => !l.disabled).map(l => l.code);
  const fallbackLang = languages.find(l => l.fallback)?.code || activeLangCodes[0];

  // Redirige si la langue n'est pas active
  if (!lang || !activeLangCodes.includes(lang)) {
    return <Navigate to={`/${fallbackLang}`} replace />;
  }

  // Change la langue i18n si besoin
  useEffect(() => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="overflow-x-hidden relative">
      <LanguageSwitcher />
      <Outlet />
    </div>
  );
}

export default App;
