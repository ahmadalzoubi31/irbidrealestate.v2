// endpoints/building/[id].put.ts
import type { building } from "@prisma/client";
import { Prisma } from "@prisma/client";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const buildingId = getRouterParams(event).id;
  const body = await readBody(event);

  if (!buildingId || !body) {
    throw createError({
      statusCode: 400,
      message: "Invalid request parameters",
    });
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // 1. Get current building and flats
        const currentBuilding = await tx.building.findUnique({
          where: { id: buildingId },
          include: { flats: true },
        });

        if (!currentBuilding) {
          throw createError({
            statusCode: 404,
            message: "Building not found",
          });
        }

        const currentCount = currentBuilding.flats.length;
        const newCount = body.apartmentsCount;
        const countDifference = newCount - currentCount;

        // 2. Handle count changes
        if (countDifference > 0) {
          // Add new flats
          await tx.flat.createMany({
            data: Array.from({ length: countDifference }, (_, i) => ({
              counter: currentCount + i + 1,
              buildingId: buildingId,
            })),
          });
        } else if (countDifference < 0) {
          // Remove excess flats (delete last X flats)
          const flatsToDelete = await tx.flat.findMany({
            where: { buildingId: buildingId },
            orderBy: { counter: "desc" },
            take: Math.abs(countDifference),
            select: { id: true },
          });

          const flatIds = flatsToDelete.map((f) => f.id);

          // Delete related records first
          await tx.maintenance.deleteMany({
            where: { flatId: { in: flatIds } },
          });

          await tx.service.deleteMany({
            where: { flatId: { in: flatIds } },
          });

          // Delete the flats
          await tx.flat.deleteMany({
            where: { id: { in: flatIds } },
          });
        }

        // 3. Update building record
        const registeredApartmentsCount = await prisma.buildingFlat.count({
          where: { buildingId: body.id },
        });
        const updatedBuilding = await tx.building.update({
          where: { id: buildingId },
          data: {
            ...body,
            apartmentsCount: newCount,
            registeredApartmentsCount,
          },
          include: { flats: true },
        });

        // 4. Create records for new flats (if added)
        if (countDifference > 0) {
          const newFlats = await tx.flat.findMany({
            where: { buildingId: buildingId },
            orderBy: { counter: "desc" },
            take: countDifference,
            select: { id: true },
          });

          const currentYear = new Date().getFullYear();
          const months = Array.from({ length: 12 }, (_, i) => i + 1);

          const maintenanceRecords = newFlats.flatMap((flat) =>
            months.map((month) => ({
              flatId: flat.id,
              month,
              year: currentYear,
              isPaid: false,
            }))
          );

          const serviceRecords = newFlats.flatMap((flat) =>
            months.map((month) => ({
              flatId: flat.id,
              month,
              year: currentYear,
              isPaid: false,
            }))
          );

          await tx.maintenance.createMany({ data: maintenanceRecords });
          await tx.service.createMany({ data: serviceRecords });
        }

        return updatedBuilding;
      },
      { timeout: 60000 }
    );

    return {
      success: true,
      data: result,
      message: "Building updated successfully",
    };
  } catch (error: any) {
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const message =
        {
          P2025: "Record to update not found",
          P2002: "Unique constraint violation",
        }[error.code] || "Database error";

      throw createError({ statusCode: 400, message });
    }

    throw createError({
      statusCode: 500,
      message: error.message || "Internal server error",
    });
  }
});
