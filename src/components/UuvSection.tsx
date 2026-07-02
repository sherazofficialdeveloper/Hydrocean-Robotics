/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, ShieldCheck, Compass, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { WebsiteSettings } from '../types';

interface UuvSectionProps {
  settings: WebsiteSettings;
}

export default function UuvSection({ settings }: UuvSectionProps) {
  const primaryColor = settings.primaryColor || '#009ca6';

  const items = [
    {
      name: 'TD10A Subsea Duct Thruster',
      specs: '24V-300V • 10kgf thrust • Built-in high-voltage ESC',
      desc: 'Our flagship underwater thruster utilizes a robust vector-ducted design, machined from aviation-grade aluminum and encapsulated in marine resin for flawless operation down to 3000 meters.',
      Icon: Zap
    },
    {
      name: 'ST005 Subsea Steering Servo',
      specs: '5Nm Torque • Aluminum/Titanium build • RS485 Interface',
      desc: 'Engineered specifically for deep-sea submersibles and robotic arms, this compact actuator offers high-torque feedback and operates fully oil-filled to withstand crushing hydrostatic forces.',
      Icon: Layers
    },
    {
      name: 'Deep-Ocean Pressure Enclosure',
      specs: 'Tested to 8000m • Optical acrylic lens • Vacuum seals',
      desc: 'Tested inside our 80Mpa laboratory pressure vessels, our structural casings ensure sensitive computing chips and lithium battery arrays remain perfectly bone-dry under ultimate stress levels.',
      Icon: ShieldCheck
    }
  ];

  return (
    <section id="uuv" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Detail */}
          <div className="lg:col-span-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600" style={{ color: primaryColor }}>
              Unmanned Underwater Vehicles (UUV)
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
              Deep-Sea Propelling & Actuating Solutions
            </h2>
            <p className="text-gray-600 mt-4 leading-relaxed font-sans text-sm">
              Hydrocean supplies specialized, pressure-tolerant subsea motor drives and actuators to leading deep-ocean research programs and submersibles globally. Explore our modular underwater components that drive deep-sea robotic arm articulators.
            </p>

            <div className="space-y-4 mt-10">
              {items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover="hover"
                  className="group flex space-x-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer"
                >
                  <motion.div
                    variants={{
                      hover: { rotateX: 180, backgroundColor: primaryColor, color: '#ffffff' }
                    }}
                    transition={{ duration: 0.4 }}
                    className="p-3 bg-slate-50 border border-gray-100 rounded-xl shrink-0 h-fit text-teal-600 transition-colors"
                    style={{ color: primaryColor }}
                  >
                    <item.Icon className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <h3 className="font-display font-bold text-base text-gray-950 transition-colors group-hover:text-teal-600" style={{ '--primary': primaryColor } as any}>{item.name}</h3>
                    <p className="text-[10px] font-mono tracking-wider text-teal-700 font-semibold mt-0.5">{item.specs}</p>
                    <p className="text-xs text-gray-500 font-sans leading-relaxed mt-2">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Floating Images */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&fit=crop&q=80"
                  alt="Underwater vehicle assembly"
                  className="w-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-500"
                />
              </div>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between aspect-[4/3] cursor-pointer"
              >
                <Compass className="h-8 w-8 text-teal-400 animate-spin-slow" />
                <div>
                  <h4 className="font-display font-bold text-sm">Autonomous UUV</h4>
                  <p className="text-[10px] text-gray-400 font-mono mt-1">Deep ocean mapping ready</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-4 pt-8"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-slate-50 border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between aspect-[4/3] cursor-pointer"
              >
                <span className="text-3xl font-bold font-display text-gray-900">8000m</span>
                <div>
                  <h4 className="font-display font-bold text-sm text-gray-900">Pressure Tolerance</h4>
                  <p className="text-[10px] text-gray-500 font-mono mt-1">Validated inside 80MPa chambers</p>
                </div>
              </motion.div>
              <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&fit=crop&q=80"
                  alt="Acoustic hydrophone sensor array"
                  className="w-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
