import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: number = Number(getRouterParams(event).id);

  try {
    // Check if the buildingFlat exists
    const buildingFlat = await prisma.buildingFlat.findUnique({
      where: { id },
    });

    if (!buildingFlat) {
      const msg = `ERROR: No buildingFlat found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    // Delete the buildingFlat
    await prisma.buildingFlat.delete({
      where: { id },
    });

    // Return success response
    return {
      success: true,
      message: `Building with ID ${id} successfully deleted.`,
    };
  } catch (error: any) {
    // Log error and return it
    console.error("Error deleting buildingFlat:", error.message);

    throw createError({
      statusCode: error.statusCode || 500, // Default to 500 if statusCode is not available
      message: error.message || "An unexpected error occurred while deleting the buildingFlat.",
    });
  }
});
