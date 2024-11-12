import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
    delete body.name;

    await prisma.apartment.update({
      data: body,
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log({ prisma_code: error.code });

    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
