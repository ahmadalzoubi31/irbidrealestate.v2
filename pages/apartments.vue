<script setup>
clearNuxtState("buildings");
clearNuxtState("apartments");
useState("buildings", async () => await useAsyncData("getBuildings", () => $fetch("/api/buildings")).value);
useState("apartments", async () => await useAsyncData("getApartments", () => $fetch("/api/apartments")).value);
</script>

<template>
  <Tabs />
  <NuxtPage />
</template>
