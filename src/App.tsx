import { useEffect, useState, useRef } from 'react';
import { useParams, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './lang/i18n';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useCursors } from './hooks/userCursors';

import cursor1 from './assets/cursors/cursor1.webp';
import useLenis from './hooks/useLenis';

const MOBILE_MAX_WIDTH = 768;
const CURSOR_IMAGES = [cursor1];

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
  const userId = useRef<string>(Math.random().toString(36).slice(2));

  useLenis()

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

  const cursors = useCursors(userId.current);

  const getCursorImg = (id: string) => {
    const index = id.charCodeAt(0) % CURSOR_IMAGES.length;
    return CURSOR_IMAGES[index];
  };

  return (
    <div className="overflow-x-hidden relative">
      <LanguageSwitcher />

      {!isBlocked && Object.values(cursors).map(cursor => (
        <img
          key={cursor.id}
          src={getCursorImg(cursor.id)}
          className="fixed w-6 h-6 pointer-events-none z-[999]"
          style={{ top: cursor.y, left: cursor.x, transform: 'translate(-50%, -50%)' }}
          alt="cursor"
        />
      ))}

      {isBlocked ? <WrongDeviceInline /> : <Outlet />}
    </div>
  );
}

export default App;
