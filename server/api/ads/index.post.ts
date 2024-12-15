import { Prisma, Ad } from "@prisma/client";
import prisma from "~/lib/prisma";

interface ICreateAdFile {
  name: string;
  adId: number; // Update type if `adId` is a string or other type in your schema
}

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
  debugger;
  try {
    await prisma.$transaction(async (tx) => {
      const createOperation = await tx.ad.create({ data: { ...adData, interestedPeople: { create: adData.interestedPeople } } });

      const uniqueNameForFiles: Array<ICreateAdFile> = [];

      for (const file of files) {
        const name = await storeFileLocally(
          file, // the file object
          16, // you can add a name for the file or length of Unique ID that will be automatically generated!
          `/ads/${createOperation.id}/` // the folder the file will be stored in
        );

        uniqueNameForFiles.push({ name: name, adId: createOperation.id });

        // Parses a data URL and returns an object with the binary data and the file extension.
        // const { binaryString, ext } = parseDataUrl(file.content);
      }

      // const uploadOperations = await tx.adFile.createMany({ data: uniqueNameForFiles });
      await Promise.all([createOperation]);
    });

    // const { files } = await readBody<{ files: ServerFile[] }>(event);
    // const id: number = Number(getRouterParams(event).id);

    // try {

    // } catch (error: any) {
    //   throw createError({
    //     statusCode: error.statusCode,
    //     message: error.message,
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
