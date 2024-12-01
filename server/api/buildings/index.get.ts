import prisma from "~/lib/prisma";
import { Building } from "@prisma/client";
export default defineEventHandler(async (event) => {
  // return new Promise<Building[]>((resolve, reject) => {
  try {
    setTimeout(async () => {
      return await prisma.building.findMany();
    }, 5000);
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
  // });
});
