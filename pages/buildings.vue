<script setup lang="ts">
// Dependencies
import type { Building } from "@prisma/client";

// Define Variables
const { data: buildings, status } = await useLazyFetch("/api/buildings", { key: "getBuildings", server: false });
// console.log("🚀 ~ buildings:", toRaw(buildings.value));
const toast = useToast();
const selected: Ref<Building[]> = ref([]);
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
const expand = ref({
  openedRows: [],
  row: null,
});
const selectedColumns = ref([...columns]);

// Define Methods
function select(row: Building) {
  selected.value.length = 0;
  selected.value.push(row);
}
const editSelectedRecord = async (id: string) => {
  await navigateTo("/buildings/" + id + "/edit");
};
const deleteSelectedRecord = async () => {
  const id = selected.value[0].id;
  const response = confirm("هل انت متأكد من حذف هذا العنصر");
  if (response) {
    const { status, error } = await useAsyncData<void, any>("deleteBuilding", () =>
      $fetch<void>("/api/buildings/" + id, {
        method: "delete",
      })
    );

    if (status.value === "success") {
      refreshNuxtData("getBuildings");
      toast.add({
        title: "نجحت العملية",
        description: "تم حذف العنصر بنجاح",
        color: "primary",
        timeout: 1000,
      });
    }

    if (status.value === "error") {
      // console.log(error.value.data.message);

      toast.add({
        title: "لقد حدث خطأ ما",
        description: error.value.data.message,
        color: "rose",
        timeout: 6000,
      });
    }
  }
};

// Define Filter
const q = ref("");
</script>

<template>
  <div id="building">
    <div class="parentWrapper" v-if="useRoute().name === 'buildings'">
      <div id="buildingTable">
        <div id="buttonWrapper" class="my-3">
          <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة بناية" :to="'/buildings/create'" />
          <!-- <UButton icon="i-heroicons-eye-20-solid" label="تفاصيل" @click="viewSelectedRecord" /> -->
          <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف بناية" @click="deleteSelectedRecord" />
        </div>
        <div id="filterWrapper" class="my-3">
          <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
        </div>

        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable :rows="[]" :columns="selectedColumns" @select="select" v-model="selected" v-model:expand="expand" :loading="status === 'pending'">
            <template #expand="{ row }">
              <div class="px-8">
                <div class="py-8">
                  <!-- {{ row }} -->
                  <BuildingDetails :building="row" />
                </div>
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
    </div>
    <div class="childWrapper">
      <NuxtPage />
    </div>
  </div>
</template>
