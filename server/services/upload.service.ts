/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

export class UploadService {
  /**
   * Decodes, validates, and uploads a base64 file to Cloudinary.
   * Performs rigorous size checks and MIME checks.
   */
  static async saveBase64File(
    base64DataUrl: string | undefined,
    prefix: string,
    allowedExtensions: string[],
    maxSizeInBytes: number
  ): Promise<string> {
    if (!base64DataUrl) {
      throw new Error(`File payload for ${prefix} is empty.`);
    }

    const matches = base64DataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid file format. Upload must be a valid document or image.');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // 1. Size Validation
    if (buffer.length > maxSizeInBytes) {
      const sizeMb = (maxSizeInBytes / (1024 * 1024)).toFixed(1);
      throw new Error(`File size exceeds maximum limit of ${sizeMb}MB.`);
    }

    // 2. Extension / MIME verification
    let ext = 'bin';
    if (mimeType.includes('pdf')) ext = 'pdf';
    else if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';
    else if (mimeType.includes('word') || mimeType.includes('officedocument') || mimeType.includes('msword')) {
      if (base64DataUrl.includes('docx')) ext = 'docx';
      else ext = 'doc';
    }

    if (!allowedExtensions.includes(ext)) {
      throw new Error(`Forbidden file format (${ext}). Allowed formats: ${allowedExtensions.join(', ')}`);
    }

    // Lazy initialization & configuration validation for Cloudinary
    let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    let apiKey = process.env.CLOUDINARY_API_KEY;
    let apiSecret = process.env.CLOUDINARY_API_SECRET;
    let folder = 'hydrocean_recruitment';

    try {
      const { DBService } = await import('./db.service');
      const bundle = await DBService.getSettingsBundle();
      if (bundle && bundle.settings) {
        if (bundle.settings.cloudinaryCloudName) cloudName = bundle.settings.cloudinaryCloudName;
        if (bundle.settings.cloudinaryApiKey) apiKey = bundle.settings.cloudinaryApiKey;
        if (bundle.settings.cloudinaryApiSecret) apiSecret = bundle.settings.cloudinaryApiSecret;
        if (bundle.settings.cloudinaryFolder) folder = bundle.settings.cloudinaryFolder;
      }
    } catch (e) {}

    if (!cloudName || !apiKey || !apiSecret) {
      console.log(`[UPLOAD SERVICE] Cloudinary is unconfigured. Falling back to local storage for: ${prefix}`);
      
      const fs = await import('fs');
      const path = await import('path');
      
      const fileName = `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;
      const uploadsDir = path.join(process.cwd(), 'uploads');
      
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, buffer);
      
      return `/uploads/${fileName}`;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    try {
      const result = await cloudinary.uploader.upload(base64DataUrl, {
        folder: folder,
        resource_type: 'auto',
        public_id: `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`
      });

      if (!result || !result.secure_url) {
        throw new Error('Cloudinary upload succeeded but no secure URL was returned.');
      }

      return result.secure_url;
    } catch (err: any) {
      throw new Error(`Cloudinary upload failed: ${err.message || err}`);
    }
  }
}
