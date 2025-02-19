// ~/server/api/buildingFlats/[id]/update.ts
import prisma from "~/lib/prisma";
import { BuildingFlat } from "@prisma/client";

// Utility function to validate the request body
const validateApartmentData = (data: BuildingFlat) => {
  // TODO: Add any additional field validation as needed
};

export default defineEventHandler(async (event) => {
  const body: BuildingFlat = await readBody(event);
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
    validateApartmentData(body); // Custom validation for required fields

    // Fetch the buildingFlat to ensure it exists
    const existApartment = await prisma.buildingFlat.findUnique({
      where: { id },
    });

    // If buildingFlat doesn't exist, throw an error
    if (!existApartment) {
      throw createError({
        statusCode: 404, // Not Found for non-existent buildingFlat
        message: "BuildingFlat not found with the provided ID.",
      });
    }

    const { buildingId, ...updateData } = body;

    // Proceed with updating the buildingFlat data
    const updatedApartment = await prisma.buildingFlat.update({
      where: { id },
      data: updateData, // Updated data without 'name' field
    });

    // Return a success response after updating the buildingFlat
    return {
      success: true,
      message: "BuildingFlat updated successfully",
      data: updatedApartment,
    };
  } catch (error: any) {
    console.error("Error updating buildingFlat:", error.message);

    // Handle and return errors appropriately
    throw createError({
      statusCode: error.statusCode || 500, // Default to 500 for unknown errors
      message: error.message || "An unexpected error occurred while updating the buildingFlat.",
    });
  }
});
