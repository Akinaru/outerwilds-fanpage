import { useEffect, useState } from 'react';
import { useParams, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './lang/i18n';
import LanguageSwitcher from './components/LanguageSwitcher';

const MOBILE_MAX_WIDTH = 768;

const isMobileDevice = () => {
  return window.innerWidth <= MOBILE_MAX_WIDTH || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const WrongDeviceInline = () => {
  const { t } = useTranslation('core');

  return (
    <div className="h-screen flex items-center justify-center text-center bg-black text-white px-4">
      <div>
        <h1 className="text-3xl mb-4 font-bold">{t("wrongdevice.title")}</h1>
        <p className="text-lg">{t("wrongdevice.message")}</p>
      </div>
    </div>
  );
};

function App() {
  const { i18n } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();

  const [isBlocked, setIsBlocked] = useState(isMobileDevice());

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsBlocked(isMobileDevice());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="overflow-x-hidden relative">
      <LanguageSwitcher />
      {isBlocked ? <WrongDeviceInline /> : <Outlet />}
    </div>
  );
}

export default App;
