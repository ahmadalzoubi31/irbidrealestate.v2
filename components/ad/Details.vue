<script setup lang="ts">
// Define Dependencies
import { useDateFormat } from "@vueuse/core";
import type { ad } from "@prisma/client";

// Declare Props
const props = defineProps({
  ad: {
    type: Object,
    required: true,
  },
});

const isModalOpen = ref(false);
const selectedImage = ref("");
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
const extracted: ad = useExtractKeys(props.ad, keys);

// Declare Methods
const formatted = (date: Date) =>
  useDateFormat(date, "ddd YYYY-MM-DD hh:mm:ss A").value;
const openFile = async (fileName: string) => {
  selectedImage.value = await getImageUrl(fileName);
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
  selectedImage.value = "";
};
const imageKeys = computed(() =>
  props.ad.images.split(",").filter((i: string) => i !== "")
);

// Convert base64 to Blob and create URL
const base64ToBlobUrl = (base64: string, mimeType: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  return URL.createObjectURL(blob);
};

// Update getImageUrl method
const getImageUrl = async (key: string, download = false) => {
  const res = await $fetch<any>("/api/v2/files/" + key);

  const base64Data = res.body.split(",")[1]; // Extract base64 data
  const mimeType = res.mimeType; // Ensure the response contains the MIME type
  const url = base64ToBlobUrl(base64Data, mimeType);

  // if (download) {
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = key.split("/").pop() as string; // Use the file name from the key
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // } else {
  //   window.open(url, "_blank");
  // }

  return url;
};

// Create a computed property to fetch image URLs
const imageUrls = ref<string[]>([]);

watchEffect(async () => {
  imageUrls.value = await Promise.all(
    imageKeys.value.map((key: string) => getImageUrl(key, false))
  );
});
</script>

<template>
  <dl class="grid grid-cols-1 gap-2 sm:grid sm:grid-cols-4 sm:gap-4">
    <div v-for="(entry, key, index) in extracted">
      <dt class="font-medium">
        {{ heading[index] }}
      </dt>
      <dd
        v-if="key === 'createdAt' || key === 'updatedAt'"
        class="font-normal text-primary-500"
      >
        {{ formatted(entry as Date) }}
      </dd>
      <dd
        v-else-if="key == 'status'"
        :class="[entry ? 'text-primary-500' : 'text-red-500']"
        class="font-normal"
      >
        {{ useGetStatusName(entry as boolean) }}
      </dd>
      <dd
        v-else-if="key == 'propertyType'"
        class="font-normal text-primary-500"
      >
        {{ useGetPropertyTypeName(entry as number) }}
      </dd>
      <dd v-else class="font-normal text-primary-500">
        {{ entry == null || entry == "" ? "-" : entry }}
      </dd>
    </div>
    <div v-for="entry in props.ad.interestedPeople">
      <dt class="font-medium col-span-4">الاشخاص المهتمين بالاعلان</dt>
      <dd class="font-normal text-primary-500">
        {{ entry.name }} - {{ entry.number }}
      </dd>
    </div>
    <div class="col-span-4">
      <dt class="font-medium">ملفات الاعلان</dt>
      <dd class="font-normal text-primary-500">
        <div
          v-for="(url, index) in imageUrls"
          :key="index"
          class="relative inline-block"
        >
          <div>
            <!-- Render image -->
            <NuxtImg
              :src="url"
              alt="file"
              class="rounded-lg shadow-md h-[100px] w-[100px] hover:shadow-lg cursor-pointer mr-3"
              preload
              placeholder
              @click="openFile(imageKeys[index])"
            />
          </div>
        </div>
        <!-- Modal with Transition -->
        <transition name="fade">
          <div
            v-if="isModalOpen"
            class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <div
              class="bg-white rounded-lg p-4 max-w-[90%] max-h-[90%] relative"
            >
              <!-- Conditionally Render Image or Video -->
              <div>
                <img
                  :src="selectedImage"
                  alt="Selected Image"
                  class="max-h-full max-w-full rounded-lg"
                />
              </div>

              <!-- Close Button -->
              <UButton
                type="button"
                icon="i-heroicons-x-circle-20-solid"
                @click="closeModal"
                class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
              />
            </div>
          </div>
        </transition>
      </dd>
    </div>
  </dl>
</template>
