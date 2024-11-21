-- CreateTable
CREATE TABLE "Building" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "apartmentsCount" INTEGER NOT NULL DEFAULT 0,
    "storeCount" INTEGER NOT NULL DEFAULT 0,
    "basinName" TEXT NOT NULL,
    "basinNumber" TEXT NOT NULL,
    "landNumber" TEXT NOT NULL,
    "electricBill" TEXT DEFAULT '-',
    "serviceAmount" REAL NOT NULL DEFAULT 0.0,
    "maintenanceAmount" REAL NOT NULL DEFAULT 0.0,
    "registeredApartmentsCount" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT DEFAULT '-',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT DEFAULT '-',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Apartment" (
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

-- CreateTable
CREATE TABLE "Payment" (
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

-- CreateTable
CREATE TABLE "Ad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "propertyStatus" TEXT NOT NULL,
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
    "apartmentNumber" TEXT,
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

-- CreateTable
CREATE TABLE "InterestedPeople" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL DEFAULT '###',
    "adId" INTEGER,
    CONSTRAINT "InterestedPeople_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Building_name_key" ON "Building"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ad_code_key" ON "Ad"("code");
