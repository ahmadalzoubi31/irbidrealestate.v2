import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: number = Number(getRouterParams(event).id);
  const queries: { year: number } = getQuery(event);

  try {
    // Fetch the building by ID
    const building = await prisma.building.findFirst({
      where: { AND: [{ id }, { status: true }] },
      include: {
        flats: {
          orderBy: {
            counter: "asc",
          },
          include: {
            services: {
              where: {
                year: Number(queries["year"]),
              },
              orderBy: {
                month: "asc",
              },
            },
            maintenances: {
              where: {
                year: Number(queries["year"]),
              },
              orderBy: {
                month: "asc",
              },
            },
          },
        },
      },
    });

    if (!building) {
      const msg = `ERROR: No building found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    return building;
  } catch (error: any) {
    console.log("Error fetching building:", error);

    // Handle errors gracefully and log error details
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred while fetching the building",
    });
  }
});
