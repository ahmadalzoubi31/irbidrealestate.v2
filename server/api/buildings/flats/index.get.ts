import prisma from "~/lib/prisma";
import type { BuildingFlat } from "@prisma/client";

export default defineEventHandler(async () => {
  try {
    // Simulate delay (e.g., fetching huge data)
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate delay

    // Fetch all flats
    const buildingFlats: BuildingFlat[] = await prisma.buildingFlat.findMany({
      where: { status: true },
      orderBy: { id: "asc" },
    });

    return buildingFlats;
  } catch (error: any) {
    // Handle errors gracefully
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred",
    });
  }
});
