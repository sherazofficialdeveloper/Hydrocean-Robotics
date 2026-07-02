/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocuments extends MongooseDocument {
  cvUrl: string; // required
  pictureUrl: string; // required
  passportUrl?: string; // optional
  receiptUrl: string; // required
  createdAt: Date;
  updatedAt: Date;
}

const DocumentsSchema = new Schema<IDocuments>(
  {
    cvUrl: { type: String, required: true },
    pictureUrl: { type: String, required: true },
    passportUrl: { type: String },
    receiptUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const DocumentsModel = (mongoose.models.Documents || mongoose.model<IDocuments>('Documents', DocumentsSchema)) as mongoose.Model<IDocuments>;
export default DocumentsModel;
