import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: string = getRouterParams(event).id;



  try {
    // Check if the claim exists
    const claim = await prisma.claim.findUnique({
      where: { id },
    });

    if (!claim) {
      const msg = `ERROR: No claim found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    // Delete the claim
    await prisma.claim.delete({
      where: { id },
    });

    // Return success response
    return {
      success: true,
      message: `Claim with ID ${id} successfully deleted.`,
    };

  } catch (error: any) {
    // Log error and return it
    console.error("Error deleting claim:", error.message);

    throw createError({
      statusCode: error.statusCode || 500,  // Default to 500 if statusCode is not available
      message: error.message || "An unexpected error occurred while deleting the claim.",
    });
  }
});
