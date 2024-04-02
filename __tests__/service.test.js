const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Service CRUD', () => {
    const nameTest = `Test Service`;
    const categoryNameTest = 'New Category test'

    // Nettoyage avant chaque test
    beforeEach(async () => {
        await prisma.service.deleteMany({
            where: { name: nameTest },
        });
        await prisma.serviceCategory.deleteMany({
            where: { name: categoryNameTest },
        });
    });

    it('creates a service', async () => {
        const service = await prisma.service.create({
            data: {
                name: nameTest,
                duration: 30,
                description: "This is a test service",
                price: 100,
                category: {
                    create: { name: categoryNameTest },
                },
            },
        });

        expect(service).toHaveProperty('id');
        expect(service.name).toEqual(nameTest); // Correction ici pour correspondre au nom utilisé
    });

    // Nettoyage après tous les tests
    afterAll(async () => {
        await prisma.service.deleteMany({
            where: { name: nameTest },
        });
        await prisma.serviceCategory.deleteMany({
            where: {name: categoryNameTest}
        })
        await prisma.$disconnect();
    });



});
