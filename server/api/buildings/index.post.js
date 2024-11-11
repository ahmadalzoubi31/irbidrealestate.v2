import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    await prisma.building.create({ data: body });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === "P2002") {
        var msg = "There is a unique constraint violation, a new user cannot be created with this email";
        console.log(msg);
        throw createError({
          statusCode: 500,
          message: msg,
        });
      }
    }

    // console.log(error);
    //   throw createError({
    //     statusCode: 500,
    //     message: error.message,
    //   });
  }
});
