import { prisma } from '@/config';

async function findBookingByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: { userId }
    });
}

async function findBookingWithRoomByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: { userId },
        include: Room
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
