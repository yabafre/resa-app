import { PrismaClient } from '@prisma/client';
import { parseISO, format, addMinutes, isBefore, isAfter } from 'date-fns';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Seules les requêtes GET sont autorisées' });
    }

    const { employeeId } = req.query;
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: 'Le paramètre date est requis.' });
    }

    try {
        const selectedDate = parseISO(date);
        const dayOfWeek = format(selectedDate, 'iiii');

        // Récupérer les créneaux de travail hebdomadaires pour le jour spécifié
        const weeklyWorkSlots = await prisma.weeklyWorkSlot.findMany({
            where: {
                employeeId: parseInt(employeeId),
                dayOfWeek: dayOfWeek,
            },
            include: {
                times: true,
            },
        });

        // Récupérer tous les rendez-vous existants pour cet employé à cette date
        const appointments = await prisma.appointment.findMany({
            where: {
                employeeId: parseInt(employeeId),
                date: date,
            },
        });

        // Convertir les heures des rendez-vous pour faciliter la comparaison
        const appointmentsTimes = appointments.map(app => ({
            start: parseISO(`${format(app.date, 'yyyy-MM-dd')}T${app.startTime}`),
            end: parseISO(`${format(app.date, 'yyyy-MM-dd')}T${app.endTime}`),
        }));

        // Filtrer les créneaux disponibles en excluant ceux qui se chevauchent avec des rendez-vous
        const availableSlots = weeklyWorkSlots.flatMap(slot =>
            slot.times.filter(timeSlot => {
                const slotStart = parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${timeSlot.startTime}`);
                const slotEnd = parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${timeSlot.endTime}`);

                // Vérifier le chevauchement
                return !appointmentsTimes.some(appTime =>
                    (isBefore(slotStart, appTime.end) && isAfter(slotEnd, appTime.start))
                );
            })
        );

        res.status(200).json({ weeklyWorkSlots: availableSlots });
    } catch (error) {
        console.error('Erreur lors de la récupération des disponibilités:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des disponibilités de l\'employé' });
    } finally {
        await prisma.$disconnect();
    }
}
