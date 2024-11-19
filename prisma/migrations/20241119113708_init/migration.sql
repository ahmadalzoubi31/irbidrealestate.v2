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
    "propertyAgentIdentity" TEXT NOT NULL,
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
INSERT INTO "new_Ad" ("apartmentNumber", "basin", "classification", "code", "createdAt", "createdBy", "directorate", "expectedRentAmount", "facebookLink", "governorate", "id", "instagramLink", "neighborhood", "notes", "plot", "propertyAgentIdentity", "propertyAgentName", "propertyAgentNumber", "propertyLink", "propertyOwnerIdentity", "propertyOwnerName", "propertyOwnerNumber", "propertyStatus", "propertyType", "status", "updatedAt", "updatedBy", "village") SELECT "apartmentNumber", "basin", "classification", "code", "createdAt", "createdBy", "directorate", "expectedRentAmount", "facebookLink", "governorate", "id", "instagramLink", "neighborhood", "notes", "plot", "propertyAgentIdentity", "propertyAgentName", "propertyAgentNumber", "propertyLink", "propertyOwnerIdentity", "propertyOwnerName", "propertyOwnerNumber", "propertyStatus", "propertyType", "status", "updatedAt", "updatedBy", "village" FROM "Ad";
DROP TABLE "Ad";
ALTER TABLE "new_Ad" RENAME TO "Ad";
CREATE UNIQUE INDEX "Ad_code_key" ON "Ad"("code");
CREATE TABLE "new_Apartment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "buildingName" TEXT NOT NULL,
    "apartmentNumber" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerNumber" TEXT,
    "agentName" TEXT NOT NULL,
    "agentNumber" TEXT,
    "realLocation" TEXT,
    "electricSub" TEXT,
    "waterSub" TEXT,
    "renterName" TEXT NOT NULL,
    "renterNumber" TEXT NOT NULL DEFAULT '###',
    "rentDuration" TEXT NOT NULL,
    "rentAmount" REAL NOT NULL DEFAULT 0.0,
    "rentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rentPaymentWay" TEXT,
    "isFurniture" BOOLEAN NOT NULL DEFAULT false,
    "rentStatus" INTEGER NOT NULL DEFAULT 3,
    "renterNationality" TEXT,
    "renterIdentification" TEXT,
    "isServiceIncluded" BOOLEAN NOT NULL DEFAULT false,
    "insurance" INTEGER NOT NULL DEFAULT 0,
    "commissionAmount" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Apartment_buildingName_fkey" FOREIGN KEY ("buildingName") REFERENCES "Building" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Apartment" ("agentName", "agentNumber", "apartmentNumber", "buildingName", "commissionAmount", "createdAt", "createdBy", "electricSub", "id", "insurance", "isFurniture", "isServiceIncluded", "ownerName", "ownerNumber", "realLocation", "rentAmount", "rentDate", "rentDuration", "rentPaymentWay", "rentStatus", "renterIdentification", "renterName", "renterNationality", "renterNumber", "status", "updatedAt", "updatedBy", "waterSub") SELECT "agentName", "agentNumber", "apartmentNumber", "buildingName", "commissionAmount", "createdAt", "createdBy", "electricSub", "id", "insurance", "isFurniture", "isServiceIncluded", "ownerName", "ownerNumber", "realLocation", "rentAmount", "rentDate", "rentDuration", "rentPaymentWay", "rentStatus", "renterIdentification", "renterName", "renterNationality", "renterNumber", "status", "updatedAt", "updatedBy", "waterSub" FROM "Apartment";
DROP TABLE "Apartment";
ALTER TABLE "new_Apartment" RENAME TO "Apartment";
CREATE TABLE "new_InterestedPeople" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL DEFAULT '###',
    "adId" INTEGER,
    CONSTRAINT "InterestedPeople_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_InterestedPeople" ("adId", "id", "name", "number") SELECT "adId", "id", "name", "number" FROM "InterestedPeople";
DROP TABLE "InterestedPeople";
ALTER TABLE "new_InterestedPeople" RENAME TO "InterestedPeople";
CREATE TABLE "new_Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nextRentDate" DATETIME NOT NULL,
    "receivedPaymentDate" DATETIME NOT NULL,
    "depositAmount" INTEGER NOT NULL,
    "depositDate" DATETIME NOT NULL,
    "notes" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "apartmentId" INTEGER NOT NULL,
    CONSTRAINT "Payment_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("apartmentId", "createdAt", "createdBy", "depositAmount", "depositDate", "id", "nextRentDate", "notes", "receivedPaymentDate", "status", "updatedAt", "updatedBy") SELECT "apartmentId", "createdAt", "createdBy", "depositAmount", "depositDate", "id", "nextRentDate", "notes", "receivedPaymentDate", "status", "updatedAt", "updatedBy" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
