import prisma from "~/lib/prisma";
import { Building } from "@prisma/client";

export default defineEventHandler(async (event) => {
  return new Promise<Building[]>(async (resolve, reject) => {
    // let callResult: Building[] = []

    // try {
    setTimeout(async () => {
      console.log("fetching...");

      resolve(await prisma.building.findMany());
      // console.log("🚀 ~ setTimeout ~ callResult:", callResult)
      // return callResult;
    }, 15000);

    // } catch (error: any) {
    //   throw createError({
    //     statusCode: error.statusCode,
    //     message: error.message,
    //   });
    // }
  });
});
