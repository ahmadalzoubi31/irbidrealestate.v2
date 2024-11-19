import { Prisma, Ad } from "@prisma/client";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body: Ad = await readBody(event);
  if (!body) {
    var msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }
  try {
    // @ts-ignore
    await prisma.ad.create({ data: { ...body, interestedPeople: { create: body.interestedPeople } } });
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("🚀 ~ defineEventHandler ~ error:", error);
      // The .code property can be accessed in a type-safe manner
      if (error.code === "P2002") {
        var msg = "ERROR: There is a unique constraint violation, a new record cannot be created with this code";
        console.log(msg);
        throw createError({
          statusCode: 400,
          message: msg,
        });
      }
    }

    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
