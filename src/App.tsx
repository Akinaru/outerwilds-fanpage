import { useState, useEffect, useRef } from 'react';

// Types definitions
interface DialogueResponse {
  text: string;
  nextId: string;
}

interface DialogueNode {
  text: string;
  responses: DialogueResponse[];
}

interface DialogueNodes {
  [key: string]: DialogueNode;
}

// Structure des dialogues
const dialogueNodes: DialogueNodes = {
  "start": {
    text: "Salutations, voyageur des étoiles ! *ajuste son casque* Tu tombes bien, je faisais des observations fascinantes sur l'œil quantique. Salutations, voyageur des étoiles ! *ajuste son casque* Tu tombes bien, je faisais des observations fascinantes sur l'œil quantique.",
    responses: [
      {
        text: "L'œil quantique ? Qu'est-ce que c'est ?",
        nextId: "quantum_eye"
      },
      {
        text: "Je cherche des informations sur les Nomaï.",
        nextId: "nomai_info"
      },
      {
        text: "Désolé, je dois partir.",
        nextId: "goodbye"
      }
    ]
  },
  "quantum_eye": {
    text: "Ah, l'œil quantique ! Le plus grand mystère de notre système solaire. Les Nomaï le cherchaient déjà... *regarde les étoiles* C'est ce qui les a amenés ici en premier lieu.",
    responses: [
      {
        text: "Pourquoi les Nomaï le cherchaient-ils ?",
        nextId: "nomai_search"
      },
      {
        text: "Je préfère parler d'autre chose.",
        nextId: "start"
      }
    ]
  },
  "nomai_info": {
    text: "Les Nomaï... *soupire* Une civilisation brillante. Leurs écrits sont partout dans le système solaire, si tu sais où chercher. Leurs technologies défient encore notre compréhension.",
    responses: [
      {
        text: "Où puis-je trouver leurs écrits ?",
        nextId: "nomai_writings"
      },
      {
        text: "Revenons à l'œil quantique.",
        nextId: "quantum_eye"
      }
    ]
  },
  "nomai_writings": {
    text: "Leurs écrits spiralés ornent les murs de chaque planète. Mais attention aux dangers qui t'attendent... *sort son traducteur* Tu auras besoin d'un de ces appareils pour les comprendre.",
    responses: []
  },
  "nomai_search": {
    text: "Une excellente question... *consulte ses notes* Selon leurs écrits, ils ont détecté un signal plus ancien que l'univers lui-même. Fascinant, n'est-ce pas ?",
    responses: []
  },
  "goodbye": {
    text: "Que les étoiles guident ton chemin, voyageur. *salue de la main* N'oublie pas de vérifier ton niveau d'oxygène !",
    responses: []
  }
};

const App: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string>("start");
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [showResponses, setShowResponses] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  
  const typingIntervalRef = useRef<number | null>(null);
  const currentNode: DialogueNode = dialogueNodes[currentNodeId];
  const typingSpeed: number = 30; // ms par caractère

  useEffect(() => {
    let isMounted: boolean = true;
    setIsTyping(true);
    setShowResponses(false);
    setIsEnded(false);
    setDisplayedText("");
    
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

  const handleResponseClick = (nextId: string): void => {
    setShowResponses(false);
    setIsTyping(true);
    setCurrentNodeId(nextId);
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

  return (
    <div className="font-brandon bg-red max-w-2xl mx-auto p-4 bg-gray-900 min-h-screen text-white">
      <div style={{ fontFamily: 'Brandon Grotesque' }}>
        Test de la police
      </div>
      <h1 className="font-brandon text-2xl mb-8 text-cyan-400">OuterWilds - Dialogue</h1>
      
      {/* Dialogue Box */}
      <div 
        className="bg-gray-800 p-6 rounded-lg mb-4 cursor-pointer min-h-[100px]" 
        onClick={skipAnimation}
      >
        <p className="whitespace-pre-line">{displayedText}</p>
      </div>

      {/* Response Options */}
      {showResponses && (
        <div className="space-y-2">
          {currentNode.responses.map((response: DialogueResponse, index: number) => (
            <button
              key={index}
              onClick={() => handleResponseClick(response.nextId)}
              className="cursor-pointer w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              {response.text}
            </button>
          ))}
          {currentNode.responses.length === 0 && (
            <button
              onClick={() => {
                setIsEnded(true);
                setShowResponses(false);
              }}
              className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              [Fermer]
            </button>
          )}
        </div>
      )}
      
      {/* Debug Section */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg text-sm">
        <h2 className="text-cyan-400 mb-2">Debug Info:</h2>
        <div className="grid grid-cols-2 gap-2">
          <div>Current Node: <span className="text-yellow-400">{currentNodeId}</span></div>
          <div>Is Typing: <span className="text-yellow-400">{isTyping ? "Yes" : "No"}</span></div>
          <div>Show Responses: <span className="text-yellow-400">{showResponses ? "Yes" : "No"}</span></div>
          <div>State: <span className="text-yellow-400">
            {isEnded ? "Ended" : (isTyping ? "Typing..." : (showResponses ? "Waiting for response" : "Transitioning"))}
          </span></div>
          <div>Text Length: <span className="text-yellow-400">{displayedText.length}/{currentNode.text.length}</span></div>
          <div>Dialogue Status: <span className={`${isEnded ? "text-red-400" : "text-green-400"}`}>
            {isEnded ? "ENDED" : "ACTIVE"}
          </span></div>
        </div>
      </div>
    </div>
  );
};

export default App;