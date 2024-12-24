// ~/server/api/payments/[id]/delete.ts
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Extract ID from route parameters
  const id: string = getRouterParams(event).id;

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
