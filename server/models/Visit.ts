/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IVisit extends MongooseDocument {
  ip: string;
  userAgent?: string;
  createdAt: Date;
}

const VisitSchema = new Schema<IVisit>(
  {
    ip: { type: String, required: true },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const VisitModel = (mongoose.models.Visit || mongoose.model<IVisit>('Visit', VisitSchema)) as mongoose.Model<IVisit>;
export default VisitModel;
