import { Schema, model, Document, Types } from 'mongoose';

// 1. TypeScript Interface Definition
export interface IBooking extends Document {
  userId: Types.ObjectId;
  slotId: Types.ObjectId;
  resourceId: Types.ObjectId;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'failed';
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schema Definition
const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID zaroori hai'],
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: 'Slot',
      required: [true, 'Slot ID zaroori hai'],
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
      required: [true, 'Resource ID zaroori hai'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount zaroori hai'],
      min: [0, 'Amount negative nahi ho sakti'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'failed'],
      default: 'pending',
    },
    stripeSessionId: {
      type: String,
      trim: true,
    },
    stripePaymentIntentId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Fast Queries ke liye Indexes (e.g., User apni bookings dekhega)
bookingSchema.index({ userId: 1 });
bookingSchema.index({ status: 1 });

// 3. Export Mongoose Model
export const Booking = model<IBooking>('Booking', bookingSchema);