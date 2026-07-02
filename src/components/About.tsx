/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Target, 
  Eye, 
  Shield, 
  Award, 
  Users, 
  Navigation, 
  Camera, 
  Radio, 
  Cpu, 
  Battery, 
  Zap, 
  Activity, 
  Layers, 
  Database, 
  Server, 
  Anchor, 
  CheckCircle, 
  ChevronRight, 
  PhoneCall, 
  Search,
  Wifi,
  Waves,
  Hammer
} from 'lucide-react';
import { WebsiteSettings } from '../types';
import { Language } from '../lib/translations';

interface AboutProps {
  settings: WebsiteSettings;
  lang: Language;
}

export default function About({ settings, lang }: AboutProps) {
  const primaryColor = settings.primaryColor || '#009ca6';
  const [activeTab, setActiveTab] = useState<'usv' | 'auv'>('usv');

  // Coordinated Premium Card Hover Variants
  const cardHoverVariants: any = {
    initial: {
      y: 0,
      scale: 1,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
      borderColor: "rgba(226, 232, 240, 1)"
    },
    hover: {
      y: -8,
      scale: 1.025,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      borderColor: primaryColor,
      transition: { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }
    }
  };

  const iconHoverVariants: any = {
    initial: {
      rotateY: 0,
      scale: 1,
      backgroundColor: "#f8fafc", // bg-slate-50
      color: primaryColor,
      transition: { duration: 0.3 }
    },
    hover: {
      rotateY: 360,
      scale: 1.12,
      backgroundColor: primaryColor,
      color: "#ffffff",
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  // Interactive USV components data
  const usvComponents = [
    { name: lang === 'ur' ? 'میرین جی پی ایس' : 'Marine GPS / RTK', Icon: Navigation, desc: lang === 'ur' ? 'انٹیگریٹڈ گلوبل پوزیشننگ سسٹم جو سینٹی میٹر کی سطح پر درستگی فراہم کرتا ہے۔' : 'Multi-frequency global positioning offering centimetre-level real-time navigation.' },
    { name: lang === 'ur' ? 'تھری ڈی کیمرے' : 'HD & Thermal Cameras', Icon: Camera, desc: lang === 'ur' ? 'دھند، رات اور طوفانی حالات میں دیکھنے کے لیے نائٹ ویژن کیمرے سسٹمز۔' : 'Dual optical and thermal vision engines for remote piloting and active obstacle detection.' },
    { name: lang === 'ur' ? 'سمندری سینسرز' : 'Environmental Sensors', Icon: Activity, desc: lang === 'ur' ? 'پانی کے درجہ حرارت، نمکیات اور آلودگی کو ماپنے والے مربوط سینسرز۔' : 'Real-time multi-spectral sensor probes for continuous water quality tracking.' },
    { name: lang === 'ur' ? 'مواصلاتی ماڈیول' : 'RF & Satellite Transceiver', Icon: Radio, desc: lang === 'ur' ? 'کلاؤڈ بیس کنٹرول کے لیے سیٹلائٹ اور ایل ٹی ای ہائی فریکوینسی روابط۔' : 'Long-range radio frequencies backed by global satellite communications.' },
    { name: lang === 'ur' ? 'بیک لیس موٹرز' : 'Brushless Subsea Thrusters', Icon: Hammer, desc: lang === 'ur' ? 'پانی کے بہاؤ کو کنٹرول کرنے کے لیے پائیدار اور انتہائی کم شور والی موٹرز۔' : 'High-efficiency magnetically coupled brushless motors providing dynamic steering.' },
    { name: lang === 'ur' ? 'لیتھیم پاور سسٹم' : 'Smart Lithium Power Bank', Icon: Battery, desc: lang === 'ur' ? 'طویل مشنز کے لیے سمارٹ بی ایم ایس کے ساتھ انتہائی محفوظ پاور پیک۔' : 'High-density smart battery modules integrated with protective safety cutoff matrices.' },
    { name: lang === 'ur' ? 'مشن کنٹرولر' : 'Core Processing Unit', Icon: Cpu, desc: lang === 'ur' ? 'خود کار فیصلے کرنے اور تمام سینسرز کے ڈیٹا کو پروسیس کرنے والا دماغ۔' : 'Industrial single-board computer hosting core AI navigation algorithm filters.' },
    { name: lang === 'ur' ? 'خودکار نیویگیشن' : 'Autopilot Navigation System', Icon: Compass, desc: lang === 'ur' ? 'بغیر پائلٹ کے پہلے سے طے شدہ راستے پر مستقل سفر کرنے کا نظام۔' : 'FOC vector system tracking waypoints and performing autonomous collision avoidance.' }
  ];

  // Interactive AUV components data
  const auvComponents = [
    { name: lang === 'ur' ? 'پریشر ہول' : 'Titanium Pressure Hull', Icon: Shield, desc: lang === 'ur' ? '6000 میٹر تک گہرے پانی کے شدید دباؤ کو برداشت کرنے والا فریم۔' : 'Aircraft-grade titanium shell engineered to survive subsea pressures up to 6000m.' },
    { name: lang === 'ur' ? 'نیویگیشن فلٹرز' : 'Inertial Navigation (INS)', Icon: Navigation, desc: lang === 'ur' ? 'زیر آب بغیر جی پی ایس کے درست ترین سفر کے لیے انرشل نیویگیشن۔' : 'High-precision Doppler velocity log combined with gyroscopes for dead reckoning.' },
    { name: lang === 'ur' ? 'ملٹی بیم سونار' : 'Multibeam Sonar Array', Icon: Waves, desc: lang === 'ur' ? 'سمندری فرش کا ہائی ریزولوشن تھری ڈی نقشہ بنانے والا الٹراسونک سینسر۔' : 'High-frequency acoustics mapping detailed 3D bathymetric point clouds.' },
    { name: lang === 'ur' ? 'پریشر بیٹری' : 'Oil-Filled Battery Cells', Icon: Battery, desc: lang === 'ur' ? 'گہرے پانی کے دباؤ میں کام کرنے والی خصوصی واٹر پروف بیٹریاں۔' : 'Pressure-balanced oil-filled lithium cell banks ensuring deep subsea power.' },
    { name: lang === 'ur' ? 'صوتی سینسرز' : 'Acoustic Transponders', Icon: Radio, desc: lang === 'ur' ? 'پانی کے اندر وائرلیس ڈیٹا کی منتقلی کا خصوصی صوتی نظام۔' : 'Subsea acoustic telemetry facilitating long-range data and trigger signals.' },
    { name: lang === 'ur' ? 'تھری ڈی کیمرہ' : 'Starlight Subsea Camera', Icon: Camera, desc: lang === 'ur' ? 'تاریک گہرائیوں میں واضح لائیو فوٹیج ریکارڈ کرنے والا انتہائی حساس کیمرہ۔' : 'Ultra-sensitive low-light sensor with synchronized underwater LED illuminator lines.' },
    { name: lang === 'ur' ? 'مقناطیسی پروپیلر' : 'Magnetic Drive Propeller', Icon: Cpu, desc: lang === 'ur' ? 'بغیر کسی لیکیج کے پانی میں آگے بڑھنے والا مقناطیسی ڈرائیو پروپیلر۔' : 'Completely sealed magnetic coupling thruster providing silent steady speed.' },
    { name: lang === 'ur' ? 'کنٹرول یونٹ' : 'Subsea AI Control Unit', Icon: Cpu, desc: lang === 'ur' ? 'زیر آب فیصلوں اور سونار امیجنگ کو لائیو پروسیس کرنے والا مرکزی یونٹ۔' : 'Embedded AI system performing active path planning and acoustic telemetry logging.' }
  ];

  // Why choose us cards
  const whyChooseUs = [
    {
      title: lang === 'ur' ? 'تجربہ کار سائنسی ٹیم' : 'Experienced R&D Team',
      desc: lang === 'ur' ? 'ہمارے پاس 60 سے زائد پی ایچ ڈی اسکالرز اور فیلڈ روبوٹکس ریسرچرز کی عالمی ٹیم موجود ہے۔' : 'Our facility houses over 60 dedicated marine research PhDs and subsea robotics experts.',
      Icon: Users
    },
    {
      title: lang === 'ur' ? 'جدید ترین ٹیکنالوجی' : 'Advanced Technology',
      desc: lang === 'ur' ? 'ہم کلاؤڈ سسٹمز، ملٹی بیم سونار اور مشین لرننگ الگورتھمز کا استعمال کرتے ہیں۔' : 'Integrating state-of-the-art FOC motor vectors, digital twins, and autonomous control layers.',
      Icon: Cpu
    },
    {
      title: lang === 'ur' ? 'انتہائی قابل بھروسہ' : 'Extreme Reliability',
      desc: lang === 'ur' ? 'ہماری تمام گاڑیاں 8000 میٹر تک کے گہرے دباؤ کے ٹیسٹ چیمبر سے گزاری جاتی ہیں۔' : 'Every platform undergoes rigorous pressure, vibration, electromagnetic, and aging tests.',
      Icon: Shield
    },
    {
      title: lang === 'ur' ? 'آرٹیفیشل انٹیلیجنس' : 'AI-Based Navigation',
      desc: lang === 'ur' ? 'ہماری گاڑیاں بغیر کسی انسانی مداخلت کے رکاوٹوں سے بچ کر سفر کرتی ہیں۔' : 'Smart machine vision filters and real-time path planning facilitate completely crew-free operations.',
      Icon: Target
    },
    {
      title: lang === 'ur' ? 'عالمی سائنسی معیار' : 'Global Standards',
      desc: lang === 'ur' ? 'ہماری مصنوعات ISO 9001، CE، اور RoHS بین الاقوامی سرٹیفیکیشنز کی حامل ہیں۔' : 'Fully certified marine systems compliant with ISO 9001, CE safety registers, and environmental RoHS.',
      Icon: Award
    },
    {
      title: lang === 'ur' ? 'گاہکوں کا اطمینان' : 'Client Satisfaction',
      desc: lang === 'ur' ? 'عالمی تحقیقی ادارے، گہرے سمندر کے دفاعی حکام، اور گیس کمپنیاں ہم پر بھروسہ کرتی ہیں۔' : 'Trusted by international oceanography labs, marine security agencies, and offshore pipeline groups.',
      Icon: CheckCircle
    }
  ];

  // Technologies We Use
  const techWeUse = [
    { name: 'Artificial Intelligence', desc: 'Cognitive autonomy filters' },
    { name: 'Machine Learning', desc: 'Predictive battery & velocity logs' },
    { name: 'Computer Vision', desc: 'Subsea target tracking' },
    { name: 'Internet of Things (IoT)', desc: 'Global satellite telemetry grid' },
    { name: 'Inertial Navigation', desc: 'Precision INS/GPS state estimaters' },
    { name: 'Sonar Technology', desc: 'Multibeam & side-scan acoustics' },
    { name: 'Marine Sensors', desc: 'High-frequency telemetry arrays' },
    { name: 'Robotics', desc: 'Brushless vector propulsion' },
    { name: 'Autonomous Systems', desc: 'Return-to-home fail-safes' },
    { name: 'Data Analytics', desc: 'Point-cloud bathymetric cleanups' }
  ];

  const handleScrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToGallery = () => {
    const el = document.querySelector('#gallery-section') || document.querySelector('#featured-jobs-home');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white font-sans text-gray-800">
      
      {/* 1. Company Overview Section */}
      <section className="py-24 bg-white" id="company-overview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Block Left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group">
                <img
                  src="https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1200"
                  alt="Marine Research Lab"
                  className="w-full object-cover aspect-video sm:aspect-square group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />
              </div>
              
              {/* Floating Stat Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -right-6 bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 hidden sm:block"
              >
                <span className="text-3xl font-display font-extrabold text-teal-400 block" style={{ color: primaryColor }}>15+</span>
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">Years Field Experience</span>
              </motion.div>
            </motion.div>

            {/* Content Block Right */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600" style={{ color: primaryColor }}>
                {lang === 'ur' ? 'ہمارا تعارف اور مشن' : 'CORPORATE IDENTITY & VALUES'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 tracking-tight leading-tight">
                {lang === 'ur' ? 'پائینیرنگ میرین سسٹمز فار گلوبل سائنس' : 'Pioneering Marine Science & Subsea Robotics'}
              </h2>
              <div className="w-12 h-1 bg-teal-600" style={{ backgroundColor: primaryColor }}></div>
              
              <p className="text-sm text-gray-600 leading-relaxed font-sans">
                {lang === 'ur'
                  ? 'ہائیڈروشن انٹیلیجنٹ ٹیک جدید ترین انڈر واٹر روبوٹکس، خود مختار کشتیوں، تھرسٹرز اور ڈیپ سی ایکچوایٹرز کی تحقیق اور ترقی میں عالمی سطح پر پیش پیش ہے۔ ہم سمندری سائنس دانوں اور دفاعی اداروں کو درست اور قابل اعتماد ڈیٹا فراہم کرنے کے لیے پرعزم ہیں۔'
                  : 'Hydrocean is an international leader in the engineering, design, and manufacturing of high-magnetic density subsea electric actuators, brushless thrusters, and autonomous surface-to-deep-sea vehicles. Our technology empowers scientific research centers, defense offices, and offshore energy infrastructure groups.'}
              </p>

              <p className="text-sm text-gray-600 leading-relaxed font-sans">
                {lang === 'ur'
                  ? 'ہمارا عزم سمندر کی پراسرار گہرائیوں کو ڈیجیٹل کلاؤڈ سسٹمز کے ساتھ جوڑنا ہے تاکہ ماحولیاتی تبدیلیوں، بحری حیات کے تحفظ، اور گہرے سمندر کے وسائل کا موثر مطالعہ کیا جا سکے۔'
                  : 'By bridging high-fidelity physics with cognitive edge computing, our USV and AUV fleets operate in extreme deep sea climates up to 8000m, gathering precise oceanographic and bathymetric matrices to solve the grand challenges of maritime security and ocean health.'}
              </p>

              {/* Core Values grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-150">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 border border-gray-100 rounded-lg text-teal-600 mt-1 shrink-0" style={{ color: primaryColor }}>
                    <Target className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{lang === 'ur' ? 'ہمارا مشن' : 'Our Mission'}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{lang === 'ur' ? 'سمندری ڈیٹا اور خود مختار نظاموں میں عالمی معیار کی فراہمی۔' : 'Delivering carbon-neutral high-end oceanic autonomous technologies globally.'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 border border-gray-100 rounded-lg text-teal-600 mt-1 shrink-0" style={{ color: primaryColor }}>
                    <Eye className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{lang === 'ur' ? 'ہمارا وژن' : 'Our Vision'}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{lang === 'ur' ? 'مستقبل کے سمندروں کو سمارٹ روبوٹک نیٹ ورک کے ذریعے جوڑنا۔' : 'Enabling seamless global digitalization of the worlds ocean floor.'}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. Interactive Vehicle Details Section (USV vs AUV tabs) */}
      <section className="py-24 bg-slate-50 border-t border-b border-gray-150" id="detailed-vehicle-directory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600 animate-pulse" style={{ color: primaryColor }}>
              {lang === 'ur' ? 'تفصیلی تکنیکی انسائیکلوپیڈیا' : 'TECHNICAL SPECIFICATIONS DIRECTORY'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
              {lang === 'ur' ? 'یو ایس وی اور اے یو وی کی تفصیلی تفصیلات' : 'Deep-Dive: How USV & AUV Platforms Work'}
            </h2>
            <div className="w-12 h-1 bg-teal-600 mx-auto mt-4" style={{ backgroundColor: primaryColor }}></div>
            <p className="text-gray-600 mt-6 leading-relaxed text-sm font-sans">
              {lang === 'ur'
                ? 'ہائیڈروشن کے خود مختار نظاموں کے ڈیزائن، پرزہ جات اور آپریشنل لائف سائیکل کا مکمل جائزہ۔'
                : 'Explore our comprehensive breakdowns of our unmanned surface and autonomous subsea hulls, including real diagrams, components, and workflow sequences.'}
            </p>
          </div>

          {/* Interactive Tabs Menu */}
          <div className="flex justify-center mb-12">
            <div className="bg-white border border-gray-150 rounded-2xl p-1.5 flex shadow-sm">
              <button
                onClick={() => setActiveTab('usv')}
                className={`px-8 py-3 rounded-xl font-display font-bold text-sm tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === 'usv' ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
                }`}
                style={activeTab === 'usv' ? { backgroundColor: primaryColor } : {}}
              >
                {lang === 'ur' ? 'سطحی گاڑی (USV)' : 'Surface Vessel (USV)'}
              </button>
              <button
                onClick={() => setActiveTab('auv')}
                className={`px-8 py-3 rounded-xl font-display font-bold text-sm tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === 'auv' ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
                }`}
                style={activeTab === 'auv' ? { backgroundColor: primaryColor } : {}}
              >
                {lang === 'ur' ? 'زیر آب گاڑی (AUV)' : 'Underwater Vehicle (AUV)'}
              </button>
            </div>
          </div>

          {/* Tab Contents with Framer Motion transitions */}
          <AnimatePresence mode="wait">
            {activeTab === 'usv' ? (
              <motion.div
                key="usv-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-16"
              >
                {/* 1. USV Concept Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-5 relative">
                    <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-lg group">
                      <img
                        src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800"
                        alt="Unmanned Surface Vehicle concept"
                        className="w-full object-cover aspect-video sm:aspect-square group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                  
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600" style={{ color: primaryColor }}>
                      {lang === 'ur' ? 'یو ایس وی کیا ہے؟' : 'AUTONOMOUS SURFACE PLATFORM'}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
                      {lang === 'ur' ? 'مستقبل کی غیر انسانی سطح کی گاڑیاں (USVs)' : 'Unmanned Surface Vehicles (USV)'}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-sans">
                      {lang === 'ur'
                        ? 'ایک یو ایس وی (Unmanned Surface Vehicle) ایک ایسی خود مختار کشتی ہے جو پانی کی سطح پر سفر کرتی ہے اور اس پر کوئی انسانی عملہ موجود نہیں ہوتا۔ یہ گاڑیاں صوتی لہروں، کیمروں اور ماحولیاتی سینسرز کی مدد سے سمندر کے درجہ حرارت، گہرائی اور لہروں کا مسلسل مطالعہ کرتی ہیں۔'
                        : 'A USV (Unmanned Surface Vehicle) is a robotic vessel designed to operate on the surface of water bodies autonomously or via remote telemetry controls. Utilizing robust wave-propulsion mechanics, wind configurations, or brushless solar batteries, USVs facilitate extremely long deployments to monitor coastlines, chart hydrographic anomalies, and secure naval domains.'}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-150 rounded-xl p-4 shadow-xs">
                        <span className="font-extrabold text-sm text-gray-950 block">{lang === 'ur' ? 'صفر کاربن گیسز' : 'Carbon Neutral'}</span>
                        <span className="text-xs text-gray-500 block mt-1">{lang === 'ur' ? 'شمسی توانائی اور ماحول دوست انجن۔' : 'Solar-electric hybrid propulsion.'}</span>
                      </div>
                      <div className="bg-white border border-gray-150 rounded-xl p-4 shadow-xs">
                        <span className="font-extrabold text-sm text-gray-950 block">{lang === 'ur' ? 'مستقل نگرانی' : 'Continuous Sync'}</span>
                        <span className="text-xs text-gray-500 block mt-1">{lang === 'ur' ? '24/7 سیٹلائٹ کلاؤڈ نیٹ ورک رابطے۔' : 'Real-time satellite coordinates upload.'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. USV Components */}
                <div className="space-y-6">
                  <h4 className="text-lg font-display font-bold text-gray-900 text-center">
                    {lang === 'ur' ? 'یو ایس وی (USV) کے بنیادی پرزہ جات' : 'Core Components of a USV'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {usvComponents.map((c, idx) => (
                      <motion.div
                        key={idx}
                        variants={cardHoverVariants}
                        initial="initial"
                        whileHover="hover"
                        className="bg-white border rounded-2xl p-5 text-left flex flex-col justify-between cursor-pointer"
                      >
                        <div className="space-y-3">
                          <motion.div 
                            variants={iconHoverVariants}
                            className="p-3 rounded-xl inline-flex items-center justify-center border border-gray-100"
                          >
                            <c.Icon className="h-5 w-5" />
                          </motion.div>
                          <h5 className="font-bold text-gray-950 text-xs sm:text-sm">{c.name}</h5>
                          <p className="text-slate-500 text-[11px] leading-relaxed font-sans">{c.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 3. USV Working Workflow */}
                <div className="bg-white border border-gray-150 rounded-3xl p-8 lg:p-12 text-left space-y-8">
                  <h4 className="text-lg font-display font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
                    <Anchor className="h-5.5 w-5.5 text-teal-600" style={{ color: primaryColor }} />
                    {lang === 'ur' ? 'یو ایس وی (USV) کا مکمل ورک فلو' : 'Step-by-Step USV Operational Lifecycle'}
                  </h4>
                  
                  <div className="relative border-l-2 border-gray-100 pl-6 space-y-8 max-w-3xl">
                    <div className="relative">
                      <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-teal-500 border-4 border-white shadow" style={{ backgroundColor: primaryColor }} />
                      <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Phase 1</span>
                      <h5 className="font-bold text-gray-950 text-xs sm:text-sm mt-0.5">{lang === 'ur' ? 'مشن کی منصوبہ بندی' : 'Mission Planning'}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans mt-1">{lang === 'ur' ? 'کنٹرول سافٹ ویئر میں نقاط (Waypoints) اور ترجیحات کا اندراج۔' : 'Configuring designated survey grids and boundary parameters inside control maps.'}</p>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-teal-500 border-4 border-white shadow" style={{ backgroundColor: primaryColor }} />
                      <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Phase 2</span>
                      <h5 className="font-bold text-gray-950 text-xs sm:text-sm mt-0.5">{lang === 'ur' ? 'پروگرامنگ اور کیلیبریشن' : 'Programming & Telemetry Sync'}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans mt-1">{lang === 'ur' ? 'گاڑی کے اندر مشن فائل اپ لوڈ کرنا اور سینسرز کی جانچ کرنا۔' : 'Uploading routing files into the on-board processor and verifying RF link signal levels.'}</p>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-teal-500 border-4 border-white shadow" style={{ backgroundColor: primaryColor }} />
                      <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Phase 3</span>
                      <h5 className="font-bold text-gray-950 text-xs sm:text-sm mt-0.5">{lang === 'ur' ? 'پانی میں روانگی' : 'Deployment & Diagnostics'}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans mt-1">{lang === 'ur' ? 'گاڑی کو ساحل یا تحقیقی جہاز سے پانی کی سطح پر چھوڑنا۔' : 'Launching the USV hull into open waters and running short automation diagnostic routines.'}</p>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-teal-500 border-4 border-white shadow" style={{ backgroundColor: primaryColor }} />
                      <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Phase 4</span>
                      <h5 className="font-bold text-gray-950 text-xs sm:text-sm mt-0.5">{lang === 'ur' ? 'خود مختار سفر' : 'Autonomous Navigation & AI Guard'}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans mt-1">{lang === 'ur' ? 'گاڑی کا خود کار طریقے سے سفر کرنا اور رکاوٹوں سے بچنا۔' : 'Using real-time LIDAR/radar maps to avoid obstacles and keep target courses.'}</p>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-teal-500 border-4 border-white shadow" style={{ backgroundColor: primaryColor }} />
                      <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Phase 5</span>
                      <h5 className="font-bold text-gray-950 text-xs sm:text-sm mt-0.5">{lang === 'ur' ? 'ڈیٹا اکٹھا کرنا' : 'Continuous Data Logging'}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans mt-1">{lang === 'ur' ? 'سونار، کیمروں اور جی پی ایس کی مدد سے لائیو ڈیٹا ریکارڈ کرنا۔' : 'Writing real-time environmental datasets, bathymetric files, and HD video directly to physical SD units.'}</p>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-teal-500 border-4 border-white shadow" style={{ backgroundColor: primaryColor }} />
                      <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Phase 6</span>
                      <h5 className="font-bold text-gray-950 text-xs sm:text-sm mt-0.5">{lang === 'ur' ? 'محفوظ واپسی' : 'Autonomous Return & Recover'}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans mt-1">{lang === 'ur' ? 'مشن کے اختتام پر گاڑی کا خود بخود ساحل کی طرف لوٹنا۔' : 'Returning to pre-defined recovery boundaries after completing standard grid files.'}</p>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-teal-500 border-4 border-white shadow" style={{ backgroundColor: primaryColor }} />
                      <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Phase 7</span>
                      <h5 className="font-bold text-gray-950 text-xs sm:text-sm mt-0.5">{lang === 'ur' ? 'ڈیٹا رپورٹنگ' : 'Reporting & Analysis'}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans mt-1">{lang === 'ur' ? 'جمع شدہ ڈیٹا کو سائنسی رپورٹس کی شکل میں پروسیس کرنا۔' : 'Downloading raw files, clean point clouds, and producing beautiful GIS visual sheets.'}</p>
                    </div>
                  </div>
                </div>

                {/* 4. Applications & Advantages */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-slate-900 text-white rounded-3xl p-8 text-left space-y-4">
                    <h4 className="font-display font-bold text-lg text-teal-400">{lang === 'ur' ? 'یو ایس وی (USV) کے فوائد' : 'Core Advantages of USVs'}</h4>
                    <ul className="space-y-3 text-xs text-slate-300 font-sans leading-relaxed list-disc pl-5">
                      <li><strong>{lang === 'ur' ? 'اعلی انسانی حفاظت:' : 'Crew Safety:'}</strong> {lang === 'ur' ? 'طوفانی اور خطرناک سمندروں میں انسانی جانوں کا خطرہ ختم۔' : 'Keeps hydrographic survey teams safe from dangerous tidal situations.'}</li>
                      <li><strong>{lang === 'ur' ? 'انتہائی سستا:' : 'Operational Savings:'}</strong> {lang === 'ur' ? 'بڑے تحقیقی جہازوں کی نسبت 90٪ ایندھن اور لاجسٹک بچت۔' : 'Vastly reduces expensive fuel, crew maintenance, and vessel support costs.'}</li>
                      <li><strong>{lang === 'ur' ? 'طویل مشن صلاحیت:' : 'Long Mission Endurance:'}</strong> {lang === 'ur' ? 'شمسی بیٹریاں کی مدد سے ہفتوں تک مسلسل کام کرنے کی صلاحیت۔' : 'Provides continuous solar-recharging deployment profiles lasting weeks.'}</li>
                      <li><strong>{lang === 'ur' ? 'ریئل ٹائم مانیٹرنگ:' : 'Real-time Transmission:'}</strong> {lang === 'ur' ? 'سیٹلائٹ کلاؤڈ کے ذریعے دنیا بھر میں کہیں بھی لائیو ڈیٹا شیئرنگ۔' : 'Allows immediate satellite alerts, diagnostic warnings, and visual streaming.'}</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 text-white rounded-3xl p-8 text-left space-y-4">
                    <h4 className="font-display font-bold text-lg text-teal-400">{lang === 'ur' ? 'یو ایس وی (USV) کے عملی استعمال' : 'USV Field Applications'}</h4>
                    <ul className="space-y-3 text-xs text-slate-300 font-sans leading-relaxed list-disc pl-5">
                      <li><strong>{lang === 'ur' ? 'بحری دفاع اور نگرانی:' : 'Defense & Border Control:'}</strong> {lang === 'ur' ? 'بندرگاہوں کی حفاظت، جاسوسی، اور ملکی سمندری حدود کی پیٹرولنگ۔' : 'Subsea intrusion alerts, port safety tracking, and automated perimeter checks.'}</li>
                      <li><strong>{lang === 'ur' ? 'سائنسی سمندری تحقیق:' : 'Oceanography Research:'}</strong> {lang === 'ur' ? 'درجہ حرارت، نمکیات اور سمندری آلودگی کا سائنسی مشاہدہ۔' : 'Gathering physical data, water chemistry index, and environmental tracking.'}</li>
                      <li><strong>{lang === 'ur' ? 'ہائیڈرو گرافک سروے:' : 'Bathymetric Mapping:'}</strong> {lang === 'ur' ? 'بندرگاہوں اور ندیوں کے پیندے کا تھری ڈی سونار نقشہ بنانا۔' : 'Constructing high-density underwater elevation files for naval passage.'}</li>
                      <li><strong>{lang === 'ur' ? 'پائپ لائن اور انفراسٹرکچر معائنہ:' : 'Offshore Infrastructure:'}</strong> {lang === 'ur' ? 'تیل اور گیس کے پلیٹ فارمز اور کیبلز کی فضائی و سطحی نگرانی۔' : 'Perimeter support, inspection assistance, and search-and-rescue response.'}</li>
                    </ul>
                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div
                key="auv-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-16"
              >
                {/* 1. AUV Concept Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-5 relative">
                    <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-lg group">
                      <img
                        src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=800"
                        alt="Autonomous Underwater Vehicle concept"
                        className="w-full object-cover aspect-video sm:aspect-square group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                  
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600" style={{ color: primaryColor }}>
                      {lang === 'ur' ? 'زیر آب خود مختار نظام' : 'DEEP-SEA SUBSEA ROBOTICS'}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
                      {lang === 'ur' ? 'خود مختار زیر آب گاڑیاں (AUVs)' : 'Autonomous Underwater Vehicles (AUV)'}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-sans">
                      {lang === 'ur'
                        ? 'ایک اے یو وی (Autonomous Underwater Vehicle) ایک خود کار روبوٹک آبدوز ہے جو پانی کے نیچے گہرائی میں انسانوں کے بغیر تیرتی ہے۔ یہ گاڑیاں صوتی لہروں (Acoustics) اور ملٹی بیم سونار کی مدد سے سمندر کے پیندے کا تھری ڈی نقشہ تیار کرتی ہیں اور گہرے پانیوں میں پائپ لائنوں اور تاروں کا معائنہ کرتی ہیں۔'
                        : 'An AUV (Autonomous Underwater Vehicle) is a completely self-piloted robotic submarine designed to navigate underwater without tether cables or real-time human intervention. Following sophisticated pre-programmed flight path sequences, AUVs map extreme depths, inspect subsea infrastructure pipelines, and log acoustic imagery of the oceanic crust.'}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-150 rounded-xl p-4 shadow-xs">
                        <span className="font-extrabold text-sm text-gray-950 block">{lang === 'ur' ? 'انتہائی گہرائی صلاحیت' : 'Deep-Sea Endurance'}</span>
                        <span className="text-xs text-gray-500 block mt-1">{lang === 'ur' ? '6000 میٹر تک کے انتہائی دباؤ میں کام کرنے کی صلاحیت۔' : 'Engineered to withstand immense depths up to 6000 meters.'}</span>
                      </div>
                      <div className="bg-white border border-gray-150 rounded-xl p-4 shadow-xs">
                        <span className="font-extrabold text-sm text-gray-950 block">{lang === 'ur' ? 'کلاؤڈ لیس خود مختاری' : 'Full Cognitive Autonomy'}</span>
                        <span className="text-xs text-gray-500 block mt-1">{lang === 'ur' ? 'پانی کے اندر بغیر جی پی ایس اور انٹرنیٹ کے مکمل کنٹرول۔' : 'Navigates entirely without active GPS coordinates or internet tether cables.'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. AUV Components */}
                <div className="space-y-6">
                  <h4 className="text-lg font-display font-bold text-gray-900 text-center">
                    {lang === 'ur' ? 'اے یو وی (AUV) کے بنیادی پرزہ جات' : 'Core Components of an AUV'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {auvComponents.map((c, idx) => (
                      <motion.div
                        key={idx}
                        variants={cardHoverVariants}
                        initial="initial"
                        whileHover="hover"
                        className="bg-white border rounded-2xl p-5 text-left flex flex-col justify-between cursor-pointer"
                      >
                        <div className="space-y-3">
                          <motion.div 
                            variants={iconHoverVariants}
                            className="p-3 rounded-xl inline-flex items-center justify-center border border-gray-100"
                          >
                            <c.Icon className="h-5 w-5" />
                          </motion.div>
                          <h5 className="font-bold text-gray-950 text-xs sm:text-sm">{c.name}</h5>
                          <p className="text-slate-500 text-[11px] leading-relaxed font-sans">{c.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 3. AUV Working Workflow */}
                <div className="bg-white border border-gray-150 rounded-3xl p-8 lg:p-12 text-left space-y-8">
                  <h4 className="text-lg font-display font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
                    <Anchor className="h-5.5 w-5.5 text-teal-600" style={{ color: primaryColor }} />
                    {lang === 'ur' ? 'اے یو وی (AUV) کا آپریشنل لائف سائیکل' : 'Step-by-Step AUV Mission Workflow'}
                  </h4>
                  
                  <div className="relative border-l-2 border-gray-100 pl-6 space-y-8 max-w-3xl">
                    <div className="relative">
                      <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-teal-500 border-4 border-white shadow" style={{ backgroundColor: primaryColor }} />
                      <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Step 1</span>
                      <h5 className="font-bold text-gray-950 text-xs sm:text-sm mt-0.5">{lang === 'ur' ? 'مشن کی تیاری اور کوڈنگ' : 'Pre-Launch Mission Configuration'}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans mt-1">{lang === 'ur' ? 'روبوٹک سسٹم کے مائیکرو پروسیسر میں راستے اور گہرائی کی حدود لوڈ کرنا۔' : 'Uploading designated three-dimensional path grids and speed profiles directly into the AUV core.'}</p>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-teal-500 border-4 border-white shadow" style={{ backgroundColor: primaryColor }} />
                      <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Step 2</span>
                      <h5 className="font-bold text-gray-950 text-xs sm:text-sm mt-0.5">{lang === 'ur' ? 'پری ویلیو ٹیسٹ' : 'Structural & Battery Diagnostic Runs'}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans mt-1">{lang === 'ur' ? 'پریشر چیمبر، سیل، اور بیٹریاں کے وولٹیج کا حتمی سکیورٹی ٹیسٹ۔' : 'Evaluating waterproofing seals, pressure-balanced oil cells, and gyroscope drift values.'}</p>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-teal-500 border-4 border-white shadow" style={{ backgroundColor: primaryColor }} />
                      <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Step 3</span>
                      <h5 className="font-bold text-gray-950 text-xs sm:text-sm mt-0.5">{lang === 'ur' ? 'پانی میں گہرا غوطہ' : 'Launch & Automated Submergence'}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans mt-1">{lang === 'ur' ? 'گاڑی کا پانی میں غوطہ لگانا اور گہرائی کی طرف سفر کا آغاز۔' : 'Sinking to designated depths using internal buoyancy tanks and high-power thruster angles.'}</p>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-teal-500 border-4 border-white shadow" style={{ backgroundColor: primaryColor }} />
                      <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Step 4</span>
                      <h5 className="font-bold text-gray-950 text-xs sm:text-sm mt-0.5">{lang === 'ur' ? 'خود کار سفر اور سونار سکین' : 'Inertial Navigation & Sonar Sweeps'}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans mt-1">{lang === 'ur' ? 'بغیر جی پی ایس کے انرشل سینسرز کی مدد سے آگے بڑھنا اور تھری ڈی سونار ریکارڈنگ۔' : 'Performing grid runs using Doppler velocity logs while sweeping seabed point clouds.'}</p>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-teal-500 border-4 border-white shadow" style={{ backgroundColor: primaryColor }} />
                      <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Step 5</span>
                      <h5 className="font-bold text-gray-950 text-xs sm:text-sm mt-0.5">{lang === 'ur' ? 'خودکار واپسی' : 'Self-Triggered Ascent'}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans mt-1">{lang === 'ur' ? 'مشن مکمل ہونے یا بیٹری کم ہونے پر خود کار طریقے سے پانی کی سطح پر آنا۔' : 'Ascending slowly by adjusting buoyancy tanks once the planned survey layout terminates.'}</p>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-teal-500 border-4 border-white shadow" style={{ backgroundColor: primaryColor }} />
                      <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Step 6</span>
                      <h5 className="font-bold text-gray-950 text-xs sm:text-sm mt-0.5">{lang === 'ur' ? 'گاڑی کی بازیابی اور ڈیٹا ڈاؤن لوڈ' : 'Hull Retrieval & Data Analysis'}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans mt-1">{lang === 'ur' ? 'جہاز پر گاڑی نکالنا اور حاصل شدہ قیمتی ڈیٹا کمپیوٹر سسٹمز میں شفٹ کرنا۔' : 'Hoisting the AUV on-board the support ship, syncing local logs, and processing raw bathymetry.'}</p>
                    </div>
                  </div>
                </div>

                {/* 4. Applications & Advantages */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-slate-900 text-white rounded-3xl p-8 text-left space-y-4">
                    <h4 className="font-display font-bold text-lg text-teal-400">{lang === 'ur' ? 'اے یو وی (AUV) کے فوائد' : 'Core Advantages of AUVs'}</h4>
                    <ul className="space-y-3 text-xs text-slate-300 font-sans leading-relaxed list-disc pl-5">
                      <li><strong>{lang === 'ur' ? 'مکمل خود مختاری:' : 'Untethered Control:'}</strong> {lang === 'ur' ? 'بغیر کسی لٹکتی ہوئی تار یا کیبل کے ہزاروں میٹر گہرے پانی میں آزاد نیویگیشن۔' : 'Operates with absolute zero physical cables, removing limits on depth or range.'}</li>
                      <li><strong>{lang === 'ur' ? 'انتہائی باریک بینی:' : 'High-Resolution Imagery:'}</strong> {lang === 'ur' ? 'پانی کے قریب سفر کرنے کی وجہ سے انتہائی واضح تھری ڈی امیجنگ۔' : 'Dives close to seafloors to produce exceptionally clear acoustic scans.'}</li>
                      <li><strong>{lang === 'ur' ? 'سطح کی لہروں سے نجات:' : 'Weather Independence:'}</strong> {lang === 'ur' ? 'سمندر کے نیچے طوفان اور لہروں سے بے نیاز پرسکون آپریشن۔' : 'Subsurface runs bypass stormy surface sea climates entirely.'}</li>
                      <li><strong>{lang === 'ur' ? 'اعلی حفاظتی ڈھانچہ:' : 'Pressure Durability:'}</strong> {lang === 'ur' ? 'انتہائی گہرائی میں ٹائٹینیم شیل کے سبب محفوظ سینسرز۔' : 'Integrated titanium hulls withstand intense subsea atmospheric pressures.'}</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 text-white rounded-3xl p-8 text-left space-y-4">
                    <h4 className="font-display font-bold text-lg text-teal-400">{lang === 'ur' ? 'اے یو وی (AUV) کے عملی استعمال' : 'AUV Field Applications'}</h4>
                    <ul className="space-y-3 text-xs text-slate-300 font-sans leading-relaxed list-disc pl-5">
                      <li><strong>{lang === 'ur' ? 'گہرے سمندر کی سائنسی تحقیق:' : 'Deep Sea Research:'}</strong> {lang === 'ur' ? 'سمندری فرش کی ٹیکٹونک پلیٹوں، گہرائی کے درجہ حرارت اور مٹی کا سروے۔' : 'Mapping tectonic fault lines, ocean currents, and deep-sea benthic life.'}</li>
                      <li><strong>{lang === 'ur' ? 'زیر آب پائپ لائن معائنہ:' : 'Subsea Pipeline Inspections:'}</strong> {lang === 'ur' ? 'تیل اور گیس کے گہرے کنویں، نالیوں اور مواصلاتی تاروں میں نقائص کی تلاش۔' : 'Scanning offshore hydrocarbon pipelines and submarine internet cable paths.'}</li>
                      <li><strong>{lang === 'ur' ? 'بحری دفاع اور مائننگ:' : 'Naval Security & Demining:'}</strong> {lang === 'ur' ? 'دشمن کی آبدوزوں کی کھوج اور زیر آب بارودی سرنگوں کی تلاش۔' : 'Seabed patrol, active mine hunting, and subsea harbor protection.'}</li>
                      <li><strong>{lang === 'ur' ? 'تلاش اور بچاؤ مشنز:' : 'Deep Search & Rescue:'}</strong> {lang === 'ur' ? 'ڈوبے ہوئے ہوائی جہازوں، بحری جہازوں، اور ملبے کا باریک بینی سے معائنہ۔' : 'Locating down vessels or black-box flight recorders at extreme depths.'}</li>
                    </ul>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="py-24 bg-white" id="why-choose-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600" style={{ color: primaryColor }}>
              {lang === 'ur' ? 'ہم کیوں؟' : 'UNMATCHED INDUSTRIAL CAPABILITY'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
              {lang === 'ur' ? 'تحقیقاتی لیبارٹریز ہائیڈروشن پر کیوں بھروسہ کرتی ہیں؟' : 'Why Leading Research Labs Trust Hydrocean'}
            </h2>
            <div className="w-12 h-1 bg-teal-600 mx-auto mt-4" style={{ backgroundColor: primaryColor }}></div>
          </div>

          {/* Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, idx) => (
              <motion.div
                key={idx}
                variants={cardHoverVariants}
                initial="initial"
                whileHover="hover"
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-slate-50 border rounded-2xl p-8 text-left flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <motion.div 
                    variants={iconHoverVariants}
                    className="p-3 rounded-xl inline-flex items-center justify-center border border-gray-100 shadow-sm animate-pulse-subtle"
                  >
                    <item.Icon className="h-6 w-6" />
                  </motion.div>
                  <h4 className="font-display font-bold text-gray-900 text-base mt-6 mb-3">{item.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-sans font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Technologies We Use Badge Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden" id="technologies-we-use">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-400 via-slate-900 to-black pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-400">
              {lang === 'ur' ? 'ہمارا جدید ٹیکنالوجی پورٹ فولیو' : 'OUR CUTTING-EDGE TECH STACK'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2">
              {lang === 'ur' ? 'ٹیکنالوجیز جو ہم استعمال کرتے ہیں' : 'Pioneering Technologies Behind Our Fleet'}
            </h2>
            <div className="w-12 h-1 bg-teal-400 mx-auto mt-4" style={{ backgroundColor: primaryColor }}></div>
          </div>

          {/* Badges Flow / Grid */}
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {techWeUse.map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(20, 184, 166, 0.15)', borderColor: '#2dd4bf' }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-center cursor-pointer transition-all duration-300 min-w-[180px] flex-1"
              >
                <span className="font-mono text-teal-400 font-bold text-xs block">{tech.name}</span>
                <span className="text-slate-500 text-[10px] mt-1 block font-sans">{tech.desc}</span>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. About Call To Action Section */}
      <section className="py-20 bg-slate-50 border-t border-gray-200" id="about-cta">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-gray-950 tracking-tight leading-tight">
            {lang === 'ur' ? 'کیا آپ گہرے سمندر کے خود مختار منصوبوں کے لیے تیار ہیں؟' : 'Ready to Explore Advanced Autonomous Solutions?'}
          </h2>
          <p className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed font-sans font-light">
            {lang === 'ur'
              ? 'ہائیڈروشن ٹیم کے سائنسی ماہرین آپ کے مشنز، پائپ لائنز، اور تحقیقی سرگرمیوں کے لیے انتہائی سستی اور پائیدار حل ڈیزائن کرنے کے لیے تیار ہیں۔'
              : 'Our scientific committee and subsea engineering desks are standing by to review your custom mission grids and payload integrations.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <motion.button
              whileHover={{ 
                scale: 1.04, 
                y: -2, 
                backgroundColor: "#007c85", 
                boxShadow: "0 10px 25px -5px rgba(0, 156, 166, 0.4)" 
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={handleScrollToContact}
              className="px-8 py-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center space-x-2 border border-transparent transition-all"
              style={{ backgroundColor: primaryColor }}
            >
              <PhoneCall className="h-4.5 w-4.5" />
              <span>{lang === 'ur' ? 'ابھی رابطہ کریں' : 'Contact Us Direct'}</span>
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.04, 
                y: -2, 
                backgroundColor: "rgba(241, 245, 249, 1)", 
                borderColor: primaryColor,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)" 
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={handleScrollToGallery}
              className="px-8 py-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer transition-all"
            >
              <span>{lang === 'ur' ? 'منصوبے دیکھیں' : 'Explore Projects'}</span>
            </motion.button>
          </div>
        </div>
      </section>

    </div>
  );
}
