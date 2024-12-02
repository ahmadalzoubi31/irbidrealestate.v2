import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

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
    await prisma.payment.create({ data: body });

    // Return a success response after creating the payment
    return { message: "Payment created successfully" };
  } catch (error: any) {
    console.error("Error creating payment:", error.message);

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

    // Handle any other errors (e.g., validation errors)
    throw createError({
      statusCode: error.statusCode || 500, // Default to 500 for unknown errors
      message: error.message || "An unexpected error occurred while creating the payment.",
    });
  }
});
