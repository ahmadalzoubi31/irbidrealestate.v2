export default defineEventHandler(async (event) => {
  await useStorage('customDriver').remove("foo:bar");
})
