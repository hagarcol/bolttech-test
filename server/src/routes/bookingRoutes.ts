import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { asyncHandler } from '../middleware/validation.middleware';

const router = Router();
const bookingController = new BookingController();

// POST /bookings - Create a new booking
router.post('/', 
  asyncHandler(bookingController.createBooking.bind(bookingController))
);

// GET /bookings/user/:userId - Get user bookings
router.get('/user/:userId', 
  asyncHandler(bookingController.getUserBookings.bind(bookingController))
);

// GET /bookings/statistics - Get booking statistics
router.get('/statistics', 
  asyncHandler(bookingController.getBookingStatistics.bind(bookingController))
);

// GET /bookings/:bookingId - Get booking by ID
router.get('/:bookingId', 
  asyncHandler(bookingController.getBookingById.bind(bookingController))
);

// DELETE /bookings/:bookingId - Cancel a booking
router.delete('/:bookingId', 
  asyncHandler(bookingController.cancelBooking.bind(bookingController))
);

export default router;
