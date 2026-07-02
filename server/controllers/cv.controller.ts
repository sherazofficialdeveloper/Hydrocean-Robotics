/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { UploadService } from '../services/upload.service';

export class CvController {
  /**
   * Upload and validate Candidate CV/Resume (Step 4)
   */
  static async uploadCv(req: Request, res: Response) {
    const { cvFile } = req.body; // base64 string

    if (!cvFile) {
      return res.status(400).json({ error: 'CV file is required.' });
    }

    try {
      // Validate: Max 10MB, Allowed: pdf, doc, docx
      const fileUrl = await UploadService.saveBase64File(
        cvFile,
        'cv',
        ['pdf', 'doc', 'docx'],
        10 * 1024 * 1024 // 10MB
      );

      return res.json({
        success: true,
        fileUrl,
        message: 'CV uploaded and validated successfully.',
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
