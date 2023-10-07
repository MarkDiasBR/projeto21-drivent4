import { Response } from 'express';
import httpStatus from 'http-status';
import { bookingsService } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    return res.status(httpStatus.OK).send("OI")
    // const { userId } = req;
    // const booking = await bookingsService.getBooking(userId);
    // return res.status(httpStatus.OK).send('bookings');
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
    const { userId, body: { roomId } } = req;

    const booking = await bookingsService.createBooking(userId, roomId);

    // Deve retornar status code 200 (Ok) com bookingId. formato {"bookingId": Number}
    return res.status(httpStatus.OK).send(booking);
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const { userId, body: { roomId } } = req;

    const booking = await bookingsService.updateBooking(userId, roomId);

    // Deve retornar status code 200 (Ok) com bookingId. formato {"bookingId": Number}
    return res.status(httpStatus.OK).send(booking);
}