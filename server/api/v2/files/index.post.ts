// import { photoStorage } from "~/server/services/storage";
import { nanoid } from "nanoid";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // const tag = body?.find((item: { name: string }) => item.name === "tag")?.data.toString();
  // const files = body?.filter((item: { name: string }) => item.name === "photo");
  const { files, tag } = body;

  if (!files || files.length === 0) return;

  const keys = [];
  for (const file of files) {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type as string)) {
      return;
    }
    const mimeType = file?.type.split("/")[1];
    const key = tag + ":" + nanoid() + "." + mimeType;
    keys.push(key);

    await useStorage("photos").setItem(key, file.content);
  }

  return { keys };
});
