/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface INotification extends MongooseDocument {
  applicantId: string; // user email or id
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  isDismissed: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    applicantId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
    isRead: { type: Boolean, default: false },
    isDismissed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
export default NotificationModel;
