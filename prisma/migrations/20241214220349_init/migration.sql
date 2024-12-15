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
    "insurance" REAL NOT NULL DEFAULT 0,
    "commissionAmount" REAL NOT NULL DEFAULT 0,
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
    "depositAmount" REAL NOT NULL,
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
    "adId" INTEGER NOT NULL,
    CONSTRAINT "InterestedPeople_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerNumber" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "price" REAL NOT NULL DEFAULT 0.0,
    "firstStep" TEXT,
    "notes" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "claimDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimFrom" TEXT NOT NULL,
    "total" REAL NOT NULL DEFAULT 0.0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "apartmentId" INTEGER NOT NULL,
    CONSTRAINT "Claim_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment" REAL NOT NULL DEFAULT 0.0,
    "notes" TEXT,
    "claimId" INTEGER NOT NULL,
    CONSTRAINT "Collection_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Detail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item" TEXT NOT NULL,
    "price" REAL NOT NULL DEFAULT 0.0,
    "claimId" INTEGER NOT NULL,
    CONSTRAINT "Detail_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AppFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_ApartmentToAppFile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ApartmentToAppFile_A_fkey" FOREIGN KEY ("A") REFERENCES "Apartment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ApartmentToAppFile_B_fkey" FOREIGN KEY ("B") REFERENCES "AppFile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AdToAppFile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AdToAppFile_A_fkey" FOREIGN KEY ("A") REFERENCES "Ad" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AdToAppFile_B_fkey" FOREIGN KEY ("B") REFERENCES "AppFile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Building_name_key" ON "Building"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ad_code_key" ON "Ad"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_ApartmentToAppFile_AB_unique" ON "_ApartmentToAppFile"("A", "B");

-- CreateIndex
CREATE INDEX "_ApartmentToAppFile_B_index" ON "_ApartmentToAppFile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AdToAppFile_AB_unique" ON "_AdToAppFile"("A", "B");

-- CreateIndex
CREATE INDEX "_AdToAppFile_B_index" ON "_AdToAppFile"("B");
