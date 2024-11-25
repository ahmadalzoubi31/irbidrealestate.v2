<script setup lang="ts">
// Dependencies
import type { Apartment } from "@prisma/client";
import format from "date-fns/format";


const { data: payments } = await useAsyncData<Apartment[], any>("getPayments", () => $fetch<Apartment[]>("/api/apartments/payments"));
const toast = useToast();

// Define Variables
const selected: Ref<Apartment[]> = ref([]);
const columns = [
  // { key: "id", label: "#", sortable: false },
  { key: "apartment.buildingName", label: "اسم البناية", sortable: true },
  { key: "apartment.apartmentNumber", label: "رقم الشقة", sortable: false },
  { key: "apartment.rentDate", label: "تاريخ الإيجار", sortable: false },
  { key: "apartment.rentAmount", label: "قيمة الإيجار", sortable: false },
  // { key: "apartment.commissionAmount", label: "العمولة", sortable: false },
  // { key: "apartment.building.serviceAmount", label: "الصيانة", sortable: false },
  // { key: "apartment.building.maintenanceAmount", label: "الخدمات", sortable: false },
  { key: "receivedPaymentDate", label: "تاريخ الدفعة المستلمة", sortable: false },
  // { key: "nextRentDate", label: "تاريخ الدفعة القادمة", sortable: false },
  { key: "depositAmount", label: "صافي الايداع", sortable: false },
  { key: "depositDate", label: "تاريخ الايداع", sortable: false },
  { key: "notes", label: "ملاحظات", sortable: false },
];

const selectedColumns = ref([...columns]);

// Define Methods
function select(row: Apartment) {
  selected.value.length = 0;
  selected.value.push(row);
}
const editSelectedRecord = async (id: string) => {
  await navigateTo("/payments/" + id + "/edit");
};
const deleteSelectedRecord = async () => {
  const id = selected.value[0].id;
  const response = confirm("هل انت متأكد من حذف هذا العنصر");
  if (response) {
    const { status, error } = await useAsyncData<void, any>("deletePayment", () =>
      $fetch<void>("/api/apartments/payments/" + id, {
        method: "delete",
      })
    );

    if (status.value === "success") {
      refreshNuxtData("getPayments");
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
    return payments.value;
  }

  return payments.value!.filter((el) => {
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

const expand = ref({
  openedRows: [],
  row: null,
});
</script>

<template>
  <div id="payment">
    <div class="parentWrapper" v-if="useRoute().name === 'apartments-payments'">
      <div id="paymentTable">
        <div id="buttonWrapper" class="my-3">
          <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة دفعة" :to="'/apartments/payments/create'" />
          <!-- <UButton icon="i-heroicons-eye-20-solid" label="تفاصيل" @click="viewSelectedRecord" /> -->
          <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف دفعة" @click="deleteSelectedRecord" />
        </div>
        <div id="filterWrapper" class="my-3">
          <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
        </div>

        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable :rows="filteredRows" :columns="selectedColumns" @select="select" v-model="selected" v-model:expand="expand">
            <template #expand="{ row }">
              <div class="px-8">
                <pre>
                  {{ row }}
                  <!-- <PaymentDetails :payment="row" /> -->
                </pre>
              </div>
            </template>
            <template #receivedPaymentDate-data="{ row }">
              <span>
                {{ format(row.receivedPaymentDate, "dd/MM/yyyy") }}
              </span>
            </template>
            <template #apartment.rentDate-data="{ row }">
              <span>
                {{ format(row.apartment.rentDate, "dd/MM/yyyy") }}
              </span>
            </template>
            <template #nextRentDate-data="{ row }">
              <span>
                {{ format(row.nextRentDate, "dd/MM/yyyy") }}
              </span>
            </template>
            <template #depositDate-data="{ row }">
              <span>
                {{ format(row.depositDate, "dd/MM/yyyy") }}
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
