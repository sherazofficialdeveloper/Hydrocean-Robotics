/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Compass, Shield, Zap, RefreshCw, Cpu, Activity, Server } from 'lucide-react';
import { WebsiteSettings } from '../types';
import { Language, getTranslation } from '../lib/translations';

interface AboutPreviewProps {
  settings: WebsiteSettings;
  lang: Language;
  onExploreMore: () => void;
}

export default function AboutPreview({ settings, lang, onExploreMore }: AboutPreviewProps) {
  const primaryColor = settings.primaryColor || '#009ca6';

  // Premium Coordinated Card Hover Variants
  const cardHoverVariants: any = {
    initial: {
      y: 0,
      scale: 1,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
      borderColor: "rgba(226, 232, 240, 1)" // gray-200
    },
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 12px 16px -8px rgba(0, 0, 0, 0.06)",
      borderColor: primaryColor,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const iconHoverVariants: any = {
    initial: {
      rotateY: 0,
      scale: 1,
      backgroundColor: "#ffffff",
      color: primaryColor,
      transition: { duration: 0.4 }
    },
    hover: {
      rotateY: 360,
      scale: 1.12,
      backgroundColor: primaryColor,
      color: "#ffffff",
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-gray-100" id="about-preview">
      {/* Visual background accents */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-teal-50/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-cyan-50/25 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600" style={{ color: primaryColor }}>
            {lang === 'ur' ? 'ٹیکنالوجی کا جائزہ' : 'Pioneering Marine Platforms'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
            {lang === 'ur' ? 'جدید خود مختار بحری نظام' : 'Our Autonomous Marine Fleet'}
          </h2>
          <div className="w-12 h-1 bg-teal-600 mx-auto mt-4" style={{ backgroundColor: primaryColor }}></div>
          <p className="text-gray-600 mt-6 leading-relaxed text-sm font-sans">
            {lang === 'ur'
              ? 'ہائیڈروشن سمندری حدود کی حفاظت، ڈیٹا معیشت، اور ماحولیاتی تحقیق کے لیے جدید ترین سطحی اور زیر آب خود مختار نظام تیار کرتا ہے۔'
              : 'Hydrocean designs and deploys next-generation surface and subsea robotic platforms to solve complex marine tasks with absolute precision.'}
          </p>
        </div>

        {/* Dual Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          
          {/* Card 1: USV */}
          <motion.div
            variants={cardHoverVariants}
            initial="initial"
            whileHover="hover"
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            className="bg-slate-50 border border-gray-150 rounded-3xl p-8 flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Header block with Custom SVG Icon */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-wider font-bold uppercase text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full animate-pulse" style={{ color: primaryColor, backgroundColor: primaryColor + '10' }}>
                    {lang === 'ur' ? 'سطحی جہاز' : 'Surface Vessel'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mt-3">
                    {lang === 'ur' ? 'غیر انسانی سطح کی گاڑی (USV)' : 'Unmanned Surface Vehicle (USV)'}
                  </h3>
                </div>
                
                {/* Premium Animated Icon / Graphic */}
                <motion.div 
                  variants={iconHoverVariants}
                  className="p-4 rounded-2xl border border-gray-100 shadow-sm shrink-0 flex items-center justify-center"
                >
                  <svg className="h-10 w-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 36H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 36L10 24H38L42 36H6Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M16 24V14H24V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="20" cy="8" r="2" fill="currentColor"/>
                    <path d="M28 24V18H32V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 30C12 30 15 28 18 30C21 32 24 30 24 30C24 30 27 28 30 30C33 32 36 30 36 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </motion.div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4 font-sans text-xs text-gray-600 mb-8 border-t border-gray-100 pt-6">
                
                <div>
                  <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 mb-1.5">
                    <Compass className="h-4 w-4" style={{ color: primaryColor }} />
                    {lang === 'ur' ? 'یو ایس وی (USV) کیا ہے؟' : 'What is a USV?'}
                  </h4>
                  <p className="leading-relaxed pl-5.5">
                    {lang === 'ur'
                      ? 'یو ایس وی ایک خود مختار روبوٹک کشتی ہے جو انسانی عملے کے بغیر پانی کی سطح پر کام کرتی ہے۔'
                      : 'An autonomous surface robotic ship that operates on the water surface without human crew, serving as a versatile oceanic host.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 mb-1.5">
                    <Zap className="h-4 w-4" style={{ color: primaryColor }} />
                    {lang === 'ur' ? 'یہ کیوں استعمال کیا جاتا ہے؟' : 'Why is it used?'}
                  </h4>
                  <p className="leading-relaxed pl-5.5">
                    {lang === 'ur'
                      ? 'یہ انسانی پائلٹوں کی حفاظت کو یقینی بنانے، مسلسل نگرانی کرنے اور آپریشنل اخراجات کو نمایاں طور پر کم کرنے کے لیے استعمال ہوتا ہے۔'
                      : 'To eliminate crew safety risks in hazardous seas, run continuous long-endurance operations, and vastly reduce logistic overheads.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 mb-1.5">
                    <Shield className="h-4 w-4" style={{ color: primaryColor }} />
                    {lang === 'ur' ? 'اہم فوائد اور اصول کار' : 'Main Advantages & Working'}
                  </h4>
                  <p className="leading-relaxed pl-5.5">
                    {lang === 'ur'
                      ? 'اعلی ایندھن کارکردگی، خودکار نیویگیشن، اور ریئل ٹائم سیٹلائٹ کلاؤڈ مواصلاتی نظام کے ذریعے مشن کنٹرول۔'
                      : 'Offers high stability, carbon-free propulsion, and continuous telemetry syncing via autonomous satellite links.'}
                  </p>
                </div>

              </div>
            </div>

            {/* Action CTA Button with Premium micro-interactions */}
            <div className="mt-2">
              <motion.button
                whileHover={{ 
                  scale: 1.04, 
                  backgroundColor: primaryColor, 
                  boxShadow: "0 10px 25px -5px rgba(0, 156, 166, 0.4)" 
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={onExploreMore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer group transition-all"
              >
                <span>{lang === 'ur' ? 'مزید دریافت کریں' : 'Explore More Details'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>

          {/* Card 2: AUV */}
          <motion.div
            variants={cardHoverVariants}
            initial="initial"
            whileHover="hover"
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            className="bg-slate-50 border border-gray-150 rounded-3xl p-8 flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Header block with Custom SVG Icon */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-wider font-bold uppercase text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full animate-pulse" style={{ color: primaryColor, backgroundColor: primaryColor + '10' }}>
                    {lang === 'ur' ? 'زیر آب نظام' : 'Subsea System'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mt-3">
                    {lang === 'ur' ? 'خود مختار زیر آب گاڑی (AUV)' : 'Autonomous Underwater Vehicle (AUV)'}
                  </h3>
                </div>
                
                {/* Premium Animated Icon / Graphic */}
                <motion.div 
                  variants={iconHoverVariants}
                  className="p-4 rounded-2xl border border-gray-100 shadow-sm shrink-0 flex items-center justify-center"
                >
                  <svg className="h-10 w-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
                    <path d="M10 24C10 24 16 16 24 16C32 16 38 24 38 24C38 24 32 32 24 32C16 32 10 24 10 24Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    <circle cx="24" cy="24" r="5" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M24 11V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M22 7H26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </motion.div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4 font-sans text-xs text-gray-600 mb-8 border-t border-gray-100 pt-6">
                
                <div>
                  <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 mb-1.5">
                    <Compass className="h-4 w-4" style={{ color: primaryColor }} />
                    {lang === 'ur' ? 'اے یو وی (AUV) کیا ہے؟' : 'What is an AUV?'}
                  </h4>
                  <p className="leading-relaxed pl-5.5">
                    {lang === 'ur'
                      ? 'اے یو وی ایک خود مختار روبوٹک آبدوز ہے جو انسانی ہاتھ کے بغیر پانی کے اندر گہرائی میں مشنز انجام دیتی ہے۔'
                      : 'A self-piloted underwater robotic submersible that swims through ocean depths independently to perform designated search/research paths.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 mb-1.5">
                    <Zap className="h-4 w-4" style={{ color: primaryColor }} />
                    {lang === 'ur' ? 'یہ کیوں استعمال کیا جاتا ہے؟' : 'Why is it used?'}
                  </h4>
                  <p className="leading-relaxed pl-5.5">
                    {lang === 'ur'
                      ? 'گہرے سمندر کے خطرات، ملبے کی تلاش، پائپ لائن کے نقائص، اور ہائی ریزولوشن تھری ڈی نقشہ سازی کے لیے۔'
                      : 'To gather physical parameters, detect structural issues on deep-sea pipelines, map deep fault lines, and trace subsea anomalies.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 mb-1.5">
                    <Shield className="h-4 w-4" style={{ color: primaryColor }} />
                    {lang === 'ur' ? 'نمایاں خصوصیات اور اصول کار' : 'Main Features & Working'}
                  </h4>
                  <p className="leading-relaxed pl-5.5">
                    {lang === 'ur'
                      ? 'ہائی پریشر برداشت کرنے والا چیمبر، سونار سینسرز، تھری ڈی پاتھ ٹریکنگ، اور خود کار طریقے سے چارجنگ بیسز۔'
                      : 'Equipped with pressure hulls, multibeam sonar arrays, long-lasting battery files, and smart pre-programmed return-home filters.'}
                  </p>
                </div>

              </div>
            </div>

            {/* Action CTA Button with Premium micro-interactions */}
            <div className="mt-2">
              <motion.button
                whileHover={{ 
                  scale: 1.04, 
                  backgroundColor: primaryColor, 
                  boxShadow: "0 10px 25px -5px rgba(0, 156, 166, 0.4)" 
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={onExploreMore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer group transition-all"
              >
                <span>{lang === 'ur' ? 'مزید دریافت کریں' : 'Explore More Details'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
