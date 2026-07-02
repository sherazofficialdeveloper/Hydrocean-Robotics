/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, BookOpen, GraduationCap, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { WebsiteSettings } from '../types';

interface ResearchTimelineProps {
  settings: WebsiteSettings;
}

export default function ResearchTimeline({ settings }: ResearchTimelineProps) {
  const primaryColor = settings.primaryColor || '#009ca6';

  const steps = [
    {
      year: 'Phase 1: Basic Research',
      title: 'Lab Modeling & Simulations',
      desc: 'Conducting computer simulations of subsea water dynamics, fluid boundaries, structural limits, and acoustic propagation patterns inside modern digital twin softwares.',
      Icon: BookOpen
    },
    {
      year: 'Phase 2: Development & Prototyping',
      title: 'Structural Fabrication',
      desc: 'Precision CNC machining from specialized lightweight titanium blocks, oil-filling procedures, vacuum pressure testing, and electronics potting inside secure resin materials.',
      Icon: Award
    },
    {
      year: 'Phase 3: Deep-Water Training',
      title: 'Calibrations & Pool Trials',
      desc: 'Testing thrusters and servos inside specialized laboratory basins to calibrate thrust-to-power curves, FOC motor control boundaries, and communication link latencies.',
      Icon: GraduationCap
    },
    {
      year: 'Phase 4: International Field Station',
      title: 'Open-Ocean Field Trials',
      desc: 'Deploying completed vehicle platforms in high-salinity deep waters from our research hulls to validate real-time acoustics telemetry, autopilot mapping, and deep ocean durability.',
      Icon: Globe
    }
  ];

  return (
    <section id="research" className="py-24 bg-slate-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600" style={{ color: primaryColor }}>
            Research, Development & Training
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
            Our Maritime Science Lifecycle
          </h2>
          <div className="w-12 h-1 bg-teal-600 mx-auto mt-4" style={{ backgroundColor: primaryColor }}></div>
          <p className="text-gray-600 mt-6 leading-relaxed text-sm">
            We follow an exhaustive scientific sequence to take innovative ideas from dry-land digital laboratories into active deployments in deep-sea ocean environments.
          </p>
        </div>

        {/* Timeline Structure */}
        <div className="relative border-l border-gray-200 max-w-4xl mx-auto pl-6 sm:pl-10 space-y-12">
          
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover="hover"
              className="relative group"
            >
              
              {/* Timeline Connector Indicator */}
              <motion.div
                variants={{
                  hover: { scale: 1.15, rotate: 360 }
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="absolute -left-[31px] sm:-left-[47px] top-1.5 p-1.5 rounded-full border-4 border-white shadow-md z-10"
                style={{ backgroundColor: primaryColor }}
              >
                <step.Icon className="h-5 w-5 text-white" />
              </motion.div>

              {/* Step Card Content */}
              <motion.div
                variants={{
                  hover: { y: -5, borderColor: primaryColor }
                }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <span className="text-xs font-mono font-bold tracking-wider text-teal-700 uppercase" style={{ color: primaryColor }}>
                  {step.year}
                </span>
                <h3 className="text-lg sm:text-xl font-display font-bold text-gray-950 mt-1 mb-3">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
                  {step.desc}
                </p>
              </motion.div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
