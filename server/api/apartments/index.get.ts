// ~/server/api/apartments/index.ts
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Fetch apartments along with their related building data
    const apartments = await prisma.apartment.findMany({
      include: {
        building: true,  // Include related building data
      },
    });

    // Return the retrieved apartments
    return apartments;
  } catch (error: any) {
    // Handle errors by creating a structured error response
    console.error("Error fetching apartments:", error.message);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred while fetching apartments.",
    });
  }
});
