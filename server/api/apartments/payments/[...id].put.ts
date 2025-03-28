import prisma from "~/lib/prisma";
import { payment } from "@prisma/client";

// Utility function to validate the request body
const validatePaymentData = (data: payment) => {
  // TODO: Add any additional field validation as needed
  if (!data.depositAmount) {
    throw new Error("Missing required fields: depositAmount");
  }
};

export default defineEventHandler(async (event) => {
  const body: payment = await readBody(event);
  const id: string = getRouterParams(event).id;

  // Check if body data is provided
  if (!body) {
    const msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400, // Bad Request for missing data
      message: msg,
    });
  }

  try {
    validatePaymentData(body); // Custom validation for required fields

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

    // Return a success response after updating the payment
    return {
      success: true,
      message: "Payment updated successfully",
      data: body,
    };
  } catch (error: any) {
    console.error("Error updating payment:", error.message);

    // Handle and return errors appropriately
    throw createError({
      statusCode: error.statusCode || 500,
      message:
        error.message ||
        "An unexpected error occurred while updating the payment.",
    });
  }
});
