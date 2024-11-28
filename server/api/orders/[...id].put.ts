import { Order } from "@prisma/client";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body: Order = await readBody(event);
  const id: number = Number(getRouterParams(event).id);

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

    await prisma.order.update({
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
