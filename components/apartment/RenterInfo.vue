<script lang="ts" setup>
// Dependencies
interface RenterState {
  renterName: string;
  renterNumber: string;
  renterAdditionalNumber: string;
  renterNationality: string;
  renterCountry: string | null;
  renterIdentification: string;
  identificationImage: Image | string;
  contractImage: Image | string;
}

// State
const q = ref("");
const selected: Ref<RenterState[]> = useState(() => []);
const props = defineProps({
  renterDetails: {
    type: Array<RenterState>,
    required: true,
  },
});

// Columns
const columns = [
  { key: "select", class: "w-2" },
  { key: "renterName", label: "الاسم الكامل", sortable: true },
  { key: "renterNumber", label: "رقم الموبايل", sortable: false },
  { key: "renterAdditionalNumber", label: "رقم موبايل اضافي", sortable: false },
  { key: "renterNationality", label: "الجنسية", sortable: false },
  { key: "renterIdentification", label: "رقم الاثبات ", sortable: false },
  { key: "identificationImage", label: "صورة الاثبات", sortable: false },
  { key: "contractImage", label: "صورة العقد", sortable: false },
  { key: "actions" },
];
const selectedColumns = ref([...columns]);
const items = (row: RenterState, index: number) => [
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

// Filtering
const filteredRows = useFilteredRows<RenterState>(props.renterDetails, q, [
  "id",
  "image",
]);

const openModal = (
  type: string,
  row: RenterState | null,
  index: number | null
) => {
  if (type === "add") useState("isAddRenterModalOpen").value = true;
  if (type === "edit") {
    useState("selectedDetailRow").value = row;
    useState("selectedDetailIndex").value = index;
    useState("isEditRenterModalOpen").value = true;
  }
};

const select = (row: RenterState) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const deleteSelectedRecord = async (index: number) => {
  const result = confirm("هل انت متأكد من مسح المستأجر؟");
  if (!result) return;
  props.renterDetails.splice(index, 1);

  emit("submitAddForm", props.renterDetails); // Send the state to Create.vue
};

const submitAddForm = (payloadFromChildeModal: RenterState) => {
  props.renterDetails.push(payloadFromChildeModal);
  emit("submitAddForm", props.renterDetails); // Send the props.renterDetails to Create.vue
};
const submitEditForm = (payloadFromChildeModal: RenterState, index: number) => {
  props.renterDetails[index] = payloadFromChildeModal;
  emit("submitAddForm", props.renterDetails); // Send the state to Create.vue
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
  <ApartmentAddRenterModal
    @submit-add-form="submitAddForm"
    :form-data="props.renterDetails"
  />
  <ApartmentEditRenterModal @submit-edit-form="submitEditForm" />
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
        label="اضافة مستأجر"
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
      <template #identificationImage-data="{ row }">
        <div
          v-if="
            typeof row.identificationImage === 'object' &&
            row.identificationImage !== null &&
            'content' in row.identificationImage
          "
          @click="fillModalProperties(row.identificationImage.content)"
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
            typeof row.identificationImage === 'string' &&
            row.identificationImage !== '' &&
            row.identificationImage !== null
          "
          @click="fillModalProperties2(row.identificationImage)"
          class="font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer"
        >
          <UIcon
            name="i-heroicons-eye-20-solid"
            class="h-5 w-5 flex-shrink-0 align-sub"
          />
          مشاهدة
        </div>
      </template>
      <template #contractImage-data="{ row }">
        <div
          v-if="
            typeof row.contractImage === 'object' &&
            row.contractImage !== null &&
            'content' in row.contractImage
          "
          @click="fillModalProperties(row.contractImage.content)"
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
            typeof row.contractImage === 'string' &&
            row.contractImage !== '' &&
            row.contractImage !== null
          "
          @click="fillModalProperties2(row.contractImage)"
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
