import { createDatabase } from "db0";
import postgresql from "db0/connectors/postgresql";
const database = createDatabase(
  postgresql({
    /* db0 connector options */
    url: process.env.DATABASE_URL as string,
  })
);

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/tailwindcss", "nuxt-file-storage", "@nuxt/image", "nuxt-swiper", "@sidebase/nuxt-auth"],
  colorMode: {
    preference: "light",
  },
  css: ["@/assets/main.css"],
  imports: {
    dirs: [
      "composables",
      "composables/building/**",
      "composables/apartment/**",
      "composables/payment/**",
      "composables/ad/**",
      "composables/claim/**",
      "composables/order/**",
      "composables/user/**",
    ],
  },
  fileStorage: {
    mount: process.env.MOUNT,
  },
  runtimeConfig: {
    authSecret: process.env.NEXTAUTH_SECRET,
  },
  auth: {
    baseURL: process.env.NEXTAUTH_URL,
    globalAppMiddleware: false,
    provider: {
      type: "authjs",
      addDefaultCallbackUrl: false,
    },
  },
  nitro: {
    storage: {
      customDriver: {
        driver: "mongodb",
        connectionString: process.env.MONGODB_PROD_URI,
        databaseName: "irbidrealestate_db",
        collectionName: "FileContent",
      },
    },
  },
  // storage: {
  //   // Use the "database" driver (built-in)
  //   customDriver: {
  //     driver: "db0",
  //     // Database connection string
  //     connectionString: process.env.DATABASE_URL,
  //     // Database table name
  //     tableName: "file_content",
  //   },
  // },
  // },
  // nitro: {
  //   storage: {
  //     photos: {
  //       driver: "fs", // Change to 's3', 'cloudflare', etc.
  //       base: "./uploads", // Driver-specific config
  //     },
  //   },
  // },
});
