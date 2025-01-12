import prisma from "~/lib/prisma";
import { Claim } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    // Simulate delay (e.g., fetching huge data)
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate delay

    // Fetch all claims
    const claims: Claim[] = await prisma.claim.findMany({
      include: {
        Apartment: true,
        claimCollections: true,
        claimDetails: {
          include: {
            files: true,
          },
        },
      },
    });
    return claims;
  } catch (error: any) {
    // Handle errors gracefully
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred",
    });
  }
});
