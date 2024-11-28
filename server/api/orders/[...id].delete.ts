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
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
    });

    if (!order) {
      throw createError({
        statusCode: 400,
        message: "No order found",
      });
    }

    await prisma.order.delete({
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
