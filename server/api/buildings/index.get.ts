import prisma from "~/lib/prisma";
import { Building } from "@prisma/client";

export default defineEventHandler(async (event) => {
  return new Promise<Building[]>(async (resolve, reject) => {
    try {
      // setTimeout(async () => {
      resolve(await prisma.building.findMany());

      // }, 15000);
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  });
});
