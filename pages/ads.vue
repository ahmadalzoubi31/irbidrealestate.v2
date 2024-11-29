<script setup lang="ts">
// Dependencies
import type { Ad } from "@prisma/client";

// Define Variables
const { data: ads } = await useAsyncData<Ad[], any>("getAds", () => $fetch<Ad[]>("/api/ads"));
const toast = useToast();

const selected: Ref<Ad[]> = ref([]);
const columns = [
  { key: "code", label: "رقم الاعلان", sortable: false },
  { key: "propertyStatus", label: "حالة العقار", sortable: true },
  { key: "propertyType", label: "نوع العقار", sortable: true },
  { key: "propertyOwnerName", label: "اسم صاحب العقار", sortable: false },
  { key: "propertyOwnerNumber", label: "رقم صاحب العقار", sortable: false },
  { key: "facebookLink", label: "الفيسبوك", sortable: false },
  { key: "instagramLink", label: "الانتسقرام", sortable: false },
  { key: "propertyLocation", label: "موقع العقار", sortable: false },
  { key: "notes", label: "الملاحظات", sortable: false },
];
const selectedColumns = ref([...columns]);

// Define Methods
function select(row: Ad) {
  selected.value.length = 0;
  selected.value.push(row);
}
const editSelectedRecord = async (id: string) => {
  useLoadingIndicator().start();
  await navigateTo("/ads/" + id + "/edit");
};
const deleteSelectedRecord = async () => {
  const id = selected.value[0].id;
  const response = confirm("هل انت متأكد من حذف هذا العنصر");
  if (response) {
    useLoadingIndicator().start();
    const { status, error } = await useAsyncData<void, any>("deleteAd", () =>
      $fetch<void>("/api/ads/" + id, {
        method: "delete",
      })
    );

    if (status.value === "success") {
      refreshNuxtData("getAds");
      useLoadingIndicator().finish();
      toast.add({
        title: "نجحت العملية",
        description: "تم حذف العنصر بنجاح",
        color: "primary",
        timeout: 1000,
      });
    }

    if (status.value === "error") {
      // console.log(error.value.data.message);
      useLoadingIndicator().error.value = true;
      toast.add({
        title: "لقد حدث خطأ ما",
        description: error.value.data.message,
        color: "rose",
        timeout: 6000,
      });
    }
  }
};
const generateSharedLinkSelectedRecord = async () => {
  const id = selected.value[0].id;
  await navigateTo(`/ads/${id}/generate`);
};

// Define Filter
const q = ref("");
const filteredRows: any = computed(() => {
  if (!q.value) {
    return ads.value;
  }

  return ads.value!.filter((el) => {
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
  <div id="ad">
    <div class="parentWrapper" v-if="useRoute().name === 'ads'">
      <div id="adTable">
        <div id="buttonWrapper" class="my-3">
          <UButton icon="i-heroicons-plus-circle-20-solid" label="اضافة اعلان" :to="'/ads/create'" />
          <UButton icon="i-heroicons-minus-circle-20-solid" label="حذف اعلان" @click="deleteSelectedRecord" />
          <UButton icon="i-heroicons-arrow-right-on-rectangle-20-solid" label="انشاء رابط مشترك" @click="generateSharedLinkSelectedRecord" />
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
                  <AdDetails :ad="row" />
                </div>
              </div>
            </template>
            <template #code-data="{ row }">
              <span :class="['font-bold text-blue-500 dark:text-blue-400 underline']" @click="editSelectedRecord(row.id)">
                {{ row.code }}
              </span>
            </template>
            <template #propertyType-data="{ row }">
              <span>
                {{ useGetPropertyTypeName(row.propertyType) }}
              </span>
            </template>
            <template #facebookLink-data="{ row }">
              <span>
                <UButton
                  v-if="row.facebookLink"
                  :href="row.facebookLink"
                  icon="i-heroicons-link-20-solid"
                  class="text-blue-500 h-0 align-middle items-center"
                  variant="ghost"
                  size="sm"
                />
                <span v-else>-</span>
              </span>
            </template>
            <template #instagramLink-data="{ row }">
              <span>
                <UButton
                  v-if="row.instagramLink"
                  :to="row.instagramLink"
                  icon="i-heroicons-link-20-solid"
                  class="text-blue-500 h-0 align-middle items-center"
                  variant="ghost"
                  size="sm"
                />
                <span v-else>-</span>
              </span>
            </template>
            <template #propertyLocation-data="{ row }">
              <span>
                {{ row.governorate + " - " + row.village }}
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
