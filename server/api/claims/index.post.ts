import { Prisma, claim } from "@prisma/client";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body: any = await readBody(event);

  if (!body) {
    var msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  try {
    const { claimDetails, claimCollections, ...claimData } = body;

    // Create a new claim entry
    const newClaim: claim = await prisma.claim.create({
      data: {
        ...claimData,
        claimDetails: {
          create: claimDetails,
        },
        claimCollections: {
          create: claimCollections,
        },
      },
    });

    // Return success response
    return {
      success: true,
      message: "Claim created successfully",
      data: newClaim,
    };
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle unique constraint violation error (e.g., name already exists)
      if (error.code === "P2002") {
        console.log(
          "ERROR: There is a unique constraint violation, a new record cannot be created with this name"
        );
        throw createError({
          statusCode: 400,
          message:
            "ERROR: There is a unique constraint violation, a new record cannot be created with this name",
        });
      }
    }

    // Handle other errors
    console.log(
      error.message || "An unexpected error occurred while creating the claim."
    );
    throw createError({
      statusCode: 500,
      message:
        error.message ||
        "An unexpected error occurred while creating the claim.",
    });
  }
});
