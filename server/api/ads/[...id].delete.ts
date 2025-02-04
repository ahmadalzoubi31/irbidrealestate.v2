import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: number = Number(getRouterParams(event).id);

  try {
    // Check if the ad exists
    const ad = await prisma.ad.findUnique({
      where: { id },
    });

    if (!ad) {
      const msg = `ERROR: No ad found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    // Delete the ad
    await prisma.ad.delete({
      where: { id },
    });

    // Return success response
    return {
      success: true,
      message: `Ad with ID ${id} successfully deleted.`,
    };
  } catch (error: any) {
    // Log error and return it
    console.error("Error deleting ad:", error.message);

    throw createError({
      statusCode: error.statusCode || 500, // Default to 500 if statusCode is not available
      message: error.message || "An unexpected error occurred while deleting the ad.",
    });
  }
});
