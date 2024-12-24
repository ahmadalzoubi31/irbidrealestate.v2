// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "nuxt-file-storage",
    "@nuxt/image",
    "nuxt-swiper",
    "@sidebase/nuxt-auth"
  ],
  colorMode: {
    preference: "light",
  },
  css: ["@/assets/main.css"],
  imports: {
    dirs: [
      'composables',
      'composables/building/**',
      'composables/apartment/**',
      'composables/payment/**',
      'composables/ad/**',
      'composables/claim/**',
      'composables/order/**',
      'composables/user/**',
    ]
  },
  fileStorage: {
    // enter the absolute path to the location of your storage
    // mount: '/home/$USR/development/nuxt-file-storage/server/files',

    // {OR} use environment variables (recommended)
    mount: process.env.MOUNT,
    // you need to set the mount in your .env file at the root of your project
  },
  // ssr: false,
  image: {
    // Options
  },
  runtimeConfig: {
    authSecret: process.env.NEXTAUTH_SECRET
  },
  auth: {
    baseURL: process.env.NEXTAUTH_URL,
    globalAppMiddleware: false,
    provider: {
      type: 'authjs',
      addDefaultCallbackUrl: false
    },
  },
});