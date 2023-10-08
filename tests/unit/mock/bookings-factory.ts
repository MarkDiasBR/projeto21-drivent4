import { faker } from '@faker-js/faker';
import { Ticket, TicketType } from '@prisma/client';
import { BookingWithRoom } from '@/protocols';

export function bookingWithRoom(): BookingWithRoom {
  return {
    id: faker.datatype.number({ min: 1, max: 9999 }),
    userId: faker.datatype.number({ min: 1, max: 9999 }),
    roomId: faker.datatype.number({ min: 1, max: 9999 }),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    Room: {
      id: faker.datatype.number({ min: 1, max: 9999 }),
      name: faker.datatype.number({ min: 100, max: 999 }).toString(),
      capacity: faker.datatype.number({ min: 1, max: 3 }),
      hotelId: faker.datatype.number({ min: 1, max: 999 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    },
  };
}

export function booking() {
  return {
    id: faker.datatype.number({ min: 1, max: 9999 }),
    userId: faker.datatype.number({ min: 1, max: 9999 }),
    roomId: faker.datatype.number({ min: 1, max: 9999 }),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };
}

export function ticket(): Ticket & { TicketType: TicketType } {
  return {
    id: faker.datatype.number({ min: 1, max: 9999 }),
    ticketTypeId: faker.datatype.number({ min: 1, max: 9999 }),
    enrollmentId: faker.datatype.number({ min: 1, max: 9999 }),
    status: 'PAID',
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    TicketType: {
      id: faker.datatype.number({ min: 1, max: 9999 }),
      name: faker.name.findName(),
      price: faker.datatype.number({ min: 100, max: 600 }),
      isRemote: false,
      includesHotel: true,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    },
  };
}

export function remoteTicket(): Ticket & { TicketType: TicketType } {
  return {
    id: faker.datatype.number({ min: 1, max: 9999 }),
    ticketTypeId: faker.datatype.number({ min: 1, max: 9999 }),
    enrollmentId: faker.datatype.number({ min: 1, max: 9999 }),
    status: 'PAID',
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    TicketType: {
      id: faker.datatype.number({ min: 1, max: 9999 }),
      name: faker.name.findName(),
      price: faker.datatype.number({ min: 100, max: 600 }),
      isRemote: true,
      includesHotel: false,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    },
  };
}

export function noHotelTicket(): Ticket & { TicketType: TicketType } {
  return {
    id: faker.datatype.number({ min: 1, max: 9999 }),
    ticketTypeId: faker.datatype.number({ min: 1, max: 9999 }),
    enrollmentId: faker.datatype.number({ min: 1, max: 9999 }),
    status: 'PAID',
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    TicketType: {
      id: faker.datatype.number({ min: 1, max: 9999 }),
      name: faker.name.findName(),
      price: faker.datatype.number({ min: 100, max: 600 }),
      isRemote: false,
      includesHotel: false,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    },
  };
}

export function unpaidTicket(): Ticket & { TicketType: TicketType } {
  return {
    id: faker.datatype.number({ min: 1, max: 9999 }),
    ticketTypeId: faker.datatype.number({ min: 1, max: 9999 }),
    enrollmentId: faker.datatype.number({ min: 1, max: 9999 }),
    status: 'RESERVED',
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    TicketType: {
      id: faker.datatype.number({ min: 1, max: 9999 }),
      name: faker.name.findName(),
      price: faker.datatype.number({ min: 100, max: 600 }),
      isRemote: false,
      includesHotel: true,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    },
  };
}

export function room() {
  return {
    id: faker.datatype.number({ min: 1, max: 9999 }),
    name: faker.datatype.number({ min: 100, max: 999 }).toString(),
    capacity: faker.datatype.number({ min: 1, max: 3 }),
    hotelId: faker.datatype.number({ min: 1, max: 999 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function userId(): number {
  return faker.datatype.number({ min: 1, max: 999 });
}

export function roomId(): number {
  return faker.datatype.number({ min: 1, max: 999 });
}
