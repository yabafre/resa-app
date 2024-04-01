import { PrismaClient } from '@prisma/client';
import { addMinutes, format } from 'date-fns';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { clientName, clientEmail, clientPhone, notes, date, timeSlot, employeeId, serviceIds } = req.body;

    try {
      const employeeIdNum = Number(employeeId);

      // Récupérer les durées des services
      const services = await prisma.service.findMany({
        where: {
          id: { in: serviceIds.map(Number) },
        },
      });

      const totalDuration = services.reduce((acc, service) => acc + service.duration, 0);
      const startTime = new Date(`${date}T${timeSlot}:00.000Z`);
      const endTime = addMinutes(startTime, totalDuration);

      // Convertissez endTime au format "HH:MM"
      const formattedEndTime = format(endTime, 'HH:mm');

      const newAppointment = await prisma.appointment.create({
        data: {
          client: {
            create: { name: clientName, email: clientEmail, phone: clientPhone, notes },
          },
          date, //  date format "YYYY-MM-DD"
          startTime: timeSlot, // startTime format "HH:MM"
          endTime: formattedEndTime,
          employee: { connect: { id: employeeIdNum } },
          services: { connect: serviceIds.map(id => ({ id })) },
        },
      });

      return res.status(200).json(totalDuration);
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      return res.status(500).json({ error: "Erreur lors de la création de la réservation" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
