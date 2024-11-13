<script setup>
// await navigateTo("/apartments/rents")
const { data } = await useAsyncData("getBuildings", () => $fetch("/api/buildings"));
const buildings = useState("buildings", () => data.value);
</script>

<template>
  <NuxtPage />
</template>
