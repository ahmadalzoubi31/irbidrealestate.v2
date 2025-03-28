<script lang="ts" setup>
// Import necessary dependencies
import type { building, buildingFlat } from "@prisma/client";

// Declare Props
const props = defineProps({
  building: {
    type: Object,
    required: true,
  },
});

// Columns
const columns = [
  { key: "flatNumber", label: "رقم الشقة", sortable: true },
  { key: "flatStatus", label: "حالة الشقة", sortable: false },
  { key: "ownerName", label: "اسم المالك", sortable: false },
  { key: "ownerNumber", label: "رقم المالك", sortable: false },
  { key: "renterName", label: "اسم المستأجر", sortable: false },
  { key: "renterNumber", label: "رقم المستأجر", sortable: false },
];
const selectedColumns = ref([...columns]);
</script>

<template>
  <dl class="grid grid-cols-1 gap-2 sm:grid sm:grid-cols-4 sm:gap-4">
    <div class="col-span-4">
      <dd class="font-normal text-primary-500">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2"
        >
          <UTable
            :rows="props.building.buildingFlat"
            :columns="selectedColumns"
          >
            <template #flatStatus-data="{ row }">
              <span :class="row.flatStatus === 2 ? 'text-red-500' : ''">{{
                useGetFlatStatusName(row.flatStatus)
              }}</span>
            </template>
          </UTable>
        </div>
      </dd>
    </div>
  </dl>
</template>

<style></style>
