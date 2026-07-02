/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Compass, Shield, Eye, Users, ChevronLeft, ChevronRight, Activity, Cpu, Database, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WebsiteSettings } from '../types';
import { Language, getTranslation } from '../lib/translations';

interface HeroProps {
  settings: WebsiteSettings;
  lang: Language;
  page?: 'home' | 'jobs' | 'about_contact';
  onChangePage?: (page: 'home' | 'jobs' | 'about_contact') => void;
}

export default function Hero({ settings, lang, page = 'home', onChangePage }: HeroProps) {
  const primaryColor = settings.primaryColor || '#009ca6';
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Slides for Home Page (5 Slides)
  const homeSlides = [
    {
      title: lang === 'ur' ? 'غیر انسانی سطح کی گاڑی (USV)' : 'Unmanned Surface Vehicle (USV)',
      sub: lang === 'ur' ? 'خود مختار سطح کے جہاز' : 'Autonomous Surface Vessel',
      desc: lang === 'ur' 
        ? 'آزادانہ طور پر کام کرنے والے بحری جہاز جو سمندری نگرانی، ڈیٹا جمع کرنے، ماحولیاتی تحقیق اور بحری کارروائیوں کے لیے ڈیزائن کیے گئے ہیں۔'
        : 'State-of-the-art autonomous surface vessels engineered for marine operations, high-resolution ocean monitoring, hydrographic research, tactical surveillance, and real-time remote data collection.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1920',
      primaryBtn: lang === 'ur' ? 'درخواست دینے کا طریقہ' : 'How to Apply',
      secondaryBtn: lang === 'ur' ? 'ملازمتیں دیکھیں' : 'Explore Vacancies',
    },
    {
      title: lang === 'ur' ? 'خود مختار زیر آب گاڑی (AUV)' : 'Autonomous Underwater Vehicle (AUV)',
      sub: lang === 'ur' ? 'گہرے سمندر کے روبوٹکس' : 'Deep-Sea Robotic exploration',
      desc: lang === 'ur'
        ? 'گہرے سمندر کی تحقیق، پائپ لائن معائنہ، سمندری نقشہ سازی، اور ماحولیاتی مانیٹرنگ کے لیے ڈیزائن کردہ خود مختار انڈر واٹر گاڑیاں۔'
        : 'Advanced subsea robotic systems operating entirely underwater for scientific ocean research, industrial infrastructure inspection, bathymetric mapping, environmental telemetry, and deep-sea exploration.',
      image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&q=80&w=1920',
      primaryBtn: lang === 'ur' ? 'درخواست دینے کا طریقہ' : 'How to Apply',
      secondaryBtn: lang === 'ur' ? 'ہمارے بارے میں' : 'About Us',
    },
    {
      title: lang === 'ur' ? 'مشن اور جدید ٹیکنالوجی' : 'Mission & Technology',
      sub: lang === 'ur' ? 'خود مختار کنٹرول سسٹمز' : 'Autonomous Navigation Control',
      desc: lang === 'ur'
        ? 'آرٹیفیشل انٹیلیجنس نیویگیشن، جدید سینسرز، تھرمل کیمرے، گہرے سمندر کے مواصلاتی آلات اور لیتھیم پاور سسٹم کی مدد سے لیس۔'
        : 'Empowering deep ocean research missions using modern AI-driven navigation filters, acoustic telemetry arrays, high-definition camera suites, multi-frequency GPS, and long-endurance power management.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920',
      primaryBtn: lang === 'ur' ? 'درخواست دینے کا طریقہ' : 'How to Apply',
      secondaryBtn: lang === 'ur' ? 'ہماری ٹیکنالوجی' : 'Our Technology',
    },
    {
      title: lang === 'ur' ? 'صنعتی اور دفاعی استعمال' : 'Multi-Mission Applications',
      sub: lang === 'ur' ? 'ورسٹائل میرین سلوشنز' : 'Versatile Maritime Domains',
      desc: lang === 'ur'
        ? 'دفاعی نگرانی، سمندری تحقیق، تیل اور گیس پائپ لائن معائنہ، بندرگاہ کی حفاظت، تلاش اور بچاؤ، اور سمندری ماحولیاتی تحفظ کے لیے۔'
        : 'Supporting a wide matrix of deployment environments including defensive maritime security, oceanographic research, offshore oil & gas pipe inspection, port facilities security, and deep sea search & rescue operations.',
      image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1920',
      primaryBtn: lang === 'ur' ? 'درخواست دینے کا طریقہ' : 'How to Apply',
      secondaryBtn: lang === 'ur' ? 'رابطہ فارم' : 'Contact Support',
    },
    {
      title: lang === 'ur' ? 'مستقبل کی بحری ٹیکنالوجی' : 'Future Marine Technology',
      sub: lang === 'ur' ? 'سمندر کی ڈیجیٹلائزیشن' : 'Next-Gen Ocean Digitalization',
      desc: lang === 'ur'
        ? 'آرٹیفیشل انٹیلیجنس، کلاؤڈ کمپیوٹنگ، خودکار روبوٹکس، اور سمارٹ میرین سلوشنز کے ذریعے سمندری سائنس کا جدید ترین مستقبل۔'
        : 'Shaping the next century of autonomous maritime science through integrated Artificial Intelligence, robotic fleet synchronization, cognitive navigation layers, digital ocean twins, and smart marine solutions.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1920',
      primaryBtn: lang === 'ur' ? 'رابطہ کریں' : 'Contact Us',
      secondaryBtn: lang === 'ur' ? 'درخواست دینے کا طریقہ' : 'How to Apply',
    }
  ];

  // Slides for Jobs Page (3 Slides)
  const jobsSlides = [
    {
      title: lang === 'ur' ? 'ہماری اشرافیہ ریسرچ ٹیم میں شامل ہوں' : 'Join Our Elite Research Team',
      sub: lang === 'ur' ? 'سمندری انجینئرنگ کیریئرز' : 'Deep-Sea Marine Careers',
      desc: lang === 'ur'
        ? 'جدید ترین سمندری روبوٹکس، اے یو وی پائلٹنگ، اور سب سی موٹرز ڈیزائن کے لیے اب درخواست دیں۔'
        : 'Apply for active robotic engineer vacancies, USV pilot roles, and subsea actuators engineering slots. We build the future of oceanography.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920',
      primaryBtn: lang === 'ur' ? 'درخواست کا فارم' : 'Application Form',
      secondaryBtn: lang === 'ur' ? 'نوکریاں دیکھیں' : 'View Positions',
    },
    {
      title: lang === 'ur' ? 'مستقبل کی عالمی سمندری مہمات' : 'Pioneering Global Ocean Missions',
      sub: lang === 'ur' ? 'فیلڈ آپریشنز اور انٹرنشپس' : 'Global Operations & Internships',
      desc: lang === 'ur'
        ? 'بحر ہند کے مالدیپ ٹرائل فیلڈ اسٹیشنز اور اسلام آباد ہیڈ کوارٹر پر عالمی معیار کی تحقیق کا حصہ بنیں۔'
        : 'We recruit world-class deep-sea technicians, autonomous navigation software builders, and mechanical system architects.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1920',
      primaryBtn: lang === 'ur' ? 'درخواست کا فارم' : 'Application Form',
      secondaryBtn: lang === 'ur' ? 'رقم جمع کرانے کا طریقہ' : 'Fee Information',
    },
    {
      title: lang === 'ur' ? 'پیشہ ورانہ سہولیات اور ترقی' : 'Professional Facilities & Growth',
      sub: lang === 'ur' ? 'جدید ٹیسٹنگ ورک اسپیس' : 'State-Of-The-Art Labs',
      desc: lang === 'ur'
        ? 'تھری کوآرڈینیٹ پیمائش، 200 کلو تھرسٹ ٹیسٹ پلیٹ فارمز، اور 8000 میٹر گہرے سمندری دباؤ چیمبرز میں کام کریں۔'
        : 'Work with 3D coordinate measurement chambers, high-magnetic brushless subsea motors, and 80MPa extreme pressure chambers.',
      image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1920',
      primaryBtn: lang === 'ur' ? 'درخواست کا فارم' : 'Application Form',
      secondaryBtn: lang === 'ur' ? 'رجسٹریشن پورٹل' : 'Candidate Portal',
    }
  ];

  // Slides for About Page (3 Slides)
  const aboutSlides = [
    {
      title: lang === 'ur' ? 'بحری انجینئرنگ میں عالمی رہنما' : 'Global Leaders in Marine Systems',
      sub: lang === 'ur' ? 'مشن، وژن اور اقدار' : 'Corporate Identity & History',
      desc: lang === 'ur'
        ? 'ایک چھوٹی سب میرین موٹر لیب سے لے کر سمندری مہم جوئی کی روبوٹکس کے ایک معروف بین الاقوامی سپلائر تک کا سفر۔'
        : 'From a small subsea motor lab to a premier global supplier of oceanographic exploration robotics. We are ISO 9001 quality certified.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920',
      primaryBtn: lang === 'ur' ? 'رابطہ کریں' : 'Contact Us',
      secondaryBtn: lang === 'ur' ? 'ہماری ٹیکنالوجی' : 'Our Technology',
    },
    {
      title: lang === 'ur' ? 'انتہائی دباؤ اور معیار کی یقین دہانی' : 'Extreme Testing & Quality Assurance',
      sub: lang === 'ur' ? 'CE اور RoHS سرٹیفیکیشنز' : 'Certified Extreme Reliability',
      desc: lang === 'ur'
        ? 'ہائی مقناطیسی کثافت موٹرز، ویکٹر الگورتھم، فلوڈ میکینکس، اور کم شور والے زیر آب کنٹرولز۔'
        : 'Housing proprietary high-magnetic-density permanent magnet motors, FOC vector algorithm, fluid mechanics, and extreme reliability test labs.',
      image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1920',
      primaryBtn: lang === 'ur' ? 'رابطہ کریں' : 'Contact Us',
      secondaryBtn: lang === 'ur' ? 'سرٹیفکیٹس' : 'View Standards',
    },
    {
      title: lang === 'ur' ? 'اسلام آباد ہیڈ کوارٹرز اور ہیلپ ڈیسک' : 'Islamabad Headquarters & Helpdesk',
      sub: lang === 'ur' ? 'رابطہ کوآرڈینیٹس' : 'Coordinates & Communication',
      desc: lang === 'ur'
        ? 'کسی بھی انتظامی یا تکنیکی رہنمائی کے لیے ہمارے ہیلپ ڈیسک یا واٹس ایپ چینل پر رابطہ کریں۔'
        : 'Get in touch with our recruitment support office directly. We are located in Islamabad and offer 24/7 digital help desks.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1920',
      primaryBtn: lang === 'ur' ? 'رابطہ کریں' : 'Contact Us',
      secondaryBtn: lang === 'ur' ? 'واٹس ایپ ہیلپ' : 'WhatsApp Desk',
    }
  ];

  const activeSlides = page === 'jobs' ? jobsSlides : page === 'about_contact' ? aboutSlides : homeSlides;

  useEffect(() => {
    setCurrent(0);
  }, [page]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, activeSlides.length, page]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const handleAction = (btnType: 'primary' | 'secondary', index: number) => {
    // 1. JOBS PAGE
    if (page === 'jobs') {
      if (btnType === 'primary') {
        const el = document.getElementById('application-form-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        const el = document.getElementById('vacancies');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      return;
    }

    // 2. ABOUT US & CONTACT PAGE
    if (page === 'about_contact') {
      if (btnType === 'primary') {
        const el = document.getElementById('contact');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        const el = document.getElementById('detailed-vehicle-directory') || document.getElementById('why-choose-us');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      return;
    }

    // 3. HOME PAGE
    if (page === 'home') {
      // Home slide 1 or slide 2 or slide 3 primary CTA -> "How to Apply" -> goes to Jobs and scrolls to application form!
      if (btnType === 'primary' && activeSlides[index].primaryBtn === (lang === 'ur' ? 'درخواست دینے کا طریقہ' : 'How to Apply')) {
        if (onChangePage) {
          onChangePage('jobs');
          setTimeout(() => {
            const el = document.getElementById('application-form-section');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
        return;
      }

      // Home last slide, Contact Us button
      if (index === 4 && btnType === 'primary') {
        if (onChangePage) {
          onChangePage('about_contact');
          setTimeout(() => {
            const el = document.getElementById('contact');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
        return;
      }

      // Default Home Actions
      if (onChangePage) {
        if (btnType === 'secondary' && activeSlides[index].secondaryBtn === (lang === 'ur' ? 'ملازمتیں دیکھیں' : 'Explore Vacancies')) {
          onChangePage('jobs');
        } else {
          onChangePage('about_contact');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[620px] w-full overflow-hidden bg-slate-950 pt-16 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      <div className="absolute inset-0 w-full h-full z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with parallax style */}
            <img
              src={activeSlides[current].image}
              alt={activeSlides[current].title}
              className="w-full h-full object-cover object-center"
            />
            {/* Dark Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-950/80 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30 z-10" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Content */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-3xl text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-teal-300 uppercase">
                  {activeSlides[current].sub}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                {activeSlides[current].title}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl font-light">
                {activeSlides[current].desc}
              </p>

              {/* Action Buttons with Premium Micro-interactions */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <motion.button
                  whileHover={{ 
                    scale: 1.04, 
                    y: -2, 
                    backgroundColor: "#007c85", 
                    boxShadow: "0 10px 25px -5px rgba(0, 156, 166, 0.4)" 
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={() => handleAction('primary', current)}
                  className="px-8 py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer flex items-center justify-center space-x-2 border border-transparent transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>{activeSlides[current].primaryBtn}</span>
                </motion.button>

                <motion.button
                  whileHover={{ 
                    scale: 1.04, 
                    y: -2, 
                    backgroundColor: "rgba(255, 255, 255, 0.15)", 
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" 
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={() => handleAction('secondary', current)}
                  className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-xs cursor-pointer transition-all"
                >
                  <span>{activeSlides[current].secondaryBtn}</span>
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Manual Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-slate-900/60 border border-slate-800 text-white hover:bg-slate-800 hover:border-slate-700 transition-all backdrop-blur-md cursor-pointer group"
        title="Previous Slide"
      >
        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-slate-900/60 border border-slate-800 text-white hover:bg-slate-800 hover:border-slate-700 transition-all backdrop-blur-md cursor-pointer group"
        title="Next Slide"
      >
        <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Pagination indicators (Dots) */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800/40">
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              idx === current ? 'w-6 bg-teal-400' : 'w-2 bg-slate-600 hover:bg-slate-500'
            }`}
            style={idx === current ? { backgroundColor: primaryColor } : {}}
            title={`Go to Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator at the bottom (animated mouse/arrow icon) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center space-y-1 pointer-events-none">
        <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase opacity-75">
          {lang === 'ur' ? 'نیچے اسکرول کریں' : 'Scroll Down'}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          <svg className="w-5 h-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: primaryColor }}>
            <rect x="6" y="3" width="12" height="18" rx="6" strokeWidth="2" />
            <circle cx="12" cy="8" r="1.5" fill="currentColor" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
