/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Job {
  id: string;
  title: string;
  qualification: string;
  salary: string;
  country: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  isOpen: boolean;
  isHidden: boolean;
  isArchived?: boolean;
  createdAt: string;
  titleUr?: string;
  qualificationUr?: string;
  descriptionUr?: string;
}

export interface BankDetails {
  bankName: string;
  accountTitle: string;
  iban: string;
  accountNumber: string;
  branchCode: string;
  qrCodeUrl: string;
  amount: number;
  paymentInstructions?: string;
  currency?: string;
  processingCharges?: number;
  depositSlipRequired?: boolean;
}

export interface OfficeContact {
  address: string;
  mapEmbedUrl: string;
  email: string;
  phone: string;
  whatsApp: string;
  workingHours: string;
}

export interface WebsiteSettings {
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string; // e.g., "#009ca6"
  accentColor: string;  // e.g., "#0e7a83"
  companyName: string;
  enabledSections: {
    hero: boolean;
    about: boolean;
    usv: boolean;
    uuv: boolean;
    research: boolean;
    vacancies: boolean;
    gallery: boolean;
    applySteps: boolean;
    contact: boolean;
  };
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
  companyRegNumber?: string;
  companyCertNumber?: string;
  companyRegUrl?: string;
  companyLegalName?: string;
  companyRegDesc?: string;
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;
  cloudinaryFolder?: string;
  resendApiKey?: string;
  resendSenderEmail?: string;
  smtpHost?: string;
  sessionDuration?: string;
  mfaTriggers?: boolean;
}

export type ApplicationStatus =
  | 'Pending Verification'
  | 'Verified'
  | 'Rejected'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  fatherName: string;
  email: string;
  mobileNumber: string;
  whatsAppNumber: string;
  cnic: string;
  dateOfBirth: string;
  gender: string;
  qualification: string;
  skills: string;
  experience: string;
  completeAddress: string;
  city: string;
  province: string;
  country: string;
  passportAvailable: 'Yes' | 'No';
  passportFileUrl?: string;
  candidatePictureUrl: string; // required
  cvUrl: string; // required
  cnicFrontUrl: string; // required
  cnicBackUrl: string; // required
  paymentSlipUrl: string; // required
  declarationChecked: boolean;
  termsChecked: boolean;
  status: ApplicationStatus;
  internalNotes: string;
  createdAt: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  verifiedPayments: number;
  totalJobs: number;
  recentApplications: Application[];
  statusBreakdown: Record<ApplicationStatus, number>;
}
