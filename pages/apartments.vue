<script setup lang="ts">
import type { Apartment, Building } from "@prisma/client";

await useAsyncData<Building[]>("getBuildings", () => $fetch<Building[]>("/api/buildings"));
await useAsyncData<Apartment[]>("getApartments", () => $fetch<Apartment[]>("/api/apartments"));
</script>

<template>
  <Tabs />
  <NuxtPage />
</template>
