/*
  Warnings:

  - You are about to drop the column `date` on the `Hours` table. All the data in the column will be lost.
  - Added the required column `day` to the `Hours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hours" DROP COLUMN "date",
ADD COLUMN     "day" TEXT NOT NULL;
