export default defineEventHandler(async (event) => {
  event.context.$error = (status: any, message: any) => {
    throw createError({ statusCode: status, message });
  };
});
