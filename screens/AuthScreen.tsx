
import React, { useState } from 'react';
import { UserRole } from '../types';

interface AuthScreenProps {
  onLogin: (role: UserRole) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.UNSET);

  return (
    <div className="h-screen w-full bg-white flex flex-col p-6 max-w-md mx-auto">
      <div className="mt-12 mb-10">
        <h2 className="text-4xl font-black text-gray-900 mb-2">Welcome to BleNe</h2>
        <p className="text-lg text-gray-600">Choose how you want to join our community.</p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <button
          onClick={() => setRole(UserRole.IMPAIRED)}
          className={`p-6 rounded-3xl border-4 transition-all text-left flex flex-col gap-2 ${
            role === UserRole.IMPAIRED ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-gray-200'
          } accessible-focus`}
          aria-label="I need assistance"
        >
          <span className="text-3xl">🦯</span>
          <span className="text-2xl font-bold text-gray-900">I Need Help</span>
          <span className="text-gray-600">Voice-guided interface for visually impaired users.</span>
        </button>

        <button
          onClick={() => setRole(UserRole.VOLUNTEER)}
          className={`p-6 rounded-3xl border-4 transition-all text-left flex flex-col gap-2 ${
            role === UserRole.VOLUNTEER ? 'border-emerald-600 bg-emerald-50 shadow-lg' : 'border-gray-200'
          } accessible-focus`}
          aria-label="I want to volunteer"
        >
          <span className="text-3xl">🤝</span>
          <span className="text-2xl font-bold text-gray-900">I am a Volunteer</span>
          <span className="text-gray-600">Help someone in your neighborhood and earn badges.</span>
        </button>
      </div>

      <div className="py-8">
        <button
          disabled={role === UserRole.UNSET}
          onClick={() => onLogin(role)}
          className={`w-full py-5 rounded-full text-2xl font-bold transition-all shadow-xl ${
            role === UserRole.UNSET ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white active:scale-95'
          } accessible-focus`}
        >
          Get Started
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 pb-4">
        By joining, you agree to our <span className="underline">Terms of Service</span>.
      </p>
    </div>
  );
};

export default AuthScreen;
