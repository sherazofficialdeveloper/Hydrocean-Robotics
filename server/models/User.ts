/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IUser extends MongooseDocument {
  email: string;
  passwordHash: string;
  fullName: string;
  role: 'applicant' | 'admin' | 'sub_admin';
  permissions?: string[];
  isVerified?: boolean;
  isBlocked?: boolean;
  otp?: string;
  otpExpires?: Date;
  resetToken?: string;
  resetTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: String, enum: ['applicant', 'admin', 'sub_admin'], default: 'applicant' },
    permissions: { type: [String], default: [] },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
  },
  { timestamps: true }
);

const UserModel = (mongoose.models.User || mongoose.model<IUser>('User', UserSchema)) as mongoose.Model<IUser>;
export default UserModel;
