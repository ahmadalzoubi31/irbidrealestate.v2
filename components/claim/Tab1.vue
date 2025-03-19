<script lang="ts" setup>
// Import necessary dependencies
import type { Claim } from "@prisma/client";
import { useDateFormat } from "@vueuse/core";

// Declare Props
const props = defineProps({
  claim: {
    type: Object as PropType<ClaimWithDetailsAndCollections>,
    required: true,
  },
});

// Define table headers
const heading = [
  "رقم المطالبة",
  "رقم الشقة",
  "المطلوب منه",
  "تاريخ المطالبة",
  "مجموع المبلغ",
  "مجموع الكلي للربح",
  "الحالة",
  "تم الانشاء بواسطة",
  "تاريخ الانشاء",
  "تم التعديل بواسطة",
  "تاريخ التعديل",
];

// Define the keys you want to extract from the claim object
const keysToExtract = [
  "claimNumber",
  "apartmentName",
  "claimFrom",
  "claimDate",
  "total",
  "profit",
  "claimStatus",
  "createdBy",
  "createdAt",
  "updatedBy",
  "updatedAt",
];

// Extract the desired keys from the building object
const extracted: Claim = useExtractKeys(props.claim, keysToExtract);

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
          v-if="
            key === 'createdAt' || key === 'updatedAt' || key === 'claimDate'
          "
          class="font-normal text-primary-500"
        >
          {{ formatted(entry as Date) }}
        </dd>

        <!-- Handle status field -->
        <dd
          v-else-if="key === 'claimStatus'"
          :class="['font-normal', entry ? 'text-primary-500' : 'text-red-500']"
        >
          {{ useGetClaimStatusName(entry as number) }}
        </dd>

        <!-- Handle total field -->
        <dd
          v-else-if="key === 'total' || key === 'profit'"
          class="font-normal text-primary-500"
        >
          {{ entry + " دينار" }}
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
