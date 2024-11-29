import { ServerFile } from "nuxt-file-storage";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const { files } = await readBody<{ files: ServerFile[] }>(event);
  const id: number = Number(getRouterParams(event).id);

  const uniqueNameForFiles: Array<ICreateAdFile> = [];

  for (const file of files) {
    const name = await storeFileLocally(
      file, // the file object
      16, // you can add a name for the file or length of Unique ID that will be automatically generated!
      "/ads" // the folder the file will be stored in
    );

    uniqueNameForFiles.push({ name: name, adId: id });

    // Parses a data URL and returns an object with the binary data and the file extension.
    // const { binaryString, ext } = parseDataUrl(file.content);
  }

  try {
    await prisma.adFile.createMany({ data: uniqueNameForFiles });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }

  return "success";
});
