/*
  Warnings:

  - You are about to drop the column `images` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `renterCountry` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `renterIdentification` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `renterName` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `renterNationality` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `renterNumber` on the `Apartment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Apartment" DROP COLUMN "images",
DROP COLUMN "renterCountry",
DROP COLUMN "renterIdentification",
DROP COLUMN "renterName",
DROP COLUMN "renterNationality",
DROP COLUMN "renterNumber";

-- CreateTable
CREATE TABLE "ApartmentRenterInfo" (
    "id" SERIAL NOT NULL,
    "renterName" TEXT NOT NULL,
    "renterNumber" TEXT NOT NULL DEFAULT '###',
    "renterNationality" TEXT,
    "renterCountry" TEXT,
    "renterIdentification" TEXT,
    "images" TEXT,
    "apartmentId" INTEGER,

    CONSTRAINT "ApartmentRenterInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApartmentRenterInfo" ADD CONSTRAINT "ApartmentRenterInfo_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
