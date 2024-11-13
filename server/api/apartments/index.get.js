import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    return await prisma.apartment.findMany();
  } catch (error) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
