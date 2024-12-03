<script setup lang="ts">
import type { Ad } from "@prisma/client";

definePageMeta({
  layout: "generate",
});

// *** Navigation and Validation ***
onBeforeMount(() => {
  const paramId: number = Number(useRoute().params.id);
  if (isNaN(paramId)) {
    console.warn("Invalid ID:", paramId);
    navigateTo("/ads");
  }
});

// *** Fetch Data ***
const selectedPaymentId = useRoute().params.id as string;
const { data: ad } = await useAsyncData<Ad, any>("getOneAd", () => $fetch<Ad>(`/api/ads/${selectedPaymentId}`));

debugger;
console.log("🚀 ~ ad:", ad.value);

// *** Computed Properties ***
// const imageList = computed(() => ad.value?.files.filter((el: { name: string | string[] }) => !el.name.includes("mp4")) || []);
// const videoList = computed(() => ad.value?.files.filter((el: { name: string | string[] }) => el.name.includes("mp4")) || []);

// *** Config Generator ***
const getConfig = (code: string) => {
  const baseConfig = {
    heading: [
      "رقم الاعلان",
      "حالة العقار",
      "نوع العقار",
      "رابط الفيسبوك",
      "رابط الانستقرام",
      "المحافظة",
      "المديرية",
      "القرية",
      "الحوض",
      "رقم القطعة",
      "الحي",
    ],
    keys: [
      "code",
      "propertyStatus",
      "propertyType",
      "facebookLink",
      "instagramLink",
      "governorate",
      "directorate",
      "village",
      "basin",
      "plot",
      "neighborhood",
    ],
  };

  if (code.includes("LS") || code.includes("LR")) {
    return {
      ...baseConfig,
      heading: [...baseConfig.heading, "تصنيف الارض", "الملاحظات"],
      keys: [...baseConfig.keys, "classification", "notes"],
    };
  }

  if (code.includes("ASI")) {
    return {
      ...baseConfig,
      heading: [...baseConfig.heading, "رقم الشقة", "دخل الايجار المتوقع", "الملاحظات"],
      keys: [...baseConfig.keys, "apartmentNumber", "expectedRentAmount", "notes"],
    };
  }

  return {
    ...baseConfig,
    heading: [...baseConfig.heading, "رقم الشقة", "الملاحظات"],
    keys: [...baseConfig.keys, "apartmentNumber", "notes"],
  };
};

// *** Dynamic Config ***
const { heading, keys } = computed(() => getConfig(ad.value?.code || "")).value;

const extracted = computed(() => (ad.value ? useExtractKeys(ad.value, keys) : {}));
</script>

<template>
  <div></div>
</template>
