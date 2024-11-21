<script setup>
// Define Dependencies
import { useDateFormat } from "@vueuse/core";

// Declare Variables
const heading = [
  "رقم المعرف",
  "اسم البناية",
  "عدد الشقق",
  "عدد المخازن (ان وجدت)",
  "اسم الحوض",
  "رقم الحوض",
  "رقم قطعة الارض",
  "رقم اشتراك الكهرباء",
  "قيمة الصيانة",
  "قيمة الخدمات",
  "عدد الشقق المسجلة",
  "تم الانشاء بواسطة",
  "تاريخ الانشاء",
  "تم التعديل بواسطة",
  "تاريخ التعديل",
  "الحالة",
];

// Declare Stores
const _buildingStore = useBuildingStore();
const selectedBuildingId = useRoute().params.id;

const building = _buildingStore.getBuildingById(selectedBuildingId);

// Declare Methods
const formatted = (r) => useDateFormat(r, 'ddd YYYY-MM-DD hh:mm:ss A').value;
const editSelectedRecord = async () => {
  await navigateTo(`/buildings/${selectedBuildingId}/edit`);
};
</script>

<template>
  <div>
    <UButton icon="i-heroicons-pencil-square-20-solid" label="تعديل البناية" @click="editSelectedRecord" />
    <div class="px-1 py-3">
    <dl class="sm:grid sm:grid-cols-2 sm:gap-6">
        <dt v-for="(entry, key, index) in building" class="font-medium ">
          {{ heading[index] }}
        <dd v-if="key === 'createdAt' || key === 'updatedAt'" class="font-normal text-primary-500">
          {{ formatted(entry) }}
        </dd>
        <dd v-else-if="key === 'status'" :class="[entry ? 'text-primary-500' : 'text-red-500']" class="font-normal">
          {{ useGetStatusName(entry) }}
        </dd>
        <dd v-else class="font-normal text-primary-500">{{ entry == null ? "-" : entry }}</dd>
        </dt>
      </dl>
    </div>
  </div>
</template>
