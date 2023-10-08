import {
    createEnrollmentWithAddress,
    createTicketType,
    createTicket,
    createUser,
    createHotel,
    createRoomWithHotelId,
    createhAddressWithCEP,
    createBooking
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import httpStatus from 'http-status';
import { prisma } from '@/config';
import { faker } from '@faker-js/faker';
import app, { init, close } from '@/app';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { number } from 'joi';

beforeEach(async () => {
    await init();
    await cleanDb();
});

afterEach(async () => {
    await close();
})

const server = supertest(app);

describe("When fecthing a Booking [ GET /booking ]", () => {
    it('should respond with status 401 if no token is given', async () => {
        const result = await server.get('/booking');

        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 200 and Booking data', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking(user.id, room.id);

        const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(httpStatus.OK);
        expect(result.body).toStrictEqual({
            id: booking.id,
            Room: {
                ...room,
                createdAt: room.createdAt.toISOString(),
                updatedAt: room.updatedAt.toISOString(),
            }
        });
    });
});

describe("When creating a Booking [ POST /booking ]", () => {
    it('should respond with status 401 if no token is given', async () => {
        const result = await server.post('/booking');

        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const result = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const result = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 200 and Booking data', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);

        const body = { roomId: room.id };
        const result = await server.post('/booking').send(body).set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(httpStatus.OK);
        expect(result.body).toStrictEqual({ bookingId: expect.any(Number) });
    });
});

describe("When updating a Booking [ PUT /booking/:bookingId ]", () => {
    it('should respond with status 401 if no token is given', async () => {
        const result = await server.put('/booking/:bookingId');

        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const result = await server.put('/booking/:bookingId').set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const result = await server.put('/booking/:bookingId').set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 200 and Booking data', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const oldRoom = await createRoomWithHotelId(hotel.id);
        const oldBooking = await createBooking(user.id, oldRoom.id);
        const newRoom = await createRoomWithHotelId(hotel.id);

        const body = { roomId: newRoom.id };
        const result = await server.put('/booking/:bookingId').send(body).set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(httpStatus.OK);
        expect(result.body).toEqual({ bookingId: oldBooking.id });
    });
});