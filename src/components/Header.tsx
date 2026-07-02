/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldAlert, User, Compass, LogOut, Bell, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WebsiteSettings } from '../types';
import { Language, getTranslation } from '../lib/translations';

interface HeaderProps {
  settings: WebsiteSettings;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  isAuthenticated: boolean;
  applicantUser: { fullName: string; email: string; isAdmin?: boolean; isSubAdmin?: boolean } | null;
  onApplicantLogout: () => void;
  onShowApplicantAuth: () => void;
  lang: Language;
  onSetLang: (lang: Language) => void;
  activePage: 'home' | 'jobs' | 'about_contact' | 'dashboard' | 'login' | 'register';
  onChangePage: (page: 'home' | 'jobs' | 'about_contact' | 'dashboard' | 'login' | 'register') => void;
  onToggleMobileDrawer?: () => void;
}

export default function Header({
  settings,
  isAdminMode,
  onToggleAdminMode,
  isAuthenticated,
  applicantUser,
  onApplicantLogout,
  onShowApplicantAuth,
  lang,
  onSetLang,
  activePage,
  onChangePage,
  onToggleMobileDrawer,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (applicantUser) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // Check every 10s
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [applicantUser]);

  const fetchNotifications = async () => {
    try {
      const emailEnc = encodeURIComponent(applicantUser!.email);
      const res = await fetch(`/api/notifications?applicantId=${emailEnc}`, {
        headers: {
          'x-applicant-email': applicantUser!.email
        }
      });
      const data = await res.json();
      if (data.success && data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: any) => !n.isRead).length);
      }
    } catch (e) {
      console.warn('Error loading in-app notifications:', e);
    }
  };

  const markRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const dismissNotif = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/notifications/${id}/dismiss`, { method: 'PUT' });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { name: getTranslation('navHome', lang), page: 'home' as const },
    { name: getTranslation('navJobs', lang), page: 'jobs' as const },
    { name: getTranslation('navAbout', lang), page: 'about_contact' as const },
  ];

  if (applicantUser) {
    navLinks.push({ name: lang === 'ur' ? 'ڈیش بورڈ' : 'My Applications', page: 'dashboard' as any });
  }

  const handleNavClick = (page: 'home' | 'jobs' | 'about_contact' | 'dashboard' | 'login' | 'register') => {
    setMobileMenuOpen(false);
    onChangePage(page);
  };

  const primaryColor = settings.primaryColor || '#009ca6';

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 font-sans ${
        isScrolled
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-teal-500/30 shadow-2xl py-3 text-white'
          : 'bg-slate-950/80 backdrop-blur-md border-b border-slate-900/50 py-4 text-slate-100 shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <button onClick={() => handleNavClick('home')} className="flex items-center space-x-3 group cursor-pointer text-left">
            <div className="p-1.5 rounded-xl bg-slate-900 text-teal-400 group-hover:bg-slate-800 border border-slate-800 transition-all shadow-md">
              <Compass className="h-7 w-7 transition-transform duration-700 group-hover:rotate-180" style={{ color: primaryColor }} />
            </div>
            <div>
              <span className="font-sans font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-teal-400 transition-colors">
                {settings.companyName || 'HYDROCEAN'}
              </span>
              <p className="text-[8px] font-mono tracking-widest text-slate-500 uppercase leading-none mt-0.5">Robotics & Vehicles</p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          {!isAdminMode && (
            <nav className="hidden lg:flex items-center space-x-2 bg-slate-900/80 border border-slate-800/80 px-2.5 py-1 rounded-full backdrop-blur-md shadow-lg shadow-slate-950/50">
              {navLinks.map((link) => {
                const isActive = activePage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => handleNavClick(link.page)}
                    className="relative px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer text-slate-200 hover:text-white"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavTab"
                        className="absolute inset-0 bg-slate-800 border border-teal-500/20 shadow-md rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? 'text-teal-300 font-extrabold' : ''}`}>{link.name}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Action buttons (Login / Admin / Languages) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Selector Dropdown - Visible everywhere in the top right */}
            <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-full p-0.5 shadow-sm text-[10px] font-bold">
              <button
                onClick={() => onSetLang('en')}
                className={`px-2.5 py-1 rounded-full uppercase transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-teal-500 text-slate-950 shadow font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onSetLang('ur')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  lang === 'ur' ? 'bg-teal-500 text-slate-950 shadow font-bold' : 'text-slate-400 hover:text-white'
                }`}
                style={{ fontFamily: 'Noto Naskh Arabic, serif' }}
              >
                اردو
              </button>
            </div>

            {/* Desktop-only action buttons (hidden on Mobile & Tablet < lg) */}
            <div className="hidden lg:flex items-center space-x-2 sm:space-x-3">
              {/* Applicant state */}
              {!isAdminMode && (
                applicantUser ? (
                  <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 rounded-full px-3 py-1 shadow-sm">
                    <span className="hidden lg:inline text-xs font-semibold text-slate-300">
                      {getTranslation('hello', lang)}, <span className="text-teal-400 font-extrabold">{applicantUser.fullName.split(' ')[0]}</span>
                    </span>
                    
                    {/* Notification Center Trigger Bell */}
                    <div className="relative">
                      <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-1 rounded-full text-slate-300 hover:text-teal-400 hover:bg-slate-800/50 relative cursor-pointer"
                        title={getTranslation('notifCenterTitle', lang)}
                      >
                        <Bell className="h-4 w-4" />
                        {unreadCount > 0 && (
                          <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                        )}
                      </button>

                      <AnimatePresence>
                        {showNotifications && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="absolute right-0 mt-3 w-72 sm:w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-slate-100 max-h-96 overflow-y-auto"
                          >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <span>{getTranslation('notifCenterTitle', lang)}</span>
                              {unreadCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 font-mono">
                                  {unreadCount}
                                </span>
                              )}
                            </div>

                            {notifications.length === 0 ? (
                              <div className="py-8 text-center text-xs text-slate-500 font-sans">
                                {getTranslation('notifCenterEmpty', lang)}
                              </div>
                            ) : (
                              <div className="space-y-2 text-xs">
                                {notifications.map((n) => (
                                  <div
                                    key={n._id || n.id}
                                    className={`p-2.5 rounded-xl border transition-all text-left ${
                                      n.isRead
                                        ? 'bg-slate-900/40 border-slate-800/40'
                                        : 'bg-teal-950/20 border-teal-500/20 shadow'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <span className="font-bold text-slate-200">{n.title}</span>
                                      <div className="flex space-x-1.5 items-center">
                                        {!n.isRead && (
                                          <button
                                            onClick={(e) => markRead(n._id || n.id, e)}
                                            className="text-[10px] text-teal-400 hover:underline cursor-pointer"
                                          >
                                            Read
                                          </button>
                                        )}
                                        <button
                                          onClick={(e) => dismissNotif(n._id || n.id, e)}
                                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                                          title="Dismiss"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">{n.message}</p>
                                    <span className="text-[8px] text-slate-600 block mt-1 font-mono">
                                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      onClick={onApplicantLogout}
                      className="p-1 rounded-full text-slate-400 hover:text-rose-400 transition-colors cursor-pointer hover:bg-slate-800/40"
                      title={getTranslation('navLogout', lang)}
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={onShowApplicantAuth}
                      className="px-3.5 py-1.5 border border-slate-800 hover:bg-slate-900 text-slate-100 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow"
                    >
                      {getTranslation('navLogin', lang)}
                    </button>
                    <button
                      onClick={() => handleNavClick('register')}
                      className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-teal-500/15 cursor-pointer"
                    >
                      {lang === 'ur' ? 'رجسٹر' : 'Register'}
                    </button>
                  </div>
                )
              )}

              {applicantUser && (applicantUser.isAdmin || applicantUser.isSubAdmin) && (
                <button
                  onClick={onToggleAdminMode}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border shadow-md cursor-pointer bg-slate-900/30 border-slate-800/40 text-slate-400 hover:text-white"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-slate-500" />
                  <span>{isAdminMode ? 'Exit Admin' : 'Admin'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
