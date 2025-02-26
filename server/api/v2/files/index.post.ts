// import { photoStorage } from "~/server/services/storage";
import { nanoid } from "nanoid";

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event);
  const file = body?.find((item) => item.name === "photo");

  if (!file) throw createError("No file uploaded");

  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type as string)) {
    throw createError("Invalid file type");
  }

  const key = nanoid();
  const mimeType = file?.type || "application/octet-stream";

  await useStorage("photos").setItem(key, file.data, {
    metadata: { contentType: mimeType },
  });

  return { key };
});
