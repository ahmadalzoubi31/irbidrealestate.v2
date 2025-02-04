/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Flat` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Flat` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Flat` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Flat` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Flat` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Service` table. All the data in the column will be lost.
  - Changed the type of `relatedId` on the `AppFile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AppFile" DROP COLUMN "relatedId",
ADD COLUMN     "relatedId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Flat" DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "Maintenance" DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedBy";
