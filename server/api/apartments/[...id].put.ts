// ~/server/api/apartments/[id]/update.ts
import prisma from "~/lib/prisma";
import { Apartment } from "@prisma/client";

// Utility function to validate the request body
const validateApartmentData = (data: any) => {
  if (!data.apartmentNumber || !data.ownerName) {
    throw new Error("Missing required fields: apartmentNumber and ownerName");
  }
  // Add any additional field validation as needed
};

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

  // Validate the provided apartment ID
  if (isNaN(id)) {
    throw createError({
      statusCode: 400, // Bad Request for invalid ID
      message: "Invalid ID provided",
    });
  }

  // Validate the incoming apartment data
  try {
    validateApartmentData(body); // Custom validation for required fields

    // Fetch the apartment to ensure it exists
    const apartment = await prisma.apartment.findUnique({
      where: {
        id: id,
      },
    });

    // If apartment doesn't exist, throw an error
    if (!apartment) {
      throw createError({
        statusCode: 404, // Not Found for non-existent apartment
        message: "Apartment not found",
      });
    }

    // Remove the 'name' field if it exists, as it is not updatable
    const { buildingName, ...updateData } = body;

    // Proceed with updating the apartment data
    const updatedApartment = await prisma.apartment.update({
      where: {
        id: id,
      },
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

    throw createError({
      statusCode: error.statusCode || 500, // Default to 500 for unknown errors
      message: error.message || "An unexpected error occurred while updating the apartment.",
    });
  }
});
