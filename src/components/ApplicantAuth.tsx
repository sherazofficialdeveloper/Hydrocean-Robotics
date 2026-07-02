/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Eye, EyeOff, Lock, User, Mail, AlertCircle, 
  CheckCircle, ArrowRight, ShieldCheck, RefreshCw, KeyRound, ArrowLeft
} from 'lucide-react';
import { apiFetch, setApplicantToken } from '../lib/api';
import { WebsiteSettings } from '../types';
import { Language, getTranslation } from '../lib/translations';

interface ApplicantAuthProps {
  onSuccess: (user: { id: string; email: string; fullName: string; isAdmin?: boolean; isSubAdmin?: boolean; role?: string }) => void;
  onCancel?: () => void;
  settings: WebsiteSettings;
  lang: Language;
  initialView?: AuthView;
  onViewChange?: (view: AuthView) => void;
}

type AuthView = 'login' | 'signup' | 'forgot' | 'reset' | 'verifyOtp' | 'resetVerify';

export default function ApplicantAuth({ onSuccess, onCancel, settings, lang, initialView = 'login', onViewChange }: ApplicantAuthProps) {
  const [view, setView] = useState<AuthView>(initialView);

  // Trigger onViewChange when view updates internally
  useEffect(() => {
    onViewChange?.(view);
  }, [view, onViewChange]);
  
  // Login / General Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Signup Specific Inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP Verification Inputs
  const [otpInput, setOtpInput] = useState('');
  
  // Forgot / Reset Inputs
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Google Sign-In state
  const [googleClientId, setGoogleClientId] = useState('');
  
  // Error / Success / Loading State
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Countdown Timer state
  const [countdown, setCountdown] = useState(60);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');

  // Sync initialView if prop changes
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  // Countdown effect
  useEffect(() => {
    let timer: any = null;
    if (view === 'verifyOtp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [view, countdown]);

  // Reset states when view changes to verifyOtp
  useEffect(() => {
    if (view === 'verifyOtp') {
      setCountdown(60);
      setIsEditingEmail(false);
      setNewEmailInput(email);
    }
  }, [view, email]);

  const primaryColor = settings.primaryColor || '#009ca6';

  const resetMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const data = await apiFetch('/applicants/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (data.token && data.user) {
        setApplicantToken(data.token);
        setSuccessMsg(lang === 'ur' ? 'لاگ ان کامیاب ہو گیا! براہ کرم انتظار کریں...' : 'Authentication successful! Redirecting you now...');
        setTimeout(() => {
          onSuccess(data.user);
        }, 1000);
      } else {
        throw new Error('No applicant credentials returned.');
      }
    } catch (err: any) {
      if (err.needsVerification) {
        setSuccessMsg(lang === 'ur' ? 'اکاؤنٹ کی تصدیق درکار ہے۔ ایک نیا او ٹی پی کوڈ بھیجا گیا ہے!' : 'Account needs verification. A new OTP has been generated!');
        setEmail(err.email);
        setTimeout(() => {
          resetMessages();
          setView('verifyOtp');
        }, 1500);
      } else {
        setErrorMsg(err.message || (lang === 'ur' ? 'ای میل یا پاس ورڈ درست نہیں ہے۔' : 'Incorrect email address or password security key.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Register submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg(lang === 'ur' ? 'پہلا نام اور آخری نام ضروری ہیں۔' : 'First name and last name are required.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(lang === 'ur' ? 'پاس ورڈز مطابقت نہیں رکھتے۔' : 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg(lang === 'ur' ? 'پاس ورڈ کم از کم 6 حروف کا ہونا ضروری ہے۔' : 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch('/applicants/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, confirmPassword })
      });

      setSuccessMsg(data.message || (lang === 'ur' ? 'رجسٹریشن کامیاب! ای میل او ٹی پی تصدیق کا انتظار ہے...' : 'Account registered successfully! Redirecting to OTP verification...'));
      
      // Redirect to OTP verification after 1.5 seconds
      setTimeout(() => {
        resetMessages();
        setView('verifyOtp');
      }, 1500);

    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'ur' ? 'رجسٹریشن ناکام ہو گئی۔' : 'Registration failed.'));
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification submission
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!otpInput || otpInput.trim().length !== 6) {
      setErrorMsg(lang === 'ur' ? 'براہ کرم 6 ہندسوں کا درست او ٹی پی کوڈ درج کریں۔' : 'Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch('/applicants/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpInput.trim() })
      });

      setSuccessMsg(data.message || (lang === 'ur' ? 'ای میل کی تصدیق کامیاب ہو گئی! لاگ ان ہو رہا ہے...' : 'Email verified successfully! Opening your dashboard...'));
      if (data.token && data.user) {
        setApplicantToken(data.token);
        setTimeout(() => {
          onSuccess(data.user);
        }, 1500);
      } else {
        throw new Error('Verification completed but credentials were not returned.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'ur' ? 'او ٹی پی کوڈ غلط یا زائد المیعاد ہے۔' : 'Invalid or expired OTP verification code.'));
    } finally {
      setLoading(false);
    }
  };

  // Handle Resending OTP
  const handleResendOtp = async () => {
    resetMessages();
    setLoading(true);

    try {
      await apiFetch('/applicants/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      setSuccessMsg(lang === 'ur' ? 'ایک نیا 6 ہندسوں کا کوڈ آپ کی ای میل پر بھیج دیا گیا ہے!' : 'A new 6-digit OTP code has been generated and sent to your email.');
      setOtpInput('');
      setCountdown(60); // Reset countdown timer to 60s
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'ur' ? 'او ٹی پی کوڈ دوبارہ بھیجنے میں ناکامی۔' : 'Failed to resend OTP.'));
    } finally {
      setLoading(false);
    }
  };

  // Handle saving the corrected email and triggering new OTP
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailInput || !newEmailInput.includes('@')) {
      setErrorMsg(lang === 'ur' ? 'براہ کرم درست ای میل ایڈریس درج کریں۔' : 'Please enter a valid email address.');
      return;
    }
    
    resetMessages();
    setLoading(true);

    try {
      await apiFetch('/applicants/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldEmail: email, newEmail: newEmailInput.trim() })
      });

      setEmail(newEmailInput.trim().toLowerCase());
      setSuccessMsg(lang === 'ur' ? 'ای میل اپ ڈیٹ ہو گئی! ایک نیا او ٹی پی بھیج دیا گیا ہے۔' : 'Email updated successfully! A new OTP code has been dispatched.');
      setOtpInput('');
      setCountdown(60); // Reset timer to 60s
      setIsEditingEmail(false);
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'ur' ? 'ای میل ایڈریس تبدیل کرنے میں ناکامی۔' : 'Failed to update email address.'));
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password submission
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const data = await apiFetch('/applicants/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      setSuccessMsg(data.message || (lang === 'ur' ? 'پاس ورڈ دوبارہ ترتیب دینے کا او ٹی پی ای میل پر بھیج دیا گیا ہے۔' : 'A password reset OTP code has been sent successfully.'));
      setTimeout(() => {
        resetMessages();
        setView('resetVerify');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'ur' ? 'ای میل نہیں ملی۔' : 'Email coordinates not found.'));
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification for password reset
  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!resetToken || resetToken.trim().length !== 6) {
      setErrorMsg(lang === 'ur' ? 'براہ کرم 6 ہندسوں کا درست او ٹی پی کوڈ درج کریں۔' : 'Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch('/applicants/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: resetToken.trim() })
      });

      setSuccessMsg(data.message || (lang === 'ur' ? 'او ٹی پی کی تصدیق کامیاب ہو گئی! اب نیا پاس ورڈ درج کریں۔' : 'OTP verified successfully! Now enter your new password.'));
      setTimeout(() => {
        resetMessages();
        setView('reset');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'ur' ? 'ری سیٹ کوڈ غلط یا زائد المیعاد ہے۔' : 'Invalid or expired reset OTP code.'));
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password submission
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (newPassword.length < 6) {
      setErrorMsg(lang === 'ur' ? 'پاس ورڈ کم از کم 6 حروف کا ہونا ضروری ہے۔' : 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await apiFetch('/applicants/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword })
      });

      setSuccessMsg(lang === 'ur' ? 'آپ کا پاس ورڈ کامیابی سے اپ ڈیٹ ہو گیا ہے! براہ کرم لاگ ان کریں۔' : 'Your security password has been reset successfully. Please log in.');
      setTimeout(() => {
        setView('login');
        setPassword('');
        setNewPassword('');
        setResetToken('');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'ur' ? 'ری سیٹ ٹوکن غلط یا زائد المیعاد ہے۔' : 'Reset token is invalid or expired.'));
    } finally {
      setLoading(false);
    }
  };

  // Load Google configuration on mount
  useEffect(() => {
    apiFetch('/applicants/google-config')
      .then((data) => {
        if (data && data.googleClientId) {
          setGoogleClientId(data.googleClientId);
        }
      })
      .catch((err) => console.error('Failed to load Google client config:', err));
  }, []);

  // Initialize and render Google One Tap / Button when client ID and view are ready
  useEffect(() => {
    if (!googleClientId || googleClientId.includes('your_google_client_id')) return;

    const initGoogleGSI = () => {
      const g = (window as any).google;
      if (g && g.accounts) {
        g.accounts.id.initialize({
          client_id: googleClientId,
          ux_mode: 'popup',
          callback: async (response: any) => {
            const idToken = response.credential;
            await handleGoogleLoginWithIdToken(idToken);
          },
        });

        const containerId = view === 'login' ? 'google-signin-btn-login' : 'google-signin-btn-signup';
        const element = document.getElementById(containerId);
        if (element) {
          element.innerHTML = ''; // Clean up first
          g.accounts.id.renderButton(element, {
            theme: 'filled_blue',
            size: 'large',
            width: element.clientWidth || 320,
            text: 'continue_with',
          });
        }
      }
    };

    // Load GIS script if not present
    if (!document.getElementById('google-gsi-script')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogleGSI;
      document.body.appendChild(script);
    } else {
      setTimeout(initGoogleGSI, 200);
    }
  }, [googleClientId, view]);

  // Handle Google Login Integration with verified ID Token
  const handleGoogleLoginWithIdToken = async (idToken: string) => {
    resetMessages();
    setLoading(true);

    try {
      const data = await apiFetch('/applicants/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      if (data.token && data.user) {
        setApplicantToken(data.token);
        setSuccessMsg(lang === 'ur' ? `گوگل سائن ان کامیاب! خوش آمدید ${data.user.fullName}۔` : `Google Authentication Successful! Welcome ${data.user.fullName}.`);
        setTimeout(() => {
          onSuccess(data.user);
        }, 1200);
      } else {
        throw new Error('Google credentials could not be verified.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'ur' ? 'گوگل سائن ان ناکام ہو گیا۔' : 'Google authentication failed.'));
    } finally {
      setLoading(false);
    }
  };

  // Password Strength Meter Calculation
  const getPasswordStrength = (val: string) => {
    if (!val) return { label: '', color: 'bg-transparent', pct: 0 };
    if (val.length < 6) return { label: lang === 'ur' ? 'بہت چھوٹا' : 'Too Short', color: 'bg-rose-500', pct: 20 };
    
    let score = 1;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    if (score === 1) return { label: lang === 'ur' ? 'کمزور' : 'Weak', color: 'bg-rose-400', pct: 40 };
    if (score === 2) return { label: lang === 'ur' ? 'مناسب' : 'Fair', color: 'bg-amber-400', pct: 70 };
    return { label: lang === 'ur' ? 'مضبوط' : 'Strong', color: 'bg-emerald-500', pct: 100 };
  };

  const strength = getPasswordStrength(password);

  // Left-side dynamic heading values
  const getLeftText = () => {
    switch (view) {
      case 'login':
        return {
          title: lang === 'ur' ? 'بحرانی سمندری ٹیکنالوجی' : 'EXPLORE UNCHARTED WATERS',
          subtitle: lang === 'ur' ? 'اپنے محفوظ ہائیڈروشن پورٹل میں لاگ ان کریں تاکہ فعال بحری بیڑے، پروگرام فائلوں اور انجینئرنگ پائپ لائنوں تک رسائی حاصل ہو سکے۔' : 'Access the world\'s most advanced Unmanned Surface Vehicles (USV) & Autonomous Underwater Vehicles (AUV) telemetry and application portals.'
        };
      case 'signup':
        return {
          title: lang === 'ur' ? 'اپنا مستقبل ہمارے ساتھ جوڑیں' : 'CHART YOUR CAREER PATH',
          subtitle: lang === 'ur' ? 'ہمارے ساتھ مل کر سمندر کی مہم جوئی اور جدید ترین روبوٹکس کے ڈیزائن پر کام کرنے کے لیے اکاؤنٹ رجسٹر کریں۔' : 'Create your verified candidate credentials to join our elite teams of subsea robotics and maritime system engineers.'
        };
      case 'verifyOtp':
        return {
          title: lang === 'ur' ? 'شناختی سیکورٹی چیک' : 'SECURE IDENTITY CHECK',
          subtitle: lang === 'ur' ? 'ہم نے آپ کی ای میل پر ایک 6 ہندسوں کا پن کوڈ بھیجا ہے۔ اپنے امیدوار کی فائل کو فعال کرنے کے لیے اسے درج کریں۔' : 'We have dispatched a 6-digit cryptographic PIN code to your email. Enter it to verify and activate your applicant profile.'
        };
      default:
        return {
          title: lang === 'ur' ? 'سیکورٹی بحالی کا مرکز' : 'RECOVER PIPELINE ACCESS',
          subtitle: lang === 'ur' ? 'ہمارے کثیر الوجود شناختی نظام کے ذریعے اپنی اسناد کو دوبارہ حاصل کریں اور محفوظ طریقے سے آگے بڑھیں۔' : 'Restore your admission and application credentials securely using our multi-factor identity authorization system.'
        };
    }
  };

  const leftContent = getLeftText();

  return (
    <div id="applicant-auth-page" className="w-full min-h-screen flex flex-col md:flex-row bg-slate-950 text-white relative font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR (50% on desktop, styled high-end background) */}
      <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-screen flex flex-col justify-between p-8 sm:p-12 overflow-hidden border-b md:border-b-0 md:border-r border-slate-900/60 shrink-0">
        
        {/* Background Image with Parallax & Dark Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1920')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/30" />
        
        {/* Dynamic organic gradient/blur shape blobs */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

        {/* Company Logo Branding */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-950/90 border border-slate-800 rounded-2xl text-teal-400 shadow-xl">
              <Compass className="h-8 w-8 animate-spin-slow" style={{ color: primaryColor }} />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block">
                {settings.companyName || 'HYDROCEAN'}
              </span>
              <p className="text-[9px] font-mono tracking-widest text-teal-400/80 uppercase">MARITIME ROBOTICS LABS</p>
            </div>
          </div>

          {/* Repositioned Back Button below Logo in Left Panel */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-full text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-md group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>{getTranslation('btnBack', lang)}</span>
            </button>
          )}
        </div>

        {/* Core Marketing message & State Typography */}
        <div className="relative z-10 my-auto pt-12 md:pt-0 max-w-lg">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-sm">
              {view === 'login' && (lang === 'ur' ? 'سائن ان پورٹل' : 'Recruitment Pipeline')}
              {view === 'signup' && (lang === 'ur' ? 'رجسٹریشن پورٹل' : 'Registry Entry')}
              {view === 'verifyOtp' && (lang === 'ur' ? 'سیکورٹی چیک' : 'Identity Shield')}
              {view === 'forgot' && (lang === 'ur' ? 'رسائی کی بحالی' : 'Access Key Recovery')}
              {view === 'reset' && (lang === 'ur' ? 'پاس ورڈ تبدیلی' : 'Credential Reset')}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {leftContent.title}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed font-sans max-w-md">
              {leftContent.subtitle}
            </p>
          </motion.div>
        </div>

        {/* Dynamic Footer for branding credentials */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-900/50 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>© {new Date().getFullYear()} {settings.companyName || 'HYDROCEAN'}</span>
          <span className="tracking-widest text-teal-500/50 uppercase">Autonomous Systems Group</span>
        </div>
      </div>

      {/* RIGHT SIDE (50% on desktop, holds authentication form inside centered pane) */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-center relative p-6 sm:p-12 md:p-16 bg-slate-950 shrink-0">
        
        <div className="w-full max-w-md mx-auto space-y-6 pt-10 md:pt-0">
          
          {/* Header message for the right form */}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {view === 'login' && getTranslation('authLoginTitle', lang)}
              {view === 'signup' && getTranslation('authSignupTitle', lang)}
              {view === 'verifyOtp' && getTranslation('authVerifyOtpTitle', lang)}
              {view === 'forgot' && getTranslation('authForgotTitle', lang)}
              {view === 'reset' && getTranslation('authResetTitle', lang)}
            </h2>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              {view === 'login' && getTranslation('authLoginSub', lang)}
              {view === 'signup' && getTranslation('authSignupSub', lang)}
              {view === 'verifyOtp' && getTranslation('authVerifyOtpSub', lang)}
              {view === 'forgot' && getTranslation('authForgotSub', lang)}
              {view === 'reset' && getTranslation('authResetSub', lang)}
            </p>
          </div>

          {/* Alert Alerts Notifications */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-rose-950/40 border border-rose-500/30 text-rose-200 p-4 rounded-xl flex items-start gap-3 text-xs font-medium"
              >
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 p-4 rounded-xl flex items-start gap-3 text-xs font-medium"
              >
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= VIEW 1: LOGIN ================= */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {getTranslation('authEmail', lang)}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {getTranslation('authPassword', lang)}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={lang === 'ur' ? 'اکاؤنٹ کا پاس ورڈ درج کریں' : 'Enter account password'}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs font-sans text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs py-1">
                <label className="inline-flex items-center gap-2 text-slate-400 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-900 text-teal-600 focus:ring-0 cursor-pointer w-4 h-4"
                  />
                  <span>{getTranslation('authRemember', lang)}</span>
                </label>

                <button
                  type="button"
                  onClick={() => { resetMessages(); setView('forgot'); }}
                  className="font-semibold text-teal-400 hover:text-teal-300 cursor-pointer transition-colors"
                >
                  {getTranslation('authForgotBtn', lang)}
                </button>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 rounded-xl text-slate-950 font-bold uppercase tracking-widest text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{getTranslation('authLoginButton', lang)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                  </>
                )}
              </motion.button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800/80"></div>
                </div>
                <span className="relative px-3 bg-slate-950 text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">
                  {lang === 'ur' ? 'یا' : 'Or'}
                </span>
              </div>

              {googleClientId && !googleClientId.includes('your_google_client_id') ? (
                <div id="google-signin-btn-login" className="w-full flex justify-center py-1 min-h-[44px]"></div>
              ) : (
                <button
                  type="button"
                  onClick={() => setErrorMsg(lang === 'ur' ? 'گوگل کلائنٹ آئی ڈی تشکیل نہیں دی گئی ہے۔' : 'Google Client ID is not configured. Please define GOOGLE_CLIENT_ID in your environment variables to enable real Google authentication.')}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[44px]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.64-4.53-5.51-4.53z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>{getTranslation('authGoogleButton', lang)}</span>
                </button>
              )}

              <div className="mt-5 text-center text-xs text-slate-400">
                {getTranslation('authNoAccountText', lang)}{' '}
                <button
                  type="button"
                  onClick={() => { resetMessages(); setView('signup'); }}
                  className="font-bold text-teal-400 hover:text-teal-300 underline cursor-pointer ml-1 transition-colors"
                >
                  {getTranslation('authRegisterBtn', lang)}
                </button>
              </div>
            </form>
          )}

          {/* ================= VIEW 2: SIGNUP ================= */}
          {view === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    {getTranslation('authFirstName', lang)}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <User className="h-3.5 w-3.5" />
                    </span>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={lang === 'ur' ? 'پہلا نام' : 'John'}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-8 pr-3 text-xs font-sans text-white placeholder-slate-700 focus:outline-none focus:border-teal-500 transition-all min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    {getTranslation('authLastName', lang)}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <User className="h-3.5 w-3.5" />
                    </span>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={lang === 'ur' ? 'آخری نام' : 'Doe'}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-8 pr-3 text-xs font-sans text-white placeholder-slate-700 focus:outline-none focus:border-teal-500 transition-all min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {getTranslation('authEmail', lang)}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {getTranslation('authPassword', lang)}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={lang === 'ur' ? 'مضبوط پاس ورڈ درج کریں' : 'Create password (min 6 chars)'}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs font-sans text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-2 space-y-1 animate-fadeIn">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold font-mono">
                      <span>{lang === 'ur' ? 'پاس ورڈ کی مضبوطی' : 'Password Strength'}</span>
                      <span className={strength.pct === 100 ? 'text-emerald-400' : strength.pct >= 70 ? 'text-amber-400' : 'text-rose-400'}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${strength.color}`}
                        style={{ width: `${strength.pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {getTranslation('authConfirmPassword', lang)}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={lang === 'ur' ? 'پاس ورڈ کی تصدیق کریں' : 'Confirm your password'}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs font-sans text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 rounded-xl text-slate-950 font-bold uppercase tracking-widest text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>{getTranslation('authRegisterButton', lang)}</span>
                )}
              </motion.button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800/80"></div>
                </div>
                <span className="relative px-3 bg-slate-950 text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">
                  {lang === 'ur' ? 'یا' : 'Or'}
                </span>
              </div>

              {googleClientId && !googleClientId.includes('your_google_client_id') ? (
                <div id="google-signin-btn-signup" className="w-full flex justify-center py-1 min-h-[44px]"></div>
              ) : (
                <button
                  type="button"
                  onClick={() => setErrorMsg(lang === 'ur' ? 'گوگل کلائنٹ آئی ڈی تشکیل نہیں دی گئی ہے۔' : 'Google Client ID is not configured. Please define GOOGLE_CLIENT_ID in your environment variables to enable real Google authentication.')}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[44px]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.64-4.53-5.51-4.53z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>{getTranslation('authGoogleButton', lang)}</span>
                </button>
              )}

              <div className="mt-5 text-center text-xs text-slate-400">
                {getTranslation('authHasAccountText', lang)}{' '}
                <button
                  type="button"
                  onClick={() => { resetMessages(); setView('login'); }}
                  className="font-bold text-teal-400 hover:text-teal-300 underline cursor-pointer ml-1 transition-colors"
                >
                  {getTranslation('authLoginLink', lang)}
                </button>
              </div>
            </form>
          )}

          {/* ================= VIEW 3: VERIFY OTP ================= */}
          {view === 'verifyOtp' && (
            <div className="space-y-5 animate-fadeIn">
              {!isEditingEmail ? (
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
                  <span className="text-xs text-slate-400 font-sans block">
                    {lang === 'ur' ? 'تصدیقی کوڈ اس ای میل پر بھیجا گیا ہے:' : 'Verification Code Sent To'}
                  </span>
                  <span className="font-mono text-xs text-teal-300 font-bold tracking-wide block truncate">{email}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewEmailInput(email);
                      setIsEditingEmail(true);
                      resetMessages();
                    }}
                    className="text-[10px] text-teal-400 hover:text-teal-300 font-bold uppercase tracking-wider mt-1 cursor-pointer underline block mx-auto"
                  >
                    {lang === 'ur' ? '✏️ ای میل تبدیل کریں' : '✏️ Correct / Change Email'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleChangeEmail} className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <span className="text-xs text-slate-300 font-semibold font-sans block">
                    {lang === 'ur' ? 'ای میل ایڈریس درست کریں:' : 'Correct Email Address:'}
                  </span>
                  <input
                    type="email"
                    required
                    value={newEmailInput}
                    onChange={(e) => setNewEmailInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-teal-500 font-sans min-h-[44px]"
                    placeholder="new-email@example.com"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[10px] uppercase rounded-lg transition-all min-h-[36px]"
                    >
                      {getTranslation('authChangeEmailBtn', lang)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingEmail(false)}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] uppercase rounded-lg transition-all min-h-[36px]"
                    >
                      {lang === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                    </button>
                  </div>
                </form>
              )}

              {!isEditingEmail && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <label className="block text-center text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                      {getTranslation('authOtpLabel', lang)}
                    </label>
                    
                    <div className="flex justify-center max-w-xs mx-auto">
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        placeholder="000000"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 text-center text-white text-2xl font-mono tracking-[1.25rem] pl-[1.25rem] focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-bold placeholder:text-slate-800 placeholder:tracking-normal placeholder:font-sans placeholder:text-lg min-h-[50px]"
                      />
                    </div>
                    <p className="text-center text-[10px] text-slate-500 mt-2 font-sans">
                      {lang === 'ur' ? 'اپنی فائل کو فعال اور لاگ ان کرنے کے لیے توثیقی پن درج کریں۔' : 'Enter the validation pin code to activate and sign into your file.'}
                    </p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3.5 rounded-xl text-slate-950 font-bold uppercase tracking-widest text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {loading ? (
                      <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span>{getTranslation('authOtpVerifyButton', lang)}</span>
                    )}
                  </motion.button>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/40">
                    <span>
                      {countdown > 0 ? (
                        <span className="text-slate-500 font-sans">
                          {lang === 'ur' ? 'دوبارہ بھیجیں' : 'Resend in'} <strong>{countdown}s</strong>
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-sans">
                          {lang === 'ur' ? 'دوبارہ بھیجنے کے لیے تیار!' : 'Ready to resend!'}
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading || countdown > 0}
                      className="font-bold text-teal-400 hover:text-teal-300 disabled:text-slate-600 transition-colors flex items-center gap-1 cursor-pointer min-h-[44px]"
                    >
                      <RefreshCw className="w-3 h-3 animate-spin-slow" /> {getTranslation('authResendCodeBtn', lang)}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { resetMessages(); setView('login'); }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-400 transition-colors underline cursor-pointer"
                    >
                      {getTranslation('authBackToLogin', lang)}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ================= VIEW 4: FORGOT PASSWORD ================= */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {getTranslation('authEmail', lang)}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={lang === 'ur' ? 'اپنا رجسٹرڈ ای میل درج کریں' : 'Enter registered email'}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all min-h-[44px]"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 rounded-xl text-slate-950 font-bold uppercase tracking-widest text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>{getTranslation('authSendRecoveryBtn', lang)}</span>
                )}
              </motion.button>

              <div className="mt-5 text-center text-xs text-slate-400">
                {lang === 'ur' ? 'لاگ ان پر' : 'Return to'}{' '}
                <button
                  type="button"
                  onClick={() => { resetMessages(); setView('login'); }}
                  className="font-bold text-teal-400 hover:text-teal-300 underline cursor-pointer ml-1 transition-colors"
                >
                  {getTranslation('authLoginLink', lang)}
                </button>
              </div>
            </form>
          )}

          {/* ================= VIEW: RESET PASSWORD VERIFY OTP ================= */}
          {view === 'resetVerify' && (
            <form onSubmit={handleVerifyResetOtp} className="space-y-5 animate-fadeIn">
              <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
                <span className="text-xs text-slate-400 font-sans block">
                  {lang === 'ur' ? 'ری سیٹ کوڈ اس ای میل پر بھیجا گیا ہے:' : 'Reset Code Sent To'}
                </span>
                <span className="font-mono text-xs text-teal-300 font-bold tracking-wide block truncate">{email}</span>
              </div>

              <div>
                <label className="block text-center text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                  {lang === 'ur' ? 'ری سیٹ او ٹی پی کوڈ درج کریں:' : 'Enter Reset OTP Code:'}
                </label>
                
                <div className="flex justify-center max-w-xs mx-auto">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="000000"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 text-center text-white text-2xl font-mono tracking-[1.25rem] pl-[1.25rem] focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-bold placeholder:text-slate-800 placeholder:tracking-normal placeholder:font-sans placeholder:text-lg min-h-[50px]"
                  />
                </div>
                <p className="text-center text-[10px] text-slate-500 mt-2 font-sans">
                  {lang === 'ur' ? 'پاس ورڈ کو دوبارہ ترتیب دینے کے لیے اپنی ای میل پر بھیجا گیا 6 ہندسوں کا کوڈ درج کریں۔' : 'Enter the 6-digit pin code sent to your email to verify and reset your password.'}
                </p>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 rounded-xl text-slate-950 font-bold uppercase tracking-widest text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>{lang === 'ur' ? 'او ٹی پی کی تصدیق کریں' : 'Verify Reset OTP'}</span>
                )}
              </motion.button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { resetMessages(); setView('login'); }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-400 transition-colors underline cursor-pointer"
                >
                  {getTranslation('authBackToLogin', lang)}
                </button>
              </div>
            </form>
          )}

          {/* ================= VIEW 5: RESET PASSWORD ================= */}
          {view === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {getTranslation('authResetTokenLabel', lang)}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <KeyRound className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    readOnly
                    disabled
                    maxLength={6}
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value.replace(/\D/g, ''))}
                    placeholder={lang === 'ur' ? '6 ہندسوں کا ری سیٹ او ٹی پی درج کریں' : 'Enter 6-digit reset OTP'}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-teal-300 opacity-60 focus:outline-none transition-all min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {getTranslation('authNewPasswordLabel', lang)}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={lang === 'ur' ? 'نیا پاس ورڈ درج کریں (کم از کم 6 حروف)' : 'Enter new password (min 6 chars)'}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs font-sans text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 rounded-xl text-slate-950 font-bold uppercase tracking-widest text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>{getTranslation('authUpdateCredentialsBtn', lang)}</span>
                )}
              </motion.button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
