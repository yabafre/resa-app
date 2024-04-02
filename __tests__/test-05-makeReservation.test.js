import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/reservation/index';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('/api/reservation', () => {

    const dateReserved = process.env.TEST_DATE_RESERVATION;
    const employeeName = process.env.TEST_EMPLOYEE_NAME;
    const clientName = process.env.TEST_CLIENT_NAME;
    const clientEmail = process.env.TEST_CLIENT_EMAIL;
    const clientPhone = process.env.TEST_CLIENT_PHONE;
    const notes = process.env.TEST_NOTES;
    const timeSlot = process.env.TEST_TIME_RESERVATION;
    const serviceName = process.env.TEST_SERVICE_NAME;

    it('should create a reservation', async () => {

        const employee = await prisma.employee.findUnique({
            where: { name: employeeName },
        });

        expect(employee).not.toBeNull();

        const service = await prisma.service.findUnique({
            where: { name: serviceName },
        });

        expect(service).not.toBeNull();


        const { req, res } = createMocks({
            method: 'POST',
            body: {
                clientName: clientName,
                clientEmail: clientEmail,
                clientPhone: clientPhone,
                notes: notes,
                date: dateReserved,
                timeSlot: timeSlot,
                employeeId: employee.id,
                serviceIds: [service.id],
            },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
    });
});
