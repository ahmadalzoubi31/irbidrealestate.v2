<script lang="ts" setup>
// Dependencies
import type { BuildingFlat } from "@prisma/client";
const route = useRoute();
const nuxtApp = useNuxtApp();
const toast = useToast();

// State
const q = ref("");
const selected: Ref<BuildingFlat[]> = useState(() => []);
const selectedFlatId = useState("selectedFlatId", () => 0);
// Extract route parameter
const selectedBuildingId = ref(Number(route.params.id));

// Columns
const columns = [
  { key: "select", class: "w-2" },
  { key: "flatNumber", label: "رقم الشقة", sortable: true },
  { key: "ownerName", label: "اسم المالك", sortable: false },
  { key: "ownerNumber", label: "رقم المالك", sortable: false },
  { key: "electricSub", label: "رقم اشتراك الكهرباء", sortable: false },
  { key: "electricSub", label: "رقم عداد الكهرباء", sortable: false },
  { key: "waterSub", label: "رقم اشتراك الماء", sortable: false },
  { key: "waterSub", label: "رقم عداد الماء", sortable: false },
  { key: "flatStatus", label: "حالة الشقة", sortable: false },
  { key: "renterName", label: "اسم المستأجر", sortable: false },
  { key: "renterNumber", label: "رقم المستأجر", sortable: false },
  { key: "actions" },
];
const selectedColumns = ref([...columns]);
const items = (row: number) => [
  [
    {
      label: "تعديل",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => openModal("edit", row),
    },
  ],
  [
    {
      label: "مسح",
      icon: "i-heroicons-trash-20-solid",
      click: () => deleteSelectedRecord(row),
    },
  ],
];

// Fetching
const { data: buildingFlats, status } = useFetch<BuildingFlat[]>("/api/buildings/flats", {
  key: "getBuildingFlats",
  server: false,
  lazy: true,
  query: { buildingId: selectedBuildingId.value },
});

if (status.value === "error") {
  toast.add({
    description: "حدث خطأ اثناء جلب البنايات",
    color: "rose",
    timeout: 15000,
  });
}

// Computed loading state
const isLoading = computed(() => status.value !== "success" && status.value !== "error");

// Filtering
const filteredRows = useFilteredRows<BuildingFlat>(buildingFlats, q, ["createdAt", "updatedAt"]);

// Define the `openModal` function before passing it to `useBuildingFlatActions`
const openModal = (type: string, rowId: number | null) => {
  if (type === "add") useState("isAddModalOpen").value = true;
  if (type === "edit") {
    useState("selectedFlatId").value = rowId as number;
    useState("isEditModalOpen").value = true;
  }
};

const select = (row: BuildingFlat) => {
  selected.value.length = 0;
  selected.value.push(row);
};

const deleteSelectedRecord = async (id: number) => {
  const result = confirm("هل انت متأكد من مسح الشقة؟");
  if (!result) return;
  useLoadingIndicator().start();
  try {
    await $fetch("/api/buildings/flats/" + id, { method: "DELETE" });
    await refreshNuxtData("getBuildingFlats");
    toast.add({
      description: "تم مسح الشقة بنجاح",
      color: "primary",
      timeout: 1500,
    });
  } catch (error: any) {
    toast.add({
      description: error.message || "حدث خطأ أثناء الحذف",
      color: "rose",
      timeout: 15000,
    });
  } finally {
    useLoadingIndicator().finish();
  }
};
</script>

<template>
  <!-- Modals -->
  <BuildingAddFlatModal :selectedBuildingId="selectedBuildingId" />
  <BuildingEditFlatModal :selectedBuildingId="selectedBuildingId" :selectedFlatId="selectedFlatId" />

  <!-- Action Buttons & Search Filter -->
  <div class="flex my-3 justify-between">
    <div id="buttonWrapper">
      <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة شقة" @click="openModal('add', null)" />
    </div>
    <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
  </div>

  <!-- Table -->
  <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
    <UTable :rows="filteredRows" :columns="selectedColumns" :loading="isLoading" @select="select" v-model="selected">
      <template #flatStatus-data="{ row }">
        {{ useGetFlatStatusName(row.flatStatus) }}
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="items(row.id)" class="align-middle">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" class="h-0" />
        </UDropdown>
      </template>
    </UTable>
  </div>
</template>
