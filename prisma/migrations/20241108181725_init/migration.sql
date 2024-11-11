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
    "createdBy" TEXT DEFAULT '-',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT DEFAULT '-',
    "updatedAt" DATETIME NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Rent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "RenterName" TEXT NOT NULL,
    "RenterNumber" TEXT NOT NULL DEFAULT '###',
    "RentDuration" TEXT NOT NULL,
    "RentAmount" REAL NOT NULL DEFAULT 0.0,
    "RentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "RentPaymentWays" TEXT,
    "isFurniture" BOOLEAN NOT NULL DEFAULT false,
    "RentStatus" INTEGER NOT NULL DEFAULT 3,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "ApartmentId" INTEGER NOT NULL,
    CONSTRAINT "Rent_ApartmentId_fkey" FOREIGN KEY ("ApartmentId") REFERENCES "Apartment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Apartment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ApartmentNumber" TEXT NOT NULL,
    "AreaNumber" TEXT NOT NULL,
    "LandingNumber" TEXT NOT NULL,
    "OwnerName" TEXT NOT NULL,
    "OwnerNumber" TEXT,
    "AgentName" TEXT,
    "AgentNumber" TEXT,
    "RealLocation" TEXT,
    "ElectricSub" TEXT,
    "WaterSub" TEXT,
    "CommissionAmount" INTEGER NOT NULL DEFAULT 0,
    "MaintenanceDiscount" INTEGER NOT NULL DEFAULT 0,
    "Services" INTEGER NOT NULL DEFAULT 0,
    "ContractFileName" TEXT NOT NULL,
    "ClearanceFileName" TEXT,
    "CreatedBy" TEXT,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedBy" TEXT,
    "UpdatedAt" DATETIME NOT NULL,
    "Status" BOOLEAN NOT NULL DEFAULT true,
    "BuildingId" INTEGER NOT NULL,
    CONSTRAINT "Apartment_BuildingId_fkey" FOREIGN KEY ("BuildingId") REFERENCES "Building" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Code" TEXT NOT NULL,
    "Number" TEXT NOT NULL,
    "PropertyStatus" INTEGER NOT NULL,
    "PropertyType" INTEGER NOT NULL,
    "PropertyOwnerName" TEXT NOT NULL,
    "PropertyOwnerNumber" TEXT NOT NULL DEFAULT '###',
    "PropertyOwnerIdentity" TEXT NOT NULL,
    "PropertyAgentName" TEXT,
    "PropertyAgentNumber" TEXT NOT NULL DEFAULT '###',
    "PropertyAgentIdentity" TEXT NOT NULL DEFAULT '.',
    "FacebookLink" TEXT,
    "InstagramLink" TEXT,
    "PropertyLink" TEXT,
    "Governorate" TEXT NOT NULL,
    "Directorate" TEXT NOT NULL,
    "Village" TEXT NOT NULL,
    "Basin" TEXT NOT NULL,
    "Plot" TEXT NOT NULL,
    "ApartmentNumber" TEXT NOT NULL,
    "Classification" TEXT,
    "Neighborhood" TEXT,
    "ExpectedRentAmount" TEXT,
    "Notes" TEXT
);

-- CreateTable
CREATE TABLE "InterestedPeople" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Number" TEXT NOT NULL DEFAULT '###',
    "adId" INTEGER,
    CONSTRAINT "InterestedPeople_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Building_name_key" ON "Building"("name");
