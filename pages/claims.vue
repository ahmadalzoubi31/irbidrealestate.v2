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

const editSelectedRecord = async (id: string) => {
  await navigateTo(`/claims/${id}/edit`);
};
const deleteSelectedRecord = async () => {
  useLoadingIndicator().start();
  if (!selected.value.length) return;
  await deleteClaim(selected.value[0].id);
};
</script>

<template>
  <div id="claim">
    <div class="parentWrapper" v-if="useRoute().name === 'claims'">
      <!-- Action Buttons & Search Filter -->
      <div class="flex my-3 justify-between">
        <div id="buttonWrapper">
          <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة بناية" :to="'/claims/create'" />
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
                <ClaimDetails :claim="row" />
              </div>
            </div>
          </template>
          <template #claimDate-data="{ row }">
            <span>
              {{ format(row.claimDate, "dd/MM/yyyy") }}
            </span>
          </template>
          <template #id-data="{ row }">
            <span :class="['font-bold text-blue-500 dark:text-blue-400 underline']" @click="editSelectedRecord(row.id)">
              {{ row.id }}
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
