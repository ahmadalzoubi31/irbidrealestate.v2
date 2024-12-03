import prisma from "~/lib/prisma";
import { Building } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    // Simulate delay (e.g., fetching huge data)
    // await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulate delay

    // Fetch all buildings
    const buildings: Building[] = await prisma.building.findMany();
    return buildings;
  } catch (error: any) {
    // Handle errors gracefully
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "An unexpected error occurred",
    });
  }
});