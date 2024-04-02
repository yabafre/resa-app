// /api/employees/[serviceId]/
import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/employees/[serviceId]';

describe('/api/employees/[serviceId]/', () => {
    it('should return employee details for a given service ID', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { serviceId: '1' },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        // Assurez-vous que la réponse contient les détails attendus
        expect(JSON.parse(res._getData())).toHaveProperty('employees');
    });
});
