<script lang="ts" setup>
// Import necessary dependencies
import { useDateFormat } from "@vueuse/core";
import type { apartment, apartmentRenterInfo, building } from "@prisma/client";

interface ApartmentWithRenterInfo extends apartment {
  building: building;
  renterInfo: apartmentRenterInfo[];
}

// Declare Props
const props = defineProps({
  apartment: {
    type: Object as PropType<ApartmentWithRenterInfo>,
    required: true,
  },
});

// Define table headers
const heading = [
  "اسم البناية",
  "رقم الشقة",
  "ترميز الشقة",
  "اسم الحوض",
  "رقم الحوض",
  "رقم قطعة الأرض",
  "اسم المالك",
  "رقم المالك",
  "اسم الوكيل",
  "رقم الوكيل",
  "رقم اشتراك الكهرباء",
  "رقم اشتراك الماء",
  "موقع العقار الفعلي",
  "هل الشقة مفروشة؟",
  "قيمة الإيجار",
  "تاريخ الإيجار",
  "مدة الإيجار",
  "طريقة دفع الإيجار",
  "هل الايجار شامل الخدمات ؟",
  "قيمة تأمين الشقة",
  "تأمين مع ؟",
  "نوع التأمين",
  "العمولة",
  "خصم الصيانة",
  "الخدمات",
  "حالة العقد",
  "الحالة",
  "تم الإنشاء بواسطة",
  "تاريخ الإنشاء",
  "تم التعديل بواسطة",
  "تاريخ التعديل",
];

// Define the keys you want to extract from the apartment object
const keysToExtract = [
  "building.name",
  "apartmentNumber",
  "code",
  "building.basinName",
  "building.basinNumber",
  "building.landNumber",
  "ownerName",
  "ownerNumber",
  "agentName",
  "agentNumber",
  "electricSub",
  "waterSub",
  "realLocation",
  "isFurniture",
  "rentAmount",
  "rentDate",
  "rentDuration",
  "rentPaymentWay",
  "isServiceIncluded",
  "insurance",
  "insuranceWithWho",
  "insuranceType",
  "commissionAmount",
  "building.maintenanceAmount",
  "building.serviceAmount",
  "rentStatus",
  "status",
  "createdBy",
  "createdAt",
  "updatedBy",
  "updatedAt",
];

// Extract the desired keys from the apartment object
const extracted: apartment = useExtractKeys(props.apartment, keysToExtract);

// Format date using the useDateFormat function
const formatted = (date: Date) =>
  useDateFormat(date, "ddd YYYY-MM-DD hh:mm:ss A").value;
</script>

<template>
  <dl class="grid grid-cols-1 gap-2 sm:grid sm:grid-cols-4 sm:gap-4">
    <template v-for="(entry, key, index) in extracted">
      <div>
        <dt class="font-medium">{{ heading[index] }}</dt>

        <!-- Handle formatted date fields -->
        <dd
          v-if="key === 'createdAt' || key === 'updatedAt'"
          class="font-normal text-primary-500"
        >
          {{ formatted(entry as Date) }}
        </dd>

        <!-- Handle formatted date fields -->
        <dd
          v-else-if="key === 'rentStatus'"
          class="font-normal text-primary-500"
        >
          {{ useGetContractStatusName(entry as number) }}
        </dd>

        <!-- Handle status field -->
        <dd
          v-else-if="key === 'status'"
          :class="['font-normal', entry ? 'text-primary-500' : 'text-red-500']"
        >
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
