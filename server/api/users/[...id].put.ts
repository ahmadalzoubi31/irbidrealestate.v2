import type { User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import prisma from "~/lib/prisma";

// Utility function to validate incoming data
const validateUserData = (data: User) => {
  // TODO: Add any additional field validation as needed
  if (!data.firstName) {
    throw new Error("Missing required field: firstName");
  }
};

export default defineEventHandler(async (event) => {
  const body: User = await readBody(event);
  const id: string = getRouterParams(event).id;

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
    validateUserData(body);

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      const msg = "ERROR: No user found with the given ID";
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    // Perform the update
    const updatedUser = await prisma.user.update({
      where: { id },
      data: body,
    });

    // Return success response
    return {
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    };
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    // Handle Prisma specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const msg = "ERROR: There is a unique constraint violation";
        console.log(msg);
        throw createError({
          statusCode: 400,
          message: msg,
        });
      }
    }

    // Handle other errors
    const msg = error.message || "An unexpected error occurred during the update.";
    console.log(msg);
    throw createError({
      statusCode: 500,
      message: msg,
    });
  }
});
