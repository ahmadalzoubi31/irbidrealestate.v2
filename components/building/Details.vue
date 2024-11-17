<script setup lang="ts">
// Define Dependencies
import useGetStatusName from "~/composable/useGetStatusName";
import { useDateFormat } from "@vueuse/core";

// Declare Props
const props = defineProps({
  building: {
    type: Object,
    required: true,
  },
});
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
  "الحالة",
  "تم الانشاء بواسطة",
  "تاريخ الانشاء",
  "تم التعديل بواسطة",
  "تاريخ التعديل",
];
// Declare Methods
const formatted = (r: Date) => useDateFormat(r, 'ddd YYYY-MM-DD hh:mm:ss A').value;
</script>


<template>
    <dl class="sm:grid sm:grid-cols-4 sm:gap-2">
        <dt v-for="(entry, key, index) in props.building" class="font-medium ">
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
</template>