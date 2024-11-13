import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParams(event).id);

  if (isNaN(id)) {
    throw createError({
      statusCode: 500,
      message: "Invalid id",
    });
  }

  try {
    const apartment = await prisma.apartment.findUnique({
      where: {
        id: id,
      },
    });

    if (!apartment) {
      throw createError({
        statusCode: 400,
        message: "No apartment found",
      });
    }

    return apartment;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
