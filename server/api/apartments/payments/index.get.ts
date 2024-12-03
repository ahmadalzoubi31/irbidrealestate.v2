import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Fetch all payments along with related apartment and building details
    const payments = await prisma.payment.findMany({
      include: {
        apartment: {
          include: {
            building: true,
          },
        },
      },
    });

    // Return the fetched payments
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
