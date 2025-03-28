import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: string = getRouterParams(event).id;

  try {
    // Fetch the interestedPeople by ID
    const interestedPeople = await prisma.interestedPeople.findUnique({
      where: { id },
      include: {
        ad: true,
      },
    });

    // const fileContent = await prisma.f

    if (!interestedPeople) {
      const msg = `ERROR: No interestedPeople found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    return interestedPeople;
  } catch (error: any) {
    console.log("Error fetching interestedPeople:", error);

    // Handle errors gracefully and log error details
    throw createError({
      statusCode: error.statusCode || 500,
      message:
        error.message ||
        "An unexpected error occurred while fetching the interestedPeople",
    });
  }
});
