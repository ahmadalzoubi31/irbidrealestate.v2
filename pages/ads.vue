<script setup lang="ts">
import type { ad } from "@prisma/client";

// State
const q = ref("");
const selected: Ref<ad[]> = ref([]);
const expand = ref({ openedRows: [], row: null });

// Columns
const { columns, selectedColumns } = useAdTableColumns();

// Fetching
const { ads, status } = useAds();

// Computed loading state
const isLoading = computed(
  () => status.value !== "success" && status.value !== "error"
);

// Property Type Filter
const selectedPropertyType: Ref<number[]> = ref([]);
const propertyTypeOptions = [
  { id: 1, name: "شقة سكنية للبيع", value: 1 },
  { id: 2, name: "شقة استثمارية للبيع", value: 2 },
  { id: 3, name: "شقة سكنية للايجار", value: 3 },
  { id: 4, name: "شقة طلابية للايجار", value: 4 },
  { id: 5, name: "ارض للبيع", value: 5 },
  { id: 6, name: "ارض للايجار", value: 6 },
  { id: 7, name: "فيلا للبيع", value: 7 },
  { id: 8, name: "فيلا للايجار", value: 8 },
  { id: 9, name: "مزرعة للبيع", value: 9 },
  { id: 10, name: "مزرعة للايجار", value: 10 },
  { id: 11, name: "مخزن للبيع", value: 11 },
  { id: 12, name: "مخزن للايجار", value: 12 },
  { id: 13, name: "بيت مستقل للبيع", value: 13 },
  { id: 14, name: "بيت مستقل للايجار", value: 14 },
  { id: 15, name: "مجمع تجاري للبيع", value: 15 },
  { id: 16, name: "مجمع تجاري للايجار", value: 16 },
  { id: 17, name: "مكاتب للبيع", value: 17 },
  { id: 18, name: "مكاتب للايجار", value: 18 },
];

const filteredAds = computed(() =>
  ads.value
    ? ads.value.filter(
        (ad) =>
          selectedPropertyType.value.length === 0 ||
          selectedPropertyType.value.includes(ad.propertyType)
      )
    : []
);

// Filtering
const filteredRows = useFilteredRows<ad>(filteredAds, q, [
  "createdAt",
  "updatedAt",
]);

// Actions
const { deleteAd } = useAdActions();

const select = (row: ad) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const editSelectedRecord = async (id: string) => {
  await navigateTo(`/ads/${id}/edit`);
};
const deleteSelectedRecord = async () => {
  useLoadingIndicator().start();
  if (!selected.value.length) return;
  await deleteAd(selected.value[0].id);
};
const generateSharedLinkSelectedRecord = async () => {
  const id = selected.value[0].id;
  navigator.clipboard.writeText(`/ads/${id}/generate`);
  window.open(`/ads/${id}/generate`, "_blank");
  // await navigateTo(`/ads/${id}/generate`, {
  //   replace: true,
  // });
};
</script>

<template>
  <div id="ad">
    <div class="parentWrapper" v-if="useRoute().name === 'ads'">
      <!-- Action Buttons & Search Filter -->
      <div class="flex my-3 justify-between">
        <div id="buttonWrapper">
          <UButton
            icon="i-heroicons-plus-circle-20-solid"
            label="اضافة اعلان"
            :to="'/ads/create'"
          />
          <UButton
            icon="i-heroicons-minus-circle-20-solid"
            label="حذف اعلان"
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
        <div class="flex justify-between w-[30rem]">
          <UInput class="ml-3 w-[30rem]" v-model="q" placeholder="البحث ..." />
          <USelectMenu
            class="w-[20rem]"
            :options="propertyTypeOptions"
            v-model="selectedPropertyType"
            option-attribute="name"
            value-attribute="value"
            multiple
          />
        </div>
      </div>

      <!-- Table -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2"
      >
        <UTable
          :rows="filteredRows"
          :columns="selectedColumns"
          v-model="selected"
          v-model:expand="expand"
          @select="select"
          :loading="isLoading"
        >
          <template #expand="{ row }">
            <div class="px-8 py-8">
              <!-- {{ row }} -->
              <AdDetails :ad="row" />
            </div>
          </template>
          <template #code-data="{ row }">
            <span
              :class="['font-bold text-blue-500 dark:text-blue-400 underline']"
              @click="editSelectedRecord(row.id)"
            >
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
                :to="row.facebookLink"
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
          <template #propertyLink-data="{ row }">
            <span>
              {{ row.governorate + " - " + row.village }}
            </span>
          </template>
          <template #realLocation-data="{ row }">
            <span>
              <UButton
                v-if="row.realLocation"
                :to="row.realLocation"
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
        </UTable>
      </div>
    </div>
    <div class="childWrapper">
      <NuxtPage />
    </div>
  </div>
</template>
