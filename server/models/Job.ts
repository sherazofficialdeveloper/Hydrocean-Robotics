/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IJob extends MongooseDocument {
  id: string; // custom string ID used on client
  title: string;
  titleUr?: string;
  qualification: string;
  qualificationUr?: string;
  salary: string;
  country: string;
  description: string;
  descriptionUr?: string;
  responsibilities: string[];
  responsibilitiesUr?: string[];
  requirements: string[];
  requirementsUr?: string[];
  isOpen: boolean;
  isHidden: boolean;
  isArchived?: boolean;
  createdAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    titleUr: { type: String, default: '' },
    qualification: { type: String, required: true },
    qualificationUr: { type: String, default: '' },
    salary: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    descriptionUr: { type: String, default: '' },
    responsibilities: { type: [String], default: [] },
    responsibilitiesUr: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    requirementsUr: { type: [String], default: [] },
    isOpen: { type: Boolean, default: true },
    isHidden: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const JobModel = (mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema)) as mongoose.Model<IJob>;
export default JobModel;
