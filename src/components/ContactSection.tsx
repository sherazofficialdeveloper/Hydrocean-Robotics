/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { OfficeContact, WebsiteSettings } from '../types';
import { Language, getTranslation } from '../lib/translations';

interface ContactSectionProps {
  officeContact: OfficeContact;
  settings: WebsiteSettings;
  lang: Language;
}

export default function ContactSection({ officeContact, settings, lang }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const primaryColor = settings.primaryColor || '#009ca6';

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setErrorMsg('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch query.');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 border-t border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600" style={{ color: primaryColor }}>
            {lang === 'ur' ? 'رابطہ کریں' : 'Get In Touch'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
            {getTranslation('contactHeadingCustom', lang)}
          </h2>
          <div className="w-12 h-1 bg-teal-600 mx-auto mt-4" style={{ backgroundColor: primaryColor }}></div>
          <p className="text-gray-600 mt-6 leading-relaxed text-sm font-sans">
            {lang === 'ur'
              ? 'کیا آپ کے پاس بین الاقوامی پروگرامز، فعال فیلڈ ٹرائلز، یا سبسی تھرسٹرز کے بارے میں سوالات ہیں؟ ہمیں براہ راست پیغام بھیجیں۔'
              : 'Have queries regarding international programs, active field trials, or subsea thrusters? Message us directly.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: OFFICE DIRECTORY DETAILS */}
          <div className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="font-display font-bold text-base text-gray-950 border-b border-gray-100 pb-4">
                {getTranslation('contactOfficeTitle', lang)}
              </h3>
              
              <div className="space-y-6 text-xs font-sans text-gray-600">
                
                {/* Address */}
                <div className="flex space-x-3.5 items-start">
                  <div className="p-2 bg-slate-50 text-teal-600 rounded-xl border border-gray-100 shrink-0" style={{ color: primaryColor }}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">{getTranslation('contactAddressLabel', lang)}</span>
                    <p className="mt-1 leading-relaxed">{officeContact.address}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex space-x-3.5 items-start">
                  <div className="p-2 bg-slate-50 text-teal-600 rounded-xl border border-gray-100 shrink-0" style={{ color: primaryColor }}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">{getTranslation('contactEmailLabel', lang)}</span>
                    <p className="mt-1 leading-relaxed font-mono text-teal-700">{officeContact.email}</p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex space-x-3.5 items-start">
                  <div className="p-2 bg-slate-50 text-teal-600 rounded-xl border border-gray-100 shrink-0" style={{ color: primaryColor }}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">{getTranslation('contactHoursLabel', lang)}</span>
                    <p className="mt-1 leading-relaxed">{officeContact.workingHours}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT: SECURE CONTACT FORM */}
          <form onSubmit={handleContactSubmit} className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-5 text-xs font-sans">
            <h3 className="font-display font-bold text-base text-gray-950 border-b border-gray-100 pb-4">
              {getTranslation('contactFormHeadingCustom', lang)}
            </h3>
            
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start space-x-2.5 text-emerald-800 animate-fade-in">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="font-semibold leading-relaxed">{getTranslation('contactFormSuccessCustom', lang)}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs font-semibold text-rose-800 animate-fade-in">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-500 mb-1.5 font-semibold">{getTranslation('contactFieldNameCustom', lang)}</label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ur' ? 'اپنا نام درج کریں' : 'Enter your name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1.5 font-semibold">{getTranslation('contactFieldEmailCustom', lang)}</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 mb-1.5 font-semibold">{getTranslation('contactFieldSubjectCustom', lang)}</label>
              <input
                type="text"
                required
                placeholder={lang === 'ur' ? 'انکوائری کا خلاصہ' : 'Brief summary of query'}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-500 mb-1.5 font-semibold">{getTranslation('contactFieldMessageCustom', lang)}</label>
              <textarea
                required
                rows={4}
                placeholder={lang === 'ur' ? 'اپنا سوال یا تبصرہ تفصیل سے لکھیں...' : 'Detail your question or comment...'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-teal-500 transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl text-white font-bold uppercase tracking-widest hover:shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {submitting ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>{getTranslation('contactSendBtn', lang)}</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </section>
  );
}
