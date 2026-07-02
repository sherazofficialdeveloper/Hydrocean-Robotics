/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { UploadService } from '../services/upload.service';

export class PassportController {
  /**
   * Upload and validate Passport scan copy
   */
  static async uploadPassport(req: Request, res: Response) {
    const { passportFile } = req.body; // base64 string

    if (!passportFile) {
      return res.status(400).json({ error: 'Passport scan copy file is required.' });
    }

    try {
      // Validate: Max 5MB, Allowed: pdf, png, jpg, jpeg, webp
      const fileUrl = await UploadService.saveBase64File(
        passportFile,
        'passport',
        ['pdf', 'png', 'jpg', 'jpeg', 'webp'],
        5 * 1024 * 1024 // 5MB
      );

      return res.json({
        success: true,
        fileUrl,
        message: 'Passport scan uploaded and validated successfully.',
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
