<script setup lang="ts">
// Import necessary dependencies
import { useDateFormat } from "@vueuse/core";
import type { Building } from "@prisma/client";

// Declare Props
const props = defineProps({
  building: {
    type: Object as PropType<Building>,
    required: true,
  },
});

// Define table headers
const heading = [
  "اسم البناية",
  "عدد الشقق",
  "عدد المخازن ",
  "اسم الحوض",
  "رقم الحوض",
  "رقم قطعة الأرض",
  "رقم اشتراك الكهرباء",
  "قيمة الصيانة",
  "قيمة الخدمات",
  "عدد الشقق المسجلة",
  "الحالة",
  "تم الإنشاء بواسطة",
  "تاريخ الإنشاء",
  "تم التعديل بواسطة",
  "تاريخ التعديل",
];

// Define the keys you want to extract from the building object
const keysToExtract = [
  "name",
  "apartmentsCount",
  "storeCount",
  "basinName",
  "basinNumber",
  "landNumber",
  "electricBill",
  "serviceAmount",
  "maintenanceAmount",
  "registeredApartmentsCount",
  "status",
  "createdBy",
  "createdAt",
  "updatedBy",
  "updatedAt",
];

// Extract the desired keys from the building object
const extracted: Building = useExtractKeys(props.building, keysToExtract);

// Format date using the useDateFormat function
const formatted = (date: Date) => useDateFormat(date, "ddd YYYY-MM-DD hh:mm:ss A").value;
</script>

<template>
  <!-- Display the extracted information in a grid layout -->
  <dl class="grid grid-cols-1 gap-1 sm:grid sm:grid-cols-4 sm:gap-2">
    <template v-for="(entry, key, index) in extracted">
      <div>
        <dt class="font-medium">{{ heading[index] }}</dt>

        <!-- Handle formatted date fields -->
        <dd v-if="key === 'createdAt' || key === 'updatedAt'" class="font-normal text-primary-500">
          {{ formatted(entry as Date) }}
        </dd>

        <!-- Handle status field -->
        <dd v-else-if="key === 'status'" :class="['font-normal', entry ? 'text-primary-500' : 'text-red-500']">
          {{ useGetStatusName(entry as boolean) }}
        </dd>

        <!-- Handle other fields, including null or empty values -->
        <dd v-else class="font-normal text-primary-500">
          {{ entry == null || entry === "" ? "-" : entry }}
        </dd>
      </div>
    </template>
  </dl>
</template>
