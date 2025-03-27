<script setup lang="ts">
useHead({
  title: "مؤسسة اربد العقارية",
  meta: [{ name: "description", content: "مؤسسة اربد العقارية" }],
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
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
