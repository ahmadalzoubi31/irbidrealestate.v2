import { Building } from "@prisma/client";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body: Building = await readBody(event);
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
    // @ts-ignore
    delete body.name;

    await prisma.building.update({
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
