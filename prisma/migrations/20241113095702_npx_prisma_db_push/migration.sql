/*
  Warnings:

  - You are about to drop the column `ApartmentNumber` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `Basin` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `Classification` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `Directorate` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `ExpectedRentAmount` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `FacebookLink` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `Governorate` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `InstagramLink` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `Neighborhood` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `Notes` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `Number` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `Plot` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `PropertyAgentIdentity` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `PropertyAgentName` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `PropertyAgentNumber` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `PropertyLink` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `PropertyOwnerIdentity` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `PropertyOwnerName` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `PropertyOwnerNumber` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `PropertyStatus` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `PropertyType` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `Village` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `AgentName` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `AgentNumber` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `ApartmentNumber` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `AreaNumber` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `BuildingId` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `ClearanceFileName` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `CommissionAmount` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `ContractFileName` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `CreatedAt` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `CreatedBy` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `ElectricSub` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `LandingNumber` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `MaintenanceDiscount` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `OwnerName` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `OwnerNumber` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `RealLocation` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `Services` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedBy` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `WaterSub` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `InterestedPeople` table. All the data in the column will be lost.
  - You are about to drop the column `Number` on the `InterestedPeople` table. All the data in the column will be lost.
  - You are about to drop the column `ApartmentId` on the `Rent` table. All the data in the column will be lost.
  - You are about to drop the column `RentAmount` on the `Rent` table. All the data in the column will be lost.
  - You are about to drop the column `RentDate` on the `Rent` table. All the data in the column will be lost.
  - You are about to drop the column `RentDuration` on the `Rent` table. All the data in the column will be lost.
  - You are about to drop the column `RentPaymentWays` on the `Rent` table. All the data in the column will be lost.
  - You are about to drop the column `RentStatus` on the `Rent` table. All the data in the column will be lost.
  - You are about to drop the column `RenterName` on the `Rent` table. All the data in the column will be lost.
  - You are about to drop the column `RenterNumber` on the `Rent` table. All the data in the column will be lost.
  - Added the required column `apartmentNumber` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basin` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `directorate` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `governorate` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plot` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyOwnerIdentity` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyOwnerName` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyStatus` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyType` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `village` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agentName` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apartmentNumber` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `areaNumber` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildingName` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landingNumber` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerName` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `InterestedPeople` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apartmentId` to the `Rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractFileName` to the `Rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentDuration` to the `Rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `renterName` to the `Rent` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Code" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "propertyStatus" INTEGER NOT NULL,
    "propertyType" INTEGER NOT NULL,
    "propertyOwnerName" TEXT NOT NULL,
    "propertyOwnerNumber" TEXT NOT NULL DEFAULT '###',
    "propertyOwnerIdentity" TEXT NOT NULL,
    "propertyAgentName" TEXT,
    "propertyAgentNumber" TEXT NOT NULL DEFAULT '###',
    "propertyAgentIdentity" TEXT NOT NULL DEFAULT '.',
    "facebookLink" TEXT,
    "instagramLink" TEXT,
    "propertyLink" TEXT,
    "governorate" TEXT NOT NULL,
    "directorate" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "basin" TEXT NOT NULL,
    "plot" TEXT NOT NULL,
    "apartmentNumber" TEXT NOT NULL,
    "classification" TEXT,
    "neighborhood" TEXT,
    "expectedRentAmount" TEXT,
    "notes" TEXT
);
INSERT INTO "new_Ad" ("Code", "id") SELECT "Code", "id" FROM "Ad";
DROP TABLE "Ad";
ALTER TABLE "new_Ad" RENAME TO "Ad";
CREATE TABLE "new_Apartment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apartmentNumber" TEXT NOT NULL,
    "areaNumber" TEXT NOT NULL,
    "landingNumber" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerNumber" TEXT,
    "agentName" TEXT NOT NULL,
    "agentNumber" TEXT,
    "realLocation" TEXT,
    "electricSub" TEXT,
    "waterSub" TEXT,
    "commissionAmount" INTEGER NOT NULL DEFAULT 0,
    "maintenanceDiscount" INTEGER NOT NULL DEFAULT 0,
    "services" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "buildingName" TEXT NOT NULL,
    CONSTRAINT "Apartment_buildingName_fkey" FOREIGN KEY ("buildingName") REFERENCES "Building" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Apartment" ("id") SELECT "id" FROM "Apartment";
DROP TABLE "Apartment";
ALTER TABLE "new_Apartment" RENAME TO "Apartment";
CREATE TABLE "new_InterestedPeople" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL DEFAULT '###',
    "adId" INTEGER,
    CONSTRAINT "InterestedPeople_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_InterestedPeople" ("adId", "id") SELECT "adId", "id" FROM "InterestedPeople";
DROP TABLE "InterestedPeople";
ALTER TABLE "new_InterestedPeople" RENAME TO "InterestedPeople";
CREATE TABLE "new_Rent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "renterName" TEXT NOT NULL,
    "renterNumber" TEXT NOT NULL DEFAULT '###',
    "rentDuration" TEXT NOT NULL,
    "rentAmount" REAL NOT NULL DEFAULT 0.0,
    "rentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rentPaymentWays" TEXT,
    "isFurniture" BOOLEAN NOT NULL DEFAULT false,
    "rentStatus" INTEGER NOT NULL DEFAULT 3,
    "contractFileName" TEXT NOT NULL,
    "clearanceFileName" TEXT,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "apartmentId" INTEGER NOT NULL,
    CONSTRAINT "Rent_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rent" ("createdAt", "createdBy", "id", "isFurniture", "status", "updatedAt", "updatedBy") SELECT "createdAt", "createdBy", "id", "isFurniture", "status", "updatedAt", "updatedBy" FROM "Rent";
DROP TABLE "Rent";
ALTER TABLE "new_Rent" RENAME TO "Rent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
