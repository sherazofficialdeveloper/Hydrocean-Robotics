/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Landmark,
  FileUp,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Trash2,
  FileText,
  User,
  Check,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Camera,
  Copy,
  Eye,
  Download,
  X
} from 'lucide-react';
import { Job, BankDetails, WebsiteSettings } from '../types';
import { Language, getTranslation } from '../lib/translations';

interface ApplicationFormProps {
  selectedJob: Job | null;
  jobs: Job[];
  bankDetails: BankDetails;
  settings: WebsiteSettings;
  onSuccess: (appId: string) => void;
  applicantUser: { id: string; email: string; fullName: string } | null;
  onShowAuth: () => void;
  lang: Language;
}

export default function ApplicationForm({
  selectedJob,
  jobs,
  bankDetails,
  settings,
  onSuccess,
  applicantUser,
  onShowAuth,
  lang,
}: ApplicationFormProps) {
  const primaryColor = settings.primaryColor || '#009ca6';
  const accentColor = settings.accentColor || '#0e7a83';

  // 3-Step Wizard:
  // Step 1: Applicant Information
  // Step 2: Bank Fee Deposit & Document Uploads
  // Step 3: Review & Submit
  const [currentStep, setCurrentStep] = useState(1);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  const renderDocCard = (label: string, base64: string, filename: string) => {
    if (!base64) return null;
    const isImage = base64.startsWith('data:image/') || (!base64.startsWith('data:') && /\.(jpg|jpeg|png|webp|gif)/i.test(filename));

    return (
      <div className="flex flex-col justify-between bg-slate-950/80 border border-slate-800/80 hover:border-teal-500/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 h-full group">
        {/* Top Preview Section */}
        <div className="relative h-28 w-full bg-slate-900/50 flex items-center justify-center overflow-hidden border-b border-slate-900/50">
          {isImage ? (
            <img src={base64} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-teal-400">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-teal-400" />
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">PDF Document</span>
            </div>
          )}
          {/* Action overlay on hover */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (isImage) {
                  setLightboxImage({ url: base64, title: label });
                } else {
                  const win = window.open();
                  if (win) win.document.write(`<iframe src="${base64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                }
              }}
              className="p-2 bg-slate-900/90 text-teal-400 rounded-lg border border-teal-500/30 hover:scale-110 transition cursor-pointer"
              title={isImage ? "View Image" : "Open PDF"}
            >
              <Eye className="w-4 h-4" />
            </button>
            <a
              href={base64}
              download={filename}
              className="p-2 bg-slate-900/90 text-slate-300 rounded-lg border border-slate-800 hover:scale-110 transition cursor-pointer"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Info & Bottom Actions Area */}
        <div className="p-3.5 flex-grow flex flex-col justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            <div className="flex items-center gap-2 mt-1 min-w-0">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="block text-white font-semibold truncate text-[11px] font-mono flex-grow min-w-0" title={filename}>
                {filename}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-t border-slate-900/50 pt-3">
            <button
              type="button"
              onClick={() => {
                if (isImage) {
                  setLightboxImage({ url: base64, title: label });
                } else {
                  const win = window.open();
                  if (win) win.document.write(`<iframe src="${base64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                }
              }}
              className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-lg hover:text-white transition text-[10px] font-semibold cursor-pointer"
            >
              <Eye className="w-3 h-3 shrink-0" />
              <span className="truncate">View</span>
            </button>
            <a
              href={base64}
              download={filename}
              className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg transition text-[10px] font-bold cursor-pointer"
            >
              <Download className="w-3 h-3 shrink-0" />
              <span className="truncate">Get</span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  // SECTION 1: APPLICANT STATE
  const [targetJobId, setTargetJobId] = useState(selectedJob?.id || '');
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [passportAvailable, setPassportAvailable] = useState<'Yes' | 'No'>('No');
  
  // Optional Passport Upload
  const [passportFile, setPassportFile] = useState('');
  const [passportFileName, setPassportFileName] = useState('');

  // SECTION 2: DOCUMENTS STATE
  const [candidatePicture, setCandidatePicture] = useState('');
  const [candidatePictureName, setCandidatePictureName] = useState('');
  const [cv, setCv] = useState('');
  const [cvName, setCvName] = useState('');
  const [paymentSlip, setPaymentSlip] = useState('');
  const [paymentSlipName, setPaymentSlipName] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // GENERAL STATE
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const pending = sessionStorage.getItem('pendingStepChange');
    if (applicantUser && pending) {
      sessionStorage.removeItem('pendingStepChange');
      const stepNum = parseInt(pending, 10);
      if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= 3) {
        setCurrentStep(stepNum);
      }
    }
  }, [applicantUser]);

  useEffect(() => {
    if (applicantUser) {
      if (!fullName) setFullName(applicantUser.fullName || '');
      if (!email) setEmail(applicantUser.email || '');
    }
  }, [applicantUser]);

  useEffect(() => {
    if (selectedJob) {
      setTargetJobId(selectedJob.id);
    }
  }, [selectedJob]);

  // MATH CAPTCHA
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 8) + 2;
    const num2 = Math.floor(Math.random() * 8) + 1;
    return { num1, num2, answer: num1 + num2 };
  };
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');

  const handleResetCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  // CLIPBOARD COPY HELPER
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // BASE64 FILE CONVERTER
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setBase64: (val: string) => void,
    setName: (val: string) => void,
    allowedExtensions: string[],
    maxSizeMb: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`File size exceeds the ${maxSizeMb}MB limit: ${file.name}`);
      e.target.value = '';
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      alert(`Invalid format for: ${file.name}. Allowed formats: ${allowedExtensions.join(', ').toUpperCase()}`);
      e.target.value = '';
      return;
    }

    setName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setBase64(reader.result as string);
    };
    reader.onerror = () => {
      alert('Error parsing document. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // COMPLIANCE VALIDATIONS
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          targetJobId !== '' &&
          fullName.trim().length >= 2 &&
          fatherName.trim().length >= 2 &&
          whatsAppNumber.trim().length >= 8 &&
          skills.trim().length >= 10 &&
          experience.trim().length >= 10
        );
      case 2:
        return candidatePicture !== '' && cv !== '' && paymentSlip !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  const getStep1Errors = (): string[] => {
    const errs: string[] = [];
    if (!targetJobId) errs.push('Please select a position to apply for.');
    if (fullName.trim().length < 2) errs.push('Full Name must be at least 2 characters long.');
    if (fatherName.trim().length < 2) errs.push("Father's / Guardian's Name must be at least 2 characters long.");
    if (whatsAppNumber.trim().length < 8) errs.push('WhatsApp Number must be at least 8 digits.');
    if (skills.trim().length < 10) errs.push('Technical Skills description must be at least 10 characters.');
    if (experience.trim().length < 10) errs.push('Professional Experience details must be at least 10 characters.');
    return errs;
  };

  const getStep2Errors = (): string[] => {
    const errs: string[] = [];
    if (!candidatePicture) errs.push('Candidate Profile Picture is required.');
    if (!cv) errs.push('Candidate Professional CV/Resume is required.');
    if (!paymentSlip) errs.push('Verified Bank Deposit Slip/Receipt is required.');
    return errs;
  };

  const handleProceedToDocuments = () => {
    const errs = getStep1Errors();
    if (errs.length > 0) {
      setErrorMsg(errs.join(' '));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrorMsg('');
    if (!applicantUser) {
      sessionStorage.setItem('pendingStepChange', '2');
      onShowAuth();
      return;
    }
    setCurrentStep(2);
  };

  const handleProceedToReview = () => {
    const errs = getStep2Errors();
    if (errs.length > 0) {
      setErrorMsg(errs.join(' '));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrorMsg('');
    if (!applicantUser) {
      sessionStorage.setItem('pendingStepChange', '3');
      onShowAuth();
      return;
    }
    setCurrentStep(3);
  };

  // COMBINED SUBMISSION TRIGGER
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isStepValid(1)) {
      setErrorMsg('Please complete all fields in Step 1 first.');
      setCurrentStep(1);
      return;
    }
    if (!isStepValid(2)) {
      setErrorMsg('Please upload all required files in Step 2.');
      setCurrentStep(2);
      return;
    }

    // Capture Validation
    if (parseInt(captchaInput.trim(), 10) !== captcha.answer) {
      setErrorMsg('CAPTCHA validation failed. Please check your math.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: targetJobId,
          jobTitle: jobs.find((j) => j.id === targetJobId)?.title || 'Selected Vacancy',
          fullName,
          fatherName,
          email: email || applicantUser?.email || 'N/A',
          whatsAppNumber,
          cnic: `REG-${Date.now().toString().substring(6)}`,
          city: 'N/A',
          province: 'N/A',
          skills,
          experience,
          passportAvailable,
          passportFileUrl: passportFile || undefined,
          candidatePictureUrl: candidatePicture,
          cvUrl: cv,
          paymentSlipUrl: paymentSlip,
          transactionId: transactionId || `MANUAL-${Date.now().toString().substring(4)}`,
          paymentStatus: 'Pending Verification',
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Server rejected application submission.');
      }

      onSuccess(result.applicationId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Network connection failure. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentSelectedJob = jobs.find((j) => j.id === targetJobId);

  return (
    <div className="bg-slate-950/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-fadeIn" id="recruitment-wizard-container">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h2 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-tight flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-teal-400 animate-pulse" />
          {lang === 'ur' ? 'امیدوار کا داخلہ پورٹل' : 'Candidate Admission Portal'}
        </h2>
        <p className="text-slate-400 text-xs mt-1 font-sans">
          {lang === 'ur'
            ? 'پروگرام میں داخلے کا فارم مکمل کریں۔ بینک چالان رسید اپلوڈ کر کے رجسٹریشن کریں۔'
            : 'Fill out candidate parameters and manually deposit processing fee at Meezan Bank Limited to upload your Challan Slip.'}
        </p>
      </div>

      {/* STEP PROGRESS INDICATOR */}
      <div className="grid grid-cols-3 gap-3 mb-8" id="step-progress-indicator">
        {[
          { label: lang === 'ur' ? 'امیدوار کی معلومات' : '1. Applicant Info', step: 1 },
          { label: lang === 'ur' ? 'فیس اور دستاویزات' : '2. Fee & Documents', step: 2 },
          { label: lang === 'ur' ? 'رسید اور جمع' : '3. Review & Submit', step: 3 }
        ].map((item) => (
          <button
            key={item.step}
            type="button"
            onClick={() => {
              if (item.step === currentStep) return;
              
              if (item.step === 1) {
                setCurrentStep(1);
                setErrorMsg('');
              } else if (item.step === 2) {
                const errs = getStep1Errors();
                if (errs.length > 0) {
                  setErrorMsg(errs.join(' '));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  return;
                }
                setErrorMsg('');
                if (!applicantUser) {
                  sessionStorage.setItem('pendingStepChange', '2');
                  onShowAuth();
                  return;
                }
                setCurrentStep(2);
              } else if (item.step === 3) {
                const errs1 = getStep1Errors();
                if (errs1.length > 0) {
                  setErrorMsg(errs1.join(' '));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  return;
                }
                if (!applicantUser) {
                  sessionStorage.setItem('pendingStepChange', '3');
                  onShowAuth();
                  return;
                }
                const errs2 = getStep2Errors();
                if (errs2.length > 0) {
                  setErrorMsg(errs2.join(' '));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  return;
                }
                setErrorMsg('');
                setCurrentStep(3);
              }
            }}
            className={`flex flex-col items-center justify-between p-3 rounded-2xl border text-center transition-all ${
              currentStep === item.step
                ? 'bg-slate-850 border-teal-500 text-white shadow-lg shadow-teal-500/10 scale-102'
                : item.step < currentStep || isStepValid(item.step - 1)
                ? 'bg-slate-900/40 border-slate-800 text-teal-400 hover:bg-slate-850 cursor-pointer'
                : 'bg-slate-900/10 border-slate-900/50 text-slate-600 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-mono font-bold mb-1.5 transition-all">
              {item.step < currentStep ? (
                <Check className="w-4 h-4 text-teal-400" />
              ) : (
                <span className={currentStep === item.step ? 'text-teal-400' : 'text-slate-500'}>{item.step}</span>
              )}
            </div>
            <span className="text-[10px] font-sans font-medium uppercase tracking-wider block leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* ERROR BANNER */}
      {errorMsg && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3 text-xs font-sans animate-bounce">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* MULTI-STEP WIZARD BODY */}
      <form onSubmit={handleFormSubmit} noValidate>
        <AnimatePresence mode="wait">
          {/* STEP 1: APPLICANT INFORMATION */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
              key="step-1"
            >
              <div className="bg-slate-900/20 border border-slate-800/50 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-sans font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Step 1. Personal & Admission Coordinates
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">Select Vacancy Profile *</label>
                    <select
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                      value={targetJobId}
                      required
                      onChange={(e) => setTargetJobId(e.target.value)}
                    >
                      <option value="">-- Choose Position --</option>
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title} ({j.country})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                      placeholder="Enter Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">Father Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                      placeholder="Enter Father Name"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                      placeholder="e.g. +923001234567"
                      value={whatsAppNumber}
                      onChange={(e) => setWhatsAppNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">Do You Have a Valid Passport? *</label>
                    <div className="flex items-center gap-4 py-2.5">
                      {['Yes', 'No'].map((opt) => (
                        <label key={opt} className="inline-flex items-center gap-2 text-white font-medium cursor-pointer">
                          <input
                            type="radio"
                            name="passportAvailable"
                            className="form-radio text-teal-500"
                            checked={passportAvailable === opt}
                            onChange={() => setPassportAvailable(opt as 'Yes' | 'No')}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">Detailed Summary of Skills *</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                      placeholder="Enlist your programming, robotics, hardware, or research skills..."
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                    <div className="text-right text-[10px] text-slate-500">Min 10 characters required.</div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">Professional Work Experience *</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                      placeholder="Briefly state your industrial, research, or academic work background..."
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                    <div className="text-right text-[10px] text-slate-500">Min 10 characters required.</div>
                  </div>
                </div>
              </div>

              {/* CONDITIONAL PASSPORT SCAN UPLOAD */}
              {passportAvailable === 'Yes' && (
                <div className="bg-slate-900/20 border border-slate-800/50 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-sans font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                    <FileUp className="w-4 h-4" />
                    Passport Scan Document (Optional)
                  </h4>
                  <p className="text-slate-400 text-[10px] font-sans">
                    As you selected Passport Availability, you may optionally attach your passport scan file (PDF, PNG, JPG, JPEG, WEBP) up to 10MB.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/40">
                    {passportFile ? (
                      <div className="flex items-center justify-between w-full text-xs font-sans text-slate-300">
                        <div className="flex items-center gap-2 font-mono">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="truncate max-w-xs">{passportFileName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPassportFile('');
                              setPassportFileName('');
                            }}
                            className="text-red-400 hover:text-red-300 transition p-1.5 hover:bg-slate-800 rounded-lg"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="w-full text-center py-4 cursor-pointer">
                        <FileUp className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                        <span className="block text-slate-400 font-semibold text-xs font-sans">Select Passport Scan</span>
                        <span className="block text-[10px] text-slate-600 mt-1 font-sans">PDF, JPG, JPEG, PNG, WEBP (Max 10MB)</span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          onChange={(e) => handleFileChange(e, setPassportFile, setPassportFileName, ['pdf', 'png', 'jpg', 'jpeg', 'webp'], 10)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* NAVIGATION */}
              <div className="flex justify-end pt-4">
                <motion.button
                  type="button"
                  onClick={handleProceedToDocuments}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 py-2.5 px-6 rounded-xl font-semibold text-xs font-sans transition bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg cursor-pointer"
                >
                  Proceed to Documents
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: MANUAL FEE DEPOSIT & UPLOADS */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
              key="step-2"
            >
              {/* DEPOSIT SLIP INSTRUCTIONS */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-3 border-b border-slate-800/60 pb-3">
                  <div className="p-2 bg-teal-500/10 rounded-xl">
                    <Landmark className="w-5 h-5 text-teal-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-white font-sans font-bold text-sm">Application Fee Deposit Instructions</h4>
                    <p className="text-[10px] text-slate-500 font-sans tracking-wide uppercase mt-0.5">Please deposit the fee manually to clear verification</p>
                  </div>
                </div>

                <div className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed space-y-2">
                  <p>Please manually deposit the required application processing fee at the designated bank branch or via mobile / internet banking transfer (outside this website).</p>
                  <p>Once you make the manual deposit and receive the official bank deposit slip/challan, please take a clear photo or scan of it. You must upload the deposit slip image below as proof of payment to submit your application.</p>
                </div>
              </div>

              {/* REQUIRED DOCUMENTS GRID */}
              <div className="bg-slate-900/20 border border-slate-800/50 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-sans font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
                  <FileText className="w-4 h-4" />
                  Step 2. Document Attachments
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* UPLOAD 1: CANDIDATE PICTURE */}
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex flex-col justify-between space-y-3 min-h-64">
                    <div>
                      <span className="block text-xs font-bold text-slate-300 font-sans">1. Candidate Photograph *</span>
                      <span className="block text-[10px] text-slate-500 mt-1 font-sans">Color passport-size avatar. PNG, JPG, JPEG, WEBP (Max 10MB).</span>
                    </div>

                    <div className="grow flex items-center justify-center border-2 border-dashed border-slate-800 bg-slate-950/20 rounded-xl p-3 relative overflow-hidden">
                      {candidatePicture ? (
                        <div className="text-center relative">
                          <img
                            src={candidatePicture}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover border-2 border-teal-500 mx-auto"
                          />
                          <span className="block text-[9px] text-slate-400 font-mono truncate mt-2 max-w-[120px] mx-auto">{candidatePictureName}</span>
                          <button
                            type="button"
                            onClick={() => { setCandidatePicture(''); setCandidatePictureName(''); }}
                            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-400 text-white p-1 rounded-full shadow-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-center">
                          <Camera className="w-8 h-8 text-slate-600 mb-2" />
                          <span className="text-[10px] font-bold text-teal-400">Select Image File</span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".png,.jpg,.jpeg,.webp"
                            onChange={(e) => handleFileChange(e, setCandidatePicture, setCandidatePictureName, ['png', 'jpg', 'jpeg', 'webp'], 10)}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* UPLOAD 2: CANDIDATE CV */}
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex flex-col justify-between space-y-3 min-h-64">
                    <div>
                      <span className="block text-xs font-bold text-slate-300 font-sans">2. Resume / CV Document *</span>
                      <span className="block text-[10px] text-slate-500 mt-1 font-sans">Academic / work background. PDF, DOC, DOCX, JPG, PNG (Max 10MB).</span>
                    </div>

                    <div className="grow flex items-center justify-center border-2 border-dashed border-slate-800 bg-slate-950/20 rounded-xl p-3 relative overflow-hidden">
                      {cv ? (
                        <div className="text-center relative w-full">
                          <FileText className="w-12 h-12 text-teal-400 mx-auto" />
                          <span className="block text-[10px] text-slate-300 font-mono truncate mt-2 font-bold max-w-[140px] mx-auto">{cvName}</span>
                          <span className="block text-[9px] text-emerald-400 uppercase mt-0.5 font-mono">CV FILE ATTACHED</span>
                          <button
                            type="button"
                            onClick={() => { setCv(''); setCvName(''); }}
                            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-400 text-white p-1 rounded-full shadow-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-center">
                          <FileUp className="w-8 h-8 text-slate-600 mb-2" />
                          <span className="text-[10px] font-bold text-teal-400">Select CV File</span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                            onChange={(e) => handleFileChange(e, setCv, setCvName, ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'], 10)}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* UPLOAD 3: BANK DEPOSIT SLIP */}
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex flex-col justify-between space-y-3 min-h-64">
                    <div>
                      <span className="block text-xs font-bold text-slate-300 font-sans">3. Deposit Receipt / Slip *</span>
                      <span className="block text-[10px] text-slate-500 mt-1 font-sans">Paid manual bank deposit receipt / challan copy. PNG, JPG, JPEG, WEBP, PDF (Max 10MB).</span>
                    </div>

                    <div className="grow flex items-center justify-center border-2 border-dashed border-slate-800 bg-slate-950/20 rounded-xl p-3 relative overflow-hidden">
                      {paymentSlip ? (
                        <div className="text-center relative w-full">
                          {paymentSlip.startsWith('data:image') ? (
                            <img src={paymentSlip} alt="Receipt" className="max-h-24 max-w-full object-contain mx-auto rounded border border-slate-800" />
                          ) : (
                            <FileText className="w-12 h-12 text-teal-400 mx-auto" />
                          )}
                          <span className="block text-[10px] text-slate-300 font-mono truncate mt-2 font-bold max-w-[140px] mx-auto">{paymentSlipName}</span>
                          <button
                            type="button"
                            onClick={() => { setPaymentSlip(''); setPaymentSlipName(''); }}
                            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-400 text-white p-1 rounded-full shadow-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-center">
                          <FileUp className="w-8 h-8 text-slate-600 mb-2" />
                          <span className="text-[10px] font-bold text-teal-400">Select Deposit Slip</span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg,.webp"
                            onChange={(e) => handleFileChange(e, setPaymentSlip, setPaymentSlipName, ['pdf', 'png', 'jpg', 'jpeg', 'webp'], 10)}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* CHALLAN / RECEIPT NUMBER INPUT */}
                <div className="pt-4 text-xs font-sans max-w-md">
                  <label className="block text-slate-400 mb-1.5 font-semibold">Deposit Slip Number / Challan Ref No (Optional)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-850 text-white rounded-xl py-2 px-3.5 focus:outline-none focus:border-teal-500 font-mono text-xs"
                    placeholder="e.g. MS-12040-302"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                  <span className="block text-[9px] text-slate-500 mt-1">If the bank slip has a stamped reference or receipt number, enter it here to help expedite verification.</span>
                </div>
              </div>

              {/* NAVIGATION */}
              <div className="flex justify-between pt-4">
                <motion.button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-slate-900 border border-slate-800 text-slate-300 py-2.5 px-6 rounded-xl font-semibold text-xs font-sans hover:bg-slate-850 transition flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleProceedToReview}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 py-2.5 px-6 rounded-xl font-semibold text-xs font-sans transition bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg cursor-pointer"
                >
                  Proceed to Review
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: REVIEW & SUBMIT */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
              key="step-3"
            >
              <div className="bg-slate-900/20 border border-slate-800/50 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-sans font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Step 3. Admission Summary & Attestation Review
                </h3>

                {/* REVIEW METADATA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-slate-300 bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <div>
                    <span className="block text-slate-500 font-semibold mb-1">Applying For Position</span>
                    <span className="block text-white font-bold">{currentSelectedJob?.title || 'Selected Vacancy'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold mb-1">Full Name</span>
                    <span className="block text-white font-bold">{fullName}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold mb-1">Father Name</span>
                    <span className="block text-white font-bold">{fatherName}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold mb-1">WhatsApp Number</span>
                    <span className="block text-white font-mono font-bold">{whatsAppNumber}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold mb-1">Official Coordinates</span>
                    <span className="block text-white font-mono font-bold">{email || 'Not Specified'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold mb-1">Fee Payment Status</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[9px] font-bold uppercase mt-1">
                      Pending Verification
                    </span>
                  </div>
                  {transactionId && (
                    <div className="sm:col-span-2">
                      <span className="block text-slate-500 font-semibold mb-1">Challan Ref / Slip Number</span>
                      <span className="block text-teal-400 font-mono font-bold">{transactionId}</span>
                    </div>
                  )}
                </div>

                {/* DOCUMENTS SUMMARY */}
                <div>
                  <span className="block text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-3">Uploaded Verification Documents</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
                    {renderDocCard('Avatar Photo', candidatePicture, candidatePictureName)}
                    {renderDocCard('CV / Resume', cv, cvName)}
                    {renderDocCard('Deposit Challan Slip', paymentSlip, paymentSlipName)}
                    {passportAvailable === 'Yes' && passportFile && renderDocCard('Passport Scan', passportFile, passportFileName)}
                  </div>
                </div>

                {/* CAPTCHA CHALLENGE */}
                <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 text-xs font-sans">
                  <div className="flex items-center gap-3 bg-slate-950 py-2 px-4 rounded-xl border border-slate-800">
                    <span className="text-teal-400 font-mono font-bold text-sm tracking-wide">
                      {captcha.num1} + {captcha.num2} = ?
                    </span>
                    <button
                      type="button"
                      onClick={handleResetCaptcha}
                      className="text-slate-400 hover:text-white transition p-1"
                      title="New CAPTCHA Challenge"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grow w-full">
                    <input
                      type="number"
                      required
                      placeholder="Verify you are human by solving the addition math challenge"
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 text-xs font-sans"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* NAVIGATION */}
              <div className="flex justify-between pt-4">
                <motion.button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-slate-900 border border-slate-800 text-slate-300 py-2.5 px-6 rounded-xl font-semibold text-xs font-sans hover:bg-slate-850 transition flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={submitting || !captchaInput}
                  whileHover={(!submitting && captchaInput) ? { scale: 1.02 } : {}}
                  whileTap={(!submitting && captchaInput) ? { scale: 0.98 } : {}}
                  className={`flex items-center justify-center gap-2 py-3 px-8 rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg ${
                    submitting || !captchaInput
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-teal-500 hover:bg-teal-400 text-slate-950 cursor-pointer'
                  }`}
                  style={!submitting && captchaInput ? { backgroundColor: primaryColor, color: '#090d16' } : {}}
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* IMAGE LIGHTBOX OVERLAY */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 bg-slate-900 text-slate-400 hover:text-white p-3 rounded-full hover:bg-slate-800 transition cursor-pointer"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-4xl max-h-[75vh] flex items-center justify-center relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="max-w-full max-h-[75vh] object-contain select-none"
            />
          </div>
          
          <div className="mt-6 flex items-center gap-4">
            <a
              href={lightboxImage.url}
              download={lightboxImage.title.replace(/\s+/g, '_') + '_preview'}
              className="flex items-center gap-2 py-3 px-6 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download High-Res
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
