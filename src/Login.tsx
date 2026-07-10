import React, { useState } from 'react';
import { ChevronDown, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from './supabaseClient';

interface LoginProps {
  onLogin: (role: 'citizen' | 'official' | 'admin', wardId: string, userName: string, userId?: string) => void;
  initialMode?: 'signin' | 'signup' | 'forgot' | 'reset' | 'expired';
}

export default function Login({ onLogin, initialMode = 'signin' }: LoginProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'reset' | 'expired' | 'verification-sent'>(initialMode);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Loading & State messages
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [demoSelection, setDemoSelection] = useState('citizen-a');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          setErrorMsg(error.message);
        } else if (data?.user) {
          setSuccessMsg('Successfully signed in!');
          // The auth state listener in App.tsx will trigger the profile fetch and feed redirect.
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMsg('Supabase client is not initialized.');
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || !confirmPassword) {
      setErrorMsg('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0] // default fallback
            }
          }
        });

        if (error) {
          setErrorMsg(error.message);
        } else if (data?.user) {
          // Check if email confirmation is required
          if (data.session) {
            setSuccessMsg('Successfully registered!');
          } else {
            setMode('verification-sent');
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMsg('Supabase client is not initialized.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/#reset`
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('Password reset link has been sent to your email.');
          setEmail('');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMsg('Supabase client is not initialized.');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('Please enter a new password.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    if (supabase) {
      try {
        const { error } = await supabase.auth.updateUser({
          password: password
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('Password has been reset successfully!');
          setTimeout(() => {
            setMode('signin');
            setPassword('');
            setConfirmPassword('');
          }, 2000);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMsg('Supabase client is not initialized.');
      setLoading(false);
    }
  };

  // Demo Switcher changes (retained existing hackathon functionality)
  const handleDemoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setDemoSelection(val);
    if (val === 'citizen-a') {
      onLogin('citizen', 'ghatkesar-4', 'Citizen A', '11111111-1111-1111-1111-111111111111');
    } else if (val === 'corporator-ramesh') {
      onLogin('official', 'ghatkesar-4', 'Corporator Ramesh', '22222222-2222-2222-2222-222222222222');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col">
        
        {/* Main Card Content */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 mb-4 border border-emerald-100/50 shadow-sm">
              <span className="text-3xl">🏛️</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {mode === 'signin' && 'Sign In to CivicPulse'}
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'forgot' && 'Reset Your Password'}
              {mode === 'reset' && 'Enter New Password'}
              {mode === 'expired' && 'Session Expired'}
              {mode === 'verification-sent' && 'Verify Your Email'}
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              {mode === 'signin' && 'Access your hyper-local governance community feed.'}
              {mode === 'signup' && 'Join your community to report and upvote issues.'}
              {mode === 'forgot' && "We'll send you a recovery link to your inbox."}
              {mode === 'reset' && 'Create a strong, secure password for your account.'}
              {mode === 'expired' && 'Please sign in again to continue.'}
              {mode === 'verification-sent' && 'Account confirmation link sent.'}
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-700 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Views */}
          {mode === 'verification-sent' && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-800 leading-relaxed">
                Check your email inbox for a confirmation link to activate your CivicPulse account. After clicking, you will be redirected to complete your profile setup.
              </div>
              <button 
                onClick={() => setMode('signin')}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sign In</span>
              </button>
            </div>
          )}

          {mode === 'expired' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <button
                onClick={() => setMode('signin')}
                className="w-full px-4 py-3 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-all shadow-md"
              >
                Sign In Again
              </button>
            </div>
          )}

          {(mode === 'signin' || mode === 'signup' || mode === 'forgot' || mode === 'reset') && (
            <form onSubmit={
              mode === 'signin' ? handleSignIn : 
              mode === 'signup' ? handleSignUp : 
              mode === 'forgot' ? handleForgotPassword : 
              handleResetPassword
            } className="space-y-5">
              
              {/* Email (not on reset page) */}
              {mode !== 'reset' && (
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
                    />
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              )}

              {/* Password (for signin, signup, reset) */}
              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                    {mode === 'reset' ? 'New Password' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
                    />
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password (only on signup/reset) */}
              {(mode === 'signup' || mode === 'reset') && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
                    />
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              )}

              {/* Remember Me / Forgot Password Links (only on signin) */}
              {mode === 'signin' && (
                <div className="flex items-center justify-between text-xs font-semibold">
                  <label className="flex items-center gap-2 text-slate-600 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>Remember Session</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-emerald-600 hover:text-emerald-500 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 text-base font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Send Recovery Email'}
                  {mode === 'reset' && 'Reset Password'}
                </span>
              </button>
            </form>
          )}

          {/* Toggle Signin/Signup */}
          {mode === 'signin' && (
            <p className="text-center text-sm text-slate-500 mt-6">
              New to CivicPulse?{' '}
              <button
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                Sign Up
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                Sign In
              </button>
            </p>
          )}

          {(mode === 'forgot' || mode === 'reset') && (
            <button
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="mt-6 w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </button>
          )}
        </div>

        {/* Hackathon Override Toolbar (retained functionality for fast evaluation) */}
        <div className="border-t border-slate-200 bg-blue-50/70 p-5 backdrop-blur-sm mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Fast Demo Switcher</span>
          </div>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-lg border border-blue-200 bg-white/80 px-3 py-2 pr-10 text-sm font-medium text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm transition-colors"
              value={demoSelection}
              onChange={handleDemoChange}
            >
              <option value="citizen-a">👤 Demo Citizen A (Ghatkesar)</option>
              <option value="corporator-ramesh">🏛️ Demo Corporator Ramesh (Ghatkesar)</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-blue-500 pointer-events-none" />
          </div>
        </div>
        
      </div>
    </div>
  );
}
