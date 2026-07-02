/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IPendingUser extends MongooseDocument {
  email: string;
  passwordHash: string;
  fullName: string;
  otp: string;
  otpExpires: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PendingUserSchema = new Schema<IPendingUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpires: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL index to automatically remove pending signups after 15 minutes
PendingUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

const PendingUserModel = (mongoose.models.PendingUser || mongoose.model<IPendingUser>('PendingUser', PendingUserSchema)) as mongoose.Model<IPendingUser>;
export default PendingUserModel;
