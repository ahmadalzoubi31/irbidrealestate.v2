<script setup lang="ts">
import type { claim } from "@prisma/client";
import format from "date-fns/format";
import { useClaimTableColumns } from "~/composables/claim/useClaimTableColumns";

// State
const q = ref("");
const selected: Ref<claim[]> = ref([]);
const expand = ref({ openedRows: [], row: null });

// Columns
const { columns, selectedColumns } = useClaimTableColumns();

// Fetching
const { claims, status } = useClaims();

// Computed loading state
const isLoading = computed(
  () => status.value !== "success" && status.value !== "error"
);
const activeClaims = computed(() =>
  claims.value
    ? claims.value.filter(
        (claim) =>
          claim.claimStatus === 1 &&
          new Date(claim.claimDate).getFullYear() == selectedYear.value
      )
    : []
);
const readyClaims = computed(() =>
  claims.value
    ? claims.value.filter(
        (claim) =>
          claim.claimStatus === 2 &&
          new Date(claim.claimDate).getFullYear() == selectedYear.value
      )
    : []
);
const completedClaims = computed(() =>
  claims.value
    ? claims.value.filter(
        (claim) =>
          claim.claimStatus === 3 &&
          new Date(claim.claimDate).getFullYear() == selectedYear.value
      )
    : []
);

// Year Filter
const selectedYear = ref(new Date().getFullYear());
const years = ref([
  2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032,
  2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045,
  2046, 2047, 2048, 2049, 2050, 2051, 2052, 2053, 2054, 2055, 2056, 2057, 2058,
  2059, 2060,
]);

// Filtering
const filteredRows_active = useFilteredRows<claim>(activeClaims, q, [
  "createdAt",
  "updatedAt",
]);
const filteredRows_ready = useFilteredRows<claim>(readyClaims, q, [
  "createdAt",
  "updatedAt",
]);
const filteredRows_completed = useFilteredRows<claim>(completedClaims, q, [
  "createdAt",
  "updatedAt",
]);

// Actions
const { deleteClaim } = useClaimActions();

const select = (row: claim) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const editSelectedRecord = async (id: string) => {
  await navigateTo(`/claims/${id}/edit`);
};
const deleteSelectedRecord = async () => {
  useLoadingIndicator().start();
  if (!selected.value.length) return;
  await deleteClaim(selected.value[0].id);
};
const generateSharedLinkSelectedRecord = async () => {
  const id = selected.value[0].id;
  navigator.clipboard.writeText(`/claims/${id}/generate`);
  window.open(`/claims/${id}/generate`, "_blank");
  // await navigateTo(`/ads/${id}/generate`, {
  //   replace: true,
  // });
};
</script>

<template>
  <div id="claim">
    <div class="parentWrapper" v-if="useRoute().name === 'claims'">
      <!-- Action Buttons & Search Filter -->
      <div class="flex my-3 justify-between">
        <div id="buttonWrapper">
          <UButton
            icon="i-heroicons-plus-circle-20-solid"
            label="اضافة مطالبة"
            :to="'/claims/create'"
          />
          <UButton
            icon="i-heroicons-minus-circle-20-solid"
            label="حذف مطالبة"
            :disabled="selected.length === 0"
            @click="deleteSelectedRecord"
          />
          <UButton
            icon="i-heroicons-arrow-right-on-rectangle-20-solid"
            label="نشر"
            :disabled="selected.length === 0"
            @click="generateSharedLinkSelectedRecord"
          />
        </div>
        <div class="flex justify-between">
          <UInput class="ml-3" v-model="q" placeholder="البحث ..." />
          <USelect :options="years" v-model="selectedYear" />
        </div>
      </div>

      <!-- Active Table -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-12"
      >
        <UTable
          :rows="filteredRows_active"
          :columns="selectedColumns"
          v-model="selected"
          v-model:expand="expand"
          :single-select="true"
          @select="select"
          :loading="isLoading"
        >
          <template #caption>
            <caption>
              <h3 class="py-2 font-bold">المطالبات النشطة</h3>
            </caption>
          </template>
          <template #expand="{ row }">
            <div class="px-8 py-8">
              <ClaimDetails :claim="row" />
            </div>
          </template>
          <template #claimDate-data="{ row }">
            <span>
              {{ format(row.claimDate, "dd/MM/yyyy") }}
            </span>
          </template>
          <template #total-data="{ row }">
            <span>
              {{ row.total + " دينار" }}
            </span>
          </template>
          <template #claimNumber-data="{ row }">
            <span
              :class="['font-bold text-blue-500 dark:text-blue-400 underline']"
              @click="editSelectedRecord(row.id)"
            >
              {{ row.claimNumber }}
            </span>
          </template>
          <template #claimStatus-data="{ row }">
            <span>
              {{ useGetClaimStatusName(row.claimStatus) }}
            </span>
          </template>
        </UTable>
      </div>

      <!-- Ready Table -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-12"
      >
        <UTable
          :rows="filteredRows_ready"
          :columns="selectedColumns"
          v-model="selected"
          v-model:expand="expand"
          :single-select="true"
          @select="select"
          :loading="isLoading"
        >
          <template #caption>
            <caption>
              <h3 class="py-2 font-bold">المطالبات الجاهزة للتحصيل</h3>
            </caption>
          </template>
          <template #expand="{ row }">
            <div class="px-8 py-8">
              <ClaimDetails :claim="row" />
            </div>
          </template>
          <template #claimDate-data="{ row }">
            <span>
              {{ format(row.claimDate, "dd/MM/yyyy") }}
            </span>
          </template>
          <template #total-data="{ row }">
            <span>
              {{ row.total + " دينار" }}
            </span>
          </template>
          <template #claimNumber-data="{ row }">
            <span
              :class="['font-bold text-blue-500 dark:text-blue-400 underline']"
              @click="editSelectedRecord(row.id)"
            >
              {{ row.claimNumber }}
            </span>
          </template>
          <template #claimStatus-data="{ row }">
            <span>
              {{ useGetClaimStatusName(row.claimStatus) }}
            </span>
          </template>
        </UTable>
      </div>

      <!-- Completed Table -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-12"
      >
        <UTable
          :rows="filteredRows_completed"
          :columns="selectedColumns"
          v-model="selected"
          v-model:expand="expand"
          :single-select="true"
          @select="select"
          :loading="isLoading"
        >
          <template #caption>
            <caption>
              <h3 class="py-2 font-bold">المطالبات المكتملة</h3>
            </caption>
          </template>
          <template #expand="{ row }">
            <div class="px-8 py-8">
              <ClaimDetails :claim="row" />
            </div>
          </template>
          <template #claimDate-data="{ row }">
            <span>
              {{ format(row.claimDate, "dd/MM/yyyy") }}
            </span>
          </template>
          <template #total-data="{ row }">
            <span>
              {{ row.total + " دينار" }}
            </span>
          </template>
          <template #claimNumber-data="{ row }">
            <span
              :class="['font-bold text-blue-500 dark:text-blue-400 underline']"
              @click="editSelectedRecord(row.id)"
            >
              {{ row.claimNumber }}
            </span>
          </template>
          <template #claimStatus-data="{ row }">
            <span>
              {{ useGetClaimStatusName(row.claimStatus) }}
            </span>
          </template>
        </UTable>
      </div>
    </div>
  </div>
  <div class="childWrapper">
    <NuxtPage />
  </div>
</template>
