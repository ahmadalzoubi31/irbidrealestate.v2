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
        collections: true,
        details: true,
      },
    });

    if (!claim) {
      throw createError({
        statusCode: 400,
        message: "No claim found",
      });
    }

    return claim;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
