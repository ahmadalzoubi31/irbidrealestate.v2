import { Building } from "@prisma/client";
import prisma from "~/lib/prisma";
import handleError from "~/server/helpers/handleError";

export default defineEventHandler(async (event) => {
  try {
    const buildings: Building[] = await prisma.building.findMany();
    return buildings;
  } catch (error: any) {
    console.log("🚀 ~ defineEventHandler ~ error:", error);
    return handleError(error, event);
  }
});
