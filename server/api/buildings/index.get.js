import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const buildings = await prisma.building.findMany();
    return buildings;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
});
