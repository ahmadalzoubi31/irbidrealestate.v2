import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    return await prisma.apartment.findMany({
      include: {
        rents: true,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
