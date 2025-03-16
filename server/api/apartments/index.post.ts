import { Apartment, Prisma } from "@prisma/client";
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
    const { renterInfo, ...apartmentData } = body;

    // Create a new apartment entry
    const newApartment: Apartment = await prisma.apartment.create({
      data: {
        ...apartmentData,
        renterInfo: {
          create: renterInfo,
        },
      },
    });

    // Return success response
    return {
      success: true,
      message: "Apartment created successfully",
      data: newApartment,
    };
  } catch (error: any) {
    console.error("An error occurred while creating the apartment:", error);
    console.log({ prisma_code: error.code });

    // Handle known Prisma client errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const msg = "ERROR: Unique constraint violation, a record with this name or apartment number already exists.";
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
      message: error.message || "An unexpected error occurred while creating the apartment.",
    });
  }
});
