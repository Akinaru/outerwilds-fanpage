import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowImg from '../assets/img/HUD_UI_WhiteArrow_d.png';
import EImg from '../assets/img/Keyboard_Black_E.png';

type RuntimeAction =
  | { type: 'route'; to: string }
  | { type: 'openUrl'; href: string }
  | { type: 'emit'; event: string; payload?: any }
  | { type: 'close' }
  | { type: 'none' };

interface DialogueResponse {
  text: string;
  nextId?: string;
  action?: RuntimeAction;
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
  onAction?: (action: RuntimeAction) => void;
  className?: string;
  navigateSound?: string;
  advanceSound?: string;
}

const DialogBox: React.FC<DialogBoxProps> = ({
  dialogueNodes,
  initialNodeId,
  onDialogueEnd,
  onAction,
  className = "",
  navigateSound,
  advanceSound,
}) => {
  const { t } = useTranslation('dialogue');

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
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentNode: DialogueNode | undefined = dialogueNodes[currentNodeId];
  const typingSpeed: number = 20;

  useEffect(() => {
    if (navigateSound) {
      hoverSoundRef.current = new Audio(navigateSound);
      hoverSoundRef.current.volume = 0.1;
    }
    if (advanceSound) {
      advanceSoundRef.current = new Audio(advanceSound);
      advanceSoundRef.current.volume = 0.1;
    }
    return () => {
      hoverSoundRef.current = null;
      advanceSoundRef.current = null;
    };
  }, [navigateSound, advanceSound]);

  useEffect(() => {
    if (!currentNode) return;

    let isMounted = true;
    setIsTyping(true);
    setShowResponses(false);
    setIsEnded(false);
    setDisplayedText("");
    setActiveIndex(0);

    const fullText = t(currentNode.text);
    let currentIndex = 0;

    if (typingIntervalRef.current !== null) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = window.setInterval(() => {
      if (!isMounted) return;

      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        if (typingIntervalRef.current !== null) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        setIsTyping(false);
        setShowResponses(true);
      }
    }, typingSpeed);

    return () => {
      isMounted = false;
      if (typingIntervalRef.current !== null) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [currentNodeId, t]);

  useEffect(() => {
    if (showResponses) setActiveIndex(0);
  }, [showResponses]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      containerRef.current?.focus();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  // Blocage scroll (Lenis + natif) pendant le dialogue
  useEffect(() => {
    const lenis = (window as any)?.lenis;
    lenis?.stop?.();

    const prevOverflowHtml = document.documentElement.style.overflow;
    const prevOverflowBody = document.body.style.overflow;
    const prevOverscroll = document.documentElement.style.overscrollBehavior;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';

    const prevent = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
    window.addEventListener('wheel', prevent, { passive: false, capture: true });
    window.addEventListener('touchmove', prevent, { passive: false, capture: true });

    return () => {
      lenis?.start?.();
      document.documentElement.style.overflow = prevOverflowHtml;
      document.body.style.overflow = prevOverflowBody;
      document.documentElement.style.overscrollBehavior = prevOverscroll;
      window.removeEventListener('wheel', prevent as any, { capture: true } as any);
      window.removeEventListener('touchmove', prevent as any, { capture: true } as any);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!currentNode) return;

    if (['e', 'E', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (event.key.toLowerCase() === 'e') {
      if (isTyping) {
        skipAnimation();
        return;
      }
      if (!showResponses) return;

      const responses = currentNode.responses || [];
      if (responses.length === 0) {
        handleEndOrAutoNext();
      } else if (responses[activeIndex]) {
        const r = responses[activeIndex];
        handleResponse(r.nextId, r.action);
      }
      playAdvanceDialogSound();
      return;
    }

    if (!showResponses) return;

    const responses = currentNode.responses || [];

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      setIsKeyboardNav(true);
      setActiveIndex(prev =>
        event.key === 'ArrowUp'
          ? prev > 0 ? prev - 1 : responses.length - 1
          : prev < responses.length - 1 ? prev + 1 : 0
      );
      playHoverSound();
    }
  };

  const handleResponse = (nextId?: string, action?: RuntimeAction): void => {
    if (action) {
      onAction?.(action);
      if (action.type === 'close') {
        setIsEnded(true);
        setShowResponses(false);
        setIsVisible(false);
        onDialogueEnd?.();
        return;
      }
    }
    if (nextId && dialogueNodes[nextId]) {
      setIsTyping(true);
      setCurrentNodeId(nextId);
      setShowResponses(false);
    }
  };

  const handleEndOrAutoNext = (): void => {
    if (currentNode?.autoNext) {
      handleResponse(currentNode.autoNext, undefined);
    } else {
      setIsEnded(true);
      setShowResponses(false);
      setIsVisible(false);
      onDialogueEnd?.();
    }
  };

  const skipAnimation = (): void => {
    if (isTyping && currentNode) {
      if (typingIntervalRef.current !== null) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      setDisplayedText(t(currentNode.text));
      setIsTyping(false);
      setShowResponses(true);
    }
  };

  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(() => {});
    }
  };

  const playAdvanceDialogSound = () => {
    if (advanceSoundRef.current) {
      advanceSoundRef.current.currentTime = 0;
      advanceSoundRef.current.play().catch(() => {});
    }
  };

  if (!currentNode) {
    return (
      <div className="text-white fixed inset-0 flex items-center justify-center bg-black">
        <p>⚠️ Dialogue node introuvable: <code>{currentNodeId}</code></p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={`fixed font-brandon select-none inset-0 z-50 ${className}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', touchAction: 'none' }}
    >
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[60%] origin-top w-full">
        <div className={`w-full ${isVisible && !isEnded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pb-6 border-b-3 border-dotted border-orange-500 w-full relative">
              <p className="whitespace-pre-line text-title select-none" style={{ lineHeight: '1.1' }}>{displayedText}</p>
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

            {showResponses && currentNode.responses.length > 0 && (
              <div className="mt-4">
                {currentNode.responses.map((response, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center"
                    onMouseEnter={() => {
                      if (!isKeyboardNav) {
                        setActiveIndex(index);
                        playHoverSound();
                      }
                    }}
                    onMouseMove={() => setIsKeyboardNav(false)}
                  >
                    <div className="w-24">
                      <div className={`flex justify-center items-center gap-2 transition-opacity duration-100 ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                        <img src={EImg} alt="E Shortcut" className="h-8" />
                        <img src={ArrowImg} alt="Arrow" className="h-6" />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleResponse(response.nextId, response.action);
                        playAdvanceDialogSound();
                      }}
                      className="cursor-pointer w-full text-left rounded-lg transition-colors text-normal select-none"
                    >
                      {t(response.text)}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showResponses && currentNode.responses.length === 0 && (
              <button
                onClick={() => {
                  handleEndOrAutoNext();
                  playAdvanceDialogSound();
                }}
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
