import prisma from "~/lib/prisma";
import { Apartment } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    // Simulate delay (e.g., fetching huge data)
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate delay

    // Fetch all apartments
    const apartments: Apartment[] = await prisma.apartment.findMany({
      include: {
        building: true,  // Include related apartment data
      },
    });
    return apartments;
  } catch (error: any) {
    // Handle errors gracefully
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "An unexpected error occurred",
    });
  }
});
