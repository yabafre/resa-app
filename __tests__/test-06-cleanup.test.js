// Test: Nettoyage après les tests
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Cleanup Test Data', () => {
    it('should clean up all test data', async () => {
        // Supprimer les rendez-vous liés au client de test
        await prisma.appointment.deleteMany({
            where: { client: { email: process.env.TEST_CLIENT_EMAIL } }
        });

        // Trouver les IDs des WeeklyWorkSlots liés à l'employé de test
        const weeklyWorkSlots = await prisma.weeklyWorkSlot.findMany({
            where: { employee: { name: process.env.TEST_EMPLOYEE_NAME } },
            select: { id: true }
        });
        const weeklyWorkSlotIds = weeklyWorkSlots.map(ws => ws.id);

        // Supprimer les WorkSlotTime liés aux WeeklyWorkSlots trouvés
        await prisma.workSlotTime.deleteMany({
            where: { weeklyWorkSlotId: { in: weeklyWorkSlotIds } }
        });

        // Supprimer les WeeklyWorkSlots de l'employé de test
        await prisma.weeklyWorkSlot.deleteMany({
            where: { id: { in: weeklyWorkSlotIds } }
        });

        // Supprimer l'employé de test
        await prisma.employee.deleteMany({
            where: { name: process.env.TEST_EMPLOYEE_NAME }
        });

        // Supprimer le service de test
        await prisma.service.deleteMany({
            where: { name: process.env.TEST_SERVICE_NAME }
        });

        // Supprimer la catégorie de service de test
        await prisma.serviceCategory.deleteMany({
            where: { name: process.env.TEST_SERVICE_CATEGORY_NAME }
        });

        await prisma.$disconnect();

        expect(true).toBe(true);
    });
});
