<script setup lang="ts">
// Declare Props
const props = defineProps({
  claim: {
    type: Object as PropType<ClaimWithDetailsAndCollections>,
    required: true,
  },
});

const items = [
  {
    slot: "claimInfo",
    label: "معلومات المطالبة",
    icon: "i-heroicons-information-circle",
  },
  {
    slot: "claimDetailsInfo",
    label: "تفاصيل المطالبة",
    icon: "i-material-symbols-background-grid-small-outline",
  },
  {
    slot: "claimCollectionsInfo",
    label: "تفاصيل التحصيل",
    icon: "i-material-symbols-inventory-rounded",
  },
];
</script>

<template>
  <UTabs :items="items" class="w-full">
    <template #claimInfo="{ item }">
      <UCard>
        <template #header>
          <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </p>
        </template>

        <ClaimTab1 :claim="claim" />
      </UCard>
    </template>

    <template #claimDetailsInfo="{ item }">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </h3>
        </template>

        <ClaimTab2 :claim="claim" />
      </UCard>
    </template>

    <template #claimCollectionsInfo="{ item }">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </h3>
        </template>

        <ClaimTab3 :claim="claim" />
      </UCard>
    </template>
  </UTabs>
</template>
