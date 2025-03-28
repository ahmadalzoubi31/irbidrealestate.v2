import type { building } from "@prisma/client";
import { Prisma } from "@prisma/client";
import prisma from "~/lib/prisma";

const validateBuildingData = (data: building) => {
  if (!data.name || !data.basinName) {
    throw new Error("Missing required fields: name and basinName");
  }
};

export default defineEventHandler(async (event) => {
  const body: building = await readBody(event);

  if (!body) {
    throw createError({
      statusCode: 400,
      message: "ERROR: Request body is missing",
    });
  }

  try {
    validateBuildingData(body);

    await prisma.$transaction(
      async (tx) => {
        // Create the building and capture its ID
        const createdBuilding = await tx.building.create({
          data: {
            ...body,
            registeredApartmentsCount: 0,
            flats: {
              createMany: {
                data: Array.from({ length: body.apartmentsCount }, (_, i) => ({
                  counter: i + 1,
                })),
              },
            },
          },
        });

        // Fetch flats using the correct building ID
        const flatIds = await tx.flat.findMany({
          where: { buildingId: createdBuilding.id },
          select: { id: true },
        });

        // Prepare bulk data
        const currentYear = new Date().getFullYear();
        const months = Array.from({ length: 12 }, (_, i) => i + 1);

        // Generate all maintenance and service records
        const allMaintenanceRecords = flatIds.flatMap((flat) =>
          months.map((month) => ({
            flatId: flat.id,
            isPaid: false,
            month,
            year: currentYear,
          }))
        );

        const allServiceRecords = flatIds.flatMap((flat) =>
          months.map((month) => ({
            flatId: flat.id,
            isPaid: false,
            month,
            year: currentYear,
          }))
        );

        // Bulk insert
        await tx.maintenance.createMany({ data: allMaintenanceRecords });
        await tx.service.createMany({ data: allServiceRecords });
      },
      { timeout: 60000 }
    );

    return { success: true, message: "Building created successfully" };
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
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

    const msg =
      error.message ||
      "An unexpected error occurred while creating the building.";
    console.log(msg);
    throw createError({
      statusCode: 500,
      message: msg,
    });
  }
});
