import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    return await prisma.building.findMany();
  } catch (error) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
