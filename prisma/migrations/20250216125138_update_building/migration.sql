/*
  Warnings:

  - Added the required column `maintenancePaidBy` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maintenanceTerm` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servicePaidBy` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceTerm` to the `Building` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Building" ADD COLUMN     "maintenancePaidBy" TEXT NOT NULL,
ADD COLUMN     "maintenanceTerm" TEXT NOT NULL,
ADD COLUMN     "servicePaidBy" TEXT NOT NULL,
ADD COLUMN     "serviceTerm" TEXT NOT NULL;
