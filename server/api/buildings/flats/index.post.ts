import { BuildingFlat, Prisma } from "@prisma/client";
import prisma from "~/lib/prisma";

// Utility function for validating request data
const validateBuildingFlatData = (data: BuildingFlat) => {
  // TODO: Add more validation as needed (for example, checking rentAmount or rentDuration)
  if (!data.flatNumber || !data.ownerName) {
    throw new Error("Missing required fields: flatNumber, and ownerName");
  }
};

export default defineEventHandler(async (event) => {
  const body: BuildingFlat = await readBody(event);

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
    validateBuildingFlatData(body);

    // Create a new buildingFlat entry
    const newBuildingFlat: BuildingFlat = await prisma.buildingFlat.create({ data: body });

    // Return success response
    return {
      success: true,
      message: "BuildingFlat created successfully",
      data: newBuildingFlat,
    };

  } catch (error: any) {
    console.error("An error occurred while creating the buildingFlat:", error);
    console.log({ prisma_code: error.code });

    // Handle known Prisma client errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const msg = "ERROR: Unique constraint violation, a record with this name or buildingFlat number already exists.";
        console.error(msg);
        throw createError({
          statusCode: 400,
          message: msg,
        });
      }
    }

    // Handle other errors
    throw createError({
      statusCode: 500,
      message: error.message || "An unexpected error occurred while creating the buildingFlat."
    });
  }
});
