<script setup lang="ts">
// Define Dependencies
import { useDateFormat } from "@vueuse/core";
import type { Claim, ClaimCollection, ClaimDetail } from "@prisma/client";
import format from "date-fns/format";

// Declare interface
interface ClaimWithDetailsAndCollections extends Claim {
  claimDetails: ClaimDetail[];
  claimCollections: ClaimCollection[];
}

// Declare Props
const props = defineProps({
  claim: {
    type: Object as PropType<ClaimWithDetailsAndCollections>,
    required: true,
  },
});
// Declare Variables
const heading = [
  "رقم المطالبة",
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
  "claimNumber",
  "apartmentName",
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
const extracted: ClaimWithDetailsAndCollections = useExtractKeys(props.claim, keysToExtract);

// Declare Methods
const formatted = (r: Date) => useDateFormat(r, "ddd YYYY-MM-DD hh:mm:ss A").value;
</script>

<template>
  <dl class="grid grid-cols-1 gap-1 sm:grid sm:grid-cols-5 sm:gap-2">
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
  <dl class="grid grid-cols-1 gap-1 sm:grid sm:grid-cols-2 sm:gap-2">
    <div class="mt-2">
      <dt class="font-medium">تفاصيل المطالبة</dt>
      <!-- Handle claim details field -->
      <dd class="font-normal text-primary-500">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable
            :rows="props.claim.claimDetails as ClaimDetail[] || []"
            :columns="[
              { key: 'item', label: 'المادة' },
              { key: 'price', label: 'السعر' },
              { key: 'dateTime', label: 'الوقت والتاريخ' },
            ]"
          >
            <template #dateTime-data="{ row }">
              <span>{{ format(row.dateTime, "hh:mm:ss - dd/MM/yyy") }}</span>
            </template>
          </UTable>
        </div>
      </dd>
    </div>
  </dl>
  <dl class="grid grid-cols-1 gap-1 sm:grid sm:grid-cols-2 sm:gap-2">
    <div class="mt-2">
      <dt class="font-medium">تفاصيل التحصيل</dt>
      <!-- Handle claim collections field -->
      <dd class="font-normal text-primary-500">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
          <UTable
            :rows="props.claim.claimCollections as ClaimCollection[] || []"
            :columns="[
              { key: 'dateTime', label: 'الوقت والتاريخ' },
              { key: 'payment', label: 'الدفعة' },
              { key: 'notes', label: 'الملاحظات' },
            ]"
          >
            <template #dateTime-data="{ row }">
              <span>
                {{ format(row.dateTime, "dd/MM/yyyy hh:mm:ss") }}
              </span>
            </template>
          </UTable>
        </div>
      </dd>
    </div>
  </dl>
</template>
