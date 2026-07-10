import { useState } from 'react';
import { Building, LogOut } from 'lucide-react';
import Login from './Login';
import CitizenFeed from './CitizenFeed';
import OfficialDashboard from './OfficialDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'citizen' | 'official' | null>(null);

  const handleLogin = (role: 'citizen' | 'official') => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-200">
      {/* Sticky top Global Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full h-16 z-50 bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-emerald-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              CivicPulse
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {userRole && (
              <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                userRole === 'citizen' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
              }`}>
                {userRole} view
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main View Container */}
      <main className="pt-16">
        {userRole === 'citizen' && <CitizenFeed />}
        {userRole === 'official' && <OfficialDashboard />}
      </main>
    </div>
  );
}

export default App;
