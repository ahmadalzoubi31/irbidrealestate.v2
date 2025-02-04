<script setup lang="ts">
import type { Building } from "@prisma/client";

// State
const q = ref("");
const selected: Ref<Building[]> = ref([]);
const expand = ref({ openedRows: [], row: null });

// Columns
const { columns, selectedColumns } = useBuildingTableColumns();

// Fetching
const { buildings, status } = useBuildings();

// Computed loading state
const isLoading = computed(() => status.value !== "success" && status.value !== "error");

// Filtering
const filteredRows = useFilteredRows<Building>(buildings, q, ["createdAt", "updatedAt"]);

// Actions
const { deleteBuilding } = useBuildingActions();

const select = (row: Building) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const editSelectedRecord = async (id: number) => {
  await navigateTo(`/buildings/${id}/edit`);
};

const deleteSelectedRecord = async () => {
  useLoadingIndicator().start();
  if (!selected.value.length) return;
  await deleteBuilding(selected.value[0].id);
};
</script>

<template>
  <div id="building">
    <div class="parentWrapper" v-if="useRoute().name === 'buildings'">
      <!-- Action Buttons & Search Filter -->
      <div class="flex my-3 justify-between">
        <div id="buttonWrapper">
          <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة بناية" :to="'/buildings/create'" />
          <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف بناية" @click="deleteSelectedRecord" />
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
              <BuildingDetails :building="row" />
            </div>
          </template>
          <template #name-data="{ row }">
            <span :class="['font-bold text-blue-500 dark:text-blue-400 underline']" @click="editSelectedRecord(row.id)">
              {{ row.name }}
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
