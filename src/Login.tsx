import React from 'react';
import { Building, Shield, User } from 'lucide-react';

export default function Login({ onLogin }: { onLogin: (role: 'citizen' | 'official') => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-8">
        
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4 border border-slate-100 shadow-sm">
            <Building className="w-8 h-8 text-slate-700" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            CivicPulse
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Log in to access your hyper-local dashboard.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button 
            onClick={() => onLogin('citizen')}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 text-base font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <User className="w-5 h-5" />
            Login as Citizen
          </button>
          
          <button 
            onClick={() => onLogin('official')}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 text-base font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Shield className="w-5 h-5" />
            Login as Official
          </button>
        </div>
        
      </div>
    </div>
  );
}
