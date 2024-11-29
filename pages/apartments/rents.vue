<script setup lang="ts">
import type { Apartment } from "@prisma/client";
import format from "date-fns/format";

const { data: apartments } = await useAsyncData<Apartment[], any>("getApartments", () => $fetch<Apartment[]>("/api/apartments"));
const toast = useToast();
const isBrokenModalOpen: Ref<boolean> = useState("isBrokenModalOpen", () => false);
const isExpiredModalOpen: Ref<boolean> = useState("isExpiredModalOpen", () => false);
const isRenewedModalOpen: Ref<boolean> = useState("isExpiredModalOpen", () => false);

// Define Variables
const selected: Ref<Apartment[]> = ref([]);

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
  {
    key: "actions",
  },
];
const items = (row: { id: string }) => [
  [
    {
      label: "تعديل",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => editSelectedRecord(row.id),
    },
  ],
  [
    {
      label: "فسخ",
      icon: "i-heroicons-document-duplicate-20-solid",
      click: () => (isBrokenModalOpen.value = !isBrokenModalOpen.value),
    },
    {
      label: "انهاء",
      icon: "i-heroicons-archive-box-20-solid",
      click: () => (isExpiredModalOpen.value = !isExpiredModalOpen.value),
    },
    {
      label: "تجديد",
      icon: "i-heroicons-arrow-right-circle-20-solid",
      click: () => (isRenewedModalOpen.value = !isRenewedModalOpen.value),
    },
  ],
  [
    {
      label: "مسح",
      icon: "i-heroicons-trash-20-solid",
      click: () => deleteSelectedRecord(),
    },
  ],
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

  return apartments.value!.filter((el) => {
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
const expand = ref({
  openedRows: [],
  row: null,
});
</script>

<template>
  <div id="apartment">
    <div id="modal">
      <ClientOnly>
        <ApartmentBrokenModal />
        <ApartmentExpiredModal />
        <ApartmentRenewedModal />
      </ClientOnly>
    </div>
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
                <div class="py-8">
                  <!-- {{ row }} -->
                  <ApartmentDetails :apartment="row" />
                </div>
              </div>
            </template>
            <template #apartmentNumber-data="{ row }">
              <span :class="['font-bold text-blue-500 dark:text-blue-400 underline']" @click="editSelectedRecord(row.id)">
                {{ row.apartmentNumber }}
              </span>
            </template>
            <template #rentDate-data="{ row }">
              <span>
                {{ format(row.rentDate, "dd/MM/yyyy") }}
              </span>
            </template>
            <template #rentStatus-data="{ row }">
              <span>
                {{ useGetContractStatusName(row.rentStatus) }}
              </span>
            </template>
            <template #actions-data="{ row }">
              <UDropdown :items="items(row)" class="align-middle">
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" class="h-0" />
              </UDropdown>
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
