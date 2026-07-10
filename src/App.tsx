import { useState } from 'react';
import { MapPin, Camera, AlertTriangle, Building, LogOut, User, Shield, ChevronDown } from 'lucide-react';
import CitizenFeed from './CitizenFeed';
import OfficialDashboard from './OfficialDashboard';
import LoginModal from './Login';

interface UserData {
  name: string;
  email: string;
  role: 'citizen' | 'official';
  location?: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loginAttemptRole, setLoginAttemptRole] = useState<'citizen' | 'official' | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleAuthSuccess = (userData: UserData) => {
    setCurrentUser(userData);
    setLoginAttemptRole(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowProfileMenu(false);
  };

  // ------------------------------------------------------------------
  // LOGGED IN VIEW (Global Nav + Role Dashboard)
  // ------------------------------------------------------------------
  if (currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        {/* Global Navigation Bar */}
        <nav className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-6 h-6 text-slate-700" />
              <span className="text-xl font-bold tracking-tight">CivicPulse</span>
              {currentUser.role === 'official' && (
                <span className="ml-3 px-2 py-1 bg-indigo-100 text-indigo-800 text-[10px] uppercase font-bold tracking-wider rounded-full">Official Portal</span>
              )}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                  <span className="text-sm">👤</span>
                </div>
                <span className="text-sm font-bold text-slate-700 capitalize">{currentUser.name}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-slate-200 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900 truncate capitalize">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500">Role: <span className="font-semibold capitalize text-slate-700">{currentUser.role}</span></p>
                    {currentUser.role === 'citizen' && (
                      <p className="text-xs text-slate-500 mt-1 truncate">Loc: <span className="font-semibold text-slate-700">{currentUser.location}</span></p>
                    )}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </nav>

        {/* Main Content Area */}
        <div className="pt-16">
          {currentUser.role === 'citizen' && <CitizenFeed location={currentUser.location} />}
          {currentUser.role === 'official' && <OfficialDashboard currentUser={currentUser} />}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // LOGGED OUT VIEW (Restored Landing Page + Role Buttons)
  // ------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-200">
      {/* Landing Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              🏛️ CivicPulse
            </span>
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
          
          {/* Role-Based Login Buttons (Replaces previous CTA) */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => setLoginAttemptRole('citizen')}
              className="flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white bg-emerald-600 rounded-full hover:bg-emerald-500 active:scale-95 transition-all shadow-xl hover:shadow-emerald-500/20"
            >
              <User className="w-5 h-5" />
              Login as Citizen
            </button>
            <button 
              onClick={() => setLoginAttemptRole('official')}
              className="flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 active:scale-95 transition-all shadow-xl hover:shadow-indigo-500/20"
            >
              <Shield className="w-5 h-5" />
              Login as Official
            </button>
          </div>
        </section>

        {loginAttemptRole && (
          <LoginModal 
            role={loginAttemptRole}
            onClose={() => setLoginAttemptRole(null)}
            onSuccess={handleAuthSuccess}
          />
        )}

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
