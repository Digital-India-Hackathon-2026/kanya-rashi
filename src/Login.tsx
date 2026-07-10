
import { User, Shield } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'citizen' | 'official') => void;
}

export default function Login({ onLogin }: LoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-900 selection:bg-emerald-200">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 sm:p-12 transition-all">
        
        {/* Branding Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-slate-50 mb-4 border border-slate-100 shadow-sm transition-transform hover:scale-105 duration-300">
            <span className="text-3xl">🏛️</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            CivicPulse
          </h1>
          <p className="text-sm text-slate-500 mt-3 max-w-sm mx-auto leading-relaxed">
            Connecting citizens and local authorities for transparent, hyper-local governance.
          </p>
        </div>

        {/* Action Selection */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center mb-2">
            Select Your Role to Continue
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Button 1: Login as Citizen (Emerald Green) */}
            <button
              onClick={() => onLogin('citizen')}
              className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 border-emerald-50 bg-white hover:bg-emerald-50/50 hover:border-emerald-200 transition-all duration-300 text-center group active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  Citizen Portal
                </span>
                <span className="block text-xs text-slate-500 mt-1">
                  Report issues & vote in your local ward
                </span>
              </div>
              <span className="w-full mt-2 py-2.5 px-4 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-500 transition-colors shadow-sm">
                Login as Citizen
              </span>
            </button>

            {/* Button 2: Login as Official (Indigo Blue) */}
            <button
              onClick={() => onLogin('official')}
              className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 border-indigo-50 bg-white hover:bg-indigo-50/50 hover:border-indigo-200 transition-all duration-300 text-center group active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                  Official Portal
                </span>
                <span className="block text-xs text-slate-500 mt-1">
                  Track, acknowledge, & resolve grievances
                </span>
              </div>
              <span className="w-full mt-2 py-2.5 px-4 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-500 transition-colors shadow-sm">
                Login as Official
              </span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-10 text-center text-xs text-slate-400">
          Secure authentication for Digital India Hackathon 2026
        </div>
        
      </div>
    </div>
  );
}
