<script lang="ts" setup>
// Import necessary dependencies
import format from "date-fns/format";

// Declare Props
const props = defineProps({
  claim: {
    type: Object as PropType<ClaimWithDetailsAndCollections>,
    required: true,
  },
});

// Columns
const columns = [
  { key: "item", label: "المادة", sortable: false },
  { key: "price", label: "السعر", sortable: false },
  { key: "dateTime", label: "التاريخ والوقت", sortable: true },
  { key: "billImage", label: "صورة الفاتورة", sortable: false },
];

const selectedColumns = ref([...columns]);

const totalPrices = computed(() => {
  return props.claim.claimDetails.reduce((sum, d) => sum + d.price, 0);
});
</script>

<template>
  <dl class="grid grid-cols-1 gap-1 sm:grid sm:grid-cols-4 sm:gap-2">
    <div class="col-span-4">
      <dd class="font-normal text-primary-500">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable :rows="props.claim.claimDetails" :columns="selectedColumns">
            <template #dateTime-data="{ row }">
              <span>{{ format(row.dateTime, "hh:mm - dd/MM/yyy") }}</span>
            </template>

            <template #price-data="{ row }">
              <span>
                {{ row.price + " دينار" }}
              </span>
            </template>
          </UTable>
        </div>
        <div class="text-right font-semibold">
          <span>المجموع الكلي للمواد: {{ totalPrices }} دينار</span>
        </div>
      </dd>
    </div>
  </dl>
</template>

<style></style>
