export default defineEventHandler(async (event) => {
  useStorage().setItem('', new Date().toISOString())
})
