// ~/server/api/payments/[id].ts
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Extract ID from route parameters
  const id: string = getRouterParams(event).id;

  try {
    // Fetch the payment record along with related apartment and building details
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        apartment: {
          include: {
            building: true,
          },
        },
      },
    });

    // Handle case where the payment record is not found
    if (!payment) {
      throw createError({
        statusCode: 404,
        message: "Payment not found with the provided ID.",
      });
    }

    // Return the payment details
    return payment;
  } catch (error: any) {
    console.error("Error fetching payment by ID:", error.message);

    // Return an appropriate error response
    throw createError({
      statusCode: error.statusCode || 500, // Default to 500 for unknown errors
      message:
        error.message ||
        "An unexpected error occurred while fetching the payment.",
    });
  }
});
