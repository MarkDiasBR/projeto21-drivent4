import { prisma } from '@/config';
import { Room } from '@prisma/client';

async function findBookingByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: { userId }
    });
}

type BookingWithUser = {
    id: number;
    userId: number;
    roomId: number;
    createdAt: Date;
    updatedAt: Date;
    Room: Room;
}

async function findBookingWithRoomByUserId(userId: number): Promise<BookingWithUser> {
    return prisma.booking.findFirst({
        where: { userId },
        include: { 
            Room: true
        }
    });
}

async function findBookingsByRoomId(roomId: number) {
    return prisma.booking.findMany({
        where: { roomId }
    })
}

async function createBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data: {
            userId,
            roomId
        }
    })
}

async function updateBookingById(userId: number, roomId: number, bookingId: number) {
    return prisma.booking.update({
        where: { id: bookingId },
        data: {
            userId,
            roomId
        }
    })
}

export const bookingRepository = {
    findBookingByUserId,
    findBookingWithRoomByUserId,
    findBookingsByRoomId,
    createBooking,
    updateBookingById
}
