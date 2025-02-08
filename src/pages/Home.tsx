import React, { useState, useEffect } from 'react';
import Logo from '../assets/img/outer_wilds_logo.png';
import Separator from '../assets/img/separator_main_menu.svg';
import ArrowImg from '../assets/img/HUD_UI_WhiteArrow_d_Hover.png';

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);

  const menuItems = [
    'Reprendre l\'expédition',
    'Nouvelle expédition',
    'options',
    'crédits',
    'quitter'
  ];

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        setIsKeyboardNav(true);
        
        if (event.key === 'ArrowUp') {
          setActiveIndex(prev => prev > 0 ? prev - 1 : menuItems.length - 1);
        } else {
          setActiveIndex(prev => prev < menuItems.length - 1 ? prev + 1 : 0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [menuItems.length]);

  return (
    <div className="bg-black min-h-screen text-white flex items-center">
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
                  className="w-full relative"
                  onMouseEnter={() => {
                    if (!isKeyboardNav) {
                      setActiveIndex(index);
                    }
                  }}
                  onMouseMove={() => setIsKeyboardNav(false)}
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-15">
                    <div className={`transition-opacity duration-100 ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                      <img src={ArrowImg} alt="Arrow" className="h-5" />
                    </div>
                  </div>
                  <p className={`cursor-pointer text-center w-full transition-colors duration-100 ${activeIndex === index ? 'text-[#FCDCC4]' : 'text-orange'}`}>
                    {item}
                  </p>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-15">
                    <div className={`transition-opacity duration-100 ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}>
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
    </div>
  );
};

export default Home;