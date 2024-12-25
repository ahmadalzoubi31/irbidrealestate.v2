export default defineEventHandler(async (event) => {
  await useStorage('vercelKV').setItem('my-file.txt', 'this ahmad')
})
