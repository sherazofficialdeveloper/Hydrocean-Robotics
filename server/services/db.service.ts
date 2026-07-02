/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { dbState } from '../config/db';
import Applicant from '../models/Applicant';
import Payment from '../models/Payment';
import DocumentModel from '../models/Document';
import Application from '../models/Application';
import Job from '../models/Job';
import Settings from '../models/Settings';
import User from '../models/User';
import PendingUser from '../models/PendingUser';
import Visit from '../models/Visit';
import NotificationModel from '../models/Notification';
import Contact from '../models/Contact';

const DB_FILE = path.join(process.cwd(), 'uploads', 'db.json');

// Memory/JSON DB representation
interface JSONDatabase {
  adminHash: string;
  adminEmail: string;
  jobs: any[];
  applications: any[];
  applicants: any[];
  payments: any[];
  documents: any[];
  settings: any;
  bankDetails: any;
  officeContact: any;
  logs: any[];
  users: any[];
  visits?: any[];
  notifications?: any[];
  contacts?: any[];
  gallery?: string[];
  pendingUsers?: any[];
}

function loadJSONDB(): JSONDatabase {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      if (!data.jobs || !Array.isArray(data.jobs)) data.jobs = [];
      if (!data.applications || !Array.isArray(data.applications)) data.applications = [];
      if (!data.applicants || !Array.isArray(data.applicants)) data.applicants = [];
      if (!data.payments || !Array.isArray(data.payments)) data.payments = [];
      if (!data.documents || !Array.isArray(data.documents)) data.documents = [];
      if (!data.logs || !Array.isArray(data.logs)) data.logs = [];
      if (!data.users || !Array.isArray(data.users)) data.users = [];
      if (!data.visits || !Array.isArray(data.visits)) data.visits = [];
      if (!data.notifications || !Array.isArray(data.notifications)) data.notifications = [];
      if (!data.contacts || !Array.isArray(data.contacts)) data.contacts = [];
      if (!data.gallery || !Array.isArray(data.gallery)) data.gallery = [];
      if (!data.pendingUsers || !Array.isArray(data.pendingUsers)) data.pendingUsers = [];
      if (!data.settings) data.settings = {};
      if (!data.bankDetails) data.bankDetails = {};
      if (!data.officeContact) data.officeContact = {};
      if (!data.adminEmail) data.adminEmail = 'admin@example.com';
      return data;
    } catch (e) {
      // return default seed below
    }
  }

  // Create default structure if missing
  const seed: JSONDatabase = {
    adminHash: '', // Set by caller or seeding
    adminEmail: 'admin@example.com',
    jobs: [],
    applications: [],
    applicants: [],
    payments: [],
    documents: [],
    settings: {},
    bankDetails: {},
    officeContact: {},
    logs: [],
    users: [],
    visits: [],
    notifications: [],
    contacts: [],
    gallery: [],
    pendingUsers: [],
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf8');
  return seed;
}

function saveJSONDB(data: JSONDatabase) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export class DBService {
  // --- ADMIN & GENERAL CONFIGS ---
  static async getSettingsBundle(): Promise<{ settings: any; bankDetails: any; officeContact: any; adminHash: string; adminEmail: string }> {
    const ensureRegDefaults = (setObj: any) => {
      const copy = { ...setObj };
      if (copy.companyRegNumber === undefined) copy.companyRegNumber = 'SEC-2026-089765';
      if (copy.companyCertNumber === undefined) copy.companyCertNumber = 'CERT-65432-PK';
      if (copy.companyRegUrl === undefined) copy.companyRegUrl = process.env.COMPANY_REGISTRATION_URL || 'https://secp.gov.pk';
      if (copy.companyLegalName === undefined) copy.companyLegalName = 'Hydrocean Robotics (Private) Limited';
      if (copy.companyRegDesc === undefined) copy.companyRegDesc = 'Hydrocean Robotics is officially incorporated and registered under the Companies Act as a technology provider for marine and autonomous subsea exploration systems.';
      return copy;
    };

    if (dbState.isMongoDB) {
      const doc = await Settings.findOne();
      if (doc) {
        return {
          settings: ensureRegDefaults(doc.settings),
          bankDetails: doc.bankDetails,
          officeContact: doc.officeContact,
          adminHash: doc.adminHash,
          adminEmail: doc.adminEmail || 'admin@example.com',
        };
      }
    }
    const json = loadJSONDB();
    return {
      settings: ensureRegDefaults(json.settings),
      bankDetails: json.bankDetails,
      officeContact: json.officeContact,
      adminHash: json.adminHash,
      adminEmail: json.adminEmail || 'admin@example.com',
    };
  }

  static async saveSettingsBundle(payload: { settings?: any; bankDetails?: any; officeContact?: any; adminHash?: string; adminEmail?: string }): Promise<void> {
    if (dbState.isMongoDB) {
      const doc = await Settings.findOne();
      if (doc) {
        if (payload.settings) doc.settings = { ...doc.settings, ...payload.settings };
        if (payload.bankDetails) doc.bankDetails = { ...doc.bankDetails, ...payload.bankDetails };
        if (payload.officeContact) doc.officeContact = { ...doc.officeContact, ...payload.officeContact };
        if (payload.adminHash) doc.adminHash = payload.adminHash;
        if (payload.adminEmail) doc.adminEmail = payload.adminEmail;
        doc.markModified('settings');
        doc.markModified('bankDetails');
        doc.markModified('officeContact');
        await doc.save();
        return;
      } else {
        await Settings.create({
          adminHash: payload.adminHash || '',
          adminEmail: payload.adminEmail || 'admin@example.com',
          settings: payload.settings || {},
          bankDetails: payload.bankDetails || {},
          officeContact: payload.officeContact || {},
          logs: [],
        });
        return;
      }
    }

    const json = loadJSONDB();
    if (payload.settings) json.settings = { ...json.settings, ...payload.settings };
    if (payload.bankDetails) json.bankDetails = { ...json.bankDetails, ...payload.bankDetails };
    if (payload.officeContact) json.officeContact = { ...json.officeContact, ...payload.officeContact };
    if (payload.adminHash) json.adminHash = payload.adminHash;
    if (payload.adminEmail) json.adminEmail = payload.adminEmail;
    saveJSONDB(json);
  }

  // --- GALLERY ---
  static async getGallery(): Promise<string[]> {
    if (dbState.isMongoDB) {
      const doc = await Settings.findOne();
      if (doc) {
        return (doc as any).gallery || [];
      }
      return [];
    }
    const json = loadJSONDB();
    return json.gallery || [];
  }

  static async saveGallery(galleryList: string[]): Promise<void> {
    if (dbState.isMongoDB) {
      const doc = await Settings.findOne();
      if (doc) {
        (doc as any).gallery = galleryList;
        doc.markModified('gallery');
        await doc.save();
        return;
      }
    }
    const json = loadJSONDB();
    json.gallery = galleryList;
    saveJSONDB(json);
  }

  // --- VACANCIES / JOBS ---
  static async getJobs(all = false): Promise<any[]> {
    if (dbState.isMongoDB) {
      const query = all ? {} : { isOpen: true, isHidden: false, isArchived: { $ne: true } };
      return await Job.find(query).sort({ createdAt: -1 });
    }
    const json = loadJSONDB();
    if (all) return json.jobs;
    return json.jobs.filter((j) => j.isOpen && !j.isHidden && !j.isArchived);
  }

  static async getJobById(id: string): Promise<any | null> {
    if (dbState.isMongoDB) {
      return await Job.findOne({ id });
    }
    const json = loadJSONDB();
    return json.jobs.find((j) => j.id === id) || null;
  }

  static async saveJob(jobData: any): Promise<any> {
    if (dbState.isMongoDB) {
      const existing = await Job.findOne({ id: jobData.id });
      if (existing) {
        Object.assign(existing, jobData);
        return await existing.save();
      } else {
        return await Job.create(jobData);
      }
    }

    const json = loadJSONDB();
    if (!json.jobs || !Array.isArray(json.jobs)) {
      json.jobs = [];
    }
    const idx = json.jobs.findIndex((j) => j && j.id === jobData.id);
    if (idx !== -1) {
      json.jobs[idx] = { ...json.jobs[idx], ...jobData };
    } else {
      json.jobs.unshift(jobData);
    }
    saveJSONDB(json);
    return jobData;
  }

  static async deleteJob(id: string): Promise<boolean> {
    if (dbState.isMongoDB) {
      const result = await Job.deleteOne({ id });
      return (result.deletedCount || 0) > 0;
    }
    const json = loadJSONDB();
    const idx = json.jobs.findIndex((j) => j.id === id);
    if (idx !== -1) {
      json.jobs.splice(idx, 1);
      saveJSONDB(json);
      return true;
    }
    return false;
  }

  // --- LOGS ---
  static async addLog(action: string, ip: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const entry = { action, ip, timestamp };

    if (dbState.isMongoDB) {
      const doc = await Settings.findOne();
      if (doc) {
        if (!doc.logs || !Array.isArray(doc.logs)) {
          doc.logs = [];
        }
        doc.logs.unshift(entry);
        if (doc.logs.length > 200) doc.logs.pop();
        doc.markModified('logs');
        await doc.save();
        return;
      }
    }

    const json = loadJSONDB();
    if (!json.logs || !Array.isArray(json.logs)) {
      json.logs = [];
    }
    json.logs.unshift(entry);
    if (json.logs.length > 200) json.logs.pop();
    saveJSONDB(json);
  }

  static async getLogs(): Promise<any[]> {
    if (dbState.isMongoDB) {
      const doc = await Settings.findOne();
      return doc ? doc.logs : [];
    }
    return loadJSONDB().logs;
  }

  // --- APPLICATION SUBMISSIONS & FLOWS ---
  static async isCnicDuplicate(jobId: string, cnic: string): Promise<boolean> {
    const cleanCnic = cnic.replace(/[^0-9]/g, '');
    if (dbState.isMongoDB) {
      const count = await Application.countDocuments({
        jobId,
        cnic: cleanCnic,
      });
      return count > 0;
    }
    const json = loadJSONDB();
    return json.applications.some(
      (app) => app.jobId === jobId && app.cnic.replace(/[^0-9]/g, '') === cleanCnic
    );
  }

  static async isApplicationDuplicate(jobId: string, email: string, applicantId?: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    if (dbState.isMongoDB) {
      const orQuery: any[] = [{ email: cleanEmail }];
      if (applicantId) {
        orQuery.push({ applicantId });
      }
      const count = await Application.countDocuments({
        jobId,
        $or: orQuery,
      });
      return count > 0;
    }
    const json = loadJSONDB();
    return json.applications.some(
      (app) => app.jobId === jobId && (
        (app.email && app.email.toLowerCase().trim() === cleanEmail) ||
        (applicantId && app.applicantId === applicantId)
      )
    );
  }

  static async createRecruitmentApplication(payload: {
    applicant: {
      fullName: string;
      fatherName: string;
      whatsAppNumber: string;
      skills: string;
      experience: string;
      passportAvailable: 'Yes' | 'No';
      passportFileUrl?: string;
    };
    payment: {
      paymentStatus: 'Unpaid' | 'Paid' | 'Pending Verification' | 'Rejected';
      paymentMethod: string;
      paymentDate?: Date;
      transactionId?: string;
      amount: number;
      receiptFileUrl: string;
    };
    documents: {
      cvUrl: string;
      pictureUrl: string;
      passportUrl?: string;
      receiptUrl: string;
    };
    application: {
      jobId: string;
      jobTitle: string;
      city: string;
      province: string;
      email: string;
    };
  }): Promise<string> {
    const id = `app_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const cleanCnic = id; // Fallback or computed ID

    if (dbState.isMongoDB) {
      // 1. Create Applicant
      const applicantDoc = await Applicant.create(payload.applicant);
      // 2. Create Payment
      const paymentDoc = await Payment.create(payload.payment);
      // 3. Create Documents
      const documentDoc = await DocumentModel.create(payload.documents);
      // 4. Create Application
      const applicationDoc = await Application.create({
        applicantId: applicantDoc._id.toString(),
        documentId: documentDoc._id.toString(),
        paymentId: paymentDoc._id.toString(),
        jobId: payload.application.jobId,
        jobTitle: payload.application.jobTitle,
        fullName: payload.applicant.fullName,
        cnic: id, // unique registration id/key
        city: payload.application.city,
        province: payload.application.province,
        email: payload.application.email,
        status: 'Pending Review',
      });

      return applicationDoc._id.toString();
    }

    // JSON DB fallbacks
    const json = loadJSONDB();
    const applicantId = `applicant_${Date.now()}`;
    const paymentId = `payment_${Date.now()}`;
    const documentId = `doc_${Date.now()}`;

    const newApplicant = { id: applicantId, ...payload.applicant, createdAt: new Date().toISOString() };
    const newPayment = { id: paymentId, ...payload.payment, createdAt: new Date().toISOString() };
    const newDocuments = { id: documentId, ...payload.documents, createdAt: new Date().toISOString() };

    const newApp = {
      id,
      applicantId,
      documentId,
      paymentId,
      jobId: payload.application.jobId,
      jobTitle: payload.application.jobTitle,
      fullName: payload.applicant.fullName,
      fatherName: payload.applicant.fatherName,
      whatsAppNumber: payload.applicant.whatsAppNumber,
      cnic: id,
      city: payload.application.city,
      province: payload.application.province,
      email: payload.application.email,
      skills: payload.applicant.skills,
      experience: payload.applicant.experience,
      passportAvailable: payload.applicant.passportAvailable,
      passportFileUrl: payload.documents.passportUrl,
      candidatePictureUrl: payload.documents.pictureUrl,
      cvUrl: payload.documents.cvUrl,
      paymentSlipUrl: payload.documents.receiptUrl,
      paymentStatus: payload.payment.paymentStatus,
      transactionId: payload.payment.transactionId,
      status: 'Pending Review',
      internalNotes: '',
      createdAt: new Date().toISOString(),
    };

    if (!json.applicants || !Array.isArray(json.applicants)) {
      json.applicants = [];
    }
    if (!json.payments || !Array.isArray(json.payments)) {
      json.payments = [];
    }
    if (!json.documents || !Array.isArray(json.documents)) {
      json.documents = [];
    }
    if (!json.applications || !Array.isArray(json.applications)) {
      json.applications = [];
    }

    json.applicants.unshift(newApplicant);
    json.payments.unshift(newPayment);
    json.documents.unshift(newDocuments);
    json.applications.unshift(newApp);

    saveJSONDB(json);
    return id;
  }

  static async getApplications(filters: { search?: string; status?: string; jobId?: string; city?: string }): Promise<any[]> {
    if (dbState.isMongoDB) {
      const query: any = {};
      if (filters.status) query.status = filters.status;
      if (filters.jobId) query.jobId = filters.jobId;
      if (filters.city) query.city = new RegExp(filters.city, 'i');

      if (filters.search) {
        const q = new RegExp(filters.search, 'i');
        query.$or = [
          { fullName: q },
          { email: q },
          { city: q },
          { cnic: q },
        ];
      }

      const apps = await Application.find(query).sort({ createdAt: -1 });
      const populated = [];

      for (const app of apps) {
        const applicant = await Applicant.findById(app.applicantId);
        const payment = await Payment.findById(app.paymentId);
        const docs = await DocumentModel.findById(app.documentId);

        if (applicant && payment && docs) {
          populated.push({
            id: app._id.toString(),
            jobId: app.jobId,
            jobTitle: app.jobTitle,
            fullName: applicant.fullName,
            fatherName: applicant.fatherName,
            email: app.email,
            whatsAppNumber: applicant.whatsAppNumber,
            mobileNumber: applicant.whatsAppNumber, // unified
            cnic: app.cnic,
            skills: applicant.skills,
            experience: applicant.experience,
            city: app.city,
            province: app.province,
            passportAvailable: applicant.passportAvailable,
            passportFileUrl: docs.passportUrl,
            candidatePictureUrl: docs.pictureUrl,
            cvUrl: docs.cvUrl,
            paymentSlipUrl: docs.receiptUrl,
            status: app.status,
            paymentStatus: payment.paymentStatus,
            transactionId: payment.transactionId,
            paymentDate: payment.paymentDate,
            internalNotes: app.internalNotes,
            createdAt: app.createdAt.toISOString(),
          });
        }
      }
      return populated;
    }

    // JSON file filtering
    const json = loadJSONDB();
    let list = [...json.applications];

    if (filters.status) {
      list = list.filter((a) => a.status === filters.status);
    }
    if (filters.jobId) {
      list = list.filter((a) => a.jobId === filters.jobId);
    }
    if (filters.city) {
      list = list.filter((a) => a.city.toLowerCase() === filters.city!.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.cnic.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q)
      );
    }

    return list;
  }

  static async updateApplicationStatus(id: string, payload: { status?: string; internalNotes?: string; rejectionReason?: string }): Promise<any> {
    if (dbState.isMongoDB) {
      const app = await Application.findById(id);
      if (!app) return null;

      if (payload.status) {
        app.status = payload.status;
        // Keep paymentStatus aligned
        const payment = await Payment.findById(app.paymentId);
        if (payment) {
          if (payload.status === 'Verified' || payload.status === 'Payment Verified' || payload.status === 'Approved') (payment as any).paymentStatus = 'Paid';
          if (payload.status === 'Rejected') {
            (payment as any).paymentStatus = 'Rejected';
            if (payload.rejectionReason) {
              (payment as any).rejectionReason = payload.rejectionReason;
            }
          }
          if (payload.status === 'Pending Verification' || payload.status === 'Payment Pending Verification') (payment as any).paymentStatus = 'Pending Verification';
          await payment.save();
        }
      }
      if (payload.internalNotes !== undefined) app.internalNotes = payload.internalNotes;
      if (payload.rejectionReason !== undefined) app.rejectionReason = payload.rejectionReason;
      await app.save();
      return app;
    }

    const json = loadJSONDB();
    const idx = json.applications.findIndex((a) => a.id === id);
    if (idx !== -1) {
      const app = json.applications[idx];
      if (payload.status) app.status = payload.status;
      if (payload.internalNotes !== undefined) app.internalNotes = payload.internalNotes;
      if (payload.rejectionReason !== undefined) app.rejectionReason = payload.rejectionReason;
      
      // Keep paymentStatus aligned in JSON DB
      const pIdx = json.payments.findIndex((p) => (p.id || p._id) === app.paymentId);
      if (pIdx !== -1) {
        if (payload.status === 'Verified' || payload.status === 'Payment Verified' || payload.status === 'Approved') json.payments[pIdx].paymentStatus = 'Paid';
        if (payload.status === 'Rejected') {
          json.payments[pIdx].paymentStatus = 'Rejected';
          if (payload.rejectionReason) {
            json.payments[pIdx].rejectionReason = payload.rejectionReason;
          }
        }
        if (payload.status === 'Pending Verification' || payload.status === 'Payment Pending Verification') json.payments[pIdx].paymentStatus = 'Pending Verification';
      }

      json.applications[idx] = app;
      saveJSONDB(json);
      return app;
    }
    return null;
  }

  static async deleteApplication(id: string): Promise<boolean> {
    if (dbState.isMongoDB) {
      const app = await Application.findById(id);
      if (!app) return false;

      await Applicant.findByIdAndDelete(app.applicantId);
      await Payment.findByIdAndDelete(app.paymentId);
      await DocumentModel.findByIdAndDelete(app.documentId);
      await Application.findByIdAndDelete(id);
      return true;
    }

    const json = loadJSONDB();
    const idx = json.applications.findIndex((a) => a.id === id);
    if (idx !== -1) {
      const app = json.applications[idx];
      json.applicants = json.applicants.filter((a) => a.id !== app.applicantId);
      json.payments = json.payments.filter((p) => p.id !== app.paymentId);
      json.documents = json.documents.filter((d) => d.id !== app.documentId);
      json.applications.splice(idx, 1);
      saveJSONDB(json);
      return true;
    }
    return false;
  }

  // --- USERS ---
  static async getUserByEmail(email: string): Promise<any | null> {
    if (dbState.isMongoDB) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    const json = loadJSONDB();
    return json.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static async getUserById(id: string): Promise<any | null> {
    if (dbState.isMongoDB) {
      return await User.findById(id);
    }
    const json = loadJSONDB();
    return json.users.find((u) => u.id === id) || null;
  }

  static async createUser(payload: any): Promise<any> {
    if (dbState.isMongoDB) {
      return await User.create({
        email: payload.email.toLowerCase(),
        passwordHash: payload.passwordHash,
        fullName: payload.fullName,
        role: payload.role || 'applicant',
        isVerified: payload.isVerified || false,
        otp: payload.otp,
        otpExpires: payload.otpExpires,
      });
    }
    const json = loadJSONDB();
    const newUser = {
      id: `usr_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      email: payload.email.toLowerCase(),
      passwordHash: payload.passwordHash,
      fullName: payload.fullName,
      role: payload.role || 'applicant',
      isVerified: payload.isVerified || false,
      otp: payload.otp,
      otpExpires: payload.otpExpires ? payload.otpExpires.toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    json.users.push(newUser);
    saveJSONDB(json);
    return newUser;
  }

  static async updateUser(id: string, payload: any): Promise<any | null> {
    if (dbState.isMongoDB) {
      const user = await User.findById(id);
      if (!user) return null;
      Object.assign(user, payload);
      return await user.save();
    }
    const json = loadJSONDB();
    const idx = json.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      json.users[idx] = { ...json.users[idx], ...payload, updatedAt: new Date().toISOString() };
      saveJSONDB(json);
      return json.users[idx];
    }
    return null;
  }

  static async getUsers(): Promise<any[]> {
    if (dbState.isMongoDB) {
      return await User.find().sort({ createdAt: -1 });
    }
    return loadJSONDB().users;
  }

  static async getPayments(): Promise<any[]> {
    if (dbState.isMongoDB) {
      return await Payment.find().sort({ createdAt: -1 });
    }
    return loadJSONDB().payments;
  }

  static async deleteUser(id: string): Promise<boolean> {
    if (dbState.isMongoDB) {
      const res = await User.findByIdAndUpdate(id, { isDeleted: true });
      return !!res;
    }
    const json = loadJSONDB();
    const idx = json.users.findIndex((u) => (u.id || u._id) === id);
    if (idx !== -1) {
      json.users[idx].isDeleted = true;
      saveJSONDB(json);
      return true;
    }
    return false;
  }

  static async restoreUser(id: string): Promise<boolean> {
    if (dbState.isMongoDB) {
      const res = await User.findByIdAndUpdate(id, { isDeleted: false, isBlocked: false });
      return !!res;
    }
    const json = loadJSONDB();
    const idx = json.users.findIndex((u) => (u.id || u._id) === id);
    if (idx !== -1) {
      json.users[idx].isDeleted = false;
      json.users[idx].isBlocked = false;
      saveJSONDB(json);
      return true;
    }
    return false;
  }

  static async getUserByResetToken(token: string): Promise<any | null> {
    if (dbState.isMongoDB) {
      return await User.findOne({
        resetToken: token,
        resetTokenExpires: { $gt: new Date() },
      });
    }
    const json = loadJSONDB();
    const user = json.users.find((u) => u.resetToken === token);
    if (!user) return null;
    if (new Date(user.resetTokenExpires) < new Date()) return null;
    return user;
  }

  // --- PENDING USERS (OTP SIGNUP FLOW) ---
  static async getPendingUserByEmail(email: string): Promise<any | null> {
    if (dbState.isMongoDB) {
      return await PendingUser.findOne({ email: email.toLowerCase().trim() });
    }
    const json = loadJSONDB();
    if (!json.pendingUsers) json.pendingUsers = [];
    return json.pendingUsers.find((p) => p.email.toLowerCase() === email.toLowerCase().trim()) || null;
  }

  static async createPendingUser(payload: any): Promise<any> {
    const cleanEmail = payload.email.toLowerCase().trim();
    if (dbState.isMongoDB) {
      // Remove any existing pending user with same email first
      await PendingUser.deleteMany({ email: cleanEmail });
      return await PendingUser.create({
        email: cleanEmail,
        passwordHash: payload.passwordHash,
        fullName: payload.fullName,
        otp: payload.otp,
        otpExpires: payload.otpExpires,
      });
    }
    const json = loadJSONDB();
    if (!json.pendingUsers) json.pendingUsers = [];
    // Remove existing pending email
    json.pendingUsers = json.pendingUsers.filter((p) => p.email.toLowerCase() !== cleanEmail);
    const newPending = {
      id: `pnd_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      email: cleanEmail,
      passwordHash: payload.passwordHash,
      fullName: payload.fullName,
      otp: payload.otp,
      otpExpires: payload.otpExpires ? payload.otpExpires.toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    json.pendingUsers.push(newPending);
    saveJSONDB(json);
    return newPending;
  }

  static async deletePendingUser(email: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    if (dbState.isMongoDB) {
      const res = await PendingUser.deleteMany({ email: cleanEmail });
      return res.deletedCount > 0;
    }
    const json = loadJSONDB();
    if (!json.pendingUsers) json.pendingUsers = [];
    const beforeCount = json.pendingUsers.length;
    json.pendingUsers = json.pendingUsers.filter((p) => p.email.toLowerCase() !== cleanEmail);
    saveJSONDB(json);
    return json.pendingUsers.length < beforeCount;
  }

  static async updatePendingUserEmail(oldEmail: string, newEmail: string, newOtp: string, newOtpExpires: Date): Promise<any | null> {
    const cleanOld = oldEmail.toLowerCase().trim();
    const cleanNew = newEmail.toLowerCase().trim();
    if (dbState.isMongoDB) {
      const pending = await PendingUser.findOne({ email: cleanOld });
      if (!pending) return null;
      pending.email = cleanNew;
      pending.otp = newOtp;
      pending.otpExpires = newOtpExpires;
      return await pending.save();
    }
    const json = loadJSONDB();
    if (!json.pendingUsers) json.pendingUsers = [];
    const idx = json.pendingUsers.findIndex((p) => p.email.toLowerCase() === cleanOld);
    if (idx !== -1) {
      json.pendingUsers[idx].email = cleanNew;
      json.pendingUsers[idx].otp = newOtp;
      json.pendingUsers[idx].otpExpires = newOtpExpires.toISOString();
      json.pendingUsers[idx].updatedAt = new Date().toISOString();
      saveJSONDB(json);
      return json.pendingUsers[idx];
    }
    return null;
  }

  // NOTIFICATION UTILITIES
  static async createNotification(notifData: any): Promise<any> {
    if (dbState.isMongoDB) {
      return await NotificationModel.create(notifData);
    }
    const json = loadJSONDB();
    if (!json.notifications) json.notifications = [];
    const newNotif = {
      _id: crypto.randomUUID(),
      ...notifData,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    json.notifications.push(newNotif);
    saveJSONDB(json);
    return newNotif;
  }

  static async getNotifications(applicantId: string): Promise<any[]> {
    if (dbState.isMongoDB) {
      return await (NotificationModel as any).find({ applicantId, isDismissed: false }).sort({ createdAt: -1 });
    }
    const json = loadJSONDB();
    if (!json.notifications) json.notifications = [];
    return json.notifications
      .filter((n) => n.applicantId === applicantId && !n.isDismissed)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  static async markNotificationRead(id: string): Promise<any> {
    if (dbState.isMongoDB) {
      return await (NotificationModel as any).findByIdAndUpdate(id, { isRead: true }, { new: true });
    }
    const json = loadJSONDB();
    if (!json.notifications) json.notifications = [];
    const idx = json.notifications.findIndex((n) => n._id === id || n.id === id);
    if (idx !== -1) {
      json.notifications[idx].isRead = true;
      saveJSONDB(json);
      return json.notifications[idx];
    }
    return null;
  }

  static async markNotificationDismissed(id: string): Promise<any> {
    if (dbState.isMongoDB) {
      return await (NotificationModel as any).findByIdAndUpdate(id, { isDismissed: true }, { new: true });
    }
    const json = loadJSONDB();
    if (!json.notifications) json.notifications = [];
    const idx = json.notifications.findIndex((n) => n._id === id || n.id === id);
    if (idx !== -1) {
      json.notifications[idx].isDismissed = true;
      saveJSONDB(json);
      return json.notifications[idx];
    }
    return null;
  }

  static async addVisit(ip: string, userAgent?: string): Promise<any> {
    if (dbState.isMongoDB) {
      const newVisit = new Visit({ ip, userAgent });
      return await newVisit.save();
    }
    const json = loadJSONDB();
    if (!json.visits) json.visits = [];
    const newVisit = {
      id: 'vst_' + Math.random().toString(36).substr(2, 9),
      ip,
      userAgent,
      createdAt: new Date().toISOString()
    };
    json.visits.push(newVisit);
    saveJSONDB(json);
    return newVisit;
  }

  static async getVisits(): Promise<any[]> {
    if (dbState.isMongoDB) {
      return await Visit.find().sort({ createdAt: -1 });
    }
    const json = loadJSONDB();
    return json.visits || [];
  }

  // --- CONTACTS / MESSAGE CENTER ---
  static async createContact(payload: any): Promise<any> {
    if (dbState.isMongoDB) {
      const contact = new Contact(payload);
      return await contact.save();
    }
    const json = loadJSONDB();
    if (!json.contacts) json.contacts = [];
    const newContact = {
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      ...payload,
      status: payload.status || 'Unread',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    json.contacts.push(newContact);
    saveJSONDB(json);
    return newContact;
  }

  static async getContacts(): Promise<any[]> {
    if (dbState.isMongoDB) {
      return await Contact.find().sort({ createdAt: -1 });
    }
    const json = loadJSONDB();
    return (json.contacts || []).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async getContactById(id: string): Promise<any | null> {
    if (dbState.isMongoDB) {
      return await Contact.findById(id);
    }
    const json = loadJSONDB();
    if (!json.contacts) json.contacts = [];
    return json.contacts.find((c) => (c._id || c.id) === id) || null;
  }

  static async updateContact(id: string, payload: any): Promise<any | null> {
    if (dbState.isMongoDB) {
      return await Contact.findByIdAndUpdate(id, payload, { new: true });
    }
    const json = loadJSONDB();
    if (!json.contacts) json.contacts = [];
    const idx = json.contacts.findIndex((c) => (c._id || c.id) === id);
    if (idx !== -1) {
      json.contacts[idx] = { ...json.contacts[idx], ...payload, updatedAt: new Date().toISOString() };
      saveJSONDB(json);
      return json.contacts[idx];
    }
    return null;
  }

  static async deleteContact(id: string): Promise<boolean> {
    if (dbState.isMongoDB) {
      const res = await Contact.findByIdAndDelete(id);
      return !!res;
    }
    const json = loadJSONDB();
    if (!json.contacts) json.contacts = [];
    const idx = json.contacts.findIndex((c) => (c._id || c.id) === id);
    if (idx !== -1) {
      json.contacts.splice(idx, 1);
      saveJSONDB(json);
      return true;
    }
    return false;
  }
}
