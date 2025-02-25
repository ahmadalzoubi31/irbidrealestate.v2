<script lang="ts" setup>
// Import necessary dependencies
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

// Columns
const columns = [
  { key: "flatNumber", label: "رقم الشقة", sortable: true },
  { key: "ownerName", label: "اسم المالك", sortable: false },
  { key: "ownerNumber", label: "رقم المالك", sortable: false },
  { key: "renterName", label: "اسم المستأجر", sortable: false },
  { key: "renterNumber", label: "رقم المستأجر", sortable: false },
];
const selectedColumns = ref([...columns]);
</script>

<template>
  <dl class="grid grid-cols-1 gap-1 sm:grid sm:grid-cols-4 sm:gap-2">
    <div class="col-span-4">
      <dd class="font-normal text-primary-500">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable :rows="props.building.buildingFlat" :columns="selectedColumns" />
        </div>
      </dd>
    </div>
  </dl>
</template>

<style></style>
