import React, { useState } from 'react';
import { MapPin, Camera, AlertTriangle } from 'lucide-react';
import Login from './Login';
import CitizenFeed from './CitizenFeed';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'feed'>('landing');

  if (currentView === 'login') {
    return <Login onLogin={() => setCurrentView('feed')} />;
  }

  if (currentView === 'feed') {
    return <CitizenFeed />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              🏛️ CivicPulse
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('login')} className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Login
            </button>
            <button onClick={() => setCurrentView('login')} className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-500 transition-all shadow-sm hover:shadow-md">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative px-4 pt-24 pb-32 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          {/* Subtle background decoration */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-100 to-emerald-200 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Hyper-Local Accountability.<br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
              1 Upvote = 1 Target Vote at Risk.
            </span>
          </h1>
          
          <p className="mt-8 text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            The first civic platform that maps real community grievances directly to local electoral boundaries. Hold your Ward Corporators and Sarpanches instantly accountable.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button onClick={() => setCurrentView('login')} className="relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-emerald-600 rounded-full overflow-hidden group shadow-xl hover:shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 animate-pulse hover:animate-none">
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative">Enter Your Local Feed</span>
            </button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-slate-50 py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                A system built for ground reality, ensuring every post drives actionable political change.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Card 1 */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 transition-all duration-300">
                  <MapPin className="h-7 w-7 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span>📍</span> Geofenced Accuracy
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  We use browser GPS to lock your posts to your exact Ward. No out-of-district trolling. Authentic complaints only.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 transition-all duration-300">
                  <Camera className="h-7 w-7 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span>📸</span> Live Proof
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  Our anti-spoofing camera forces live-photo capture. No fake gallery uploads, ensuring every issue is current and real.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 transition-all duration-300">
                  <AlertTriangle className="h-7 w-7 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span>⚠️</span> Political Pressure
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  Unresolved issues alienate voters. A public dashboard shows exactly how much political capital a leader is losing.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">🏛️ CivicPulse</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 CivicPulse. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
