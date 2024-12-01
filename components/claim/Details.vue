<script setup lang="ts">
// Define Dependencies
import { useDateFormat } from "@vueuse/core";
import type { Claim } from "@prisma/client";

// Declare Props
const props = defineProps({
  claim: {
    type: Object,
    required: true,
  },
});
// Declare Variables
const heading = [
 "رقم الشقة",
   "المطلوب منه",
   "تاريخ المطالبة",
   "مجموع المبلغ",
  "الحالة",
  "تم الانشاء بواسطة",
  "تاريخ الانشاء",
  "تم التعديل بواسطة",
  "تاريخ التعديل",
];

// Specify the keys you want to extract
const keysToExtract = [
  "apartment.apartmentNumber",
  "claimFrom",  
  "claimDate",
  "total",
"status",
"createdBy",
"createdAt",
"updatedBy",
"updatedAt",
];

// Extract the desired keys
const extracted: Claim = useExtractKeys(props.claim, keysToExtract);


// Declare Methods
const formatted = (r: Date) => useDateFormat(r, 'ddd YYYY-MM-DD hh:mm:ss A').value;
</script>


<template>
    <dl class="sm:grid sm:grid-cols-4 sm:gap-2">
        <dt v-for="(entry, key, index) in extracted" class="font-medium ">
          {{ heading[index] }}
        <dd v-if="key === 'createdAt' || key === 'updatedAt' || key === 'claimDate'" class="font-normal text-primary-500">
          {{ formatted(entry as Date) }}
        </dd>
        <dd v-else-if="key === 'status'" :class="[entry ? 'text-primary-500' : 'text-red-500']" class="font-normal">
          {{ useGetStatusName(entry as boolean) }}
        </dd>
        <dd v-else class="font-normal text-primary-500">{{ entry == null  || entry == "" ? "-" : entry }}</dd>
        </dt>
      </dl>
</template>