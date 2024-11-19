import prisma from "~/lib/prisma";
import { Ad } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    return await prisma.ad.findMany({
      include: {
        interestedPeople: true,
      },
    });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
