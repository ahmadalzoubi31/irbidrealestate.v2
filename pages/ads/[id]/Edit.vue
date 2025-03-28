<script setup lang="ts">
import type { ad } from "@prisma/client";

const { getOneAd, editAd } = useAdActions();
const route = useRoute();

// Extract route parameter
const selectedAdId = ref(route.params.id as string);

const { data: ad, status } = await getOneAd(selectedAdId.value);

const isModalOpen = ref(false);
const selectedImage = ref("");
const interestedPersonName = ref("");
const interestedPersonNumber = ref("");
const { handleFileInput, files } = useFileStorage({ clearOldFiles: true });
const state: IEditAd = reactive({
  code: "",
  propertyStatus: "متوفر",
  propertyOwnerName: "",
  propertyOwnerNumber: "###",
  propertyOwnerIdentity: "",
  propertyAgentName: "",
  propertyAgentNumber: "###",
  propertyAgentIdentity: "",
  facebookLink: "",
  instagramLink: "",
  propertyLink: "",
  governorate: "",
  directorate: "",
  village: "",
  basin: "",
  plot: "",
  apartmentNumber: "",
  classification: "",
  neighborhood: "",
  expectedRentAmount: "",
  area: "",
  price: "",
  isFurnished: "",
  realLocation: "",
  buildingName: "",
  nearbyLandmarks: "",
  floor: "",
  internalArea: "",
  externalArea: "",
  floorsCount: "",
  floorsArea: "",
  buildingAge: "",
  storesCount: "",
  storesArea: "",
  isRegistered: "",
  notes: "",
  interestedPeople: [],
  images: "",
});
const items = (row: { name: string; number: string }) => [
  [
    {
      label: "مسح",
      icon: "i-heroicons-trash-20-solid",
      click: () =>
        (state.interestedPeople = state.interestedPeople.filter(
          (item) => !(item.name === row.name && item.number === row.number)
        )),
    },
  ],
];

// *** Declare Menus ***
const propertyStatusOptions = [
  {
    id: 0,
    name: "متوفر",
    value: "متوفر",
  },
  {
    id: 1,
    name: "مؤجر",
    value: "مؤجر",
  },
  {
    id: 2,
    name: "تم البيع",
    value: "تم البيع",
  },
];

// Handle form submission
const submitForm = async () => {
  useLoadingIndicator().start();
  await editAd(selectedAdId.value, state, files.value);
};
const openFile = (fileName: string, isNew: boolean) => {
  if (isNew) {
    selectedImage.value = fileName;
  } else {
    selectedImage.value = `/upload/files/ads/${ad?.id}/${fileName}`;
  }
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
  selectedImage.value = "";
};
const toggleFileDeletion = (index: any) => {
  // state.files[index].status = !state.files[index].status;
};
const removeFile = (index: number) => {
  files.value.splice(index, 1);
};
const addInterestedPerson = () => {
  // Push a new empty person object to the array
  // console.log({ interestedPersonName: interestedPersonName.value, interestedPersonNumber: interestedPersonNumber.value });
  state.interestedPeople.push({
    name: interestedPersonName.value,
    number: interestedPersonNumber.value,
  });

  interestedPersonName.value = "";
  interestedPersonNumber.value = "";
};

// Reactively update the form state when `ad` becomes available
watchEffect(() => {
  if (ad) {
    state.code = ad.code;
    state.propertyStatus = ad.propertyStatus;
    state.propertyOwnerName = ad.propertyOwnerName;
    state.propertyOwnerNumber = ad.propertyOwnerNumber;
    state.propertyOwnerIdentity = ad.propertyOwnerIdentity;
    state.propertyAgentName = ad.propertyAgentName;
    state.propertyAgentNumber = ad.propertyAgentNumber;
    state.propertyAgentIdentity = ad.propertyAgentIdentity;
    state.facebookLink = ad.facebookLink;
    state.instagramLink = ad.instagramLink;
    state.governorate = ad.governorate;
    state.directorate = ad.directorate;
    state.village = ad.village;
    state.basin = ad.basin;
    state.plot = ad.plot;
    state.apartmentNumber = ad.apartmentNumber;
    state.classification = ad.classification;
    state.neighborhood = ad.neighborhood;
    state.expectedRentAmount = ad.expectedRentAmount;
    state.area = ad.area;
    state.price = ad.price;
    state.isFurnished = ad.isFurnished;
    state.realLocation = ad.realLocation;
    state.buildingName = ad.buildingName;
    state.nearbyLandmarks = ad.nearbyLandmarks;
    state.internalArea = ad.internalArea;
    state.externalArea = ad.externalArea;
    state.floor = ad.floor;
    state.floorsCount = ad.floorsCount;
    state.floorsArea = ad.floorsArea;
    state.buildingAge = ad.buildingAge;
    state.storesCount = ad.storesCount;
    state.storesArea = ad.storesArea;
    state.isRegistered = ad.isRegistered;
    state.notes = ad.notes;
    // @ts-ignore
    state.interestedPeople = ad.interestedPeople;
    state.images = ad.images;
  }
});

// Update getImageUrl method
const getImageUrl = async (key: string, download = false) => {
  if (!key) return "";
  const res = await $fetch<any>("/api/v2/files/" + key);

  const base64Data = res.body.split(",")[1]; // Extract base64 data
  const mimeType = res.mimeType; // Ensure the response contains the MIME type
  const url = base64ToBlobUrl(base64Data, mimeType);

  return url;
};
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

const imageKeys = computed(() =>
  ad?.images?.split(",").filter((i) => i !== "")
);
</script>

<template>
  <form
    @submit.prevent="submitForm()"
    class="relative mt-6 flex-1 px-4 sm:px-6"
  >
    <!-- Form Header -->
    <div
      class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary"
    >
      <h3 class="text-center font-semibold text-xl mb-1">معلومات عامة</h3>
    </div>
    <!-- Form Fields -->
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-6 gap-x-6 gap-y-4">
        <!-- code -->
        <div class="col-span-6 sm:col-span-2">
          <label for="code">رقم الاعلان </label>
          <UInput
            id="code"
            name="code"
            :size="'sm'"
            :required="false"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="ad?.code"
          />
        </div>
        <!-- propertyStatus -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyStatus"
            >حالة العقار
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <USelectMenu
            id="propertyStatus"
            name="propertyStatus"
            :required="true"
            v-model="state.propertyStatus"
            :options="propertyStatusOptions"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
        <!-- propertyType -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyType"> نوع العقار </label>
          <UInput
            id="propertyType"
            name="propertyType"
            :required="false"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="useGetPropertyTypeName(ad?.propertyType || 0)"
          />
        </div>
        <!-- propertyOwnerName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyOwnerName">
            اسم صاحب العقار
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="propertyOwnerName"
            name="propertyOwnerName"
            :size="'sm'"
            :required="true"
            v-model="state.propertyOwnerName"
          />
        </div>
        <!-- propertyOwnerNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyOwnerNumber">
            رقم صاحب العقار
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="propertyOwnerNumber"
            name="propertyOwnerNumber"
            :size="'sm'"
            :required="true"
            v-model="state.propertyOwnerNumber"
          />
        </div>
        <!-- propertyOwnerIdentity -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyOwnerIdentity"> الرقم الوطني لصاحب العقار </label>
          <UInput
            id="propertyOwnerIdentity"
            name="propertyOwnerIdentity"
            :size="'sm'"
            :required="false"
            v-model="state.propertyOwnerIdentity"
          />
        </div>
        <!-- propertyAgentName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyAgentName"> اسم وكيل العقار </label>
          <UInput
            id="propertyAgentName"
            name="propertyAgentName"
            :size="'sm'"
            :required="false"
            v-model="state.propertyAgentName!"
          />
        </div>
        <!-- propertyAgentNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyAgentNumber"> رقم وكيل العقار </label>
          <UInput
            id="propertyAgentNumber"
            name="propertyAgentNumber"
            :size="'sm'"
            :required="false"
            v-model="state.propertyAgentNumber"
          />
        </div>
        <!-- propertyAgentIdentity -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyAgentIdentity"> الرقم الوطني لوكيل العقار </label>
          <UInput
            id="propertyAgentIdentity"
            name="propertyAgentIdentity"
            :size="'sm'"
            :required="false"
            v-model="state.propertyAgentIdentity"
          />
        </div>
        <!-- facebookLink -->
        <div class="col-span-6 sm:col-span-3">
          <label for="facebookLink"> رابط الفيسبوك </label>
          <UInput
            id="facebookLink"
            name="facebookLink"
            :type="'text'"
            :size="'sm'"
            :required="false"
            v-model="state.facebookLink!"
          />
        </div>
        <!-- instagramLink -->
        <div class="col-span-6 sm:col-span-3">
          <label for="instagramLink"> رابط الانستجرام </label>
          <UInput
            id="instagramLink"
            name="instagramLink"
            :type="'text'"
            :size="'sm'"
            :required="false"
            v-model="state.instagramLink!"
          />
        </div>
        <!-- adPhotos -->
        <div class="col-span-6 sm:col-span-1">
          <label for="adPhotos"> صور الاعلان </label>
          <UInput
            id="adPhotos"
            name="adPhotos"
            :type="'file'"
            :size="'sm'"
            :required="false"
            @input="handleFileInput"
            multiple
          />
        </div>

        <!-- Image/Video Grid -->
        <!-- <div class="col-span-6 sm:col-span-6 flex">
          <div v-for="(el, index) in state.files" :key="index" class="relative inline-block">
            <template>
              <NuxtImg
                :class="el.status ? 'opacity-100' : 'opacity-25'"
                :src="el.fileContent.value"
                alt="file"
                class="rounded-lg shadow-md h-[100px] w-[100px] hover:shadow-lg cursor-pointer mr-3"
                preload
                placeholder
                @click="openFile(el.name, false)"
              />
              <UButton
                v-if="el.status"
                icon="i-heroicons-minus-20-solid"
                @click="toggleFileDeletion(index)"
                class="absolute top-0 left-0 bg-gray-400 hover:bg-gray-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
                style="transform: translate(-40%, -40%)"
              />

              <UButton
                v-else
                icon="i-heroicons-plus-20-solid"
                @click="toggleFileDeletion(index)"
                class="absolute top-0 left-0 bg-primary-500 hover:bg-primary-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
                style="transform: translate(-40%, -40%)"
              />
            </template>
          </div> -->

        <!-- For new files -->
        <!-- <div v-for="(el, index) in files" :key="index + 'new'" class="relative inline-block">
            <template>
              <NuxtImg
                :src="el.content?.toString()"
                alt="file"
                class="rounded-lg shadow-md h-[100px] w-[100px] hover:shadow-lg cursor-pointer mr-3"
                preload
                @click="openFile(el.content!.toString(), true)"
              />
              <UButton
                icon="i-heroicons-minus-20-solid"
                @click="removeFile(index)"
                class="absolute top-0 left-0 bg-gray-400 hover:bg-gray-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
                style="transform: translate(-40%, -40%)"
              />
            </template>
          </div>
        </div> -->

        <!-- Modal with Transition -->
        <!-- <transition name="fade">
          <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div class="bg-white rounded-lg p-4 max-w-[90%] max-h-[90%] relative">
              <template>
                <img :src="selectedImage" alt="Selected Image" class="max-h-full max-w-full rounded-lg" />
              </template>
              <UButton
                type="button"
                icon="i-heroicons-x-circle-20-solid"
                @click="closeModal"
                class="absolute top-2 right-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full"
              />
            </div>
          </div>
        </transition> -->
      </div>
    </div>

    <div
      class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary"
    >
      <h3 class="text-center font-semibold text-xl mb-1">تفاصيل العقار</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-6 gap-x-6 gap-y-4">
        <!-- governorate -->
        <div class="col-span-6 sm:col-span-2">
          <label for="governorate">
            المحافظة
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="governorate"
            name="governorate"
            :size="'sm'"
            :required="true"
            v-model="state.governorate"
          />
        </div>
        <!-- directorate -->
        <div class="col-span-6 sm:col-span-2">
          <label for="directorate">
            المديرية
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="directorate"
            name="directorate"
            :size="'sm'"
            :required="true"
            v-model="state.directorate"
          />
        </div>
        <!-- village -->
        <div class="col-span-6 sm:col-span-2">
          <label for="village">
            القرية <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="village"
            name="village"
            :size="'sm'"
            :required="true"
            v-model="state.village"
          />
        </div>
        <!-- basin -->
        <div class="col-span-6 sm:col-span-2">
          <label for="basin">
            الحوض <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="basin"
            name="basin"
            :size="'sm'"
            :required="true"
            v-model="state.basin"
          />
        </div>
        <!-- neighborhood -->
        <div class="col-span-6 sm:col-span-2">
          <label for="neighborhood"> الحي </label>
          <UInput
            id="neighborhood"
            name="neighborhood"
            :size="'sm'"
            :required="false"
            v-model="state.neighborhood!"
          />
        </div>
        <!-- price -->
        <div class="col-span-6 sm:col-span-2">
          <label for="price"> السعر </label>
          <UInput
            id="price"
            name="price"
            :type="'text'"
            :size="'sm'"
            :required="false"
            v-model="state.price!"
          />
        </div>
        <!-- nearbyLandmarks -->
        <div class="col-span-6 sm:col-span-2">
          <label for="nearbyLandmarks"> ابرز المعالم القريبة </label>
          <UInput
            id="nearbyLandmarks"
            name="nearbyLandmarks"
            :type="'text'"
            :size="'sm'"
            :required="false"
            v-model="state.nearbyLandmarks!"
          />
        </div>
        <!-- realLocation -->
        <div class="col-span-6 sm:col-span-2">
          <label for="realLocation">
            الموقع الفعلي (Google Maps Location)</label
          >
          <UInput
            id="realLocation"
            name="realLocation"
            :type="'text'"
            :size="'sm'"
            :required="false"
            v-model="state.realLocation!"
          />
        </div>

        <!-- ## BASED ON CODE ## -->
        <!-- plot -->
        <div
          class="col-span-6 sm:col-span-2"
          v-show="state.code.includes('LS') || state.code.includes('LR')"
        >
          <label for="plot">
            رقم القطعة
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="plot"
            name="plot"
            :size="'sm'"
            :required="state.code.includes('LS') || state.code.includes('LR')"
            v-model="state.plot"
          />
        </div>
        <!-- buildingName -->
        <div
          class="col-span-6 sm:col-span-2"
          v-show="
            state.code.includes('AS') ||
            state.code.includes('AR') ||
            state.code.includes('ASI') ||
            state.code.includes('ARS')
          "
        >
          <label for="buildingName">
            اسم البناية
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="buildingName"
            name="buildingName"
            :size="'sm'"
            :required="
              state.code.includes('AS') ||
              state.code.includes('AR') ||
              state.code.includes('ASI') ||
              state.code.includes('ARS')
            "
            v-model="state.buildingName!"
          />
        </div>
        <!-- apartmentNumber -->
        <!-- <div class="col-span-6 sm:col-span-2" v-show="">
          <label for="apartmentNumber"> رقم الشقة <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput
            id="apartmentNumber"
            name="apartmentNumber"
            :size="'sm'"
            :required="!state.code.includes('LS') && !state.code.includes('LR')"
            v-model="state.apartmentNumber!"
          />
        </div> -->
        <!-- classification -->
        <!-- <div class="col-span-6 sm:col-span-2" v-show="">
          <label for="classification"> تصنيف الارض <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput
            id="classification"
            name="classification"
            :size="'sm'"
            :required="state.code.includes('LS') || state.code.includes('LR')"
            v-model="state.classification!"
          />
        </div> -->
        <!-- area -->
        <div
          class="col-span-6 sm:col-span-2"
          v-show="
            state.code.includes('LS') ||
            state.code.includes('LR') ||
            state.code.includes('VS') ||
            state.code.includes('VR') ||
            state.code.includes('BS') ||
            state.code.includes('BR') ||
            state.code.includes('FS') ||
            state.code.includes('FR')
          "
        >
          <label for="area">
            المساحة
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="area"
            name="area"
            :type="'text'"
            :size="'sm'"
            :required="
              state.code.includes('LS') ||
              state.code.includes('LR') ||
              state.code.includes('VS') ||
              state.code.includes('VR') ||
              state.code.includes('BS') ||
              state.code.includes('BR') ||
              state.code.includes('FS') ||
              state.code.includes('FR')
            "
            v-model="state.area!"
          />
        </div>
        <!-- internalArea -->
        <div
          class="col-span-6 sm:col-span-2"
          v-show="
            state.code.includes('AS') ||
            state.code.includes('AR') ||
            state.code.includes('ASI') ||
            state.code.includes('ARS')
          "
        >
          <label for="internalArea">
            المساحة الداخلية
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="internalArea"
            name="internalArea"
            :type="'text'"
            :size="'sm'"
            :required="
              state.code.includes('AS') ||
              state.code.includes('AR') ||
              state.code.includes('ASI') ||
              state.code.includes('ARS')
            "
            v-model="state.internalArea!"
          />
        </div>
        <!-- externalArea -->
        <div
          class="col-span-6 sm:col-span-2"
          v-show="
            state.code.includes('AS') ||
            state.code.includes('AR') ||
            state.code.includes('ASI') ||
            state.code.includes('ARS')
          "
        >
          <label for="externalArea">
            المساحة الخارجية
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="externalArea"
            name="externalArea"
            :type="'text'"
            :size="'sm'"
            :required="
              state.code.includes('AS') ||
              state.code.includes('AR') ||
              state.code.includes('ASI') ||
              state.code.includes('ARS')
            "
            v-model="state.externalArea!"
          />
        </div>
        <!-- floor -->
        <div
          class="col-span-6 sm:col-span-2"
          v-show="
            state.code.includes('AS') ||
            state.code.includes('AR') ||
            state.code.includes('ASI') ||
            state.code.includes('ARS')
          "
        >
          <label for="floor">
            الطابق <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="floor"
            name="floor"
            :type="'text'"
            :size="'sm'"
            :required="
              state.code.includes('AS') ||
              state.code.includes('AR') ||
              state.code.includes('ASI') ||
              state.code.includes('ARS')
            "
            v-model="state.floor!"
          />
        </div>
        <!-- floorsCount -->
        <div
          class="col-span-6 sm:col-span-2"
          v-show="
            state.code.includes('VS') ||
            state.code.includes('VR') ||
            state.code.includes('BS') ||
            state.code.includes('BR') ||
            state.code.includes('FS') ||
            state.code.includes('FR')
          "
        >
          <label for="floorsCount">
            عدد الطوابق
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="floorsCount"
            name="floorsCount"
            :type="'text'"
            :size="'sm'"
            :required="
              state.code.includes('VS') ||
              state.code.includes('VR') ||
              state.code.includes('BS') ||
              state.code.includes('BR') ||
              state.code.includes('FS') ||
              state.code.includes('FR')
            "
            v-model="state.floorsCount!"
          />
        </div>
        <!-- floorsArea -->
        <div
          class="col-span-6 sm:col-span-2"
          v-show="
            state.code.includes('VS') ||
            state.code.includes('VR') ||
            state.code.includes('BS') ||
            state.code.includes('BR') ||
            state.code.includes('FS') ||
            state.code.includes('FR')
          "
        >
          <label for="floorsArea">
            مساحة الطوابق
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="floorsArea"
            name="floorsArea"
            :type="'text'"
            :size="'sm'"
            :required="
              state.code.includes('VS') ||
              state.code.includes('VR') ||
              state.code.includes('BS') ||
              state.code.includes('BR') ||
              state.code.includes('FS') ||
              state.code.includes('FR')
            "
            v-model="state.floorsArea!"
          />
        </div>
        <!-- buildingAge -->
        <div
          class="col-span-6 sm:col-span-2"
          v-show="
            state.code.includes('VS') ||
            state.code.includes('VR') ||
            state.code.includes('BS') ||
            state.code.includes('BR') ||
            state.code.includes('FS') ||
            state.code.includes('FR') ||
            state.code.includes('SS') ||
            state.code.includes('SR') ||
            state.code.includes('CS') ||
            state.code.includes('CR')
          "
        >
          <label for="buildingAge">
            عمر البناء
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="buildingAge"
            name="buildingAge"
            :type="'text'"
            :size="'sm'"
            :required="
              state.code.includes('VS') ||
              state.code.includes('VR') ||
              state.code.includes('BS') ||
              state.code.includes('BR') ||
              state.code.includes('FS') ||
              state.code.includes('FR') ||
              state.code.includes('SS') ||
              state.code.includes('SR') ||
              state.code.includes('CS') ||
              state.code.includes('CR')
            "
            v-model="state.buildingAge!"
          />
        </div>
        <!-- storesCount -->
        <div
          class="col-span-6 sm:col-span-2"
          v-show="
            state.code.includes('SS') ||
            state.code.includes('SR') ||
            state.code.includes('CS') ||
            state.code.includes('CR')
          "
        >
          <label for="storesCount">
            عدد المخازن
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="storesCount"
            name="storesCount"
            :type="'text'"
            :size="'sm'"
            :required="
              state.code.includes('SS') ||
              state.code.includes('SR') ||
              state.code.includes('CS') ||
              state.code.includes('CR')
            "
            v-model="state.storesCount!"
          />
        </div>
        <!-- storesArea -->
        <div
          class="col-span-6 sm:col-span-2"
          v-show="
            state.code.includes('SS') ||
            state.code.includes('SR') ||
            state.code.includes('CS') ||
            state.code.includes('CR')
          "
        >
          <label for="storesArea">
            مساحة المخازن
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="storesArea"
            name="storesArea"
            :type="'text'"
            :size="'sm'"
            :required="
              state.code.includes('SS') ||
              state.code.includes('SR') ||
              state.code.includes('CS') ||
              state.code.includes('CR')
            "
            v-model="state.storesArea!"
          />
        </div>
        <!-- isRegistered -->
        <div
          class="col-span-6 sm:col-span-2"
          v-show="
            state.code.includes('SS') ||
            state.code.includes('SR') ||
            state.code.includes('CS') ||
            state.code.includes('CR')
          "
        >
          <label for="isRegistered">
            مؤجر \ فارغ
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <USelect
            id="isRegistered"
            name="isRegistered"
            :options="[
              { id: 1, name: 'فارغ', value: 'فارغ' },
              { id: 2, name: 'مؤجر', value: 'مؤجر' },
            ]"
            :required="
              state.code.includes('SS') ||
              state.code.includes('SR') ||
              state.code.includes('CS') ||
              state.code.includes('CR')
            "
            v-model="state.isRegistered!"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
        <!-- isFurnished -->
        <div
          class="col-span-6 sm:col-span-2"
          v-show="
            state.code.includes('AS') ||
            state.code.includes('AR') ||
            state.code.includes('ASI') ||
            state.code.includes('ARS') ||
            state.code.includes('VS') ||
            state.code.includes('VR') ||
            state.code.includes('BS') ||
            state.code.includes('BR') ||
            state.code.includes('FS') ||
            state.code.includes('FR')
          "
        >
          <label for="isFurnished">
            مفروش \ غير مفروش
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <USelectMenu
            id="isFurnished"
            name="isFurnished"
            :required="
              state.code.includes('AS') ||
              state.code.includes('AR') ||
              state.code.includes('ASI') ||
              state.code.includes('ARS') ||
              state.code.includes('VS') ||
              state.code.includes('VR') ||
              state.code.includes('BS') ||
              state.code.includes('BR') ||
              state.code.includes('FS') ||
              state.code.includes('FR')
            "
            v-model="state.isFurnished"
            :options="[
              {
                id: 1,
                name: 'غير مفروش',
                value: 'غير مفروش',
              },
              {
                id: 2,
                name: 'مفروش',
                value: 'مفروش',
              },
            ]"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
        <!-- expectedRentAmount -->
        <div
          class="col-span-6 sm:col-span-2"
          v-show="state.code.includes('ASI')"
        >
          <label for="expectedRentAmount">
            دخل الايجار المتوقع
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="expectedRentAmount"
            name="expectedRentAmount"
            :size="'sm'"
            :required="state.code.includes('ASI')"
            v-model="state.expectedRentAmount!"
          />
        </div>
        <!-- notes -->
        <div class="col-span-6 sm:col-span-8">
          <label for="notes"> الملاحظات </label>
          <UTextarea
            id="notes"
            name="notes"
            :type="'text'"
            :size="'sm'"
            :required="false"
            v-model="state.notes!"
          />
        </div>
      </div>
    </div>

    <div
      class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary"
    >
      <h3 class="text-center font-semibold text-xl mb-1">
        الاشخاص المهتمين بالعقار
      </h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 items-center">
        <!-- interestedPersonName -->
        <label for="interestedPersonName" class="col-span-6 lg:col-span-1">
          اسم الشخص المهتم :</label
        >
        <div class="col-span-6 lg:col-span-2">
          <UInput
            id="interestedPersonName"
            name="interestedPersonName"
            :size="'sm'"
            :required="false"
            v-model="interestedPersonName"
          />
        </div>
        <!-- interestedPersonNumber -->
        <label for="interestedPersonName" class="col-span-6 lg:col-span-1">
          رقم الشخص المهتم :</label
        >
        <div class="col-span-6 lg:col-span-2">
          <UInput
            id="interestedPersonName"
            name="interestedPersonName"
            :size="'sm'"
            :required="false"
            v-model="interestedPersonNumber"
          />
        </div>
        <UButton
          :type="'button'"
          :size="'md'"
          class="w-20 text-center place-content-center ml-3"
          @click="addInterestedPerson"
          :disabled="
            interestedPersonName === '' || interestedPersonNumber === ''
          "
        >
          اضافة
        </UButton>
      </div>
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2"
      >
        <UTable
          class=""
          :rows="state.interestedPeople"
          :columns="[
            { key: 'name', label: 'اسم الشخص' },
            { key: 'number', label: 'رقم الشخص' },
            { key: 'actions' },
          ]"
        >
          <template #actions-data="{ row }">
            <UDropdown :items="items(row)" class="align-middle">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-ellipsis-horizontal-20-solid"
                class="h-0"
              />
            </UDropdown>
          </template>
        </UTable>
      </div>
    </div>

    <!-- Form Action Buttons -->
    <div class="text-left mb-5">
      <UButton
        :type="'submit'"
        :size="'sm'"
        class="w-20 text-center place-content-center ml-3"
      >
        حفظ
      </UButton>
      <UButton
        to="/ads"
        :size="'sm'"
        class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white"
      >
        الغاء
      </UButton>
    </div>
  </form>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
