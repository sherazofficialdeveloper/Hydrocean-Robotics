/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IPayment extends MongooseDocument {
  paymentStatus: 'Unpaid' | 'Paid' | 'Pending Verification' | 'Rejected';
  paymentMethod: string;
  paymentDate?: Date;
  transactionId?: string;
  amount: number;
  receiptFileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid', 'Pending Verification', 'Rejected'],
      default: 'Unpaid',
    },
    paymentMethod: { type: String, default: 'Meezan Bank' },
    paymentDate: { type: Date },
    transactionId: { type: String },
    amount: { type: Number, required: true },
    receiptFileUrl: { type: String },
  },
  { timestamps: true }
);

const PaymentModel = (mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema)) as mongoose.Model<IPayment>;
export default PaymentModel;
