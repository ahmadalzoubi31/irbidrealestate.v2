/*
  Warnings:

  - You are about to drop the column `apartmentId` on the `AppFile` table. All the data in the column will be lost.
  - You are about to drop the column `fileContentId` on the `AppFile` table. All the data in the column will be lost.
  - Added the required column `images` to the `Apartment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AppFile" DROP CONSTRAINT "AppFile_apartmentId_fkey";

-- DropForeignKey
ALTER TABLE "AppFile" DROP CONSTRAINT "AppFile_fileContentId_fkey";

-- DropIndex
DROP INDEX "AppFile_fileContentId_key";

-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "images" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AppFile" DROP COLUMN "apartmentId",
DROP COLUMN "fileContentId";

-- AlterTable
ALTER TABLE "FileContent" ADD COLUMN     "appFileId" INTEGER;

-- AddForeignKey
ALTER TABLE "FileContent" ADD CONSTRAINT "FileContent_appFileId_fkey" FOREIGN KEY ("appFileId") REFERENCES "AppFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
