/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  ClipboardList, 
  Map, 
  Settings, 
  Ship, 
  Wifi, 
  Activity, 
  BarChart3, 
  Award 
} from 'lucide-react';
import { WebsiteSettings } from '../types';
import { Language } from '../lib/translations';

interface HowWeWorkProps {
  settings: WebsiteSettings;
  lang: Language;
}

export default function HowWeWork({ settings, lang }: HowWeWorkProps) {
  const primaryColor = settings.primaryColor || '#009ca6';

  const steps = [
    {
      id: '01',
      title: lang === 'ur' ? 'ضروریات کا تجزیہ' : 'Requirement Analysis',
      desc: lang === 'ur' 
        ? 'ہم گاہک کے مشن کے مقاصد، گہرائی، سمندری حالات اور ڈیٹا جمع کرنے کی ضروریات کا تفصیلی جائزہ لیتے ہیں۔'
        : 'Exhaustive consultation to map mission goals, environmental parameters, operational depths, and specific data payloads.',
      Icon: ClipboardList
    },
    {
      id: '02',
      title: lang === 'ur' ? 'مشن کی منصوبہ بندی' : 'Mission Planning',
      desc: lang === 'ur'
        ? 'جدید ترین تھری ڈی سمپلر اور نیویگیشن سافٹ ویئر کے ذریعے پاتھ ٹریکنگ اور خود کار واپسی کے روٹس ڈیزائن کرنا۔'
        : 'Designing robust autonomous navigation paths, waypoint sequences, collision avoidance filters, and safety parameters.',
      Icon: Map
    },
    {
      id: '03',
      title: lang === 'ur' ? 'گاڑی کی ترتیب' : 'Vehicle Configuration',
      desc: lang === 'ur'
        ? 'مشن کے مطابق سینسرز، کیمرے، مواصلاتی ماڈیول اور تھرسٹرز کی تنصیب اور کیلیبریشن۔'
        : 'Integrating customized sensor packages, multibeam sonars, specific payload cameras, and calibrating vector thrusters.',
      Icon: Settings
    },
    {
      id: '04',
      title: lang === 'ur' ? 'میدان میں روانگی' : 'Deployment',
      desc: lang === 'ur'
        ? 'تحقیقی جہاز یا ساحل سے خود مختار گاڑی کو پانی میں چھوڑنا اور ابتدائی سسٹمز ٹیسٹ مکمل کرنا۔'
        : 'Precise launch of USV/AUV from designated research support vessels, performing initial subsea diagnostic checks.',
      Icon: Ship
    },
    {
      id: '05',
      title: lang === 'ur' ? 'ریئل ٹائم ڈیٹا اکٹھا کرنا' : 'Real-Time Data Collection',
      desc: lang === 'ur'
        ? 'خود کار نیویگیشن کے دوران لائیو سونار، تھرمل امیجنگ اور ماحولیاتی ماپ ریکارڈ کرنا۔'
        : 'Continuous real-time telemetry extraction, high-frequency sonar sweeps, and deep environmental metrics tracking.',
      Icon: Wifi
    },
    {
      id: '06',
      title: lang === 'ur' ? 'نگرانی اور ٹریکنگ' : 'Monitoring',
      desc: lang === 'ur'
        ? 'سیٹلائٹ کلاؤڈ نیٹ ورک یا صوتی لہروں کے ذریعے گاڑی کی پوزیشن اور صحت پر مسلسل نظر رکھنا۔'
        : 'Supervising position fixes, vehicle health, battery depletion rates, and autonomous status via acoustic links.',
      Icon: Activity
    },
    {
      id: '07',
      title: lang === 'ur' ? 'ڈیٹا کا تجزیہ' : 'Data Analysis',
      desc: lang === 'ur'
        ? 'مشین لرننگ الگورتھم کی مدد سے خام ڈیٹا کی پروسیسنگ اور تھری ڈی سمندری نقشوں کی تیاری۔'
        : 'Processing raw physical data, cleaning multibeam bathymetric point clouds, and applying ML anomaly detection filters.',
      Icon: BarChart3
    },
    {
      id: '08',
      title: lang === 'ur' ? 'حتمی رپورٹ اور نتائج' : 'Final Reports & Results',
      desc: lang === 'ur'
        ? 'گاہک کو تفصیلی تھری ڈی امیجنگ رپورٹس، پائپ لائن معائنہ کے فائلز اور سائنسی نتائج کی فراہمی۔'
        : 'Providing actionable GIS maps, subsea anomalies files, visual pipeline defect sheets, and standard certified reports.',
      Icon: Award
    }
  ];

  // Coordinated Variants for steps
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
      backgroundColor: "rgba(248, 250, 252, 1)", // bg-slate-50
      color: primaryColor,
      borderColor: "rgba(241, 245, 249, 1)",
      transition: { duration: 0.3 }
    },
    hover: {
      rotateY: 360,
      scale: 1.1,
      backgroundColor: primaryColor,
      color: "#ffffff",
      borderColor: primaryColor,
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-gray-100" id="how-we-work">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600 animate-pulse" style={{ color: primaryColor }}>
            {lang === 'ur' ? 'ہم کیسے کام کرتے ہیں' : 'OPERATIONAL LIFECYCLE'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
            {lang === 'ur' ? 'ہماری کام کرنے کی تفصیلی ترتیب' : 'Our End-to-End Mission Workflow'}
          </h2>
          <div className="w-12 h-1 bg-teal-600 mx-auto mt-4" style={{ backgroundColor: primaryColor }}></div>
          <p className="text-gray-600 mt-6 leading-relaxed text-sm font-sans">
            {lang === 'ur'
              ? 'مشن کی ابتدائی منصوبہ بندی سے لے کر حتمی ڈیٹا رپورٹس کی فراہمی تک، ہم ہر مرحلے پر بین الاقوامی معیار اور سائنسی قوانین کی پاسداری کرتے ہیں۔'
              : 'Our systematic maritime deployment blueprint ensures rigorous safety protocols and pristine data deliverables at every milestone.'}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Connecting SVG Arrow Lines for Desktop */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 230 110 L 290 110 M 510 110 L 570 110 M 790 110 L 850 110" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 6" />
            </svg>
          </div>

          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              variants={cardHoverVariants}
              initial="initial"
              whileHover="hover"
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative bg-white border border-gray-150 rounded-2xl p-6 transition-all duration-300 z-10 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Step ID Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-mono font-extrabold text-gray-200 transition-colors">
                    {step.id}
                  </span>
                  
                  <motion.div 
                    variants={iconHoverVariants}
                    className="p-3 rounded-xl border border-gray-100 flex items-center justify-center shrink-0"
                  >
                    <step.Icon className="h-6 w-6" />
                  </motion.div>
                </div>

                {/* Info */}
                <h3 className="text-base font-display font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-sans font-light">
                  {step.desc}
                </p>
              </div>

              {/* Progress Flow Indicator line for Mobile */}
              <div className="w-full h-0.5 bg-gray-100 mt-6 block lg:hidden" />
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
