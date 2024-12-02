<script setup lang="ts">
import type { Building } from "@prisma/client";

// State
const nuxtApp = useNuxtApp();
const toast = useToast();
const selected = ref<Building[]>([]);
const q = ref("");
const expand = ref({ openedRows: [], row: null });

// Column definitions
const columns = [
  { key: "name", label: "اسم البناية", sortable: true },
  { key: "apartmentsCount", label: "عدد الشقق", sortable: false },
  { key: "storeCount", label: "عدد المخازن", sortable: false },
  { key: "basinName", label: "اسم الحوض", sortable: true },
  { key: "basinNumber", label: "رقم الحوض", sortable: true },
  { key: "landNumber", label: "رقم قطعة للأرض", sortable: true },
  { key: "serviceAmount", label: "الصيانة", sortable: false },
  { key: "maintenanceAmount", label: "الخدمات", sortable: false },
  { key: "electricBill", label: "اشتراك الكهرباء", sortable: false },
  { key: "registeredApartmentsCount", label: "عدد الشقق المسجلة", sortable: false },
];
const selectedColumns = ref([...columns]);

// Fetch buildings data
const {
  data: buildings,
  status,
  refresh: refreshBuildings,
} = await useLazyFetch<Building[]>("/api/buildings", {
  key: "getBuildings",
  server: false, // Client-side fetching
  getCachedData(key) {
    return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
  },
});

// Computed: Filtered rows based on query
const filteredRows = computed(() => {
  if (!q.value) return buildings.value || [];
  return (buildings.value || []).filter((building) =>
    Object.entries(building).some(
      ([key, value]) => key !== "createdAt" && key !== "updatedAt" && String(value).toLowerCase().includes(q.value.toLowerCase())
    )
  );
});

// Methods
const select = (row: Building) => {
  selected.value = [row];
};

const editSelectedRecord = async (id: string) => {
  await navigateTo(`/buildings/${id}/edit`);
};

const deleteSelectedRecord = async () => {
  if (!selected.value.length) return;

  const id = selected.value[0].id;
  const confirmDelete = confirm("هل انت متأكد من حذف هذا العنصر؟");
  if (!confirmDelete) return;

  const { error } = await useFetch<any>(`/api/buildings/${id}`, { method: "DELETE", key: "deleteBuilding" });

  if (error.value) {
    toast.add({
      title: "خطأ",
      description: error.value.message || "حدث خطأ أثناء الحذف",
      color: "rose",
      timeout: 6000,
    });
    return;
  }

  toast.add({
    title: "نجاح",
    description: "تم حذف العنصر بنجاح",
    color: "primary",
    timeout: 1000,
  });
  refreshBuildings();
};
</script>

<template>
  <div id="building">
    <div v-if="useRoute().name === 'buildings'" class="parentWrapper">
      <!-- Action Buttons -->
      <div id="buttonWrapper" class="my-3">
        <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة بناية" :to="'/buildings/create'" />
        <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف بناية" @click="deleteSelectedRecord" :disabled="!selected.length" />
      </div>

      <!-- Search Filter -->
      <div id="filterWrapper" class="my-3">
        <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
      </div>

      <!-- Table -->
      <ClientOnly>
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable
            :rows="filteredRows"
            :columns="selectedColumns"
            v-model:selected="selected"
            v-model:expand="expand"
            @select="select"
            :loading="status === 'pending'"
          >
            <template #expand="{ row }">
              <div class="px-8 py-8">
                <BuildingDetails :building="row" />
              </div>
            </template>
            <template #name-data="{ row }">
              <span class="font-bold text-blue-500 dark:text-blue-400 underline cursor-pointer" @click="editSelectedRecord(row.id)">
                {{ row.name }}
              </span>
            </template>
          </UTable>
        </div>
      </ClientOnly>
    </div>
    <div class="childWrapper">
      <NuxtPage />
    </div>
  </div>
</template>
