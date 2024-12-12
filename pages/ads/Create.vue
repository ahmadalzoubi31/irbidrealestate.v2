<script setup lang="ts">
import type { Ad } from "@prisma/client";

// *** Dependencies ***
const toast = useToast();
const { createAd } = useAdActions();

// *** Define Variables ***
const interestedPersonName = ref("");
const interestedPersonNumber = ref("");
const { handleFileInput, files } = useFileStorage({ clearOldFiles: true });
const state: ICreateAd = reactive({
  code: "",
  propertyStatus: "متوفر",
  propertyType: 0,
  propertyOwnerName: "",
  propertyOwnerNumber: "###",
  propertyOwnerIdentity: "",
  propertyAgentName: "",
  propertyAgentNumber: "###",
  propertyAgentIdentity: "",
  facebookLink: "",
  instagramLink: "",
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
const propertyTypeOptions = [
  {
    id: 1,
    name: "شقة سكنية للبيع",
    value: 1,
  },
  {
    id: 2,
    name: "شقة استثمارية للبيع",
    value: 2,
  },
  {
    id: 3,
    name: "شقة سكنية للايجار",
    value: 3,
  },
  {
    id: 4,
    name: "ارض للبيع",
    value: 4,
  },
  {
    id: 5,
    name: "ارض للايجار",
    value: 5,
  },
  {
    id: 6,
    name: "فيلا للبيع",
    value: 6,
  },
  {
    id: 7,
    name: "فيلا للايجار",
    value: 7,
  },
  {
    id: 8,
    name: "مزرعة للبيع",
    value: 8,
  },
  {
    id: 9,
    name: "مزرعة للايجار",
    value: 9,
  },
];

// *** Define Methods ***
const submitForm = async () => {
  // Early validation for required fields before making the API call
  if (!state.code) {
    toast.add({
      description: "من فضلك أكمل جميع الحقول المطلوبة.",
      color: "yellow",
      timeout: 5000,
    });
    return;
  }

  useLoadingIndicator().start();
  const payload = {
    ...state,
    files: files.value,
  };
  await createAd(payload);
};
// Function to add a new interested person (with name and phone)
const addInterestedPerson = () => {
  // Push a new empty person object to the array
  // console.log({ interestedPersonName: interestedPersonName.value, interestedPersonNumber: interestedPersonNumber.value });
  state.interestedPeople.push({ name: interestedPersonName.value, number: interestedPersonNumber.value });

  interestedPersonName.value = "";
  interestedPersonNumber.value = "";
};

// *** Computed Variables ***
// Get the data
const ads = useState<Ad[]>("adList");
if (!ads.value || ads.value.length === 0) {
  await navigateTo("/ads");
}
const getLastCodePerType = computed(() => (ads.value ? ads.value.filter((el) => el.propertyType == state.propertyType).length + 1 : 1));

// *** Watchers ***
watch(
  () => state.propertyType,
  (newVal, oldVal) => {
    // console.log("🚀 ~ newVal:", newVal);
    const index: number = getLastCodePerType.value;
    // console.log("🚀 ~ index:", index)

    switch (newVal) {
      case 1:
        state.code = "AS" + index;
        return "AS" + index;
        break;
      case 2:
        state.code = "ASI" + index;
        return "ASI" + index;
        break;
      case 3:
        state.code = "AR" + index;
        return "AR" + index;
        break;
      case 4:
        state.code = "LS" + index;
        return "LS" + index;
        break;
      case 5:
        state.code = "LR" + index;
        return "LR" + index;
        break;
      case 6:
        state.code = "VS" + index;
        return "VS" + index;
        break;
      case 7:
        state.code = "VR" + index;
        return "VR" + index;
        break;
      case 8:
        state.code = "FS" + index;
        return "FS" + index;
        break;
      case 9:
        state.code = "FR" + index;
        return "FR" + index;
        break;
      default:
        break;
    }
  }
);
</script>

<template>
  <form @submit.prevent="submitForm()" class="relative mt-6 flex-1 px-4 sm:px-6">
    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">معلومات عامة</h3>
    </div>
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
            :required="true"
            :disable="true"
            inputClass="bg-gray-200"
            v-model="state.code"
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
          <label for="propertyType"> نوع العقار <span class="text-sm text-primary-500">(اجباري)</span></label>
          <USelectMenu
            id="propertyType"
            name="propertyType"
            :required="true"
            v-model="state.propertyType"
            :options="propertyTypeOptions"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
        <!-- propertyOwnerName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyOwnerName"> اسم صاحب العقار <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="propertyOwnerName" name="propertyOwnerName" :size="'sm'" :required="true" v-model="state.propertyOwnerName" />
        </div>
        <!-- propertyOwnerNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="propertyOwnerNumber"> رقم صاحب العقار <span class="text-sm text-primary-500">(اجباري)</span></label>
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
      </div>
    </div>

    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">تفاصيل العقار</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-8 gap-x-6 gap-y-4">
        <!-- governorate -->
        <div class="col-span-6 sm:col-span-2">
          <label for="governorate"> المحافظة <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="governorate" name="governorate" :size="'sm'" :autofocus="true" :required="true" v-model="state.governorate" />
        </div>
        <!-- directorate -->
        <div class="col-span-6 sm:col-span-2">
          <label for="directorate"> المديرية <span class="text-sm text-primary-500">(اجباري)</span></label>
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
          <label for="plot"> رقم القطعة <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="plot" name="plot" :size="'sm'" :required="true" v-model="state.plot" />
        </div>
        <!-- apartmentNumber -->
        <div class="col-span-6 sm:col-span-2" v-show="!state.code.includes('LS') && !state.code.includes('LR')">
          <label for="apartmentNumber"> رقم الشقة <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput
            id="apartmentNumber"
            name="apartmentNumber"
            :size="'sm'"
            :required="!state.code.includes('LS') && !state.code.includes('LR')"
            v-model="state.apartmentNumber!"
          />
        </div>
        <!-- classification -->
        <div class="col-span-6 sm:col-span-2" v-show="state.code.includes('LS') || state.code.includes('LR')">
          <label for="classification"> تصنيف الارض <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput
            id="classification"
            name="classification"
            :size="'sm'"
            :required="state.code.includes('LS') || state.code.includes('LR')"
            v-model="state.classification!"
          />
        </div>
        <!-- neighborhood -->
        <div class="col-span-6 sm:col-span-2">
          <label for="neighborhood"> الحي </label>
          <UInput id="neighborhood" name="neighborhood" :size="'sm'" :required="false" v-model="state.neighborhood!" />
        </div>
        <!-- expectedRentAmount -->
        <div class="col-span-6 sm:col-span-2" v-show="state.code.includes('ASI')">
          <label for="expectedRentAmount"> دخل الايجار المتوقع <span class="text-sm text-primary-500">(اجباري)</span></label>
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
          <UTextarea id="notes" name="notes" :type="'text'" :size="'sm'" :required="false" v-model="state.notes!" />
        </div>
      </div>
    </div>

    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">الاشخاص المهتمين بالعقار</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 items-center">
        <!-- interestedPersonName -->
        <label for="interestedPersonName" class="col-span-6 sm:col-span-1"> اسم الشخص المهتم :</label>
        <div class="col-span-6 sm:col-span-2">
          <UInput id="interestedPersonName" name="interestedPersonName" :size="'sm'" :required="false" v-model="interestedPersonName" />
        </div>
        <!-- interestedPersonNumber -->
        <label for="interestedPersonNumber" class="col-span-6 sm:col-span-1"> رقم الشخص المهتم :</label>
        <div class="col-span-6 sm:col-span-2">
          <UInput id="interestedPersonNumber" name="interestedPersonNumber" :size="'sm'" :required="false" v-model="interestedPersonNumber" />
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

    <!-- <SharedSaveButton v-if="_sharedStore.slideOver.action !== 'show-details'" /> -->
    <div class="text-left mb-5">
      <UButton :type="'submit'" :size="'md'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
      <UButton to="/ads" :size="'md'" class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white">
        الغاء
      </UButton>
    </div>
  </form>
</template>
