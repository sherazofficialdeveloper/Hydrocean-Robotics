/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IApplication extends MongooseDocument {
  applicantId: string; // references Applicant
  documentId: string; // references Documents
  paymentId: string; // references Payment
  jobId: string;
  jobTitle: string;
  fullName: string; // stored for quick lookup & search
  cnic: string; // stored for duplicate checking & search
  city: string; // stored for filtering
  province: string; // stored for filtering
  email: string;
  status: string; // e.g., 'Pending Payment' | 'Payment Pending Verification' | 'Payment Verified' | 'Application Submitted' | 'Under Review' | 'Approved' | 'Rejected'
  internalNotes?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    applicantId: { type: String, required: true },
    documentId: { type: String, required: true },
    paymentId: { type: String, required: true },
    jobId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    fullName: { type: String, required: true, index: true },
    cnic: { type: String, required: true, index: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: [
        'Pending Payment',
        'Payment Pending Verification',
        'Payment Verified',
        'Application Submitted',
        'Under Review',
        'Approved',
        'Rejected',
        'Pending Verification',
        'Verified',
        'Shortlisted',
        'Interview',
        'Selected'
      ],
      default: 'Pending Verification',
    },
    internalNotes: { type: String, default: '' },
    rejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

const ApplicationModel = (mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema)) as mongoose.Model<IApplication>;
export default ApplicationModel;
