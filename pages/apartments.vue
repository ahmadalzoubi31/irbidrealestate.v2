<script setup>
// clearNuxtState("buildings");
// clearNuxtState("apartments");

// const { data: buildings } = await useAsyncData("getBuildings", () => $fetch("/api/buildings"));
// const { data: apartments } = await useAsyncData("getApartments", () => $fetch("/api/apartments"));

// useState("buildings", async () => buildings.value);
// useState("apartments", async () => apartments.value);
</script>

<template>
  <Tabs />
  <NuxtPage />
</template>
