// Test: Créer une catégorie de service et un service dans cette catégorie
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Category and Service Creation', () => {
    it('should create a service category and a service within that category', async () => {
        const categoryName = process.env.TEST_SERVICE_CATEGORY_NAME;
        const serviceName = process.env.TEST_SERVICE_NAME;

        // Créer la catégorie
        const category = await prisma.serviceCategory.upsert({
            where: { name: categoryName },
            update: {},
            create: { name: categoryName },
        });

        // Créer le service
        const service = await prisma.service.upsert({
            where: { name: serviceName },
            update: {},
            create: {
                name: serviceName,
                duration: 30,
                price: 20.0,
                description: 'A test men\'s haircut.',
                category: {
                    connect: { name: categoryName },
                },
            },
        });

        expect(category).toHaveProperty('id');
        expect(service).toHaveProperty('id');
        expect(service.categoryId).toBe(category.id);
    });
});
