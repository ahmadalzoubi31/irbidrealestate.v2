import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: string = getRouterParams(event).id;

  try {
    // Check if the interestedPeople exists
    const interestedPeople = await prisma.interestedPeople.findUnique({
      where: { id },
    });

    if (!interestedPeople) {
      const msg = `ERROR: No interestedPeople found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    // Delete the interestedPeople
    await prisma.interestedPeople.delete({
      where: { id },
    });

    // Return success response
    return {
      success: true,
      message: `Ad with ID ${id} successfully deleted.`,
    };
  } catch (error: any) {
    // Log error and return it
    console.error("Error deleting interestedPeople:", error.message);

    throw createError({
      statusCode: error.statusCode || 500, // Default to 500 if statusCode is not available
      message:
        error.message ||
        "An unexpected error occurred while deleting the interestedPeople.",
    });
  }
});
