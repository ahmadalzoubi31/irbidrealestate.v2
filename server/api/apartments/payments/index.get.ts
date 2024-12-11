import prisma from "~/lib/prisma";
import { Payment } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    // Simulate delay (e.g., fetching huge data)
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate delay

    // Fetch all payments along with related apartment and building details
    const payments: Payment[] = await prisma.payment.findMany({
      include: {
        apartment: {
          include: {
            building: true,
          },
        },
      },
    });
    return payments;
  } catch (error: any) {
    console.error("Error fetching payments:", error.message);
    // Return an error response with appropriate status code and message
    throw createError({
      statusCode: error.statusCode || 500, // Default to 500 for unknown errors
      message: error.message || "An unexpected error occurred while fetching payments.",
    });
  }
});
