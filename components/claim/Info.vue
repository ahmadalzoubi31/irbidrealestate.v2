<script lang="ts" setup>
// Dependencies
interface ClaimState {
  item: string;
  price: number;
  specialPrice: number;
  dateTime: Date;
  image: Image | null | string;
}

import { format } from "date-fns";

// State
const q = ref("");
const selected: Ref<ClaimState[]> = useState(() => []);

// Columns
const columns = [
  { key: "select", class: "w-2" },
  { key: "item", label: "المادة", sortable: true },
  { key: "price", label: "السعر العام", sortable: false },
  { key: "specialPrice", label: "السعر الخاص", sortable: false },
  { key: "rowProfit", label: "المربح", sortable: false },
  { key: "dateTime", label: "الوقت والتاريخ", sortable: true },
  { key: "image", label: "الفاتورة", sortable: false },
  { key: "actions" },
];
const selectedColumns = ref([...columns]);
const items = (row: ClaimState, index: number) => [
  [
    {
      label: "تعديل",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => openModal("edit", row, index),
    },
  ],
  [
    {
      label: "مسح",
      icon: "i-heroicons-trash-20-solid",
      click: () => deleteSelectedRecord(index),
    },
  ],
];
// const state = ref<ClaimState[]>([]);
const props = defineProps({
  claimDetails: {
    type: Array<ClaimState>,
    required: true,
  },
});

// Filtering
const filteredRows = useFilteredRows<ClaimState>(props.claimDetails, q, [
  "id",
  "image",
]);

const openModal = (
  type: string,
  row: ClaimState | null,
  index: number | null
) => {
  if (type === "add") useState("isAddClaimModalOpen").value = true;
  if (type === "edit") {
    useState("selectedDetailRow").value = row;
    useState("selectedDetailIndex").value = index;
    useState("isEditClaimModalOpen").value = true;
  }
};

const select = (row: ClaimState) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const deleteSelectedRecord = async (index: number) => {
  const result = confirm("هل انت متأكد من مسح المادة؟");
  if (!result) return;
  props.claimDetails.splice(index, 1);

  emit("submitAddForm", props.claimDetails); // Send the state to Create.vue
};

const submitAddForm = (payloadFromChildeModal: ClaimState) => {
  props.claimDetails.push(payloadFromChildeModal);
  emit("submitAddForm", props.claimDetails); // Send the props.claimDetails to Create.vue
};
const submitEditForm = (payloadFromChildeModal: ClaimState, index: number) => {
  props.claimDetails[index] = payloadFromChildeModal;
  emit("submitAddForm", props.claimDetails); // Send the state to Create.vue
};

const emit = defineEmits(["submitAddForm"]);

const isModalOpen = ref(false);
const modalData = ref("");
const fillModalProperties = (rowContent: string) => {
  modalData.value = rowContent;
  isModalOpen.value = true;
};
const fillModalProperties2 = async (rowContent: string) => {
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
  <!-- Modals -->
  <ClaimAddClaimModal
    @submit-add-form="submitAddForm"
    :form-data="props.claimDetails"
  />
  <ClaimEditClaimModal @submit-edit-form="submitEditForm" />
  <UModal v-model="isModalOpen">
    <div class="p-4 w-full">
      <NuxtImg :src="modalData" sizes="90vw" />
    </div>
  </UModal>

  <!-- Action Buttons & Search Filter -->
  <div class="flex my-3 justify-between">
    <div id="buttonWrapper">
      <UButton
        icon="i-heroicons-plus-circle-20-solid"
        label="اضافة مادة"
        @click="openModal('add', null, null)"
      />
    </div>
    <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
  </div>

  <!-- Table -->
  <div
    class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2"
  >
    <UTable
      :rows="filteredRows"
      :columns="selectedColumns"
      @select="select"
      v-model="selected"
    >
      <template #actions-data="{ row, index }">
        <UDropdown :items="items(row, index)" class="align-middle">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
            class="h-0"
          />
        </UDropdown>
      </template>
      <template #dateTime-data="{ row }">
        <span>{{ format(row.dateTime, "hh:mm:ss - dd/MM/yyy") }}</span>
      </template>
      <template #price-data="{ row }">
        <span>{{ row.price + " دينار" }}</span>
      </template>
      <template #specialPrice-data="{ row }">
        <span>{{ row.specialPrice + " دينار" }}</span>
      </template>
      <template #rowProfit-data="{ row }">
        <span
          :class="
            row.price - row.specialPrice > 0 ? 'text-primary' : 'text-rose-500'
          "
        >
          {{
            Math.round((row.price - row.specialPrice) * 1000) / 1000 + " دينار"
          }}
        </span>
      </template>
      <template #image-data="{ row }">
        <div
          v-if="
            typeof row.image === 'object' &&
            row.image !== null &&
            'content' in row.image
          "
          @click="fillModalProperties(row.image.content)"
          class="font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer"
        >
          <UIcon
            name="i-heroicons-eye-20-solid"
            class="h-5 w-5 flex-shrink-0 align-sub"
          />
          مشاهدة
        </div>
        <div
          v-if="
            typeof row.image === 'string' &&
            row.image !== '' &&
            row.image !== null
          "
          @click="fillModalProperties2(row.image)"
          class="font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer"
        >
          <UIcon
            name="i-heroicons-eye-20-solid"
            class="h-5 w-5 flex-shrink-0 align-sub"
          />
          مشاهدة
        </div>
      </template>
    </UTable>
  </div>
</template>
