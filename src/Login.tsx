import React, { useState } from 'react';
import { User, Shield, ChevronDown } from 'lucide-react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [role, setRole] = useState<'citizen' | 'official'>('citizen');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Main Card Content */}
        <div className="p-8">
          {/* Branding Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-4 border border-slate-100 shadow-sm">
              <span className="text-2xl">🏛️</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Welcome to CivicPulse
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Select your role to access your hyper-local feed.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-8">
            <button
              onClick={() => setRole('citizen')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
                role === 'citizen'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Citizen</span>
            </button>
            <button
              onClick={() => setRole('official')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
                role === 'official'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Official</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="mb-8 min-h-[160px]">
            {role === 'citizen' ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                  {/* Generic Google SVG */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 px-4 text-xs font-medium text-slate-400">
                    or select your ward manually
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="ward-select" className="block text-sm font-medium text-slate-700">
                    Select Home Ward
                  </label>
                  <div className="relative">
                    <select
                      id="ward-select"
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>Choose your ward...</option>
                      <option value="ghatkesar-4">Ghatkesar Ward 4</option>
                      <option value="pocharam-1">Pocharam Ward 1</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <label htmlFor="pin-input" className="block text-sm font-medium text-slate-700">
                    Official Access PIN
                  </label>
                  <input
                    id="pin-input"
                    type="password"
                    placeholder="Enter your assigned 6-digit PIN"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
                  />
                </div>
                <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-2">
                  <Shield className="w-4 h-4 flex-shrink-0 text-slate-400 mt-0.5" />
                  <span className="leading-relaxed">Only authorized municipal officials and elected representatives have access to this portal.</span>
                </p>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button 
            onClick={onLogin}
            className="w-full px-4 py-3.5 text-base font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Enter Community Feed
          </button>
        </div>

        {/* Hackathon Override Toolbar */}
        <div className="border-t border-slate-200 bg-blue-50/70 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Fast Demo Switcher</span>
          </div>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-lg border border-blue-200 bg-white/80 px-3 py-2 pr-10 text-sm font-medium text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm transition-colors"
              defaultValue="citizen-a"
            >
              <option value="citizen-a">👤 Citizen A (Ward 4)</option>
              <option value="corporator-ramesh">🏛️ Corporator Ramesh (Ward 4)</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-blue-500 pointer-events-none" />
          </div>
        </div>
        
      </div>
    </div>
  );
}
