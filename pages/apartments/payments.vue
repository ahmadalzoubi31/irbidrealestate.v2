<script setup lang="ts">
// Dependencies
import type { Payment } from "@prisma/client";
import format from "date-fns/format";

// State
const q = ref("");
const selected: Ref<Payment[]> = ref([]);
const expand = ref({ openedRows: [], row: null });

// Columns
const { columns, selectedColumns } = usePaymentTableColumns();

// Fetching
const { payments, status } = usePayments();

// Computed loading state
const isLoading = computed(() => status.value !== "success" && status.value !== "error");

// Filtering
const filteredRows = useFilteredRows<Payment>(payments, q, ["createdAt", "updatedAt"]);

// Actions
const { deletePayment } = usePaymentActions();

const select = (row: Payment) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const editSelectedRecord = async (id: string) => {
  await navigateTo(`/apartments/payments/${id}/edit`);
};

const deleteSelectedRecord = async () => {
  useLoadingIndicator().start();
  if (!selected.value.length) return;
  await deletePayment(selected.value[0].id.toFixed());
};
</script>

<template>
  <div id="payment">
    <div class="parentWrapper" v-if="useRoute().name === 'apartments-payments'">
      <div id="paymentTable">
        <!-- Action Buttons -->
        <div id="buttonWrapper" class="my-3">
          <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة دفعة" :to="'/apartments/payments/create'" />
          <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف دفعة" @click="deleteSelectedRecord" />
        </div>
        <div id="filterWrapper" class="my-3">
          <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
        </div>

        <!-- Table -->
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable :rows="filteredRows" :columns="selectedColumns" v-model="selected" v-model:expand="expand" @select="select" :loading="isLoading">
            <template #expand="{ row }">
              <div class="px-8">
                <div class="py-8">
                  <!-- {{ row }} -->
                  <PaymentDetails :payment="row" />
                </div>
              </div>
            </template>
            <template #id-data="{ row }">
              <span :class="['font-bold text-blue-500 dark:text-blue-400 underline']" @click="editSelectedRecord(row.id)">
                {{ row.id }}
              </span>
            </template>
            <template #receivedPaymentDate-data="{ row }">
              <span>
                {{ format(row.receivedPaymentDate, "dd/MM/yyyy") }}
              </span>
            </template>
            <template #apartment.rentDate-data="{ row }">
              <span>
                {{ format(row.apartment.rentDate, "dd/MM/yyyy") }}
              </span>
            </template>
            <template #nextRentDate-data="{ row }">
              <span>
                {{ format(row.nextRentDate, "dd/MM/yyyy") }}
              </span>
            </template>
            <template #depositDate-data="{ row }">
              <span>
                {{ format(row.depositDate, "dd/MM/yyyy") }}
              </span>
            </template>
          </UTable>
        </div>
      </div>
    </div>
    <div class="childWrapper">
      <NuxtPage />
    </div>
  </div>
</template>
