// ~/server/api/payments/[id]/delete.ts
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Parse and validate the payment ID from the route parameters
  const id = Number(getRouterParams(event).id);
  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: "Invalid ID provided. Please provide a valid numeric ID.",
    });
  }

  try {
    // Check if the payment exists
    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      const msg = `ERROR: No payment found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg
      });
    }

    // Delete the payment record
    await prisma.payment.delete({
      where: { id },
    });

    // Return success response
    return {
      success: true,
      message: `Building with ID ${id} successfully deleted.`,
    };
  } catch (error: any) {
    console.error("Error deleting payment:", error.message);

    // Handle and return errors appropriately
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred while deleting the payment.",
    });
  }
});
