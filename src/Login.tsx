import React, { useState } from 'react';
import { Mail, Lock, Shield, MapPin, ArrowLeft } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  role: 'citizen' | 'official';
  location?: string;
}

interface LoginModalProps {
  role: 'citizen' | 'official';
  onClose: () => void;
  onSuccess: (userData: UserData) => void;
}

export default function LoginModal({ role, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Ghatkesar Ward 4');
  const [adminBadge, setAdminBadge] = useState('');
  const [error, setError] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const fetchLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!res.ok) throw new Error('Failed to fetch location data');
          const data = await res.json();
          
          const address = data.address || {};
          const readableLocation = address.suburb || address.city_district || address.city || address.county || 'Unknown Location';
          
          setLocation(readableLocation);
        } catch (err) {
          console.error(err);
          alert('Could not determine readable location from coordinates.');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error(error);
        setIsDetectingLocation(false);
        alert('Location access denied or unavailable. Please allow location permissions.');
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill out all required fields.');
      return;
    }
    
    if (role === 'official' && !adminBadge) {
      setError('Official Admin Badge ID is required.');
      return;
    }

    const name = email.split('@')[0] || 'User';

    // Mock validation success for hackathon
    onSuccess({
      name,
      email,
      role,
      location: location
    });
  };

  const isCitizen = role === 'citizen';
  
  // Safe mapping for Tailwind class extraction
  const colorClasses = isCitizen 
    ? {
        bg: 'bg-emerald-600',
        hoverBg: 'hover:bg-emerald-500',
        focusRing: 'focus:ring-emerald-500',
        focusRingLight: 'focus:ring-emerald-500/20',
        focusBorder: 'focus:border-emerald-500',
      }
    : {
        bg: 'bg-indigo-600',
        hoverBg: 'hover:bg-indigo-500',
        focusRing: 'focus:ring-indigo-500',
        focusRingLight: 'focus:ring-indigo-500/20',
        focusBorder: 'focus:border-indigo-500',
      };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className={`px-6 py-8 text-center text-white ${colorClasses.bg} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <button 
            onClick={onClose} 
            className="absolute top-4 left-4 p-2 text-white/80 hover:text-white hover:bg-black/10 rounded-full transition-colors z-10"
            title="Back to Selection"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/30 shadow-inner">
            {isCitizen ? <MapPin className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
          </div>
          <h2 className="text-2xl font-bold tracking-tight relative z-10">
            {isCitizen ? 'Citizen Portal' : 'Official Portal'}
          </h2>
          <p className="text-white/80 mt-1 text-sm relative z-10">
            {isCitizen ? 'Secure your community.' : 'Access your administrative dashboard.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 ${colorClasses.focusBorder} focus:outline-none focus:ring-2 ${colorClasses.focusRingLight} shadow-sm transition-all`}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 ${colorClasses.focusBorder} focus:outline-none focus:ring-2 ${colorClasses.focusRingLight} shadow-sm transition-all`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {isCitizen ? 'Community Location' : 'Assigned Ward / District'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={location}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 shadow-sm transition-all outline-none"
                placeholder="Location..."
              />
              <button
                type="button"
                onClick={fetchLiveLocation}
                disabled={isDetectingLocation}
                className={`px-4 py-2.5 whitespace-nowrap rounded-xl text-sm font-bold text-white transition-all shadow-sm flex items-center justify-center gap-1 ${
                  isDetectingLocation ? 'bg-slate-400 cursor-wait' : colorClasses.bg + ' ' + colorClasses.hoverBg
                }`}
              >
                {isDetectingLocation ? '⏳ Detecting...' : '📍 Detect My Location'}
              </button>
            </div>
          </div>

          {!isCitizen && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Official Admin Badge ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={adminBadge}
                  onChange={(e) => setAdminBadge(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 ${colorClasses.focusBorder} focus:outline-none focus:ring-2 ${colorClasses.focusRingLight} shadow-sm transition-all`}
                  placeholder="e.g. AUTH-9021"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full px-4 py-3 text-base font-bold text-white ${colorClasses.bg} rounded-xl ${colorClasses.hoverBg} active:scale-[0.98] transition-all shadow-md focus:outline-none focus:ring-2 ${colorClasses.focusRing} focus:ring-offset-2`}
            >
              Sign In to {isCitizen ? 'Citizen Feed' : 'Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
