import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    loginWithEmail, 
    loginWithGoogle,
    registerWithEmail, 
    authSuccessRedirect,
    setAuthSuccessRedirect,
    setIsCheckoutOpen 
  } = useStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSuccess = () => {
    setIsAuthModalOpen(false);
    if (authSuccessRedirect === 'checkout') {
      setAuthSuccessRedirect(null);
      setIsCheckoutOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await loginWithEmail(email, password);
        if (res.success) {
          handleSuccess();
        } else {
          setErrorMsg(res.error || 'Invalid email or password.');
        }
      } else {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name.');
          setLoading(false);
          return;
        }
        const res = await registerWithEmail(email, password, name);
        if (res.success) {
          handleSuccess();
        } else {
          setErrorMsg(res.error || 'Registration failed.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        handleSuccess();
      } else {
        if (res.error?.includes('unauthorized-domain')) {
          setErrorMsg('Firebase requires whitelisting your domain in Firebase Console under Authentication > Settings > Authorized domains.');
        } else {
          setErrorMsg(res.error || 'Google sign-in could not be completed.');
        }
      }
    } catch (err: any) {
      if (err.message?.includes('unauthorized-domain') || err.code === 'auth/unauthorized-domain') {
        setErrorMsg('Firebase requires whitelisting your domain in Firebase Console under Authentication > Settings > Authorized domains.');
      } else {
        setErrorMsg(err.message || 'Google sign-in error.');
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#f3dde3] relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => { setIsAuthModalOpen(false); setAuthSuccessRedirect(null); }}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#faedf1] text-[#551d2e] hover:bg-[#f7dfe6] transition-colors cursor-pointer"
          aria-label="Close auth modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Kicker */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faedf1] text-[#8c2a44] text-[11px] font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-[#bd4c6d]" />
            Handmade Thread bangles
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#3b121e]">
            {authSuccessRedirect === 'checkout' 
              ? 'Please Sign In to Checkout' 
              : mode === 'signin' ? 'Welcome Back ♡' : 'Join Our Bangle Club ♡'
            }
          </h2>
          <p className="text-xs text-[#703b49] mt-1 font-light">
            {authSuccessRedirect === 'checkout'
              ? 'Save your delivery address and access real-time order tracking status anytime.'
              : 'Sign in to save your favorite bangle styles and view live orders.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#faedf1] p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signin' ? 'bg-white text-[#8c2a44] shadow-xs' : 'text-[#703b49] hover:text-[#3b121e]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signup' ? 'bg-white text-[#8c2a44] shadow-xs' : 'text-[#703b49] hover:text-[#3b121e]'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Google Sign-In Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 shadow-xs flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center my-4 gap-3 text-xs text-gray-400">
            <div className="h-[1px] flex-1 bg-gray-200" />
            <span className="text-[11px] text-[#8c4e5f]">or with email & password</span>
            <div className="h-[1px] flex-1 bg-gray-200" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-[#521b2a] mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#a06877] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarti Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#521b2a] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#a06877] absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#521b2a] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#a06877] absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#8c2a44] hover:bg-[#721f35] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In & Continue' : 'Create Account & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>


        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#8c4e5f]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured with Firebase Authentication</span>
        </div>

      </div>
    </div>
  );
};
