// ~/server/api/apartments/[id].ts
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Extract ID from route parameters
  const id: number = Number(getRouterParams(event).id);

  try {
    // Fetch apartment by ID, including related building data
    const apartment = await prisma.apartment.findUnique({
      where: { id },
      include: {
        building: true,
        files: {
          where: {
            status: true,
          },
          include: {
            fileContent: true,
          },
        },
      },
    });

    // If apartment doesn't exist, return an error
    if (!apartment) {
      throw createError({
        statusCode: 404, // 404 is more appropriate for "Not Found"
        message: "Apartment not found with the provided ID.",
      });
    }

    // Return the found apartment
    return apartment;
  } catch (error: any) {
    console.error("Error fetching apartment by ID:", error.message);

    // Return an appropriate error response
    throw createError({
      statusCode: error.statusCode || 500, // Default to 500 if statusCode is not available
      message: error.message || "An unexpected error occurred while fetching the apartment.",
    });
  }
});
