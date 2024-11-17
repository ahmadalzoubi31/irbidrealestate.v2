import prisma from "~/lib/prisma";
import { Apartment } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const id: number = Number(getRouterParams(event).id);

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

    await prisma.apartment.delete({
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
