import { Apartment } from "@prisma/client";
import prisma from "~/lib/prisma";
import handleError from "~/server/helpers/handleError";

export default defineEventHandler(async (event) => {
  try {
    const apartments: Apartment[] = await prisma.apartment.findMany();
    return apartments;
  } catch (error: any) {
    console.log("🚀 ~ defineEventHandler ~ error:", error);
    return handleError(error, event);
  }
});
