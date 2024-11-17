<script setup>
clearNuxtState("buildings");
clearNuxtState("apartments");

const { data: buildings } = await useAsyncData("getBuildings", () => $fetch("/api/buildings"));
const { data: apartments } = await useAsyncData("getApartments", () => $fetch("/api/apartments"));

useState("buildings", () => buildings.value);
useState("apartments", () => apartments.value);
</script>

<template>
  <Tabs />
  <NuxtPage />
</template>
