
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, User, HelpRequest, RequestStatus } from './types';
import Splash from './components/Splash';
import AuthScreen from './screens/AuthScreen';
import ImpairedUserHome from './screens/ImpairedUserHome';
import VolunteerDashboard from './screens/VolunteerDashboard';
import RequestDetails from './screens/RequestDetails';
import { playAudioBuffer, getGeminiTTS } from './services/geminiService';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeRequest, setActiveRequest] = useState<HelpRequest | null>(null);
  const [incomingRequest, setIncomingRequest] = useState<HelpRequest | null>(null);

  // Simulation of background matching
  useEffect(() => {
    if (currentUser?.role === UserRole.VOLUNTEER && !activeRequest) {
      const timer = setTimeout(() => {
        // Mock incoming request
        setIncomingRequest({
          id: 'req-123',
          userId: 'user-789',
          userName: 'Abel T.',
          description: 'I am at the intersection of Bole road and need help finding the entrance to the mall.',
          generalizedDescription: 'Navigation to building entrance',
          location: { lat: 9.005, lng: 38.775, address: 'Bole Road, Addis Ababa' },
          status: RequestStatus.PENDING,
          createdAt: Date.now()
        });
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, activeRequest]);

  const speakPrompt = useCallback(async (text: string) => {
    const audio = await getGeminiTTS(text);
    if (audio) playAudioBuffer(audio);
  }, []);

  const handleLogin = (role: UserRole) => {
    const user: User = {
      id: role === UserRole.IMPAIRED ? 'user-1' : 'vol-1',
      name: role === UserRole.IMPAIRED ? 'User' : 'Abebe B.',
      role,
      isVerified: role === UserRole.VOLUNTEER, // Volunteers might need approval
      rating: 4.8,
      completedTasks: 12
    };
    setCurrentUser(user);
    speakPrompt(`Logged in as ${role === UserRole.IMPAIRED ? 'user needing help' : 'volunteer'}.`);
  };

  const handleCreateRequest = (request: HelpRequest) => {
    setActiveRequest(request);
  };

  const handleAcceptRequest = () => {
    if (incomingRequest) {
      const accepted = { ...incomingRequest, status: RequestStatus.ACCEPTED, volunteerId: currentUser?.id };
      setActiveRequest(accepted);
      setIncomingRequest(null);
    }
  };

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col relative">
      {currentUser.role === UserRole.IMPAIRED ? (
        <ImpairedUserHome 
          user={currentUser} 
          activeRequest={activeRequest} 
          setActiveRequest={setActiveRequest}
        />
      ) : (
        <VolunteerDashboard 
          user={currentUser} 
          activeRequest={activeRequest}
          incomingRequest={incomingRequest}
          onAccept={handleAcceptRequest}
          onDecline={() => setIncomingRequest(null)}
          onCompleteRequest={() => {
            setActiveRequest(null);
            // In a real app, update user stats here
          }}
        />
      )}
    </div>
  );
};

export default App;
