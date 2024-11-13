<script setup>
// Dependencies
const { data: buildings, refresh, status, error } = await useAsyncData("getBuildings", () => $fetch("/api/buildings"));
const toast = useToast();

// Define Variables
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

// Define Methods
function select(row) {
  selected.value.length = 0;
  selected.value.push(row);
}
const editSelectedRecord = async (id) => {
  await navigateTo("/buildings/" + id + "/edit");
};
const deleteSelectedRecord = async () => {
  const id = selected.value[0].id;
  const response = confirm("هل انت متأكد من حذف هذا العنصر");
  if (response) {
    const { data, refresh, status, error } = await useAsyncData("deleteBuilding", () =>
      $fetch("/api/buildings/" + id, {
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

const handleExpand = ({ openedRows, row }) => {
  // console.log("opened Rows:", openedRows);
  // console.log("Row Data:", row);
};

const expand = ref({
  openedRows: [],
  row: null,
});
</script>

<template>
  <div id="building">
    <div class="parentWrapper" v-if="useRoute().name === 'buildings'">
      <div id="buildingTable">
        <div id="buttonWrapper" class="my-3">
          <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة" :to="'/buildings/create'" />
          <!-- <UButton icon="i-heroicons-eye-20-solid" label="تفاصيل" @click="viewSelectedRecord" /> -->
          <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف" @click="deleteSelectedRecord" />
        </div>
        <div id="filterWrapper" class="my-3">
          <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
        </div>

        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable :rows="filteredRows" :columns="selectedColumns" @select="select" v-model="selected">
            <template #expand="{ row }">
              <div class="px-8">
                <pre>
                  <!-- {{ row }} -->
                  <BuildingDetails :building="row" />
                </pre>
              </div>
            </template>
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
      <NuxtPage />
    </div>
  </div>
</template>
