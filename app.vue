<script setup>
useHead({
  title: "Irbid Real Estate",
  meta: [{ name: "description", content: "My amazing site." }],
  bodyAttrs: {},
  htmlAttrs: {
    dir: "rtl",
    lang: "ar",
  },
});

const desc = useState("description", () => "احمد ");
const type = useState("type", () => "primary");
</script>

<template>
  <div class="h-full">
    <UNotifications />

    <NuxtLoadingIndicator color="#aecc36" />
    <NuxtLayout>
      <!-- <UContainer> -->
      <div class="grid grid-cols-8 gap-4">
        <!-- <SideBar class="col-span-1 border-l-[2px]" /> -->
        <NuxtPage class="col-span-8" />
      </div>
      <!-- </UContainer> -->
    </NuxtLayout>
  </div>
</template>
