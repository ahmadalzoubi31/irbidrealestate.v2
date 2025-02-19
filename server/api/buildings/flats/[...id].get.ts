import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: number = Number(getRouterParams(event).id);

  try {
    // Fetch the buildingFlat by ID
    const buildingFlat = await prisma.buildingFlat.findFirst({
      where: { AND: [{ id }, { status: true }] },
    });

    if (!buildingFlat) {
      const msg = `ERROR: No buildingFlat found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    return buildingFlat;
  } catch (error: any) {
    console.log("Error fetching buildingFlat:", error);

    // Handle errors gracefully and log error details
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred while fetching the buildingFlat",
    });
  }
});
