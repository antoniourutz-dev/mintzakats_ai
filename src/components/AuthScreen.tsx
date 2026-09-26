import React, { useState } from 'react';
import { LogIn, Key, User as UserIcon, Eye, EyeOff, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { loginStudent } from '../services/supabase';

interface AuthScreenProps {
  onLoginSuccess: (userEmail: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage('Mesedez, idatzi zure erabiltzailea eta pasahitza.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await loginStudent(identifier.trim(), password);

    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
      return;
    }

    if (res.user?.email) {
      onLoginSuccess(res.user.email);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center px-4 py-8 selection:bg-yellow-300 selection:text-black">
      {/* Brand Header */}
      <div className="text-center mb-6 max-w-sm w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 border-4 border-black rounded-2xl shadow-[4px_4px_0_0_#000] text-white font-black text-2xl mb-3">
          MK
        </div>
        <h1 className="text-3xl font-black text-neutral-950 tracking-tight leading-none">
          Mintzakats
        </h1>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0_0_#000] p-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-neutral-200">
          <div className="p-1.5 bg-yellow-300 border-2 border-black rounded-lg">
            <LogIn className="w-4 h-4 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-black text-neutral-950 leading-tight">
              Ikasleen Sarrera
            </h2>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border-2 border-rose-500 rounded-xl text-rose-950 text-xs font-bold flex items-start gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identifier input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1.5">
              Erabiltzailea / Emaila
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="adib. ikasle001"
                disabled={isLoading}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 hover:bg-white focus:bg-white text-neutral-950 font-bold text-sm border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all placeholder:text-neutral-400 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1.5">
              Pasahitza
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Key className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full pl-9 pr-10 py-2.5 bg-neutral-50 hover:bg-white focus:bg-white text-neutral-950 font-bold text-sm border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all placeholder:text-neutral-400 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-900 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-base border-2 border-black rounded-xl shadow-[3px_3px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_#000] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Konektatzen...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Hasi Saioa</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
