import prisma from "~/lib/prisma";
import type { Building } from "@prisma/client";

export default defineEventHandler(async () => {
  try {
    // Simulate delay (e.g., fetching huge data)
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate delay

    // Fetch all buildings
    const buildings: Building[] = await prisma.building.findMany();
    return buildings;
  } catch (error: any) {
    // Handle errors gracefully
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred",
    });
  }
});