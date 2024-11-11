import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const res = await prisma.building.create({ data: body });
    return res;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
});
