/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Compass, MessageSquare, ArrowUp, CheckCircle, ShieldAlert, Award, Briefcase, MapPin, Calendar, Landmark, Sparkles, ArrowRight, Home, Menu, X, Info, Globe, LogIn, UserPlus, LogOut, ChevronRight, Mail, Phone, FileText, Download, Eye, AlertTriangle } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import AboutPreview from './components/AboutPreview';
import HowWeWork from './components/HowWeWork';
import UsvSection from './components/UsvSection';
import UuvSection from './components/UuvSection';
import ResearchTimeline from './components/ResearchTimeline';
import Vacancies from './components/Vacancies';
import HowToApply from './components/HowToApply';
import ApplicationForm from './components/ApplicationForm';
import ContactSection from './components/ContactSection';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import ApplicantAuth from './components/ApplicantAuth';
import ApplicantDashboard from './components/ApplicantDashboard';
import PrivacyTerms from './components/PrivacyTerms';
import ErrorPages from './components/ErrorPages';
import CompanyVerification from './components/CompanyVerification';
import { apiFetch, getAuthToken, getApplicantToken, removeApplicantToken, setAuthToken } from './lib/api';
import { Job, WebsiteSettings, BankDetails, OfficeContact } from './types';
import { Language, getTranslation } from './lib/translations';

export default function App() {
  // Navigation & Modes
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State-based routing with Login/Register routes
  const [activePage, setActivePage] = useState<'home' | 'jobs' | 'about_contact' | 'login' | 'register' | 'dashboard' | 'privacy' | 'terms' | 'unauthorized' | 'notfound'>('home');
  const [prevPage, setPrevPage] = useState<'home' | 'jobs' | 'about_contact' | 'login' | 'register' | 'dashboard' | 'privacy' | 'terms' | 'unauthorized' | 'notfound'>('home');
  const [authSubView, setAuthSubView] = useState<'login' | 'signup' | 'forgot' | 'reset' | 'verifyOtp' | 'resetVerify'>('login');

  // Mobile More menu slide-in drawer state
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  // Multilingual active state (English & Urdu)
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'en';
  });

  useEffect(() => {
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  // Applicant Authentication States
  const [applicantUser, setApplicantUser] = useState<{ id: string; email: string; fullName: string; isAdmin?: boolean; isSubAdmin?: boolean; role?: string; permissions?: string[] } | null>(null);

  // Dynamic state loaded on start
  const [jobs, setJobs] = useState<Job[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>({
    companyName: 'HYDROCEAN',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#009ca6',
    accentColor: '#0e7a83',
    enabledSections: {
      hero: true,
      about: true,
      usv: true,
      uuv: true,
      research: true,
      vacancies: true,
      gallery: true,
      applySteps: true,
      contact: true
    },
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    }
  });
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: 'Meezan Bank Limited',
    accountTitle: 'Hydrocean Marine Systems Pvt Ltd',
    iban: 'PK45MEZN00990102030405',
    accountNumber: '0099-0102030405',
    branchCode: '0099',
    amount: 3000,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PK45MEZN00990102030405',
    paymentInstructions: 'Transfer the application fee to the Meezan Bank account listed below via internet banking or any mobile wallet. After transfer, upload your receipt/deposit slip.'
  });
  const [officeContact, setOfficeContact] = useState<OfficeContact>({
    address: 'Hydrocean Corporate HQ, Tech Sector 4, Islamabad, Pakistan',
    mapEmbedUrl: '',
    phone: '',
    email: 'wavepilot1@gmail.com',
    whatsApp: '',
    workingHours: 'Monday - Friday (09:00 AM - 05:00 PM PST)'
  });

  // Loading indicator states
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [selectedJobForForm, setSelectedJobForForm] = useState<Job | null>(null);

  // Success Application Modal State
  const [successAppId, setSuccessAppId] = useState<string | null>(null);

  // Floating Back to Top Button
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 1. Initial and Popstate Routing Handler
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        if (authChecking) {
          setIsAdminMode(false);
          setActivePage('home');
          return;
        }

        const isAuthorized = !!(
          (applicantUser && (applicantUser.isAdmin || applicantUser.isSubAdmin)) ||
          isAuthenticated
        );

        if (isAuthorized) {
          setIsAdminMode(true);
          setActivePage('home');
        } else {
          setIsAdminMode(false);
          setActivePage('unauthorized');
        }
      } else {
        setIsAdminMode(false);
        if (path === '/login') {
          setActivePage('login');
          setAuthSubView('login');
        } else if (path === '/register') {
          setActivePage('register');
          setAuthSubView('signup');
        } else if (path === '/forgot-password') {
          setActivePage('login');
          setAuthSubView('forgot');
        } else if (path === '/verify-otp' || path === '/verify-email') {
          setActivePage('login');
          setAuthSubView('verifyOtp');
        } else if (path === '/reset-password/verify') {
          setActivePage('login');
          setAuthSubView('resetVerify');
        } else if (path === '/reset-password') {
          setActivePage('login');
          setAuthSubView('reset');
        } else if (path === '/dashboard') {
          setActivePage('dashboard');
        } else if (path === '/jobs') {
          setActivePage('jobs');
        } else if (path === '/about') {
          setActivePage('about_contact');
        } else if (path === '/privacy') {
          setActivePage('privacy');
        } else if (path === '/terms') {
          setActivePage('terms');
        } else {
          setActivePage('home');
        }
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [authChecking, isAuthenticated, applicantUser]);

  // 2. State-to-URL Synchronization Effect
  useEffect(() => {
    let targetPath = '/';
    if (isAdminMode) {
      targetPath = '/admin';
    } else {
      if (activePage === 'login') {
        if (authSubView === 'login') targetPath = '/login';
        else if (authSubView === 'forgot') targetPath = '/forgot-password';
        else if (authSubView === 'verifyOtp') targetPath = '/verify-email';
        else if (authSubView === 'resetVerify') targetPath = '/reset-password/verify';
        else if (authSubView === 'reset') targetPath = '/reset-password';
      } else if (activePage === 'register') {
        targetPath = '/register';
      } else if (activePage === 'dashboard') {
        targetPath = '/dashboard';
      } else if (activePage === 'jobs') {
        targetPath = '/jobs';
      } else if (activePage === 'about_contact') {
        targetPath = '/about';
      } else if (activePage === 'privacy') {
        targetPath = '/privacy';
      } else if (activePage === 'terms') {
        targetPath = '/terms';
      } else if (activePage === 'unauthorized') {
        targetPath = '/admin';
      }
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, [activePage, isAdminMode, authSubView]);

  useEffect(() => {
    const initializeApp = async () => {
      setAuthChecking(true);
      try {
        await loadWebsiteData();
      } catch (e) {
        console.error(e);
      }
      try {
        await Promise.all([
          checkAdminAuth(),
          checkApplicantAuth()
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setAuthChecking(false);
      }
    };

    initializeApp();

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkApplicantAuth = async () => {
    const token = getApplicantToken();
    if (!token) return;
    try {
      const data = await apiFetch('/applicants/me');
      if (data.success && data.user) {
        setApplicantUser(data.user);
        if (data.user.isAdmin || data.user.isSubAdmin) {
          setIsAuthenticated(true);
        }
      }
    } catch (e) {
      console.warn('Applicant session is expired or invalid.');
      removeApplicantToken();
      setApplicantUser(null);
    }
  };

  const loadWebsiteData = async () => {
    setLoadingInitial(true);
    try {
      const data = await apiFetch('/settings');
      if (data.settings) setSettings(data.settings);
      if (data.bankDetails) setBankDetails(data.bankDetails);
      if (data.officeContact) setOfficeContact(data.officeContact);

      // Fetch jobs and gallery
      const jobsData = await apiFetch('/jobs');
      setJobs(jobsData.jobs || []);

      const galleryData = await apiFetch('/gallery');
      setGallery(galleryData.gallery || []);
    } catch (e) {
      console.error('Error fetching configuration parameters', e);
    } finally {
      setLoadingInitial(false);
    }
  };

  const checkAdminAuth = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      // Validate token with an authenticated call
      await apiFetch('/admin/stats');
      setIsAuthenticated(true);
    } catch (e) {
      console.warn('Authentication token invalid or expired.');
      setIsAuthenticated(false);
    }
  };

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

  const getJobExpLevel = (job: Job) => {
    const text = ((job.qualification || '') + ' ' + (job.description || '')).toLowerCase();
    if (text.includes('ph.d') || text.includes('lead') || text.includes('senior') || text.includes('principal') || text.includes('m.sc')) {
      return lang === 'ur' ? 'مڈ ٹو سینئر لیول' : 'Mid-to-Senior';
    }
    return lang === 'ur' ? 'انٹری لیول / گریجویٹ' : 'Entry Level / Graduate';
  };

  const handleApplyNow = (job: Job) => {
    setSelectedJobForForm(job);
    if (!applicantUser) {
      setPrevPage('jobs');
      setActivePage('login');
      setAuthSubView('login');
      return;
    }
    const el = document.querySelector('#application-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyNowFromHome = (job: Job) => {
    setSelectedJobForForm(job);
    if (!applicantUser) {
      setPrevPage('jobs');
      setActivePage('login');
      setAuthSubView('login');
      return;
    }
    setActivePage('jobs');
    setTimeout(() => {
      const el = document.querySelector('#application-form-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  };

  const handleToggleAdminMode = () => {
    const isAuthorized = !!(
      (applicantUser && (applicantUser.isAdmin || applicantUser.isSubAdmin)) ||
      isAuthenticated
    );

    if (!isAdminMode && !isAuthorized) {
      setIsAdminMode(false);
      setActivePage('unauthorized');
    } else {
      setIsAdminMode((prev) => !prev);
    }
    // Auto-scroll to top to provide smooth transition between views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loadingInitial || authChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-white border border-gray-100 rounded-3xl shadow-xl flex items-center justify-center animate-pulse">
          <Compass className="h-12 w-12 text-teal-600 animate-spin" />
        </div>
        <div className="text-center">
          <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-gray-800">HYDROCEAN DIGITAL PORTAL</h3>
          <p className="text-xs text-gray-400 mt-1">Initializing secure marine databases...</p>
        </div>
      </div>
    );
  }

  const primaryColor = settings.primaryColor || '#009ca6';

  if (activePage === 'unauthorized' || activePage === 'notfound') {
    return (
      <ErrorPages
        type={activePage === 'unauthorized' ? 'unauthorized' : '404'}
        settings={settings}
        lang={lang}
        onGoHome={() => setActivePage('home')}
        onBack={() => setActivePage('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 flex flex-col justify-between">
      
      {/* HEADER NAVIGATION BAR */}
      {(activePage !== 'login' && activePage !== 'register') && (
        <Header
          settings={settings}
          isAdminMode={isAdminMode}
          onToggleAdminMode={handleToggleAdminMode}
          isAuthenticated={isAuthenticated}
          applicantUser={applicantUser}
          onApplicantLogout={() => {
            removeApplicantToken();
            setApplicantUser(null);
            setIsAuthenticated(false);
            setIsAdminMode(false);
            setActivePage('home');
            // Clear any lingering session cookies
            document.cookie.split(";").forEach((c) => {
              document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onShowApplicantAuth={() => {
            setPrevPage(activePage);
            setActivePage('login');
            setAuthSubView('login');
          }}
          lang={lang}
          onSetLang={setLang}
          activePage={
            (activePage === 'privacy' || activePage === 'terms') 
              ? 'home' 
              : activePage as any
          }
          onChangePage={(page) => {
            if (page === 'login' || page === 'register') {
              setPrevPage(activePage);
              if (page === 'login') {
                setAuthSubView('login');
              } else if (page === 'register') {
                setAuthSubView('signup');
              }
            }
            setActivePage(page);
            setIsAdminMode(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onToggleMobileDrawer={() => setMobileMoreOpen(!mobileMoreOpen)}
        />
      )}

      {/* RENDER ADMIN PANEL SUBPAGES */}
      {isAdminMode ? (
        <div className="pt-20 flex-1">
          {isAuthenticated ? (
            <AdminPanel
              onLogout={() => {
                setIsAuthenticated(false);
                setIsAdminMode(false);
              }}
              settings={settings}
              bankDetails={bankDetails}
              officeContact={officeContact}
              onRefreshSettings={loadWebsiteData}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={() => {
                setIsAuthenticated(true);
                checkAdminAuth();
              }}
              settings={settings}
            />
          )}
        </div>
      ) : (activePage === 'login' || activePage === 'register') ? (
        <ApplicantAuth
          key="applicant-auth"
          settings={settings}
          lang={lang}
          initialView={activePage === 'register' ? 'signup' : authSubView}
          onViewChange={(view) => {
            if (view === 'signup') {
              setActivePage('register');
              setAuthSubView('signup');
            } else {
              setActivePage('login');
              setAuthSubView(view);
            }
          }}
          onSuccess={(user) => {
            setApplicantUser(user);
            if (user.isAdmin || user.isSubAdmin) {
              setIsAuthenticated(true);
            }
            if (selectedJobForForm) {
              setActivePage('jobs');
              setTimeout(() => {
                const el = document.getElementById('application-form-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }, 400);
            } else {
              setActivePage('dashboard');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onCancel={() => {
            setActivePage(prevPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        /* RENDER PUBLIC BILINGUAL THREE-PAGE WEBSITE */
        <div className="flex-grow pb-20 lg:pb-0">
          {activePage === 'home' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* 1. Premium 5-Slide Hero Banner */}
              <Hero settings={settings} lang={lang} page="home" onChangePage={(page) => {
                setActivePage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />

              {/* 2. Company Introduction - About Preview with USV & AUV Cards */}
              <AboutPreview settings={settings} lang={lang} onExploreMore={() => {
                setActivePage('about_contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />

              {/* 3. How We Work (Professional 8-Step Timeline/Step Section) */}
              <HowWeWork settings={settings} lang={lang} />

              {/* 3.5 Company Registration Verification Trust Section */}
              <CompanyVerification settings={settings} lang={lang} />

              {/* Featured Jobs Section */}
              <section className="py-24 bg-white border-t border-gray-100/60" id="featured-jobs-home">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Section Header */}
                  <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600" style={{ color: primaryColor }}>
                      {lang === 'ur' ? 'نمایاں ملازمتیں' : 'Featured Opportunities'}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
                      {lang === 'ur' ? 'جدید میرین اور روبوٹکس اسامیاں' : 'Latest Marine & Robotics Vacancies'}
                    </h2>
                    <div className="w-12 h-1 bg-teal-600 mx-auto mt-4" style={{ backgroundColor: primaryColor }}></div>
                    <p className="text-gray-600 mt-6 leading-relaxed text-sm">
                      {lang === 'ur'
                        ? 'ہمارے جدید ترین سمندری سروے اور خود مختار وہیکل پروگرامز کا حصہ بنیں۔ اب درخواست دیں۔'
                        : 'Explore our latest deep-sea research missions, autonomous piloting, and subsea actuators engineering files.'}
                    </p>
                  </div>

                  {/* Jobs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
                    {jobs
                      .filter((j) => !j.isHidden && j.isOpen)
                      .sort((a, b) => (b.createdAt || b.id).localeCompare(a.createdAt || a.id))
                      .slice(0, 2)
                      .map((job) => {
                        const jobDept = getJobDept(job);
                        const titleText = lang === 'ur' && job.titleUr ? job.titleUr : job.title;
                        const qualificationText = lang === 'ur' && job.qualificationUr ? job.qualificationUr : job.qualification;
                        const descriptionText = lang === 'ur' && job.descriptionUr ? job.descriptionUr : job.description;

                        return (
                          <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-20px" }}
                            transition={{ duration: 0.4 }}
                            whileHover={{
                              y: -8,
                              scale: 1.02,
                              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)",
                              borderColor: primaryColor
                            }}
                            className="bg-slate-50 border border-gray-150 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-sm text-left"
                          >
                            <div>
                              <div className="border-b border-gray-200 pb-4 mb-5">
                                <span className="text-[10px] font-mono tracking-wider font-bold uppercase text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full inline-block mb-2" style={{ color: primaryColor, backgroundColor: primaryColor + '10' }}>
                                  {jobDept}
                                </span>
                                <h3 className="text-base sm:text-lg font-display font-bold text-gray-900 line-clamp-1">{titleText}</h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                                  <span className="text-xs text-gray-600 font-mono flex items-center gap-1">
                                    <Landmark className="h-3.5 w-3.5" /> {job.country}
                                  </span>
                                  <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" /> {lang === 'ur' ? 'مکمل وقت' : 'Full Time'}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mb-5">
                                <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-xs">
                                  <span className="text-[9px] font-mono tracking-wider uppercase text-gray-400 block">
                                    {lang === 'ur' ? 'وظیفہ / معاوضہ' : 'Stipend / Salary'}
                                  </span>
                                  <span className="text-xs font-bold text-gray-800 mt-0.5 block">{job.salary}</span>
                                </div>
                                <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-xs">
                                  <span className="text-[9px] font-mono tracking-wider uppercase text-gray-400 block">
                                    {lang === 'ur' ? 'تجربہ اور تعلیم' : 'Experience & Qualification'}
                                  </span>
                                  <span className="text-xs font-bold text-gray-800 mt-0.5 block truncate" title={qualificationText}>{qualificationText}</span>
                                </div>
                              </div>

                              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3 mb-6 font-sans">
                                {descriptionText}
                              </p>
                            </div>

                            <button
                              onClick={() => handleApplyNowFromHome(job)}
                              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2"
                              style={{ backgroundColor: primaryColor }}
                            >
                              {lang === 'ur' ? 'ابھی فارم بھریں' : 'Apply Now'}
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </motion.div>
                        );
                      })}
                  </div>

                  {/* View All Jobs CTA */}
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setActivePage('jobs');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 border-2 border-gray-200 hover:border-teal-500 text-gray-700 hover:text-teal-600 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      {lang === 'ur' ? 'تمام نوکریاں دیکھیں' : 'View All Jobs'}
                      <Briefcase className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Call To Action */}
              <div className="bg-slate-900 text-white py-16 text-center px-4">
                <h3 className="text-2xl sm:text-3xl font-display font-bold mb-4">
                  {lang === 'ur' ? 'میرین روبوٹکس کی دنیا میں شمولیت اختیار کریں' : 'Pioneer Maritime Robotics With Us'}
                </h3>
                <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8">
                  {lang === 'ur' ? 'اگر آپ میرین انجینئر، پائلٹ یا ریسرچر ہیں، تو آج ہی درخواست دیں۔' : 'We are actively recruiting world-class researchers, deep-sea vehicle technicians, and software architects.'}
                </p>
                <button
                  onClick={() => setActivePage('jobs')}
                  className="px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 transition hover:scale-105"
                  style={{ backgroundColor: primaryColor }}
                >
                  {getTranslation('heroCta', lang)}
                </button>
              </div>
            </motion.div>
          )}

          {activePage === 'jobs' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Premium 3-Slide Jobs Hero Banner */}
              <Hero settings={settings} lang={lang} page="jobs" onChangePage={(page) => {
                setActivePage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />

              {/* Job Listings, Search and Filters */}
              <Vacancies
                jobs={jobs.filter((j) => !j.isHidden && j.isOpen)}
                loading={false}
                onApply={handleApplyNow}
                settings={settings}
                lang={lang}
              />

              {/* How to Apply steps */}
              <HowToApply settings={settings} />

              {/* Application Form */}
              <div id="application-form-section" className="max-w-3xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
                    {lang === 'ur' ? 'رسمی آن لائن درخواست فارم' : 'Candidate Registration Form'}
                  </h2>
                  <p className="text-gray-500 text-xs mt-2">
                    {lang === 'ur' ? 'براہ کرم تمام معلومات درست اور تصدیق شدہ درج کریں۔' : 'Provide accurate profile, deposit slip verification reference, and resume to register.'}
                  </p>
                </div>
                <ApplicationForm
                  selectedJob={selectedJobForForm}
                  jobs={jobs.filter((j) => !j.isHidden && j.isOpen)}
                  bankDetails={bankDetails}
                  settings={settings}
                  onSuccess={(appId) => setSuccessAppId(appId)}
                  applicantUser={applicantUser}
                  onShowAuth={() => {
                    setPrevPage('jobs');
                    setActivePage('login');
                    setAuthSubView('login');
                  }}
                  lang={lang}
                />
              </div>
            </motion.div>
          )}

          {activePage === 'dashboard' && (
            <ApplicantDashboard
              applicantUser={applicantUser}
              lang={lang}
              onNavigateToJobs={() => {
                setActivePage('jobs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activePage === 'about_contact' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Premium 3-Slide About Hero Banner */}
              <Hero settings={settings} lang={lang} page="about_contact" onChangePage={(page) => {
                setActivePage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />

              {/* Mission Vision Values (About Component) */}
              <About settings={settings} lang={lang} />

              {/* Contact Information & Map Form */}
              <ContactSection officeContact={officeContact} settings={settings} lang={lang} />
            </motion.div>
          )}

          {(activePage === 'privacy' || activePage === 'terms') && (
            <PrivacyTerms
              type={activePage}
              settings={settings}
              lang={lang}
              onBack={() => {
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* FOOTER AREA */}
          <footer className="bg-slate-950 text-white border-t border-slate-900 py-16 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                
                {/* Brand description */}
                <div className="md:col-span-5 space-y-4">
                  <a href="#" className="flex items-center space-x-3">
                    <Compass className="h-8 w-8 text-teal-400" />
                    <span className="font-display font-bold text-lg uppercase tracking-wider">{settings.companyName}</span>
                  </a>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                    {lang === 'ur'
                      ? 'ہائیڈروشن انٹیلیجنٹ ٹیک جدید ترین انڈر واٹر روبوٹکس، تھرسٹرز اور ڈیپ سی ایکچوایٹرز کی تحقیق اور ترقی میں عالمی سطح پر پیش پیش ہے۔'
                      : 'Hydrocean Intelligent Tech specializes in advanced marine systems, high-magnetic brushless subsea motors, actuators, and unmanned exploration submersibles.'}
                  </p>
                  <p className="text-[10px] font-mono text-teal-400 font-bold tracking-widest uppercase">{lang === 'ur' ? 'سمندری سائنس میں جدت طرازی' : 'PIONEERING UNDERWATER SCIENCE'}</p>
                </div>

                {/* Navigation links */}
                <div className="md:col-span-3 space-y-4 text-xs text-left">
                  <h4 className="font-display font-bold text-gray-200 uppercase tracking-widest text-[10px]">{lang === 'ur' ? 'سائٹ نیویگیشن' : 'Site Navigation'}</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><button onClick={() => setActivePage('home')} className="hover:text-teal-400 transition-colors text-left">{lang === 'ur' ? 'ہوم پیج' : 'Home Page'}</button></li>
                    <li><button onClick={() => setActivePage('jobs')} className="hover:text-teal-400 transition-colors text-left">{lang === 'ur' ? 'ملازمتیں' : 'Career Opportunities'}</button></li>
                    <li><button onClick={() => { setActivePage('about_contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-teal-400 transition-colors text-left">{lang === 'ur' ? 'کمپنی کا تعارف' : 'About & Contact'}</button></li>
                    <li><button onClick={() => { setActivePage('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-teal-400 transition-colors text-left">{lang === 'ur' ? 'رازداری کی پالیسی' : 'Privacy Policy'}</button></li>
                    <li><button onClick={() => { setActivePage('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-teal-400 transition-colors text-left">{lang === 'ur' ? 'شرائط و ضوابط' : 'Terms & Conditions'}</button></li>
                  </ul>
                </div>

                {/* Direct info coordinates */}
                <div className="md:col-span-4 space-y-4 text-xs text-left">
                  <h4 className="font-display font-bold text-gray-200 uppercase tracking-widest text-[10px]">{lang === 'ur' ? 'رابطہ کی تفصیلات' : 'Emergency Coordinates'}</h4>
                  <p className="text-gray-400 leading-relaxed">{officeContact.address}</p>
                  <div className="text-[10px] font-mono text-gray-500 space-y-1">
                    <p>{lang === 'ur' ? 'ای میل' : 'Email'}: {officeContact.email}</p>
                  </div>
                </div>

              </div>

              {/* Bottom Copyright disclaimer and system status */}
              <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-gray-500 gap-4">
                <p>© {new Date().getFullYear()} {settings.companyName || 'HYDROCEAN'}. {lang === 'ur' ? 'تمام حقوق محفوظ ہیں۔' : 'All rights reserved globally.'}</p>
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span>SSL TRANSACTION LAYER SECURED</span>
                </div>
              </div>

            </div>
          </footer>
        </div>
      )}

      {/* ================= MOBILE BOTTOM NAVIGATION BAR ================= */}
      <div className="fixed bottom-0 md:bottom-5 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-md md:rounded-full z-[90] lg:hidden bg-slate-950/90 backdrop-blur-2xl border-t md:border border-slate-900/80 px-6 pb-[env(safe-area-inset-bottom)] pt-2 md:py-2 flex justify-around items-center h-[calc(4rem+env(safe-area-inset-bottom))] md:h-16 shadow-[0_8px_32px_rgba(0,0,0,0.6)] select-none transition-all duration-300">
        <button
          onClick={() => {
            setActivePage('home');
            setIsAdminMode(false);
            setMobileMoreOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-300 cursor-pointer active:scale-95 ${
            activePage === 'home' && !isAdminMode
              ? 'text-teal-400 font-extrabold scale-110'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
          <span className="text-[10px] tracking-tight">{lang === 'ur' ? 'ہوم' : 'Home'}</span>
          {activePage === 'home' && !isAdminMode && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
          )}
        </button>

        <button
          onClick={() => {
            setActivePage('jobs');
            setIsAdminMode(false);
            setMobileMoreOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-300 cursor-pointer active:scale-95 ${
            activePage === 'jobs' && !isAdminMode
              ? 'text-teal-400 font-extrabold scale-110'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
          <span className="text-[10px] tracking-tight">{lang === 'ur' ? 'Jobs' : 'Jobs'}</span>
          {activePage === 'jobs' && !isAdminMode && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
          )}
        </button>

        <button
          onClick={() => {
            setActivePage('about_contact');
            setIsAdminMode(false);
            setMobileMoreOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-300 cursor-pointer active:scale-95 ${
            activePage === 'about_contact' && !isAdminMode
              ? 'text-teal-400 font-extrabold scale-110'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
          <span className="text-[10px] tracking-tight">{lang === 'ur' ? 'تعارف' : 'About'}</span>
          {activePage === 'about_contact' && !isAdminMode && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
          )}
        </button>

        <button
          onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
          className={`relative flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-300 cursor-pointer active:scale-95 ${
            mobileMoreOpen
              ? 'text-teal-400 font-extrabold scale-110'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Menu className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
          <span className="text-[10px] tracking-tight">{lang === 'ur' ? 'مزید' : 'More'}</span>
          {mobileMoreOpen && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
          )}
        </button>
      </div>

      {/* ================= MOBILE SLIDE-IN DRAWER ("MORE" MENU) ================= */}
      {mobileMoreOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMoreOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
          />

          {/* Drawer Panel */}
          <div
            onTouchStart={(e) => {
              (window as any).drawerTouchStartX = e.changedTouches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const startX = (window as any).drawerTouchStartX || 0;
              const endX = e.changedTouches[0].clientX;
              if (endX - startX > 50) {
                setMobileMoreOpen(false);
              }
            }}
            className="absolute top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-slate-950 border-l border-slate-900/60 p-6 flex flex-col justify-between shadow-2xl z-10 text-white overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-900/60">
                <div className="flex items-center gap-2">
                  <Compass className="w-6 h-6 text-teal-400 animate-spin-slow" />
                  <span className="font-extrabold text-sm tracking-widest text-white">HYDROCEAN</span>
                </div>
                <button
                  onClick={() => setMobileMoreOpen(false)}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full cursor-pointer transition-colors text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User Profile / Access Section */}
              {applicantUser ? (
                <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl space-y-2">
                  <span className="block text-[9px] font-mono font-bold uppercase text-slate-500 tracking-widest">
                    {lang === 'ur' ? 'پروفائل' : 'User Profile'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 text-xs font-bold font-mono">
                      {applicantUser.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-bold text-xs block truncate text-slate-100">{applicantUser.fullName}</span>
                      <span className="text-[10px] text-slate-500 font-mono block truncate">{applicantUser.email}</span>
                    </div>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-[8px] font-mono uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    {applicantUser.isAdmin ? 'Administrator' : 'Applicant'}
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl space-y-3 text-center">
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    {lang === 'ur'
                      ? 'لاگ ان کریں یا ملازمت کے لیے نیا اکاؤنٹ بنائیں۔'
                      : 'Authenticate or sign up to submit applications and trace records.'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setMobileMoreOpen(false);
                        setPrevPage(activePage === 'login' || activePage === 'register' ? 'home' : activePage);
                        setActivePage('login');
                        setAuthSubView('login');
                      }}
                      className="py-2 bg-teal-500 text-slate-950 text-[10px] font-bold uppercase rounded-lg cursor-pointer hover:bg-teal-400 transition-colors"
                    >
                      {getTranslation('navLogin', lang)}
                    </button>
                    <button
                      onClick={() => {
                        setMobileMoreOpen(false);
                        setPrevPage(activePage === 'login' || activePage === 'register' ? 'home' : activePage);
                        setActivePage('register');
                        setAuthSubView('signup');
                      }}
                      className="py-2 bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-bold uppercase rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
                    >
                      {lang === 'ur' ? 'رجسٹر' : 'Register'}
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Links inside Drawer */}
              <div className="space-y-1">
                <span className="block text-[9px] font-mono font-bold uppercase text-slate-500 tracking-widest pl-2 mb-2">
                  {lang === 'ur' ? 'سائٹ لنکس' : 'Navigation'}
                </span>
                
                <button
                  onClick={() => {
                    setActivePage('home');
                    setIsAdminMode(false);
                    setMobileMoreOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    activePage === 'home' && !isAdminMode
                      ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500'
                      : 'hover:bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Home className="w-4 h-4" />
                    <span>{getTranslation('navHome', lang)}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </button>

                <button
                  onClick={() => {
                    setActivePage('jobs');
                    setIsAdminMode(false);
                    setMobileMoreOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    activePage === 'jobs' && !isAdminMode
                      ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500'
                      : 'hover:bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4" />
                    <span>{getTranslation('navJobs', lang)}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </button>

                <button
                  onClick={() => {
                    setActivePage('about_contact');
                    setIsAdminMode(false);
                    setMobileMoreOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    activePage === 'about_contact' && !isAdminMode
                      ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500'
                      : 'hover:bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Info className="w-4 h-4" />
                    <span>{getTranslation('navAbout', lang)}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </button>

                <button
                  onClick={() => {
                    setActivePage('about_contact');
                    setIsAdminMode(false);
                    setMobileMoreOpen(false);
                    setTimeout(() => {
                      const el = document.querySelector('#contact-section-home');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-900 text-slate-300 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>{getTranslation('navContact', lang)}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </button>

                {applicantUser && (
                  <button
                    onClick={() => {
                      setActivePage('dashboard');
                      setIsAdminMode(false);
                      setMobileMoreOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      activePage === 'dashboard' && !isAdminMode
                        ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500'
                        : 'hover:bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4" />
                      <span>{lang === 'ur' ? 'ڈیش بورڈ / درخواستیں' : 'Dashboard / Applications'}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                )}
              </div>

              {/* Admin Panel Specific Toggle inside drawer */}
              {applicantUser && (applicantUser.isAdmin || applicantUser.isSubAdmin) && (
                <div className="pt-2 border-t border-slate-900/60">
                  <button
                    onClick={() => {
                      setMobileMoreOpen(false);
                      setIsAdminMode(true);
                      setActivePage('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 transition-colors`}
                  >
                    <span className="flex items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4" />
                      <span>{getTranslation('navAdminPanel', lang)}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Contact Information Section in Drawer */}
              <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl space-y-3">
                <span className="block text-[9px] font-mono font-bold uppercase text-slate-500 tracking-widest">
                  {lang === 'ur' ? 'رابطہ کی معلومات' : 'Contact Information'}
                </span>
                <div className="space-y-2.5 text-xs">
                  <a
                    href="https://wa.me/923325924526"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 text-slate-300 hover:text-teal-400 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-teal-400" />
                    <span>WhatsApp: <strong className="font-mono text-teal-300 hover:underline">+92 332 5924526</strong></span>
                  </a>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>Secondary: <strong className="font-mono text-slate-300">+92 308 5266384</strong></span>
                  </div>
                  <a
                    href="mailto:wavepilot1@gmail.com"
                    className="flex items-center gap-2.5 text-slate-300 hover:text-teal-400 transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-teal-400" />
                    <span className="truncate">Email: <strong className="font-mono text-teal-300 hover:underline">wavepilot1@gmail.com</strong></span>
                  </a>
                </div>
              </div>
            </div>

            {/* Language Switcher and Logout Footer inside drawer */}
            <div className="space-y-4 pt-6 border-t border-slate-900/60 mt-6">
              <div className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-900 rounded-xl text-xs">
                <span className="font-semibold text-slate-400 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span>{lang === 'ur' ? 'زبان' : 'Language'}</span>
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setLang('en')}
                    className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      lang === 'en' ? 'bg-teal-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLang('ur')}
                    className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      lang === 'ur' ? 'bg-teal-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    اردو
                  </button>
                </div>
              </div>

              {applicantUser && (
                <button
                  onClick={() => {
                    removeApplicantToken();
                    setApplicantUser(null);
                    setMobileMoreOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/40 text-slate-300 hover:text-rose-400 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{getTranslation('navLogout', lang)}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUCCESS APPLICATION CONFIRMATION MODAL ================= */}
      {successAppId && (
        <div className="fixed inset-0 z-[110] bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl border border-gray-100 font-sans">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
              <CheckCircle className="h-10 w-10" />
            </div>

            <h3 className="font-display font-extrabold text-xl text-gray-950">Application Registered!</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Your recruitment application has been successfully filed in our databases. Our evaluation panel will verify your bank deposit slip shortly.
            </p>

            <div className="my-6 p-4 bg-slate-50 border border-gray-150 rounded-2xl text-center">
              <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">Your Unique Application ID</span>
              <p className="font-mono font-bold text-lg text-teal-700 select-all mt-1">{successAppId}</p>
              <span className="text-[9px] text-gray-400 font-sans block mt-1">Please note this down to trace your status manually.</span>
            </div>

            <button
              onClick={() => setSuccessAppId(null)}
              className="w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all cursor-pointer"
            >
              Close Confirmation
            </button>
          </div>
        </div>
      )}

      {/* FLOATING BACK TO TOP BUTTON */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 lg:bottom-6 left-6 z-40 p-3 bg-white/90 border border-gray-200 hover:bg-slate-50 text-gray-700 rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer backdrop-blur-sm"
          title="Back to Top"
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </button>
      )}

    </div>
  );
}
