// ~/server/api/apartments/[id].ts
import prisma from "~/lib/prisma";
import { Apartment } from "@prisma/client";

export default defineEventHandler(async (event) => {
  // Extract ID from route parameters
  const id: number = Number(getRouterParams(event).id);

  // Validate ID
  if (isNaN(id)) {
    throw createError({
      statusCode: 400, // Changed status code to 400 for client error
      message: "Invalid ID provided",
    });
  }

  try {
    // Fetch apartment by ID, including related building data
    const apartment = await prisma.apartment.findUnique({
      where: {
        id: id,
      },
      include: {
        building: true,  // Include the related building data
      },
    });

    // If apartment doesn't exist, return an error
    if (!apartment) {
      throw createError({
        statusCode: 404, // 404 is more appropriate for "Not Found"
        message: "Apartment not found",
      });
    }

    // Return the found apartment
    return apartment;
  } catch (error: any) {
    // Enhanced error handling with fallback error message
    console.error("Error fetching apartment:", error.message);

    throw createError({
      statusCode: error.statusCode || 500,  // Default to 500 if statusCode is not available
      message: error.message || "An unexpected error occurred while fetching the apartment.",
    });
  }
});
