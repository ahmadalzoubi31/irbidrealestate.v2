import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = Number(getRouterParams(event).id);

  if (!body) {
    var msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

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
    delete body.name;

    await prisma.payment.update({
      data: body,
      where: {
        id: id,
      },
    });
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
