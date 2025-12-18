
import React, { useState } from 'react';
import { HelpRequest, RequestStatus } from '../types';

interface RequestDetailsProps {
  request: HelpRequest;
  onComplete: () => void;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ request, onComplete }) => {
  const [step, setStep] = useState<'NAVIGATION' | 'INTERACTION'>('NAVIGATION');

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Dynamic Header */}
      <div className="bg-emerald-600 p-6 text-white flex items-center gap-4">
         <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">←</button>
         <div>
           <h2 className="text-xl font-black">Help in Progress</h2>
           <p className="text-sm opacity-80">{request.userName} is waiting</p>
         </div>
      </div>

      <div className="flex-1 relative flex flex-col">
        {step === 'NAVIGATION' ? (
          <>
            {/* Map Placeholder */}
            <div className="flex-1 bg-gray-200 relative overflow-hidden">
              <img 
                src="https://picsum.photos/seed/map/400/800" 
                alt="Map view" 
                className="w-full h-full object-cover opacity-60 grayscale"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-48 h-12 bg-white rounded-full shadow-2xl flex items-center px-4 gap-3 border-2 border-emerald-500">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping"></div>
                    <span className="font-bold text-emerald-900">4 min walking</span>
                 </div>
                 
                 {/* Destination Marker */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-red-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                       <span className="text-xl">📍</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-8 bg-white rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.1)] -mt-10 z-10">
               <div className="mb-6">
                 <h3 className="text-sm uppercase tracking-widest font-black text-gray-400 mb-2">Detailed Request</h3>
                 <p className="text-xl font-bold text-gray-900 leading-tight">
                   "{request.description}"
                 </p>
               </div>
               
               <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">👤</div>
                 <div>
                   <p className="font-bold text-gray-900">{request.userName}</p>
                   <p className="text-sm text-gray-500">{request.location.address}</p>
                 </div>
               </div>

               <button 
                 onClick={() => setStep('INTERACTION')}
                 className="w-full py-5 bg-blue-600 text-white rounded-2xl text-xl font-black shadow-xl active:scale-95"
               >
                 I HAVE ARRIVED
               </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col p-8 items-center justify-center text-center bg-white gap-8">
             <div className="w-40 h-40 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-7xl">✋</span>
             </div>
             <div>
               <h2 className="text-3xl font-black text-gray-900 mb-2">Assist {request.userName}</h2>
               <p className="text-lg text-gray-600">Please provide the assistance requested. Be patient and use verbal descriptions of the surroundings.</p>
             </div>

             <div className="w-full space-y-4">
                <button 
                  onClick={onComplete}
                  className="w-full py-6 bg-emerald-600 text-white rounded-3xl text-2xl font-black shadow-xl"
                >
                  COMPLETE HELP
                </button>
                <button 
                  onClick={() => alert("SOS Contacting dispatch...")}
                  className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold border-2 border-red-200"
                >
                  REPORT ISSUE
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetails;
