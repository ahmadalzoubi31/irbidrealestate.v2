<script setup lang="ts">
const route = useRoute();

const links = [
  {
    label: "البنايات",
    icon: "i-heroicons-home",
    to: "/getting-started/installation",
  },
  {
    label: "الايجارات",
    icon: "i-heroicons-chart-bar",
    to: `${route.path.startsWith("/dev") ? "/dev" : ""}/components/vertical-navigation`,
  },
  {
    label: "الاعلانات",
    icon: "i-heroicons-command-line",
    to: "/components/command-palette",
  },
  {
    label: "المطالبات المالية",
    icon: "i-heroicons-home",
    to: "/getting-started/installation",
  },
  {
    label: "الشقق المتاحة للطلبة",
    icon: "i-heroicons-chart-bar",
    to: `${route.path.startsWith("/dev") ? "/dev" : ""}/components/vertical-navigation`,
  },
  {
    label: "الطلبات الجديدة",
    icon: "i-heroicons-command-line",
    to: "/components/command-palette",
  },
  {
    label: "المستخدمين",
    icon: "i-heroicons-command-line",
    to: "/components/command-palette",
  },
];
</script>

<template>
  <UVerticalNavigation :links="links" class="my-3">
    <template #default="{ link }">
      <span class="relative py-2 place-content-center text-base">{{ link.label }}</span>
    </template>
  </UVerticalNavigation>
</template>
