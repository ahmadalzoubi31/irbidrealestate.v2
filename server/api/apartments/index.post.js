import { Prisma } from "@prisma/client";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body) {
    var msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  try {
    await prisma.apartment.create({ data: body });
  } catch (error) {
    console.log({ prisma_code: error.code });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === "P2002") {
        var msg = "ERROR: There is a unique constraint violation, a new record cannot be created with this name";
        console.log(msg);
        throw createError({
          statusCode: 400,
          message: msg,
        });
      }
    }

    // console.log(error.message);

    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
