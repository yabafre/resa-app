import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/services/index';

describe('/api/services', () => {
    it('should list all services', async () => {
        const { req, res } = createMocks({
            method: 'GET',
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(Array.isArray(data)).toBeTruthy();
        // Ajoutez d'autres assertions ici si nécessaire
    });
});
