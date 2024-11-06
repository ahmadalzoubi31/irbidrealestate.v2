<script setup>
// Dependencies
// import { useBuildingStore } from "#imports";

// Define Store
const _buildingStore = useBuildingStore();

// Define Variables
const isOpen = ref(false);
const selected = ref([]);
const columns = [
  // { key: "id", label: "#", sortable: false },
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

// Get data from the database
await _buildingStore.fetchBuildings();
const buildings = computed(() => _buildingStore.buildings);

// Define Methods
function select(row) {
  selected.value.length = 0;
  selected.value.push(row);
}
const editSelectedRecord = async (id) => {
  await navigateTo(`/buildings/${id}/edit`);
};
const deleteSelectedRecord = async () => {
  const id = selected.value[0].id;
  const response = confirm("هل انت متأكد من حذف هذا العنصر");
  if (response) {
    await _buildingStore.deleteBuilding(id);
  }
};
const viewSelectedRecord = async () => {
  const id = selected.value[0].id;
  isOpen.value = true;
  await navigateTo(`/buildings/${id}/view`);
};
const closeSlideOver = async () => {
  isOpen.value = false;
  await navigateTo("/buildings");
};

// Define Filter
const q = ref("");
const filteredRows = computed(() => {
  if (!q.value) {
    return buildings.value;
  }

  return buildings.value.filter((el) => {
    // to avoid search on them
    delete el.createdAt;
    delete el.createdBy;
    delete el.updatedAt;
    delete el.updatedBy;

    return Object.values(el).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});
</script>

<template>
  <div id="building">
    <div class="parentWrapper" v-if="useRoute().name === 'buildings' || useRoute().name === 'buildings-id-View'">
      <div id="buildingTable">
        <div id="buttonWrapper" class="my-3">
          <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة" :to="'/buildings/create'" />
          <UButton icon="i-heroicons-eye-20-solid" label="تفاصيل" @click="viewSelectedRecord" />
          <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف" @click="deleteSelectedRecord" />
        </div>
        <div id="filterWrapper" class="my-3">
          <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
        </div>

        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable :rows="filteredRows" :columns="selectedColumns" @select="select" v-model="selected">
            <!-- <template #expand="{ row }">
              <div class="p-4">
                <pre @click="viewSelectedRecord">
                  <NuxtPage />
                </pre>
              </div>
            </template> -->
            <template #name-data="{ row }">
              <span :class="['font-bold text-primary-500 dark:text-primary-400 underline']" @click="editSelectedRecord(row.id)">
                {{ row.name }}
              </span>
            </template>
          </UTable>
        </div>
      </div>
    </div>
    <div class="childWrapper">
      <div v-if="useRoute().name === 'buildings-id-View'">
        <USlideover v-model="isOpen">
          <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">معلومات البناية</h3>
                <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-x-mark-20-solid" class="-my-1" square padded @click="isOpen = false" />
              </div>
            </template>

            <NuxtPage />
          </UCard>
        </USlideover>
      </div>
      <NuxtPage v-else />
    </div>
  </div>
</template>
