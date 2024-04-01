import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { serviceId } = req.query;

  if (req.method === 'GET') {
    try {
      console.log(`Fetching employees for serviceId: ${serviceId}`);
      const employees = await prisma.employee.findMany({
        where: {
          services: {
            some: {
              id: parseInt(serviceId),
            },
          },
          },
      });
      console.log(`Fetched ${employees.length} employees successfully`);
      res.status(200).json(employees);
    } catch (error) {
      console.error('Failed to fetch employees:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to fetch employees', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    console.log(`Method ${req.method} not allowed`);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}