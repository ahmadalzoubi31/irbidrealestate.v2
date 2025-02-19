<script setup lang="ts">
import type { Building, BuildingFlat } from "@prisma/client";

// interface
interface BuildingWithFlats extends Building {
  buildingFlat: BuildingFlat[];
}

// Declare Props
const props = defineProps({
  building: {
    type: Object as PropType<BuildingWithFlats>,
    required: true,
  },
});

const items = [
  {
    slot: "buildingInfo",
    label: "معلومات البناية",
    icon: "i-heroicons-information-circle",
  },
  {
    slot: "buildingOwnersAndRenters",
    label: "معلومات الملاك والمستأجرين",
    icon: "i-heroicons-users",
  },
  {
    slot: "buildingFlatsInfo",
    label: "معلومات الشقق",
    icon: "i-heroicons-building-office-2",
  },
];
</script>

<template>
  <UTabs :items="items" class="w-full">
    <template #buildingInfo="{ item }">
      <UCard>
        <template #header>
          <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </p>
          <!-- <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Make changes to your account here. Click save when you're done.</p> -->
        </template>

        <!-- <BuildingDetailsInfo /> -->
        <BuildingDetailsInfo :building="building" />

        <!-- <template #footer>
          <UButton type="submit" color="black"> Save account </UButton>
        </template> -->
      </UCard>
    </template>

    <template #buildingOwnersAndRenters="{ item }">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </h3>
          <!-- <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Change your password here. After saving, you'll be logged out.</p> -->
        </template>

        <BuildingDetailsOwnersAndRentersInfo :building="building" />

        <!-- <template #footer>
           <UButton type="submit" color="black"> Save password </UButton>
        </template> -->
      </UCard>
    </template>

    <template #buildingFlatsInfo="{ item }">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </h3>
          <!-- <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Change your password here. After saving, you'll be logged out.</p> -->
        </template>

        <BuildingDetailsFlatsInfo :building="building" />

        <!-- <template #footer>
          <UButton type="submit" color="black"> Save password </UButton>
        </template> -->
      </UCard>
    </template>
  </UTabs>
</template>
