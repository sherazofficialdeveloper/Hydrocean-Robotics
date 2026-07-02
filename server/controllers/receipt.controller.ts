/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { UploadService } from '../services/upload.service';

export class ReceiptController {
  /**
   * Upload and validate the Bank Deposit Slip (Step 3)
   */
  static async uploadReceipt(req: Request, res: Response) {
    const { receiptFile } = req.body; // base64 string

    if (!receiptFile) {
       return res.status(400).json({ error: 'Bank Deposit Slip file is required.' });
    }

    try {
      // Validate: Max 10MB, Allowed: pdf, png, jpg, jpeg, webp
      const fileUrl = await UploadService.saveBase64File(
        receiptFile,
        'slip',
        ['pdf', 'png', 'jpg', 'jpeg', 'webp'],
        10 * 1024 * 1024 // 10MB
      );

      return res.json({
        success: true,
        fileUrl,
        message: 'Deposit Slip uploaded and verified successfully.',
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
