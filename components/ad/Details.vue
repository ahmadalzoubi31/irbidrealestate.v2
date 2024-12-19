<script setup lang="ts">
// Define Dependencies
import {useDateFormat} from "@vueuse/core";
import type {Ad} from "@prisma/client";

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
const {heading, keys} = getConfig(props.ad.code);

// Extract the desired keys
const extracted: Ad = useExtractKeys(props.ad, keys);

// Declare Methods
const formatted = (date: Date) => useDateFormat(date, "ddd YYYY-MM-DD hh:mm:ss A").value;
const openFile = (fileName: string) => {
  selectedImage.value = `/upload/files/ads/${props.ad.id}/${fileName}`;
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
  selectedImage.value = "";
};

</script>

<template>
  <dl class="sm:grid sm:grid-cols-4 sm:gap-2">
    <template v-for="(entry, key, index) in extracted">
      <dt class="font-medium ">
        {{ heading[index] }}
      </dt>
      <dd v-if="key === 'createdAt' || key === 'updatedAt'" class="font-normal text-primary-500">{{
          formatted(entry as Date)
        }}
      </dd>
      <dd v-else-if="key == 'status'" :class="[entry ? 'text-primary-500' : 'text-red-500']" class="font-normal">{{
          useGetStatusName(entry as boolean)
        }}
      </dd>
      <dd v-else-if="key == 'propertyType'" class="font-normal text-primary-500">{{
          useGetPropertyTypeName(entry as number)
        }}
      </dd>
      <dd v-else class="font-normal text-primary-500">{{ entry == null || entry == "" ? "-" : entry }}</dd>
    </template>
    <template v-for="(entry) in ad.interestedPeople">
      <dt class="font-medium col-span-4">
        الاشخاص المهتمين بالاعلان
      </dt>
      <dd class="font-normal text-primary-500">
        {{ entry.name }} - {{ entry.number }}
      </dd>
    </template>
    <template class="col-span-4">
      <dt class="font-medium">
        ملفات الاعلان
      </dt>
      <dd class="font-normal text-primary-500">
        <div
            v-for="(el, index) in ad.files"
            :key="index"
            class="relative inline-block"
        >
          <template v-if="el.name.endsWith('.mp4')">
            <!-- Render video thumbnail (optional) -->
            <video
                :class="el.status ? 'opacity-100' : 'opacity-25'"
                :src="`/upload/files/ads/${ad?.id}/${el.name}`"
                class="rounded-lg shadow-md h-[100px] w-[100px] hover:shadow-lg mr-3"
                preload="metadata"
                @click="openFile(el.name)"
            />
            <div class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-lg mr-3"
                 @click="openFile(el.name)"
            >
              <icon name="i-heroicons-play-circle-20-solid" class="text-white text-5xl cursor-pointer"></icon>
            </div>
          </template>
          <template v-else>
            <!-- Render image -->
            <NuxtImg
                :class="el.status ? 'opacity-100' : 'opacity-25'"
                :src="`/upload/files/ads/${ad?.id}/${el.name}`"
                alt="file"
                class="rounded-lg shadow-md h-[100px] w-[100px] hover:shadow-lg cursor-pointer mr-3"
                preload
                placeholder
                @click="openFile(el.name)"
            />
          </template>
        </div>
        <!-- Modal with Transition -->
        <transition name="fade">
          <div
              v-if="isModalOpen"
              class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <div class="bg-white rounded-lg p-4 max-w-[90%] max-h-[90%] relative">
              <!-- Conditionally Render Image or Video -->
              <template v-if="selectedImage.endsWith('.mp4')">
                <video
                    :src="selectedImage"
                    controls
                    autoplay
                    class="max-h-full max-w-full rounded-lg"
                />
              </template>
              <template v-else>
                <img :src="selectedImage" alt="Selected Image" class="max-h-full max-w-full rounded-lg"/>
              </template>

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
    </template>
  </dl>
</template>
