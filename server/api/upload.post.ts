import { join } from "path";

export default defineEventHandler(async (event) => {
  const body: any[] = await readBody(event);
  const queryList = getQuery<{ relatedType: string, relatedId: string }>(event);

  const fileList: Array<any> = [];
  const relatedType = queryList?.relatedType || '';
  const relatedId = queryList?.relatedId || '';

  const rootDir = process.cwd();
  const uploadDir = join(rootDir, "public", "upload", "files");
  const filePath = join(uploadDir, relatedType, relatedId, name);

  const baseUrl = getRequestURL(event).origin;
  const fileUrl = `${baseUrl}${filePath.replace(rootDir, "")}`;

  try {
    body.forEach(async file => {
      const fileToSve = {
        ...file.content,
        name: file.name,
        path: filePath,
        type: file.type || "unknown",
        size: file.size.toString() || "unknown",
      }
      await useStorage('customDriver').setItemRaw(file.name, fileToSve);
    })
    return 'successed';
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }

})

