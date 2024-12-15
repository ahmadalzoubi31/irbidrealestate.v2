<script setup lang="ts">
import type { Ad } from "@prisma/client";

// State
const q = ref("");
const selected: Ref<Ad[]> = ref([]);
const expand = ref({ openedRows: [], row: null });

// Columns
const { columns, selectedColumns } = useAdTableColumns();

// Fetching
const { ads, status } = useAds();

// Computed loading state
const isLoading = computed(() => status.value !== "success" && status.value !== "error");

// Filtering
const filteredRows = useFilteredRows<Ad>(ads, q, ["createdAt", "updatedAt"]);

// Actions
const { deleteAd } = useAdActions();

const select = (row: Ad) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const editSelectedRecord = async (id: string) => {
  await navigateTo(`/ads/${id}/edit`);
};
const deleteSelectedRecord = async () => {
  useLoadingIndicator().start();
  if (!selected.value.length) return;
  await deleteAd(selected.value[0].id.toFixed());
};
const generateSharedLinkSelectedRecord = async () => {
  const id = selected.value[0].id;
  await navigateTo(`/ads/${id}/generate`, {
    replace: true,
  });
};
</script>

<template>
  <div id="ad">
    <div class="parentWrapper" v-if="useRoute().name === 'ads'">
      <!-- Action Buttons -->
      <div id="buttonWrapper" class="my-3">
        <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة اعلان" :to="'/ads/create'" />
        <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف اعلان" @click="deleteSelectedRecord" />
        <UButton icon="i-heroicons-arrow-right-on-rectangle-20-solid" label="انشاء رابط مشترك" @click="generateSharedLinkSelectedRecord" />
      </div>

      <!-- Search Filter -->
      <div id="filterWrapper" class="my-3">
        <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
      </div>

      <!-- Table -->
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
        <UTable :rows="filteredRows" :columns="selectedColumns" v-model="selected" v-model:expand="expand" @select="select" :loading="isLoading">
          <template #expand="{ row }">
            <div class="px-8 py-8">
              <!-- {{ row }} -->
              <AdDetails :ad="row" />
            </div>
          </template>
          <template #code-data="{ row }">
            <span :class="['font-bold text-blue-500 dark:text-blue-400 underline']" @click="editSelectedRecord(row.id)">
              {{ row.code }}
            </span>
          </template>
          <template #propertyType-data="{ row }">
            <span>
              {{ useGetPropertyTypeName(row.propertyType) }}
            </span>
          </template>
          <template #facebookLink-data="{ row }">
            <span>
              <UButton
                v-if="row.facebookLink"
                :href="row.facebookLink"
                :external="true"
                :target="'_blank'"
                icon="i-heroicons-link-20-solid"
                class="text-blue-500 h-0 align-middle items-center"
                variant="ghost"
                size="sm"
              />
              <span v-else>-</span>
            </span>
          </template>
          <template #instagramLink-data="{ row }">
            <span>
              <UButton
                v-if="row.instagramLink"
                :to="row.instagramLink"
                :external="true"
                :target="'_blank'"
                icon="i-heroicons-link-20-solid"
                class="text-blue-500 h-0 align-middle items-center"
                variant="ghost"
                size="sm"
              />
              <span v-else>-</span>
            </span>
          </template>
          <template #propertyLocation-data="{ row }">
            <span>
              {{ row.governorate + " - " + row.village }}
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
