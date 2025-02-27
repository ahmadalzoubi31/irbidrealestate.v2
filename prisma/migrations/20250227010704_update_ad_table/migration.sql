-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "buildingAge" TEXT,
ADD COLUMN     "buildingName" TEXT,
ADD COLUMN     "externalArea" TEXT,
ADD COLUMN     "floor" TEXT,
ADD COLUMN     "floorsArea" TEXT,
ADD COLUMN     "floorsCount" TEXT,
ADD COLUMN     "internalArea" TEXT,
ADD COLUMN     "isRegistered" TEXT DEFAULT 'فارغ',
ADD COLUMN     "nearbyLandmarks" TEXT,
ADD COLUMN     "storesArea" TEXT,
ADD COLUMN     "storesCount" TEXT;
