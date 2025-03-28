import { Prisma, order } from "@prisma/client";
import prisma from "~/lib/prisma";

// Utility function for validating request data
const validateOrderData = (data: order) => {
  // TODO: Add any additional field validation as needed
  if (!data.date) {
    throw new Error("Missing required fields: date");
  }
};

export default defineEventHandler(async (event) => {
  const body: order = await readBody(event);

  if (!body) {
    const msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  try {
    // Validate the incoming data
    validateOrderData(body);

    // Create a new order entry
    const newOrder: order = await prisma.order.create({
      data: body,
    });

    // Return success response
    return {
      success: true,
      message: "Order created successfully",
      data: newOrder,
    };
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle unique constraint violation error (e.g., name already exists)
      if (error.code === "P2002") {
        const msg =
          "ERROR: There is a unique constraint violation, a new record cannot be created with this name";
        console.log(msg);
        throw createError({
          statusCode: 400,
          message: msg,
        });
      }
    }

    // Handle other errors
    const msg =
      error.message || "An unexpected error occurred while creating the order.";
    console.log(msg);
    throw createError({
      statusCode: 500,
      message: msg,
    });
  }
});
