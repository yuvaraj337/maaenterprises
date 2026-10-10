'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Loader2, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const autofillCredentials = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('admin123');
  };

  return (
    <main className="min-h-screen bg-[#07090E] flex flex-col justify-center items-center p-4 relative overflow-hidden text-white">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[400px] bg-yamaha-blue/25 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Dealership Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 shadow-xl shadow-red-900/50 mb-3 border border-red-500/30">
            <span className="text-white font-black text-2xl">M</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight font-display text-white">
            MAA ENTERPRISES
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mt-0.5">
            Northstar EV Dealership CRM
          </p>
          <span className="text-[11px] text-gray-400">Near SBI Bank, Mahagama • Secure Operations</span>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-1">Staff Authentication</h2>
          <p className="text-xs text-gray-400 mb-6">Enter your authorized credentials to access CRM operations.</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">Staff Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maaenterprises.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-card text-xs text-white border border-white/10 focus:border-red-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-card text-xs text-white border border-white/10 focus:border-red-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 transition-all transform active:scale-95 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to CRM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-8 pt-5 border-t border-white/10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-2 text-center">
              Quick Autofill Credentials (Password: admin123)
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => autofillCredentials('admin@maaenterprises.com')}
                className="p-2 rounded-lg glass-card hover:bg-white/10 text-cyan-400 font-bold transition-colors truncate"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => autofillCredentials('sales@maaenterprises.com')}
                className="p-2 rounded-lg glass-card hover:bg-white/10 text-emerald-400 font-bold transition-colors truncate"
              >
                Sales Manager
              </button>
            </div>
          </div>
        </div>

        {/* Link back to public dealership site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-gray-400 hover:text-cyan-400 transition-colors"
          >
            ← Return to Public Dealership Website
          </a>
        </div>
      </div>
    </main>
  );
}
