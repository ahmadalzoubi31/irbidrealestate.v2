<script lang="ts" setup>
// Import necessary dependencies
import type { Apartment, ApartmentRenterInfo, Building } from "@prisma/client";

// interface
interface ApartmentWithRenterInfo extends Apartment {
  building: Building;
  renterInfo: ApartmentRenterInfo[];
}
// Declare Props
const props = defineProps({
  apartment: {
    type: Object as PropType<ApartmentWithRenterInfo>,
    required: true,
  },
});
// Columns
const columns = [
  { key: "renterName", label: "الاسم الكامل", sortable: true },
  { key: "renterNumber", label: "رقم الموبايل", sortable: false },
  { key: "renterNationality", label: "الجنسية", sortable: false },
  { key: "renterIdentification", label: "رقم الاثبات", sortable: false },
  { key: "identificationImage", label: "صورة الاثبات", sortable: false },
  { key: "contractImage", label: "صورة العقد", sortable: false },
];
const selectedColumns = ref([...columns]);
const isModalOpen = ref(false);
const modalData = ref("");

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
          <UTable :rows="props.apartment.renterInfo" :columns="selectedColumns">
            <template #flatStatus-data="{ row }">
              <span :class="row.flatStatus === 2 ? 'text-red-500' : ''">{{ useGetFlatStatusName(row.flatStatus) }}</span>
            </template>
            <template #identificationImage-data="{ row }">
              <div
                v-if="row.identificationImage"
                @click="fillModalProperties(row.identificationImage)"
                class="font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer"
              >
                <UIcon name="i-heroicons-eye-20-solid" class="h-5 w-5 flex-shrink-0 align-sub" />
                مشاهدة
              </div>
            </template>
            <template #contractImage-data="{ row }">
              <div
                v-if="row.contractImage"
                @click="fillModalProperties(row.contractImage)"
                class="font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer"
              >
                <UIcon name="i-heroicons-eye-20-solid" class="h-5 w-5 flex-shrink-0 align-sub" />
                مشاهدة
              </div>
            </template>
          </UTable>
        </div>
      </dd>
    </div>
  </dl>
</template>

<style></style>
