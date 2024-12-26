import type { Building } from "@prisma/client";
import { Prisma } from "@prisma/client";
import prisma from "~/lib/prisma";

// Utility function for validating request data
const validateBuildingData = (data: Building) => {
  // TODO: Add any additional field validation as needed
  if (!data.name || !data.basinName) {
    throw new Error("Missing required fields: name and basinName");
  }
};

export default defineEventHandler(async (event) => {
  const body: Building = await readBody(event);

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
    validateBuildingData(body);

    // Calucalte the number of related apartments
    const registeredApartmentsCount = await prisma.apartment.count({
      where: {
        buildingId: body.id,
      },
    })
    // Create a new building entry
    const newBuilding: Building = await prisma.building.create({
      data: { ...body, registeredApartmentsCount },
    });

    // Return success response
    return {
      success: true,
      message: "Building created successfully",
      data: newBuilding,
    };
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle unique constraint violation error (e.g., name already exists)
      if (error.code === "P2002") {
        const msg = "ERROR: There is a unique constraint violation, a new record cannot be created with this name";
        console.log(msg);
        throw createError({
          statusCode: 400,
          message: msg,
        });
      }
    }

    // Handle other errors
    const msg = error.message || "An unexpected error occurred while creating the building.";
    console.log(msg);
    throw createError({
      statusCode: 500,
      message: msg,
    });
  }
});
