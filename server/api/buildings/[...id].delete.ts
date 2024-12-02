import prisma from "~/lib/prisma";
import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const id: number = Number(getRouterParams(event).id);

  // Validate the ID
  if (isNaN(id)) {
    const msg = "ERROR: Invalid ID";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  try {
    // Check if the building exists
    const building = await prisma.building.findUnique({
      where: { id },
    });

    if (!building) {
      const msg = `ERROR: No building found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    // Delete the building
    await prisma.building.delete({
      where: { id },
    });

    // Return success response
    return {
      success: true,
      message: `Building with ID ${id} successfully deleted.`,
    };

  } catch (error: any) {
    // Log the error
    console.log({ prisma_code: error.code });

    // Handle Prisma specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const msg = `ERROR: Prisma error occurred (code: ${error.code})`;
      console.log(msg);
      throw createError({
        statusCode: 500,
        message: msg,
      });
    }

    // Handle other errors
    const msg = error.message || "An unexpected error occurred while deleting the building.";
    console.log(msg);
    throw createError({
      statusCode: 500,
      message: msg,
    });
  }
});
