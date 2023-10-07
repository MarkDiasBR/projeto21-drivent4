import { Response } from 'express';
import httpStatus from 'http-status';
import { bookingsService } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const booking = await bookingsService.getBooking(userId);
    return res.status(httpStatus.OK).send('bookings');
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
    const { userId, body: { roomId } } = req;

    
    const booking = await bookingsService.createBooking(userId, roomId);

    // Deve retornar status code 200 (Ok) com bookingId. formato {"bookingId": Number}
    return res.status(httpStatus.OK).send(booking);
}