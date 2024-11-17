<script setup lang="ts">
useHead({
  title: "Irbid Real Estate",
  meta: [{ name: "description", content: "My amazing site." }],
  bodyAttrs: {},
  htmlAttrs: {
    dir: "rtl",
    lang: "ar",
  },
});
</script>

<template>
  <div class="h-full">
    <UNotifications />

    <NuxtLoadingIndicator color="#aecc36" />
    <NuxtLayout>
      <!-- <div class="grid grid-cols-8 gap-4"> -->
      <NuxtPage class="col-span-8" />
      <!-- </div> -->
    </NuxtLayout>
  </div>
</template>
