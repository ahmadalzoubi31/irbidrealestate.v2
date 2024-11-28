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
    const claim = await prisma.claim.findUnique({
      where: {
        id: id,
      },
      include: {
        details: true,
        collections: true,
      },
    });

    if (!claim) {
      throw createError({
        statusCode: 400,
        message: "No claim found",
      });
    }

    await prisma.claim.delete({
      where: {
        id: id,
      },
    });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
