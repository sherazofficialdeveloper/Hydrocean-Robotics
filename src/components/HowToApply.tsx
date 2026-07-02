/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Briefcase, FormInput, Landmark, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { WebsiteSettings } from '../types';

interface HowToApplyProps {
  settings: WebsiteSettings;
}

export default function HowToApply({ settings }: HowToApplyProps) {
  const primaryColor = settings.primaryColor || '#009ca6';

  const steps = [
    {
      num: '01',
      title: 'Register or Log In',
      desc: 'Register an account or log in to create and manage your secure candidate recruitment profile.',
      Icon: User
    },
    {
      num: '02',
      title: 'Select Position',
      desc: 'Browse through our active list of jobs, read requirements, and click Apply on your desired vacancy.',
      Icon: Briefcase
    },
    {
      num: '03',
      title: 'Fill Out Application',
      desc: 'Enter your name, father\'s name, WhatsApp contact, technical skills, and professional experience.',
      Icon: FormInput
    },
    {
      num: '04',
      title: 'Manual Fee Deposit',
      desc: 'Manually deposit the required application fee at the designated bank (outside this website) and keep the receipt.',
      Icon: Landmark
    },
    {
      num: '05',
      title: 'Upload Slip & Submit',
      desc: 'Upload a clear photo of your bank deposit slip, attach your CV and profile picture, and submit.',
      Icon: Send
    }
  ];

  return (
    <section id="how-to-apply" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600" style={{ color: primaryColor }}>
            Filing Instructions
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
            Filing Flow & Step Guidelines
          </h2>
          <div className="w-12 h-1 bg-teal-600 mx-auto mt-4" style={{ backgroundColor: primaryColor }}></div>
          <p className="text-gray-600 mt-6 leading-relaxed text-sm">
            Please follow these simple, structured steps to successfully complete and submit your application for review.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover="hover"
              className="relative bg-slate-50 border border-gray-100 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-lg cursor-pointer"
              style={{ hoverBorderColor: primaryColor } as any}
            >
              <div>
                <span className="absolute top-4 right-4 text-3xl font-display font-bold text-teal-600/10 select-none">
                  {step.num}
                </span>
                <motion.div
                  variants={{
                    hover: { rotateY: 180, backgroundColor: primaryColor, color: '#ffffff' }
                  }}
                  transition={{ duration: 0.4 }}
                  className="p-3 bg-white rounded-xl border border-gray-100 inline-block mb-6 shadow-sm text-teal-600"
                  style={{ color: primaryColor }}
                >
                  <step.Icon className="h-6 w-6" />
                </motion.div>
                <h3 className="font-display font-bold text-sm text-gray-900 mb-2 transition-colors group-hover:text-teal-600">{step.title}</h3>
                <p className="text-xs text-gray-500 font-sans leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
