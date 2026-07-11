import React, { useState } from 'react';
import { Mail, Lock, Shield, MapPin, ArrowLeft, User } from 'lucide-react';
import { supabase } from './supabase';

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
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Ghatkesar Ward 4');
  const [adminBadge, setAdminBadge] = useState('');
  const [error, setError] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const fetchLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocation('Ghatkesar Ward 4');
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
            headers: {
              'User-Agent': 'CivicPulseHackathonDemo',
              'Accept-Language': 'en'
            }
          });
          if (!res.ok) throw new Error('Failed to fetch location data');
          const data = await res.json();
          
          const addr = data.address || {};
          const locationName = addr.suburb || addr.village || addr.town || addr.neighbourhood || addr.city_district || addr.city || addr.county || 'Ghatkesar Ward 4';
          
          setLocation(locationName);
        } catch (err) {
          console.error(err);
          setLocation('Ghatkesar Ward 4');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error(error);
        setIsDetectingLocation(false);
        setLocation('Ghatkesar Ward 4');
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill out all required fields.');
      return;
    }
    
    if (role === 'official' && !adminBadge) {
      setError('Official Admin Badge ID is required.');
      return;
    }

    try {
      if (isSignUp) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Failed to create account.');

        const { error: profileError } = await supabase.from('profiles').insert([{
          id: authData.user.id,
          email,
          name: name || email.split('@')[0],
          role,
          location
        }]);

        if (profileError) throw profileError;

        onSuccess({
          name: name || email.split('@')[0],
          email,
          role,
          location
        });
      } else {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) throw profileError;

        onSuccess({
          name: profileData.name || email.split('@')[0],
          email: profileData.email,
          role: profileData.role,
          location: profileData.location || location
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    }
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

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 ${colorClasses.focusBorder} focus:outline-none focus:ring-2 ${colorClasses.focusRingLight} shadow-sm transition-all`}
                  placeholder="John Doe"
                />
              </div>
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
              {isSignUp ? `Create ${isCitizen ? 'Citizen' : 'Official'} Account` : `Sign In to ${isCitizen ? 'Citizen Feed' : 'Dashboard'}`}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className={`text-sm font-medium ${isCitizen ? 'text-emerald-600 hover:text-emerald-500' : 'text-indigo-600 hover:text-indigo-500'} transition-colors`}
            >
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
