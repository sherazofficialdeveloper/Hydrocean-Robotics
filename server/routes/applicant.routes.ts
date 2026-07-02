/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { ApplicantController } from '../controllers/applicant.controller';

const router = Router();

router.post('/validate', ApplicantController.validateApplicantInfo);
router.post('/signup', ApplicantController.signup);
router.post('/login', ApplicantController.login);
router.post('/google-login', ApplicantController.googleLogin);
router.get('/google-config', ApplicantController.getGoogleConfig);
router.post('/verify-otp', ApplicantController.verifyOtp);
router.post('/resend-otp', ApplicantController.resendOtp);
router.post('/change-email', ApplicantController.changeEmail);
router.post('/forgot-password', ApplicantController.forgotPassword);
router.post('/verify-reset-otp', ApplicantController.verifyResetOtp);
router.post('/reset-password', ApplicantController.resetPassword);
router.get('/me', ApplicantController.getMe);
router.get('/applications', ApplicantController.getMyApplications);

export default router;
