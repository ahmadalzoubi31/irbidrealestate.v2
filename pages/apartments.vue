<script setup>
// await navigateTo("/apartments/rents");
const _buildingStore = useBuildingStore();
const _apartmentStore = useBuildingStore();

await _buildingStore.fetchBuildings();
// await _apartmentStore.fetchApartments();
</script>

<template>
  <NuxtPage />
</template>
