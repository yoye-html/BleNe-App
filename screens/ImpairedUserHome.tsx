
import React, { useState, useCallback, useRef } from 'react';
import { User, HelpRequest, RequestStatus } from '../types';
import { getGeminiTTS, playAudioBuffer, generalizeRequest } from '../services/geminiService';

interface ImpairedUserHomeProps {
  user: User;
  activeRequest: HelpRequest | null;
  setActiveRequest: (req: HelpRequest | null) => void;
}

const ImpairedUserHome: React.FC<ImpairedUserHomeProps> = ({ user, activeRequest, setActiveRequest }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [stage, setStage] = useState<'IDLE' | 'LISTENING' | 'CONFIRMING' | 'WAITING'>('IDLE');
  const recognitionRef = useRef<any>(null);

  const startVoiceCapture = useCallback(async () => {
    setStage('LISTENING');
    setIsListening(true);
    
    const audio = await getGeminiTTS("How can we help you today? Please speak your request.");
    if (audio) await playAudioBuffer(audio);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setStage('CONFIRMING');
      const confirmAudio = await getGeminiTTS(`You said: ${text}. Is this correct? Tap the top half of the screen for yes, or the bottom half to try again.`);
      if (confirmAudio) playAudioBuffer(confirmAudio);
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const confirmRequest = async () => {
    setStage('WAITING');
    const waitAudio = await getGeminiTTS("Sending your request to nearby volunteers. Please stay where you are.");
    if (waitAudio) playAudioBuffer(waitAudio);

    // Mock dynamic consent for location
    const genDesc = await generalizeRequest(transcript);

    const newRequest: HelpRequest = {
      id: `req-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      description: transcript,
      generalizedDescription: genDesc,
      location: { lat: 9.03, lng: 38.74, address: 'Near National Stadium' },
      status: RequestStatus.PENDING,
      createdAt: Date.now()
    };
    setActiveRequest(newRequest);
  };

  const cancelAndReset = () => {
    setStage('IDLE');
    setTranscript('');
    setActiveRequest(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      {/* Visual Header */}
      <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">BleNe</h1>
          <p className="opacity-80 font-bold">Safe & Assisted</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
          👤
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {stage === 'IDLE' && (
          <button
            onClick={startVoiceCapture}
            className="flex-1 w-full bg-blue-100 flex flex-col items-center justify-center p-12 gap-8 active:bg-blue-200 accessible-focus transition-colors"
          >
            <div className="w-48 h-48 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
               <span className="text-8xl">🎙️</span>
            </div>
            <span className="text-5xl font-black text-blue-900 text-center uppercase tracking-tight">Need Help?</span>
            <span className="text-xl text-blue-700 font-bold">Tap anywhere to start</span>
          </button>
        )}

        {stage === 'LISTENING' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-emerald-500 text-white text-center gap-6">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center animate-ping">
              <span className="text-5xl">👂</span>
            </div>
            <h2 className="text-4xl font-black">Listening...</h2>
            <p className="text-2xl font-bold opacity-90">Describe your situation clearly</p>
          </div>
        )}

        {stage === 'CONFIRMING' && (
          <div className="flex-1 flex flex-col">
            <button 
              onClick={confirmRequest}
              className="flex-1 bg-emerald-600 text-white flex flex-col items-center justify-center p-6 accessible-focus active:bg-emerald-700"
            >
              <span className="text-7xl mb-4">✅</span>
              <span className="text-4xl font-black">YES, SEND</span>
              <p className="text-lg mt-2 opacity-80 text-center">"{transcript}"</p>
            </button>
            <button 
              onClick={() => setStage('IDLE')}
              className="h-1/3 bg-red-600 text-white flex flex-col items-center justify-center p-6 accessible-focus border-t-8 border-white active:bg-red-700"
            >
              <span className="text-4xl mb-2">❌</span>
              <span className="text-2xl font-black uppercase">RETRY</span>
            </button>
          </div>
        )}

        {stage === 'WAITING' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-blue-900 text-white text-center gap-8">
            <div className="relative">
              <div className="w-40 h-40 border-8 border-blue-400 border-t-white rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-5xl animate-bounce">🆘</span>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-black mb-4">Searching...</h2>
              <p className="text-xl font-bold text-blue-200">Waiting for a volunteer to accept your request.</p>
            </div>
            <button 
              onClick={cancelAndReset}
              className="mt-8 px-12 py-5 bg-white text-blue-900 rounded-full text-2xl font-black shadow-lg"
            >
              CANCEL
            </button>
          </div>
        )}
      </div>

      {activeRequest && activeRequest.status === RequestStatus.ACCEPTED && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col p-8 items-center justify-center text-center">
           <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mb-6">
              <span className="text-5xl">🏃</span>
           </div>
           <h2 className="text-4xl font-black text-gray-900 mb-4">Helper Found!</h2>
           <p className="text-2xl font-bold text-gray-700 mb-8">
             Volunteer <strong>Abebe</strong> is on his way. He will be there in about 4 minutes.
           </p>
           <button 
             onClick={() => {
               alert("Emergency button triggered. Nearby help alerted.");
             }}
             className="w-full py-8 bg-red-600 text-white rounded-3xl text-3xl font-black"
           >
             SOS EMERGENCY
           </button>
        </div>
      )}
    </div>
  );
};

export default ImpairedUserHome;
