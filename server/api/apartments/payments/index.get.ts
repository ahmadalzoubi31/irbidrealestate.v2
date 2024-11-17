import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    return await prisma.payment.findMany();
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
