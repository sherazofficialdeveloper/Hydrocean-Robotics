/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import { apiFetch, setAuthToken } from '../lib/api';
import { WebsiteSettings } from '../types';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  settings: WebsiteSettings;
}

export default function AdminLogin({ onLoginSuccess, settings }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const primaryColor = settings.primaryColor || '#009ca6';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const data = await apiFetch('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      if (data.token) {
        setAuthToken(data.token);
        onLoginSuccess();
      } else {
        throw new Error('No token returned from server.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-slate-50 relative overflow-hidden">
      {/* Background visual graphics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-teal-100/30 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-2xl">
        {/* Brand identity */}
        <div className="text-center mb-8">
          <div className="p-3 bg-slate-900 text-white rounded-2xl inline-block mb-4 shadow-md">
            <ShieldCheck className="h-8 w-8 text-teal-400" />
          </div>
          <h2 className="font-display font-bold text-2xl text-gray-950">Administrative Portal</h2>
          <p className="text-xs text-gray-400 font-sans mt-1">Authorized access only • Security Active</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start space-x-2.5 text-xs font-semibold mb-6 animate-fade-in">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-400 mb-2">
              Admin Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <User className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. wavepilot1@gmail.com"
                className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-gray-800 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-400 mb-2">
              Password Security Key
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-xs font-sans text-gray-800 focus:outline-none focus:border-teal-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <label className="flex items-center space-x-2 text-xs font-sans text-gray-500 cursor-pointer">
              <input type="checkbox" className="text-teal-600 focus:ring-teal-500 rounded" />
              <span>Remember active session</span>
            </label>
            <a href="#" className="text-xs font-semibold text-teal-600 hover:text-teal-700 font-sans" style={{ color: primaryColor }}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>Verify and Login</span>
            )}
          </button>
        </form>

        {/* Informative credentials note */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-[10px] font-sans text-gray-400">
            Default credentials for demonstration: <br />
            <strong className="font-mono text-gray-600">wavepilot1@gmail.com / Admin@123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
