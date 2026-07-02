/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { DBService } from '../services/db.service';
import { MailService } from '../services/mail.service';

export class ApplicationController {
  /**
   * Complete, secure composite submission for recruitment application
   */
  static async submitApplication(req: Request, res: Response) {
    const {
      jobId,
      jobTitle,
      fullName,
      fatherName,
      email,
      whatsAppNumber,
      cnic, // optional or registration
      city,
      province,
      skills,
      experience,
      passportAvailable,
      passportFileUrl,
      candidatePictureUrl,
      cvUrl,
      paymentSlipUrl,
      transactionId,
      paymentStatus, // 'Paid' | 'Pending Verification'
    } = req.body;

    // 1. Validation Checks
    if (!jobId || !jobTitle) {
      return res.status(400).json({ error: 'Selected career profile is required.' });
    }

    if (!fullName || !fatherName || !whatsAppNumber || !skills || !experience) {
      return res.status(400).json({ error: 'All personal registration fields are required.' });
    }

    const finalEmail = email || (req as any).user?.email || 'N/A';
    const finalCity = city || 'N/A';
    const finalProvince = province || 'N/A';

    // 2. Document upload validation check
    if (!cvUrl) {
      return res.status(400).json({ error: 'Candidate CV/Resume upload is required.' });
    }
    if (!candidatePictureUrl) {
      return res.status(400).json({ error: 'Candidate photo upload is required.' });
    }
    if (!paymentSlipUrl) {
      return res.status(400).json({ error: 'Bank Deposit Slip receipt upload is required.' });
    }

    // Passport conditional check
    if (passportAvailable === 'Yes' && !passportFileUrl) {
      // User has passport, let's make it optional as per:
      // "If Passport is "Yes," passport upload becomes optional."
    }

    let finalCvUrl = cvUrl;
    let finalPictureUrl = candidatePictureUrl;
    let finalPaymentSlipUrl = paymentSlipUrl;
    let finalPassportFileUrl = passportFileUrl;

    try {
      const { UploadService } = await import('../services/upload.service');
      
      if (cvUrl && cvUrl.startsWith('data:')) {
        finalCvUrl = await UploadService.saveBase64File(cvUrl, 'cv', ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'webp'], 10 * 1024 * 1024);
      }
      if (candidatePictureUrl && candidatePictureUrl.startsWith('data:')) {
        finalPictureUrl = await UploadService.saveBase64File(candidatePictureUrl, 'picture', ['png', 'jpg', 'jpeg', 'webp'], 10 * 1024 * 1024);
      }
      if (paymentSlipUrl && paymentSlipUrl.startsWith('data:')) {
        finalPaymentSlipUrl = await UploadService.saveBase64File(paymentSlipUrl, 'receipt', ['png', 'jpg', 'jpeg', 'webp', 'pdf'], 10 * 1024 * 1024);
      }
      if (passportFileUrl && passportFileUrl.startsWith('data:')) {
        finalPassportFileUrl = await UploadService.saveBase64File(passportFileUrl, 'passport', ['pdf', 'png', 'jpg', 'jpeg', 'webp'], 10 * 1024 * 1024);
      }
    } catch (uploadErr: any) {
      return res.status(400).json({ error: 'Document upload to Cloudinary failed: ' + uploadErr.message });
    }

    try {
      const { bankDetails } = await DBService.getSettingsBundle();

      // Extrapolate authenticated applicant ID for strict duplicate checks
      let authUserId: string | undefined = undefined;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const { verifyToken } = await import('../middleware/auth.middleware');
          const verified = verifyToken(token);
          if (verified && verified.email) {
            authUserId = verified.id || verified.email;
          }
        } catch (tokenErr) {
          // silent ignore
        }
      }

      // Enforce duplicate application check by user ID / Email / Job ID
      if (finalEmail && finalEmail !== 'N/A') {
        const isDupApp = await DBService.isApplicationDuplicate(jobId, finalEmail, authUserId);
        if (isDupApp) {
          return res.status(400).json({ error: 'You have already applied for this position.' });
        }
      }

      // Prevent duplicate CNIC/submissions if CNIC is provided
      if (cnic) {
        const isDup = await DBService.isCnicDuplicate(jobId, cnic);
        if (isDup) {
          return res.status(400).json({ error: 'An application with this registration/CNIC already exists for this vacancy.' });
        }
      }

      // Assemble structured entities
      const applicationPayload = {
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
          paymentStatus: paymentStatus || 'Pending Verification',
          paymentMethod: 'Bank Deposit',
          transactionId: transactionId || `TXN-${Date.now()}`,
          amount: bankDetails.amount || 2500,
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
          jobTitle,
          city: finalCity,
          province: finalProvince,
          email: finalEmail,
        },
      };

      const appId = await DBService.createRecruitmentApplication(applicationPayload);

      // Add audit log
      await DBService.addLog(`New application registered for ${fullName} (${jobTitle})`, req.ip || '127.0.0.1');

      return res.status(201).json({
        success: true,
        applicationId: appId,
        message: 'Your recruitment application has been successfully submitted! It is pending payment verification.',
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to compile application: ' + err.message });
    }
  }

  /**
   * Admin routes: Get and search/filter applications
   */
  static async getApplicationsForAdmin(req: Request, res: Response) {
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
      return res.status(500).json({ error: 'Failed to load applications: ' + err.message });
    }
  }

  /**
   * Admin: Approve/Verify/Reject payment or update status
   */
  static async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status, internalNotes, rejectionReason } = req.body;

    try {
      const updated = await DBService.updateApplicationStatus(id, { status, internalNotes, rejectionReason });
      if (!updated) {
        return res.status(404).json({ error: 'Application record not found.' });
      }

      await DBService.addLog(
        `Application state for ID ${id} updated to: ${status || 'Unchanged'}. Notes/Rejection reason appended.`,
        req.ip || '127.0.0.1'
      );

      // Create in-app notification for the applicant
      if (status && updated.applicantId) {
        let type: 'info' | 'success' | 'warning' | 'error' = 'info';
        let title = 'Application Status Updated';
        let msg = `Your application for ${updated.jobTitle || 'Vacancy'} is now: ${status}.`;

        if (status === 'Verified' || status === 'Payment Verified') {
          type = 'success';
          title = 'Fee Deposit Verified';
          msg = 'Your application fee transfer has been verified successfully.';
        } else if (status === 'Rejected') {
          type = 'error';
          title = 'Application Rejected';
          msg = `Your application was declined.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`;
        } else if (status === 'Approved' || status === 'Selected') {
          type = 'success';
          title = 'Application Approved';
          msg = 'Congratulations! Your application has been approved and marked as Selected.';
        } else if (status === 'Under Review' || status === 'Shortlisted') {
          type = 'info';
          title = 'Application Under Review';
          msg = `Your profile is currently under review for ${updated.jobTitle || 'the vacancy'}.`;
        }

        // Get applicant details to get their email as applicantId identifier
        await DBService.createNotification({
          applicantId: updated.email || updated.applicantId,
          title,
          message: msg,
          type,
        });

        // Send status change email
        if (updated.email) {
          try {
            await MailService.sendStatusUpdateEmail(
              updated.email,
              updated.fullName,
              status,
              rejectionReason
            );
          } catch (mailErr: any) {
            console.error(`[CONTROLLER] Failed sending status email to ${updated.email}:`, mailErr);
          }
        }
      }

      return res.json({ success: true, application: updated, message: 'Status updated successfully.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to update record: ' + err.message });
    }
  }

  /**
   * Admin: Delete application
   */
  static async deleteApplication(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const success = await DBService.deleteApplication(id);
      if (!success) {
        return res.status(404).json({ error: 'Application record not found.' });
      }

      await DBService.addLog(`Application ID ${id} deleted by Administrator.`, req.ip || '127.0.0.1');
      return res.json({ success: true, message: 'Application deleted successfully.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Deletion failed: ' + err.message });
    }
  }
}
