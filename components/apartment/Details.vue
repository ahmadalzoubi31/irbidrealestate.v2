<script setup lang="ts">
import type { Apartment, ApartmentRenterInfo, Building } from "@prisma/client";

// interface
interface ApartmentWithRenterInfo extends Apartment {
  building: Building;
  renterInfo: ApartmentRenterInfo[];
}
// Declare Props
const props = defineProps({
  apartment: {
    type: Object as PropType<ApartmentWithRenterInfo>,
    required: true,
  },
});

const items = [
  {
    slot: "apartmentInfo",
    label: "معلومات العقار",
    icon: "i-heroicons-information-circle",
  },
  {
    slot: "apartmentRenters",
    label: "معلومات المستأجرين",
    icon: "i-heroicons-users",
  },
];
</script>

<template>
  <UTabs :items="items" class="w-full">
    <template #apartmentInfo="{ item }">
      <UCard>
        <template #header>
          <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </p>
          <!-- <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Make changes to your account here. Click save when you're done.</p> -->
        </template>

        <ApartmentTab1 :apartment="apartment" />

        <!-- <template #footer>
          <UButton type="submit" color="black"> Save account </UButton>
        </template> -->
      </UCard>
    </template>

    <template #apartmentRenters="{ item }">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </h3>
          <!-- <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Change your password here. After saving, you'll be logged out.</p> -->
        </template>

        <ApartmentTab2 :apartment="apartment" />

        <!-- <template #footer>
           <UButton type="submit" color="black"> Save password </UButton>
        </template> -->
      </UCard>
    </template>
  </UTabs>
</template>
