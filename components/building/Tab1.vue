<script lang="ts" setup>
// Import necessary dependencies
import { useDateFormat } from "@vueuse/core";
import type { Building, BuildingFlat } from "@prisma/client";

// Declare Props
const props = defineProps({
  building: {
    type: Object as PropType<BuildingWithFlats>,
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
  "يتم دفع الصيانة بواسطة؟",
  "مدة الصيانة",
  "قيمة الخدمات",
  "يتم دفع الخدمات بواسطة؟",
  "مدة الخدمات",
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
  "servicePaidBy",
  "serviceTerm",
  "maintenanceAmount",
  "maintenancePaidBy",
  "maintenanceTerm",
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

<style></style>
