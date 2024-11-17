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
    const payment = await prisma.payment.findUnique({
      where: {
        id: id,
      },
    });

    if (!payment) {
      throw createError({
        statusCode: 400,
        message: "No payment found",
      });
    }

    return payment;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
