
import React, { useEffect, useRef } from 'react';
import { getGeminiTTS, playAudioBuffer } from '../services/geminiService';

interface SplashProps {
  onComplete: () => void;
}

const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const hasSpoken = useRef(false);
  const motto = "Disability is reality for me but possibility for you";

  useEffect(() => {
    const initSplash = async () => {
      if (!hasSpoken.current) {
        hasSpoken.current = true;
        const audio = await getGeminiTTS(motto);
        if (audio) await playAudioBuffer(audio);
      }
      setTimeout(onComplete, 4500);
    };
    initSplash();
  }, [onComplete]);

  return (
    <div className="h-screen w-full bg-blue-900 flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-12">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
           <span className="text-5xl font-bold text-blue-900">B</span>
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter mb-2">BleNe</h1>
        <p className="text-blue-200 uppercase tracking-widest text-sm font-semibold">Ethiopia Accessibility</p>
      </div>
      
      <div className="bg-yellow-400 p-8 rounded-2xl shadow-xl transform rotate-1">
        <p className="text-3xl font-bold text-blue-900 leading-tight">
          "{motto}"
        </p>
      </div>
      
      <div className="absolute bottom-12 text-white/50 text-xs animate-bounce">
        Starting application...
      </div>
    </div>
  );
};

export default Splash;
