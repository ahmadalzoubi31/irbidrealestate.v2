import prisma from "~/lib/prisma";
import { Ad } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    // Simulate delay (e.g., fetching huge data)
    // await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulate delay

    // Fetch all ads
    const ads: Ad[] = await prisma.ad.findMany({
      include: {
        interestedPeople: true,
        files: {
          where: {
            status: true,
          }
        }
      },
    });
    return ads;
  } catch (error: any) {
    // Handle errors gracefully
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "An unexpected error occurred",
    });
  }
});