// ~/server/api/apartments/[id]/delete.ts
import prisma from "~/lib/prisma";
import { Apartment } from "@prisma/client";

export default defineEventHandler(async (event) => {
  // Extract ID from route parameters
  const id: number = Number(getRouterParams(event).id);

  // Validate ID
  if (isNaN(id)) {
    throw createError({
      statusCode: 400, // Changed to 400 for client-side error
      message: "Invalid ID provided",
    });
  }

  try {
    // Fetch apartment by ID to ensure it exists before deletion
    const apartment = await prisma.apartment.findUnique({
      where: {
        id: id,
      },
    });

    // If apartment doesn't exist, return an error
    if (!apartment) {
      throw createError({
        statusCode: 404, // 404 is more appropriate for "Not Found"
        message: "Apartment not found",
      });
    }

    // Proceed with deleting the apartment
    await prisma.apartment.delete({
      where: {
        id: id,
      },
    });

    // Return a success message after deletion
    return { message: "Apartment deleted successfully" };

  } catch (error: any) {
    // Log error and return it
    console.error("Error deleting apartment:", error.message);

    throw createError({
      statusCode: error.statusCode || 500,  // Default to 500 if statusCode is not available
      message: error.message || "An unexpected error occurred while deleting the apartment.",
    });
  }
});
