import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: string = getRouterParams(event).id;

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      const msg = `ERROR: No user found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    // Return success response
    return {
      success: true,
      message: `User with ID ${id} successfully deleted.`,
    };
  } catch (error: any) {
    // Log error and return it
    console.error("Error deleting user:", error.message);

    throw createError({
      statusCode: error.statusCode || 500, // Default to 500 if statusCode is not available
      message: error.message || "An unexpected error occurred while deleting the user.",
    });
  }
});
