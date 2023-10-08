import { Booking } from '@prisma/client';
import { bookingRepository, roomRepository } from '../../src/repositories';
import { bookingsService, ticketsService } from '../../src/services';
import { mockBookings } from './mock';
import { forbiddenError, notFoundError } from '@/errors';
import { BookingIdWithRoom } from '@/protocols';

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe('When fecthing a Booking [ GET /booking ]', () => {
  it("should throw a Not Found error when user doesn't have a booking", async () => {
    jest.spyOn(bookingRepository, 'findBookingWithRoomByUserId').mockImplementationOnce((): any => {
      return null;
    });

    const result = bookingsService.getBooking(1000);

    await expect(result).rejects.toEqual(notFoundError());
    expect(bookingRepository.findBookingWithRoomByUserId).toBeCalledTimes(1);
  });

  it('should get Booking returned with Room data', async () => {
    const bookingWithRoom = mockBookings.bookingWithRoom();
    const { id, Room: room } = bookingWithRoom as BookingIdWithRoom;
    jest.spyOn(bookingRepository, 'findBookingWithRoomByUserId').mockImplementationOnce((): any => {
      return bookingWithRoom;
    });

    const result = bookingsService.getBooking(bookingWithRoom.userId);

    await expect(result).resolves.toEqual({ id, Room: room });
    expect(bookingRepository.findBookingWithRoomByUserId).toBeCalledTimes(1);
  });
});

describe('When creating a Booking [ POST /booking ]', () => {
  it("should throw a Forbidden error when user doesn't have a booking", async () => {
    const ticket = mockBookings.remoteTicket();
    jest.spyOn(ticketsService, 'getTicketByUserId').mockImplementationOnce((): any => {
      return ticket;
    });

    const result = bookingsService.createBooking(mockBookings.userId(), mockBookings.roomId());

    await expect(result).rejects.toEqual(forbiddenError());
    expect(ticketsService.getTicketByUserId).toBeCalledTimes(1);
  });

  it("should throw a Forbidden error when user's ticket doesn't have hotel access", async () => {
    const ticket = mockBookings.noHotelTicket();
    jest.spyOn(ticketsService, 'getTicketByUserId').mockImplementationOnce((): any => {
      return ticket;
    });

    const result = bookingsService.createBooking(mockBookings.userId(), mockBookings.roomId());

    await expect(result).rejects.toEqual(forbiddenError());
    expect(ticketsService.getTicketByUserId).toBeCalledTimes(1);
  });

  it("should throw a Forbidden error when user's ticket is not PAID", async () => {
    const ticket = mockBookings.unpaidTicket();
    jest.spyOn(ticketsService, 'getTicketByUserId').mockImplementationOnce((): any => {
      return ticket;
    });

    const result = bookingsService.createBooking(mockBookings.userId(), mockBookings.roomId());

    await expect(result).rejects.toEqual(forbiddenError());
    expect(ticketsService.getTicketByUserId).toBeCalledTimes(1);
  });

  it("should throw a Not Found error when given roomId doesn't exist", async () => {
    const ticket = mockBookings.ticket();
    jest.spyOn(ticketsService, 'getTicketByUserId').mockImplementationOnce((): any => {
      return ticket;
    });

    jest.spyOn(roomRepository, 'findRoom').mockImplementationOnce((): any => {
      return null;
    });

    const result = bookingsService.createBooking(mockBookings.userId(), mockBookings.roomId());

    await expect(result).rejects.toEqual(notFoundError());
    expect(roomRepository.findRoom).toBeCalledTimes(1);
    expect(ticketsService.getTicketByUserId).toBeCalledTimes(1);
  });

  it("should throw a Forbidden error if there's no vacancy in given roomId", async () => {
    const ticket = mockBookings.ticket();

    jest.spyOn(ticketsService, 'getTicketByUserId').mockImplementationOnce((): any => {
      return ticket;
    });

    const room = mockBookings.room();

    jest.spyOn(roomRepository, 'findRoom').mockImplementationOnce((): any => {
      return room;
    });

    const bookings: Booking[] = [];
    for (let i = room.capacity; i > 0; i--) {
      bookings.push(mockBookings.booking());
    }
    jest.spyOn(bookingRepository, 'findBookingsByRoomId').mockImplementationOnce((): any => {
      return bookings;
    });

    const result = bookingsService.createBooking(mockBookings.userId(), mockBookings.roomId());

    await expect(result).rejects.toEqual(forbiddenError());
    expect(ticketsService.getTicketByUserId).toBeCalledTimes(1);
    expect(roomRepository.findRoom).toBeCalledTimes(1);
    expect(bookingRepository.findBookingsByRoomId).toBeCalledTimes(1);
  });

  it('should create Booking and return formatted Booking id', async () => {
    const ticket = mockBookings.ticket();
    jest.spyOn(ticketsService, 'getTicketByUserId').mockImplementationOnce((): any => {
      return ticket;
    });

    const room = mockBookings.room();
    jest.spyOn(roomRepository, 'findRoom').mockImplementationOnce((): any => {
      return room;
    });

    const bookings: Booking[] = [];
    for (let i = room.capacity - 1; i > 0; i--) {
      bookings.push(mockBookings.booking());
    }
    jest.spyOn(bookingRepository, 'findBookingsByRoomId').mockImplementationOnce((): any => {
      return bookings;
    });

    const booking: Booking = mockBookings.booking();
    jest.spyOn(bookingRepository, 'createBooking').mockImplementationOnce((): any => {
      return booking;
    });

    const result = bookingsService.createBooking(mockBookings.userId(), mockBookings.roomId());

    await expect(result).resolves.toEqual({ bookingId: booking.id });
    expect(ticketsService.getTicketByUserId).toBeCalledTimes(1);
    expect(roomRepository.findRoom).toBeCalledTimes(1);
    expect(bookingRepository.findBookingsByRoomId).toBeCalledTimes(1);
    expect(bookingRepository.createBooking).toBeCalledTimes(1);
  });
});

describe('When updating a Booking [ PUT /booking/:bookingId ]', () => {
  it("should throw a Forbidden error if there's no Booking for given userId", async () => {
    jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
      return null;
    });

    const result = bookingsService.updateBooking(mockBookings.userId(), mockBookings.roomId());

    await expect(result).rejects.toEqual(forbiddenError());
    expect(bookingRepository.findBookingByUserId).toBeCalledTimes(1);
  });

  it("should throw a Not Found error if given roomId doesn't exist", async () => {
    const oldBooking = mockBookings.booking();
    jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
      return oldBooking;
    });

    jest.spyOn(roomRepository, 'findRoom').mockImplementationOnce((): any => {
      return null;
    });

    const result = bookingsService.updateBooking(mockBookings.userId(), mockBookings.roomId());

    await expect(result).rejects.toEqual(notFoundError());
    expect(bookingRepository.findBookingByUserId).toBeCalledTimes(1);
    expect(roomRepository.findRoom).toBeCalledTimes(1);
  });

  it("should throw a Forbidden error if given roomId doesn't have vacancy", async () => {
    const oldBooking = mockBookings.booking();
    jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
      return oldBooking;
    });

    const room = mockBookings.room();
    jest.spyOn(roomRepository, 'findRoom').mockImplementationOnce((): any => {
      return room;
    });

    const bookings: Booking[] = [];
    for (let i = room.capacity; i > 0; i--) {
      bookings.push(mockBookings.booking());
    }
    jest.spyOn(bookingRepository, 'findBookingsByRoomId').mockImplementationOnce((): any => {
      return bookings;
    });

    const result = bookingsService.updateBooking(mockBookings.userId(), mockBookings.roomId());

    await expect(result).rejects.toEqual(forbiddenError());
    expect(bookingRepository.findBookingByUserId).toBeCalledTimes(1);
    expect(roomRepository.findRoom).toBeCalledTimes(1);
    expect(bookingRepository.findBookingsByRoomId).toBeCalledTimes(1);
  });

  it('should update Booking and return formatted Booking id', async () => {
    const oldBooking = mockBookings.booking();
    jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
      return oldBooking;
    });

    const room = mockBookings.room();
    jest.spyOn(roomRepository, 'findRoom').mockImplementationOnce((): any => {
      return room;
    });

    const bookings: Booking[] = [];
    for (let i = room.capacity - 1; i > 0; i--) {
      bookings.push(mockBookings.booking());
    }
    jest.spyOn(bookingRepository, 'findBookingsByRoomId').mockImplementationOnce((): any => {
      return bookings;
    });

    const booking = mockBookings.booking();
    jest.spyOn(bookingRepository, 'updateBookingById').mockImplementationOnce((): any => {
      return booking;
    });

    const result = bookingsService.updateBooking(mockBookings.userId(), mockBookings.roomId());

    await expect(result).resolves.toEqual({ bookingId: booking.id });
    expect(bookingRepository.findBookingByUserId).toBeCalledTimes(1);
    expect(roomRepository.findRoom).toBeCalledTimes(1);
    expect(bookingRepository.findBookingsByRoomId).toBeCalledTimes(1);
    expect(bookingRepository.updateBookingById).toBeCalledTimes(1);
  });
});
