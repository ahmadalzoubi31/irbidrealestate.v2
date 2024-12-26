export default defineEventHandler(async (event) => {
  const body: any[] = await readBody(event);
  const queryList = getQuery<{ relatedType: string, relatedId: string }>(event);

  const relatedType = queryList?.relatedType || '';
  const relatedId = queryList?.relatedId || '';

  try {
    for (const file of body) {
      const filePathDB = `${relatedType}/${relatedId}/${file.name}`;

      const fileToSve = {
        file: file.content,
        name: file.name,
        path: filePathDB,
        type: file.type || "unknown",
        size: file.size.toString() || "unknown",
      }
      await useStorage('customDriver').setItem(file.name, fileToSve);
    }

    return true;
  } catch (error: any) {
    return false;
  }

})

