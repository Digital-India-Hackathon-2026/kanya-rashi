import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { User, Phone, MapPin, Building, ChevronDown, CheckCircle, Loader } from 'lucide-react';

interface Ward {
  id: string;
  name: string;
  corporator_name: string;
}

interface ProfileSetupProps {
  userId: string;
  onSetupComplete: (profile: {
    full_name: string;
    role: 'citizen' | 'official' | 'admin';
    ward_id: string;
  }) => void;
}

export default function ProfileSetup({ userId, onSetupComplete }: ProfileSetupProps) {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [mandal, setMandal] = useState('');
  const [villageOrMunicipality, setVillageOrMunicipality] = useState('');
  const [selectedWardId, setSelectedWardId] = useState('');
  const [role, setRole] = useState<'citizen' | 'official' | 'admin'>('citizen');
  const [wards, setWards] = useState<Ward[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch wards for selection
  useEffect(() => {
    async function fetchWards() {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('wards')
            .select('*')
            .order('name');
          if (data && !error) {
            setWards(data);
            if (data.length > 0) {
              setSelectedWardId(data[0].id);
            }
          }
        } catch (err) {
          console.error('Failed to load wards:', err);
        }
      }
      // Fallback
      if (wards.length === 0) {
        const mockWards = [
          { id: 'ghatkesar-4', name: 'Ghatkesar Ward 4', corporator_name: 'Corporator Ramesh' },
          { id: 'pocharam-1', name: 'Pocharam Ward 1', corporator_name: 'Corporator Sitha' }
        ];
        setWards(mockWards);
        setSelectedWardId(mockWards[0].id);
      }
    }
    fetchWards();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    if (supabase) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            mobile_number: mobileNumber,
            mandal: mandal,
            village_or_municipality: villageOrMunicipality,
            ward_id: selectedWardId || null,
            role: role
          })
          .eq('id', userId);

        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('Profile setup completed successfully!');
          setTimeout(() => {
            onSetupComplete({
              full_name: fullName,
              role: role,
              ward_id: selectedWardId
            });
          }, 1000);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'An error occurred during profile setup.');
      } finally {
        setLoading(false);
      }
    } else {
      // Local fallback
      setSuccessMsg('Profile setup completed (Local Demo Mode).');
      setTimeout(() => {
        onSetupComplete({
          full_name: fullName,
          role: role,
          ward_id: selectedWardId
        });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 mb-4 border border-emerald-100/50 shadow-sm text-emerald-600">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Complete Your Profile
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Please provide your local governance details to access the platform.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullname" className="block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="fullname"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <label htmlFor="mobile" className="block text-sm font-semibold text-slate-700">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  id="mobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
                />
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Mandal */}
            <div className="space-y-2">
              <label htmlFor="mandal" className="block text-sm font-semibold text-slate-700">
                Mandal
              </label>
              <div className="relative">
                <input
                  id="mandal"
                  type="text"
                  placeholder="e.g. Ghatkesar"
                  value={mandal}
                  onChange={(e) => setMandal(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
                />
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Village / Municipality */}
            <div className="space-y-2">
              <label htmlFor="village" className="block text-sm font-semibold text-slate-700">
                Village / Municipality
              </label>
              <div className="relative">
                <input
                  id="village"
                  type="text"
                  placeholder="e.g. Pocharam"
                  value={villageOrMunicipality}
                  onChange={(e) => setVillageOrMunicipality(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
                />
                <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Ward Select */}
          <div className="space-y-2">
            <label htmlFor="ward" className="block text-sm font-semibold text-slate-700">
              Assigned Ward
            </label>
            <div className="relative">
              <select
                id="ward"
                value={selectedWardId}
                onChange={(e) => setSelectedWardId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white pl-4 pr-10 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
              >
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.corporator_name})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* User Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              User Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['citizen', 'official', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold text-center capitalize transition-all ${
                    role === r
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select standard role. Citizens report & upvote. Officials manage status & resolve issues. Admins manage users.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-base font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-2"
          >
            {loading && <Loader className="w-5 h-5 animate-spin" />}
            <span>Complete Setup & Enter Platform</span>
          </button>
        </form>
      </div>
    </div>
  );
}
