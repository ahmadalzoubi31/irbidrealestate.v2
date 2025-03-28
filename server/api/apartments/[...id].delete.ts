// ~/server/api/apartments/[id]/delete.ts
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Extract ID from route parameters
  const id: string = getRouterParams(event).id;

  try {
    // Fetch apartment by ID to ensure it exists before deletion
    const apartment = await prisma.apartment.findUnique({
      where: { id },
    });

    // If apartment doesn't exist, return an error
    if (!apartment) {
      const msg = `ERROR: No apartment found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404, // 404 is more appropriate for "Not Found"
        message: msg,
      });
    }

    // Proceed with deleting the apartment
    await prisma.apartment.delete({
      where: { id },
    });

    // Return success response
    return {
      success: true,
      message: `Building with ID ${id} successfully deleted.`,
    };
  } catch (error: any) {
    // Log error and return it
    console.error("Error deleting apartment:", error.message);

    throw createError({
      statusCode: error.statusCode || 500, // Default to 500 if statusCode is not available
      message:
        error.message ||
        "An unexpected error occurred while deleting the apartment.",
    });
  }
});
