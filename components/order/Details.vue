<script setup lang="ts">
// Define Dependencies
import { useDateFormat } from "@vueuse/core";
import type { Order } from "@prisma/client";

// Declare Props
const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});
// Declare Variables
const heading = [
 "نوع الطلب",
   "تاريخ الطلب",
   "اسم صاحب الطلب",
   "رقم صاحب الطلب",
   "تفاصيل الطلب",
   "السعر",
   "الخطوة الاولى",
   "الملاحظات",
  "الحالة",
  "تم الانشاء بواسطة",
  "تاريخ الانشاء",
  "تم التعديل بواسطة",
  "تاريخ التعديل",
];

// Specify the keys you want to extract
const keysToExtract = [
  "type",   
  "date",  
  "ownerName",
  "ownerNumber",
  "details",
  "price",
  "firstStep",  
  "notes",  
"status",
"createdBy",
"createdAt",
"updatedBy",
"updatedAt"
];

// Extract the desired keys
const extracted: Order = useExtractKeys(props.order, keysToExtract);


// Declare Methods
const formatted = (r: Date) => useDateFormat(r, 'ddd YYYY-MM-DD hh:mm:ss A').value;
</script>


<template>
    <dl class="grid grid-cols-1 gap-1 sm:grid sm:grid-cols-4 sm:gap-2">
        <dt v-for="(entry, key, index) in extracted" class="font-medium ">
          {{ heading[index] }}
        <dd v-if="key === 'createdAt' || key === 'updatedAt' || key === 'date'" class="font-normal text-primary-500">
          {{ formatted(entry as Date) }}
        </dd>
        <dd v-else-if="key == 'type'" class="font-normal text-primary-500">{{ useGetPropertyTypeName(entry as number) }}</dd>
        <dd v-else-if="key === 'status'" :class="[entry ? 'text-primary-500' : 'text-red-500']" class="font-normal">
          {{ useGetStatusName(entry as boolean) }}
        </dd>
        <dd v-else class="font-normal text-primary-500">{{ entry == null  || entry == "" ? "-" : entry }}</dd>
        </dt>
      </dl>
</template>