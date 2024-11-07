import prisma from "~/lib/prisma";
import { Apartment } from "@prisma/client";
import handleError from "~/server/helpers/handleError";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParams(event).id);

  try {
    const apartment: Apartment | null = await prisma.apartment.findUnique({
      where: {
        id: id,
      },
    });

    if (!apartment) {
      return handleError("No apartment", event);
    }

    return apartment;
  } catch (error: any) {
    console.log("🚀 ~ defineEventHandler ~ error:", error);
    return handleError(error, event);
  }
});
