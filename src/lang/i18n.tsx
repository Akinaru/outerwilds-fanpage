import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ✅ Langues et namespaces
const namespaces = ['translation', 'core', 'dialogue'] as const;

export interface Language {
    code: string;
    name: string;
    flag: JSX.Element;
    disabled?: boolean;
    fallback?: boolean;
}

export const languages: Language[] = [
    {
        code: 'fr',
        name: 'Français',
        flag: (
            <svg className="w-5 h-5" viewBox="0 0 640 480">
                <g fillRule="evenodd" strokeWidth="1pt">
                    <path fill="#fff" d="M0 0h640v480H0z" />
                    <path fill="#00267f" d="M0 0h213.3v480H0z" />
                    <path fill="#f31830" d="M426.7 0H640v480H426.7z" />
                </g>
            </svg>
        ),
        fallback: true,
    },
    {
        code: 'en',
        name: 'English',
        flag: (
            <svg className="w-5 h-5" viewBox="0 0 60 30">
                <rect width="60" height="30" fill="#00247d" />
                <path fill="#fff" d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6" />
                <path fill="#cf142b" d="M0 0 L60 30 M60 0 L0 30" stroke="#cf142b" strokeWidth="4" />
                <rect x="25" width="10" height="30" fill="#fff" />
                <rect y="10" width="60" height="10" fill="#fff" />
                <rect x="27" width="6" height="30" fill="#cf142b" />
                <rect y="12" width="60" height="6" fill="#cf142b" />
            </svg>
        ),
    },
];

// ✅ On filtre uniquement les langues actives
export const activeLanguages = languages.filter(l => !l.disabled).map(l => l.code);

// ✅ Détermination de la langue fallback
export const fallbackLanguage = languages.find(l => l.fallback)?.code || activeLanguages[0] || 'fr';

// ✅ Chargement des fichiers JSON présents dans /lang/
const files = import.meta.glob('./*/*.json', { eager: true }) as Record<string, { default: any }>;

// ✅ Construction des ressources dynamiques uniquement pour les langues actives
const resources: Record<string, Record<string, any>> = {};

activeLanguages.forEach((lang) => {
    resources[lang] = {};

    namespaces.forEach((ns) => {
        const matchKey = `./${lang}/${ns}.json`;
        const file = files[matchKey];

        if (file?.default) {
            resources[lang][ns] = file.default;
        } else {
            console.warn(`⚠️ Missing translation file: ${matchKey}`);
        }
    });
});

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: fallbackLanguage,
    defaultNS: 'translation',
    ns: namespaces,
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
