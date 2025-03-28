// ~/server/api/apartments/[id]/update.ts
import prisma from "~/lib/prisma";
import { apartment, apartmentRenterInfo } from "@prisma/client";

// Declare interface
interface ApartmentWithRenterInfo extends apartment {
  renterInfo: apartmentRenterInfo[];
}

export default defineEventHandler(async (event) => {
  const body: ApartmentWithRenterInfo = await readBody(event);
  const id: string = getRouterParams(event).id;

  // Check if body data is provided
  if (!body) {
    const msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400, // Bad Request for missing data
      message: msg,
    });
  }

  try {
    // Separate ` renterInfo` from the main body
    const { renterInfo, ...apartmentData } = body;
    // Fetch the apartment to ensure it exists
    const existApartment = await prisma.apartment.findUnique({
      where: { id },
      include: { renterInfo: true },
    });

    // If apartment doesn't exist, throw an error
    if (!existApartment) {
      throw createError({
        statusCode: 404, // Not Found for non-existent apartment
        message: "Apartment not found with the provided ID.",
      });
    }

    await prisma.$transaction(async (tx) => {
      // Update the apartment data
      await tx.apartment.update({ where: { id }, data: apartmentData });

      // Fetch existing related records
      const existingRenterInfo = await tx.apartmentRenterInfo.findMany({
        where: { apartmentId: id },
      });

      // Extract IDs from the incoming request
      const incomingRenterInfoIds = renterInfo
        .filter((a: apartmentRenterInfo) => a.id) // Only include those with IDs
        .map((a: apartmentRenterInfo) => a.id);

      // Find IDs to delete (existing IDs not in the incoming list)
      const idsRenterInfoToDelete = existingRenterInfo
        .filter((a) => !incomingRenterInfoIds.includes(a.id))
        .map((a) => a.id);

      // Perform deletions
      const deleteRenterOperations = idsRenterInfoToDelete.map((id) =>
        tx.apartmentRenterInfo.delete({ where: { id: id } })
      );

      // Handle updates and creations
      const upsertRenterOperations = renterInfo.map((c: apartmentRenterInfo) =>
        c.id
          ? tx.apartmentRenterInfo.update({
              where: { id: c.id },
              data: {
                renterName: c.renterName,
                renterNumber: c.renterNumber,
                renterNationality: c.renterNationality,
                renterCountry: c.renterCountry,
                renterIdentification: c.renterIdentification,
                identificationImage: c.identificationImage,
                contractImage: c.contractImage,
              },
            })
          : tx.apartmentRenterInfo.create({
              data: {
                renterName: c.renterName,
                renterNumber: c.renterNumber,
                renterNationality: c.renterNationality,
                renterCountry: c.renterCountry,
                renterIdentification: c.renterIdentification,
                identificationImage: c.identificationImage,
                contractImage: c.contractImage,
                apartmentId: id,
              },
            })
      );

      // Execute deletions, updates, and creations
      await Promise.all([...deleteRenterOperations, ...upsertRenterOperations]);
    });
  } catch (error: any) {
    console.error("Error updating apartment:", error.message);

    // Handle and return errors appropriately
    throw createError({
      statusCode: error.statusCode || 500, // Default to 500 for unknown errors
      message:
        error.message ||
        "An unexpected error occurred while updating the apartment.",
    });
  }
});
