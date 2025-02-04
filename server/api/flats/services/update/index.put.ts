import { Service, Prisma } from "@prisma/client";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body: Service[] = await readBody(event);

  if (!body) {
    const msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  try {
    // Extract IDs from the incoming request
    const incomingIds: number[] = body.map((m: Service) => m.id);

    // Handle updates
    const updateOperations = body.map((s: Service) =>
      prisma.service.update({
        where: { id: s.id },
        data: {
          isPaid: s.isPaid,
          month: s.month,
          year: s.year,
          flatId: s.flatId,
        },
      })
    );

    // Execute updates
    await Promise.all(updateOperations);

    // Return success response
    return {
      success: true,
      message: "Service updated successfully",
    };
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    // Handle Prisma specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const msg = "ERROR: There is a unique constraint violation";
        console.log(msg);
        throw createError({
          statusCode: 400,
          message: msg,
        });
      }
    }

    // Handle other errors
    const msg = error.message || "An unexpected error occurred during the update.";
    console.log(msg);
    throw createError({
      statusCode: 500,
      message: msg,
    });
  }
});
