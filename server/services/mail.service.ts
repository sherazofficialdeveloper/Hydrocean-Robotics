/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Resend } from 'resend';
import nodemailer from 'nodemailer';

export class MailService {
  private static resendClient: Resend | null = null;
  private static nodemailerTransporter: any = null;

  /**
   * Initializes the Nodemailer SMTP transporter lazily.
   */
  private static async getNodemailerTransporter(): Promise<any> {
    if (this.nodemailerTransporter) {
      return this.nodemailerTransporter;
    }

    let host = process.env.SMTP_HOST;
    let port = process.env.SMTP_PORT;
    let user = process.env.SMTP_USER;
    let pass = process.env.SMTP_PASS;

    try {
      const { DBService } = await import('./db.service');
      const bundle = await DBService.getSettingsBundle();
      if (bundle && bundle.settings) {
        if (bundle.settings.smtpHost) host = bundle.settings.smtpHost;
        if (bundle.settings.smtpUser) user = bundle.settings.smtpUser;
        if (bundle.settings.smtpPass) pass = bundle.settings.smtpPass;
        if (bundle.settings.smtpPort) port = bundle.settings.smtpPort;
      }
    } catch (e) {
      console.warn('[MAIL SERVICE] Failed to load dynamic database settings for SMTP:', e.message);
    }

    if (!host || !user || !pass) {
      console.warn(
        '[MAIL SERVICE] Nodemailer SMTP configuration (SMTP_HOST, SMTP_USER, SMTP_PASS) is missing from environment/database. Authentication emails will use simulation / console logs on localhost.'
      );
      return null;
    }

    try {
      this.nodemailerTransporter = nodemailer.createTransport({
        host,
        port: port ? parseInt(String(port), 10) : 587,
        secure: process.env.SMTP_SECURE === 'true' || String(port) === '465',
        auth: {
          user,
          pass,
        },
      });
      return this.nodemailerTransporter;
    } catch (err) {
      console.error('[MAIL SERVICE] Failed to initialize Nodemailer SMTP transporter:', err);
      return null;
    }
  }

  /**
   * Initializes the Resend client lazily to prevent server crashes if the API key is not yet set.
   */
  private static async getResendClient(): Promise<Resend | null> {
    let key = process.env.RESEND_API_KEY;

    try {
      const { DBService } = await import('./db.service');
      const bundle = await DBService.getSettingsBundle();
      if (bundle && bundle.settings && bundle.settings.resendApiKey) {
        key = bundle.settings.resendApiKey;
      }
    } catch (e) {}

    if (!key) {
      console.warn(
        '[MAIL SERVICE] RESEND_API_KEY is missing from environment and settings. Emails will fail to send in production. Falling back to console logging for debugging.'
      );
      return null;
    }

    try {
      return new Resend(key);
    } catch (err) {
      console.error('[MAIL SERVICE] Failed to initialize Resend client:', err);
      return null;
    }
  }

  /**
   * Gets the sender address
   */
  private static async getFromAddress(): Promise<string> {
    let from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    try {
      const { DBService } = await import('./db.service');
      const bundle = await DBService.getSettingsBundle();
      if (bundle && bundle.settings && bundle.settings.resendSenderEmail) {
        from = bundle.settings.resendSenderEmail;
      }
    } catch (e) {}
    return from;
  }

  /**
   * Send 6-digit verification code to the applicant via Nodemailer SMTP
   */
  static async sendOtpEmail(
    to: string,
    fullName: string,
    otp: string
  ): Promise<{ success: boolean; message?: string }> {
    const transporter = await this.getNodemailerTransporter();
    const from = await this.getFromAddress();
    const cleanTo = to.toLowerCase().trim();
    const subject = `[HYDROCEAN] ${otp} is your verification pin`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>HYDROCEAN Email Verification</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #020617;
            color: #f1f5f9;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 20px;
            padding: 32px;
            text-align: center;
          }
          .logo {
            color: #009ca6;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.05em;
            margin-bottom: 24px;
          }
          .logo-sub {
            font-size: 9px;
            color: #64748b;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-top: 4px;
          }
          h1 {
            font-size: 20px;
            color: #ffffff;
            margin-bottom: 8px;
            font-weight: 700;
          }
          p {
            font-size: 14px;
            color: #94a3b8;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .otp-card {
            background-color: #020617;
            border: 1px dashed #009ca6;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
          }
          .otp-code {
            font-family: 'Courier New', Courier, monospace;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 0.3em;
            color: #009ca6;
            margin: 0;
            padding-left: 0.3em;
          }
          .footer {
            font-size: 11px;
            color: #475569;
            margin-top: 32px;
            border-top: 1px solid #1e293b;
            padding-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            HYDROCEAN
            <div class="logo-sub">Robotics & Vehicles</div>
          </div>
          <h1>Verify your Email Address</h1>
          <p>Hello ${fullName},<br>Thank you for registering. Please enter the following 6-digit verification code to complete your admission recruitment file setup:</p>
          
          <div class="otp-card">
            <h2 class="otp-code">${otp}</h2>
          </div>
          
          <p>This validation code is secure and will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
          
          <div class="footer">
            &copy; ${new Date().getFullYear()} HYDROCEAN. All rights reserved.<br>
            Secure Admissions Portal Verification System.
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `Hello ${fullName},\n\nYour HYDROCEAN verification pin is ${otp}.\n\nThis code will expire in 10 minutes.\n\nThank you,\nHYDROCEAN Robotics & Vehicles`;

    if (transporter) {
      try {
        await transporter.sendMail({
          from,
          to: cleanTo,
          subject,
          text,
          html,
        });

        console.log(`[MAIL SERVICE] OTP sent to ${cleanTo} via Nodemailer.`);
        return { success: true };
      } catch (err: any) {
        console.error(`[MAIL SERVICE] Nodemailer OTP sending failed to ${cleanTo}:`, err);
        return { success: false, message: err.message || 'Nodemailer SMTP delivery failed.' };
      }
    } else {
      console.log(`\n======================================================\n[MAIL SERVICE SIMULATION] SENDING TO: ${cleanTo}\nNAME: ${fullName}\nOTP CODE: ${otp}\n======================================================\n`);
      return { success: true, message: 'SMTP/Nodemailer not configured. Logged to console.' };
    }
  }

  /**
   * Send 6-digit verification code to the user for password reset
   */
  /**
   * Send 6-digit verification code to the user for password reset via Nodemailer SMTP
   */
  static async sendResetOtpEmail(
    to: string,
    fullName: string,
    otp: string
  ): Promise<{ success: boolean; message?: string }> {
    const transporter = await this.getNodemailerTransporter();
    const from = await this.getFromAddress();
    const cleanTo = to.toLowerCase().trim();
    const subject = `[HYDROCEAN] ${otp} is your password reset pin`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>HYDROCEAN Password Reset</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #020617;
            color: #f1f5f9;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 20px;
            padding: 32px;
            text-align: center;
          }
          .logo {
            color: #009ca6;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.05em;
            margin-bottom: 24px;
          }
          .logo-sub {
            font-size: 9px;
            color: #64748b;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-top: 4px;
          }
          h1 {
            font-size: 20px;
            color: #ffffff;
            margin-bottom: 8px;
            font-weight: 700;
          }
          p {
            font-size: 14px;
            color: #94a3b8;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .otp-card {
            background-color: #020617;
            border: 1px dashed #009ca6;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
          }
          .otp-code {
            font-family: 'Courier New', Courier, monospace;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 0.3em;
            color: #009ca6;
            margin: 0;
            padding-left: 0.3em;
          }
          .footer {
            font-size: 11px;
            color: #475569;
            margin-top: 32px;
            border-top: 1px solid #1e293b;
            padding-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            HYDROCEAN
            <div class="logo-sub">Robotics & Vehicles</div>
          </div>
          <h1>Reset your Password</h1>
          <p>Hello ${fullName},<br>We received a request to reset your password. Please enter the following 6-digit reset code on the reset page:</p>
          
          <div class="otp-card">
            <h2 class="otp-code">${otp}</h2>
          </div>
          
          <p>This validation code is secure and will expire in <strong>15 minutes</strong>. If you did not request this, please ignore this email and secure your account.</p>
          
          <div class="footer">
            &copy; ${new Date().getFullYear()} HYDROCEAN. All rights reserved.<br>
            Secure Admissions Portal Verification System.
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `Hello ${fullName},\n\nYour HYDROCEAN password reset pin is ${otp}.\n\nThis code will expire in 15 minutes.\n\nThank you,\nHYDROCEAN Robotics & Vehicles`;

    if (transporter) {
      try {
        await transporter.sendMail({
          from,
          to: cleanTo,
          subject,
          text,
          html,
        });

        console.log(`[MAIL SERVICE] Reset pin sent to ${cleanTo} via Nodemailer.`);
        return { success: true };
      } catch (err: any) {
        console.error(`[MAIL SERVICE] Nodemailer reset sending failed to ${cleanTo}:`, err);
        return { success: false, message: err.message || 'Nodemailer SMTP delivery failed.' };
      }
    } else {
      console.log(`\n======================================================\n[MAIL SERVICE SIMULATION] SENDING RESET OTP TO: ${cleanTo}\nNAME: ${fullName}\nOTP CODE: ${otp}\n======================================================\n`);
      return { success: true, message: 'SMTP/Nodemailer not configured. Logged to console.' };
    }
  }

  /**
   * Send Welcome Email automatically after successful registration verification via Nodemailer SMTP
   */
  static async sendWelcomeEmail(
    to: string,
    firstName: string,
    appUrl?: string
  ): Promise<{ success: boolean; message?: string }> {
    const transporter = await this.getNodemailerTransporter();
    const from = await this.getFromAddress();
    const cleanTo = to.toLowerCase().trim();
    const subject = `Welcome to HYDROCEAN Admissions Portal`;

    const loginUrl = appUrl || process.env.APP_URL || 'https://recruitment.hydrocean.com';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to HYDROCEAN</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #020617;
            color: #f1f5f9;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 20px;
            padding: 32px;
            text-align: center;
          }
          .logo {
            color: #009ca6;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.05em;
            margin-bottom: 24px;
          }
          .logo-sub {
            font-size: 9px;
            color: #64748b;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-top: 4px;
          }
          h1 {
            font-size: 22px;
            color: #ffffff;
            margin-bottom: 16px;
            font-weight: 700;
          }
          p {
            font-size: 14px;
            color: #94a3b8;
            line-height: 1.6;
            margin-bottom: 24px;
            text-align: left;
          }
          .btn {
            display: inline-block;
            background-color: #009ca6;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 32px;
            font-size: 14px;
            font-weight: 700;
            border-radius: 12px;
            margin: 16px auto;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .footer {
            font-size: 11px;
            color: #475569;
            margin-top: 32px;
            border-top: 1px solid #1e293b;
            padding-top: 16px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            HYDROCEAN
            <div class="logo-sub">Robotics & Vehicles</div>
          </div>
          <h1>Welcome to our Recruitment Portal</h1>
          <p>Dear ${firstName},</p>
          <p>Welcome to our Recruitment Portal. Your account has been successfully created and verified. You can now securely log in and apply for available positions. Thank you for joining us.</p>
          
          <a href="${loginUrl}" class="btn" style="color: #ffffff;">Login to Portal</a>
          
          <p style="margin-top: 24px; font-size: 12px; color: #64748b; text-align: center;">
            Need assistance? Contact our recruitment team at <a href="mailto:support@hydrocean.com" style="color: #009ca6; text-decoration: none;">support@hydrocean.com</a>
          </p>
          
          <div class="footer">
            &copy; ${new Date().getFullYear()} HYDROCEAN. All rights reserved.<br>
            Secure Admissions Portal Verification System.
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `Dear ${firstName},\n\nWelcome to our Recruitment Portal. Your account has been successfully created and verified. You can now securely log in and apply for available positions. Thank you for joining us.\n\nLogin URL: ${loginUrl}\n\nHYDROCEAN Robotics & Vehicles`;

    if (transporter) {
      try {
        await transporter.sendMail({
          from,
          to: cleanTo,
          subject,
          text,
          html,
        });
        console.log(`[MAIL SERVICE] Welcome email successfully sent to ${cleanTo} via Nodemailer.`);
        return { success: true };
      } catch (err: any) {
        console.error(`[MAIL SERVICE] Welcome email send failed to ${cleanTo}:`, err);
        return { success: false, message: err.message };
      }
    } else {
      console.log(`\n======================================================\n[MAIL SERVICE SIMULATION] SENDING WELCOME EMAIL TO: ${cleanTo}\nNAME: ${firstName}\n======================================================\n`);
      return { success: true };
    }
  }

  /**
   * Send Login Notification Email on successful authentication via Nodemailer SMTP
   */
  static async sendLoginNotificationEmail(
    to: string,
    fullName: string,
    loginDetails: {
      ip?: string;
      device?: string;
      browser?: string;
      date: string;
      time: string;
    }
  ): Promise<{ success: boolean; message?: string }> {
    const transporter = await this.getNodemailerTransporter();
    const from = await this.getFromAddress();
    const cleanTo = to.toLowerCase().trim();
    const subject = `HYDROCEAN Security Alert: New Login`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>HYDROCEAN Security Alert: New Login</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #020617;
            color: #f1f5f9;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 20px;
            padding: 32px;
            text-align: center;
          }
          .logo {
            color: #009ca6;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.05em;
            margin-bottom: 24px;
          }
          .logo-sub {
            font-size: 9px;
            color: #64748b;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-top: 4px;
          }
          h1 {
            font-size: 20px;
            color: #ffffff;
            margin-bottom: 16px;
            font-weight: 700;
          }
          p {
            font-size: 14px;
            color: #94a3b8;
            line-height: 1.6;
            margin-bottom: 24px;
            text-align: left;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            text-align: left;
          }
          .details-table td {
            padding: 10px;
            border-bottom: 1px solid #1e293b;
            font-size: 13px;
          }
          .details-table td.label {
            color: #64748b;
            font-weight: 600;
            width: 35%;
          }
          .details-table td.value {
            color: #f1f5f9;
            font-family: monospace;
          }
          .footer {
            font-size: 11px;
            color: #475569;
            margin-top: 32px;
            border-top: 1px solid #1e293b;
            padding-top: 16px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            HYDROCEAN
            <div class="logo-sub">Robotics & Vehicles</div>
          </div>
          <h1>Security Alert: New Login Detected</h1>
          <p>Hello ${fullName},</p>
          <p>Your account has been successfully logged in. If this was you, no action is required. If you do not recognize this login, please change your password immediately.</p>
          
          <table class="details-table">
            <tr>
              <td class="label">Date</td>
              <td class="value">${loginDetails.date}</td>
            </tr>
            <tr>
              <td class="label">Time</td>
              <td class="value">${loginDetails.time}</td>
            </tr>
            <tr>
              <td class="label">IP Address</td>
              <td class="value">${loginDetails.ip || 'Unknown'}</td>
            </tr>
            <tr>
              <td class="label">Device/Browser</td>
              <td class="value">${loginDetails.device || 'Unknown'}</td>
            </tr>
          </table>
          
          <div class="footer">
            &copy; ${new Date().getFullYear()} HYDROCEAN. All rights reserved.<br>
            Secure Admissions Portal Verification System.
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `Hello ${fullName},\n\nYour account has been successfully logged in. If this was you, no action is required. If you do not recognize this login, please change your password immediately.\n\nLogin Details:\nDate: ${loginDetails.date}\nTime: ${loginDetails.time}\nIP Address: ${loginDetails.ip || 'Unknown'}\nDevice: ${loginDetails.device || 'Unknown'}\n\nHYDROCEAN Robotics & Vehicles`;

    if (transporter) {
      try {
        await transporter.sendMail({
          from,
          to: cleanTo,
          subject,
          text,
          html,
        });
        console.log(`[MAIL SERVICE] Login alert sent to ${cleanTo} via Nodemailer.`);
        return { success: true };
      } catch (err: any) {
        console.error(`[MAIL SERVICE] Login alert send failed to ${cleanTo}:`, err);
        return { success: false, message: err.message };
      }
    } else {
      console.log(`\n======================================================\n[MAIL SERVICE SIMULATION] SENDING LOGIN ALERT TO: ${cleanTo}\nNAME: ${fullName}\n======================================================\n`);
      return { success: true };
    }
  }

  /**
   * Send custom broadcast/newsletter or administrative email
   */
  static async sendEmail(payload: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<{ success: boolean; message?: string }> {
    const resend = await this.getResendClient();
    const from = await this.getFromAddress();
    const cleanTo = payload.to.toLowerCase().trim();

    if (resend) {
      try {
        const { data, error } = await resend.emails.send({
          from,
          to: [cleanTo],
          subject: payload.subject,
          text: payload.text || payload.subject,
          html: payload.html,
        });

        if (error) {
          console.error('[MAIL SERVICE] Resend send custom error:', error);
          return { success: false, message: error.message };
        }

        console.log(`[MAIL SERVICE] Custom email sent to ${cleanTo} via Resend. ID: ${data?.id}`);
        return { success: true };
      } catch (err: any) {
        console.error(`[MAIL SERVICE] Resend custom send failed to ${cleanTo}:`, err);
        return { success: false, message: err.message || 'Resend delivery failed.' };
      }
    } else {
      console.log(`\n======================================================\n[MAIL SERVICE SIMULATION] SENDING CUSTOM EMAIL TO: ${cleanTo}\nSUBJECT: ${payload.subject}\n======================================================\n`);
      return { success: true, message: 'Resend API not configured. Logged to console.' };
    }
  }

  /**
   * Send application status change email notification
   */
  static async sendStatusUpdateEmail(
    email: string,
    fullName: string,
    status: string,
    rejectionReason?: string
  ): Promise<{ success: boolean }> {
    const subject = `Hydrocean Application Status Updated: ${status}`;
    
    let statusMessageHtml = '';
    if (status === 'Verified' || status === 'Payment Verified') {
      statusMessageHtml = `
        <h2 style="color: #0d9488; font-size: 18px; margin-top: 0;">Payment Verified Successfully ✅</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
          We are pleased to inform you that our finance team has successfully verified your Meezan Bank fee deposit. Your application has been moved to the active evaluation queue.
        </p>
      `;
    } else if (status === 'Rejected') {
      statusMessageHtml = `
        <h2 style="color: #f43f5e; font-size: 18px; margin-top: 0;">Application Status Update: Rejection ❌</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
          We regret to inform you that after reviewing your files, our administrative team has declined your application at this stage.
        </p>
        ${rejectionReason ? `
        <div style="background-color: #311218; border-left: 4px solid #f43f5e; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #fda4af; line-height: 1.5;">
            <strong>Reason for Rejection:</strong><br/>
            ${rejectionReason}
          </p>
        </div>
        ` : ''}
      `;
    } else if (status === 'Under Review' || status === 'Shortlisted') {
      statusMessageHtml = `
        <h2 style="color: #0d9488; font-size: 18px; margin-top: 0;">Candidate Profile Under Review 🔍</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
          Your profile has been shortlisted and is currently undergoing technical review by our Lead Maritime Engineers.
        </p>
      `;
    } else if (status === 'Approved' || status === 'Selected') {
      statusMessageHtml = `
        <h2 style="color: #10b981; font-size: 18px; margin-top: 0;">Congratulations! Application Approved 🎉</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
          We are absolutely thrilled to inform you that your application has been approved! Our HR division will be in touch with you shortly to schedule onboarding.
        </p>
      `;
    } else {
      statusMessageHtml = `
        <h2 style="color: #38bdf8; font-size: 18px; margin-top: 0;">Status Changed to: ${status} ⚡</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
          Your Hydrocean recruitment file status has been updated. Please log in to your dashboard to review full details.
        </p>
      `;
    }

    const html = `
<div style="font-family: sans-serif; padding: 30px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 25px;">
    <h1 style="color: #0d9488; font-size: 24px; margin: 0;">HYDROCEAN</h1>
    <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">Admissions & Recruitment Portal</p>
  </div>
  
  <p style="font-size: 14px; color: #cbd5e1;">Dear ${fullName || 'Candidate'},</p>
  
  ${statusMessageHtml}
  
  <div style="background-color: #1e293b; border-left: 4px solid #0d9488; padding: 15px; border-radius: 8px; margin: 25px 0;">
    <p style="margin: 0; font-size: 13px; color: #94a3b8; font-family: monospace;">
      <strong>Current File Status:</strong> ${status}
    </p>
  </div>

  <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
    Thank you for choosing Hydrocean Robotics as your professional destination.
  </p>

  <div style="margin-top: 35px; font-size: 11px; color: #64748b; border-top: 1px solid #334155; padding-top: 20px;">
    This is an administrative email. Please do not reply directly to this notification.
  </div>
</div>
    `.trim();

    return await this.sendEmail({ to: email, subject, html, text: `Hydrocean Application Status: ${status}` });
  }
}
