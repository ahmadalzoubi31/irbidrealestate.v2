export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { keys } = body;

  if (!keys || keys.length === 0) throw createError("No files uploaded");

  for (const key of keys) {
    await useStorage("photos").removeItem(key);
  }

  return { keys };
});
