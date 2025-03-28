import { interestedPeople, Prisma } from "@prisma/client";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body: any = await readBody(event);

  if (!body) {
    const msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  try {
    // Create a new ad entry
    const newInterestedPeople: interestedPeople =
      await prisma.interestedPeople.create({
        data: body,
      });

    // Return success response
    return {
      success: true,
      message: "Interested People created successfully",
      data: newInterestedPeople,
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
      error.message || "An unexpected error occurred while creating the ad.";
    console.log(msg);
    throw createError({
      statusCode: 500,
      message: msg,
    });
  }
});
