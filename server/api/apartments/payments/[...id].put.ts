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

  // Read and validate the request body
  const body = await readBody(event);
  if (!body || Object.keys(body).length === 0) {
    throw createError({
      statusCode: 400,
      message: "Request body is missing or empty.",
    });
  }

  try {
    // Check if the payment exists
    const existingPayment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      throw createError({
        statusCode: 404,
        message: "Payment not found with the provided ID.",
      });
    }

    // Update the payment record
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: body,
    });

    // Return the updated payment
    return {
      success: true,
      message: "Payment updated successfully.",
      data: updatedPayment,
    };
  } catch (error: any) {
    console.error("Error updating payment:", error.message);

    // Handle and return errors appropriately
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred while updating the payment.",
    });
  }
});
