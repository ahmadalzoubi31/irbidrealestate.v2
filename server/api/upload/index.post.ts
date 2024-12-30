import { join } from "path";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body: any[] = await readBody(event);
  const queryList = getQuery<{ relatedType: string, relatedId: string, purpose: string }>(event);

  const relatedType = queryList?.relatedType || '';
  const relatedId = queryList?.relatedId || '';
  const purpose = queryList?.purpose || '';

  try {
    const fileCount: string = (await prisma.appFile.count({ where: { relatedId, relatedType, purpose } })).toString();
    for (const file of body) {
      // this will use to update and delete the file like follow format: type:count:id Ex. ad:id:1, contract:id:1, furniture:1:id:1, furniture:1:id:2
      const key = join(relatedType, purpose, fileCount);

      // Upload the file content to the server
      await useStorage('customDriver').setItem(key, file.content);

      const filePathDB = `${relatedType}/${relatedId}/${file.name}`;

      // Fetch the file content id
      const fileContent = await prisma.fileContent.findFirstOrThrow({ where: { key: key } })
      const fileContentId = fileContent.id;


      const fileToSve = {
        name: file.name,
        type: file.type || "unknown",
        size: file.size.toString() || "unknown",
        path: filePathDB,
        relatedType,
        relatedId,
        key: key,
        purpose: purpose,
        adId: relatedType === "ads" ? relatedId : null,
        apartmentId: relatedType === "apartments" ? relatedId : null,
        paymentId: relatedType === "payments" ? relatedId : null,
        fileContentId: fileContentId
      }

      await prisma.appFile.create({ data: fileToSve, })

    }

    return true;
  } catch (error: any) {
    return false;
  }

})

