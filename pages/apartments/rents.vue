<script setup>
// Dependencies
// import { useApartmentStore } from "#imports";

// Define Store
const { data: apartments, refresh, status, error } = await useAsyncData("getApartments", () => $fetch("/api/apartments"));
const toast = useToast();

// Define Variables
const isOpen = ref(false);
const selected = ref([]);
const columns = [
  // { key: "id", label: "#", sortable: false },
  { key: "name", label: "اسم البناية", sortable: true },
  { key: "apartmentNumber", label: "رقم الشقة", sortable: false },
  { key: "ownerName", label: "اسم المالك", sortable: false },
  { key: "ownerNumber", label: "رقم المالك", sortable: true },
  { key: "renterName", label: "اسم المستأجر", sortable: true },
  { key: "renterNumber", label: "رقم المستأجر", sortable: true },
  { key: "rentAmount", label: "قيمة الإيجار", sortable: false },
  { key: "rentDuration", label: "مدة الإيجار", sortable: false },
  { key: "rentPaymentWay", label: "طريقة دفع الإيجار", sortable: false },
  { key: "rentDate", label: "تاريخ الإيجار", sortable: false },
  { key: "rentStatus", label: "حالة العقد", sortable: false },
];
const selectedColumns = ref([...columns]);

// Get data from the database
// await _apartmentStore.fetchApartments();
// const apartments = computed(() => _apartmentStore.apartments);

// Define Methods
function select(row) {
  selected.value.length = 0;
  selected.value.push(row);
}
const editSelectedRecord = async (id) => {
  await navigateTo(`/apartments/${id}/edit`);
};
const deleteSelectedRecord = async () => {
  const id = selected.value[0].id;
  const response = confirm("هل انت متأكد من حذف هذا العنصر");
  if (response) {
    const { data, refresh, status, error } = await useAsyncData("deleteApartment", () =>
      $fetch("/api/apartments/" + id, {
        method: "delete",
      })
    );
  }
};

// Define Filter
const q = ref("");
const filteredRows = computed(() => {
  if (!q.value) {
    return apartments.value;
  }

  return apartments.value.filter((el) => {
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
  <div id="apartment">
    <div class="parentWrapper" v-if="useRoute().name === 'apartments-rents' || useRoute().name === 'apartments-rents-id-View'">
      <div id="apartmentTable">
        <div id="buttonWrapper" class="my-3">
          <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة" :to="'/apartments/rents/create'" />
          <!-- <UButton icon="i-heroicons-eye-20-solid" label="تفاصيل" @click="viewSelectedRecord" /> -->
          <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف" @click="deleteSelectedRecord" />
        </div>
        <div id="filterWrapper" class="my-3">
          <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
        </div>

        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable :rows="filteredRows" :columns="selectedColumns" @select="select" v-model="selected">
            <template #expand="{ row }">
              <div class="p-4">
                <pre>{{ row }}</pre>
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
