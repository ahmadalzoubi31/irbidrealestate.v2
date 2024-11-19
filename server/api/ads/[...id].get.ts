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
    const ad = await prisma.ad.findUnique({
      where: {
        id: id,
      },
    });

    if (!ad) {
      throw createError({
        statusCode: 400,
        message: "No ad found",
      });
    }

    return ad;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
