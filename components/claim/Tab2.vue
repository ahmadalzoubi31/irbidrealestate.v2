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
  { key: "item", label: "المادة", sortable: false },
  { key: "price", label: "السعر العام", sortable: false },
  { key: "specialPrice", label: "السعر الخاص", sortable: false },
  { key: "rowProfit", label: "المربح", sortable: false },
  { key: "dateTime", label: "التاريخ والوقت", sortable: true },
  { key: "image", label: "صورة الفاتورة", sortable: false },
];

const selectedColumns = ref([...columns]);
const isModalOpen = ref(false);
const modalData = ref("");

const totalPrices = computed(() => {
  return props.claim.claimDetails.reduce((sum, d) => sum + d.price, 0);
});

const fillModalProperties = async (rowContent: string) => {
  const imageUrl = await getImageUrl(rowContent, false);
  modalData.value = imageUrl;
  isModalOpen.value = true;
};

const getImageUrl = async (key: string, download = false) => {
  if (!key) return "";
  const res = await $fetch<any>("/api/v2/files/" + key);

  const base64Data = res.body.split(",")[1]; // Extract base64 data
  const mimeType = res.mimeType; // Ensure the response contains the MIME type
  const url = base64ToBlobUrl(base64Data, mimeType);

  return url;
};

const base64ToBlobUrl = (base64: string, mimeType: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  return URL.createObjectURL(blob);
};
</script>

<template>
  <UModal v-model="isModalOpen">
    <div class="p-4 w-full">
      <NuxtImg :src="modalData" sizes="100vw" />
    </div>
  </UModal>
  <dl class="grid grid-cols-1 gap-4 sm:grid sm:grid-cols-4 sm:gap-6">
    <div class="col-span-4">
      <dd class="font-normal text-primary-500">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable :rows="props.claim.claimDetails" :columns="selectedColumns">
            <template #dateTime-data="{ row }">
              <span>{{ format(row.dateTime, "hh:mm - dd/MM/yyy") }}</span>
            </template>
            <template #image-data="{ row }">
              <div
                v-if="row.image"
                @click="fillModalProperties(row.image)"
                class="font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer"
              >
                <UIcon name="i-heroicons-eye-20-solid" class="h-5 w-5 flex-shrink-0 align-sub" />
                مشاهدة
              </div>
            </template>
            <template #price-data="{ row }">
              <span>
                {{ row.price + " دينار" }}
              </span>
            </template>
            <template #specialPrice-data="{ row }">
              <span>
                {{ row.specialPrice + " دينار" }}
              </span>
            </template>
            <template #rowProfit-data="{ row }">
              <span :class="[row.specialPrice - row.price > 0 ? 'text-primary' : 'text-rose-500']">
                {{ row.specialPrice - row.price + " دينار" }}
              </span>
            </template>
          </UTable>
        </div>
        <div class="text-right font-semibold">
          <span>المجموع الكلي للمواد: {{ totalPrices }} دينار</span>
        </div>
      </dd>
    </div>
  </dl>
</template>

<style></style>
