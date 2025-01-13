<script setup lang="ts">
// Define Dependencies
import { useDateFormat } from "@vueuse/core";
import type { Apartment } from "@prisma/client";

// Extend the Apartment type to include the files property
interface ApartmentWithFiles extends Apartment {
  files: { purpose: string; fileContent: { value: string } }[];
}

// Declare Props
const props = defineProps({
  apartment: {
    type: Object as PropType<ApartmentWithFiles>,
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
  "Building.name",
  "apartmentNumber",
  "Building.basinName",
  "Building.basinNumber",
  "Building.landNumber",
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
  "Building.maintenanceAmount",
  "Building.serviceAmount",
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
  <dl class="grid grid-cols-1 gap-1 sm:grid sm:grid-cols-4 sm:gap-2">
    <dt v-for="(entry, key, index) in extracted" class="font-medium">
      {{ heading[index] }}
    <dd v-if="key === 'createdAt' || key === 'updatedAt'" class="font-normal text-primary-500">
      {{ formatted(entry as Date) }}
    </dd>
    <dd v-else-if="key === 'rentStatus'" :class="[entry ? 'text-primary-500' : 'text-red-500']" class="font-normal">
      {{ useGetContractStatusName(entry as number) }}
    </dd>
    <dd v-else-if="key === 'status'" :class="[entry ? 'text-primary-500' : 'text-red-500']" class="font-normal">
      {{ useGetStatusName(entry as boolean) }}
    </dd>
    <dd v-else class="font-normal text-primary-500">{{ entry == null || entry == "" ? "-" : entry }}</dd>
    </dt>
    <dt class="font-medium">
      الملحقات
      <dd v-if="props.apartment.files.length > 0">
        <ul role="list" class="divide-y divide-gray-200 rounded-md border border-gray-200">
          <li v-for="file in props.apartment.files" class="flex items-center justify-between py-2 pl-3 pr-4 text-sm">
            <div v-if="file.purpose === 'contract'" class="flex w-0 flex-1 items-center">
              <span class="material-symbols-outlined h-5 w-5 flex-shrink-0 text-gray-400">attach_file</span>
              <span class="ml-2 w-0 flex-1 truncate">صورة العقد</span>
            </div>
            <div v-if="file.purpose === 'contract'" class="ml-4 flex-shrink-0">
              <a :href="file.fileContent.value" download class=" ml-3 font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer ">
                <UIcon name="i-heroicons-arrow-down-on-square-20-solid" class="h-5 w-5 flex-shrink-0  align-sub" />
                تنزيل
              </a>
              <a :href="file.fileContent.value" class="font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer">
                <UIcon name="i-heroicons-eye-20-solid" class="h-5 w-5 flex-shrink-0 align-sub" />
                مشاهدة
              </a>
            </div>
            <div v-if="file.purpose === 'furniture'" class="flex w-0 flex-1 items-center">
              <span class="material-symbols-outlined h-5 w-5 flex-shrink-0 text-gray-400">attach_file</span>
              <span class="ml-2 w-0 flex-1 truncate">صورة كشف الاثاث</span>
            </div>
            <div v-if="file.purpose === 'furniture'" class="ml-4 flex-shrink-0">
              <a :href="file.fileContent.value" download class=" ml-3 font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer ">
                <UIcon name="i-heroicons-arrow-down-on-square-20-solid" class="h-5 w-5 flex-shrink-0  align-sub" />
                تنزيل
              </a>
              <a :href="file.fileContent.value" class="font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer">
                <UIcon name="i-heroicons-eye-20-solid" class="h-5 w-5 flex-shrink-0 align-sub" />
                مشاهدة
              </a>
            </div>
            <div v-if="file.purpose === 'renter-identification'" class="flex w-0 flex-1 items-center">
              <span class="material-symbols-outlined h-5 w-5 flex-shrink-0 text-gray-400">attach_file</span>
              <span class="ml-2 w-0 flex-1 truncate">صورة الاثبات</span>
            </div>
            <div v-if="file.purpose === 'renter-identification'" class="ml-4 flex-shrink-0">
              <a :href="file.fileContent.value" download class=" ml-3 font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer ">
                <UIcon name="i-heroicons-arrow-down-on-square-20-solid" class="h-5 w-5 flex-shrink-0  align-sub" />
                تنزيل
              </a>
              <a :href="file.fileContent.value" class="font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer">
                <UIcon name="i-heroicons-eye-20-solid" class="h-5 w-5 flex-shrink-0 align-sub" />
                مشاهدة
              </a>
            </div>
            <div v-if="file.purpose === 'clearance'" class="flex w-0 flex-1 items-center">
              <span class="material-symbols-outlined h-5 w-5 flex-shrink-0 text-gray-400">attach_file</span>
              <span class="ml-2 w-0 flex-1 truncate">صورة المخالصة</span>
            </div>
            <div v-if="file.purpose === 'clearance'" class="ml-4 flex-shrink-0">
              <a :href="file.fileContent.value" download class=" ml-3 font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer ">
                <UIcon name="i-heroicons-arrow-down-on-square-20-solid" class="h-5 w-5 flex-shrink-0  align-sub" />
                تنزيل
              </a>
              <a :href="file.fileContent.value" class="font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer">
                <UIcon name="i-heroicons-eye-20-solid" class="h-5 w-5 flex-shrink-0 align-sub" />
                مشاهدة
              </a>
            </div>
            <div v-if="file.purpose === 'new-contract'" class="flex w-0 flex-1 items-center">
              <span class="material-symbols-outlined h-5 w-5 flex-shrink-0 text-gray-400">attach_file</span>
              <span class="ml-2 w-0 flex-1 truncate">صورة العقد الجديد</span>
            </div>
            <div v-if="file.purpose === 'new-contract'" class="ml-4 flex-shrink-0">
              <a :href="file.fileContent.value" download class=" ml-3 font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer ">
                <UIcon name="i-heroicons-arrow-down-on-square-20-solid" class="h-5 w-5 flex-shrink-0  align-sub" />
                تنزيل
              </a>
              <a :href="file.fileContent.value" class="font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer">
                <UIcon name="i-heroicons-eye-20-solid" class="h-5 w-5 flex-shrink-0 align-sub" />
                مشاهدة
              </a>
            </div>
          </li>
        </ul>
      </dd>
    </dt>

  </dl>
</template>
