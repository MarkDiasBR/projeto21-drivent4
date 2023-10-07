import { notFoundError, forbiddenError } from '@/errors';
import { bookingRepository, roomRepository, ticketsRepository } from '@/repositories';
import { ticketsService } from './tickets-service';

async function getBooking(userId: number) {
    const booking = await bookingRepository.findBookingByUserId(userId);
    if (!booking) throw notFoundError();

    return booking;
}

async function createBooking(userId: number, roomId: number) {

    const ticket = await ticketsService.getTicketByUserId(userId);
    //MAYBE NOT NEEDED: if (!ticket) throw notFoundError();

    // apenas usuários com ingresso do tipo presencial podem fazer reservas
    // Fora da regra de negócio ⇒ deve retornar status code 403 (Forbidden). 
    if (ticket.TicketType.isRemote) throw forbiddenError();

    // apenas usuários hospedagem podem fazer reservas
    // Fora da regra de negócio ⇒ deve retornar status code 403 (Forbidden). 
    if (!ticket.TicketType.includesHotel) throw forbiddenError();

    // apenas usuários com ingresso pago podem fazer reservas
    // Fora da regra de negócio ⇒ deve retornar status code 403 (Forbidden). 
    if (ticket.status !== "PAID") throw forbiddenError();
    
    const room = await roomRepository.findRoom(roomId);
    // - `roomId` não existente ⇒ deve retornar status code `404 (Not Found)`.
    if (!room) throw notFoundError();

    const roomCapacity = room.capacity;
    const bookings = await bookingRepository.findBookingsByRoomId(roomId);
    const roomVacancy = roomCapacity - bookings.length;
    // - `roomId` sem vaga ⇒ deve retornar status code `403 (Forbidden)`.
    if (roomVacancy === 0) throw forbiddenError();
    
    const booking = await bookingRepository.createBooking(userId, roomId);

     // Deve retornar status code 200 (Ok) com bookingId. formato {"bookingId": Number}
    return { bookingId: booking.id }
}

export const bookingsService = {
    getBooking, createBooking
};
  