import { Router } from 'express';
import { createBooking, getUserBookings } from '../controllers/bookingController';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);

export default router;