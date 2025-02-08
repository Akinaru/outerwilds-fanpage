import { useState, useEffect, useRef } from 'react';
import ArrowImg from '../assets/img/HUD_UI_WhiteArrow_d.png';
import EImg from '../assets/img/Keyboard_Black_E.png';

// Types
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

interface DialogBoxProps {
  dialogueNodes: DialogueNodes;
  initialNodeId: string;
  onDialogueEnd?: () => void;
  className?: string;
  navigateSound?: string;
  advanceSound?: string;
}

const DialogBox: React.FC<DialogBoxProps> = ({
  dialogueNodes,
  initialNodeId,
  onDialogueEnd,
  className = "",
  navigateSound,
  advanceSound,
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(initialNodeId);
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [showResponses, setShowResponses] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isKeyboardNav, setIsKeyboardNav] = useState<boolean>(false);
  
  const typingIntervalRef = useRef<number | null>(null);
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const advanceSoundRef = useRef<HTMLAudioElement | null>(null);
  const currentNode: DialogueNode = dialogueNodes[currentNodeId];
  const typingSpeed: number = 20;

  useEffect(() => {
    if (navigateSound) {
      hoverSoundRef.current = new Audio(navigateSound);
      hoverSoundRef.current.volume = 0.10;
    }

    if (advanceSound) {
      advanceSoundRef.current = new Audio(advanceSound);
      advanceSoundRef.current.volume = 0.10;
    }

    return () => {
      hoverSoundRef.current = null;
      advanceSoundRef.current = null;
    };
  }, [navigateSound, advanceSound]);

  useEffect(() => {
    let isMounted: boolean = true;
    setIsTyping(true);
    setShowResponses(false);
    setIsEnded(false);
    setDisplayedText("");
    setActiveIndex(0);
    
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
  }, [currentNodeId, currentNode.text]);

  useEffect(() => {
    if (showResponses) {
      setActiveIndex(0);
    }
  }, [showResponses]);

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
        } else if (responses[activeIndex]) {
          handleResponseClick(responses[activeIndex].nextId);
        }
        playAdvanceDialogSound();
        return;
      }

      if (!showResponses || !currentNode) return;
      const responses = currentNode.responses || [];
      const responseCount = responses.length;

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        setIsKeyboardNav(true);
        if (event.key === 'ArrowUp') {
          setActiveIndex(prev => prev > 0 ? prev - 1 : Math.max(responseCount - 1, 0));
        } else {
          setActiveIndex(prev => prev < responseCount - 1 ? prev + 1 : 0);
        }
        playHoverSound();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showResponses, activeIndex, currentNode]);

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
      onDialogueEnd?.();
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
    <div className={`fixed font-brandon inset-0 z-50 ${className}`} style={{backgroundColor: 'rgba(0, 0, 0, 0.85)'}}>
    <div className="absolute left-1/2 transform -translate-x-1/2 top-[60%] origin-top w-full">
      <div className={`w-full ${isVisible && !isEnded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pb-6 border-b-3 border-dotted border-orange-500 w-full relative">
              <p className="whitespace-pre-line text-title" style={{lineHeight: '1.1'}}>{displayedText}</p>
              {isTyping && (
                <div className="absolute right-0 bottom-0 transform translate-y-full">
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
              <div className="mt-4">
                {currentNode.responses.map((response: DialogueResponse, index: number) => (
                  <div 
                    className="flex justify-center items-center"
                    key={index}
                    onMouseEnter={() => {
                      if (!isKeyboardNav) {
                        setActiveIndex(index);
                        playHoverSound();
                      }
                    }}
                    onMouseMove={() => {
                      setIsKeyboardNav(false);
                    }}
                  >
                    <div className="w-24">
                      <div className={`flex justify-center items-center gap-2 transition-opacity duration-100 ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}>
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
            )}

            {showResponses && currentNode.responses.length === 0 && (
              <button
                onClick={() => {handleEndOrAutoNext(); playAdvanceDialogSound();}}
                className="w-full flex justify-end rounded-lg transition-colors cursor-pointer mb-24"
              >
                <img 
                  src={EImg} 
                  alt="E Shortcut" 
                  className="h-8 mt-6"
                  onLoad={(e) => {
                    setTimeout(() => {
                      (e.target as HTMLImageElement).style.opacity = '1';
                    }, 5);
                  }} 
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;