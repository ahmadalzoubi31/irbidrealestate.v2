-- AlterTable
ALTER TABLE "Building" ALTER COLUMN "maintenancePaidBy" SET DEFAULT 'المالك',
ALTER COLUMN "maintenanceTerm" SET DEFAULT 'شهري',
ALTER COLUMN "servicePaidBy" SET DEFAULT 'المالك',
ALTER COLUMN "serviceTerm" SET DEFAULT 'شهري';
