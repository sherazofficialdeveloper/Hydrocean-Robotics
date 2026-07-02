/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { UploadService } from '../services/upload.service';

export class PictureController {
  /**
   * Upload and validate Candidate Photo (Step 5)
   */
  static async uploadPicture(req: Request, res: Response) {
    const { pictureFile } = req.body; // base64 string

    if (!pictureFile) {
      return res.status(400).json({ error: 'Candidate picture is required.' });
    }

    try {
      // Validate: Max 2MB, Allowed: png, jpg, jpeg, webp
      const fileUrl = await UploadService.saveBase64File(
        pictureFile,
        'pic',
        ['png', 'jpg', 'jpeg', 'webp'],
        2 * 1024 * 1024 // 2MB
      );

      return res.json({
        success: true,
        fileUrl,
        message: 'Candidate Picture uploaded and validated successfully.',
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
