import prisma from "~/lib/prisma";
import { InterestedPeople } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    // Simulate delay (e.g., fetching huge data)
    // await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulate delay

    // Fetch all interestedPeoples
    const interestedPeoples: InterestedPeople[] = await prisma.interestedPeople.findMany({
      include: {
        ad: true,
      },
    });

    return interestedPeoples;
  } catch (error: any) {
    // Handle errors gracefully
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred",
    });
  }
});
