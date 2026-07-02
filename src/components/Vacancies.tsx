/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Briefcase, Landmark, ScrollText, Award, Calendar, ChevronRight, ChevronLeft,
  Search, MapPin, SlidersHorizontal, ArrowUpDown, Layers, Activity 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Job, WebsiteSettings } from '../types';
import { Language, getTranslation } from '../lib/translations';

interface VacanciesProps {
  jobs: Job[];
  loading: boolean;
  onApply: (job: Job) => void;
  settings: WebsiteSettings;
  lang: Language;
}

export default function Vacancies({ jobs, loading, onApply, settings, lang }: VacanciesProps) {
  const primaryColor = settings.primaryColor || '#009ca6';

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedExp, setSelectedExp] = useState('');
  const [selectedEmpType, setSelectedEmpType] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Helper helper to dynamically categorise a job's department based on metadata
  const getJobDept = (job: Job) => {
    const text = (job.title + ' ' + (job.description || '')).toLowerCase();
    if (text.includes('acoustic') || text.includes('sonar') || text.includes('research') || text.includes('ph.d') || text.includes('r&d')) {
      return lang === 'ur' ? 'تحقیق و ترقی' : 'Research & Development';
    }
    if (text.includes('pilot') || text.includes('field') || text.includes('operation') || text.includes('amphibious')) {
      return lang === 'ur' ? 'فیلڈ آپریشنز' : 'Field Operations';
    }
    return lang === 'ur' ? 'روبوٹکس انجینئرنگ' : 'Robotics Engineering';
  };

  // Helper helper to dynamically categorise a job's experience level based on metadata
  const getJobExpLevel = (job: Job) => {
    const text = ((job.qualification || '') + ' ' + (job.description || '')).toLowerCase();
    if (text.includes('ph.d') || text.includes('lead') || text.includes('senior') || text.includes('principal') || text.includes('m.sc')) {
      return lang === 'ur' ? 'مڈ ٹو سینئر لیول' : 'Mid-to-Senior';
    }
    return lang === 'ur' ? 'انٹری لیول / گریجویٹ' : 'Entry Level / Graduate';
  };

  // Extract unique locations and departments for filters
  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(jobs.map(j => j.country))).filter(Boolean);
  }, [jobs]);

  const uniqueDepts = useMemo(() => {
    return Array.from(new Set(jobs.map(j => getJobDept(j))));
  }, [jobs, lang]);

  // Filter & Sort jobs
  const processedJobs = useMemo(() => {
    let list = [...jobs];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(j => {
        const titleStr = (lang === 'ur' && j.titleUr ? j.titleUr : j.title).toLowerCase();
        const descStr = (lang === 'ur' && j.descriptionUr ? j.descriptionUr : j.description).toLowerCase();
        const qualStr = (lang === 'ur' && j.qualificationUr ? j.qualificationUr : j.qualification).toLowerCase();
        return (
          titleStr.includes(q) ||
          descStr.includes(q) ||
          qualStr.includes(q) ||
          j.country.toLowerCase().includes(q)
        );
      });
    }

    // 2. Filter Location
    if (selectedLocation) {
      list = list.filter(j => j.country === selectedLocation);
    }

    // 3. Filter Department
    if (selectedDept) {
      list = list.filter(j => getJobDept(j) === selectedDept);
    }

    // 4. Filter Experience Level
    if (selectedExp) {
      list = list.filter(j => getJobExpLevel(j) === selectedExp);
    }

    // 5. Filter Employment Type
    if (selectedEmpType) {
      list = list.filter(j => {
        const text = (j.title + ' ' + j.description).toLowerCase();
        if (selectedEmpType === 'Contract') return text.includes('contract') || text.includes('stipend');
        if (selectedEmpType === 'Remote') return text.includes('remote') || text.includes('telecommute');
        return !text.includes('contract') && !text.includes('remote'); // Default to Full Time
      });
    }

    // 6. Sort
    if (sortBy === 'alphabetical') {
      list.sort((a, b) => {
        const titleA = lang === 'ur' && a.titleUr ? a.titleUr : a.title;
        const titleB = lang === 'ur' && b.titleUr ? b.titleUr : b.title;
        return titleA.localeCompare(titleB);
      });
    } else {
      // latest
      list.sort((a, b) => (b.createdAt || b.id).localeCompare(a.createdAt || a.id));
    }

    return list;
  }, [jobs, searchQuery, selectedLocation, selectedDept, selectedExp, selectedEmpType, sortBy, lang]);

  // Paginated Jobs
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [processedJobs, currentPage]);

  const totalPages = Math.ceil(processedJobs.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('vacancies');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 12px 16px -8px rgba(0, 0, 0, 0.06)",
      borderColor: primaryColor,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const tagHoverVariants = {
    initial: {
      scale: 1,
      backgroundColor: primaryColor + '10',
      color: primaryColor,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.05,
      backgroundColor: primaryColor,
      color: "#ffffff",
      transition: { duration: 0.3 }
    }
  };

  return (
    <section id="vacancies" className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600" style={{ color: primaryColor }}>
            {getTranslation('jobsHeading', lang)}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
            {lang === 'ur' ? 'ہائیڈروشن میرین اور روبوٹکس کیریئرز' : 'Available Maritime Intelligence Careers'}
          </h2>
          <div className="w-12 h-1 bg-teal-600 mx-auto mt-4" style={{ backgroundColor: primaryColor }}></div>
          <p className="text-gray-600 mt-6 leading-relaxed text-sm">
            {getTranslation('jobsSubtitle', lang)}
          </p>
        </div>

        {/* Filters Panel */}
        <div className="bg-slate-50 border border-gray-150 rounded-3xl p-6 mb-12 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <SlidersHorizontal className="h-4.5 w-4.5 text-gray-700" style={{ color: primaryColor }} />
            <h3 className="font-display font-bold text-sm text-gray-900 uppercase tracking-wider">
              {lang === 'ur' ? 'جدید تلاش اور فلٹرز' : 'Search & Advanced Filters'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={getTranslation('jobSearchPlaceholder', lang)}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs text-gray-800 shadow-sm transition-all"
              />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <Layers className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs text-gray-800 shadow-sm appearance-none cursor-pointer"
              >
                <option value="">{lang === 'ur' ? 'تمام شعبہ جات' : 'All Departments'}</option>
                {uniqueDepts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs text-gray-800 shadow-sm appearance-none cursor-pointer"
              >
                <option value="">{getTranslation('jobFilterLocation', lang)}</option>
                {uniqueLocations.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div className="relative">
              <Activity className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <select
                value={selectedExp}
                onChange={(e) => {
                  setSelectedExp(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs text-gray-800 shadow-sm appearance-none cursor-pointer"
              >
                <option value="">{lang === 'ur' ? 'تجربہ کا انتخاب' : 'All Experience Levels'}</option>
                <option value={lang === 'ur' ? 'انٹری لیول / گریجویٹ' : 'Entry Level / Graduate'}>
                  {lang === 'ur' ? 'انٹری لیول / گریجویٹ' : 'Entry Level / Graduate'}
                </option>
                <option value={lang === 'ur' ? 'مڈ ٹو سینئر لیول' : 'Mid-to-Senior'}>
                  {lang === 'ur' ? 'مڈ ٹو سینئر لیول' : 'Mid-to-Senior'}
                </option>
              </select>
            </div>

            {/* Employment Type */}
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <select
                value={selectedEmpType}
                onChange={(e) => {
                  setSelectedEmpType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs text-gray-800 shadow-sm appearance-none cursor-pointer"
              >
                <option value="">{lang === 'ur' ? 'ملازمت کی اقسام' : 'All Employment Types'}</option>
                <option value="Full Time">{lang === 'ur' ? 'مکمل وقتی ملازمت' : 'Full-Time Employee'}</option>
                <option value="Contract">{lang === 'ur' ? 'کنٹریکٹ / وظیفہ کی بنیاد' : 'Contract / Stipend Role'}</option>
                <option value="Remote">{lang === 'ur' ? 'ریموٹ ورک' : 'Remote Operations'}</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs text-gray-800 shadow-sm appearance-none cursor-pointer"
              >
                <option value="latest">{lang === 'ur' ? 'تازہ ترین آسامیاں' : 'Sort by: Latest Added'}</option>
                <option value="alphabetical">{lang === 'ur' ? 'حروف تہجی کی ترتیب' : 'Sort by: Alphabetical'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Render */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-10 w-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${primaryColor} transparent ${primaryColor} ${primaryColor}` }}></div>
            <p className="text-sm text-gray-400 font-mono">Loading active vacancies...</p>
          </div>
        ) : processedJobs.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 border border-gray-100 rounded-3xl p-8 max-w-xl mx-auto">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-gray-900">
              {lang === 'ur' ? 'کوئی نوکری نہیں ملی' : 'No matching vacancies found'}
            </h3>
            <p className="text-sm text-gray-500 font-sans mt-2">
              {lang === 'ur' ? 'براہ کرم دوسرے فلٹرز منتخب کریں۔' : 'Try adjusting your search criteria or resetting filters to see other career opportunities.'}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
              {paginatedJobs.map((job) => {
                const jobDept = getJobDept(job);
                const titleText = lang === 'ur' && job.titleUr ? job.titleUr : job.title;
                const qualificationText = lang === 'ur' && job.qualificationUr ? job.qualificationUr : job.qualification;
                const descriptionText = lang === 'ur' && job.descriptionUr ? job.descriptionUr : job.description;

                return (
                  <motion.div
                    key={job.id}
                    variants={cardHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4 }}
                    className="bg-slate-50 border border-gray-100/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Job Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5 mb-6">
                        <div>
                          <motion.span 
                            variants={tagHoverVariants}
                            className="text-[10px] font-mono tracking-wider font-bold uppercase px-2.5 py-0.5 rounded-full inline-block mb-2"
                          >
                            {jobDept}
                          </motion.span>
                          <h3 className="text-lg sm:text-xl font-display font-bold text-gray-900">{titleText}</h3>
                          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2">
                            <span className="text-xs text-gray-600 font-mono flex items-center gap-1">
                              <Landmark className="h-3.5 w-3.5" /> {job.country}
                            </span>
                            <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" /> {lang === 'ur' ? 'مکمل وقت' : 'Full Time'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Salary / Qualification info pills */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                          <p className="text-[10px] font-mono tracking-widest uppercase text-gray-400">
                            {getTranslation('jobSalary', lang)}
                          </p>
                          <p className="text-xs font-bold text-gray-800 mt-1">{job.salary}</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                          <p className="text-[10px] font-mono tracking-widest uppercase text-gray-400">
                            {getTranslation('jobQualification', lang)}
                          </p>
                          <p className="text-xs font-bold text-gray-800 mt-1 line-clamp-1" title={qualificationText}>{qualificationText}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">{descriptionText}</p>
                      </div>

                      {/* Responsibilities list */}
                      {job.responsibilities && job.responsibilities.length > 0 && (
                        <div className="mb-6">
                           <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                            <ScrollText className="h-4 w-4" /> {lang === 'ur' ? 'بنیادی ذمہ داریاں' : 'Core Responsibilities'}
                          </h4>
                          <ul className="space-y-1.5 pl-1">
                            {job.responsibilities.map((resp, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                                <span className="text-teal-600 font-bold shrink-0 mt-0.5" style={{ color: primaryColor }}>•</span>
                                <span className="font-sans leading-relaxed">{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Requirements list */}
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                            <Award className="h-4 w-4" /> {lang === 'ur' ? 'اہم شرائط اور قابلیتیں' : 'Essential Requirements'}
                          </h4>
                          <ul className="space-y-1.5 pl-1">
                            {job.requirements.map((req, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                                <span className="text-teal-600 font-bold shrink-0 mt-0.5" style={{ color: primaryColor }}>•</span>
                                <span className="font-sans leading-relaxed">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Apply button with micro-interactions */}
                    <div className="border-t border-gray-200/60 pt-6">
                      <motion.button
                        onClick={() => onApply(job)}
                        whileHover={{ 
                          scale: 1.04, 
                          backgroundColor: "#007c85", 
                          boxShadow: "0 10px 25px -5px rgba(0, 156, 166, 0.4)" 
                        }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="w-full py-3.5 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2 border border-transparent"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <span>{getTranslation('btnApplyNow', lang)}</span>
                        <ChevronRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4 border-t border-gray-100 pt-8 mt-12">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 border border-gray-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`h-9 w-9 text-xs font-bold rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                        currentPage === page
                          ? 'text-white shadow-sm'
                          : 'text-gray-600 border border-gray-200 hover:bg-slate-50'
                      }`}
                      style={currentPage === page ? { backgroundColor: primaryColor } : {}}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-2 border border-gray-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
