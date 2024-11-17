import prisma from "~/lib/prisma";
import { Building } from "@prisma/client";
export default defineEventHandler(async (event) => {
  try {
    return await prisma.building.findMany();
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
