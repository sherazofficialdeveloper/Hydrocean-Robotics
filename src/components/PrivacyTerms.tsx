/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { WebsiteSettings } from '../types';

interface PrivacyTermsProps {
  type: 'privacy' | 'terms';
  settings: WebsiteSettings;
  lang: 'en' | 'ur';
  onBack: () => void;
}

export default function PrivacyTerms({ type, settings, lang, onBack }: PrivacyTermsProps) {
  const primaryColor = settings.primaryColor || '#009ca6';
  const isUrdu = lang === 'ur';

  const content = {
    privacy: {
      title: isUrdu ? 'رازداری کی پالیسی' : 'Privacy Policy',
      subtitle: isUrdu 
        ? 'ہم آپ کی رازداری اور ذاتی معلومات کے تحفظ کے لیے پرعزم ہیں۔' 
        : 'We are committed to protecting your privacy and personal information.',
      lastUpdated: isUrdu ? 'آخری بار اپ ڈیٹ کیا گیا: جون 2026' : 'Last Updated: June 2026',
      sections: [
        {
          heading: isUrdu ? '1. معلومات جو ہم جمع کرتے ہیں' : '1. Information We Collect',
          text: isUrdu 
            ? 'ہم آپ کی رجسٹریشن، ملازمت کی درخواستوں، اور ادائیگی کے ثبوت (جیسے بینک ڈپازٹ سلپ) کے دوران ذاتی معلومات جمع کرتے ہیں جس میں نام، شناختی کارڈ نمبر، ای میل، فون نمبر اور تعلیمی اسناد شامل ہیں۔'
            : 'We collect personal information when you register, apply for a job, or upload verification files (such as deposit slips). This includes your name, National ID (CNIC), email address, phone number, and resume data.'
        },
        {
          heading: isUrdu ? '2. ہم آپ کی معلومات کا استعمال کیسے کرتے ہیں' : '2. How We Use Your Information',
          text: isUrdu
            ? 'جمع کی گئی معلومات کو خصوصی طور پر آپ کی ملازمت کی درخواستوں کی پروسیسنگ، ڈپازٹ سلپ کی تصدیق، اور بھرتی کے عمل سے متعلق آپ سے رابطے کے لیے استعمال کیا جاتا ہے۔'
            : 'The information collected is used solely for processing your job applications, verifying application fee payment deposit slips, and communicating recruitment-related updates to you.'
        },
        {
          heading: isUrdu ? '3. ڈیٹا کی حفاظت' : '3. Data Security',
          text: isUrdu
            ? 'ہم آپ کی معلومات کو غیر مجاز رسائی، تبدیلی، یا افشا ہونے سے بچانے کے لیے انڈسٹری معیار کے حفاظتی اقدامات جیسے کہ انکرپشن اور محفوظ ڈیٹا بیسز کا استعمال کرتے ہیں۔'
            : 'We employ industry-standard security measures, including database encryption, access control tokens, and SSL transactions to protect your data from unauthorized access, loss, or disclosure.'
        },
        {
          heading: isUrdu ? '4. فریقِ ثالث کے ساتھ شیئرنگ' : '4. Third-Party Sharing',
          text: isUrdu
            ? 'ہم آپ کی ذاتی معلومات کو کسی بھی فریقِ ثالث کو فروخت یا شیئر نہیں کرتے، سوائے ان سروسز کے جن کی قانوناً یا تصدیقی عمل کے لیے ضرورت ہو۔'
            : 'We do not sell, rent, or share applicant personal information with third-party organizations except as strictly necessary to complete verify payments or satisfy regulatory audits.'
        }
      ]
    },
    terms: {
      title: isUrdu ? 'شرائط و ضوابط' : 'Terms & Conditions',
      subtitle: isUrdu 
        ? 'بھرتی کے پورٹل کو استعمال کرنے سے پہلے ان شرائط کو دھیان سے پڑھیں۔' 
        : 'Please read these terms and conditions carefully before using our portal.',
      lastUpdated: isUrdu ? 'آخری بار اپ ڈیٹ کیا گیا: جون 2026' : 'Last Updated: June 2026',
      sections: [
        {
          heading: isUrdu ? '1. درخواست دہندگان کی ذمہ داری' : '1. Candidate Responsibility',
          text: isUrdu
            ? 'درخواست دہندہ اس بات کو یقینی بنانے کا پابند ہے کہ فراہم کردہ تمام اسناد، سی وی، اور بینک ڈپازٹ سلپ کی معلومات بالکل درست اور سچی ہیں۔ کسی بھی غلط معلومات کی صورت میں درخواست فوری طور پر مسترد کی جا سکتی ہے۔'
            : 'Candidates must ensure that all provided CV files, qualifications, identity numbers, and bank deposit slips are genuine and accurate. Providing false or altered information will lead to immediate disqualification.'
        },
        {
          heading: isUrdu ? '2. رجسٹریشن اور پروسیسنگ فیس' : '2. Application Processing Fees',
          text: isUrdu
            ? 'ملازمت کی درخواستوں کی جانچ اور تصدیق کے لیے مقررہ فیس ناقابلِ واپسی ہے، چاہے درخواست قبول ہو یا مسترد۔'
            : 'The application processing fee is strictly non-refundable and non-transferable under all circumstances, regardless of whether the applicant is selected for interviews or ultimately hired.'
        },
        {
          heading: isUrdu ? '3. پورٹل کا درست استعمال' : '3. Fair Use & Prohibited Acts',
          text: isUrdu
            ? 'صارفین پورٹل کو صرف جائز ملازمت کی درخواستوں کے لیے استعمال کر سکتے ہیں۔ کسی بھی قسم کے ہیکنگ، اسپیمنگ یا سسٹم کے ساتھ چھیڑ چھاڑ کی کوشش پر قانونی کارروائی عمل میں لائی جائے گی۔'
            : 'Users agree to utilize the portal strictly for legitimate career applications. Any attempt to upload malicious files, duplicate bank slips for multiple applications, or interfere with system functions is strictly prohibited.'
        },
        {
          heading: isUrdu ? '4. ذمہ داری کی حد' : '4. Limitation of Liability',
          text: isUrdu
            ? 'کمپنی بھرتی کے حتمی فیصلے کا مکمل حق محفوظ رکھتی ہے اور کسی بھی وجہ سے کسی بھی درخواست دہندہ کو رد کرنے پر جوابدہ نہیں ہے۔'
            : 'The company reserves the absolute right to make final selection decisions and is not liable for any losses, expenses, or damages resulting from non-selection or delayed application processing.'
        }
      ]
    }
  };

  const activeContent = content[type];

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 text-left" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-800 transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className={`h-4 w-4 ${isUrdu ? 'rotate-180' : ''}`} />
          <span>{isUrdu ? 'واپس جائیں' : 'Back to Home'}</span>
        </button>

        {/* Paper card container */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: primaryColor }}></div>

          <div className="flex items-center space-x-4 space-x-reverse mb-6">
            <div className="p-3 rounded-2xl bg-teal-50 text-teal-600" style={{ color: primaryColor, backgroundColor: primaryColor + '10' }}>
              {type === 'privacy' ? <Shield className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-teal-600 uppercase" style={{ color: primaryColor }}>
                {isUrdu ? 'قانونی معلومات' : 'Legal Agreements'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 mt-0.5">
                {activeContent.title}
              </h1>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {activeContent.subtitle}
          </p>

          <span className="inline-block text-[10px] font-mono text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 mb-8">
            {activeContent.lastUpdated}
          </span>

          <div className="space-y-8 border-t border-gray-100 pt-8">
            {activeContent.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="font-display font-bold text-base text-gray-950 flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-teal-500 flex-shrink-0" style={{ color: primaryColor }} />
                  <span>{sec.heading}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans pl-6.5 pr-6.5">
                  {sec.text}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-10 pt-8 text-center text-[10px] font-mono text-gray-400">
            {isUrdu 
              ? `اگر آپ کا کوئی سوال ہے تو براہ کرم ہم سے رابطہ کریں۔` 
              : `If you have any questions regarding these agreements, please contact our administration.`}
          </div>
        </div>
      </div>
    </div>
  );
}
