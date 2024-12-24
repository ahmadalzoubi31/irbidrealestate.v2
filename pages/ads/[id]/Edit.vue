<script setup lang="ts">
import type { Ad } from "@prisma/client";

const { editAd } = useAdActions();
const route = useRoute();

// Extract route parameter
const selectedAdId = ref(route.params.id as string);

// Access the shared state for ads
const ads = useState<Ad[]>("adList");
// Find the specific ad reactively
const ad = computed(() => ads.value?.find((el) => el.id === selectedAdId.value));

if (!ads.value || ads.value.length === 0) {
  await navigateTo("/ads");
}

const isModalOpen = ref(false);
const selectedImage = ref("");
const interestedPersonName = ref("");
const interestedPersonNumber = ref("");
const { handleFileInput, files } = useFileStorage({ clearOldFiles: true });
const state: IEditAd = reactive({
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
  notes: "",
  interestedPeople: [],
  files: [],
});
const items = (row: { name: string; number: string }) => [
  [
    {
      label: "مسح",
      icon: "i-heroicons-trash-20-solid",
      click: () => (state.interestedPeople = state.interestedPeople.filter((item) => !(item.name === row.name && item.number === row.number))),
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
  const fileList = state.files.concat(files.value);

  const payload = {
    ...state,
    files: fileList,
  };
  useLoadingIndicator().start();
  await editAd(selectedAdId.value, payload);
};
const openFile = (fileName: string, isNew: boolean) => {
  if (isNew) {
    selectedImage.value = fileName;
  } else {
    selectedImage.value = `/upload/files/ads/${ad.value?.id}/${fileName}`;
  }
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
  selectedImage.value = "";
};
const toggleFileDeletion = (index: any) => {
  state.files[index].status = !state.files[index].status;
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
  if (ad.value) {
    state.propertyStatus = ad.value.propertyStatus;
    state.propertyOwnerName = ad.value.propertyOwnerName;
    state.propertyOwnerNumber = ad.value.propertyOwnerNumber;
    state.propertyOwnerIdentity = ad.value.propertyOwnerIdentity;
    state.propertyAgentName = ad.value.propertyAgentName;
    state.propertyAgentNumber = ad.value.propertyAgentNumber;
    state.propertyAgentIdentity = ad.value.propertyAgentIdentity;
    state.facebookLink = ad.value.facebookLink;
    state.instagramLink = ad.value.instagramLink;
    state.governorate = ad.value.governorate;
    state.directorate = ad.value.directorate;
    state.village = ad.value.village;
    state.basin = ad.value.basin;
    state.plot = ad.value.plot;
    state.apartmentNumber = ad.value.apartmentNumber;
    state.classification = ad.value.classification;
    state.neighborhood = ad.value.neighborhood;
    state.expectedRentAmount = ad.value.expectedRentAmount;
    state.notes = ad.value.notes;
    // @ts-ignore
    state.interestedPeople = ad.value.interestedPeople;
    // @ts-ignore
    state.files = ad.value.files;
  }
});
</script>

<template>
  <form @submit.prevent="submitForm()" class="relative mt-6 flex-1 px-4 sm:px-6">
    <!-- Form Header -->
    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
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
            :autofocus="true"
            :required="false"
            :disable="true"
            inputClass="bg-gray-200"
            :model-value="ad?.code"
          />
        </div>
        <!-- propertyStatus -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyStatus">حالة العقار <span class="text-sm text-primary-500">(اجباري)</span></label>
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
            :disable="true"
            inputClass="bg-gray-200"
            :model-value="useGetPropertyTypeName(ad?.propertyType || 0)"
          />
        </div>
        <!-- propertyOwnerName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyOwnerName">
            اسم صاحب العقار
            <span class="text-sm text-primary-500">(اجباري)</span></label
          >
          <UInput id="propertyOwnerName" name="propertyOwnerName" :size="'sm'" :required="true" v-model="state.propertyOwnerName" />
        </div>
        <!-- propertyOwnerNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyOwnerNumber">
            رقم صاحب العقار
            <span class="text-sm text-primary-500">(اجباري)</span></label
          >
          <UInput id="propertyOwnerNumber" name="propertyOwnerNumber" :size="'sm'" :required="true" v-model="state.propertyOwnerNumber" />
        </div>
        <!-- propertyOwnerIdentity -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyOwnerIdentity"> الرقم الوطني لصاحب العقار </label>
          <UInput id="propertyOwnerIdentity" name="propertyOwnerIdentity" :size="'sm'" :required="false" v-model="state.propertyOwnerIdentity" />
        </div>
        <!-- propertyAgentName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyAgentName"> اسم وكيل العقار </label>
          <UInput id="propertyAgentName" name="propertyAgentName" :size="'sm'" :required="false" v-model="state.propertyAgentName!" />
        </div>
        <!-- propertyAgentNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyAgentNumber"> رقم وكيل العقار </label>
          <UInput id="propertyAgentNumber" name="propertyAgentNumber" :size="'sm'" :required="false" v-model="state.propertyAgentNumber" />
        </div>
        <!-- propertyAgentIdentity -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyAgentIdentity"> الرقم الوطني لوكيل العقار </label>
          <UInput id="propertyAgentIdentity" name="propertyAgentIdentity" :size="'sm'" :required="false" v-model="state.propertyAgentIdentity" />
        </div>
        <!-- facebookLink -->
        <div class="col-span-6 sm:col-span-3">
          <label for="facebookLink"> رابط الفيسبوك </label>
          <UInput id="facebookLink" name="facebookLink" :type="'text'" :size="'sm'" :required="false" v-model="state.facebookLink!" />
        </div>
        <!-- instagramLink -->
        <div class="col-span-6 sm:col-span-3">
          <label for="instagramLink"> رابط الانستجرام </label>
          <UInput id="instagramLink" name="instagramLink" :type="'text'" :size="'sm'" :required="false" v-model="state.instagramLink!" />
        </div>
        <!-- adPhotos -->
        <div class="col-span-6 sm:col-span-1">
          <label for="adPhotos"> صور الاعلان </label>
          <UInput id="adPhotos" name="adPhotos" :type="'file'" :size="'sm'" :required="false" @input="handleFileInput" multiple />
        </div>

        <!-- Image/Video Grid -->
        <div class="col-span-6 sm:col-span-6 flex">
          <!-- For existing files -->
          <div v-for="(el, index) in state.files" :key="index" class="relative inline-block">
            <template v-if="el.name.endsWith('.mp4')">
              <!-- Render video thumbnail (optional) -->
              <video
                :class="el.status ? 'opacity-100' : 'opacity-25'"
                :src="`/upload/files/ads/${ad?.id}/${el.name}`"
                class="rounded-lg shadow-md h-[100px] w-[100px] hover:shadow-lg mr-3"
                preload="metadata"
                @click="openFile(el.name, false)"
              />
              <div class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-lg mr-3" @click="openFile(el.name, false)">
                <icon name="i-heroicons-play-circle-20-solid" class="text-white text-5xl cursor-pointer"></icon>
              </div>
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
            <template v-else>
              <!-- Render image -->
              <NuxtImg
                :class="el.status ? 'opacity-100' : 'opacity-25'"
                :src="`/upload/files/ads/${ad?.id}/${el.name}`"
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
          </div>

          <!-- For new files -->
          <div v-for="(el, index) in files" :key="index + 'new'" class="relative inline-block">
            <template v-if="el.content?.toString().startsWith('data:video/mp4;base64,')">
              <!-- Render video thumbnail (optional) -->
              <video
                :src="el.content?.toString()"
                class="rounded-lg shadow-md h-[100px] w-[100px] hover:shadow-lg mr-3"
                preload="metadata"
                @click="openFile(el.content!.toString(), true)"
              />
              <div
                class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-lg mr-3"
                @click="openFile(el.content!.toString(), true)"
              >
                <icon name="i-heroicons-play-circle-20-solid" class="text-white text-5xl cursor-pointer"></icon>
              </div>
              <UButton
                icon="i-heroicons-minus-20-solid"
                @click="removeFile(index)"
                class="absolute top-0 left-0 bg-gray-400 hover:bg-gray-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
                style="transform: translate(-40%, -40%)"
              />
            </template>
            <template v-else>
              <!-- Render image -->
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
        </div>

        <!-- Modal with Transition -->
        <transition name="fade">
          <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div class="bg-white rounded-lg p-4 max-w-[90%] max-h-[90%] relative">
              <!-- Conditionally Render Image or Video -->
              <template v-if="selectedImage.endsWith('.mp4') || selectedImage.startsWith('data:video/mp4;base64,')">
                <video :src="selectedImage" controls width="1600" class="max-w-full rounded-lg" />
              </template>
              <template v-else>
                <img :src="selectedImage" alt="Selected Image" class="max-h-full max-w-full rounded-lg" />
              </template>

              <!-- Close Button -->
              <UButton
                type="button"
                icon="i-heroicons-x-circle-20-solid"
                @click="closeModal"
                class="absolute top-2 right-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">تفاصيل العقار</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-8 gap-x-6 gap-y-4">
        <!-- governorate -->
        <div class="col-span-6 sm:col-span-2">
          <label for="governorate">
            المحافظة
            <span class="text-sm text-primary-500">(اجباري)</span></label
          >
          <UInput id="governorate" name="governorate" :size="'sm'" :autofocus="true" :required="true" v-model="state.governorate" />
        </div>
        <!-- directorate -->
        <div class="col-span-6 sm:col-span-2">
          <label for="directorate">
            المديرية
            <span class="text-sm text-primary-500">(اجباري)</span></label
          >
          <UInput id="directorate" name="directorate" :size="'sm'" :autofocus="true" :required="true" v-model="state.directorate" />
        </div>
        <!-- village -->
        <div class="col-span-6 sm:col-span-2">
          <label for="village"> القرية <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="village" name="village" :size="'sm'" :autofocus="true" :required="true" v-model="state.village" />
        </div>
        <!-- basin -->
        <div class="col-span-6 sm:col-span-2">
          <label for="basin"> الحوض <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="basin" name="basin" :size="'sm'" :required="true" v-model="state.basin" />
        </div>
        <!-- plot -->
        <div class="col-span-6 sm:col-span-2">
          <label for="plot">
            رقم القطعة
            <span class="text-sm text-primary-500">(اجباري)</span></label
          >
          <UInput id="plot" name="plot" :size="'sm'" :required="true" v-model="state.plot" />
        </div>
        <!-- apartmentNumber -->
        <div class="col-span-6 sm:col-span-2" v-show="!ad?.code.includes('LS') && !ad?.code.includes('LR')">
          <label for="apartmentNumber">
            رقم الشقة
            <span class="text-sm text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="apartmentNumber"
            name="apartmentNumber"
            :size="'sm'"
            :required="!ad?.code.includes('LS') && !ad?.code.includes('LR')"
            v-model="state.apartmentNumber!"
          />
        </div>
        <!-- classification -->
        <div class="col-span-6 sm:col-span-2" v-show="ad?.code.includes('LS') || ad?.code.includes('LR')">
          <label for="classification">
            تصنيف الارض
            <span class="text-sm text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="classification"
            name="classification"
            :size="'sm'"
            :required="ad?.code.includes('LS') || ad?.code.includes('LR')"
            v-model="state.classification!"
          />
        </div>
        <!-- neighborhood -->
        <div class="col-span-6 sm:col-span-2">
          <label for="neighborhood"> الحي </label>
          <UInput id="neighborhood" name="neighborhood" :size="'sm'" :required="false" v-model="state.neighborhood!" />
        </div>
        <!-- expectedRentAmount -->
        <div class="col-span-6 sm:col-span-2" v-show="ad?.code.includes('ASI')">
          <label for="expectedRentAmount">
            دخل الايجار المتوقع
            <span class="text-sm text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="expectedRentAmount"
            name="expectedRentAmount"
            :size="'sm'"
            :required="ad?.code.includes('ASI')"
            v-model="state.expectedRentAmount!"
          />
        </div>
        <!-- notes -->
        <div class="col-span-6 sm:col-span-6">
          <label for="notes"> الملاحظات </label>
          <UInput id="notes" name="notes" :type="'text'" :size="'sm'" :required="false" v-model="state.notes!" />
        </div>
      </div>
    </div>

    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">الاشخاص المهتمين بالعقار</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 items-center">
        <!-- interestedPersonName -->
        <label for="interestedPersonName" class="col-span-6 lg:col-span-1"> اسم الشخص المهتم :</label>
        <div class="col-span-6 lg:col-span-2">
          <UInput id="interestedPersonName" name="interestedPersonName" :size="'sm'" :required="false" v-model="interestedPersonName" />
        </div>
        <!-- interestedPersonNumber -->
        <label for="interestedPersonName" class="col-span-6 lg:col-span-1"> رقم الشخص المهتم :</label>
        <div class="col-span-6 lg:col-span-2">
          <UInput id="interestedPersonName" name="interestedPersonName" :size="'sm'" :required="false" v-model="interestedPersonNumber" />
        </div>
        <UButton
          :type="'button'"
          :size="'md'"
          class="w-20 text-center place-content-center ml-3"
          @click="addInterestedPerson"
          :disabled="interestedPersonName === '' || interestedPersonNumber === ''"
        >
          اضافة
        </UButton>
      </div>
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
        <UTable
          class=""
          :rows="state.interestedPeople"
          :columns="[{ key: 'name', label: 'اسم الشخص' }, { key: 'number', label: 'رقم الشخص' }, { key: 'actions' }]"
        >
          <template #actions-data="{ row }">
            <UDropdown :items="items(row)" class="align-middle">
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" class="h-0" />
            </UDropdown>
          </template>
        </UTable>
      </div>
    </div>

    <!-- Form Action Buttons -->
    <div class="text-left mb-5">
      <UButton :type="'submit'" :size="'md'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
      <UButton to="/ads" :size="'md'" class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white">
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
