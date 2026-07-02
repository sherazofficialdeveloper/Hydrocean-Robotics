/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateToken, verifyToken, isEmailAdmin } from '../middleware/auth.middleware';
import { DBService } from '../services/db.service';
import { MailService } from '../services/mail.service';
import { dbState } from '../config/db';

export class ApplicantController {
  /**
   * Validates applicant personal information (Step 1)
   */
  static validateApplicantInfo(req: Request, res: Response) {
    const { fullName, fatherName, whatsAppNumber, skills, experience, passportAvailable } = req.body;

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Valid Full Name is required.' });
    }

    if (!fatherName || typeof fatherName !== 'string' || fatherName.trim().length < 2) {
      return res.status(400).json({ error: 'Valid Father Name is required.' });
    }

    if (!whatsAppNumber || typeof whatsAppNumber !== 'string' || whatsAppNumber.trim().length < 8) {
      return res.status(400).json({ error: 'Valid WhatsApp number is required.' });
    }

    if (!skills || typeof skills !== 'string' || skills.trim().length < 10) {
      return res.status(400).json({ error: 'Please enter a detailed summary of skills (minimum 10 characters).' });
    }

    if (!experience || typeof experience !== 'string' || experience.trim().length < 10) {
      return res.status(400).json({ error: 'Please enter detailed professional experience (minimum 10 characters).' });
    }

    if (passportAvailable !== 'Yes' && passportAvailable !== 'No') {
      return res.status(400).json({ error: 'Passport status must be Yes or No.' });
    }

    return res.json({ success: true, message: 'Applicant details validated successfully.' });
  }

  /**
   * Applicant Sign Up with OTP Generation
   */
  static async signup(req: Request, res: Response) {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields (First Name, Last Name, Email, Password, Confirm Password) are required.' });
    }

    // 1. Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // 2. Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    // 3. Password strength check
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      return res.status(400).json({ error: 'Password must contain both letters and numbers for safety.' });
    }

    try {
      const cleanEmail = email.toLowerCase().trim();
      
      // Check if email already exists in the verified/active User collection
      const existing = await DBService.getUserByEmail(cleanEmail);
      if (existing) {
        if (existing.isBlocked) {
          return res.status(403).json({ error: 'This account has been blocked. You cannot re-register or log in with this email address. Please contact support.' });
        }
        if (existing.isDeleted) {
          return res.status(400).json({ error: 'This account was previously deleted. Please contact an administrator to restore your account.' });
        }
        return res.status(400).json({ error: 'This email is already registered.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      // Create PENDING user temporarily (Do NOT create the actual user account yet)
      await DBService.createPendingUser({
        fullName,
        email: cleanEmail,
        passwordHash,
        otp,
        otpExpires,
      });

      console.log(`[SIGNUP-PENDING] Generated OTP ${otp} for pending registration of email ${cleanEmail}`);

      // Send real email via SMTP / Nodemailer
      await MailService.sendOtpEmail(cleanEmail, fullName, otp);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! A 6-digit OTP has been sent to your email.',
        email: cleanEmail,
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to register account: ' + err.message });
    }
  }

  /**
   * Applicant Login (Enforces OTP Verification)
   */
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
      const cleanEmail = email.toLowerCase().trim();
      const user = await DBService.getUserByEmail(cleanEmail);
      
      if (!user) {
        // If they do not exist in active User, check if they have a pending signup
        const pending = await DBService.getPendingUserByEmail(cleanEmail);
        if (pending) {
          const match = await bcrypt.compare(password, pending.passwordHash);
          if (match) {
            // Correct password! Resend an OTP and redirect them to verification
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            
            await DBService.updatePendingUserEmail(cleanEmail, cleanEmail, otp, otpExpires);
            console.log(`[LOGIN-PENDING] User tried to log in but is unverified. Dispatching new OTP ${otp} to email ${cleanEmail}`);
            await MailService.sendOtpEmail(cleanEmail, pending.fullName, otp);

            return res.status(403).json({
              error: 'Your email is not verified yet. Please enter the OTP sent to your email.',
              needsVerification: true,
              email: cleanEmail,
            });
          } else {
            return res.status(401).json({ error: 'Incorrect password. Please try again.' });
          }
        }
        return res.status(404).json({ error: 'Account not found. Please create an account first.' });
      }

      if (user.isDeleted) {
        return res.status(403).json({ error: 'This account has been deleted. Please contact an administrator to restore your account.' });
      }

      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        return res.status(401).json({ error: 'Incorrect password. Please try again.' });
      }

      // Check if user is blocked
      if (user.isBlocked) {
        return res.status(403).json({ error: 'Your account has been blocked. Please contact support.' });
      }

      // If user is applicant and not verified, reject and issue a new OTP (Legacy compatibility)
      if (user.role === 'applicant' && !user.isVerified) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await DBService.updateUser(user._id || user.id, {
          otp,
          otpExpires,
        });

        console.log(`[LOGIN] Legacy user not verified. Sent new OTP ${otp} to email ${cleanEmail}`);

        // Send OTP email using Nodemailer
        await MailService.sendOtpEmail(user.email, user.fullName, otp);

        return res.status(403).json({
          error: 'Your email is not verified yet. Please enter the OTP sent to your email.',
          needsVerification: true,
          email: user.email,
        });
      }

      // Automatically send Login Notification Email in background
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Unknown';
      const clientAgent = req.headers['user-agent'] || 'Unknown';
      const now = new Date();
      const loginDetails = {
        ip: clientIp,
        device: clientAgent,
        date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      };
      MailService.sendLoginNotificationEmail(user.email, user.fullName, loginDetails).catch((mailErr) => {
        console.error('[LOGIN] Error sending login notification email:', mailErr);
      });

      const token = generateToken({ id: user._id || user.id, email: user.email, role: 'applicant' });
      return res.json({
        success: true,
        token,
        user: {
          id: user._id || user.id,
          fullName: user.fullName,
          email: user.email,
          isAdmin: user.role === 'admin' || isEmailAdmin(user.email),
          isSubAdmin: user.role === 'sub_admin',
          permissions: user.permissions || [],
          role: user.role,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to sign in: ' + err.message });
    }
  }

  /**
   * Verify Registration/Login OTP
   */
  static async verifyOtp(req: Request, res: Response) {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP code are required.' });
    }

    try {
      const cleanEmail = email.toLowerCase().trim();
      
      // 1. Check if there's a pending signup record
      const pending = await DBService.getPendingUserByEmail(cleanEmail);
      
      if (pending) {
        // Verify OTP matches
        if (pending.otp !== otp) {
          return res.status(400).json({ error: 'Invalid verification code. Please try again.' });
        }

        // Verify OTP expiry
        if (new Date(pending.otpExpires) < new Date()) {
          return res.status(400).json({ error: 'Verification code has expired. Please request a new OTP.' });
        }

        // OTP is correct! Create the permanent User account
        const newUser = await DBService.createUser({
          email: cleanEmail,
          passwordHash: pending.passwordHash,
          fullName: pending.fullName,
          role: 'applicant',
          isVerified: true,
        });

        // Delete the used pending record
        await DBService.deletePendingUser(cleanEmail);

        // Automatically send Welcome Email
        const firstName = newUser.fullName ? newUser.fullName.split(' ')[0] : 'Applicant';
        const appUrl = `${req.protocol}://${req.get('host')}`;
        MailService.sendWelcomeEmail(newUser.email, firstName, appUrl).catch((mailErr) => {
          console.error('[SIGNUP] Error sending welcome email:', mailErr);
        });

        // Generate JWT / Session
        const token = generateToken({ id: newUser._id || newUser.id, email: newUser.email, role: 'applicant' });
        
        return res.json({
          success: true,
          message: 'Email verified and account registered successfully!',
          token,
          user: {
            id: newUser._id || newUser.id,
            fullName: newUser.fullName,
            email: newUser.email,
            isAdmin: isEmailAdmin(newUser.email),
            isSubAdmin: false,
            permissions: [],
            role: 'applicant',
          },
        });
      }

      // 2. Fallback: Check if user exists in User collection but is not verified (legacy accounts)
      const user = await DBService.getUserByEmail(cleanEmail);
      if (user) {
        if (user.isVerified) {
          return res.status(400).json({ error: 'This email is already verified. Please log in.' });
        }

        if (user.otp !== otp) {
          return res.status(400).json({ error: 'Invalid verification code. Please try again.' });
        }

        if (new Date(user.otpExpires) < new Date()) {
          return res.status(400).json({ error: 'Verification code has expired. Please request a new OTP.' });
        }

        // Mark existing user as verified
        const updatedUser = await DBService.updateUser(user._id || user.id, {
          isVerified: true,
          otp: null,
          otpExpires: null,
        });

        // Automatically send Welcome Email
        const firstName = updatedUser.fullName ? updatedUser.fullName.split(' ')[0] : 'Applicant';
        const appUrl = `${req.protocol}://${req.get('host')}`;
        MailService.sendWelcomeEmail(updatedUser.email, firstName, appUrl).catch((mailErr) => {
          console.error('[SIGNUP] Error sending welcome email:', mailErr);
        });

        const token = generateToken({ id: updatedUser._id || updatedUser.id, email: updatedUser.email, role: 'applicant' });
        
        return res.json({
          success: true,
          message: 'Email verified successfully!',
          token,
          user: {
            id: updatedUser._id || updatedUser.id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            isAdmin: isEmailAdmin(updatedUser.email) || updatedUser.role === 'admin',
            isSubAdmin: updatedUser.role === 'sub_admin',
            permissions: updatedUser.permissions || [],
            role: updatedUser.role,
          },
        });
      }

      return res.status(404).json({ error: 'No verification details or registration session found for this email address. Please register again.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Verification failed: ' + err.message });
    }
  }

  /**
   * Resend Verification OTP
   */
  static async resendOtp(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    try {
      const cleanEmail = email.toLowerCase().trim();
      
      // 1. Check pending registration first
      const pending = await DBService.getPendingUserByEmail(cleanEmail);
      if (pending) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        if (dbState.isMongoDB) {
          pending.otp = otp;
          pending.otpExpires = otpExpires;
          await pending.save();
        } else {
          // JSON DB implementation
          await DBService.updatePendingUserEmail(cleanEmail, cleanEmail, otp, otpExpires);
        }

        console.log(`[RESEND-PENDING] Sent new OTP ${otp} to email ${cleanEmail}`);
        await MailService.sendOtpEmail(cleanEmail, pending.fullName, otp);

        return res.json({
          success: true,
          message: 'A new 6-digit OTP code has been sent successfully.',
        });
      }

      // 2. Fallback: Check existing unverified user
      const user = await DBService.getUserByEmail(cleanEmail);
      if (!user) {
        return res.status(404).json({ error: 'No verification record found for this email address. Please register again.' });
      }

      if (user.isVerified) {
        return res.status(400).json({ error: 'This email is already verified. Please log in.' });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      await DBService.updateUser(user._id || user.id, {
        otp,
        otpExpires,
      });

      console.log(`[RESEND] Sent new OTP ${otp} to email ${cleanEmail}`);

      // Send real email using Nodemailer
      await MailService.sendOtpEmail(user.email, user.fullName, otp);

      return res.json({
        success: true,
        message: 'A new 6-digit OTP code has been sent successfully.',
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to resend OTP: ' + err.message });
    }
  }

  /**
   * Change Email for Unverified Account
   */
  static async changeEmail(req: Request, res: Response) {
    const { oldEmail, newEmail } = req.body;
    if (!oldEmail || !newEmail) {
      return res.status(400).json({ error: 'Both old and new email addresses are required.' });
    }

    try {
      const cleanOld = oldEmail.toLowerCase().trim();
      const cleanNew = newEmail.toLowerCase().trim();

      // Check if the new email is already verified or registered in User
      const existingUser = await DBService.getUserByEmail(cleanNew);
      if (existingUser) {
        return res.status(400).json({ error: 'This email is already registered.' });
      }

      // 1. Check if the registration is pending
      const pending = await DBService.getPendingUserByEmail(cleanOld);
      if (pending) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await DBService.updatePendingUserEmail(cleanOld, cleanNew, otp, otpExpires);

        console.log(`[EMAIL_CHANGE-PENDING] Updated pending email from ${cleanOld} to ${cleanNew}. Sent OTP ${otp}`);
        await MailService.sendOtpEmail(cleanNew, pending.fullName, otp);

        return res.json({
          success: true,
          message: 'Email address updated and new OTP sent successfully.',
        });
      }

      // 2. Fallback: Check if user is unverified in User collection
      const user = await DBService.getUserByEmail(cleanOld);
      if (!user) {
        return res.status(404).json({ error: 'User account not found.' });
      }

      if (user.isVerified) {
        return res.status(400).json({ error: 'Cannot change email of an already verified account.' });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      await DBService.updateUser(user._id || user.id, {
        email: cleanNew,
        otp,
        otpExpires,
      });

      console.log(`[EMAIL_CHANGE] Updated email from ${cleanOld} to ${cleanNew}. Sent OTP ${otp}`);

      // Send real email using Nodemailer
      await MailService.sendOtpEmail(cleanNew, user.fullName, otp);

      return res.json({
        success: true,
        message: 'Email address updated and new OTP sent successfully.',
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to update email: ' + err.message });
    }
  }

  /**
   * Applicant Forgot Password
   */
  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    try {
      const user = await DBService.getUserByEmail(email.toLowerCase().trim());
      if (!user) {
        return res.status(404).json({ error: 'No account registered with this email address.' });
      }
      
      // Generate a highly secure 6-digit password reset OTP
      const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
      const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity
      
      await DBService.updateUser(user._id || user.id, { resetToken, resetTokenExpires });
      
      // Send the reset OTP via email
      const mailResult = await MailService.sendResetOtpEmail(user.email, user.fullName, resetToken);
      
      return res.json({
        success: true,
        message: 'A 6-digit password reset OTP has been sent to your email address.',
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Forgot password operation failed: ' + err.message });
    }
  }

  /**
   * Verify Password Reset OTP (Intermediate Verification step)
   */
  static async verifyResetOtp(req: Request, res: Response) {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP code are required.' });
    }
    try {
      const cleanEmail = email.toLowerCase().trim();
      const user = await DBService.getUserByEmail(cleanEmail);
      if (!user) {
        return res.status(404).json({ error: 'No account registered with this email address.' });
      }

      if (user.resetToken !== otp) {
        return res.status(400).json({ error: 'Invalid verification code. Please try again.' });
      }

      if (!user.resetTokenExpires || new Date(user.resetTokenExpires) < new Date()) {
        return res.status(400).json({ error: 'Verification code has expired. Please request a new OTP.' });
      }

      return res.json({
        success: true,
        message: 'OTP verified successfully! Please enter your new password.',
        token: otp,
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to verify OTP: ' + err.message });
    }
  }

  /**
   * Applicant Reset Password
   */
  static async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
    try {
      const user = await DBService.getUserByResetToken(token);
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired password reset token.' });
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);
      await DBService.updateUser(user._id || user.id, {
        passwordHash,
        resetToken: undefined,
        resetTokenExpires: undefined,
      });
      return res.json({ success: true, message: 'Password has been updated successfully.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to reset password: ' + err.message });
    }
  }

  /**
   * Retrieves Google OAuth Client configuration safely
   */
  static getGoogleConfig(req: Request, res: Response) {
    return res.json({
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
    });
  }

  /**
   * Google Sign-In (Handles both existing and new users, bypasses email verification)
   */
  static async googleLogin(req: Request, res: Response) {
    const { email: rawEmail, fullName: rawFullName, idToken } = req.body;
    let email = rawEmail;
    let fullName = rawFullName;

    try {
      // High-Security: If Google ID token is supplied, verify it directly via Google Server APIs
      if (idToken) {
        console.log('[GOOGLE AUTH] Verifying token through Google Security API...');
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
        if (!verifyRes.ok) {
          return res.status(401).json({ error: 'Google ID Token validation failed or token expired.' });
        }
        const payload = await verifyRes.json();
        email = payload.email;
        fullName = payload.name || payload.given_name || email.split('@')[0];
        console.log(`[GOOGLE AUTH] Token verified securely for: ${email}`);
      }

      if (!email || !fullName) {
        return res.status(400).json({ error: 'Google email and name are required.' });
      }

      let user = await DBService.getUserByEmail(email);
      
      // If user does not exist, create a new pre-verified user
      if (!user) {
        const randomPass = crypto.randomBytes(16).toString('hex');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(randomPass, salt);

        user = await DBService.createUser({
          fullName: fullName.trim(),
          email: email.toLowerCase().trim(),
          passwordHash,
          role: 'applicant',
          isVerified: true, // Google accounts are pre-verified
          otp: null,
          otpExpires: null,
        });
        console.log(`[GOOGLE LOGIN] Created new user: ${email}`);
      } else {
        if (user.isDeleted) {
          return res.status(403).json({ error: 'This account has been deleted. Please contact an administrator to restore your account.' });
        }
        // If user is blocked
        if (user.isBlocked) {
          return res.status(403).json({ error: 'Your account has been blocked. Please contact support.' });
        }

        // If user exists, ensure they are marked as verified since they authenticated with Google
        if (!user.isVerified) {
          await DBService.updateUser(user._id || user.id, { isVerified: true });
          user.isVerified = true;
        }
        console.log(`[GOOGLE LOGIN] Authenticated existing user: ${email}`);
      }

      // Automatically send Login Notification Email for Google login in background
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Unknown';
      const clientAgent = req.headers['user-agent'] || 'Unknown';
      const now = new Date();
      const loginDetails = {
        ip: clientIp,
        device: clientAgent,
        date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      };
      MailService.sendLoginNotificationEmail(user.email, user.fullName, loginDetails).catch((mailErr) => {
        console.error('[GOOGLE LOGIN] Error sending login notification email:', mailErr);
      });

      const token = generateToken({ id: user._id || user.id, email: user.email, role: 'applicant' });
      return res.json({
        success: true,
        token,
        user: {
          id: user._id || user.id,
          fullName: user.fullName,
          email: user.email,
          isAdmin: user.role === 'admin' || isEmailAdmin(user.email),
          isSubAdmin: user.role === 'sub_admin',
          permissions: user.permissions || [],
          role: user.role,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Google authentication failed: ' + err.message });
    }
  }

  /**
   * Get Active Applicant Profile
   */
  static async getMe(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No credentials provided.' });
    }
    const token = authHeader.split(' ')[1];
    const verified = verifyToken(token);
    if (!verified) {
      return res.status(401).json({ error: 'Invalid or expired session.' });
    }
    try {
      let user = null;
      if (verified.id) {
        user = await DBService.getUserById(verified.id);
      } else if (verified.email) {
        user = await DBService.getUserByEmail(verified.email);
      }

      const isMain = verified.email && (isEmailAdmin(verified.email) || (user && user.role === 'admin'));

      if (!user && !isMain) {
        return res.status(404).json({ error: 'User account not found.' });
      }

      return res.json({
        success: true,
        user: {
          id: user?._id || user?.id || 'admin',
          fullName: user?.fullName || 'System Administrator',
          email: verified.email || user?.email,
          isAdmin: isMain || verified.role === 'administrator',
          isSubAdmin: user?.role === 'sub_admin',
          permissions: user?.permissions || (isMain ? [
            'View Dashboard',
            'View Applications',
            'Manage Jobs',
            'Send Emails'
          ] : []),
          role: user?.role || (isMain ? 'admin' : verified.role),
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch user credentials: ' + err.message });
    }
  }

  static async getMyApplications(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No credentials provided.' });
    }
    const token = authHeader.split(' ')[1];
    const verified = verifyToken(token);
    if (!verified) {
      return res.status(401).json({ error: 'Invalid or expired session.' });
    }
    try {
      const allApps = await DBService.getApplications({});
      const myApps = allApps.filter(
        (app: any) => app.email && app.email.toLowerCase().trim() === verified.email.toLowerCase().trim()
      );
      return res.json({ success: true, applications: myApps });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch your applications: ' + err.message });
    }
  }
}

