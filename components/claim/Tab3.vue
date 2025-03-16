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
  { key: "dateTime", label: "التاريخ والوقت", sortable: true },
  { key: "payment", label: "الدفعة", sortable: false },
  { key: "notes", label: "الملاحظات", sortable: false },
];

const selectedColumns = ref([...columns]);

const totalPayments = computed(() => {
  return props.claim.claimCollections.reduce((sum, c) => sum + c.payment, 0);
});
</script>

<template>
  <dl class="grid grid-cols-1 gap-4 sm:grid sm:grid-cols-4 sm:gap-6">
    <div class="col-span-4">
      <dd class="font-normal text-primary-500">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable :rows="props.claim.claimCollections" :columns="selectedColumns">
            <template #dateTime-data="{ row }">
              <span>{{ format(row.dateTime, "hh:mm - dd/MM/yyy") }}</span>
            </template>

            <template #payment-data="{ row }">
              <span>
                {{ row.payment + " دينار" }}
              </span>
            </template>
          </UTable>
        </div>
        <div class="text-right font-semibold">
          <span>المجموع الكلي للدفعات: {{ totalPayments }} دينار</span>
        </div>
      </dd>
    </div>
  </dl>
</template>

<style></style>
