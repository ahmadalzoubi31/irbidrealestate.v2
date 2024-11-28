import { Prisma, Ad } from "@prisma/client";
import { useFetch } from "nuxt/app";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body: any = await readBody(event);

  if (!body) {
    var msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  const { files, ...adData } = body;
  console.log("🚀 ~ defineEventHandler ~ files:", { files, ...adData });

  try {
    const res = await prisma.ad.create({
      // @ts-ignore
      data: { ...adData, interestedPeople: { create: body.interestedPeople } },
    });

    // if (files.length != 0 && res) {
    //   await useFetch(`/api/ads/${res.id}/files`, {
    //     method: "POST",
    //     body: {
    //       files: files.value,
    //     },
    //   });
    // }
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
