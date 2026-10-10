import { Schema, model, Document, Types } from 'mongoose';

// 1. TypeScript Interface Definition
export interface IResource extends Document {
  name: string;
  description: string;
  category: string; // <- YE ADD KIYA
  capacity: number;
  location: string;
  pricePerHour: number;
  isActive: boolean;
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
    category: {
      type: String,
      required: [true, 'Category zaroori hai (e.g., Turf, Room)'],
      trim: true,
    },

    location: {
      type: String,
      required: [true,'loction is mandatory'],
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
      required: false, // Optional rakha hai abhi ke liye taaki controller bina error ke save kar sake
    },
  },
  {
    timestamps: true,
  }
);

// 3. Export Mongoose Model
export const Resource = model<IResource>('Resource', resourceSchema);