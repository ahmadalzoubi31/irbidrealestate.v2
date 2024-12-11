import { Prisma, Payment } from "@prisma/client";
import prisma from "~/lib/prisma";

// Utility function to validate the incoming payment data
const validatePaymentData = (data: any) => {
  if (!data.apartmentId || !data.nextRentDate || !data.depositAmount) {
    throw new Error("Missing required fields: apartmentId, nextRentDate, and depositAmount");
  }
  // Add more validation as needed, e.g., validating date formats
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Check if body data is provided
  if (!body) {
    const msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400, // Bad Request for missing data
      message: msg,
    });
  }

  // Validate the incoming payment data
  try {
    validatePaymentData(body);

    // Create a new payment entry
    const newPayment: Payment = await prisma.payment.create({ data: body });

    // Return success response
    return {
      success: true,
      message: "Payment created successfully",
      data: newPayment,
    };
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    // Handle known Prisma errors (e.g., unique constraint violations)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const msg = "ERROR: Unique constraint violation, cannot create a record with duplicate values";
        console.log(msg);
        throw createError({
          statusCode: 400, // Bad Request for constraint violation
          message: msg,
        });
      }
    }

    // Handle other errors
    const msg = error.message || "An unexpected error occurred while creating the payment.";
    console.log(msg);
    throw createError({
      statusCode: 500,
      message: msg,
    });
  }
});
