/*
  Warnings:

  - You are about to drop the `AppFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileContent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `images` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `images` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AppFile" DROP CONSTRAINT "AppFile_adId_fkey";

-- DropForeignKey
ALTER TABLE "AppFile" DROP CONSTRAINT "AppFile_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "FileContent" DROP CONSTRAINT "FileContent_appFileId_fkey";

-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "images" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "images" TEXT NOT NULL;

-- DropTable
DROP TABLE "AppFile";

-- DropTable
DROP TABLE "FileContent";
