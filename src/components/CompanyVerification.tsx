/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, ExternalLink, Award, Building2 } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface CompanyVerificationProps {
  settings: WebsiteSettings;
  lang: 'en' | 'ur';
}

export default function CompanyVerification({ settings, lang }: CompanyVerificationProps) {
  const [copiedField, setCopiedField] = useState<'reg' | 'cert' | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const isUrdu = lang === 'ur';
  const primaryColor = settings.primaryColor || '#009ca6';

  const regNumber = settings.companyRegNumber || 'SEC-2026-089765';
  const certNumber = settings.companyCertNumber || 'CERT-65432-PK';
  const regUrl = settings.companyRegUrl || 'https://secp.gov.pk';
  const legalName = settings.companyLegalName || 'Hydrocean Robotics (Private) Limited';
  const regDesc = settings.companyRegDesc || (isUrdu
    ? 'ہائیڈروسیئن روبوٹکس باقاعدہ طور پر سیکیورٹیز اینڈ ایکسچینج کمیشن آف پاکستان کے تحت رجسٹرڈ ہے اور بحری اور ذیلی سمندری روبوٹکس کا مجاز ادارہ ہے۔'
    : 'Hydrocean Robotics is officially incorporated and registered under the Companies Act as a technology provider for marine and autonomous subsea exploration systems.');

  const handleCopy = (text: string, field: 'reg' | 'cert') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setShowNotification(true);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
    setTimeout(() => {
      setShowNotification(false);
    }, 3500);
  };

  const handleVerifyClick = () => {
    // Copy the Registration Number to the clipboard
    navigator.clipboard.writeText(regNumber);
    setCopiedField('reg');
    setShowNotification(true);
    
    // Open verification url
    window.open(regUrl, '_blank', 'noopener,noreferrer');
    
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  return (
    <section className="py-20 bg-slate-50 border-t border-b border-gray-100/60 font-sans relative overflow-hidden" id="company-verification-home">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left" dir={isUrdu ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left info column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full" style={{ backgroundColor: primaryColor + '10', borderColor: primaryColor + '20' }}>
              <ShieldCheck className="h-4 w-4 text-teal-600" style={{ color: primaryColor }} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-700" style={{ color: primaryColor }}>
                {isUrdu ? 'سرکاری رجسٹریشن کی تصدیق' : 'Official Credentials'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-gray-900 tracking-tight">
              {isUrdu ? 'ہمارا کمپنی رجسٹریشن تصدیق' : 'Verify Our Company Registration'}
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl font-sans">
              {regDesc}
            </p>

            {/* Micro Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white border border-gray-150 p-4 rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                  {isUrdu ? 'کمپنی کا قانونی نام' : 'Company Legal Name'}
                </span>
                <span className="font-display font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  {legalName}
                </span>
              </div>

              <div className="bg-white border border-gray-150 p-4 rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                  {isUrdu ? 'رجسٹریشن سٹیٹس' : 'Registration Status'}
                </span>
                <span className="font-display font-bold text-emerald-600 text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {isUrdu ? 'سرکاری طور پر رجسٹرڈ' : 'Active / Fully Registered'}
                </span>
              </div>
            </div>
          </div>

          {/* Right interactive card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col justify-between">
              {/* Decorative side accent */}
              <div className="absolute top-0 bottom-0 left-0 w-1.5" style={{ backgroundColor: primaryColor }}></div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600 border border-gray-100">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gray-900 text-sm">
                      {isUrdu ? 'کارپوریٹ اسناد' : 'Incorporation Records'}
                    </h4>
                    <p className="text-[10px] text-gray-400">{isUrdu ? 'سرکاری شناخت اور نمبرز' : 'Official registration identifiers'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Registration Number Item */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                      {isUrdu ? 'رجسٹریشن نمبر' : 'Registration Number'}
                    </label>
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-150 rounded-xl p-3 font-mono text-xs text-gray-800">
                      <span>{regNumber}</span>
                      <button
                        onClick={() => handleCopy(regNumber, 'reg')}
                        className="p-1.5 text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                        title={isUrdu ? 'کاپی کریں' : 'Copy Number'}
                      >
                        {copiedField === 'reg' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Certificate Number Item */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                      {isUrdu ? 'سرٹیفکیٹ نمبر' : 'Certificate Number'}
                    </label>
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-150 rounded-xl p-3 font-mono text-xs text-gray-800">
                      <span>{certNumber}</span>
                      <button
                        onClick={() => handleCopy(certNumber, 'cert')}
                        className="p-1.5 text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                        title={isUrdu ? 'کاپی کریں' : 'Copy Number'}
                      >
                        {copiedField === 'cert' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleVerifyClick}
                  className="w-full py-3.5 px-4 rounded-xl font-bold uppercase tracking-wider text-xs text-white shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>{isUrdu ? 'رجسٹریشن کی تصدیق کریں' : 'Verify Registration'}</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Clipboard Copy Toast Notification */}
        {showNotification && (
          <div className="fixed bottom-20 right-4 md:right-8 z-[150] bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-fade-in font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>
              {isUrdu
                ? 'رجسٹریشن نمبر کاپی ہو گیا۔ براہ کرم اسے پورٹل پر پیسٹ کریں۔'
                : 'Registration Number copied to clipboard! Opening official verification portal...'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
