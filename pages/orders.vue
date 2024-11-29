<script setup lang="ts">
// Dependencies
import type { Order } from "@prisma/client";

// Define Variables
const { data: orders } = await useAsyncData<Order[], any>("getOrders", () => $fetch<Order[]>("/api/orders"));
const toast = useToast();
const selected: Ref<Order[]> = ref([]);
const columns = [
  // { key: "id", label: "#", sortable: false },
  { key: "type", label: "نوع الطلب", sortable: true },
  { key: "date", label: "تاريخ الطلب", sortable: false },
  { key: "ownerName", label: "اسم صاحب الطلب", sortable: false },
  { key: "ownerNumber", label: "رقم صاحب الطلب", sortable: false },
  { key: "price", label: "السعر", sortable: true },
  { key: "status", label: "الحالة", sortable: true },
];
const expand = ref({
  openedRows: [],
  row: null,
});

// Define Methods
function select(row: Order) {
  selected.value.length = 0;
  selected.value.push(row);
}
const editSelectedRecord = async (id: string) => {
  await navigateTo("/orders/" + id + "/edit");
};
const deleteSelectedRecord = async () => {
  const id = selected.value[0].id;
  const response = confirm("هل انت متأكد من حذف هذا العنصر");
  if (response) {
    const { status, error } = await useAsyncData<void, any>("deleteOrder", () =>
      $fetch<void>("/api/orders/" + id, {
        method: "delete",
      })
    );

    if (status.value === "success") {
      refreshNuxtData("getOrders");
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
    return orders.value;
  }

  return orders.value!.filter((el) => {
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
const selectedColumns = ref([...columns]);
</script>

<template>
  <div id="order">
    <div class="parentWrapper" v-if="useRoute().name === 'orders'">
      <div id="orderTable">
        <div id="buttonWrapper" class="my-3">
          <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة طلب" :to="'/orders/create'" />
          <!-- <UButton icon="i-heroicons-eye-20-solid" label="تفاصيل" @click="viewSelectedRecord" /> -->
          <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف طلب" @click="deleteSelectedRecord" />
        </div>
        <div id="filterWrapper" class="my-3">
          <UInput class="w-1/6" v-model="q" placeholder="البحث ..." />
        </div>

        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable :rows="filteredRows" :columns="selectedColumns" @select="select" v-model="selected" v-model:expand="expand">
            <template #expand="{ row }">
              <div class="px-8">
                <div class="py-8">
                  {{ row }}
                  <!-- <OrderDetails :order="row" /> -->
                </div>
              </div>
            </template>
            <template #type-data="{ row }">
              <span :class="['font-bold text-blue-500 dark:text-blue-400 underline']" @click="editSelectedRecord(row.id)">
                {{ useGetPropertyTypeName(row.type) }}
              </span>
            </template>
            <template #status-data="{ row }">
              <span>
                {{ useGetStatusName(row.status) }}
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
