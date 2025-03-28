import prisma from "~/lib/prisma";
import type { buildingFlat } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { buildingId } = getQuery(event) as { buildingId: string };

  try {
    // Simulate delay (e.g., fetching huge data)
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate delay

    // Fetch all flats
    const buildingFlats: buildingFlat[] = await prisma.buildingFlat.findMany({
      where: { status: true, buildingId: buildingId },
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
