<script setup lang="ts">
// Define Dependencies
import { useDateFormat } from "@vueuse/core";
import type { Payment } from "@prisma/client";

// Declare Props
const props = defineProps({
  payment: {
    type: Object as PropType<Payment>,
    required: true,
  },
});
// Declare Variables
const heading = [  
  "اسم البناية",
  "رقم الشقة",
  "تاريخ الإيجار",
  "قيمة الإيجار",
  "تاريخ الدفعة المستلمة",
  "صافي الايداع",
  "تاريخ الايداع",
  "ملاحظات",
  "الحالة",
  "تم الانشاء بواسطة",
  "تاريخ الانشاء",
  "تم التعديل بواسطة",
  "تاريخ التعديل"
]

// Specify the keys you want to extract
const keysToExtract = [
"Apartment.Building.name",
"Apartment.apartmentNumber",
"Apartment.rentDate",
"Apartment.rentAmount",
"receivedPaymentDate",
"depositAmount",
"depositDate",
"notes",
"status",
"createdBy",
"createdAt",
"updatedBy",
"updatedAt",
];
        
// Extract the desired keys
const extracted: Payment = useExtractKeys(props.payment, keysToExtract);

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
