<script setup lang="ts">
import type { Apartment, Building } from "@prisma/client";

clearNuxtState("buildings");
clearNuxtState("apartments");

const { data: buildings } = await useAsyncData<Building[]>("getBuildings", () => $fetch<Building[]>("/api/buildings"));
const { data: apartments } = await useAsyncData<Apartment[]>("getApartments", () => $fetch<Apartment[]>("/api/apartments"));

useState("buildings", () => buildings.value);
useState("apartments", () => apartments.value);
</script>

<template>
  <Tabs />
  <NuxtPage />
</template>
