import { useState, useEffect } from 'react';
import Logo from '../assets/img/outer_wilds_logo.png';
import Separator from '../assets/img/separator_main_menu.svg';
import ArrowImg from '../assets/img/HUD_UI_WhiteArrow_d_Hover.png';
import DialogBox from '../components/DialogBox';
import { creditsDialogue } from '../dialogues/credits';
import { eoteDialogue } from '../dialogues/echoOfTheYes';
import { optionsDialogue } from '../dialogues/options';

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);

  //Dialogs
  const [showCredits, setShowCredits] = useState(false);
  const [showEOTE, setShowEOTE] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const menuItems = [
    'Reprendre l\'expédition',
    'Echoes of the Eye',
    'options',
    'crédits',
  ];

  useEffect(() => {
    const handleKeyPress = (event: { key: string; preventDefault: () => void; }) => {
      if (!showCredits && !showEOTE && !showOptions && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
        event.preventDefault();
        setIsKeyboardNav(true);
        
        if (event.key === 'ArrowUp') {
          setActiveIndex(prev => prev > 0 ? prev - 1 : menuItems.length - 1);
        } else {
          setActiveIndex(prev => prev < menuItems.length - 1 ? prev + 1 : 0);
        }
      } else if (!showCredits && !showEOTE && !showOptions && event.key === 'Enter') {
        handleMenuItemClick(activeIndex);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [menuItems.length, activeIndex, showCredits, showEOTE]);

  const handleMenuItemClick = (index: number) => {
    console.log(menuItems[index]);
    if (menuItems[index].toLowerCase() === 'crédits') {
      setShowCredits(true);
    }
    if (menuItems[index] === 'Echoes of the Eye') {
      setShowEOTE(true);
    }
    if (menuItems[index] === 'options') {
      setShowOptions(true);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white flex items-center relative">
      <div className="pl-26">
        <div className='inline-block'>
          <div className='flex items-start justify-start'>
            <img src={Logo} alt="Outer Wilds" className='pb-16 object-contain w-[32rem]' />
          </div>
          <div>
            <img src={Separator} alt="Outer Wilds" className='object-contain w-[32rem]' />
          </div>
          <div className='flex items-start justify-center'>
            <div className='tracking-widest uppercase font-serif-gothic flex items-start justify-start flex-col text-4xl py-24 gap-2'>
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
                  onClick={() => !showCredits && handleMenuItemClick(index)}
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-15">
                    <div className={`transition-opacity duration-100 ${activeIndex === index && !showCredits ? 'opacity-100' : 'opacity-0'}`}>
                      <img src={ArrowImg} alt="Arrow" className="h-5" />
                    </div>
                  </div>
                  <p className={`text-center w-full transition-colors duration-100 ${activeIndex === index && !showCredits ? 'text-[#FCDCC4]' : 'text-orange'}`}>
                    {item}
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
            <img src={Separator} alt="Outer Wilds" className='object-contain w-[32rem]' />
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

export default Home;