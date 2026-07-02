/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IApplicant extends MongooseDocument {
  fullName: string;
  fatherName: string;
  whatsAppNumber: string;
  skills: string;
  experience: string;
  passportAvailable: 'Yes' | 'No';
  passportFileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicantSchema = new Schema<IApplicant>(
  {
    fullName: { type: String, required: true },
    fatherName: { type: String, required: true },
    whatsAppNumber: { type: String, required: true },
    skills: { type: String, required: true },
    experience: { type: String, required: true },
    passportAvailable: { type: String, enum: ['Yes', 'No'], default: 'No' },
    passportFileUrl: { type: String },
  },
  { timestamps: true }
);

const ApplicantModel = (mongoose.models.Applicant || mongoose.model<IApplicant>('Applicant', ApplicantSchema)) as mongoose.Model<IApplicant>;
export default ApplicantModel;
