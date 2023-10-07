import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createBooking, getBooking, updatebooking} from '@/controllers';
import { bookingSchema } from '@/schemas/bookings-schema';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/process', validateBody(bookingSchema), createBooking)
  .put('/:bookingId', validateBody(bookingSchema), updateBooking);

export { bookingsRouter };
