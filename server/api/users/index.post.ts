import type { user } from "@prisma/client";
import { Prisma } from "@prisma/client";
import prisma from "~/lib/prisma";
import bcrypt from "bcrypt";

// Utility function for validating request data
const validateUserData = (data: user) => {
  // TODO: Add any additional field validation as needed
  if (!data.firstName || !data.lastName) {
    throw new Error("Missing required fields: firstName and lastName");
  }
};

export default defineEventHandler(async (event) => {
  const body: user = await readBody(event);

  if (!body) {
    const msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  const hashedPassword = await bcrypt.hash(
    body.password,
    bcrypt.genSaltSync(10)
  );

  try {
    // Validate the incoming data
    validateUserData(body);

    // Create new user entry
    const payload = {
      firstName: body.firstName,
      lastName: body.lastName,
      fullName: `${body.firstName} ${body.lastName}`,
      username: body.username,
      role: body.role,
      password: hashedPassword,
    };

    // Create a new user entry
    const newUser: user = await prisma.user.create({
      data: payload,
    });

    // Return success response
    return {
      success: true,
      message: "user created successfully",
      data: newUser,
    };
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle unique constraint violation error (e.g., name already exists)
      if (error.code === "P2002") {
        const msg =
          "ERROR: There is a unique constraint violation, a new record cannot be created with this username";
        console.log(msg);
        throw createError({
          statusCode: 400,
          message: msg,
        });
      }
    }

    // Handle other errors
    const msg =
      error.message || "An unexpected error occurred while creating the user.";
    console.log(msg);
    throw createError({
      statusCode: 500,
      message: msg,
    });
  }
});
