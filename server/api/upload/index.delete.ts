import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  await prisma.$transaction(async (tx) => {
    const deleteOperations = body.files.map((idToDelete: string) => tx.appFile.delete({ where: { id: idToDelete } }));

    const appFileList = body.files.map(async (appFileId: string) => {
      console.log({ appFileId });
      const t = await tx.appFile.findFirst({ where: { id: appFileId } });
      return t;
    });

    console.log("🚀 ~ await prisma.$transaction ~ appFileList:", appFileList);

    // from appFileList, get the id of the fileContent and delete it
    const fileContentIds = await Promise.all(appFileList).then((files) => files.map((file) => file?.fileContentId));

    const deleteContentOperations = fileContentIds.map((idToDelete: string) => tx.fileContent.delete({ where: { id: idToDelete } }));

    // Execute deletions, updates, and creations
    await Promise.all([...deleteOperations, ...deleteContentOperations]);
  });
});
