import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: string = getRouterParams(event).id;

  try {
    // Fetch the claim by ID
    const claim = await prisma.claim.findUnique({
      where: { id },
      include: {
        Apartment: true,
        claimCollections: true,
        claimDetails: {
          include: {
            files: true,
          },
        },
      },
    });

    if (!claim) {
      const msg = `ERROR: No claim found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    return claim;
  } catch (error: any) {
    console.log("Error fetching claim:", error);

    // Handle errors gracefully and log error details
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred while fetching the claim",
    });
  }
});
