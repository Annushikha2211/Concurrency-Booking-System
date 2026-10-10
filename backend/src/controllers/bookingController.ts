import { Response } from 'express';
import { Booking } from '../models/Booking.js';
import { Slot } from '../models/Slot.js';
import { AuthRequest } from '../middlewares/auth.js';

// Create Booking with Concurrency Lock (Atomic Update)
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slotId } = req.body;
    const userId = req.user?.id;

    if (!slotId) {
      res.status(400).json({ message: 'Slot ID is mandatory' });
      return;
    }

    // Atomic update: Find slot only if status is available, and mark it booked instantly
    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, status: 'available' },
      { $set: { status: 'booked', isBooked: true } },
      { new: true }
    );

    if (!slot) {
      res.status(400).json({ message: 'Slot is already booked or does not exist' });
      return;
    }

    // Create booking record
    const booking = await Booking.create({
      userId,
      resourceId: slot.resourceId,
      slotId: slot._id,
      totalAmount: slot.price,
      paymentStatus: 'completed',
      bookingStatus: 'confirmed',
    });

    res.status(201).json({
      message: 'Slot successfully booked',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error during booking', error: (error as Error).message });
  }
};

// Get User Bookings
export const getUserBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const bookings = await Booking.find({ userId }).populate('resourceId slotId');
    res.status(200).json({ count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching bookings', error: (error as Error).message });
  }
};



// import { Response } from 'express';
// import { Booking } from '../models/Booking.js';
// import { Slot } from '../models/Slot.js';
// import { AuthRequest } from '../middlewares/auth.js';

// // Create Booking with Concurrency Lock (Atomic Update)
// export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const { slotId } = req.body;
//     const userId = req.user?.id;

//     if (!slotId) {
//       res.status(400).json({ message: 'Slot ID is mandatory' });
//       return;
//     }

//     // Atomic update: Find slot only if it is NOT booked yet, and mark it booked instantly
//     const slot = await Slot.findOneAndUpdate(
//       { _id: slotId, isBooked: false },
//       { $set: { isBooked: true } },
//       { new: true }
//     );

//     if (!slot) {
//       res.status(400).json({ message: 'Slot is already booked or does not exist' });
//       return;
//     }

//     // Create booking record
//     const booking = await Booking.create({
//       userId,
//       resourceId: slot.resourceId,
//       slotId: slot._id,
//       totalAmount: slot.price,
//       paymentStatus: 'completed',
//       bookingStatus: 'confirmed',
//     });

//     res.status(201).json({
//       message: 'Slot successfully booked',
//       booking,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error during booking', error: (error as Error).message });
//   }
// };

// // Get User Bookings
// export const getUserBookings = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const userId = req.user?.id;
//     const bookings = await Booking.find({ userId }).populate('resourceId slotId');
//     res.status(200).json({ count: bookings.length, bookings });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error fetching bookings', error: (error as Error).message });
//   }
// };
