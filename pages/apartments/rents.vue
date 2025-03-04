<script setup lang="ts">
// Dependencies
import type { Apartment } from "@prisma/client";
import format from "date-fns/format";

// State
const q = ref("");
const selected: Ref<Apartment[]> = ref([]);
const expand = ref({ openedRows: [], row: null });

// Columns
const { columns, selectedColumns } = useApartmentTableColumns();

// Fetching
const { apartments, status } = useApartments();

// Computed loading state
const isLoading = computed(() => status.value !== "success" && status.value !== "error");

// Filtering
const filteredRows = useFilteredRows<Apartment>(apartments, q, ["createdAt", "updatedAt"]);

// Define the `openModal` function before passing it to `useApartmentActions`
const openModal = (type: string) => {
  if (type === "renewed") useState("isRenewedModalOpen").value = true;
  if (type === "expired") useState("isExpiredModalOpen").value = true;
  if (type === "broken") useState("isBrokenModalOpen").value = true;
};

// Actions
const { deleteApartment, getDropdownItems } = useApartmentActions();

const select = (row: Apartment) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const editSelectedRecord = async (id: number) => {
  await navigateTo(`/apartments/rents/${id}/edit`);
};

const deleteSelectedRecord = async () => {
  useLoadingIndicator().start();
  if (!selected.value.length) return;
  await deleteApartment(selected.value[0].id);
};
</script>

<template>
  <div id="apartment">
    <div class="parentWrapper" v-if="useRoute().name === 'apartments-rents'">
      <!-- Modals -->
      <ApartmentExpiredModal :selectedApartmentId="selected[0]?.id" />
      <ApartmentBrokenModal :selectedApartmentId="selected[0]?.id" />
      <ApartmentRenewedModal :selectedApartmentId="selected[0]?.id" />

      <!-- Action Buttons & Search Filter -->
      <div class="flex my-3 justify-between">
        <div id="buttonWrapper">
          <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة عقار" :to="'/apartments/rents/create'" />
          <!-- <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف عقار" :disabled="selected.length === 0" @click="deleteSelectedRecord" /> -->
        </div>
        <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
      </div>

      <!-- Table -->
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
        <UTable :rows="filteredRows" :columns="selectedColumns" v-model="selected" v-model:expand="expand" @select="select" :loading="isLoading">
          <template #expand="{ row }">
            <div class="px-8 py-8">
              <ApartmentDetails :apartment="row" />
            </div>
          </template>
          <template #apartmentNumber-data="{ row }">
            <span
              v-if="row.rentStatus != 0 && row.rentStatus != 1"
              :class="['font-bold text-blue-500 dark:text-blue-400 underline']"
              @click="editSelectedRecord(row.id)"
            >
              {{ row.apartmentNumber }}
            </span>
          </template>
          <template #rentDate-data="{ row }">
            <span>
              {{ format(row.rentDate, "dd/MM/yyyy") }}
            </span>
          </template>
          <template #rentStatus-data="{ row }">
            <span>
              {{ useGetContractStatusName(row.rentStatus) }}
            </span>
          </template>
          <template #actions-data="{ row }">
            <UDropdown v-if="row.rentStatus != 0 && row.rentStatus != 1" :items="getDropdownItems(row, openModal)" class="align-middle">
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" class="h-0" />
            </UDropdown>
          </template>
        </UTable>
      </div>
    </div>
    <div class="childWrapper">
      <NuxtPage />
    </div>
  </div>
</template>
