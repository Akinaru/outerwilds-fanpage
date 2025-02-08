import { useEffect, useRef, useState } from 'react';
import DialogBox from '../components/DialogBox';
import { Play, Pause, Volume2 } from 'lucide-react';

import campfire from '../assets/sounds/OW_TH_Campfire_loop_01.wav';
import insects1 from '../assets/sounds/OW_TH_Insects_loop_01.wav';
import insects2 from '../assets/sounds/OW_TH_Insects_loop_02.wav';
import insects3 from '../assets/sounds/OW_TH_Insects_loop_03.wav';

const Test = () => {
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const soundFiles = [
    campfire,
    insects1,
    insects2,
    insects3
  ];

  useEffect(() => {
    soundFiles.forEach((soundFile, index) => {
      const audio = new Audio(soundFile);
      audio.loop = true;
      audio.volume = 0.05;
      audioRefs.current[index] = audio;
    });

    return () => {
      audioRefs.current.forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  const togglePlay = () => {
    if (!isPlaying) {
      audioRefs.current.forEach(audio => {
        if (audio) {
          audio.play().catch(error => {
            console.error('Erreur lors de la lecture:', error);
          });
        }
      });
    } else {
      audioRefs.current.forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div >
      <div className="fixed top-4 right-4 flex items-center gap-2 bg-white/90 p-2 rounded-lg shadow-md">
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {isPlaying ? (
            <>
              <Pause size={20} /> Pause
            </>
          ) : (
            <>
              <Play size={20} /> Jouer
            </>
          )}
        </button>
        <Volume2 size={20} className="text-blue-500" />
      </div>
      <DialogBox />
    </div>
  );
};

export default Test;