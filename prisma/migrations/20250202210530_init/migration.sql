-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT DEFAULT '-',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Building" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "apartmentsCount" INTEGER NOT NULL DEFAULT 0,
    "storeCount" INTEGER NOT NULL DEFAULT 0,
    "basinName" TEXT NOT NULL,
    "basinNumber" TEXT NOT NULL,
    "landNumber" TEXT NOT NULL,
    "electricBill" TEXT DEFAULT '-',
    "serviceAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "maintenanceAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "registeredApartmentsCount" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT DEFAULT '-',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apartment" (
    "id" SERIAL NOT NULL,
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
    "rentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "rentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rentPaymentWay" TEXT,
    "isFurniture" TEXT NOT NULL DEFAULT 'لا',
    "rentStatus" INTEGER NOT NULL DEFAULT 3,
    "renterNationality" TEXT,
    "renterIdentification" TEXT,
    "isServiceIncluded" TEXT NOT NULL DEFAULT 'لا',
    "insurance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commissionAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT DEFAULT '-',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "buildingId" INTEGER,

    CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "nextRentDate" TIMESTAMP(3) NOT NULL,
    "receivedPaymentDate" TIMESTAMP(3) NOT NULL,
    "depositAmount" DOUBLE PRECISION NOT NULL,
    "depositDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT DEFAULT '-',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "apartmentId" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ad" (
    "id" SERIAL NOT NULL,
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
    "createdBy" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT DEFAULT '-',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterestedPeople" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL DEFAULT '###',
    "adId" INTEGER,

    CONSTRAINT "InterestedPeople_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "type" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerNumber" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "firstStep" TEXT,
    "notes" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT DEFAULT '-',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" SERIAL NOT NULL,
    "claimDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimFrom" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT DEFAULT '-',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "apartmentId" INTEGER NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimCollection" (
    "id" SERIAL NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "notes" TEXT,
    "claimId" INTEGER NOT NULL,

    CONSTRAINT "ClaimCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimDetail" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "claimId" INTEGER NOT NULL,

    CONSTRAINT "ClaimDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppFile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "fileCount" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "relatedId" TEXT NOT NULL,
    "relatedType" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT DEFAULT '-',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "apartmentId" INTEGER,
    "paymentId" INTEGER,
    "adId" INTEGER,
    "fileContentId" INTEGER NOT NULL,

    CONSTRAINT "AppFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileContent" (
    "id" SERIAL NOT NULL,
    "createdAt" DATE NOT NULL,
    "key" TEXT NOT NULL,
    "modifiedAt" DATE NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "FileContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flat" (
    "id" SERIAL NOT NULL,
    "counter" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT DEFAULT '-',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "buildingId" INTEGER NOT NULL,

    CONSTRAINT "Flat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT DEFAULT '-',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "flatId" INTEGER,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" SERIAL NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT DEFAULT '-',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "flatId" INTEGER,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Building_name_key" ON "Building"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ad_code_key" ON "Ad"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AppFile_key_key" ON "AppFile"("key");

-- CreateIndex
CREATE UNIQUE INDEX "AppFile_fileContentId_key" ON "AppFile"("fileContentId");

-- AddForeignKey
ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestedPeople" ADD CONSTRAINT "InterestedPeople_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimCollection" ADD CONSTRAINT "ClaimCollection_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimDetail" ADD CONSTRAINT "ClaimDetail_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppFile" ADD CONSTRAINT "AppFile_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppFile" ADD CONSTRAINT "AppFile_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppFile" ADD CONSTRAINT "AppFile_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppFile" ADD CONSTRAINT "AppFile_fileContentId_fkey" FOREIGN KEY ("fileContentId") REFERENCES "FileContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flat" ADD CONSTRAINT "Flat_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_flatId_fkey" FOREIGN KEY ("flatId") REFERENCES "Flat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_flatId_fkey" FOREIGN KEY ("flatId") REFERENCES "Flat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
