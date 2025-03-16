/*
  Warnings:

  - You are about to drop the column `images` on the `ApartmentRenterInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ApartmentRenterInfo" DROP COLUMN "images",
ADD COLUMN     "identificationImage" TEXT,
ADD COLUMN     "contractImage" TEXT;
