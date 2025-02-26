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
    <NuxtLayout>
      <NuxtPage class="col-span-8" />
    </NuxtLayout>
  </div>
</template>
