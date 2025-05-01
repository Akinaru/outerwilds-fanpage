import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { languages, Language } from '../lang/i18n';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation(['core']);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const switchLanguage = (langCode: Language['code']) => {
    i18n.changeLanguage(langCode).then(() => {
      const newPath = window.location.pathname.replace(/\/(fr|en|de|it)/, `/${langCode}`);
      navigate(newPath);
      setIsOpen(false);
      setShowMessage(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowMessage(false), 3000);
    });
  };

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      const newState = !prev;

      if (newState && showMessage) {
        setShowMessage(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }

      return newState;
    });
  };

  return (
      <div className="fixed bottom-6 right-6 z-[1000] text-white" ref={ref}>
        <div className="relative">
          <AnimatePresence>
            {showMessage && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="absolute bottom-full mb-2 right-0 w-48 custom-border bg-black/80 text-sm text-white px-4 py-2"
                >
                  <span>{t('switchlang')}</span>
                </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="absolute bottom-full mb-2 right-0 w-40 custom-border overflow-hidden"
                >
                  <div>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => !lang.disabled && switchLanguage(lang.code)}
                            className={`w-full px-4 py-2 flex items-center gap-3 transition-opacity ${
                                lang.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-70 cursor-pointer'
                            }`}
                            disabled={lang.disabled}
                        >
                          <span className="flex-shrink-0">{lang.flag}</span>
                          <span className="text-md font-brandon">{lang.name}</span>
                        </button>
                    ))}
                  </div>
                </motion.div>
            )}
          </AnimatePresence>

          <motion.button
              onClick={toggleDropdown}
              className="flex items-center justify-center w-10 h-10 cursor-pointer transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
          >
            <span className="flex-shrink-0">{currentLanguage.flag}</span>
          </motion.button>
        </div>
      </div>
  );
};

export default LanguageSwitcher;