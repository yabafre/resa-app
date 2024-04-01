/*
  Warnings:

  - You are about to drop the column `scheduleId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the `Hours` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Hours" DROP CONSTRAINT "Hours_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_employeeId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "scheduleId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "employeeId" INTEGER NOT NULL,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;

-- DropTable
DROP TABLE "Hours";

-- DropTable
DROP TABLE "Schedule";

-- CreateTable
CREATE TABLE "WeeklyWorkSlot" (
    "id" SERIAL NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "WeeklyWorkSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkSlotTime" (
    "id" SERIAL NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "weeklyWorkSlotId" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WorkSlotTime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeeklyWorkSlot" ADD CONSTRAINT "WeeklyWorkSlot_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSlotTime" ADD CONSTRAINT "WorkSlotTime_weeklyWorkSlotId_fkey" FOREIGN KEY ("weeklyWorkSlotId") REFERENCES "WeeklyWorkSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
