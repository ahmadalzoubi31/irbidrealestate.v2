export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  return await useStorage('customDriver').getItem(body.name);
});