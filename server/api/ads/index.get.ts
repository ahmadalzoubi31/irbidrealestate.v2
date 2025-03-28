import prisma from "~/lib/prisma";
import { ad } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    // Simulate delay (e.g., fetching huge data)
    // await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulate delay

    // Fetch all ads
    const ads: ad[] = await prisma.ad.findMany({
      orderBy: {
        code: "asc",
      },
      include: {
        interestedPeople: true,
      },
    });

    return ads;
  } catch (error: any) {
    // Handle errors gracefully
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred",
    });
  }
});
