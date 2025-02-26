// import { photoStorage } from "~/server/services/storage";

export default defineEventHandler(async (event) => {
  const key = getRouterParams(event).id;

  const photo = await useStorage("photos").getItem(key as string);

  if (!photo) throw createError("File not found");

  // Set appropriate headers
  event.res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache

  return {
    body: photo,
    contentType: "image/jpeg",
  };
});
