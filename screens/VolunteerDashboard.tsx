
import React from 'react';
import { User, HelpRequest, RequestStatus } from '../types';
import RequestDetails from './RequestDetails';

interface VolunteerDashboardProps {
  user: User;
  activeRequest: HelpRequest | null;
  incomingRequest: HelpRequest | null;
  onAccept: () => void;
  onDecline: () => void;
  onCompleteRequest: () => void;
}

const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ 
  user, 
  activeRequest, 
  incomingRequest, 
  onAccept, 
  onDecline,
  onCompleteRequest
}) => {
  
  if (activeRequest) {
    return <RequestDetails request={activeRequest} onComplete={onCompleteRequest} />;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-y-auto pb-20">
      {/* Volunteer Header */}
      <div className="bg-emerald-600 p-8 pt-12 rounded-b-3xl text-white shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-black">Hi, {user.name}</h1>
            <p className="opacity-90 font-medium">Ready to help today?</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
            🏆
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
            <span className="block text-3xl font-black">4.9 ★</span>
            <span className="text-xs uppercase tracking-widest font-bold">Current Rating</span>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
            <span className="block text-3xl font-black">{user.completedTasks}</span>
            <span className="text-xs uppercase tracking-widest font-bold">Helps Completed</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Verification Status */}
        {user.isVerified && (
          <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-200 flex items-center gap-4">
            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">✓</div>
            <p className="text-blue-900 font-bold">Authenticated Volunteer</p>
          </div>
        )}

        {/* History / Nearby */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Service</h3>
            <button className="text-emerald-600 font-bold">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                   {i === 1 ? '🛣️' : '🛒'}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{i === 1 ? 'Crossing Assistance' : 'Grocery Help'}</p>
                  <p className="text-xs text-gray-500">2 days ago • Bole District</p>
                </div>
                <div className="text-yellow-500 font-bold">5.0 ★</div>
              </div>
            ))}
          </div>
        </section>

        {/* Badges Section */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Badges</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {['Quick Responder', 'Five-Star Helper', 'Street Expert', 'Community Hero'].map(badge => (
              <div key={badge} className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl border-2 border-emerald-500">
                  🎖️
                </div>
                <span className="text-[10px] font-bold text-gray-600 text-center uppercase tracking-tight">{badge}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Incoming Request Notification (Modal) */}
      {incomingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-blue-600 p-6 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl animate-bounce">
                🔔
              </div>
              <h2 className="text-2xl font-black">Nearby Request</h2>
              <p className="opacity-80">Someone needs your help!</p>
            </div>
            
            <div className="p-8">
              <div className="mb-8">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Help Type</p>
                <p className="text-2xl font-black text-gray-900">{incomingRequest.generalizedDescription}</p>
                <div className="flex items-center gap-2 mt-2 text-emerald-600">
                  <span className="text-xl">📍</span>
                  <span className="font-bold">450 meters away</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={onAccept}
                  className="w-full py-5 bg-emerald-600 text-white rounded-2xl text-xl font-black shadow-xl active:scale-95 transition-transform"
                >
                  ACCEPT & START
                </button>
                <button 
                  onClick={onDecline}
                  className="w-full py-4 text-gray-500 font-bold active:bg-gray-100 rounded-xl"
                >
                  Pass this one
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav Mock */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-20 flex items-center justify-around px-4">
        <button className="flex flex-col items-center text-emerald-600 font-bold">
          <span className="text-2xl">🏠</span>
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center text-gray-400 font-bold">
          <span className="text-2xl">🌍</span>
          <span className="text-xs">Nearby</span>
        </button>
        <button className="flex flex-col items-center text-gray-400 font-bold">
          <span className="text-2xl">⚙️</span>
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
