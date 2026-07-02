/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Users, Briefcase, CreditCard, ShieldCheck, Search, Filter, Eye, Trash2, Edit2, Plus, LogOut, FileSpreadsheet, FileDown, Lock, Landmark, Image, MapPin, History, RefreshCcw, Save, ToggleLeft, ToggleRight, X, Check, Calendar, CheckCircle2, Copy, Archive, Mail, Send
} from 'lucide-react';
import { apiFetch, removeAuthToken } from '../lib/api';
import { Job, Application, WebsiteSettings, BankDetails, OfficeContact } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
  settings: WebsiteSettings;
  bankDetails: BankDetails;
  officeContact: OfficeContact;
  onRefreshSettings: () => void;
}

export default function AdminPanel({ onLogout, settings, bankDetails, officeContact, onRefreshSettings }: AdminPanelProps) {
  // Tabs: 'dashboard', 'applications', 'vacancies', 'gallery', 'settings', 'logs', 'users', 'emails', 'contacts'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applications' | 'vacancies' | 'gallery' | 'settings' | 'logs' | 'users' | 'emails' | 'contacts'>('dashboard');

  // Stats / Dashboard
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Users State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');

  // Currently logged-in profile & permissions
  const [currentUser, setCurrentUser] = useState<any>(null);

  // User Profile Edit & Detailed View Modal States
  const [selectedManageUser, setSelectedManageUser] = useState<any | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'applicant',
    permissions: [] as string[]
  });
  const [userFormSaving, setUserFormSaving] = useState(false);
  const [userModalTab, setUserModalTab] = useState<'profile' | 'permissions'>('profile');

  // User Emailing Modal State
  const [emailModalUser, setEmailModalUser] = useState<any | null>(null);
  const [emailSubjectInput, setEmailSubjectInput] = useState('');
  const [emailMessageInput, setEmailMessageInput] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // Email Management System state
  const [emailRecipientMode, setEmailRecipientMode] = useState<'single' | 'multiple' | 'all'>('single');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState('custom');
  const [emailComposerSubject, setEmailComposerSubject] = useState('');
  const [emailComposerBody, setEmailComposerBody] = useState('');
  const [emailLogFilter, setEmailLogFilter] = useState<'success' | 'failure'>('success');

  // Contact Messages State
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [contactStatusFilter, setContactStatusFilter] = useState('');
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const applyEmailTemplate = (templateId: string) => {
    if (templateId === 'custom') {
      setEmailComposerSubject('');
      setEmailComposerBody('');
    } else if (templateId === 'welcome') {
      setEmailComposerSubject('Welcome to Hydrocean Marine Systems! 👋');
      setEmailComposerBody(`
<div style="font-family: sans-serif; padding: 30px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 25px;">
    <h1 style="color: #0d9488; font-size: 24px; margin: 0;">HYDROCEAN</h1>
    <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">Admissions & Recruitment Portal</p>
  </div>
  
  <h2 style="color: #f1f5f9; font-size: 18px; margin-top: 0;">Welcome aboard!</h2>
  
  <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
    We are thrilled to confirm that your email address has been successfully verified! You can now access your recruitment dashboard to submit files, review status changes, and manage your credentials seamlessly.
  </p>

  <div style="background-color: #1e293b; border-left: 4px solid #0d9488; padding: 15px; border-radius: 8px; margin: 25px 0;">
    <p style="margin: 0; font-size: 13px; color: #94a3b8; font-family: monospace;">
      <strong>Portal Access Link:</strong><br/>
      https://hydrocean-portal.cn/login
    </p>
  </div>

  <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
    Thank you for choosing Hydrocean Robotics as your professional destination.
  </p>

  <div style="margin-top: 35px; font-size: 11px; color: #64748b; border-top: 1px solid #334155; padding-top: 20px;">
    This is an administrative email. Please do not reply directly to this notification.
  </div>
</div>
      `.trim());
    } else if (templateId === 'payment_approved') {
      setEmailComposerSubject('Payment Slip Verification Successful ✅');
      setEmailComposerBody(`
<div style="font-family: sans-serif; padding: 30px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 25px;">
    <h1 style="color: #0d9488; font-size: 24px; margin: 0;">HYDROCEAN</h1>
    <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">Admissions & Recruitment Portal</p>
  </div>
  
  <h2 style="color: #34d399; font-size: 18px; margin-top: 0;">Deposit Verified Successfully</h2>
  
  <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
    We are pleased to inform you that our administrative finance team has successfully verified your bank deposit slip.
  </p>

  <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
    Your recruitment application is now marked as <strong>"Verified"</strong> and has been securely routed to the Hiring Review Committee for candidate shortlisting.
  </p>

  <div style="background-color: #064e3b; border: 1px solid #059669; padding: 15px; border-radius: 8px; margin: 25px 0; text-align: center;">
    <span style="font-size: 13px; color: #a7f3d0; font-weight: bold;">
      Status Code: FIN_VERIFIED_SUCCESS
    </span>
  </div>

  <div style="margin-top: 35px; font-size: 11px; color: #64748b; border-top: 1px solid #334155; padding-top: 20px;">
    This is an administrative email. Please do not reply directly to this notification.
  </div>
</div>
      `.trim());
    } else if (templateId === 'application_status') {
      setEmailComposerSubject('Interview Scheduled - Hydrocean Robotics Recruitment 📅');
      setEmailComposerBody(`
<div style="font-family: sans-serif; padding: 30px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 25px;">
    <h1 style="color: #0d9488; font-size: 24px; margin: 0;">HYDROCEAN</h1>
    <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">Admissions & Recruitment Portal</p>
  </div>
  
  <h2 style="color: #f1f5f9; font-size: 18px; margin-top: 0;">Application Status Update</h2>
  
  <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
    Your candidate profile for the active position has been successfully shortlisted! You are invited to attend an online technical panel interview with our Lead Maritime Engineers.
  </p>

  <div style="background-color: #1e293b; border-left: 4px solid #0d9488; padding: 15px; border-radius: 8px; margin: 25px 0;">
    <h4 style="margin: 0 0 10px 0; color: #f8fafc; font-size: 14px;">📅 Interview Coordinates</h4>
    <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.5;">
      <strong>Platform:</strong> Microsoft Teams<br/>
      <strong>Date/Time:</strong> Announced in Portal Controls<br/>
      <strong>Hiring Stage:</strong> Technical Assessment Round
    </p>
  </div>

  <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
    Please log in to the portal to review your individual scheduling coordinates and access links.
  </p>

  <div style="margin-top: 35px; font-size: 11px; color: #64748b; border-top: 1px solid #334155; padding-top: 20px;">
    This is an administrative email. Please do not reply directly to this notification.
  </div>
</div>
      `.trim());
    }
  };

  const handleSendBulkEmail = async () => {
    setSendingEmail(true);
    try {
      const recipientParam = emailRecipientMode === 'all' ? 'all' : selectedRecipients;
      
      const res = await apiFetch('/admin/users/send-email', {
        method: 'POST',
        body: JSON.stringify({
          to: recipientParam,
          subject: emailComposerSubject,
          message: emailComposerBody
        })
      });

      if (res.success) {
        alert(res.message || 'Emails dispatched successfully.');
        setSelectedRecipients([]);
        setEmailComposerSubject('');
        setEmailComposerBody('');
        setSelectedEmailTemplate('custom');
        fetchStats();
      }
    } catch (err: any) {
      alert('Failed to send email: ' + err.message);
    } finally {
      setSendingEmail(false);
    }
  };

  // Applications
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('');
  const [appJobFilter, setAppJobFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [internalNotesInput, setInternalNotesInput] = useState('');

  // Vacancies
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showAddJobModal, setShowAddJobModal] = useState(false);

  // Search, Filter, Sort for Vacancies
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('all'); // 'all', 'open', 'closed', 'hidden', 'archived'
  const [jobCountryFilter, setJobCountryFilter] = useState('');
  const [jobSortBy, setJobSortBy] = useState('latest'); // 'latest', 'alphabetical'

  // Add/Edit Job Form States
  const [jobTitle, setJobTitle] = useState('');
  const [jobQual, setJobQual] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobCountry, setJobCountry] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobResp, setJobResp] = useState('');
  const [jobReq, setJobReq] = useState('');

  // Gallery Tab
  const [gallery, setGallery] = useState<string[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  // Settings Forms
  const [formSettings, setFormSettings] = useState<WebsiteSettings>({
    ...settings,
    companyRegNumber: settings.companyRegNumber || 'SEC-2026-089765',
    companyCertNumber: settings.companyCertNumber || 'CERT-65432-PK',
    companyRegUrl: settings.companyRegUrl || 'https://secp.gov.pk',
    companyLegalName: settings.companyLegalName || 'Hydrocean Robotics (Private) Limited',
    companyRegDesc: settings.companyRegDesc || 'Hydrocean Robotics is officially incorporated and registered under the Companies Act as a technology provider for marine and autonomous subsea exploration systems.',
  });
  const [formBank, setFormBank] = useState<BankDetails>({ ...bankDetails });
  const [formOffice, setFormOffice] = useState<OfficeContact>({ ...officeContact });
  const [savingSettings, setSavingSettings] = useState(false);
  
  const [settingsSubTab, setSettingsSubTab] = useState<'website' | 'bank' | 'fee' | 'cloudinary' | 'email' | 'security' | 'profile'>('website');
  const [showCloudinarySecret, setShowCloudinarySecret] = useState(false);
  const [showResendSecret, setShowResendSecret] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password reset inside settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const isEmailAdmin = (email: string) => {
    if (!currentUser) return false;
    return !!currentUser.isAdmin;
  };

  const hasPermission = (perm: string) => {
    if (!currentUser) return true; // Default to allow while loading
    if (currentUser.isAdmin && currentUser.role !== 'sub_admin') return true; // Main admins have full power
    return currentUser.permissions && currentUser.permissions.includes(perm);
  };

  useEffect(() => {
    // Fetch current user details & permissions on mount
    apiFetch('/applicants/me')
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
          setProfileNameInput(data.user.fullName || '');
        }
      })
      .catch((err) => {
        console.error('Failed to load current admin/sub-admin profile:', err);
      });
  }, []);

  useEffect(() => {
    if (currentUser) {
      const permittedTabs = [
        { id: 'dashboard', perm: 'View Dashboard' },
        { id: 'applications', perm: 'View Applications' },
        { id: 'vacancies', perm: 'Manage Jobs' },
        { id: 'settings', perm: 'AdminOnly' },
        { id: 'users', perm: 'AdminOnly' },
        { id: 'emails', perm: 'Send Emails' },
        { id: 'contacts', perm: 'View Applications' },
        { id: 'logs', perm: 'AdminOnly' }
      ].filter((tab) => {
        if (tab.perm === 'AdminOnly') {
          return currentUser.role === 'admin' || isEmailAdmin(currentUser.email);
        }
        return currentUser.permissions && currentUser.permissions.includes(tab.perm);
      });
      if (permittedTabs.length > 0 && !permittedTabs.some(t => t.id === activeTab)) {
        setActiveTab(permittedTabs[0].id as any);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    fetchStats();
    fetchJobs();
    fetchApplications();
    fetchGallery();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await apiFetch('/admin/users');
      if (data.success) {
        setUsersList(data.users || []);
      }
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const data = await apiFetch('/admin/contacts');
      if (data.success) {
        setContacts(data.contacts || []);
      }
    } catch (e) {
      console.error('Failed to load contacts:', e);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'contacts') {
      fetchContacts();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const data = await apiFetch('/admin/stats');
      setStats(data.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      // Fetch matching filters dynamically
      let url = '/admin/applications?';
      if (appSearch) url += `search=${encodeURIComponent(appSearch)}&`;
      if (appStatusFilter) url += `status=${encodeURIComponent(appStatusFilter)}&`;
      if (appJobFilter) url += `jobId=${encodeURIComponent(appJobFilter)}&`;

      const data = await apiFetch(url);
      setApplications(data.applications);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const data = await apiFetch('/admin/jobs');
      setJobs(data.jobs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchGallery = async () => {
    setLoadingGallery(true);
    try {
      const data = await apiFetch('/gallery');
      setGallery(data.gallery);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    onLogout();
  };

  // APPLICATION ACTIONS
  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      await apiFetch(`/admin/applications/${appId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, internalNotes: internalNotesInput })
      });
      fetchApplications();
      fetchStats();
      if (selectedApp) {
        setSelectedApp({ ...selectedApp, status: status as any, internalNotes: internalNotesInput });
      }
      alert('Application status successfully updated.');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteApplication = async (appId: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this application? This is permanent.')) return;
    try {
      await apiFetch(`/admin/applications/${appId}`, { method: 'DELETE' });
      fetchApplications();
      fetchStats();
      setSelectedApp(null);
    } catch (e: any) {
      alert(e.message);
    }
  };

  // JOB OPERATIONS
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: jobTitle,
      qualification: jobQual,
      salary: jobSalary,
      country: jobCountry,
      description: jobDesc,
      responsibilities: jobResp.split('\n').filter(Boolean),
      requirements: jobReq.split('\n').filter(Boolean)
    };

    try {
      if (editingJob) {
        await apiFetch(`/admin/jobs/${editingJob.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch('/admin/jobs', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      fetchJobs();
      fetchStats();
      setShowAddJobModal(false);
      setEditingJob(null);
      resetJobForm();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleToggleJob = async (job: Job, key: 'isOpen' | 'isHidden') => {
    try {
      await apiFetch(`/admin/jobs/${job.id}`, {
        method: 'PUT',
        body: JSON.stringify({ [key]: !job[key] })
      });
      fetchJobs();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Delete this vacancy forever?')) return;
    try {
      await apiFetch(`/admin/jobs/${jobId}`, { method: 'DELETE' });
      fetchJobs();
      fetchStats();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDuplicateJob = async (job: Job) => {
    try {
      setLoadingJobs(true);
      const duplicateData = {
        title: `${job.title} (Copy)`,
        qualification: job.qualification,
        salary: job.salary,
        country: job.country,
        description: job.description,
        responsibilities: job.responsibilities || [],
        requirements: job.requirements || []
      };
      await apiFetch('/admin/jobs', {
        method: 'POST',
        body: JSON.stringify(duplicateData)
      });
      fetchJobs();
      fetchStats();
    } catch (e: any) {
      alert('Failed to duplicate job: ' + e.message);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleToggleArchiveJob = async (job: Job) => {
    try {
      setLoadingJobs(true);
      await apiFetch(`/admin/jobs/${job.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isArchived: !job.isArchived })
      });
      fetchJobs();
      fetchStats();
    } catch (e: any) {
      alert('Failed to toggle archive status: ' + e.message);
    } finally {
      setLoadingJobs(false);
    }
  };

  const resetJobForm = () => {
    setJobTitle('');
    setJobQual('');
    setJobSalary('');
    setJobCountry('');
    setJobDesc('');
    setJobResp('');
    setJobReq('');
  };

  // GALLERY ACTIONS
  const handleAddGalleryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await apiFetch('/admin/gallery', {
          method: 'POST',
          body: JSON.stringify({ base64Image: reader.result as string })
        });
        fetchGallery();
      } catch (err: any) {
        alert(err.message);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteGalleryImage = async (imgUrl: string) => {
    if (!window.confirm('Remove this image from gallery?')) return;
    try {
      await apiFetch('/admin/gallery', {
        method: 'DELETE',
        body: JSON.stringify({ imageUrl: imgUrl })
      });
      fetchGallery();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // SETTINGS UPDATER
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await apiFetch('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          settings: formSettings,
          bankDetails: formBank,
          officeContact: formOffice
        })
      });
      alert('All configurations updated successfully.');
      onRefreshSettings();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  // ADMIN PASSWORD RESET
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordErr('');
    try {
      await apiFetch('/admin/settings/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      setPasswordMsg('Security keys / password successfully rotated.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordErr(err.message);
    }
  };

  // UPDATE CURRENT ADMIN PROFILE DISPLAY NAME
  const handleUpdateAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSavingProfile(true);
    try {
      const id = currentUser.id || currentUser._id;
      const res = await apiFetch(`/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profileNameInput,
          email: currentUser.email,
          phone: currentUser.phone || ''
        })
      });
      if (res.success) {
        alert('Profile display name updated successfully.');
        setCurrentUser({ ...currentUser, fullName: profileNameInput });
      } else {
        alert(res.error || 'Failed to update profile.');
      }
    } catch (err: any) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // USER MANAGEMENT ACTIONS
  const handleBlockUser = async (userId: string) => {
    try {
      const res = await apiFetch(`/admin/users/${userId}/block`, { method: 'PUT' });
      if (res.success) {
        alert('User account has been successfully blocked.');
        fetchUsers();
        fetchStats();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to block user.');
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const res = await apiFetch(`/admin/users/${userId}/unblock`, { method: 'PUT' });
      if (res.success) {
        alert('User account has been successfully unblocked.');
        fetchUsers();
        fetchStats();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to unblock user.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to soft-delete this user account? You can restore it later if needed.')) return;
    try {
      const res = await apiFetch(`/admin/users/${userId}`, { method: 'DELETE' });
      if (res.success) {
        alert('User account has been soft-deleted successfully.');
        fetchUsers();
        fetchStats();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  const handleRestoreUser = async (userId: string) => {
    try {
      const res = await apiFetch(`/admin/users/${userId}/restore`, { method: 'PUT' });
      if (res.success) {
        alert('User account has been restored successfully.');
        fetchUsers();
        fetchStats();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to restore user.');
    }
  };

  const handleSendAdminEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalUser) return;
    setSendingEmail(true);
    try {
      const res = await apiFetch('/admin/users/send-email', {
        method: 'POST',
        body: JSON.stringify({
          email: emailModalUser.email,
          subject: emailSubjectInput,
          message: emailMessageInput
        })
      });
      if (res.success) {
        alert(`Email successfully dispatched to ${emailModalUser.email}`);
        setEmailModalUser(null);
        setEmailSubjectInput('');
        setEmailMessageInput('');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch email.');
    } finally {
      setSendingEmail(false);
    }
  };

  // CONTACT ACTIONS
  const handleMarkAsRead = async (contact: any) => {
    const contactId = contact.id || contact._id;
    if (contact.status === 'Unread') {
      try {
        const data = await apiFetch(`/admin/contacts/${contactId}`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'Read' }),
        });
        if (data.success) {
          setContacts(prev => prev.map(c => (c.id === contactId || c._id === contactId) ? { ...c, status: 'Read' } : c));
          fetchStats();
        }
      } catch (err: any) {
        console.error('Failed to mark message as read:', err);
      }
    }
    setSelectedContact(contact);
    setShowContactModal(true);
    setReplyMessage('');
  };

  const handleSendReply = async (contactId: string) => {
    if (!replyMessage.trim()) return;
    setSendingReply(true);
    try {
      const data = await apiFetch(`/admin/contacts/${contactId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ replyMessage }),
      });
      if (data.success) {
        alert('Reply sent and logged successfully!');
        setContacts(prev => prev.map(c => (c.id === contactId || c._id === contactId) ? { ...c, status: 'Replied', replyMessage, repliedAt: new Date().toISOString() } : c));
        setShowContactModal(false);
        setSelectedContact(null);
        setReplyMessage('');
        fetchStats();
      }
    } catch (err: any) {
      alert('Failed to send reply: ' + err.message);
    } finally {
      setSendingReply(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!window.confirm('Are you sure you want to delete this contact message forever?')) return;
    try {
      const data = await apiFetch(`/admin/contacts/${contactId}`, {
        method: 'DELETE'
      });
      if (data.success) {
        setContacts(prev => prev.filter(c => (c.id !== contactId && c._id !== contactId)));
        if (selectedContact && (selectedContact.id === contactId || selectedContact._id === contactId)) {
          setShowContactModal(false);
          setSelectedContact(null);
        }
        fetchStats();
      }
    } catch (err: any) {
      alert('Failed to delete contact message: ' + err.message);
    }
  };

  // EXCEL / CSV EXPORTER
  const handleExportCSV = () => {
    if (applications.length === 0) {
      alert('No candidate records to export.');
      return;
    }

    const headers = [
      'ID', 'Job Applied', 'Full Name', 'Father Name', 'Email', 'Phone', 'WhatsApp',
      'CNIC', 'DOB', 'Gender', 'Qualification', 'City', 'Province', 'Passport', 'Status', 'CreatedAt'
    ];

    const rows = applications.map(a => [
      a.id, a.jobTitle, a.fullName, a.fatherName, a.email, a.mobileNumber, a.whatsAppNumber,
      a.cnic, a.dateOfBirth, a.gender, a.qualification, a.city, a.province, a.passportAvailable, a.status, a.createdAt
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hydrocean_applicants_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const primaryColor = settings.primaryColor || '#009ca6';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION PANEL */}
      <aside className="w-full md:w-64 bg-slate-950 text-white flex flex-col justify-between shrink-0 border-r border-slate-900">
        <div>
          {/* Logo brand */}
          <div className="p-6 border-b border-slate-900 flex items-center space-x-3">
            <ShieldCheck className="h-6 w-6 text-teal-400" />
            <div>
              <span className="font-display font-extrabold text-sm uppercase tracking-wider text-teal-400">Admin Control</span>
              <p className="text-[9px] font-mono text-gray-400">Security Suite v1.1</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5 font-sans">
            {[
              { id: 'dashboard', name: 'Dashboard Analytics', icon: <History className="h-4.5 w-4.5" />, perm: 'View Dashboard' },
              { id: 'applications', name: 'Applicant Profiles', icon: <FileSpreadsheet className="h-4.5 w-4.5" />, perm: 'View Applications' },
              { id: 'vacancies', name: 'Manage Vacancies', icon: <Briefcase className="h-4.5 w-4.5" />, perm: 'Manage Jobs' },
              { id: 'settings', name: 'System Settings', icon: <Landmark className="h-4.5 w-4.5" />, perm: 'AdminOnly' },
              { id: 'users', name: 'User Management', icon: <Users className="h-4.5 w-4.5" />, perm: 'AdminOnly' },
              { id: 'emails', name: 'Email Management', icon: <Mail className="h-4.5 w-4.5" />, perm: 'Send Emails' },
              { id: 'contacts', name: 'Contact Messages', icon: <Mail className="h-4.5 w-4.5" />, perm: 'View Applications' },
              { id: 'logs', name: 'Security Audit Logs', icon: <History className="h-4.5 w-4.5" />, perm: 'AdminOnly' }
            ].filter((tab) => {
              if (tab.perm === 'AdminOnly') {
                return currentUser?.role === 'admin' || (currentUser?.email && isEmailAdmin(currentUser.email));
              }
              return hasPermission(tab.perm);
            }).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-semibold rounded-xl cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? 'bg-teal-700/80 text-white font-bold'
                    : 'text-gray-400 hover:bg-slate-900 hover:text-white'
                }`}
                style={activeTab === tab.id ? { backgroundColor: primaryColor } : {}}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User logout block */}
        <div className="p-4 border-t border-slate-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-rose-950 text-gray-300 hover:text-white py-3 rounded-xl text-xs font-bold cursor-pointer transition-all border border-slate-800"
          >
            <LogOut className="h-4 w-4" />
            <span>End Session</span>
          </button>
        </div>
      </aside>

      {/* CORE CONTENT LAYOUT */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        
        {/* ================== TAB: DASHBOARD ANALYTICS ================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-200 pb-5">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-gray-950">Dashboard Analytics</h1>
                <p className="text-xs text-gray-500 font-sans mt-1">Real-time indicators, stats counters, and platform summaries.</p>
              </div>
              <button
                onClick={fetchStats}
                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                title="Refresh stats"
              >
                <RefreshCcw className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {loadingStats ? (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Scorecards Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {/* Total Users */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Total Users</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.totalUsers || 0}</h3>
                    </div>
                  </div>

                  {/* Today's Users */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Registered Today</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.usersToday || 0}</h3>
                    </div>
                  </div>

                  {/* Unread Contact Messages */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Unread Messages</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.unreadMessages || 0}</h3>
                    </div>
                  </div>

                  {/* Total Applications */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
                      <FileSpreadsheet className="h-5 w-5" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Total Apps</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.totalApplications || 0}</h3>
                    </div>
                  </div>

                  {/* Total Jobs */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-slate-50 text-gray-600 rounded-xl">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Total Jobs</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.totalJobs || 0}</h3>
                    </div>
                  </div>

                  {/* Active Jobs */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Active Jobs</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.activeJobs || 0}</h3>
                    </div>
                  </div>

                  {/* Closed Jobs */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                      <X className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Closed Jobs</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.closedJobs || 0}</h3>
                    </div>
                  </div>

                  {/* Pending Applications */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Pending Apps</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.pendingApplications || 0}</h3>
                    </div>
                  </div>

                  {/* Approved Applications */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Approved Apps</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.approvedApplications || 0}</h3>
                    </div>
                  </div>

                  {/* Rejected Applications */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Rejected Apps</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.rejectedApplications || 0}</h3>
                    </div>
                  </div>

                  {/* Total Payments */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Total Payments</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.totalPayments || 0}</h3>
                    </div>
                  </div>

                  {/* Verified Payments */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Verified Recpts</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.verifiedPayments || 0}</h3>
                    </div>
                  </div>
                </div>

                {/* Traffic and Telemetry Scorecards Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {/* Daily Visitors */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                      <History className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Visitors Today</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.visitorsToday || 0}</h3>
                    </div>
                  </div>

                  {/* Weekly Visitors */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                      <History className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Visits Weekly</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.visitorsThisWeek || 0}</h3>
                    </div>
                  </div>

                  {/* Monthly Visitors */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl">
                      <History className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Visits Monthly</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.visitorsThisMonth || 0}</h3>
                    </div>
                  </div>

                  {/* Total Visits */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                      <History className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Total Visits</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.totalWebsiteVisits || 0}</h3>
                    </div>
                  </div>

                  {/* Emails Dispatched */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
                    <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase leading-none">Emails Dispatched</p>
                      <h3 className="text-lg font-display font-bold text-gray-950 mt-1">{stats?.totalEmailsSent || 0}</h3>
                    </div>
                  </div>
                </div>

                {/* Real-time Website Traffic Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Line Chart */}
                  {stats?.charts?.dailyVisitorActivity && (
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-display font-bold text-sm text-gray-900">7-Day Traffic Analytics</h3>
                        <span className="text-[10px] bg-teal-50 text-teal-600 px-2 py-0.5 rounded font-mono font-bold uppercase" style={{ color: primaryColor, backgroundColor: primaryColor + '10' }}>Real-Time Visits</span>
                      </div>
                      <div className="h-44 relative w-full flex items-end">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.25"/>
                              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.00"/>
                            </linearGradient>
                          </defs>
                          {(() => {
                            const data = stats.charts.dailyVisitorActivity;
                            const maxVal = Math.max(...data.map((d: any) => d.visitors), 5);
                            const points = data.map((d: any, idx: number) => {
                              const x = (idx / (data.length - 1)) * 480 + 10;
                              const y = 140 - (d.visitors / maxVal) * 110;
                              return { x, y, val: d.visitors, label: d.name };
                            });
                            const linePath = points.map((p: any, idx: number) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                            const areaPath = `${linePath} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`;

                            return (
                              <>
                                <line x1="10" y1="30" x2="490" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
                                <line x1="10" y1="85" x2="490" y2="85" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
                                <line x1="10" y1="140" x2="490" y2="140" stroke="#e2e8f0" strokeWidth="1" />
                                <path d={areaPath} fill="url(#chartGradient)" />
                                <path d={linePath} fill="none" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                {points.map((p: any, idx: number) => (
                                  <g key={idx} className="group cursor-pointer">
                                    <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke={primaryColor} strokeWidth="2.5" className="transition-all hover:r-6" />
                                  </g>
                                ))}
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                      <div className="flex justify-between mt-3 px-1">
                        {stats.charts.dailyVisitorActivity.map((d: any, idx: number) => (
                          <span key={idx} className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">{d.name}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bar Chart */}
                  {stats?.charts?.dailyAppTraffic && (
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-display font-bold text-sm text-gray-900">Application Pipeline (Daily)</h3>
                        <div className="flex items-center space-x-3 text-[9px] font-mono font-bold uppercase tracking-wider">
                          <span className="flex items-center space-x-1">
                            <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                            <span className="text-gray-400">Started</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span className="h-2 w-2 rounded-full bg-teal-600" style={{ backgroundColor: primaryColor }}></span>
                            <span className="text-gray-400">Submitted</span>
                          </span>
                        </div>
                      </div>
                      <div className="h-44 flex items-end justify-between px-2 pt-4 border-b border-slate-100">
                        {(() => {
                          const data = stats.charts.dailyAppTraffic;
                          const maxVal = Math.max(...data.map((d: any) => Math.max(d.started, d.submitted)), 5);
                          return data.map((d: any, idx: number) => {
                            const startedHeight = (d.started / maxVal) * 110;
                            const submittedHeight = (d.submitted / maxVal) * 110;
                            return (
                              <div key={idx} className="flex flex-col items-center flex-1 group">
                                <div className="flex items-end space-x-1 h-32 w-full justify-center">
                                  <div 
                                    style={{ height: `${startedHeight}px` }} 
                                    className="w-2.5 bg-slate-200 rounded-t transition-all group-hover:bg-slate-300"
                                    title={`Started: ${d.started}`}
                                  />
                                  <div 
                                    style={{ height: `${submittedHeight}px`, backgroundColor: primaryColor }} 
                                    className="w-2.5 rounded-t transition-all group-hover:opacity-90"
                                    title={`Submitted: ${d.submitted}`}
                                  />
                                </div>
                                <span className="text-[9px] font-mono font-bold text-gray-400 mt-2 uppercase tracking-wider">{d.name}</span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Subsections Grid: Recent applications & breakdown chart */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Status breakdowns */}
                  <div className="lg:col-span-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <h3 className="font-display font-bold text-sm text-gray-900 mb-6">Application Status Breakdown</h3>
                    <div className="space-y-4">
                      {stats?.statusBreakdown && Object.entries(stats.statusBreakdown).map(([status, count]: any) => (
                        <div key={status} className="space-y-1 text-xs">
                          <div className="flex justify-between text-gray-600 font-semibold">
                            <span>{status}</span>
                            <span>{count}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-teal-600 h-full rounded-full"
                              style={{
                                width: stats.totalApplications ? `${((count as number) / stats.totalApplications) * 100}%` : '0%',
                                backgroundColor: primaryColor
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity Logs */}
                  <div className="lg:col-span-8 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <h3 className="font-display font-bold text-sm text-gray-900 mb-6">Recent Administrative Activity logs</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {stats?.logs && stats.logs.map((log: any, idx: number) => (
                        <div key={idx} className="flex items-start justify-between py-2.5 border-b border-gray-100 text-xs font-sans">
                          <div>
                            <p className="font-semibold text-gray-800">{log.action}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">IP Address: {log.ip}</p>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* ================== TAB: APPLICANT PROFILES ================== */}
        {activeTab === 'applications' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-gray-950">Applicant Profiles</h1>
                <p className="text-xs text-gray-500 font-sans mt-1">Review registrations, download CVs, and approve bank slip payments.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all"
                >
                  <FileSpreadsheet className="h-4.5 w-4.5" />
                  <span>Export Excel</span>
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-2">Search Candidates</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, CNIC, phone, city..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-2">Filter Status</label>
                <select
                  value={appStatusFilter}
                  onChange={(e) => setAppStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Verified">Verified Payments</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview Scheduling</option>
                  <option value="Selected">Selected</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-2">Filter Vacancy</label>
                <select
                  value={appJobFilter}
                  onChange={(e) => setAppJobFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="">All Positions</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={fetchApplications}
                className="py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-teal-700 shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                style={{ backgroundColor: primaryColor }}
              >
                <Filter className="h-4 w-4" />
                <span>Apply Filters</span>
              </button>
            </div>

            {/* Applications list table */}
            {loadingApps ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <Users className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <h3 className="font-display font-bold text-base text-gray-900">No matching applications found</h3>
                <p className="text-xs text-gray-500 mt-1 font-sans">Adjust search keywords or filtering parameters and try again.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-sans">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-100 text-[10px] font-mono font-bold uppercase text-gray-400 tracking-wider">
                        <th className="py-4 px-6">Candidate Name</th>
                        <th className="py-4 px-6">Job Position</th>
                        <th className="py-4 px-6">CNIC Number</th>
                        <th className="py-4 px-6">Mailing City</th>
                        <th className="py-4 px-6">Filing Date</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-center">Action Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6 font-semibold text-gray-950">{app.fullName}</td>
                          <td className="py-4 px-6 text-gray-600 font-medium">{app.jobTitle}</td>
                          <td className="py-4 px-6 font-mono text-gray-500">{app.cnic}</td>
                          <td className="py-4 px-6">{app.city}</td>
                          <td className="py-4 px-6 text-gray-400 font-mono">{new Date(app.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                              app.status === 'Pending Verification' ? 'bg-amber-50 text-amber-700' :
                              app.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' :
                              app.status === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                              'bg-indigo-50 text-indigo-700'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedApp(app);
                                  setInternalNotesInput(app.internalNotes || '');
                                }}
                                className="p-1.5 hover:bg-teal-50 hover:text-teal-700 text-gray-400 rounded-lg cursor-pointer"
                                title="View Detailed Profile"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteApplication(app.id)}
                                className="p-1.5 hover:bg-rose-50 hover:text-rose-700 text-gray-400 rounded-lg cursor-pointer"
                                title="Delete Candidate permanently"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CANDIDATE FULL DETAIL DRAWER / MODAL */}
            {selectedApp && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-100">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-teal-600" style={{ color: primaryColor }}>
                        Application File # {selectedApp.id}
                      </span>
                      <h3 className="text-xl font-display font-extrabold text-gray-900 mt-1">{selectedApp.fullName}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-slate-200 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-8 space-y-8 font-sans">
                    
                    {/* Basic Layout Summary with image avatar */}
                    <div className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-gray-100">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden border border-gray-200 shadow-sm shrink-0">
                        <img
                          src={selectedApp.candidatePictureUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
                          alt={selectedApp.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-xs w-full">
                        <div>
                          <p className="text-gray-400">Position Applied</p>
                          <p className="font-bold text-gray-900 text-sm">{selectedApp.jobTitle}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Father Name</p>
                          <p className="font-bold text-gray-900">{selectedApp.fatherName}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Date of Birth</p>
                          <p className="font-semibold text-gray-800">{selectedApp.dateOfBirth}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">CNIC Number</p>
                          <p className="font-mono font-semibold text-gray-800">{selectedApp.cnic}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Gender</p>
                          <p className="font-semibold text-gray-800">{selectedApp.gender}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Highest Education</p>
                          <p className="font-bold text-gray-800">{selectedApp.qualification}</p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed info tabs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Contacts & Addresses */}
                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm text-gray-900">Contact & Address Coordinates</h4>
                        <div className="bg-slate-50 border border-gray-100 rounded-2xl p-5 space-y-3 text-xs text-gray-600">
                          <div>
                            <span className="text-gray-400">Email Address:</span>
                            <p className="font-bold text-gray-800 mt-0.5">{selectedApp.email}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Mobile Phone:</span>
                            <p className="font-semibold text-gray-800 mt-0.5">{selectedApp.mobileNumber}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">WhatsApp:</span>
                            <p className="font-semibold text-gray-800 mt-0.5">{selectedApp.whatsAppNumber}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Mailing Address:</span>
                            <p className="font-medium text-gray-800 mt-0.5">{selectedApp.completeAddress}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                              <span className="text-gray-400">City / State:</span>
                              <p className="font-bold text-gray-800">{selectedApp.city}, {selectedApp.province}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Passport:</span>
                              <p className="font-bold text-gray-800">{selectedApp.passportAvailable}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Skills & Experiences */}
                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm text-gray-900">Technical Qualifications</h4>
                        <div className="bg-slate-50 border border-gray-100 rounded-2xl p-5 space-y-4 text-xs">
                          <div>
                            <span className="text-gray-400 font-semibold">Technical Skills:</span>
                            <p className="text-gray-800 mt-1 leading-relaxed">{selectedApp.skills}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 font-semibold">Experience Portfolio:</span>
                            <p className="text-gray-800 mt-1 leading-relaxed">{selectedApp.experience}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Document Files Downloads Row */}
                    <div className="space-y-4 border-t border-gray-100 pt-8">
                      <h4 className="font-display font-bold text-sm text-gray-900">Candidate Attached Documents</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        
                        <a
                          href={selectedApp.cvUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-slate-50 border border-gray-150 p-4 rounded-2xl text-center hover:border-teal-400 hover:bg-teal-50/25 transition-all block"
                        >
                          <FileSpreadsheet className="h-6 w-6 text-teal-600 mx-auto mb-2" style={{ color: primaryColor }} />
                          <span className="text-xs font-bold text-gray-800 block">Candidate CV</span>
                          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Open Resume</span>
                        </a>

                        <a
                          href={selectedApp.paymentSlipUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-slate-50 border border-gray-150 p-4 rounded-2xl text-center hover:border-teal-400 hover:bg-teal-50/25 transition-all block"
                        >
                          <CreditCard className="h-6 w-6 text-teal-600 mx-auto mb-2" style={{ color: primaryColor }} />
                          <span className="text-xs font-bold text-gray-800 block">Deposit Slip</span>
                          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Verify Payment</span>
                        </a>

                        {selectedApp.candidatePictureUrl && (
                          <a
                            href={selectedApp.candidatePictureUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-50 border border-gray-150 p-4 rounded-2xl text-center hover:border-teal-400 hover:bg-teal-50/25 transition-all block"
                          >
                            <Users className="h-6 w-6 text-teal-600 mx-auto mb-2" style={{ color: primaryColor }} />
                            <span className="text-xs font-bold text-gray-800 block">Profile Picture</span>
                            <span className="text-[10px] text-gray-400 font-mono block mt-0.5">View Avatar</span>
                          </a>
                        )}

                        {selectedApp.passportFileUrl && (
                          <a
                            href={selectedApp.passportFileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-50 border border-gray-150 p-4 rounded-2xl text-center hover:border-teal-400 hover:bg-teal-50/25 transition-all block"
                          >
                            <Users className="h-6 w-6 text-teal-600 mx-auto mb-2" style={{ color: primaryColor }} />
                            <span className="text-xs font-bold text-gray-800 block">Passport Scan</span>
                            <span className="text-[10px] text-gray-400 font-mono block mt-0.5">View Passport</span>
                          </a>
                        )}

                      </div>
                    </div>

                    {/* Admin Status controls */}
                    <div className="border-t border-gray-100 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                          Administrative Internal Evaluation Notes
                        </label>
                        <textarea
                          rows={3}
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-teal-500"
                          placeholder="Add details about shortlisting scores, interviews, or references..."
                          value={internalNotesInput}
                          onChange={(e) => setInternalNotesInput(e.target.value)}
                        ></textarea>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                          Update Application Status
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            'Verified',
                            'Rejected',
                            'Shortlisted',
                            'Interview',
                            'Selected'
                          ].map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateStatus(selectedApp.id, st)}
                              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                selectedApp.status === st
                                  ? 'bg-teal-600 text-white border-teal-600'
                                  : 'bg-white text-gray-700 hover:bg-slate-50'
                              }`}
                              style={selectedApp.status === st ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                            >
                              Move to: {st}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================== TAB: MANAGE VACANCIES ================== */}
        {activeTab === 'vacancies' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-gray-950">Vacancy Positions</h1>
                <p className="text-xs text-gray-500 font-sans mt-1">Add, update, hide, duplicate, or archive hiring roles.</p>
              </div>
              <button
                onClick={() => {
                  setEditingJob(null);
                  resetJobForm();
                  setShowAddJobModal(true);
                }}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer shadow-md transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                <Plus className="h-4.5 w-4.5" />
                <span>Add Position</span>
              </button>
            </div>

            {/* Search, Filter, Sort Row */}
            <div className="bg-white border border-gray-200 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm text-xs font-sans">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, description, country..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-1.5">
                  <Filter className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-500">Status:</span>
                  <select
                    value={jobStatusFilter}
                    onChange={(e) => setJobStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-2 py-1.5 focus:outline-none focus:border-teal-500 text-xs bg-white"
                  >
                    <option value="all">All States</option>
                    <option value="open">Open Hiring</option>
                    <option value="closed">Closed</option>
                    <option value="hidden">Hidden</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center space-x-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-500">Location:</span>
                  <select
                    value={jobCountryFilter}
                    onChange={(e) => setJobCountryFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-2 py-1.5 focus:outline-none focus:border-teal-500 text-xs bg-white"
                  >
                    <option value="">All Locations</option>
                    {Array.from(new Set(jobs.map((j) => j.country))).filter(Boolean).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-gray-500">Sort:</span>
                  <select
                    value={jobSortBy}
                    onChange={(e) => setJobSortBy(e.target.value)}
                    className="border border-gray-200 rounded-xl px-2 py-1.5 focus:outline-none focus:border-teal-500 text-xs bg-white"
                  >
                    <option value="latest">Latest</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>

            {loadingJobs ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <h3 className="font-display font-bold text-base text-gray-900">No vacancy entries exist</h3>
                <p className="text-xs text-gray-500 mt-1 font-sans">Click Add Position to seed your initial vacancy roles.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.filter(job => {
                  const matchesSearch = 
                    job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
                    job.description.toLowerCase().includes(jobSearch.toLowerCase()) ||
                    job.country.toLowerCase().includes(jobSearch.toLowerCase());

                  const matchesStatus = 
                    jobStatusFilter === 'all' ? true :
                    jobStatusFilter === 'open' ? (job.isOpen && !job.isHidden && !job.isArchived) :
                    jobStatusFilter === 'closed' ? (!job.isOpen && !job.isArchived) :
                    jobStatusFilter === 'hidden' ? (job.isHidden && !job.isArchived) :
                    jobStatusFilter === 'archived' ? !!job.isArchived : true;

                  const matchesCountry = 
                    !jobCountryFilter ? true : job.country === jobCountryFilter;

                  return matchesSearch && matchesStatus && matchesCountry;
                }).sort((a, b) => {
                  if (jobSortBy === 'alphabetical') {
                    return a.title.localeCompare(b.title);
                  } else {
                    return (b.createdAt || b.id).localeCompare(a.createdAt || a.id);
                  }
                }).map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border border-gray-150 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-display font-bold text-base text-gray-950">{job.title}</h3>
                          <p className="text-[10px] font-mono tracking-wider text-teal-700 font-bold uppercase mt-1" style={{ color: primaryColor }}>
                            {job.country}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            job.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {job.isOpen ? 'Open Hiring' : 'Closed'}
                          </span>
                          {job.isArchived && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700">
                              Archived
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 my-4 border-y border-gray-100 py-3 text-xs text-gray-600 font-sans">
                        <div>
                          <span className="text-gray-400">Salary Package:</span>
                          <p className="font-semibold text-gray-800">{job.salary}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Qualification:</span>
                          <p className="font-semibold text-gray-800 line-clamp-1">{job.qualification}</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed font-sans">{job.description}</p>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-6 flex flex-wrap items-center justify-between gap-3 text-xs">
                      {/* Toggles */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleToggleJob(job, 'isOpen')}
                          className="flex items-center space-x-1.5 text-gray-600 hover:text-gray-900 cursor-pointer"
                        >
                          {job.isOpen ? <ToggleRight className="h-5 w-5 text-emerald-600" /> : <ToggleLeft className="h-5 w-5 text-gray-400" />}
                          <span className="text-[10px] font-bold uppercase">Hiring</span>
                        </button>

                        <button
                          onClick={() => handleToggleJob(job, 'isHidden')}
                          className="flex items-center space-x-1.5 text-gray-600 hover:text-gray-900 cursor-pointer"
                        >
                          {job.isHidden ? <ToggleRight className="h-5 w-5 text-rose-500" /> : <ToggleLeft className="h-5 w-5 text-gray-400" />}
                          <span className="text-[10px] font-bold uppercase">Hidden</span>
                        </button>
                      </div>

                      {/* Operations */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDuplicateJob(job)}
                          title="Duplicate Job"
                          className="p-1.5 hover:bg-teal-50 text-gray-400 hover:text-teal-700 rounded-lg cursor-pointer"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleArchiveJob(job)}
                          title={job.isArchived ? "Unarchive Job" : "Archive Job"}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            job.isArchived ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'hover:bg-slate-100 text-gray-400 hover:text-gray-700'
                          }`}
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingJob(job);
                            setJobTitle(job.title);
                            setJobQual(job.qualification);
                            setJobSalary(job.salary);
                            setJobCountry(job.country);
                            setJobDesc(job.description);
                            setJobResp(job.responsibilities?.join('\n') || '');
                            setJobReq(job.requirements?.join('\n') || '');
                            setShowAddJobModal(true);
                          }}
                          className="p-1.5 hover:bg-slate-100 text-gray-400 hover:text-gray-900 rounded-lg cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-700 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ADD / EDIT JOB MODAL */}
            {showAddJobModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm">
                <form onSubmit={handleSaveJob} className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg text-gray-900">
                      {editingJob ? 'Edit Vacancy Position' : 'Add New Vacancy position'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddJobModal(false);
                        setEditingJob(null);
                        resetJobForm();
                      }}
                      className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-slate-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-8 space-y-5 text-xs font-sans">
                    <div>
                      <label className="block text-gray-500 mb-1.5 font-semibold">Job Title *</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-teal-500"
                        placeholder="e.g. Subsea Acoustics Lead"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Compensation Salary *</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-teal-500"
                          placeholder="e.g. USD 5,000 / Month"
                          value={jobSalary}
                          onChange={(e) => setJobSalary(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Target Country Location *</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-teal-500"
                          placeholder="e.g. Maldives Office"
                          value={jobCountry}
                          onChange={(e) => setJobCountry(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-500 mb-1.5 font-semibold">Target Qualifications *</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-teal-500"
                        placeholder="e.g. B.Sc in Robotics or Marine Sciences"
                        value={jobQual}
                        onChange={(e) => setJobQual(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-500 mb-1.5 font-semibold">Job Summary Description *</label>
                      <textarea
                        required
                        rows={3}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-teal-500 resize-none"
                        placeholder="Provide summary description about the role..."
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Core Responsibilities (One per line)</label>
                        <textarea
                          rows={4}
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-teal-500 resize-none font-sans"
                          placeholder="Conduct pre-flight checkups&#10;Log telemetry anomalies"
                          value={jobResp}
                          onChange={(e) => setJobResp(e.target.value)}
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Essential Requirements (One per line)</label>
                        <textarea
                          rows={4}
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-teal-500 resize-none font-sans"
                          placeholder="License of Drone flight&#10;Knowledge in PX4 autopilot"
                          value={jobReq}
                          onChange={(e) => setJobReq(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-gray-100 bg-slate-50 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddJobModal(false);
                        setEditingJob(null);
                        resetJobForm();
                      }}
                      className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-teal-700 shadow-md transition-all cursor-pointer"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Save Vacancy
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ================== TAB: SYSTEM SETTINGS ================== */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-gray-200 pb-5">
              <h1 className="font-display font-extrabold text-2xl text-gray-950">System Configuration</h1>
              <p className="text-xs text-gray-500 font-sans mt-1">Configure platform-wide variables, admissions fees, bank coordinates, integrations, and admin security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Sub-tab Buttons */}
              <div className="lg:col-span-3 flex flex-col space-y-1.5 bg-white border border-gray-100 rounded-3xl p-4 shadow-sm font-sans">
                {[
                  { id: 'website', name: '🌐 Website Brand', desc: 'Colors, legal names & registration details' },
                  { id: 'bank', name: '🏦 Bank Coordinates', desc: 'Corporate accounts & QR verification codes' },
                  { id: 'fee', name: '💸 Fee Structure', desc: 'Admission processing fee tariffs & thresholds' },
                  { id: 'cloudinary', name: '☁️ Cloudinary Assets', desc: 'Cloud media credentials & target folders' },
                  { id: 'email', name: '✉️ Email Dispatcher', desc: 'Resend API key & SMTP fallback controls' },
                  { id: 'security', name: '🔒 System Security', desc: 'Reset credentials & session configurations' },
                  { id: 'profile', name: '👤 Admin Profile', desc: 'Your personal identification & audit metrics' }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSettingsSubTab(sub.id as any)}
                    className={`text-left p-3.5 rounded-2xl cursor-pointer transition-all ${
                      settingsSubTab === sub.id
                        ? 'bg-teal-50 border-l-4 border-teal-600 font-semibold'
                        : 'hover:bg-slate-50 border-l-4 border-transparent'
                    }`}
                    style={{
                      backgroundColor: settingsSubTab === sub.id ? `${primaryColor}10` : '',
                      borderLeftColor: settingsSubTab === sub.id ? primaryColor : ''
                    }}
                  >
                    <span className="block text-xs font-bold text-gray-900">{sub.name}</span>
                    <span className="block text-[10px] text-gray-400 mt-1 leading-normal font-normal">{sub.desc}</span>
                  </button>
                ))}
              </div>

              {/* Right Column: Forms Panel */}
              <div className="lg:col-span-9 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm font-sans font-sans">
                
                {/* 1. WEBSITE BRAND SUB-TAB */}
                {settingsSubTab === 'website' && (
                  <form onSubmit={handleUpdateSettings} className="space-y-6">
                    <div>
                      <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-teal-600 mb-1" style={{ color: primaryColor }}>🌐 Website Settings</h2>
                      <p className="text-[11px] text-gray-500">Configure visual themes, legal titles, and coordinates of the portal.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Company Display Name *</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 focus:bg-white"
                          value={formSettings.companyName || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, companyName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Brand Primary Color Accent *</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            required
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                            value={formSettings.primaryColor || ''}
                            onChange={(e) => setFormSettings({ ...formSettings, primaryColor: e.target.value })}
                          />
                          <div className="h-9 w-9 rounded-xl border border-gray-200 shadow-inner flex-shrink-0" style={{ backgroundColor: formSettings.primaryColor }} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Company Legal Name</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 focus:bg-white"
                          value={formSettings.companyLegalName || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, companyLegalName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">SECP Verification Link</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono focus:bg-white"
                          value={formSettings.companyRegUrl || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, companyRegUrl: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Incorporation Certificate Code</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono focus:bg-white"
                          value={formSettings.companyCertNumber || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, companyCertNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">SECP Registered Number</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono focus:bg-white"
                          value={formSettings.companyRegNumber || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, companyRegNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="block text-gray-500 mb-1.5 font-semibold">Company Legal Description</label>
                      <textarea
                        rows={3}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 focus:bg-white"
                        value={formSettings.companyRegDesc || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, companyRegDesc: e.target.value })}
                      />
                    </div>

                    <div className="border-t border-gray-100 pt-5 mt-5">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">📍 Office Physical Coordinates</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-gray-500 mb-1.5 font-semibold">Registered Physical Address *</label>
                          <input
                            type="text"
                            required
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                            value={formOffice.address || ''}
                            onChange={(e) => setFormOffice({ ...formOffice, address: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1.5 font-semibold">Official Contact Email *</label>
                          <input
                            type="email"
                            required
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                            value={formOffice.email || ''}
                            onChange={(e) => setFormOffice({ ...formOffice, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mt-4">
                        <div>
                          <label className="block text-gray-500 mb-1.5 font-semibold">Official Telephone Lines</label>
                          <input
                            type="text"
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                            value={formOffice.phone || ''}
                            onChange={(e) => setFormOffice({ ...formOffice, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1.5 font-semibold">WhatsApp Number</label>
                          <input
                            type="text"
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                            value={formOffice.whatsApp || ''}
                            onChange={(e) => setFormOffice({ ...formOffice, whatsApp: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1.5 font-semibold">Working Operations Hours</label>
                          <input
                            type="text"
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                            value={formOffice.workingHours || ''}
                            onChange={(e) => setFormOffice({ ...formOffice, workingHours: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-sm cursor-pointer flex items-center space-x-2"
                        style={{ backgroundColor: primaryColor }}
                        disabled={savingSettings}
                      >
                        <Save className="h-4 w-4" />
                        <span>{savingSettings ? 'Saving...' : 'Save Brand Settings'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* 2. BANK COORDINATES SUB-TAB */}
                {settingsSubTab === 'bank' && (
                  <form onSubmit={handleUpdateSettings} className="space-y-6">
                    <div>
                      <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-teal-600 mb-1" style={{ color: primaryColor }}>🏦 Bank Coordinates</h2>
                      <p className="text-[11px] text-gray-500">Configure corporate bank coordinates for candidates' admission processing fees.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Bank Name *</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                          value={formBank.bankName || ''}
                          onChange={(e) => setFormBank({ ...formBank, bankName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Account Title *</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                          value={formBank.accountTitle || ''}
                          onChange={(e) => setFormBank({ ...formBank, accountTitle: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Account Number *</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                          value={formBank.accountNumber || ''}
                          onChange={(e) => setFormBank({ ...formBank, accountNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Branch Code *</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                          value={formBank.branchCode || ''}
                          onChange={(e) => setFormBank({ ...formBank, branchCode: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">IBAN Code</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                          value={formBank.iban || ''}
                          onChange={(e) => setFormBank({ ...formBank, iban: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="block text-gray-500 mb-1.5 font-semibold">QR Code Image Link</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                        placeholder="e.g., https://example.com/qr.png"
                        value={formBank.qrCodeUrl || ''}
                        onChange={(e) => setFormBank({ ...formBank, qrCodeUrl: e.target.value })}
                      />
                    </div>

                    <div className="text-xs">
                      <label className="block text-gray-500 mb-1.5 font-semibold">Deposit & Fee Payment Instructions</label>
                      <textarea
                        rows={4}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                        value={formBank.paymentInstructions || ''}
                        onChange={(e) => setFormBank({ ...formBank, paymentInstructions: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-sm cursor-pointer flex items-center space-x-2"
                        style={{ backgroundColor: primaryColor }}
                        disabled={savingSettings}
                      >
                        <Save className="h-4 w-4" />
                        <span>{savingSettings ? 'Saving...' : 'Save Bank Details'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* 3. FEE STRUCTURE SUB-TAB */}
                {settingsSubTab === 'fee' && (
                  <form onSubmit={handleUpdateSettings} className="space-y-6">
                    <div>
                      <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-teal-600 mb-1" style={{ color: primaryColor }}>💸 Fee Settings</h2>
                      <p className="text-[11px] text-gray-500">Configure registration fee amounts, local currency, and mandatory attachments.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Admissions Processing Fee (Amount) *</label>
                        <input
                          type="number"
                          required
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                          value={formBank.amount || 0}
                          onChange={(e) => setFormBank({ ...formBank, amount: parseInt(e.target.value, 10) || 0 })}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Currency Representation *</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                          value={formBank.currency || 'PKR'}
                          onChange={(e) => setFormBank({ ...formBank, currency: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Extra Handling Processing Fee *</label>
                        <input
                          type="number"
                          required
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                          value={formBank.processingCharges || 0}
                          onChange={(e) => setFormBank({ ...formBank, processingCharges: parseInt(e.target.value, 10) || 0 })}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Deposit Slip Verification Attachment</label>
                        <select
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 cursor-pointer"
                          value={formBank.depositSlipRequired === false ? 'optional' : 'mandatory'}
                          onChange={(e) => setFormBank({ ...formBank, depositSlipRequired: e.target.value === 'mandatory' })}
                        >
                          <option value="mandatory">Mandatory (Requires slip uploads before submitting files)</option>
                          <option value="optional">Optional (Candidates can bypass deposit file checks)</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl text-xs text-teal-900 leading-relaxed font-sans">
                      <strong>💡 Fee Configuration Notes:</strong> Financial adjustments take effect instantaneously. New candidates applying for roles will immediately be prompted with the new Admissions Processing Fee of <strong>{formBank.currency || 'PKR'} {formBank.amount || 0}</strong> (+ {formBank.currency || 'PKR'} {formBank.processingCharges || 0} handling fee), and verification instructions will display your updated Meezan bank coordinates dynamically.
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-sm cursor-pointer flex items-center space-x-2"
                        style={{ backgroundColor: primaryColor }}
                        disabled={savingSettings}
                      >
                        <Save className="h-4 w-4" />
                        <span>{savingSettings ? 'Saving...' : 'Save Fee Settings'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* 4. CLOUDINARY ASSETS SUB-TAB */}
                {settingsSubTab === 'cloudinary' && (
                  <form onSubmit={handleUpdateSettings} className="space-y-6">
                    <div>
                      <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-teal-600 mb-1" style={{ color: primaryColor }}>☁️ Cloudinary Settings</h2>
                      <p className="text-[11px] text-gray-500">Configure Cloudinary parameters for direct candidate documentation storage uploads.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Cloud Name</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                          value={formSettings.cloudinaryCloudName || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, cloudinaryCloudName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">API Key</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                          value={formSettings.cloudinaryApiKey || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, cloudinaryApiKey: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">API Secret</label>
                        <div className="relative">
                          <input
                            type={showCloudinarySecret ? 'text' : 'password'}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 pr-12 focus:outline-none focus:border-teal-500 font-mono"
                            value={formSettings.cloudinaryApiSecret || ''}
                            onChange={(e) => setFormSettings({ ...formSettings, cloudinaryApiSecret: e.target.value })}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCloudinarySecret(!showCloudinarySecret)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Target Repository Folder Name</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                          value={formSettings.cloudinaryFolder || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, cloudinaryFolder: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-gray-500 leading-normal font-sans">
                      <strong>⚠️ Integration Warning:</strong> If these fields are left blank, the portal automatically triggers secure <strong>Local Storage Fallbacks</strong> which stores candidates' CVs, transcripts, and deposit receipts directly inside the local persistent node container (`/uploads`). This is completely safe and fully functional for staging and local previews.
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-sm cursor-pointer flex items-center space-x-2"
                        style={{ backgroundColor: primaryColor }}
                        disabled={savingSettings}
                      >
                        <Save className="h-4 w-4" />
                        <span>{savingSettings ? 'Saving...' : 'Save Cloudinary'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* 5. EMAIL CONFIGURATION SUB-TAB */}
                {settingsSubTab === 'email' && (
                  <form onSubmit={handleUpdateSettings} className="space-y-6">
                    <div>
                      <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-teal-600 mb-1" style={{ color: primaryColor }}>✉️ Email Configuration</h2>
                      <p className="text-[11px] text-gray-500">Connect a Resend client API token or configure SMTP mail pathways dynamically.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Resend API Key</label>
                        <div className="relative">
                          <input
                            type={showResendSecret ? 'text' : 'password'}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 pr-12 focus:outline-none focus:border-teal-500 font-mono"
                            placeholder="re_..."
                            value={formSettings.resendApiKey || ''}
                            onChange={(e) => setFormSettings({ ...formSettings, resendApiKey: e.target.value })}
                          />
                          <button
                            type="button"
                            onClick={() => setShowResendSecret(!showResendSecret)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1.5 font-semibold">Verified Sender Email Address</label>
                        <input
                          type="email"
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                          placeholder="e.g., onboarding@resend.dev"
                          value={formSettings.resendSenderEmail || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, resendSenderEmail: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5 mt-5">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">🛠️ SMTP Fallback Coordinates</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                        <div className="sm:col-span-2">
                          <label className="block text-gray-500 mb-1.5 font-semibold">SMTP Host Fallback</label>
                          <input
                            type="text"
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                            placeholder="smtp.mailtrap.io"
                            value={formSettings.smtpHost || ''}
                            onChange={(e) => setFormSettings({ ...formSettings, smtpHost: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1.5 font-semibold">SMTP Port Number</label>
                          <input
                            type="number"
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                            placeholder="587"
                            value={(formSettings as any).smtpPort || ''}
                            onChange={(e) => setFormSettings({ ...formSettings, smtpPort: e.target.value } as any)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans mt-4">
                        <div>
                          <label className="block text-gray-500 mb-1.5 font-semibold">SMTP User Name</label>
                          <input
                            type="text"
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                            value={(formSettings as any).smtpUser || ''}
                            onChange={(e) => setFormSettings({ ...formSettings, smtpUser: e.target.value } as any)}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1.5 font-semibold">SMTP Password / Passcode</label>
                          <input
                            type="password"
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                            value={(formSettings as any).smtpPass || ''}
                            onChange={(e) => setFormSettings({ ...formSettings, smtpPass: e.target.value } as any)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-sm cursor-pointer flex items-center space-x-2"
                        style={{ backgroundColor: primaryColor }}
                        disabled={savingSettings}
                      >
                        <Save className="h-4 w-4" />
                        <span>{savingSettings ? 'Saving...' : 'Save Email Hub'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* 6. SYSTEM SECURITY & PASSWORD SUB-TAB */}
                {settingsSubTab === 'security' && (
                  <div className="space-y-8 font-sans">
                    
                    {/* Security credentials form */}
                    <form onSubmit={handleResetPassword} className="space-y-6">
                      <div>
                        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-teal-600 mb-1" style={{ color: primaryColor }}>🔒 Administrative Passcode</h2>
                        <p className="text-[11px] text-gray-500">Rotate the primary administrative keys used for authenticating portals.</p>
                      </div>

                      {passwordMsg && <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-xs font-bold">{passwordMsg}</div>}
                      {passwordErr && <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl text-xs font-bold">{passwordErr}</div>}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                        <div>
                          <label className="block text-gray-500 mb-1.5 font-semibold">Current System Password *</label>
                          <input
                            type="password"
                            required
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1.5 font-semibold">New Security Passcode *</label>
                          <input
                            type="password"
                            required
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-gray-950 text-white hover:bg-gray-800 text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-sm cursor-pointer flex items-center space-x-2"
                        >
                          <Lock className="h-4 w-4" />
                          <span>Rotate Password</span>
                        </button>
                      </div>
                    </form>

                    {/* Session controls */}
                    <form onSubmit={handleUpdateSettings} className="border-t border-gray-100 pt-6 space-y-6">
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">⌛ Access Expirations & MFA Verification</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">Control token session thresholds and enable multi-factor checks.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                        <div>
                          <label className="block text-gray-500 mb-1.5 font-semibold">Active JWT Session Duration (Minutes)</label>
                          <input
                            type="number"
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 font-mono"
                            value={formSettings.sessionDuration || '120'}
                            onChange={(e) => setFormSettings({ ...formSettings, sessionDuration: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1.5 font-semibold">Multi-Factor (OTP Verification) on Login</label>
                          <select
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500 cursor-pointer"
                            value={formSettings.mfaTriggers ? 'enabled' : 'disabled'}
                            onChange={(e) => setFormSettings({ ...formSettings, mfaTriggers: e.target.value === 'enabled' })}
                          >
                            <option value="disabled">Disabled (No OTP verification pin on admin connect)</option>
                            <option value="enabled">Enabled (Forces 6-digit OTP email verify on every connect)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-sm cursor-pointer flex items-center space-x-2"
                          style={{ backgroundColor: primaryColor }}
                          disabled={savingSettings}
                        >
                          <Save className="h-4 w-4" />
                          <span>Save Access Controls</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 7. ADMIN PROFILE SUB-TAB */}
                {settingsSubTab === 'profile' && currentUser && (
                  <form onSubmit={handleUpdateAdminProfile} className="space-y-6">
                    <div>
                      <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-teal-600 mb-1" style={{ color: primaryColor }}>👤 Admin Profile</h2>
                      <p className="text-[11px] text-gray-500">Manage your administrative visual name and view active system access privileges.</p>
                    </div>

                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <span className="block text-gray-400 font-medium">Verified Email Account</span>
                        <span className="block text-gray-900 font-bold font-mono mt-1 text-sm">{currentUser.email}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 font-medium">Privilege Authorization Level</span>
                        <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 font-bold uppercase tracking-wider rounded-lg text-[9px] mt-1.5">
                          {currentUser.role === 'admin' ? '🛡️ Main Administrator' : '🔑 Sub Administrator'}
                        </span>
                      </div>
                      <div className="sm:col-span-2 border-t border-slate-100 pt-3 mt-1 text-gray-500 leading-relaxed font-sans">
                        {currentUser.role === 'admin' ? (
                          <span>You possess unrestricted Global overrides across all visual layouts, vacancy definitions, database tables, billing matrices, user role assignments, and email servers.</span>
                        ) : (
                          <div>
                            <span className="font-bold text-gray-900">Your Configured Privileges:</span>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {currentUser.permissions && currentUser.permissions.map((p: string) => (
                                <span key={p} className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] rounded font-medium">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="block text-gray-500 mb-1.5 font-semibold">Your Display Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-teal-500"
                        value={profileNameInput}
                        onChange={(e) => setProfileNameInput(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-sm cursor-pointer flex items-center space-x-2"
                        style={{ backgroundColor: primaryColor }}
                        disabled={savingProfile}
                      >
                        <Save className="h-4 w-4" />
                        <span>{savingProfile ? 'Saving...' : 'Save Profile Name'}</span>
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>
          </div>
        )}

        {/* ================== TAB: SECURITY AUDIT LOGS ================== */}
        {activeTab === 'logs' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-200 pb-5">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-gray-950">Security Audit Logs</h1>
                <p className="text-xs text-gray-500 font-sans mt-1">Immutability tracking of administrative sessions, log actions, and IPs.</p>
              </div>
              <button
                onClick={fetchStats}
                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                title="Refresh audit trails"
              >
                <RefreshCcw className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {loadingStats ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100 text-[10px] font-mono font-bold uppercase text-gray-400 tracking-wider">
                      <th className="py-4 px-6">Timestamp Coordinate</th>
                      <th className="py-4 px-6">System Action Event</th>
                      <th className="py-4 px-6">Source IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {stats?.logs && stats.logs.map((log: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-4 px-6 font-mono text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-950">{log.action}</td>
                        <td className="py-4 px-6 font-mono text-teal-700 font-semibold">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================== TAB: USER MANAGEMENT ================== */}
        {activeTab === 'users' && (
          <div className="space-y-8 animate-fade-in text-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 pb-5">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-gray-950">User Management</h1>
                <p className="text-xs text-gray-500 font-sans mt-1">Review and manage registered portal accounts (applicants and administrators).</p>
              </div>
              <button
                onClick={fetchUsers}
                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                title="Refresh users list"
              >
                <RefreshCcw className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute inset-y-0 left-0 pl-3.5 h-full w-4.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search users by name or email address..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-sans text-gray-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex gap-4">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-700 focus:outline-none focus:border-teal-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Administrators</option>
                  <option value="applicant">Applicants</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-700 focus:outline-none focus:border-teal-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active Accounts</option>
                  <option value="blocked">Blocked Accounts</option>
                  <option value="deleted">Deleted Accounts</option>
                </select>
              </div>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100 text-[10px] font-mono font-bold uppercase text-gray-400 tracking-wider">
                      <th className="py-4 px-6">User / Full Name</th>
                      <th className="py-4 px-6">Email Address</th>
                      <th className="py-4 px-6">Access Role</th>
                      <th className="py-4 px-6">Account Status</th>
                      <th className="py-4 px-6">Registration Date</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {(() => {
                      const filteredUsers = usersList.filter((usr) => {
                        const matchesSearch = !userSearch || 
                          (usr.fullName && usr.fullName.toLowerCase().includes(userSearch.toLowerCase())) ||
                          (usr.email && usr.email.toLowerCase().includes(userSearch.toLowerCase()));
                        const matchesRole = !userRoleFilter || usr.role === userRoleFilter;
                        
                        let matchesStatus = true;
                        if (userStatusFilter === 'blocked') {
                          matchesStatus = usr.isBlocked && !usr.isDeleted;
                        } else if (userStatusFilter === 'active') {
                          matchesStatus = !usr.isBlocked && !usr.isDeleted;
                        } else if (userStatusFilter === 'deleted') {
                          matchesStatus = usr.isDeleted;
                        } else {
                          // All Statuses: hide deleted users by default to avoid confusion
                          matchesStatus = !usr.isDeleted;
                        }
                        
                        return matchesSearch && matchesRole && matchesStatus;
                      });

                      if (filteredUsers.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="py-10 text-center text-gray-400">
                              No matching registered user accounts found.
                            </td>
                          </tr>
                        );
                      }

                      return filteredUsers.map((usr) => (
                        <tr key={usr.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6 font-semibold text-gray-950 flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-gray-600 border border-gray-200 uppercase">
                              {usr.fullName ? usr.fullName.substring(0, 2) : 'US'}
                            </div>
                            <span>{usr.fullName}</span>
                          </td>
                          <td className="py-4 px-6 font-mono text-gray-600">{usr.email}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                              usr.role === 'admin'
                                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                : 'bg-teal-50 text-teal-600 border border-teal-100'
                            }`}>
                              {usr.role || 'applicant'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {usr.isDeleted ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-300">
                                🗑 Deleted
                              </span>
                            ) : usr.isBlocked ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                                🚫 Blocked
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 font-mono text-gray-400">
                            {new Date(usr.createdAt).toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setEmailModalUser(usr);
                                setEmailSubjectInput('Important Notice Regarding Your Application');
                                setEmailMessageInput(`Dear ${usr.fullName || 'Candidate'},\n\n`);
                              }}
                              className="px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 cursor-pointer transition text-[10px] uppercase tracking-wider border border-slate-200"
                              title="Send administrative email"
                            >
                              📧 Email
                            </button>
                            <button
                              onClick={() => {
                                const parts = (usr.fullName || '').split(' ');
                                const fName = parts[0] || '';
                                const lName = parts.slice(1).join(' ') || '';
                                setEditUserForm({
                                  firstName: fName,
                                  lastName: lName,
                                  email: usr.email || '',
                                  phone: usr.phone || '',
                                  role: usr.role || 'applicant',
                                  permissions: usr.permissions || []
                                });
                                setSelectedManageUser(usr);
                                setShowUserModal(true);
                                setUserModalTab('profile');
                              }}
                              className="px-2.5 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 rounded-lg font-bold cursor-pointer transition text-[10px] uppercase tracking-wider"
                              title="Manage profile, role, and sub-admin permissions"
                            >
                              ⚙ Manage
                            </button>
                            {usr.role !== 'admin' && (
                              <>
                                {usr.isDeleted ? (
                                  <button
                                    onClick={() => handleRestoreUser(usr.id || usr._id)}
                                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold cursor-pointer transition text-[10px] uppercase tracking-wider"
                                    title="Restore user account"
                                  >
                                    Restore
                                  </button>
                                ) : (
                                  <>
                                    {usr.isBlocked ? (
                                      <button
                                        onClick={() => handleUnblockUser(usr.id || usr._id)}
                                        className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold cursor-pointer transition text-[10px] uppercase tracking-wider"
                                        title="Unblock user account"
                                      >
                                        Unblock
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleBlockUser(usr.id || usr._id)}
                                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold cursor-pointer transition text-[10px] uppercase tracking-wider"
                                        title="Block user account"
                                      >
                                        Block
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteUser(usr.id || usr._id)}
                                      className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold cursor-pointer transition text-[10px] uppercase tracking-wider"
                                      title="Soft-delete user account"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* USER PROFILE DETAILS & SUB-ADMIN PERMISSIONS MODAL */}
            {showUserModal && selectedManageUser && (
              <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center z-[999999] p-4 font-sans animate-fade-in">
                <div className="bg-white border border-gray-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative flex flex-col space-y-4 text-gray-900">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="text-gray-950 font-extrabold text-base">Manage Account: {selectedManageUser.fullName}</h3>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">ID: {selectedManageUser.id || selectedManageUser._id}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserModal(false);
                        setSelectedManageUser(null);
                      }}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setUserModalTab('profile')}
                      className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                        userModalTab === 'profile'
                          ? 'border-teal-600 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      👤 Profile Information
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserModalTab('permissions')}
                      className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                        userModalTab === 'permissions'
                          ? 'border-teal-600 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      🔑 Sub-Admin Permissions
                    </button>
                  </div>

                  {userModalTab === 'profile' ? (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={editUserForm.firstName}
                            onChange={(e) => setEditUserForm({ ...editUserForm, firstName: e.target.value })}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={editUserForm.lastName}
                            onChange={(e) => setEditUserForm({ ...editUserForm, lastName: e.target.value })}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-sans"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={editUserForm.email}
                            onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. +92 300 1234567"
                            value={editUserForm.phone}
                            onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-sans"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">
                            Account Role
                          </label>
                          <select
                            value={editUserForm.role}
                            onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all cursor-pointer font-sans"
                          >
                            <option value="applicant">Applicant (Regular candidate)</option>
                            <option value="sub_admin">Sub Admin (Configurable access)</option>
                            <option value="admin">Main Administrator (Full control)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">
                            Total Application Files
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={selectedManageUser.totalApplications || 0}
                            className="w-full bg-slate-100 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-500 cursor-not-allowed font-sans"
                          />
                        </div>
                      </div>

                      {/* Readonly info list */}
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Registration Date:</span>
                          <span className="font-mono font-bold text-gray-800">{new Date(selectedManageUser.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Account Status:</span>
                          <span className={`font-bold ${selectedManageUser.isBlocked ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {selectedManageUser.isBlocked ? '🚫 Blocked / Suspended' : '✅ Active'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Last Portal Connection:</span>
                          <span className="font-semibold text-gray-600">Active Session Verified</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl">
                        <p className="text-xs text-teal-800 leading-relaxed font-sans">
                          <strong>💡 Configuration Workflow:</strong> Configure role-specific permissions for Sub-Administrators. These restrictions are enforced securely across both the visual interface and backend API routes. Main administrators always possess total global overrides.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                          Granted Sub-Admin Privileges
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { name: 'View Dashboard', desc: 'View metrics and real-time visitor traffic charts' },
                            { name: 'View Applications', desc: 'Browse and search candidate profiles' },
                            { name: 'Manage Jobs', desc: 'Create, modify, and delete job postings' },
                            { name: 'Send Emails', desc: 'Dispatch emails to candidates' },
                            { name: 'Approve Applications', desc: 'Approve or verify candidates and payments' },
                            { name: 'Reject Applications', desc: 'Decline candidate files and document reasons' }
                          ].map((perm) => {
                            const isChecked = editUserForm.permissions.includes(perm.name);
                            return (
                              <label
                                key={perm.name}
                                className={`flex items-start p-3 border rounded-xl cursor-pointer transition-all hover:bg-slate-50 ${
                                  isChecked ? 'border-teal-200 bg-teal-50/20' : 'border-gray-200 bg-white'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    let perms = [...editUserForm.permissions];
                                    if (e.target.checked) {
                                      perms.push(perm.name);
                                    } else {
                                      perms = perms.filter((p) => p !== perm.name);
                                    }
                                    setEditUserForm({ ...editUserForm, permissions: perms });
                                  }}
                                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                />
                                <div className="ml-2.5">
                                  <span className="block text-xs font-bold text-gray-900">{perm.name}</span>
                                  <span className="block text-[10px] text-gray-400 mt-0.5 leading-normal">{perm.desc}</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserModal(false);
                        setSelectedManageUser(null);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={userFormSaving}
                      onClick={async () => {
                        setUserFormSaving(true);
                        try {
                          const id = selectedManageUser.id || selectedManageUser._id;
                          const fullName = `${editUserForm.firstName} ${editUserForm.lastName}`.trim();
                          
                          // Update basic profile details
                          await apiFetch(`/admin/users/${id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              fullName,
                              email: editUserForm.email,
                              phone: editUserForm.phone,
                            }),
                          });

                          // Update role & sub-admin permissions
                          await apiFetch(`/admin/users/${id}/role`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              role: editUserForm.role,
                              permissions: editUserForm.permissions,
                            }),
                          });

                          await fetchUsers();
                          setShowUserModal(false);
                          setSelectedManageUser(null);
                        } catch (e: any) {
                          console.error("Failed to update user profile & permissions:", e);
                          alert("Error saving: " + e.message);
                        } finally {
                          setUserFormSaving(false);
                        }
                      }}
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {userFormSaving ? (
                        <>
                          <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Settings</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* EMAIL SENDING MODAL */}
            {emailModalUser && (
              <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center z-[999999] p-4 font-sans animate-fade-in">
                <form onSubmit={handleSendAdminEmail} className="bg-white border border-gray-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative flex flex-col space-y-4">
                  <div>
                    <h3 className="text-gray-900 font-extrabold text-base">Send Custom Notice Email</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Direct notification will be dispatched to <strong className="text-teal-600">{emailModalUser.email}</strong>.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        required
                        value={emailSubjectInput}
                        onChange={(e) => setEmailSubjectInput(e.target.value)}
                        placeholder="Notice subject line"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-sans font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Message Content (Admissions Notice)
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={emailMessageInput}
                        onChange={(e) => setEmailMessageInput(e.target.value)}
                        placeholder="Draft your message..."
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-sans font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={sendingEmail}
                      className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 border-none outline-none"
                    >
                      {sendingEmail ? (
                        <>
                          <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <span>Dispatch Notice</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailModalUser(null)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer border border-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ================== TAB: EMAIL MANAGEMENT ================== */}
        {activeTab === 'emails' && (
          <div className="space-y-8 animate-fade-in text-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 pb-5">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-gray-950">Email Management System</h1>
                <p className="text-xs text-gray-500 font-sans mt-1">Design, preview, and dispatch custom or templated HTML notifications to single, multiple, or all users.</p>
              </div>
              <button
                onClick={() => { fetchUsers(); fetchStats(); }}
                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                title="Refresh logs and user database"
              >
                <RefreshCcw className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Email Composer */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <Mail className="h-4 w-4 text-teal-600" /> Email Composer
                </h2>

                <div className="space-y-4">
                  {/* Recipient Mode Selector */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-2">Recipient Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'single', name: 'Single User' },
                        { id: 'multiple', name: 'Multiple Users' },
                        { id: 'all', name: 'All Users' }
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => {
                            setEmailRecipientMode(mode.id as any);
                            setSelectedRecipients([]);
                          }}
                          className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                            emailRecipientMode === mode.id
                              ? 'bg-teal-600 border-teal-600 text-white font-bold'
                              : 'bg-slate-50 border-gray-200 text-gray-600 hover:bg-slate-100'
                          }`}
                        >
                          {mode.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient Selector Dropdowns */}
                  {emailRecipientMode === 'single' && (
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Select Target User</label>
                      <select
                        value={selectedRecipients[0] || ''}
                        onChange={(e) => setSelectedRecipients([e.target.value])}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-sans text-gray-700 focus:outline-none focus:border-teal-500 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="">-- Choose a user email --</option>
                        {usersList.map((usr: any) => (
                          <option key={usr.id} value={usr.email}>
                            {usr.fullName} ({usr.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {emailRecipientMode === 'multiple' && (
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Select Recipient Group (Hold Ctrl/Cmd to select multiple)</label>
                      <select
                        multiple
                        value={selectedRecipients}
                        onChange={(e) => {
                          const options = e.target.options;
                          const values: string[] = [];
                          for (let i = 0; i < options.length; i++) {
                            if (options[i].selected) {
                              values.push(options[i].value);
                            }
                          }
                          setSelectedRecipients(values);
                        }}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2 text-xs font-sans text-gray-700 focus:outline-none focus:border-teal-500 focus:bg-white transition-all cursor-pointer h-32"
                      >
                        {usersList.map((usr: any) => (
                          <option key={usr.id} value={usr.email}>
                            {usr.fullName} ({usr.email})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-gray-400 mt-1">{selectedRecipients.length} recipients selected.</p>
                    </div>
                  )}

                  {emailRecipientMode === 'all' && (
                    <div className="bg-teal-50 border border-teal-100 p-3 rounded-2xl">
                      <p className="text-xs text-teal-800 font-sans font-medium">
                        📣 Broadcaster Mode: Email will be securely dispatched to all <strong>{usersList.length}</strong> registered accounts in MongoDB.
                      </p>
                    </div>
                  )}

                  {/* Subject Line */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Subject Line</label>
                    <input
                      type="text"
                      required
                      value={emailComposerSubject}
                      onChange={(e) => setEmailComposerSubject(e.target.value)}
                      placeholder="e.g., Application Update - HYDROCEAN Admissions"
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-sans font-bold"
                    />
                  </div>

                  {/* HTML Template Picker */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Select HTML Blueprint / Template</label>
                    <select
                      value={selectedEmailTemplate}
                      onChange={(e) => {
                        const templateId = e.target.value;
                        setSelectedEmailTemplate(templateId);
                        applyEmailTemplate(templateId);
                      }}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-sans text-gray-700 focus:outline-none focus:border-teal-500 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="custom">Custom HTML Composition (Blank)</option>
                      <option value="welcome">Welcome Onboarding Email</option>
                      <option value="payment_approved">Bank Deposit Slip Verification Approved</option>
                      <option value="application_status">Hiring Process Status Alert (Interview Scheduled)</option>
                    </select>
                  </div>

                  {/* HTML Composer Editor */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">HTML Message Code</label>
                    <textarea
                      required
                      rows={12}
                      value={emailComposerBody}
                      onChange={(e) => setEmailComposerBody(e.target.value)}
                      placeholder="Compose your HTML markup or plaintext here..."
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-mono leading-relaxed"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendBulkEmail}
                    disabled={sendingEmail || (emailRecipientMode !== 'all' && selectedRecipients.length === 0)}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none outline-none shadow-md hover:shadow-lg"
                  >
                    {sendingEmail ? (
                      <>
                        <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Dispatching Emails...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Send Administrative Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Live HTML Email Preview */}
              <div className="bg-slate-900 border border-slate-950 rounded-3xl p-6 shadow-xl flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                    🖥️ Interactive Visual Preview
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-teal-950 text-teal-400 border border-teal-900 uppercase">Live Render</span>
                </div>

                <div className="border border-slate-800 bg-slate-950 rounded-2xl overflow-hidden flex-1 flex flex-col min-h-[400px]">
                  {/* Email header mockup */}
                  <div className="p-4 border-b border-slate-800 text-xs font-mono text-gray-400 space-y-1">
                    <div><span className="text-gray-500 font-bold">To:</span> <span className="text-teal-400">{emailRecipientMode === 'all' ? 'All Registered Users' : selectedRecipients.join(', ') || '(Select Recipient)'}</span></div>
                    <div><span className="text-gray-500 font-bold">Subject:</span> <span className="text-white font-bold">{emailComposerSubject || '(No Subject)'}</span></div>
                  </div>
                  
                  {/* HTML rendered in safe container area */}
                  <div className="p-4 bg-white flex-1 overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: emailComposerBody }} />
                  </div>
                </div>
              </div>
            </div>

            {/* LOWER SUB-PANEL: Email Delivery and Failure Logs */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-3 flex items-center space-x-4">
                <h2 className="text-base font-extrabold text-gray-950">Administrative Email Auditing</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEmailLogFilter('success')}
                    className={`py-1 px-3 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      emailLogFilter === 'success'
                        ? 'bg-teal-50 border-teal-200 text-teal-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-slate-50'
                    }`}
                  >
                    🟢 Delivery Success Logs
                  </button>
                  <button
                    onClick={() => setEmailLogFilter('failure')}
                    className={`py-1 px-3 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      emailLogFilter === 'failure'
                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-slate-50'
                    }`}
                  >
                    🔴 Delivery Failure Logs
                  </button>
                </div>
              </div>

              {loadingStats ? (
                <div className="flex justify-center py-10">
                  <div className="h-6 w-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs font-sans">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-100 text-[10px] font-mono font-bold uppercase text-gray-400 tracking-wider">
                        <th className="py-4 px-6">Timestamp</th>
                        <th className="py-4 px-6">Recipient Email</th>
                        <th className="py-4 px-6">Operation Action</th>
                        {emailLogFilter === 'failure' && <th className="py-4 px-6 text-rose-600">Error Failure Cause</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {(() => {
                        const emailLogs = (stats?.logs || []).filter((log: any) => {
                          if (emailLogFilter === 'success') {
                            return log.action.startsWith('EMAIL_DELIVERY_SUCCESS:');
                          } else {
                            return log.action.startsWith('EMAIL_DELIVERY_FAILURE:');
                          }
                        });

                        if (emailLogs.length === 0) {
                          return (
                            <tr>
                              <td colSpan={emailLogFilter === 'failure' ? 4 : 3} className="py-10 text-center text-gray-400 font-medium">
                                No logged {emailLogFilter === 'success' ? 'successful delivery' : 'failed delivery'} events found.
                              </td>
                            </tr>
                          );
                        }

                        return emailLogs.map((log: any, idx: number) => {
                          const rawAction = log.action;
                          let recipient = 'Unknown';
                          let subject = '';
                          let errorMsg = '';

                          if (emailLogFilter === 'success') {
                            const match = rawAction.match(/Sent email to (.*?) \(Subject: "(.*?)"\)/);
                            if (match) {
                              recipient = match[1];
                              subject = match[2];
                            }
                          } else {
                            const match = rawAction.match(/Failed to send email to (.*?) \(Subject: "(.*?)"\) Error: (.*)/);
                            if (match) {
                              recipient = match[1];
                              subject = match[2];
                              errorMsg = match[3];
                            } else {
                              recipient = rawAction;
                            }
                          }

                          return (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="py-4 px-6 font-mono text-gray-400">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td className="py-4 px-6 font-mono font-bold text-gray-950">{recipient}</td>
                              <td className="py-4 px-6">
                                <span className="font-semibold text-gray-800">Subject: "{subject || 'System Automated Alert'}"</span>
                              </td>
                              {emailLogFilter === 'failure' && (
                                <td className="py-4 px-6 text-rose-600 font-mono text-xs font-semibold max-w-xs truncate" title={errorMsg}>
                                  {errorMsg}
                                </td>
                              )}
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================== TAB: CONTACT MESSAGES ================== */}
        {activeTab === 'contacts' && (
          <div className="space-y-8 animate-fade-in text-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 pb-5">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-gray-950">Contact Message Center</h1>
                <p className="text-xs text-gray-500 font-sans mt-1">Real-time inquiries, secure feedback, and replies powered by Resend.</p>
              </div>
              <button
                onClick={fetchContacts}
                disabled={loadingContacts}
                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh contact logs"
              >
                <RefreshCcw className={`h-4 w-4 text-gray-500 ${loadingContacts ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Filters and Search Bar */}
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center text-xs font-sans">
              <div className="relative w-full sm:max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search by sender name, email, or keywords..."
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 justify-end">
                <span className="text-gray-500 font-semibold flex items-center">
                  <Filter className="h-3.5 w-3.5 mr-1" /> Status Filter:
                </span>
                <select
                  value={contactStatusFilter}
                  onChange={(e) => setContactStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:border-teal-500 transition-colors"
                >
                  <option value="">All Inquiries</option>
                  <option value="Unread">🔴 Unread</option>
                  <option value="Read">🔵 Read</option>
                  <option value="Replied">🟢 Replied</option>
                </select>
              </div>
            </div>

            {loadingContacts ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100 text-[10px] font-mono font-bold uppercase text-gray-400 tracking-wider">
                      <th className="py-4 px-6">Received Timestamp</th>
                      <th className="py-4 px-6">Sender Details</th>
                      <th className="py-4 px-6">Subject Title</th>
                      <th className="py-4 px-6">Status Marker</th>
                      <th className="py-4 px-6 text-right">Actions Panel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {(() => {
                      const filtered = contacts.filter((c) => {
                        const term = contactSearch.toLowerCase().trim();
                        const matchSearch =
                          !term ||
                          c.name.toLowerCase().includes(term) ||
                          c.email.toLowerCase().includes(term) ||
                          c.subject.toLowerCase().includes(term) ||
                          c.message.toLowerCase().includes(term);

                        const matchStatus = !contactStatusFilter || c.status === contactStatusFilter;

                        return matchSearch && matchStatus;
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="py-16 text-center text-gray-400 font-medium text-xs">
                              No contact inquiries matching criteria were found.
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map((c: any) => {
                        const idStr = c.id || c._id;
                        return (
                          <tr key={idStr} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-6 font-mono text-gray-400">
                              {new Date(c.createdAt).toLocaleString()}
                            </td>
                            <td className="py-4 px-6">
                              <span className="font-bold text-gray-950 block">{c.name}</span>
                              <span className="text-gray-500 font-mono text-[10px] mt-0.5 block">{c.email}</span>
                            </td>
                            <td className="py-4 px-6 font-semibold text-gray-800 max-w-xs truncate" title={c.subject}>
                              {c.subject}
                            </td>
                            <td className="py-4 px-6">
                              {c.status === 'Unread' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
                                  Unread Inquiry
                                </span>
                              )}
                              {c.status === 'Read' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500 mr-1.5"></span>
                                  Read / Opened
                                </span>
                              )}
                              {c.status === 'Replied' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                                  Replied Dispatched
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-right space-x-2 shrink-0">
                              <button
                                onClick={() => handleMarkAsRead(c)}
                                className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer border border-gray-100 inline-flex items-center"
                                title="Open Message details"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteContact(idStr)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer border border-rose-100 inline-flex items-center"
                                title="Delete inquiry permanently"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================== MODAL: CONTACT INQUIRY DETAIL & REPLY ================== */}
        {showContactModal && selectedContact && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-100 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-xs font-sans animate-fade-in text-gray-900 relative">
              
              <button
                onClick={() => { setShowContactModal(false); setSelectedContact(null); }}
                className="absolute top-5 right-5 p-1.5 bg-slate-50 border border-gray-100 hover:bg-slate-100 text-gray-500 rounded-xl transition cursor-pointer"
                title="Dismiss modal"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="border-b border-gray-100 pb-4">
                <span className="text-[10px] font-mono font-bold text-teal-600 tracking-wider uppercase">Contact Inquiry Ticket</span>
                <h3 className="font-display font-extrabold text-base text-gray-950 mt-1">{selectedContact.subject}</h3>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                  Submitted at: {new Date(selectedContact.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Sender coordinates */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-gray-100 rounded-2xl">
                <div>
                  <span className="text-gray-400 font-semibold block uppercase text-[9px] tracking-wide">Sender Name</span>
                  <span className="font-bold text-gray-950 text-xs mt-0.5 block">{selectedContact.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase text-[9px] tracking-wide">Sender Email</span>
                  <span className="font-mono font-bold text-teal-700 text-xs mt-0.5 block">{selectedContact.email}</span>
                </div>
              </div>

              {/* Inquiry Message */}
              <div className="space-y-1.5">
                <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wide">Message Content</span>
                <div className="bg-slate-950 text-slate-100 font-sans p-4 rounded-2xl border border-slate-900 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedContact.message}
                </div>
              </div>

              {/* Reply Section */}
              {selectedContact.status === 'Replied' ? (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold uppercase text-[9px] tracking-wider">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Inquiry Replied Dispatched</span>
                  </div>
                  <p className="text-gray-500 font-mono text-[10px]">
                    Replied on: {selectedContact.repliedAt ? new Date(selectedContact.repliedAt).toLocaleString() : 'N/A'}
                  </p>
                  <div className="bg-white border border-emerald-100 p-3 rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed italic">
                    {selectedContact.replyMessage}
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendReply(selectedContact.id || selectedContact._id);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-semibold uppercase text-[9px] tracking-wide block">
                      Draft Response Reply (Sent via Resend HTML Engine)
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Type your official administrative reply here. This will format as a professional Hydrocean Robotics letterhead template..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:border-teal-500 transition-colors resize-none leading-relaxed"
                    ></textarea>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={sendingReply}
                      className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-lg transition cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {sendingReply ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Dispatch Reply</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowContactModal(false); setSelectedContact(null); }}
                      className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
