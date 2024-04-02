// tests/availability.test.js test '/api/employees/check/1/availability?date=2024-04-02'
import { createMocks } from 'node-mocks-http'
import handler from '../pages/api/employees/check/[employeeId]/availability';


describe('/api/employees/check/[employeeId]/availability', () => {
    it('should return availability', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: {
                employeeId: '1',
                date: '2024-04-02',
            },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toHaveProperty('weeklyWorkSlots');
    });

    it('returns 200 if employee is not available', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: {
                employeeId: '14848',
                date: '2024-04-02',
            },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);

    });
})