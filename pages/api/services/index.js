import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const servicesByCategory = await prisma.serviceCategory.findMany({
        include: {
          services: true,
        },
      });
      console.log('Fetched services successfully');
      res.status(200).json(servicesByCategory);
    } catch (error) {
      console.error('Failed to fetch services:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to fetch services', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}