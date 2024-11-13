<script setup>
const { data } = await useAsyncData("getBuildings", () => $fetch("/api/buildings"));
clearNuxtState("buildings");
useState("buildings", () => data.value);
</script>

<template>
  <Tabs />
  <NuxtPage />
</template>
