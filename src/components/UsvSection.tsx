/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Info, X, Zap, Cpu, Compass, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { WebsiteSettings } from '../types';

interface UsvSectionProps {
  settings: WebsiteSettings;
}

interface UsvVessel {
  id: string;
  name: string;
  image: string;
  tag: string;
  spec: string;
  detailedSpecs: {
    length: string;
    payloadCapacity: string;
    autonomy: string;
    propulsion: string;
    sensors: string;
    controlSystem: string;
  };
  desc: string;
}

export default function UsvSection({ settings }: UsvSectionProps) {
  const [selectedVessel, setSelectedVessel] = useState<UsvVessel | null>(null);
  const primaryColor = settings.primaryColor || '#009ca6';

  const vessels: UsvVessel[] = [
    {
      id: 'usv_wave_glider',
      name: 'Hydro-Wave Glider WG2',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&fit=crop&q=80',
      tag: 'Ocean Survey USV',
      spec: 'Solar & Wave powered autonomous hull, infinite duration testing capacity.',
      detailedSpecs: {
        length: '3.05 Meters',
        payloadCapacity: '45 Kilograms max',
        autonomy: 'Up to 1 year constant monitoring',
        propulsion: 'Wave-harvesting sub-wings + backup brushless subsea thruster',
        sensors: 'Meteorology suite, ADCP sonar, water quality sensors',
        controlSystem: 'HydroPilot RTK Autopilot'
      },
      desc: 'The Wave Glider is designed for perpetual marine data collection. Utilizing wave movement for propulsion and high-capacity solar arrays for onboard instrumentation, it maps maritime variables with absolute zero carbon output.'
    },
    {
      id: 'usv_shallow_survey',
      name: 'Amphibious Surveyor AS10',
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&fit=crop&q=80',
      tag: 'Hydrographic USV',
      spec: 'Carbon fiber modular catamaran, dual-hydroduct propulsion, shallow reef survey.',
      detailedSpecs: {
        length: '1.20 Meters',
        payloadCapacity: '15 Kilograms',
        autonomy: '8 Hours continuous mapping',
        propulsion: 'Dual Hydro-Jet Brushless Thrusters (120N thrust)',
        sensors: 'Single-beam/Multi-beam echo sounders, Side-scan sonar',
        controlSystem: 'ArduPilot/Mission Planner Integrated with RTK GPS'
      },
      desc: 'An ultra-maneuverable catamaran optimized for shallow waters, harbors, and environmental monitoring. With modular electronics bays and heavy RTK-GPS integration, it achieves centimeter-level bathymetric maps.'
    }
  ];

  return (
    <section id="usv" className="py-24 bg-slate-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600" style={{ color: primaryColor }}>
              Unmanned Surface Vehicles (USV)
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
              Autonomous Patrol & Survey Vessels
            </h2>
            <p className="text-gray-600 mt-4 leading-relaxed max-w-2xl font-sans">
              Hydrocean USVs navigate extreme open-water environments with advanced waypoint guidance, dynamic pathing, obstacle-avoidance lidar, and robust satellite integrations.
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right hidden lg:block">
            <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-mono font-bold text-gray-700">Autonomous Level 4 Standard</span>
            </div>
          </div>
        </div>

        {/* Vessel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {vessels.map((v, idx) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover="hover"
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <div className="relative aspect-video overflow-hidden">
                  <motion.img
                    variants={{
                      hover: { scale: 1.05 }
                    }}
                    transition={{ duration: 0.4 }}
                    src={v.image}
                    alt={v.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gray-900/95 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {v.tag}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-display font-bold text-gray-950 transition-colors group-hover:text-teal-600" style={{ '--primary': primaryColor } as any}>{v.name}</h3>
                  <p className="text-sm text-gray-600 font-sans mt-3 line-clamp-3">{v.desc}</p>
                </div>
              </div>

              <div className="px-8 pb-8">
                <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-sans flex items-center gap-2">
                    <motion.span
                      variants={{
                        hover: { rotateY: 180, backgroundColor: primaryColor, color: '#ffffff', borderColor: primaryColor }
                      }}
                      transition={{ duration: 0.4 }}
                      className="p-1.5 bg-slate-50 border border-gray-100 rounded-xl inline-flex items-center justify-center text-teal-600 transition-colors duration-300"
                      style={{ color: primaryColor }}
                    >
                      <Activity className="h-4 w-4" />
                    </motion.span>
                    <span>Solar/Jet Propulsion</span>
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedVessel(v)}
                    className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
                    style={{ color: primaryColor }}
                  >
                    <Info className="h-4 w-4" />
                    <span>Technical Spec</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* READ MORE MODAL */}
        {selectedVessel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
              {/* Header */}
              <div className="relative p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-teal-600" style={{ color: primaryColor }}>
                    {selectedVessel.tag}
                  </span>
                  <h3 className="text-xl font-display font-bold text-gray-900 mt-1">{selectedVessel.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedVessel(null)}
                  className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-6">
                <img
                  src={selectedVessel.image}
                  alt={selectedVessel.name}
                  className="w-full aspect-video object-cover rounded-xl"
                />
                <p className="text-sm text-gray-600 leading-relaxed font-sans">{selectedVessel.desc}</p>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="font-display font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                    <Cpu className="h-4.5 w-4.5 text-teal-600" style={{ color: primaryColor }} /> Technical Parameters
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(selectedVessel.detailedSpecs).map(([key, value]) => (
                      <div key={key} className="bg-slate-50 border border-gray-100 rounded-xl p-4">
                        <p className="text-[10px] font-mono tracking-widest uppercase text-gray-400">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </p>
                        <p className="text-xs font-semibold text-gray-800 mt-1">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setSelectedVessel(null)}
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all"
                >
                  Close Parameters
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
