<script setup lang="ts">
// Dependencies
import type { Order } from "@prisma/client";
import format from "date-fns/format";

// State
const q = ref("");
const selected: Ref<Order[]> = ref([]);
const expand = ref({ openedRows: [], row: null });

// Columns
const { columns, selectedColumns } = useOrderTableColumns();

// Fetching
const { orders, status } = useOrders();

// Computed loading state
const isLoading = computed(() => status.value !== "success" && status.value !== "error");

// Filtering
const filteredRows = useFilteredRows<Order>(orders, q, ["createdAt", "updatedAt"]);

// Actions
const { deleteOrder } = useOrderActions();

const select = (row: Order) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const editSelectedRecord = async (id: string) => {
  await navigateTo(`/orders/${id}/edit`);
};

const deleteSelectedRecord = async () => {
  useLoadingIndicator().start();
  if (!selected.value.length) return;
  await deleteOrder(selected.value[0].id);
};
</script>

<template>
  <div id="order">
    <div class="parentWrapper" v-if="useRoute().name === 'orders'">
      <!-- Action Buttons & Search Filter -->
      <div class="flex my-3 justify-between">
        <div id="buttonWrapper">
          <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة بناية" :to="'/orders/create'" />
          <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف بناية" @click="deleteSelectedRecord" />
        </div>
        <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
      </div>

      <!-- Table -->
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
        <UTable :rows="filteredRows" :columns="selectedColumns" @select="select" v-model="selected" v-model:expand="expand">
          <template #expand="{ row }">
            <div class="px-8">
              <div class="py-8">
                <!-- {{ row }} -->
                <OrderDetails :order="row" />
              </div>
            </div>
          </template>
          <template #id-data="{ row }">
            <span :class="['font-bold text-blue-500 dark:text-blue-400 underline']" @click="editSelectedRecord(row.id)">
              {{ row.id }}
            </span>
          </template>
          <template #date-data="{ row }">
            <span>
              {{ format(row.date, "dd/MM/yyyy") }}
            </span>
          </template>
          <template #type-data="{ row }">
            <span>
              {{ useGetPropertyTypeName(row.type) }}
            </span>
          </template>
          <template #status-data="{ row }">
            <span>
              {{ useGetStatusName(row.status) }}
            </span>
          </template>
        </UTable>
      </div>
    </div>
    <div class="childWrapper">
      <NuxtPage />
    </div>
  </div>
</template>
