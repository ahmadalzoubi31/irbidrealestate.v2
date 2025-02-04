import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: number = Number(getRouterParams(event).id);

  try {
    // Fetch the user by ID
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

    return user;
  } catch (error: any) {
    console.log("Error fetching user:", error);

    // Handle errors gracefully and log error details
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred while fetching the user",
    });
  }
});
