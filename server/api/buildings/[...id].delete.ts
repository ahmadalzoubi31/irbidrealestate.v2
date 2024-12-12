import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: number = Number(getRouterParams(event).id);

  // Validate the ID
  if (isNaN(id)) {
    const msg = "ERROR: Invalid ID";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  try {
    // Check if the building exists
    const building = await prisma.building.findUnique({
      where: { id },
    });

    if (!building) {
      const msg = `ERROR: No building found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    // Delete the building
    await prisma.building.delete({
      where: { id },
    });

    // Return success response
    return {
      success: true,
      message: `Building with ID ${id} successfully deleted.`,
    };

  } catch (error: any) {
    // Log error and return it
    console.error("Error deleting building:", error.message);

    throw createError({
      statusCode: error.statusCode || 500,  // Default to 500 if statusCode is not available
      message: error.message || "An unexpected error occurred while deleting the ad.",
    });
  }
});
