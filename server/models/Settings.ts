/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface ISettings extends MongooseDocument {
  adminHash: string;
  adminEmail: string;
  settings: any;
  bankDetails: any;
  officeContact: any;
  logs: any[];
  gallery?: string[];
}

const SettingsSchema = new Schema<ISettings>(
  {
    adminHash: { type: String, required: true },
    adminEmail: { type: String, default: 'admin@example.com', lowercase: true, trim: true },
    settings: { type: Schema.Types.Mixed, required: true },
    bankDetails: { type: Schema.Types.Mixed, required: true },
    officeContact: { type: Schema.Types.Mixed, required: true },
    logs: { type: Schema.Types.Mixed, default: [] },
    gallery: { type: [String], default: [] },
  },
  { timestamps: true }
);

const SettingsModel = (mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema)) as mongoose.Model<ISettings>;
export default SettingsModel;
