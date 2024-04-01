const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed...');

  const serviceCategoriesData = [
    'coupe homme', 'coupe femme', 'barbe', 'coloration', 'Soin Des Cheveux Et Du Cuir Chevelu', 'brushing', 'Coupe Et Coiffure'
  ];

  const servicesData = [
    // Each service should have a name, a description, a price, a duration and a categoryName
    { name: 'Coupe au ciseaux sur cheveux court', description: 'Vous profitez ainsi : D\'un shampoing qui laisse vos cheveux d\'une incroyable douceur, D\'une coupe adaptée à vos envies et vos besoins, D\'un coiffage qui sublime votre chevelure.', price: 38, duration: 30, categoryName: 'coupe homme' },
    { name: 'Coupe au ciseaux sur cheveux long', description: 'Vous profitez ainsi : D\'un shampoing qui laisse vos cheveux d\'une incroyable douceur, D\'une coupe adaptée à vos envies et vos besoins, D\'un coiffage qui sublime votre chevelure.', price: 45, duration: 60, categoryName: 'coupe homme' },
    { name: 'Coupe & Shampoing', description: 'Vous profitez ainsi : D\'un shampoing qui laisse vos cheveux d\'une incroyable douceur, D\'une coupe adaptée à vos envies et vos besoins, D\'un coiffage qui sublime votre chevelure.', price: 50, duration: 70, categoryName: 'coupe homme' },
    { name: 'Coupe & Brushing', description: 'Vous profitez ainsi : D\'un shampoing qui laisse vos cheveux d\'une incroyable douceur, D\'une coupe adaptée à vos envies et vos besoins, D\'un coiffage qui sublime votre chevelure.', price: 55, duration: 60, categoryName: 'coupe femme' },
    {name: 'Mèche, soin shampooing', description: 'Vous profitez ainsi : D\'un shampoing qui laisse vos cheveux d\'une incroyable douceur, D\'une coupe adaptée à vos envies et vos besoins, D\'un coiffage qui sublime votre chevelure.', price: 60, duration: 90, categoryName: 'coupe femme'},
    {name: 'Rasage à l\'ancienne et soins de la barbe', description: 'Rasage à l’ancienne plus soins Ce rasage professionnel est réalisé à l\'aide d\'un coupe-chou à l\'ancienne pour un résultat haute précision et une peau impeccablement lisse. Il est suivi d\'un soin de la barbe pour nourrir et hydrater la peau et les poils.', price: 50, duration: 60, categoryName: 'barbe'},
    {name: 'Coloration', description: 'Coloration des racines, soin et brushing', price: 70, duration: 120, categoryName: 'coloration'},
    {name: 'Soin Des Cheveux Et Du Cuir Chevelu', description: 'Soin des cheveux et du cuir chevelu, shampoing et brushing', price: 40, duration: 60, categoryName: 'Soin Des Cheveux Et Du Cuir Chevelu'},
    {name: 'Brushing', description: 'Brushing, shampoing et soin', price: 30, duration: 45, categoryName: 'brushing'},
    {name: 'Coupe Et Coiffure', description: 'Coupe et coiffure, shampoing et soin', price: 50, duration: 60, categoryName: 'Coupe Et Coiffure'},
    {name: 'Taille de la moustache', description: 'Taille de la moustache, shampoing et soin', price: 20, duration: 30, categoryName: 'barbe'},
    {name: 'Coloration des racines', description: 'Coloration des racines, shampoing et soin', price: 50, duration: 60, categoryName: 'coloration'},
    {name: 'Coloration des pointes', description: 'Coloration des pointes, shampoing et soin', price: 80, duration: 60, categoryName: 'coloration'},
    {name: 'Coloration, Shampooing et Brushing', description: 'Coloration, shampooing et brushing', price: 60, duration: 90, categoryName: 'coloration'},
    {name: 'Décoloration', description: 'Décoloration, shampooing et brushing', price: 75, duration: 90, categoryName: 'coloration'},
    {name: 'Coupe, Shampooing et Brushing (Cheveux longs)', description: 'Coupe, shampooing et brushing (cheveux longs)', price: 165, duration: 90, categoryName: 'coupe femme'},
  ];

  const employeesData = [
    // Each employee should have a name, a role
    { name: 'John Doe', role: 'Barber' },
    { name: 'Alice Smith', role: 'Hairdresser' },
    { name: 'Bob Smith', role: 'Hairdresser' },
    { name: 'Charlie Brown', role: 'Specialist' },
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const hoursData = [
    // Add your hours data here
    // Each hour and an availability status
    { hour: '09:00', available: true },
    { hour: '09:30', available: true },
    { hour: '10:00', available: true },
    { hour: '10:30', available: true },
    { hour: '11:00', available: true },
    { hour: '11:30', available: true },
    { hour: '14:00', available: true },
    { hour: '14:30', available: true },
    { hour: '15:00', available: true },
    { hour: '15:30', available: true },
    { hour: '16:00', available: true },
    { hour: '16:30', available: true },
    { hour: '17:00', available: true },
    { hour: '17:30', available: true },
    { hour: '18:00', available: true },
  ];
  function getRandomDaysOff() {
    // Randomly select 2 days off for each employee from the daysOfWeek array
    const daysOff = [];
    while (daysOff.length < 2) {
      const randomIndex = Math.floor(Math.random() * daysOfWeek.length);
      const randomDay = daysOfWeek[randomIndex];
      if (!daysOff.includes(randomDay)) {
        daysOff.push(randomDay);
      }
    }
    return daysOff;
  }

  for (const category of serviceCategoriesData) {
    const record = await prisma.serviceCategory.create({
      data: { name: category },
    }).catch((error) => {
      console.error(`Error while seeding service category: ${category}`, error.message, error.stack);
    });

    if (record) {
      console.log(`Service category seeded: ${record.name}`);
    }
  }

  for (const service of servicesData) {
      const record = await prisma.service.create({
        data: {
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          category: {
            connect: {
              name: service.categoryName,
            },
          },
        },
      }).catch((error) => {
        console.error(`Error while seeding service: ${service.name}`, error.message, error.stack);
      });
    }

  async function seedEmployeesServiceAndHours() {
    for (const employee of employeesData) {
      const createdEmployee = await prisma.employee.create({ data: employee });
      const allServices = await prisma.service.findMany();
      // Suppose que chaque employé peut fournir un sous-ensemble aléatoire de services
      const assignedServices = allServices.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * allServices.length));

      // Connexion des services à l'employé
      for (const service of assignedServices) {
        await prisma.employee.update({
          where: { id: createdEmployee.id },
          data: {
            services: {
              connect: [{ id: service.id }],
            },
          },
        });
      }

      // Création des créneaux de travail hebdomadaires
      for (const day of daysOfWeek) {
        // Création d'un WeeklyWorkSlot pour chaque jour de travail de l'employé
        const workSlot = await prisma.weeklyWorkSlot.create({
          data: {
            dayOfWeek: day,
            employeeId: createdEmployee.id,
          },
        });

        // Pour chaque jour, création des WorkSlotTime en respectant les disponibilités
        for (const hour of hoursData) {
          await prisma.workSlotTime.create({
            data: {
              startTime: hour.hour,
              // Supposons que chaque créneau dure 30 minutes pour cet exemple
              endTime: getNextHalfHour(hour.hour), // Fonction à définir pour calculer le prochain créneau de 30 minutes
              available: hour.available, // On peut ajuster cela en fonction des besoins
              weeklyWorkSlotId: workSlot.id,
            },
          });
        }
      }
    }
  }

// Fonction auxiliaire pour calculer le prochain créneau de 30 minutes
  function getNextHalfHour(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const nextTime = new Date(0, 0, 0, hours, minutes + 30); // Ajoute 30 minutes
    return nextTime.toTimeString().slice(0, 5); // Retourne le résultat au format "HH:MM"
  }

  seedEmployeesServiceAndHours().then(() => {
    console.log('Finished seeding employees, services, and work slots.');
  }).catch((error) => {
    console.error('Error while seeding employees, services, and work slots:', error.message);
  });

}

main()
    .catch((e) => {
      console.error('Error during seeding', e.message, e.stack);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });