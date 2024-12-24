// ~/server/api/apartments/[id]/update.ts
import prisma from "~/lib/prisma";
import { Apartment } from "@prisma/client";

// Utility function to validate the request body
const validateApartmentData = (data: Apartment) => {
  // TODO: Add any additional field validation as needed
  if (!data.ownerName) {
    throw new Error("Missing required fields: ownerName");
  }
};

export default defineEventHandler(async (event) => {
  const body: Apartment = await readBody(event);
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
    validateApartmentData(body); // Custom validation for required fields

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

    // TODO: Double check with out this.
    // Remove the 'name' field if it exists, as it is not updatable
    const { buildingName, ...updateData } = body;

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
