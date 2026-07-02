/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { createServer as createViteServer } from 'vite';

// Database Config and Repositories
import { connectDB } from './server/config/db';
import { DBService } from './server/services/db.service';
import { MailService } from './server/services/mail.service';

// Modular Route Controllers
import applicantRoutes from './server/routes/applicant.routes';
import receiptRoutes from './server/routes/receipt.routes';
import cvRoutes from './server/routes/cv.routes';
import pictureRoutes from './server/routes/picture.routes';
import passportRoutes from './server/routes/passport.routes';
import applicationRoutes from './server/routes/application.routes';
import { adminAuthMiddleware, generateToken, requirePermission, isEmailAdmin } from './server/middleware/auth.middleware';

const app = express();
const PORT = 3000;

// Ensure uploads folder exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Raise limits for Base64 files payload
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded documents statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper for security password verification
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === checkHash;
}

// Default settings parameters
const defaultSettings = {
  logoUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=100&h=100&fit=crop&q=80',
  faviconUrl: '',
  primaryColor: '#009ca6',
  accentColor: '#0e7a83',
  companyName: 'Hydrocean Robotics',
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
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com'
  },
  companyRegNumber: 'SEC-2026-089765',
  companyCertNumber: 'CERT-65432-PK',
  companyRegUrl: process.env.COMPANY_REGISTRATION_URL || 'https://secp.gov.pk',
  companyLegalName: 'Hydrocean Robotics (Private) Limited',
  companyRegDesc: 'Hydrocean Robotics is officially incorporated and registered under the Companies Act as a technology provider for marine and autonomous subsea exploration systems.'
};

const defaultBankDetails = {
  bankName: '',
  accountTitle: '',
  iban: '',
  accountNumber: '',
  branchCode: '',
  qrCodeUrl: '',
  amount: 0,
  paymentInstructions: ''
};

const defaultOfficeContact = {
  address: 'Hydrocean Corporate HQ, Tech Sector 4, Islamabad, Pakistan',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.56470308!2d119.954!3d31.815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDQ4JzU0LjAiTiAxMTnCsDU3JzE0LjQiRQ!5e0!3m2!1sen!2s!4v1625000000000',
  email: 'wavepilot1@gmail.com',
  phone: '+92 308 5266384',
  whatsApp: '+92 332 5924526',
  workingHours: 'Monday - Friday (09:00 AM - 05:00 PM PST)'
};

const defaultJobs = [
  {
    id: 'job_drone_pilot',
    title: 'Autonomous Drone Pilot (USV & Amphibious)',
    qualification: 'B.Sc / M.Sc in Robotics, Aerospace, or Electrical Engineering',
    salary: 'USD 4,500 - 6,500 / Month',
    country: 'Maldives Operations Office',
    description: 'We are seeking an experienced Drone Pilot to operate, test, and maintain our advanced Autonomous Amphibious Vehicles and Unmanned Surface Vehicles (USV) in active ocean testing programs.',
    responsibilities: [
      'Conduct pre-flight, in-flight, and post-flight inspections of amphibious drones and USVs.',
      'Coordinate with field engineers to test autopilot systems and manual override switches.',
      'Maintain precise logs of drone telemetry, ocean state variables, and vehicle anomalies.'
    ],
    requirements: [
      'Commercial Drone Pilot License or equivalent maritime vehicle operation license.',
      'Strong knowledge of ArduPilot, PX4, or proprietary autonomous navigation suites.',
      'Willingness to travel and work on remote marine vessels.'
    ],
    isOpen: true,
    isHidden: false,
  },
  {
    id: 'job_research_eng',
    title: 'Research & Development Engineer (UUV Acoustics)',
    qualification: 'M.Sc / Ph.D in Acoustics, Marine Engineering, or Robotics',
    salary: 'USD 6,000 - 8,500 / Month',
    country: 'Main Research Center, Changzhou',
    description: 'Join our premium underwater robotics lab to build next-generation Unmanned Underwater Vehicles (UUV) specialized in acoustics mapping and deep-sea exploration.',
    responsibilities: [
      'Design, simulate, and integrate hydrophone arrays and marine sonar systems.',
      'Develop real-time DSP filters for underwater noise reduction and collision avoidance.',
      'Lead laboratory and deep-water acoustic trials.'
    ],
    requirements: [
      'Expertise in digital signal processing (DSP) and sonar theory.',
      'Fluency in C/C++ and MATLAB/Python simulations.',
      'Experience with ROS (Robot Operating System) and Linux-based marine computers.'
    ],
    isOpen: true,
    isHidden: false,
  },
  {
    id: 'job_software_eng',
    title: 'Senior Robotics Software Engineer (Autonomy & ROS)',
    qualification: 'B.Sc / M.Sc in Computer Science, Robotics, or Computer Engineering',
    salary: 'USD 5,500 - 7,500 / Month',
    country: 'Islamabad Corporate HQ',
    description: 'We are seeking a Senior Robotics Software Engineer to design, implement, and optimize the navigation, control, and autonomy algorithms running on our maritime surface and underwater drone fleets.',
    responsibilities: [
      'Develop and maintain robust state estimation, path planning, and obstacle avoidance algorithms in ROS/ROS2.',
      'Implement robust communication protocols (Mavlink, UDP, WebSockets) between maritime drones and the cloud-based control center.',
      'Deploy and profile autonomy algorithms on embedded computing platforms like NVIDIA Jetson and Raspberry Pi.'
    ],
    requirements: [
      '3+ years of professional experience developing software for autonomous robots or unmanned vehicles.',
      'Proficiency in C++ and Python with a deep understanding of ROS/ROS2 and Linux operating systems.',
      'Experience with maritime navigation algorithms, Kalman filters, and sensor fusion (GPS, IMU, Sonar).'
    ],
    isOpen: true,
    isHidden: false,
  }
];

// ================== MOUNT MODULAR ENDPOINTS ==================
app.use('/api/applicants', applicantRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/pictures', pictureRoutes);
app.use('/api/passports', passportRoutes);
app.use('/api/applications', applicationRoutes);

// ================== TRAFFIC VISITOR TRACKING ENDPOINT ==================
app.post('/api/track-visit', async (req, res) => {
  try {
    const rawIp = req.headers['x-forwarded-for'] as string || req.ip || '127.0.0.1';
    // Clean IP if it has multiple entries (proxies)
    const ip = rawIp.split(',')[0].trim();
    const userAgent = req.headers['user-agent'] || '';
    await DBService.addVisit(ip, userAgent);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ================== CANDIDATE NOTIFICATIONS ENDPOINTS ==================
app.get('/api/notifications', async (req, res) => {
  const applicantId = req.headers['x-applicant-email'] as string || req.query.applicantId as string;
  if (!applicantId) {
    return res.status(400).json({ error: 'Missing applicantId identifier' });
  }
  try {
    const list = await DBService.getNotifications(applicantId);
    return res.json({ success: true, notifications: list });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await DBService.markNotificationRead(id);
    return res.json({ success: true, notification: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/:id/dismiss', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await DBService.markNotificationDismissed(id);
    return res.json({ success: true, notification: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ================== INTEGRATE COMPATIBLE ENDPOINTS ==================

// 1. Admin Authentication Login
app.post('/api/admin/login', async (req, res) => {
  const { username, email, password } = req.body;
  const identifier = username || email;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Email/Username and password are required.' });
  }

  try {
    const bundle = await DBService.getSettingsBundle();
    const adminEmail = bundle.adminEmail || 'wavepilot1@gmail.com';
    
    // Check if the input exactly matches the authorized adminEmail in the database
    if (identifier.toLowerCase() !== adminEmail.toLowerCase()) {
      await DBService.addLog(`Unauthorized admin login block for email: ${identifier}`, req.ip || '127.0.0.1');
      return res.status(403).json({ error: 'Access Denied. You are not authorized to access the Admin Panel.' });
    }

    if (verifyPassword(password, bundle.adminHash)) {
      const token = generateToken({ user: 'admin', email: adminEmail, role: 'administrator' });
      await DBService.addLog('Admin successfully logged in', req.ip || '127.0.0.1');
      return res.json({ success: true, token, username: 'admin', email: adminEmail });
    }
    await DBService.addLog(`Failed login attempt for identifier: ${identifier}`, req.ip || '127.0.0.1');
    return res.status(401).json({ error: 'Invalid administrative credentials.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Authentication service issue: ' + err.message });
  }
});

// Update password
app.put('/api/admin/settings/password', adminAuthMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required.' });
  }

  try {
    const bundle = await DBService.getSettingsBundle();
    if (!verifyPassword(currentPassword, bundle.adminHash)) {
      return res.status(400).json({ error: 'Current password does not match.' });
    }

    const newHash = hashPassword(newPassword);
    await DBService.saveSettingsBundle({ adminHash: newHash });
    await DBService.addLog('Admin password updated successfully', req.ip || '127.0.0.1');
    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update administrative password: ' + err.message });
  }
});

// 2. Settings retrieve & update
app.get('/api/settings', async (req, res) => {
  try {
    const { settings, bankDetails, officeContact } = await DBService.getSettingsBundle();
    return res.json({ settings, bankDetails, officeContact });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve website settings: ' + err.message });
  }
});

// Gallery endpoints
app.get('/api/gallery', async (req, res) => {
  try {
    const list = await DBService.getGallery();
    return res.json({ gallery: list });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve gallery: ' + err.message });
  }
});

app.post('/api/admin/gallery', adminAuthMiddleware, async (req, res) => {
  const { base64Image } = req.body;
  if (!base64Image) {
    return res.status(400).json({ error: 'base64Image is required' });
  }
  try {
    const { UploadService } = await import('./server/services/upload.service');
    let imageUrl = base64Image;
    if (base64Image.startsWith('data:')) {
      imageUrl = await UploadService.saveBase64File(base64Image, 'gallery', ['png', 'jpg', 'jpeg', 'webp', 'gif'], 10 * 1024 * 1024);
    }
    const currentList = await DBService.getGallery();
    if (!currentList.includes(imageUrl)) {
      currentList.push(imageUrl);
      await DBService.saveGallery(currentList);
      await DBService.addLog('Gallery image added by administrator', req.ip || '127.0.0.1');
    }
    return res.json({ success: true, imageUrl });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to upload gallery image: ' + err.message });
  }
});

app.delete('/api/admin/gallery', adminAuthMiddleware, async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl is required' });
  }
  try {
    const currentList = await DBService.getGallery();
    const updatedList = currentList.filter(item => item !== imageUrl);
    await DBService.saveGallery(updatedList);
    await DBService.addLog('Gallery image removed by administrator', req.ip || '127.0.0.1');
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to remove gallery image: ' + err.message });
  }
});

app.put('/api/admin/settings', adminAuthMiddleware, async (req, res) => {
  const admin = (req as any).admin;
  if (admin && admin.role === 'sub_admin') {
    return res.status(403).json({ error: 'Access Denied. Sub-admins are not authorized to access or modify website settings.' });
  }

  const { settings, bankDetails, officeContact } = req.body;
  try {
    await DBService.saveSettingsBundle({ settings, bankDetails, officeContact });
    const updated = await DBService.getSettingsBundle();
    await DBService.addLog('Website settings updated by administrator', req.ip || '127.0.0.1');
    return res.json({
      success: true,
      settings: updated.settings,
      bankDetails: updated.bankDetails,
      officeContact: updated.officeContact,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to preserve settings: ' + err.message });
  }
});

// 3. Vacancies Candidate & Admin endpoint definitions
app.get('/api/jobs', async (req, res) => {
  try {
    const list = await DBService.getJobs(false);
    return res.json({ jobs: list });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load open positions.' });
  }
});

app.get('/api/admin/jobs', adminAuthMiddleware, async (req, res) => {
  try {
    const list = await DBService.getJobs(true);
    return res.json({ jobs: list });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve positions list.' });
  }
});

app.post('/api/admin/jobs', [adminAuthMiddleware, requirePermission('Manage Jobs')], async (req, res) => {
  const { title, qualification, salary, country, description, responsibilities, requirements } = req.body;
  if (!title || !qualification || !salary || !country || !description) {
    return res.status(400).json({ error: 'Missing required vacancy fields.' });
  }

  const newJob = {
    id: `job_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    title,
    qualification,
    salary,
    country,
    description,
    responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
    requirements: Array.isArray(requirements) ? requirements : [],
    isOpen: true,
    isHidden: false,
  };

  try {
    await DBService.saveJob(newJob);
    await DBService.addLog(`Created new vacancy: ${title}`, req.ip || '127.0.0.1');
    return res.json({ success: true, job: newJob });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create position: ' + err.message });
  }
});

app.put('/api/admin/jobs/:id', [adminAuthMiddleware, requirePermission('Manage Jobs')], async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await DBService.getJobById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Vacancy profile not found.' });
    }
    const updated = { ...existing, ...req.body };
    await DBService.saveJob(updated);
    await DBService.addLog(`Updated vacancy: ${updated.title}`, req.ip || '127.0.0.1');
    return res.json({ success: true, job: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Update failed: ' + err.message });
  }
});

app.delete('/api/admin/jobs/:id', [adminAuthMiddleware, requirePermission('Manage Jobs')], async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await DBService.getJobById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Vacancy profile not found.' });
    }
    await DBService.deleteJob(id);
    await DBService.addLog(`Deleted vacancy: ${existing.title}`, req.ip || '127.0.0.1');
    return res.json({ success: true, message: 'Vacancy deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to remove vacancy profile: ' + err.message });
  }
});

// 4. Compatible fallback endpoint for classic multi-part submit
app.post('/api/applications', async (req, res) => {
  const {
    jobId,
    fullName,
    fatherName,
    email,
    whatsAppNumber,
    cnic,
    city,
    province,
    skills,
    experience,
    passportAvailable,
    passportFile,
    candidatePicture,
    cv,
    paymentSlip,
  } = req.body;

  if (!jobId || !fullName || !fatherName || !email || !whatsAppNumber || !skills || !experience || !city || !province) {
    return res.status(400).json({ error: 'Missing required text fields.' });
  }

  let finalCvUrl = cv || '';
  let finalPictureUrl = candidatePicture || '';
  let finalPaymentSlipUrl = paymentSlip || '';
  let finalPassportFileUrl = passportFile || undefined;

  try {
    const { UploadService } = await import('./server/services/upload.service');
    
    if (cv && cv.startsWith('data:')) {
      finalCvUrl = await UploadService.saveBase64File(cv, 'cv', ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'webp'], 10 * 1024 * 1024);
    }
    if (candidatePicture && candidatePicture.startsWith('data:')) {
      finalPictureUrl = await UploadService.saveBase64File(candidatePicture, 'picture', ['png', 'jpg', 'jpeg', 'webp'], 10 * 1024 * 1024);
    }
    if (paymentSlip && paymentSlip.startsWith('data:')) {
      finalPaymentSlipUrl = await UploadService.saveBase64File(paymentSlip, 'receipt', ['png', 'jpg', 'jpeg', 'webp', 'pdf'], 10 * 1024 * 1024);
    }
    if (passportFile && passportFile.startsWith('data:')) {
      finalPassportFileUrl = await UploadService.saveBase64File(passportFile, 'passport', ['pdf', 'png', 'jpg', 'jpeg', 'webp'], 10 * 1024 * 1024);
    }
  } catch (uploadErr: any) {
    return res.status(400).json({ error: 'Document upload to Cloudinary failed: ' + uploadErr.message });
  }

  try {
    // Dynamically query job title
    const job = await DBService.getJobById(jobId);
    if (!job) {
      return res.status(400).json({ error: 'Hiring position does not exist.' });
    }

    const { bankDetails } = await DBService.getSettingsBundle();

    const payload = {
      applicant: {
        fullName,
        fatherName,
        whatsAppNumber,
        skills,
        experience,
        passportAvailable,
        passportFileUrl: finalPassportFileUrl,
      },
      payment: {
        paymentStatus: 'Pending Verification' as const,
        paymentMethod: 'Meezan Bank',
        amount: bankDetails.amount || 3000,
        receiptFileUrl: finalPaymentSlipUrl,
      },
      documents: {
        cvUrl: finalCvUrl,
        pictureUrl: finalPictureUrl,
        passportUrl: finalPassportFileUrl,
        receiptUrl: finalPaymentSlipUrl,
      },
      application: {
        jobId,
        jobTitle: job.title,
        city,
        province,
        email,
      },
    };

    const appId = await DBService.createRecruitmentApplication(payload);
    await DBService.addLog(`Fallback registered application for ${fullName}`, req.ip || '127.0.0.1');

    return res.json({
      success: true,
      applicationId: appId,
      message: 'Application submitted successfully! Our administrative team will verify your Meezan Bank deposit slip.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Fallback submit failed: ' + err.message });
  }
});

// 5. Classic Compatibility retrieve route for admin list
app.get('/api/admin/applications', [adminAuthMiddleware, requirePermission('View Applications')], async (req, res) => {
  const { search, status, jobId, city } = req.query;
  try {
    const list = await DBService.getApplications({
      search: search as string,
      status: status as string,
      jobId: jobId as string,
      city: city as string,
    });
    return res.json({ applications: list });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve applications.' });
  }
});

// Classic Status Endpoint compat
app.put('/api/admin/applications/:id/status', adminAuthMiddleware, async (req, res, next) => {
  const { status } = req.body;
  const isReject = status === 'Rejected';
  const requiredPerm = isReject ? 'Reject Applications' : 'Approve Applications';
  return requirePermission(requiredPerm)(req, res, next);
}, async (req, res) => {
  try {
    const { ApplicationController } = await import('./server/controllers/application.controller');
    await ApplicationController.updateStatus(req, res);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/applications/:id', adminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const ok = await DBService.deleteApplication(id);
    if (!ok) return res.status(404).json({ error: 'Application not found' });
    return res.json({ success: true, message: 'Application deleted.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ================== CONTACT FORM & MESSAGE CENTER ==================
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    const contact = await DBService.createContact({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'Unread'
    });
    return res.json({ success: true, message: 'Your message has been sent successfully.', contact });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to submit contact message: ' + err.message });
  }
});

app.get('/api/admin/contacts', adminAuthMiddleware, async (req, res) => {
  try {
    const contacts = await DBService.getContacts();
    return res.json({ success: true, contacts });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve contact messages: ' + err.message });
  }
});

app.put('/api/admin/contacts/:id', adminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status, replyMessage } = req.body;
  try {
    const updated = await DBService.updateContact(id, { status, replyMessage });
    if (!updated) {
      return res.status(404).json({ error: 'Contact message not found.' });
    }
    return res.json({ success: true, contact: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update contact message: ' + err.message });
  }
});

app.delete('/api/admin/contacts/:id', adminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const success = await DBService.deleteContact(id);
    if (!success) {
      return res.status(404).json({ error: 'Contact message not found.' });
    }
    await DBService.addLog(`Deleted contact message ${id}`, req.ip || '127.0.0.1');
    return res.json({ success: true, message: 'Contact message deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete contact message: ' + err.message });
  }
});

app.post('/api/admin/contacts/:id/reply', adminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  const { replyMessage } = req.body;
  if (!replyMessage) {
    return res.status(400).json({ error: 'Reply message body is required.' });
  }
  try {
    const contact = await DBService.getContactById(id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found.' });
    }
    
    const subject = `Re: [HYDROCEAN] ${contact.subject}`;
    const htmlBody = `
      <div style="font-family: sans-serif; padding: 30px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #009ca6; font-size: 24px; margin: 0;">HYDROCEAN</h1>
          <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">Robotics & Vehicles</p>
        </div>
        
        <h2 style="color: #f1f5f9; font-size: 18px; margin-top: 0;">Response to Your Inquiry</h2>
        
        <p style="font-size: 14px; color: #cbd5e1;">Dear ${contact.name},</p>
        
        <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
          ${replyMessage.replace(/\n/g, '<br/>')}
        </p>
        
        <div style="background-color: #1e293b; border-left: 4px solid #009ca6; padding: 15px; border-radius: 8px; margin: 25px 0;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8; font-style: italic;">
            <strong>Original Inquiry:</strong><br/>
            "${contact.message}"
          </p>
        </div>
        
        <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
          If you have any further questions, please do not hesitate to reach out to us.
        </p>
        
        <div style="margin-top: 35px; font-size: 11px; color: #64748b; border-top: 1px solid #334155; padding-top: 20px;">
          This is an administrative email. You can reply directly to contact@hydrocean.com if needed.
        </div>
      </div>
    `.trim();
    
    await MailService.sendEmail({
      to: contact.email,
      subject,
      html: htmlBody,
      text: replyMessage
    });
    
    const updated = await DBService.updateContact(id, {
      status: 'Replied',
      replyMessage,
      repliedAt: new Date()
    });
    
    await DBService.addLog(`Replied to contact message from ${contact.email}`, req.ip || '127.0.0.1');
    
    return res.json({ success: true, message: 'Reply sent successfully.', contact: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reply to contact message: ' + err.message });
  }
});

app.delete('/api/admin/contacts/:id', adminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const success = await DBService.deleteContact(id);
    if (!success) {
      return res.status(404).json({ error: 'Contact message not found.' });
    }
    await DBService.addLog(`Deleted a contact message (${id})`, req.ip || '127.0.0.1');
    return res.json({ success: true, message: 'Contact message deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete contact message: ' + err.message });
  }
});

// 7. Stats & system telemetry logs
app.get('/api/admin/stats', adminAuthMiddleware, async (req, res) => {
  try {
    const applications = await DBService.getApplications({});
    const totalApplications = applications.length;
    const pendingApplications = applications.filter((a) => a.status === 'Pending Verification').length;
    const rejectedApplications = applications.filter((a) => a.status === 'Rejected').length;
    const approvedApplications = applications.filter((a) => ['Verified', 'Shortlisted', 'Interview', 'Selected'].includes(a.status)).length;
    const verifiedPayments = applications.filter((a) => a.status !== 'Pending Verification' && a.status !== 'Rejected').length;
    
    const jobsList = await DBService.getJobs(true);
    const totalJobs = jobsList.length;
    const activeJobs = jobsList.filter((j) => j.isOpen && !j.isHidden && !j.isArchived).length;
    const closedJobs = jobsList.filter((j) => !j.isOpen && !j.isArchived).length;

    const users = await DBService.getUsers();
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => !u.isBlocked).length;
    const totalAdmins = users.filter((u) => u.role === 'admin').length;
    const totalSubAdmins = users.filter((u) => u.role === 'sub_admin').length;

    const contactsList = await DBService.getContacts();
    const unreadMessages = contactsList.filter((c) => c.status === 'Unread').length;

    const payments = await DBService.getPayments();
    const totalPayments = payments.length;
    const completedPayments = payments.filter((p) => p.paymentStatus === 'Paid').length;
    const rejectedPayments = payments.filter((p) => p.paymentStatus === 'Rejected').length;
    const pendingPayments = payments.filter((p) => p.paymentStatus === 'Pending Verification' || p.paymentStatus === 'Unpaid').length;

    // Traffic tracking metrics
    const visits = await DBService.getVisits();
    const totalWebsiteVisits = visits.length;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const usersToday = users.filter((u) => u.createdAt && new Date(u.createdAt) >= startOfToday).length;

    const visitorsToday = visits.filter(v => new Date(v.createdAt) >= startOfToday).length;
    const visitorsThisWeek = visits.filter(v => new Date(v.createdAt) >= sevenDaysAgo).length;
    const visitorsThisMonth = visits.filter(v => new Date(v.createdAt) >= thirtyDaysAgo).length;

    // Returning vs New Visitors calculation
    const ipCounts: Record<string, number> = {};
    visits.forEach(v => {
      ipCounts[v.ip] = (ipCounts[v.ip] || 0) + 1;
    });
    let newVisitors = 0;
    let returningVisitors = 0;
    Object.values(ipCounts).forEach(count => {
      if (count > 1) {
        returningVisitors++;
      } else {
        newVisitors++;
      }
    });

    const logs = await DBService.getLogs();
    const totalEmailsSent = logs.filter(l => l.action && (l.action.toLowerCase().includes('email') || l.action.toLowerCase().includes('mail'))).length;

    const statusBreakdown: Record<string, number> = {
      'Pending Verification': 0,
      'Verified': 0,
      'Rejected': 0,
      'Shortlisted': 0,
      'Interview': 0,
      'Selected': 0,
    };

    applications.forEach((a) => {
      if (statusBreakdown[a.status] !== undefined) {
        statusBreakdown[a.status]++;
      }
    });

    // Chart Datasets
    // 1. Daily Visitor Activity (last 7 days)
    const dailyVisitorActivity: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateString = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      const dayVisits = visits.filter(v => {
        const vDate = new Date(v.createdAt);
        return vDate >= startOfDay && vDate < endOfDay;
      });
      dailyVisitorActivity.push({
        name: dateString,
        visitors: dayVisits.length,
      });
    }

    // 2. Application submissions traffic
    const dailyAppTraffic: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateString = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

      const submitted = applications.filter(a => {
        const aDate = new Date(a.createdAt || a.updatedAt);
        return aDate >= startOfDay && aDate < endOfDay;
      }).length;

      const started = users.filter(u => {
        const uDate = new Date(u.createdAt);
        return uDate >= startOfDay && uDate < endOfDay;
      }).length + submitted;

      dailyAppTraffic.push({
        name: dateString,
        started,
        submitted,
      });
    }

    // 3. Payment Breakdown Dataset
    const paymentBreakdown = [
      { name: 'Completed Payments', value: completedPayments },
      { name: 'Pending Payments', value: pendingPayments },
      { name: 'Rejected Payments', value: rejectedPayments },
    ];

    const returningVsNew = [
      { name: 'New Visitors', value: newVisitors },
      { name: 'Returning Visitors', value: returningVisitors },
    ];

    return res.json({
      stats: {
        totalApplications,
        pendingApplications,
        rejectedApplications,
        approvedApplications,
        verifiedPayments,
        totalJobs,
        activeJobs,
        closedJobs,
        totalUsers,
        activeUsers,
        totalAdmins,
        totalSubAdmins,
        totalPayments,
        completedPayments,
        rejectedPayments,
        pendingPayments,
        totalWebsiteVisits,
        visitorsToday,
        visitorsThisWeek,
        visitorsThisMonth,
        returningVisitors,
        newVisitors,
        totalEmailsSent,
        unreadMessages,
        usersToday,
        recentApplications: applications.slice(0, 5),
        statusBreakdown,
        logs: logs.slice(0, 30),
        charts: {
          dailyVisitorActivity,
          dailyAppTraffic,
          paymentBreakdown,
          returningVsNew,
        }
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to compile stats: ' + err.message });
  }
});

// 8. Manage system users
app.get('/api/admin/users', adminAuthMiddleware, async (req, res) => {
  const admin = (req as any).admin;
  if (admin && admin.role === 'sub_admin') {
    return res.status(403).json({ error: 'Access Denied. Sub-admins are not authorized to manage user accounts.' });
  }

  try {
    const users = await DBService.getUsers();
    const applications = await DBService.getApplications({});
    const safeUsers = users.map((u: any) => {
      const email = u.email ? u.email.toLowerCase().trim() : '';
      const userApps = applications.filter((a) => a.applicantEmail && a.applicantEmail.toLowerCase().trim() === email);
      // Retrieve the contact number from first application if present
      const phone = userApps.length > 0 ? (userApps[0].whatsAppNumber || userApps[0].phone || '') : '';
      return {
        id: u._id || u.id,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        permissions: u.permissions || [],
        isBlocked: u.isBlocked || false,
        isDeleted: u.isDeleted || false,
        createdAt: u.createdAt,
        totalApplications: userApps.length,
        phone,
      };
    });
    return res.json({ success: true, users: safeUsers });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch users: ' + err.message });
  }
});

// Update user role & sub-admin permissions
app.put('/api/admin/users/:id/role', adminAuthMiddleware, async (req, res) => {
  const admin = (req as any).admin;
  if (admin && admin.role === 'sub_admin') {
    return res.status(403).json({ error: 'Access Denied. Sub-admins are not authorized to manage user accounts.' });
  }

  const { id } = req.params;
  const { role, permissions } = req.body;
  try {
    const targetUser = await DBService.getUserById(id);
    if (targetUser && isEmailAdmin(targetUser.email)) {
      return res.status(403).json({ error: 'Access Denied. Main Admin accounts cannot be modified.' });
    }

    const isSenderMainAdmin = admin && isEmailAdmin(admin.email);
    if (role === 'admin' && !isSenderMainAdmin) {
      return res.status(403).json({ error: 'Access Denied. Only a Main Admin can promote users to Admin.' });
    }

    const updated = await DBService.updateUser(id, { role, permissions });
    if (!updated) return res.status(404).json({ error: 'User account not found.' });
    await DBService.addLog(`Updated role and permissions for user: ${updated.fullName} (${role})`, req.ip || '127.0.0.1');
    return res.json({ success: true, message: 'User role and sub-admin permissions updated successfully.', user: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update user role: ' + err.message });
  }
});

// Update user profile details
app.put('/api/admin/users/:id', adminAuthMiddleware, async (req, res) => {
  const admin = (req as any).admin;
  if (admin && admin.role === 'sub_admin' && admin.id !== req.params.id) {
    return res.status(403).json({ error: 'Access Denied. Sub-admins are not authorized to manage other user accounts.' });
  }

  const { id } = req.params;
  const { fullName, email, phone } = req.body;
  try {
    const updated = await DBService.updateUser(id, { fullName, email, phone });
    if (!updated) return res.status(404).json({ error: 'User not found.' });
    await DBService.addLog(`Updated profile details for user: ${fullName}`, req.ip || '127.0.0.1');
    return res.json({ success: true, message: 'User profile updated successfully.', user: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update user profile: ' + err.message });
  }
});

// Block a user account
app.put('/api/admin/users/:id/block', adminAuthMiddleware, async (req, res) => {
  const admin = (req as any).admin;
  if (admin && admin.role === 'sub_admin') {
    return res.status(403).json({ error: 'Access Denied. Sub-admins are not authorized to manage user accounts.' });
  }

  const { id } = req.params;
  try {
    const targetUser = await DBService.getUserById(id);
    if (targetUser && isEmailAdmin(targetUser.email)) {
      return res.status(403).json({ error: 'Access Denied. Main Admin accounts cannot be blocked.' });
    }

    await DBService.updateUser(id, { isBlocked: true });
    await DBService.addLog(`Blocked user account: ${id}`, req.ip || '127.0.0.1');
    return res.json({ success: true, message: 'User account has been successfully blocked.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to block user: ' + err.message });
  }
});

// Unblock a user account
app.put('/api/admin/users/:id/unblock', adminAuthMiddleware, async (req, res) => {
  const admin = (req as any).admin;
  if (admin && admin.role === 'sub_admin') {
    return res.status(403).json({ error: 'Access Denied. Sub-admins are not authorized to manage user accounts.' });
  }

  const { id } = req.params;
  try {
    const targetUser = await DBService.getUserById(id);
    if (targetUser && isEmailAdmin(targetUser.email)) {
      return res.status(403).json({ error: 'Access Denied. Main Admin accounts cannot be unblocked.' });
    }

    await DBService.updateUser(id, { isBlocked: false });
    await DBService.addLog(`Unblocked user account: ${id}`, req.ip || '127.0.0.1');
    return res.json({ success: true, message: 'User account has been successfully unblocked.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to unblock user: ' + err.message });
  }
});

// Restore a soft-deleted user account
app.put('/api/admin/users/:id/restore', adminAuthMiddleware, async (req, res) => {
  const admin = (req as any).admin;
  if (admin && admin.role === 'sub_admin') {
    return res.status(403).json({ error: 'Access Denied. Sub-admins are not authorized to manage user accounts.' });
  }

  const { id } = req.params;
  try {
    const targetUser = await DBService.getUserById(id);
    if (targetUser && isEmailAdmin(targetUser.email)) {
      return res.status(403).json({ error: 'Access Denied. Main Admin accounts cannot be restored.' });
    }

    const ok = await DBService.restoreUser(id);
    if (!ok) return res.status(404).json({ error: 'User account not found.' });
    await DBService.addLog(`Restored user account: ${id}`, req.ip || '127.0.0.1');
    return res.json({ success: true, message: 'User account has been restored successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to restore user: ' + err.message });
  }
});

// Delete a user account (Soft-delete)
app.delete('/api/admin/users/:id', adminAuthMiddleware, async (req, res) => {
  const admin = (req as any).admin;
  if (admin && admin.role === 'sub_admin') {
    return res.status(403).json({ error: 'Access Denied. Sub-admins are not authorized to manage user accounts.' });
  }

  const { id } = req.params;
  try {
    const targetUser = await DBService.getUserById(id);
    if (targetUser && isEmailAdmin(targetUser.email)) {
      return res.status(403).json({ error: 'Access Denied. Main Admin accounts cannot be deleted.' });
    }

    const ok = await DBService.deleteUser(id);
    if (!ok) return res.status(404).json({ error: 'User account not found.' });
    await DBService.addLog(`Soft-deleted user account: ${id}`, req.ip || '127.0.0.1');
    return res.json({ success: true, message: 'User account has been soft-deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete user: ' + err.message });
  }
});

// Send custom email to a user / bulk recipients
app.post('/api/admin/users/send-email', [adminAuthMiddleware, requirePermission('Send Emails')], async (req, res) => {
  const email = req.body.email || req.body.to;
  const { subject, message } = req.body;
  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Recipient email(s), subject, and message content are required.' });
  }

  const admin = (req as any).admin;
  const isBulk = email === 'all' || Array.isArray(email) || (typeof email === 'string' && email.includes(',')) || (typeof email === 'string' && email.toLowerCase() === 'all');
  if (isBulk && admin && admin.role === 'sub_admin') {
    return res.status(403).json({ error: 'Access Denied. Sub-admins are not authorized to send bulk emails.' });
  }

  try {
    const { MailService } = await import('./server/services/mail.service');
    let recipients: string[] = [];

    if (email === 'all' || (typeof email === 'string' && email.toLowerCase() === 'all')) {
      const allUsers = await DBService.getUsers();
      recipients = allUsers.filter((u: any) => u.email && !u.isDeleted && !u.isBlocked).map((u: any) => u.email.trim());
    } else if (Array.isArray(email)) {
      recipients = email.map(e => String(e).trim());
    } else if (typeof email === 'string' && email.includes(',')) {
      recipients = email.split(',').map(e => e.trim());
    } else {
      recipients = [String(email).trim()];
    }

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'No valid recipient email addresses found.' });
    }

    // Send emails sequentially or concurrently
    for (const recipient of recipients) {
      await MailService.sendEmail({
        to: recipient,
        subject: subject,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d9488; border-bottom: 1px solid #334155; padding-bottom: 10px; margin-top: 0;">HYDROCEAN Admissions</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-line;">${message}</p>
            <div style="margin-top: 25px; font-size: 11px; color: #64748b; border-top: 1px solid #334155; padding-top: 15px;">
              This is an administrative message sent from the HYDROCEAN Admissions Maldives Recruitment Portal. Please do not reply directly to this email.
            </div>
          </div>
        `
      });
      await DBService.addLog(`Sent administrative email to ${recipient}`, req.ip || '127.0.0.1');
    }

    return res.json({ success: true, message: `Email dispatched successfully to ${recipients.length} recipient(s).` });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to dispatch email: ' + err.message });
  }
});

// ================== VITE MIDDLEWARE / PRODUCTION SERVING ==================

// Dynamic seeding function supporting both startup and post-boot connections
async function performDatabaseSeeding() {
  try {
    const bundle = await DBService.getSettingsBundle();
    if (!bundle.adminHash || bundle.adminEmail === 'admin@example.com') {
      console.log('[DATABASE] First-time database seeding or admin migration initiated...');
      await DBService.saveSettingsBundle({
        adminEmail: 'wavepilot1@gmail.com',
        adminHash: hashPassword('Admin@123'),
        settings: defaultSettings,
        bankDetails: defaultBankDetails,
        officeContact: defaultOfficeContact,
      });

      const existingJobs = await DBService.getJobs(true);
      if (existingJobs.length === 0) {
        for (const job of defaultJobs) {
          await DBService.saveJob(job);
        }
      }
      console.log('[DATABASE] Seed data deployed successfully.');
    }
  } catch (err: any) {
    console.error('[DATABASE] Database seeding failed:', err.message);
  }
}

async function startServer() {
  // Connect database
  await connectDB();

  // Perform initial seeding check (seeds JSON DB if offline, or MongoDB if online)
  await performDatabaseSeeding();

  // Listen for post-boot MongoDB connection to automatically trigger MongoDB seeding
  mongoose.connection.once('connected', () => {
    console.log('[DATABASE] MongoDB connection established post-boot. Scheduling seeding check...');
    setTimeout(async () => {
      await performDatabaseSeeding();
    }, 1500);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HYDROCEAN BACKEND] Server running successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer();
