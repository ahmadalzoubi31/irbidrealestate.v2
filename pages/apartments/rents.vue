<script setup lang="ts">
// Dependencies
const toast = useToast();
import useGetContractStatusName from "~/composable/useGetContractStatusName";
import { useDateFormat } from "@vueuse/core";
import type { Apartment } from "@prisma/client";

// Define Variables
const selected: Ref<Apartment[]> = ref([]);
const apartments: Ref<Apartment[]> = useState("apartments");
const columns = [
  { key: "buildingName", label: "اسم البناية", sortable: true },
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

// Define Methods
function select(row: Apartment) {
  selected.value.length = 0;
  selected.value.push(row);
}
const editSelectedRecord = async (id: string) => {
  await navigateTo("/apartments/rents/" + id + "/edit");
};
const deleteSelectedRecord = async () => {
  const id = selected.value[0].id;
  const response = confirm("هل انت متأكد من حذف هذا العنصر");
  if (response) {
    const { status, error } = await useAsyncData<void, any>("deleteApartment", () =>
      $fetch<void>("/api/apartments/" + id, {
        method: "delete",
      })
    );

    if (status.value === "success") {
      refreshNuxtData("getApartments");
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
const filteredRows: any = computed(() => {
  if (!q.value) {
    return apartments.value;
  }

  return apartments.value.filter((el) => {
    // to avoid search on them
    // @ts-ignore
    delete el.createdAt;
    // @ts-ignore
    delete el.createdBy;
    // @ts-ignore
    delete el.updatedAt;
    // @ts-ignore
    delete el.updatedBy;

    return Object.values(el).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

// Declare Methods
const formatted = (r: Date) => useDateFormat(r, "ddd YYYY-MM-DD hh:mm:ss A").value;
const expand = ref({
  openedRows: [],
  row: null,
});
</script>

<template>
  <div id="apartment">
    <div class="parentWrapper" v-if="useRoute().name === 'apartments-rents'">
      <div id="apartmentTable">
        <div id="buttonWrapper" class="my-3">
          <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة ايحار" :to="'/apartments/rents/create'" />
          <!-- <UButton icon="i-heroicons-eye-20-solid" label="تفاصيل" @click="viewSelectedRecord" /> -->
          <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف ايحار" @click="deleteSelectedRecord" />
        </div>
        <div id="filterWrapper" class="my-3">
          <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
        </div>

        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable :rows="filteredRows" :columns="selectedColumns" @select="select" v-model="selected" v-model:expand="expand">
            <template #expand="{ row }">
              <div class="px-8">
                <pre>
                  <!-- {{ row }} -->
                  <ApartmentDetails :apartment="row" />
                </pre>
              </div>
            </template>
            <template #apartmentNumber-data="{ row }">
              <span :class="['font-bold text-blue-500 dark:text-blue-400 underline']" @click="editSelectedRecord(row.id)">
                {{ row.apartmentNumber }}
              </span>
            </template>
            <template #rentDate-data="{ row }">
              <span>
                {{ formatted(row.rentDate) }}
              </span>
            </template>
            <template #rentStatus-data="{ row }">
              <span>
                {{ useGetContractStatusName(row.rentStatus) }}
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
