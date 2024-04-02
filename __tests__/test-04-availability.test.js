// tests/availability.test.js test '/api/employees/check/1/availability?date=2024-04-02'
import { createMocks } from 'node-mocks-http'
import handler from '../pages/api/employees/check/[employeeId]/availability';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('/api/employees/check/[employeeId]/availability', () => {
    const employeeName = process.env.TEST_EMPLOYEE_NAME;
    const dateReserved = process.env.TEST_DATE_RESERVATION;

    it('should return availability', async () => {

        const employee = await prisma.employee.findUnique({
            where: { name: employeeName },
        });

        expect(employee).not.toBeNull();

        const { req, res } = createMocks({
            method: 'GET',
            query: {
                employeeId: employee.id,
                date: dateReserved,
            },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toHaveProperty('weeklyWorkSlots');
    });

})