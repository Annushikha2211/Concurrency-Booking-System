import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  userId: Types.ObjectId;
  resourceId: Types.ObjectId;
  slotId: Types.ObjectId;
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingStatus: 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
      unique: true, // Ek slot sirf ek hi baar book ho sakta hai
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed', // Simplified simulation ke liye default completed
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = model<IBooking>('Booking', bookingSchema);