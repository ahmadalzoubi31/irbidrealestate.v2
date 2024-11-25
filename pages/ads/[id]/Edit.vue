<script setup lang="ts">
// *** Dependencies ***
import type { Ad } from "@prisma/client";

// Validate the id
onBeforeMount(() => {
  const paramId: number = Number(useRoute().params.id);
  console.log("🚀 ~ onBeforeMount ~ paramId:", paramId);
  if (!isNaN(paramId)) return;

  // Redirect to the home page
  navigateTo("/ads");
});

// *** Define Variables ***
const selectedPaymentId: string = useRoute().params.id as string;
console.log("🚀 ~ selectedPaymentId:", selectedPaymentId);
const { data: ad } = await useAsyncData<Ad, any>("getOneAd", () => $fetch<Ad>("/api/ads/" + selectedPaymentId));
const toast = useToast();
const interestedPersonName = ref("");
const interestedPersonNumber = ref("");
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

// *** Declare Methods ***
const submitForm = async () => {
  useLoadingIndicator().start();
  const { status, error } = await useAsyncData<void, any>("editAd", () =>
    $fetch<void>("/api/ads/" + selectedPaymentId, {
      method: "put",
      body: state,
    })
  );

  if (status.value === "success") {
    toast.remove("saving");
    useLoadingIndicator().finish();
    refreshNuxtData("getAds");
    await navigateTo("/ads");
  }

  if (status.value === "error") {
    // console.log(error.value);
    useLoadingIndicator().finish();
    useLoadingIndicator().error.value = true;
    toast.add({
      title: "لقد حدث خطأ ما",
      description: error.value.data.message,
      color: "rose",
      timeout: 10000,
    });
  }
};
const addInterestedPerson = () => {
  // Push a new empty person object to the array
  // console.log({ interestedPersonName: interestedPersonName.value, interestedPersonNumber: interestedPersonNumber.value });
  state.interestedPeople.push({ name: interestedPersonName.value, number: interestedPersonNumber.value });

  interestedPersonName.value = "";
  interestedPersonNumber.value = "";
};

// *** Validate Form Data ***
if (ad.value === null) {
  await navigateTo("/ads");
} else {
  // Fill the field with data
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
}
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
          <UInput id="code" name="code" :size="'sm'" :autofocus="true" :required="false" :disable="true" inputClass="bg-gray-200" :model-value="ad!.code" />
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
          <UInput id="propertyType" name="propertyType" :required="false" :disable="true" inputClass="bg-gray-200" :model-value="useGetPropertyTypeName(ad!.propertyType)" />
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
        <div class="col-span-6 sm:col-span-2" v-show="!ad!.code.includes('LS') && !ad!.code.includes('LR')">
          <label for="apartmentNumber"> رقم الشقة <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="apartmentNumber" name="apartmentNumber" :size="'sm'" :required="!ad!.code.includes('LS') && !ad!.code.includes('LR')" v-model="state.apartmentNumber!" />
        </div>
        <!-- classification -->
        <div class="col-span-6 sm:col-span-2" v-show="ad!.code.includes('LS') || ad!.code.includes('LR')">
          <label for="classification"> تصنيف الارض <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="classification" name="classification" :size="'sm'" :required="ad!.code.includes('LS') || ad!.code.includes('LR')" v-model="state.classification!" />
        </div>
        <!-- neighborhood -->
        <div class="col-span-6 sm:col-span-2">
          <label for="neighborhood"> الحي </label>
          <UInput id="neighborhood" name="neighborhood" :size="'sm'" :required="false" v-model="state.neighborhood!" />
        </div>
        <!-- expectedRentAmount -->
        <div class="col-span-6 sm:col-span-2" v-show="ad!.code.includes('ASI')">
          <label for="expectedRentAmount"> دخل الايجار المتوقع <span class="text-sm text-primary-500">(اجباري)</span></label>
          <UInput id="expectedRentAmount" name="expectedRentAmount" :size="'sm'" :required="ad!.code.includes('ASI')" v-model="state.expectedRentAmount!" />
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
        <UTable class="" :rows="state.interestedPeople" :columns="[{ key: 'name', label: 'اسم الشخص' }, { key: 'number', label: 'رقم الشخص' }, { key: 'actions' }]">
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
      <UButton to="/ads" :size="'md'" class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white"> الغاء </UButton>
    </div>
  </form>
</template>
