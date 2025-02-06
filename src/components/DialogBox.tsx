import { useState, useEffect, useRef } from 'react';
import ArrowImg from '../assets/img/HUD_UI_WhiteArrow_d.png';
import EImg from '../assets/img/Keyboard_Black_E.png';
import navigateSound from '../assets/sounds/UI_Navigate_03.wav';
import advanceDialogSound from '../assets/sounds/UI_Advance_Dialog_V6-002_highpass.wav';

interface DialogueResponse {
  text: string;
  nextId: string;
}

interface DialogueNode {
  text: string;
  responses: DialogueResponse[];
  autoNext?: string;
}

interface DialogueNodes {
  [key: string]: DialogueNode;
}

const dialogueNodes: DialogueNodes = {
    "start": {
      text: "Bienvenue, explorateur spatial ! *ajuste ses instruments de mesure* Je suis là pour répondre à tes questions sur ce mystérieux projet.",
      responses: [
        {
          text: "Parle-moi du jeu qui t'inspire.",
          nextId: "about_game"
        },
        {
          text: "Quand est-ce que cette page sera disponible ?",
          nextId: "about_release"
        },
        {
          text: "Qui est derrière ce projet ?",
          nextId: "about_creator"
        },
        {
          text: "Je dois y aller.",
          nextId: "goodbye"
        }
      ]
    },
    "ask_more": {
      text: "Ah, tu as d'autres questions ? *sourit* Je suis toujours ravi de partager mes connaissances !",
      responses: [
        {
          text: "Parle-moi du jeu qui t'inspire.",
          nextId: "about_game"
        },
        {
          text: "Quand est-ce que cette page sera disponible ?",
          nextId: "about_release"
        },
        {
          text: "Qui est derrière ce projet ?",
          nextId: "about_creator"
        },
        {
          text: "Je dois y aller.",
          nextId: "goodbye"
        }
      ]
    },
    "about_game": {
      text: "Ah, quelle aventure fascinante... *regarde les étoiles avec nostalgie* Un jeu d'exploration spatiale où la curiosité et la persévérance sont tes meilleurs alliés.",
      responses: [],
      autoNext: "about_game_2"
    },
    "about_game_2": {
      text: "Une boucle temporelle mystérieuse, des secrets à découvrir, et surtout... la liberté d'explorer à ton rythme. *pointe vers une constellation* Chaque découverte te rapproche un peu plus des mystères de l'univers.",
      responses: [
        {
          text: "J'ai une autre question.",
          nextId: "ask_more"
        },
        {
          text: "Je dois partir.",
          nextId: "goodbye"
        }
      ]
    },
    "about_release": {
      text: "Les astres ne m'ont pas encore révélé la date exacte... *consulte ses notes* Mais comme tout bon projet d'exploration spatiale, il faut du temps pour s'assurer que chaque détail soit parfait. La patience est la clé des grandes découvertes !",
      responses: [
        {
          text: "J'ai une autre question.",
          nextId: "ask_more"
        },
        {
          text: "Je dois partir.",
          nextId: "goodbye"
        }
      ]
    },
    "about_creator": {
      text: "Un passionné d'exploration et de mystères... *ajuste son télescope* Quelqu'un qui, comme toi, est fasciné par les secrets de l'univers et souhaite partager cette fascination avec d'autres voyageurs des étoiles.",
      responses: [
        {
          text: "Non, je veux vraiment savoir qui tu es !",
          nextId: "about_creator_insist"
        },
        {
          text: "J'ai une autre question.",
          nextId: "ask_more"
        },
        {
          text: "Je dois partir.",
          nextId: "goodbye"
        }
      ]
    },
    "about_creator_insist": {
      text: "*fait un clin d'œil complice* Eh bien, puisque tu insistes... On m'appelle Aki. Si tu veux me contacter, tu peux m'envoyer un signal à maxime@gallotta.fr.",
      responses: [
        {
          text: "J'ai une autre question.",
          nextId: "ask_more"
        },
        {
          text: "Je dois partir.",
          nextId: "goodbye"
        }
      ]
    },
    "goodbye": {
      text: "Que les étoiles illuminent ton chemin, voyageur. *range son carnet de notes* J'espère te revoir bientôt dans l'immensité de l'espace !",
      responses: []
    }
  };

const DialogBox: React.FC = () => {
    const [currentNodeId, setCurrentNodeId] = useState<string>("start");
    const [displayedText, setDisplayedText] = useState<string>("");
    const [isTyping, setIsTyping] = useState<boolean>(true);
    const [showResponses, setShowResponses] = useState<boolean>(false);
    const [isEnded, setIsEnded] = useState<boolean>(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(true);
    
    const typingIntervalRef = useRef<number | null>(null);
    const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
    const advanceSoundRef = useRef<HTMLAudioElement | null>(null);
    const currentNode: DialogueNode = dialogueNodes[currentNodeId];
    const typingSpeed: number = 20;
  
    useEffect(() => {
      hoverSoundRef.current = new Audio(navigateSound);
      hoverSoundRef.current.volume = 0.10;
  
      return () => {
        if (hoverSoundRef.current) {
          hoverSoundRef.current = null;
        }
      };
    }, []);

    useEffect(() => {
      advanceSoundRef.current = new Audio(advanceDialogSound);
      advanceSoundRef.current.volume = 0.10;
  
      return () => {
        if (advanceSoundRef.current) {
          advanceSoundRef.current = null;
        }
      };
    }, []);
  
    useEffect(() => {
      let isMounted: boolean = true;
      setIsTyping(true);
      setShowResponses(false);
      setIsEnded(false);
      setDisplayedText("");
      setSelectedIndex(0);
      
      const text: string = currentNode.text;
      let currentIndex: number = 0;
      
      typingIntervalRef.current = window.setInterval(() => {
        if (!isMounted || !isTyping) return;
  
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          if (typingIntervalRef.current !== null) {
            clearInterval(typingIntervalRef.current);
          }
          setIsTyping(false);
          setShowResponses(true);
        }
      }, typingSpeed);
  
      return () => {
        isMounted = false;
        if (typingIntervalRef.current !== null) {
          clearInterval(typingIntervalRef.current);
        }
      };
    }, [currentNodeId]);

    useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key.toLowerCase() === 'e') {
          event.preventDefault();
          if (isTyping) {
            skipAnimation();
            return;
          }
          if (!showResponses || !currentNode) return;
          const responses = currentNode.responses || [];
          const responseCount = responses.length;
          if (responseCount === 0) {
            handleEndOrAutoNext();
          } else if (responses[selectedIndex]) {
            handleResponseClick(responses[selectedIndex].nextId);
          }
          playAdvanceDialogSound();
          return;
        }

        if (!showResponses || !currentNode) return;
        const responses = currentNode.responses || [];
        const responseCount = responses.length;

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSelectedIndex(prev => {
            const newIndex = prev > 0 ? prev - 1 : Math.max(responseCount - 1, 0);
            playHoverSound();
            return newIndex;
          });
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSelectedIndex(prev => {
            const newIndex = prev < responseCount - 1 ? prev + 1 : 0;
            playHoverSound();
            return newIndex;
          });
        } else if (event.key.toLowerCase() === 'e') {
          event.preventDefault();
          if (responseCount === 0) {
            handleEndOrAutoNext();
          } else if (responses[selectedIndex]) {
            handleResponseClick(responses[selectedIndex].nextId);
          }
          playAdvanceDialogSound();
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showResponses, selectedIndex, currentNode]);
  
    const handleResponseClick = (nextId: string): void => {
      setIsTyping(true);
      setCurrentNodeId(nextId);
      setShowResponses(false);
    };
  
    const handleEndOrAutoNext = (): void => {
      if (currentNode.autoNext) {
        handleResponseClick(currentNode.autoNext);
      } else {
        setIsEnded(true);
        setShowResponses(false);
        setIsVisible(false);
      }
    };

    const skipAnimation = (): void => {
      if (isTyping) {
        if (typingIntervalRef.current !== null) {
          clearInterval(typingIntervalRef.current);
        }
        setDisplayedText(currentNode.text);
        setIsTyping(false);
        setShowResponses(true);
      }
    };

    const playHoverSound = () => {
      if (hoverSoundRef.current) {
        hoverSoundRef.current.currentTime = 0;
        hoverSoundRef.current.play().catch(error => console.log('Erreur de lecture audio:', error));
      }
    };

    const playAdvanceDialogSound = () => {
      if (advanceSoundRef.current) {
        advanceSoundRef.current.currentTime = 0;
        advanceSoundRef.current.play().catch(error => console.log('Erreur de lecture audio:', error));
      }
    };

    return (
      <div className="font-brandon bg-black min-h-screen text-white">
        <div className="fixed left-1/2 transform -translate-x-1/2 top-[60%] origin-top w-full">
          <div className={`w-full ${isVisible && !isEnded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="pb-6 border-b-3 border-dotted border-orange-500 w-full relative">
                <p className="whitespace-pre-line text-title" style={{lineHeight: '1.1'}}>{displayedText}</p>
                {isTyping && (
                  <div className="absolute right-0 bottom-0 transform translate-y-full ">
                    <img 
                        src={EImg} 
                        alt="E Shortcut" 
                        className="h-8 mt-6 transition-all duration-200 opacity-0"
                        onLoad={(e) => {
                            setTimeout(() => {
                                (e.target as HTMLImageElement).style.opacity = '1';
                            }, 5);
                        }}
                        />
                    </div>
                )}
              </div>

              {showResponses && (
                <div className="">
                    <div className='mt-4'>
                        {currentNode.responses.map((response: DialogueResponse, index: number) => (
                            <div 
                            className="flex justify-center items-center"
                            key={index}
                            onMouseEnter={() => {
                                setHoveredIndex(index);
                                setSelectedIndex(index);
                                playHoverSound();
                            }}
                            onMouseLeave={() => setHoveredIndex(null)}
                            >
                            <div className="w-24">
                                <div className={`flex justify-center items-center gap-2 transition-opacity duration-100 ${(hoveredIndex === index || selectedIndex === index) ? 'opacity-100' : 'opacity-0'}`}>
                                <img src={EImg} alt="E Shortcut" className="h-8" />
                                <img src={ArrowImg} alt="Arrow" className="h-6" />
                                </div>
                            </div>
                            <button
                                onClick={() => {handleResponseClick(response.nextId); playAdvanceDialogSound();}}
                                className="cursor-pointer w-full text-left rounded-lg transition-colors text-normal"
                            >
                                {response.text}
                            </button>
                            </div>
                        ))}
                    </div>

                  {currentNode.responses.length === 0 && (
                    <button
                      onClick={() => {handleEndOrAutoNext(); playAdvanceDialogSound();}}
                      className="w-full flex justify-end rounded-lg transition-colors cursor-pointer mb-24"
                    >
                      <img src={EImg} alt="E Shortcut" className="h-8 mt-6"
                       onLoad={(e) => {
                        setTimeout(() => {
                          (e.target as HTMLImageElement).style.opacity = '1';
                        }, 5);
                      }} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default DialogBox;