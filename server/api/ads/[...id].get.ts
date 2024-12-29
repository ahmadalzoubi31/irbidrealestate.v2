import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: string = getRouterParams(event).id;

  try {
    // Fetch the ad by ID
    const ad = await prisma.ad.findUnique({
      where: { id },
      include: {
        interestedPeople: true,
        files: {
          where: {
            status: true,
          },
          include: {
            content: true,
          }
        }
      },
    });

    // const fileContent = await prisma.f

    if (!ad) {
      const msg = `ERROR: No ad found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    return ad;
  } catch (error: any) {
    console.log("Error fetching ad:", error);

    // Handle errors gracefully and log error details
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred while fetching the ad",
    });
  }
});
