import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParams(event).id);

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
  } catch (error) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
