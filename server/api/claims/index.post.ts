import { Prisma, Claim } from "@prisma/client";
import prisma from "~/lib/prisma";

// Utility function for validating request data
const validateClaimData = (data: Claim) => {
  // TODO: Add any additional field validation as needed
  if (!data.claimDate) {
    throw new Error("Missing required fields: claimDate");
  }
};

export default defineEventHandler(async (event) => {
  const body: Claim = await readBody(event);

  if (!body) {
    var msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  try {
    // Validate the incoming data
    validateClaimData(body);

    // Remove billImage form body.details object.
    //@ts-ignore
    body.details.forEach((detail) => {
      delete detail.billImage;
    });

    // Relate the claim with the related records
    const data = {
      ...body,
      // @ts-ignore
      collections: { create: body.collections },
      // @ts-ignore
      details: { create: body.details },
    }
    // Create a new claim entry
    const newClaim: Claim = await prisma.claim.create({
      data: data,
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
        console.log("ERROR: There is a unique constraint violation, a new record cannot be created with this name");
        throw createError({
          statusCode: 400,
          message: "ERROR: There is a unique constraint violation, a new record cannot be created with this name",
        });
      }
    }

    // Handle other errors
    console.log(error.message || "An unexpected error occurred while creating the claim.");
    throw createError({
      statusCode: 500,
      message: error.message || "An unexpected error occurred while creating the claim."
    });
  }
});
