/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { WebsiteSettings } from '../types';

interface ErrorPagesProps {
  type: '404' | 'unauthorized';
  settings: WebsiteSettings;
  lang: 'en' | 'ur';
  onGoHome: () => void;
  onBack?: () => void;
}

export default function ErrorPages({ type, settings, lang, onGoHome, onBack }: ErrorPagesProps) {
  const primaryColor = settings.primaryColor || '#009ca6';
  const isUrdu = lang === 'ur';

  const details = {
    '404': {
      title: '404',
      badge: isUrdu ? 'صفحہ نہیں ملا' : 'Page Not Found',
      heading: isUrdu ? 'مطلوبہ صفحہ دستیاب نہیں ہے' : 'Lost in the Deep Sea',
      desc: isUrdu 
        ? 'معذرت، جو صفحہ آپ تلاش کر رہے ہیں وہ وجود نہیں رکھتا یا اسے منتقل کر دیا گیا ہے۔'
        : 'The page coordinates you entered do not exist on our servers, or the link has expired.',
      cta: isUrdu ? 'ہوم پیج پر جائیں' : 'Return to Surface'
    },
    'unauthorized': {
      title: '403',
      badge: isUrdu ? 'غیر مجاز رسائی' : 'Access Denied',
      heading: isUrdu ? 'آپ کو اس صفحہ تک رسائی حاصل نہیں ہے' : 'Access Denied',
      desc: isUrdu
        ? 'آپ کے پاس اس صفحہ تک رسائی کی اجازت نہیں ہے۔'
        : 'You do not have permission to access this page.',
      cta: isUrdu ? 'ہوم پیج پر واپس جائیں' : 'Return to Home'
    }
  };

  const active = details[type];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16 text-center select-none relative overflow-hidden font-sans">
      {/* Dynamic Grid Background Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>
      
      {/* Decorative Glow Ring */}
      <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-10" style={{ backgroundColor: primaryColor }}></div>

      <div className="max-w-md w-full relative z-10 space-y-8">
        
        {/* Animated Icon Emblem */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="w-24 h-24 mx-auto rounded-3xl border border-slate-800 bg-slate-900/80 flex items-center justify-center shadow-xl"
        >
          {type === '404' ? (
            <AlertCircle className="h-12 w-12 text-teal-400" style={{ color: primaryColor }} />
          ) : (
            <ShieldAlert className="h-12 w-12 text-rose-500" />
          )}
        </motion.div>

        {/* Huge Display Code */}
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-8xl sm:text-9xl font-display font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-700 select-none"
          >
            {active.title}
          </motion.h1>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-400 bg-teal-950 border border-teal-900/60 px-3.5 py-1 rounded-full inline-block"
            style={{ color: primaryColor, borderColor: primaryColor + '30' }}
          >
            {active.badge}
          </motion.span>
        </div>

        {/* Narrative Text */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-100">{active.heading}</h2>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-sans">
            {active.desc}
          </p>
        </div>

        {/* Action Button Set */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {onBack && (
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3 border border-slate-800 hover:border-slate-700 bg-slate-900 hover:bg-slate-850 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{isUrdu ? 'پیچھے جائیں' : 'Back'}</span>
            </button>
          )}
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 font-sans transition hover:scale-105 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            <Home className="h-4 w-4" />
            <span>{active.cta}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
