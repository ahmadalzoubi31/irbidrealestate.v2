import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: number = Number(getRouterParams(event).id);

  if (isNaN(id)) {
    throw createError({
      statusCode: 500,
      message: "Invalid id",
    });
  }

  try {
    const building = await prisma.building.findUnique({
      where: {
        id: id,
      },
    });

    if (!building) {
      throw createError({
        statusCode: 400,
        message: "No building found",
      });
    }

    return building;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
