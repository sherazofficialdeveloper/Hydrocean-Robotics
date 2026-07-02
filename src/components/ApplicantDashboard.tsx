/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { FileText, Download, Eye, AlertTriangle, Clock, CheckCircle2, XCircle, FileSpreadsheet, ArrowRight, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { apiFetch } from '../lib/api';
import { Language, getTranslation } from '../lib/translations';

interface ApplicantDashboardProps {
  applicantUser: { id: string; email: string; fullName: string } | null;
  lang: Language;
  onNavigateToJobs: () => void;
}

export default function ApplicantDashboard({
  applicantUser,
  lang,
  onNavigateToJobs,
}: ApplicantDashboardProps) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    if (!applicantUser) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/applicants/applications');
      if (data.success && data.applications) {
        setApplications(data.applications);
      } else {
        setError(data.error || 'Failed to fetch applications.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading your applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [applicantUser]);

  const getStatusBadge = (status: string) => {
    const cleanStatus = status ? status.toLowerCase() : 'pending review';
    
    if (cleanStatus.includes('approved') || cleanStatus === 'verified' || cleanStatus === 'selected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {lang === 'ur' ? 'منظور شدہ' : 'Approved'}
        </span>
      );
    }
    
    if (cleanStatus.includes('reject') || cleanStatus === 'declined') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm">
          <XCircle className="w-3.5 h-3.5" />
          {lang === 'ur' ? 'مسترد شدہ' : 'Rejected'}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm animate-pulse">
        <Clock className="w-3.5 h-3.5" />
        {lang === 'ur' ? 'زیر غور' : 'Pending Review'}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (!applicantUser) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 font-sans">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-bold text-slate-100">Access Denied</h3>
        <p className="text-sm text-slate-400 max-w-sm mt-2">
          Please log in to your account to view your applications and trace status.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-28 sm:px-6 lg:px-8 font-sans text-slate-200">
      
      {/* Dashboard Top Header Block */}
      <div className="relative overflow-hidden bg-slate-950/60 border border-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 mb-12 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        {/* Decorative background gradients */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-teal-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                {lang === 'ur' ? 'درخواست گزار کا ورک اسپیس' : 'Applicant Workspace'}
              </span>
            </div>
            <div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                {lang === 'ur' ? `خوش آمدید، ${applicantUser.fullName}` : `Welcome back, `}
                {lang !== 'ur' && <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400 font-black">{applicantUser.fullName}</span>}
                {lang !== 'ur' && '!'}
              </h1>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-2xl">
                {lang === 'ur'
                  ? 'اپنے بھرتی فارمز کی حالت، ادائیگیاں اور منظوری کی نگرانی کریں۔'
                  : 'Monitor the validation progress of your submitted recruitment forms, payments, and selections.'}
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToJobs}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 cursor-pointer transition-all self-start md:self-auto shrink-0 font-sans"
          >
            <span>{lang === 'ur' ? 'مزید نوکریاں دیکھیں' : 'Explore Vacancies'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center gap-3 py-16">
          <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">Loading workspace parameters...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-6 text-center max-w-md mx-auto my-12">
          <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto mb-3 animate-bounce" />
          <h4 className="font-bold text-rose-400 text-sm">Failed to Load Applications</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{error}</p>
          <button
            onClick={fetchApplications}
            className="mt-4 px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-xs font-bold uppercase transition-colors"
          >
            Retry Fetching
          </button>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-900 bg-slate-950/40 max-w-lg mx-auto my-12">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="font-bold text-slate-300 text-base">No Applications Found</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {lang === 'ur'
              ? 'آپ نے ابھی تک کسی آسامی کے لیے درخواست جمع نہیں کروائی ہے۔ نوکریاں دیکھیں اور ابھی درخواست دیں۔'
              : "You haven't submitted any recruitment forms yet. Browse active job openings and send your profile today!"}
          </p>
          <button
            onClick={onNavigateToJobs}
            className="mt-6 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all hover:shadow-lg hover:shadow-teal-500/20"
          >
            {lang === 'ur' ? 'آسامیاں براؤز کریں' : 'Browse Vacancies'}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Applications Grid */}
          <div className="grid grid-cols-1 gap-6">
            {applications.map((app) => (
              <motion.div
                key={app.id || app._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl hover:border-slate-800/80 transition-all group"
              >
                
                {/* Application Header Meta */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-900/50">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                      Applied Position
                    </span>
                    <h3 className="font-display font-extrabold text-xl text-white group-hover:text-teal-400 transition-colors mt-0.5">
                      {app.jobTitle}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 items-center text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {lang === 'ur' ? 'جمع کرایا گیا:' : 'Submitted:'} <span className="font-semibold text-slate-300">{formatDate(app.createdAt)}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 tracking-wider">
                        ID: {app.id || app._id}
                      </span>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                {/* Main details body */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Personal Summary */}
                  <div className="space-y-4 lg:col-span-1">
                    <h4 className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
                      Applicant Profile
                    </h4>
                    <div className="space-y-2 bg-slate-900/20 p-4 rounded-2xl border border-slate-900/40 text-xs">
                      <div>
                        <span className="text-slate-500 block">Full Name</span>
                        <span className="font-bold text-slate-200 block truncate">{app.fullName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Father Name</span>
                        <span className="font-bold text-slate-200 block truncate">{app.fatherName || 'Not Specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Contact WhatsApp</span>
                        <span className="font-bold text-slate-200 block truncate">{app.whatsAppNumber || app.mobileNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Documents & Receipts Block */}
                  <div className="space-y-4 lg:col-span-2">
                    <h4 className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
                      Uploaded Assets
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* CV Card */}
                      {app.cvUrl && (
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 transition-all h-16 min-w-0">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-200 truncate">Curriculum Vitae (CV)</p>
                              <span className="text-[10px] text-slate-500 font-mono">Attachment CV</span>
                            </div>
                          </div>
                          <a
                            href={app.cvUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-slate-400 hover:text-teal-400 rounded-lg hover:bg-slate-900 transition-colors shrink-0"
                            title="View / Download"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </div>
                      )}

                      {/* Payment Slip Card */}
                      {app.paymentSlipUrl && (
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 transition-all h-16 min-w-0">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                              <FileSpreadsheet className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-200 truncate">Deposit slip / Receipt</p>
                              <span className="text-[10px] text-slate-500 font-mono">Verified Slip</span>
                            </div>
                          </div>
                          <a
                            href={app.paymentSlipUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-900 transition-colors shrink-0"
                            title="View Slip"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </div>
                      )}

                      {/* Candidate Picture Card */}
                      {app.candidatePictureUrl && (
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 transition-all h-16 min-w-0">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 overflow-hidden shrink-0">
                              <img
                                src={app.candidatePictureUrl}
                                alt="Applicant"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-200 truncate">Passport Size Photo</p>
                              <span className="text-[10px] text-slate-500 font-mono">Candidate Image</span>
                            </div>
                          </div>
                          <a
                            href={app.candidatePictureUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-900 transition-colors shrink-0"
                            title="View Photo"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </div>
                      )}

                      {/* Passport File Card */}
                      {app.passportFileUrl && (
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 transition-all h-16 min-w-0">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-200 truncate">Passport copy</p>
                              <span className="text-[10px] text-slate-500 font-mono">ID Proof</span>
                            </div>
                          </div>
                          <a
                            href={app.passportFileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-900 transition-colors shrink-0"
                            title="View Document"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Notes Section */}
                {app.internalNotes && (
                  <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-2xl space-y-1.5 text-xs">
                    <span className="font-mono font-bold tracking-wider text-slate-500 block uppercase">
                      Admin evaluation notes
                    </span>
                    <p className="text-slate-300 leading-relaxed italic">
                      "{app.internalNotes}"
                    </p>
                  </div>
                )}

                {/* Rejection block if Rejected */}
                {app.status && (app.status.toLowerCase().includes('reject') || app.status.toLowerCase() === 'declined') && app.rejectionReason && (
                  <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl flex gap-3 text-xs">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    <div className="space-y-1">
                      <span className="font-bold text-rose-400 block">
                        Reason for Declination
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {app.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}

              </motion.div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
