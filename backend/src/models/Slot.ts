import { Schema, model, Document, Types } from 'mongoose';

// 1. TypeScript Interface Definition
export interface ISlot extends Document {
  resourceId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  price: number;
  status: 'available' | 'pending' | 'booked';
  lockedAt?: Date | null;
  lockedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schema Definition
const slotSchema = new Schema<ISlot>(
  {
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
      required: [true, 'Resource ID zaroori hai'],
    },
    startTime: {
      type: Date,
      required: [true, 'Start time zaroori hai'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time zaroori hai'],
    },
    price: {
      type: Number,
      required: [true, 'Slot price zaroori hai'],
      min: [0, 'Price negative nahi ho sakti'],
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'booked'],
      default: 'available',
    },
    lockedAt: {
      type: Date,
      default: null,
    },
    lockedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// 3. Database Constraints (Hard Race Condition Prevention Index)
// Ek resource par same startTime ke 2 slots nahi ho sakte
slotSchema.index({ resourceId: 1, startTime: 1 }, { unique: true });

// Status query filtering fast karne ke liye Index
slotSchema.index({ status: 1 });

// 4. Export Mongoose Model
export const Slot = model<ISlot>('Slot', slotSchema);