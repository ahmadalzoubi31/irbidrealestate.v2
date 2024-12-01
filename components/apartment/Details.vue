<script setup lang="ts">
// Define Dependencies
import { useDateFormat } from "@vueuse/core";
import type { Apartment } from "@prisma/client";

// Declare Props
const props = defineProps({
  apartment: {
    type: Object,
    required: true,
  },
});
// Declare Variables
const heading = [  
  "اسم البناية",
  "رقم الشقة",
  "اسم الحوض",
  "رقم الحوض",
  "رقم قطعة الأرض",
  "اسم المالك",
  "رقم المالك",
  "اسم الوكيل",
  "رقم الوكيل",
  'موقع العقار الفعلي',
  "رقم اشتراك الكهرباء",
  "رقم اشتراك الماء",
  "اسم المستأجر",
  "رقم المستأجر",
  "مدة الإيجار",
  "قيمة الإيجار",
  "تاريخ الإيجار",
  "طريقة دفع الإيجار",
  "هل الشقة مفروشة؟",
  "حالة العقد",
  "الجنسية",
  "رقم الاثبات",
  "هل الايجار شامل الخدمات ؟",
  "قيمة تأمين الشقة",
  "العمولة",
  "خصم الصيانة",
  "الخدمات",
  "الحالة",
  "تم الانشاء بواسطة",
  "تاريخ الانشاء",
  "تم التعديل بواسطة",
  "تاريخ التعديل"
]

// Specify the keys you want to extract
const keysToExtract = [
"buildingName",
"apartmentNumber",
"building.basinName",
"building.basinNumber",
"building.landNumber",
"ownerName",
"ownerNumber",
"agentName",
"agentNumber",
"realLocation",
"electricSub",
"waterSub",
"renterName",
"renterNumber",
"rentDuration",
"rentAmount",
"rentDate",
"rentPaymentWay",
"isFurniture",
"rentStatus",
"renterNationality",
"renterIdentification",
"isServiceIncluded",
"insurance",
"commissionAmount",
"building.maintenanceAmount",
"building.serviceAmount",
"status",
"createdBy",
"createdAt",
"updatedBy",
"updatedAt",
];

// Extract the desired keys
const extracted: Apartment = useExtractKeys(props.apartment, keysToExtract);


// Declare Methods
const formatted = (r: Date) => useDateFormat(r, 'ddd YYYY-MM-DD hh:mm:ss A').value;



</script>

<template>
    <dl class="sm:grid sm:grid-cols-4 sm:gap-2">
        <dt v-for="(entry, key, index) in extracted" class="font-medium ">
          {{ heading[index] }}
        <dd v-if="key === 'createdAt' || key === 'updatedAt'" class="font-normal text-primary-500">
          {{ formatted(entry as Date) }}
        </dd>
        <dd v-else-if="key === 'status'" :class="[entry ? 'text-primary-500' : 'text-red-500']" class="font-normal">
          {{ useGetStatusName(entry as boolean) }}
        </dd>
        <dd v-else class="font-normal text-primary-500">{{ entry == null  || entry == "" ? "-" : entry }}</dd>
        </dt>
      </dl>
</template>
