<script setup lang="ts">
// Define Dependencies
import { useDateFormat } from "@vueuse/core";
import type { Ad } from "@prisma/client";

// Declare Props
const props = defineProps({
  ad: {
    type: Object,
    required: true,
  },
});

// Helper to define headings and keys based on `ad.code`
const getConfig = (code: string) => {
  if (code.includes("LS") || code.includes("LR")) {
    return {
      heading: [
        "رقم الاعلان",
        "حالة العقار",
        "نوع العقار",
        "اسم صاحب العقار",
        "رقم صاحب العقار",
        "الرقم الوطني لصاحب العقار",
        "اسم وكيل العقار",
        "رقم وكيل العقار",
        "الرقم الوطني لوكيل العقار",
        "رابط الفيسبوك",
        "رابط الانستقرام",
        "المحافظة",
        "المديرية",
        "القرية",
        "الحوض",
        "رقم القطعة",
        "الحي",
        "تصنيف الارض",
        "الملاحظات",
        "الحالة",
        "تم الانشاء بواسطة",
        "تاريخ الانشاء",
        "تم التعديل بواسطة",
        "تاريخ التعديل",
      ],
      keys: [
        "code",
        "propertyStatus",
        "propertyType",
        "propertyOwnerName",
        "propertyOwnerNumber",
        "propertyOwnerIdentity",
        "propertyAgentName",
        "propertyAgentNumber",
        "propertyAgentIdentity",
        "facebookLink",
        "instagramLink",
        "governorate",
        "directorate",
        "village",
        "basin",
        "plot",
        "neighborhood",
        "classification",
        "notes",
        "status",
        "createdBy",
        "createdAt",
        "updatedBy",
        "updatedAt",
      ],
    };
  } else if (code.includes("ASI")) {
    return {
      heading: [
        "رقم الاعلان",
        "حالة العقار",
        "نوع العقار",
        "اسم صاحب العقار",
        "رقم صاحب العقار",
        "الرقم الوطني لصاحب العقار",
        "اسم وكيل العقار",
        "رقم وكيل العقار",
        "الرقم الوطني لوكيل العقار",
        "رابط الفيسبوك",
        "رابط الانستقرام",
        "المحافظة",
        "المديرية",
        "القرية",
        "الحوض",
        "رقم القطعة",
        "الحي",
        "رقم الشقة",
        "دخل الايجار المتوقع",
        "الملاحظات",
        "الحالة",
        "تم الانشاء بواسطة",
        "تاريخ الانشاء",
        "تم التعديل بواسطة",
        "تاريخ التعديل",
      ],
      keys: [
        "code",
        "propertyStatus",
        "propertyType",
        "propertyOwnerName",
        "propertyOwnerNumber",
        "propertyOwnerIdentity",
        "propertyAgentName",
        "propertyAgentNumber",
        "propertyAgentIdentity",
        "facebookLink",
        "instagramLink",
        "propertyLink",
        "governorate",
        "directorate",
        "village",
        "basin",
        "plot",
        "neighborhood",
        "apartmentNumber",
        "expectedRentAmount",
        "notes",
        "status",
        "createdBy",
        "createdAt",
        "updatedBy",
        "updatedAt",
      ],
    };
  } else {
    return {
      heading: [
        "رقم الاعلان",
        "حالة العقار",
        "نوع العقار",
        "اسم صاحب العقار",
        "رقم صاحب العقار",
        "الرقم الوطني لصاحب العقار",
        "اسم وكيل العقار",
        "رقم وكيل العقار",
        "الرقم الوطني لوكيل العقار",
        "رابط الفيسبوك",
        "رابط الانستقرام",
        "المحافظة",
        "المديرية",
        "القرية",
        "الحوض",
        "رقم القطعة",
        "الحي",
        "رقم الشقة",
        "الملاحظات",
        "الحالة",
        "تم الانشاء بواسطة",
        "تاريخ الانشاء",
        "تم التعديل بواسطة",
        "تاريخ التعديل",
      ],
      keys: [
        "code",
        "propertyStatus",
        "propertyType",
        "propertyOwnerName",
        "propertyOwnerNumber",
        "propertyOwnerIdentity",
        "propertyAgentName",
        "propertyAgentNumber",
        "propertyAgentIdentity",
        "facebookLink",
        "instagramLink",
        "governorate",
        "directorate",
        "village",
        "basin",
        "plot",
        "neighborhood",
        "apartmentNumber",
        "notes",
        "status",
        "createdBy",
        "createdAt",
        "updatedBy",
        "updatedAt",
      ],
    };
  }
};

// Extract heading and keys dynamically
const { heading, keys } = getConfig(props.ad.code);

// Extract the desired keys
const extracted: Ad = useExtractKeys(props.ad, keys);

// Declare Methods
const formatted = (date: Date) => useDateFormat(date, "ddd YYYY-MM-DD hh:mm:ss A").value;
</script>


<template>
  <dl class="sm:grid sm:grid-cols-4 sm:gap-2">
    <dt v-for="(entry, key, index) in extracted" class="font-medium ">
      {{ heading[index] }}
      <dd v-if="key === 'createdAt' || key === 'updatedAt'" class="font-normal text-primary-500">{{ formatted(entry as Date)}}</dd>
      <dd v-else-if="key == 'status'" :class="[entry ? 'text-primary-500' : 'text-red-500']" class="font-normal">{{ useGetStatusName(entry as boolean) }}</dd>
      <dd v-else class="font-normal text-primary-500">{{ entry == null ? "-" : entry }}</dd>
    </dt>
  </dl>
</template>

