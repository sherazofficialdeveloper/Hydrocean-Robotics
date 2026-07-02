/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IContact extends MongooseDocument {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied';
  replyMessage?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Unread', 'Read', 'Replied'], default: 'Unread' },
    replyMessage: { type: String },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

const ContactModel = (mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema)) as mongoose.Model<IContact>;
export default ContactModel;
