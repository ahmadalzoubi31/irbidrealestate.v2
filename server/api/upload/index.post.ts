import { Prisma, Claim } from "@prisma/client";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body: any[] = await readBody(event);
  const queryList = getQuery<{ relatedType: string, relatedId: string }>(event);

  const relatedType = queryList?.relatedType || '';
  const relatedId = queryList?.relatedId || '';

  try {
    for (const file of body) {
      const filePathDB = `${relatedType}/${relatedId}/${file.name}`;

      const fileToSve = {
        name: file.name,
        type: file.type || "unknown",
        size: file.size.toString() || "unknown",
        path: filePathDB,
        relatedType,
        relatedId,
      }

      await prisma.appFile.create({
        data: fileToSve,
      })
      await useStorage('customDriver').setItem(file.name, file.content);
    }

    return true;
  } catch (error: any) {
    return false;
  }

})

