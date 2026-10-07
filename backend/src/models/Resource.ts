import { Schema, model, Document, Types } from 'mongoose';

// 1. TypeScript Interface Definition
export interface IResource extends Document {
  name: string;
  description: string;
  capacity: number;
  pricePerHour: number;
  isActive: boolean; // Temporary disable karne ke liye (e.g., maintenance)
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schema Definition
const resourceSchema = new Schema<IResource>(
  {
    name: {
      type: String,
      required: [true, 'Resource name zaroori hai'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description zaroori hai'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity zaroori hai'],
      min: [1, 'Capacity kam se kam 1 honi chahiye'],
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Price zaroori hai'],
      min: [0, 'Price negative nahi ho sakti'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 3. Export Mongoose Model
export const Resource = model<IResource>('Resource', resourceSchema);