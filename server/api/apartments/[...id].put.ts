// ~/server/api/apartments/[id]/update.ts
import prisma from "~/lib/prisma";
import { Apartment } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const body: Apartment = await readBody(event);
  const id: number = Number(getRouterParams(event).id);

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
    // Fetch the apartment to ensure it exists
    const existApartment = await prisma.apartment.findUnique({
      where: { id },
    });

    // If apartment doesn't exist, throw an error
    if (!existApartment) {
      throw createError({
        statusCode: 404, // Not Found for non-existent apartment
        message: "Apartment not found with the provided ID.",
      });
    }

    const { buildingId, ...updateData } = body;

    // Proceed with updating the apartment data
    const updatedApartment = await prisma.apartment.update({
      where: { id },
      data: updateData, // Updated data without 'name' field
    });

    // Return a success response after updating the apartment
    return {
      success: true,
      message: "Apartment updated successfully",
      data: updatedApartment,
    };
  } catch (error: any) {
    console.error("Error updating apartment:", error.message);

    // Handle and return errors appropriately
    throw createError({
      statusCode: error.statusCode || 500, // Default to 500 for unknown errors
      message: error.message || "An unexpected error occurred while updating the apartment.",
    });
  }
});
