<script setup lang="ts">
import type { Claim } from "@prisma/client";
import format from "date-fns/format";
import { useClaimTableColumns } from "~/composables/claim/useClaimTableColumns";

// State
const q = ref("");
const selected: Ref<Claim[]> = ref([]);
const expand = ref({ openedRows: [], row: null });

// Columns
const { columns, selectedColumns } = useClaimTableColumns();

// Fetching
const { claims, status } = useClaims();

// Computed loading state
const isLoading = computed(() => status.value !== "success" && status.value !== "error");

// Filtering
const filteredRows = useFilteredRows<Claim>(claims, q, ["createdAt", "updatedAt"]);

// Actions
const { deleteClaim } = useClaimActions();

const select = (row: Claim) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const editSelectedRecord = async (id: number) => {
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
          <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة مطالبة" :to="'/claims/create'" />
          <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف مطالبة" :disabled="selected.length === 0" @click="deleteSelectedRecord" />
          <UButton
            icon="i-heroicons-arrow-right-on-rectangle-20-solid"
            label="نشر"
            :disabled="selected.length === 0"
            @click="generateSharedLinkSelectedRecord"
          />
        </div>
        <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
      </div>

      <!-- Table -->
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
        <UTable
          :rows="filteredRows"
          :columns="selectedColumns"
          v-model="selected"
          v-model:expand="expand"
          :single-select="true"
          @select="select"
          :loading="isLoading"
        >
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
            <span :class="['font-bold text-blue-500 dark:text-blue-400 underline']" @click="editSelectedRecord(row.id)">
              {{ row.claimNumber }}
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
  </div>
  <div class="childWrapper">
    <NuxtPage />
  </div>
</template>
