// Ce fichier contient les tests pour le point de terminaison /api/employees/[serviceId]/
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Time Slot Creation and Availability', () => {
    const employeeName = process.env.TEST_EMPLOYEE_NAME;
    const dayOfWeekEnv = process.env.TEST_DAY_OF_WEEK;
    const serviceName = process.env.TEST_SERVICE_NAME;
    const startTimeEnv = process.env.TEST_SLOT_START_TIME;
    const endTimeEnv = process.env.TEST_SLOT_END_TIME;

    beforeAll(async () => {
        // Assurez-vous que l'employé existe
        await prisma.employee.upsert({
            where: { name: employeeName },
            update: {},
            create: {
                name: employeeName,
                role: 'Barber',
            },
        });
    });

    it('creates weekly work slots for an employee and checks availability', async () => {
        // Récupérer l'employé par son nom
        const employee = await prisma.employee.findUnique({
            where: { name: employeeName },
        });
        expect(employee).not.toBeNull();

        // Créer un créneau de travail hebdomadaire
        const weeklyWorkSlot = await prisma.weeklyWorkSlot.create({
            data: {
                dayOfWeek: dayOfWeekEnv,
                employeeId: employee.id,
                times: {
                    create: [
                        {
                            startTime: startTimeEnv,
                            endTime: endTimeEnv,
                            available: true
                        },
                    ],
                },
            },
            include: {
                times: true, // Inclure les créneaux horaires dans la réponse
            }
        });


        // connecter le service à l'employé
        const service = await prisma.service.findUnique({
            where: { name: serviceName },
        });
        expect(service).not.toBeNull();
        await prisma.employee.update({
            where: { id: employee.id },
            data: {
                services: {
                    connect: [{ id: service.id }],
                },
            },
        });

        expect(weeklyWorkSlot).toHaveProperty('id');
        expect(weeklyWorkSlot.times).toHaveLength(1);

        // Ici, vous pourriez implémenter une logique pour vérifier la disponibilité en fonction de rendez-vous existants ou autres critères.
        // Ce test suppose simplement que les créneaux horaires sont créés correctement.
    });

});
