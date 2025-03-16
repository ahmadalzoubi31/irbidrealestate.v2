-- DropForeignKey
ALTER TABLE "ApartmentRenterInfo" DROP CONSTRAINT "ApartmentRenterInfo_apartmentId_fkey";

-- AddForeignKey
ALTER TABLE "ApartmentRenterInfo" ADD CONSTRAINT "ApartmentRenterInfo_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
