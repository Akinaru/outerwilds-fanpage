import { useState, useEffect } from 'react';
import Logo from '../assets/img/outer_wilds_logo.png';
import Separator from '../assets/img/separator_main_menu.svg';
import ArrowImg from '../assets/img/HUD_UI_WhiteArrow_d_Hover.png';
import DialogBox from '../components/DialogBox';
import { creditsDialogue } from '../dialogues/credits';
import { eoteDialogue } from '../dialogues/echoOfTheYes';
import { optionsDialogue } from '../dialogues/options';
import { useTranslation } from 'react-i18next';
import { usePageTransition } from '../providers/TransitionProvider';

// Fonds
import StarsOnlyImg from '../assets/img/backgrounds/mainmenu_starsonly.png';
import PlanetImg from '../assets/img/backgrounds/mainmenu.png';

const MainMenu = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);

  const [showCredits, setShowCredits] = useState(false);
  const [showEOTE, setShowEOTE] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // --- Animations d'apparition ---
  // Les étoiles sont visibles immédiatement (pas d'état).
  const [planetVisible, setPlanetVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const { t } = useTranslation();
  const { navigateWithTransition } = usePageTransition();

  const menuItems = [
    {
      label: 'mainmenu.play',
      action: () => navigateWithTransition('/home'),
    },
    {
      label: 'mainmenu.dlc',
      action: () => setShowEOTE(true),
    },
    {
      label: 'mainmenu.options',
      action: () => setShowOptions(true),
    },
    {
      label: 'mainmenu.help',
      action: () => {
        // navigateWithTransition('/help')
      },
    },
    {
      label: 'mainmenu.credits',
      action: () => setShowCredits(true),
    },
    {
      label: 'mainmenu.playground',
      action: () => navigateWithTransition('/playground'),
    },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setPlanetVisible(true), 1000);
    const t2 = setTimeout(() => setContentVisible(true), 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="min-h-screen text-white bg-black flex items-center relative overflow-hidden">

      {/* Couche 1 : étoiles visibles immédiatement */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-bottom opacity-100"
        style={{ backgroundImage: `url(${StarsOnlyImg})` }}
      />

      {/* Couche 2 : planète qui apparaît en fondu (plus lent) */}
      <div
        className={`absolute inset-0 z-0 bg-cover bg-no-repeat bg-bottom transition-opacity ${planetVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundImage: `url(${PlanetImg})`,
          transition: 'opacity 2000ms ease', // <- fondu plus lent
        }}
      />

      {/* Contenu (logo + options) : apparaît après la planète (plus lent) */}
      <div
        className={`pl-26 z-10 transition-opacity ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 2000ms ease' }} // <- fondu plus lent
      >
        <div className="inline-block">
          <div className="flex items-start justify-start">
            <img src={Logo} alt="Outer Wilds" className="pb-16 object-contain w-[32rem]" />
          </div>
          <div>
            <img src={Separator} alt="Outer Wilds" className="object-contain w-[32rem]" />
          </div>
          <div className="flex items-start justify-center">
            <div className="select-none tracking-widest uppercase font-serif-gothic flex items-start justify-start flex-col text-4xl py-24 gap-2 ">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="w-full relative cursor-pointer"
                  onMouseEnter={() => {
                    if (!isKeyboardNav && !showCredits) {
                      setActiveIndex(index);
                    }
                  }}
                  onMouseMove={() => setIsKeyboardNav(false)}
                  onClick={() => {
                    if (!showCredits) {
                      item.action();
                    }
                  }}
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-15">
                    <div className={`transition-opacity duration-100 ${activeIndex === index && !showCredits ? 'opacity-100' : 'opacity-0'}`}>
                      <img src={ArrowImg} alt="Arrow" className="h-5" />
                    </div>
                  </div>
                  <p className={`text-center w-full transition-colors duration-100 ${activeIndex === index && !showCredits ? 'text-[#FCDCC4]' : 'text-orange'}`}>
                    {t(item.label)}
                  </p>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-15">
                    <div className={`transition-opacity duration-100 ${activeIndex === index && !showCredits ? 'opacity-100' : 'opacity-0'}`}>
                      <img src={ArrowImg} alt="Arrow" className="h-5 transform rotate-180" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img src={Separator} alt="Outer Wilds" className="object-contain w-[32rem]" />
          </div>
        </div>
      </div>

      {showCredits && (
        <DialogBox
          dialogueNodes={creditsDialogue}
          initialNodeId="start"
          onDialogueEnd={() => setShowCredits(false)}
        />
      )}
      {showEOTE && (
        <DialogBox
          dialogueNodes={eoteDialogue}
          initialNodeId="start"
          onDialogueEnd={() => setShowEOTE(false)}
        />
      )}
      {showOptions && (
        <DialogBox
          dialogueNodes={optionsDialogue}
          initialNodeId="start"
          onDialogueEnd={() => setShowOptions(false)}
        />
      )}
    </div>
  );
};

export default MainMenu;
