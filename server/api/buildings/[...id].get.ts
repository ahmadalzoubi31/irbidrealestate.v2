import prisma from "~/lib/prisma";
import { Building } from "@prisma/client";
import handleError from "~/server/helpers/handleError";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParams(event).id);

  try {
    const building: Building | null = await prisma.building.findUnique({
      where: {
        id: id,
      },
    });

    if (!building) {
      return handleError("No building", event);
    }

    return building;
  } catch (error: any) {
    console.log("🚀 ~ defineEventHandler ~ error:", error);
    return handleError(error, event);
  }
});
