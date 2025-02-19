-- AlterTable
ALTER TABLE "Building" ADD COLUMN     "waterBill" TEXT DEFAULT '-';

-- CreateTable
CREATE TABLE "BuildingFlat" (
    "id" SERIAL NOT NULL,
    "flatNumber" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerNumber" TEXT DEFAULT '###',
    "electricSub" TEXT,
    "electricCounter" TEXT,
    "waterSub" TEXT,
    "waterCounter" TEXT,
    "renterName" TEXT NOT NULL,
    "renterNumber" TEXT DEFAULT '###',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT DEFAULT '-',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "buildingId" INTEGER NOT NULL,

    CONSTRAINT "BuildingFlat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BuildingFlat" ADD CONSTRAINT "BuildingFlat_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;
