<script setup>
// Define Dependencies
import useGetStatusName from "~/composable/useGetStatusName";
import { useDateFormat } from "@vueuse/core";

// Declare Props
const props = defineProps({
  apartment: {
    type: Object,
    required: true,
  },
});
// Declare Variables
const heading = [  "رقم المعرف",
  "اسم البناية",
  "رقم الشقة",
  "اسم الحوض ورقمه",
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

// Declare Methods
const formatted = (r) => useDateFormat(r, 'ddd YYYY-MM-DD hh:mm:ss A').value;


console.log(props.apartment);

</script>

<template>
    <dl class="sm:grid sm:grid-cols-4 sm:gap-2">
        <dt v-for="(entry, key, index) in props.apartment" class="font-medium ">
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
