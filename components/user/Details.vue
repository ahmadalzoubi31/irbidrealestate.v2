<script setup lang="ts">
// Define Dependencies
import { useDateFormat } from "@vueuse/core";
import type { user } from "@prisma/client";

// Declare Props
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});
// Declare Variables
const heading = [  
 "الاسم الاول",
 "الاسم الثاني",
 "اسم المعرف",
 "الصلاحيات",
  "الحالة",
  "تم الانشاء بواسطة",
  "تاريخ الانشاء",
  "تم التعديل بواسطة",
  "تاريخ التعديل"
]

// Specify the keys you want to extract
const keysToExtract = [
"firstName",
"lastName",
"username",
"role",
"status",
"createdBy",
"createdAt",
"updatedBy",
"updatedAt",
];
        
// Extract the desired keys
const extracted: user = useExtractKeys(props.user, keysToExtract);

// Declare Methods
const formatted = (r: Date) => useDateFormat(r, 'ddd YYYY-MM-DD hh:mm:ss A').value;

</script>

<template>
   <dl class="grid grid-cols-1 gap-2 sm:grid sm:grid-cols-4 sm:gap-4">
        <dt v-for="(entry, key, index) in extracted" class="font-medium ">
          {{ heading[index] }}
        <dd v-if="key === 'createdAt' || key === 'updatedAt'" class="font-normal text-primary-500">
          {{ formatted(entry as Date) }}
        </dd>
        <dd v-else-if="key === 'role'" class="font-normal text-primary-500">
          {{ entry == "admin" ? "مدير" : "مستخدم" }}
        </dd>
        <dd v-else-if="key === 'status'" :class="[entry ? 'text-primary-500' : 'text-red-500']" class="font-normal">
          {{ useGetStatusName(entry as boolean) }}
        </dd>
        <dd v-else class="font-normal text-primary-500">{{ entry == null  || entry == "" ? "-" : entry }}</dd>
        </dt>
    </dl>
</template>
