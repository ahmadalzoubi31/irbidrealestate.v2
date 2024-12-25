import { del } from '@vercel/blob';
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const urlToDelete = body.url as string;
  await del(urlToDelete);

})
