/*
  Warnings:

  - You are about to drop the column `Code` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Ad` table. All the data in the column will be lost.
  - Added the required column `code` to the `Ad` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
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
    "notes" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Ad" ("apartmentNumber", "basin", "classification", "createdAt", "createdBy", "directorate", "expectedRentAmount", "facebookLink", "governorate", "id", "instagramLink", "neighborhood", "notes", "plot", "propertyAgentIdentity", "propertyAgentName", "propertyAgentNumber", "propertyLink", "propertyOwnerIdentity", "propertyOwnerName", "propertyOwnerNumber", "propertyStatus", "propertyType", "status", "updatedAt", "updatedBy", "village") SELECT "apartmentNumber", "basin", "classification", "createdAt", "createdBy", "directorate", "expectedRentAmount", "facebookLink", "governorate", "id", "instagramLink", "neighborhood", "notes", "plot", "propertyAgentIdentity", "propertyAgentName", "propertyAgentNumber", "propertyLink", "propertyOwnerIdentity", "propertyOwnerName", "propertyOwnerNumber", "propertyStatus", "propertyType", "status", "updatedAt", "updatedBy", "village" FROM "Ad";
DROP TABLE "Ad";
ALTER TABLE "new_Ad" RENAME TO "Ad";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
