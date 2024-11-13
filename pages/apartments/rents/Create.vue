<script setup>
const toast = useToast();
import { format } from "date-fns";

// Define State
const state = reactive({
  buildingName: "",
  apartmentNumber: "",
  areaNumber: "",
  landingNumber: "",
  ownerName: "",
  ownerNumber: "",
  agentName: "",
  agentNumber: "",
  electricSub: "",
  waterSub: "",
  renterName: "",
  renterNumber: "",
  renterNationality: "jordan",
  renterIdentification: "",
  rentDuration: "",
  rentAmount: 0,
  isServiceIncluded: false,
  insurance: 0,
  rentDate: new Date(),
  rentPaymentWay: "",
  isFurniture: false,
  rentStatus: 3,
  commissionAmount: 0,
  maintenanceDiscount: 0,
  services: 0,
  contractFileName: "-",
});
const isRegistered = ref(false);
const isFurnitureOptions = [
  {
    id: 0,
    name: "لا",
    value: false,
  },
  {
    id: 1,
    name: "نعم",
    value: true,
  },
];
const isServiceIncludedOptions = [
  {
    id: 0,
    name: "لا",
    value: false,
  },
  {
    id: 1,
    name: "نعم",
    value: true,
  },
];
const nationalityOptions = [
  {
    id: 0,
    name: "اردني",
    value: "jordan",
  },
  {
    id: 1,
    name: "غير اردني",
    value: "other",
  },
];
const rentDurationOptions = [
  {
    id: 0,
    name: "سنة",
    value: "سنة",
  },
  {
    id: 1,
    name: "سنتان",
    value: "سنتان",
  },
  {
    id: 2,
    name: "3 سنين",
    value: "3 سنين",
  },
];

// Define Computed
// Declare Methods
const submitForm = async () => {
  const { data, refresh, status, error } = await useAsyncData("createApartment", () =>
    $fetch("/api/apartments", {
      method: "post",
      body: state,
    })
  );

  if (status.value === "success") {
    refreshNuxtData("getApartments");
    await navigateTo("/apartments/rents");
  }

  if (status.value === "error") {
    // console.log(error.value);
    toast.add({
      title: "لقد حدث خطأ ما",
      description: error.value.data.message,
      color: "rose",
      timeout: 10000,
    });
  }
};
const uploadImage = (event) => console.log(event);

// Get the select menu data
const buildings = useState("buildings");
const fetchedBuildings = buildings.value.map((el) => {
  return { id: el.id, name: el.name };
});
</script>

<template>
  <form @submit.prevent="submitForm()" class="relative mt-6 flex-1 px-4 sm:px-6">
    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">معلومات العقار</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-8 gap-x-6 gap-y-4">
        <!-- buildingName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="buildingName" class="flex justify-between">
            <div>اسم البناية <span class="text-xs text-primary-500">(اجباري) </span></div>
            <div><UToggle v-model="isRegistered" size="sm" /> <small> شقة خارجية </small></div>
          </label>
          <USelectMenu
            v-if="!isRegistered"
            id="buildingName"
            name="buildingName"
            :autofocus="true"
            v-model="state.buildingName"
            :options="fetchedBuildings"
            value-attribute="name"
            option-attribute="name"
          />
          <UInput v-else id="buildingName" name="buildingName" :autofocus="true" v-model="state.buildingName" />
        </div>
        <!-- apartmentNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="apartmentNumber">
            رقم الشقة
            <span class="text-xs text-primary-500">(اجباري)</span>
          </label>
          <UInput id="apartmentNumber" name="apartmentNumber" :type="'text'" :size="'sm'" :required="true" v-model="state.apartmentNumber" />
        </div>
        <!-- areaNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="areaNumber"> اسم الحوض ورقمه <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput id="areaNumber" name="areaNumber" :size="'sm'" :required="true" v-model="state.areaNumber" />
        </div>
        <!-- landingNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="landingNumber"> رقم قطعة الأرض <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput id="landingNumber" name="landingNumber" :size="'sm'" :required="true" v-model="state.landingNumber" />
        </div>
        <!-- ownerName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="ownerName"> اسم المالك <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput id="ownerName" name="ownerName" :size="'sm'" :required="true" v-model="state.ownerName" />
        </div>
        <!-- ownerNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="ownerNumber"> رقم المالك </label>
          <UInput id="ownerNumber" name="ownerNumber" :size="'sm'" :required="false" v-model="state.ownerNumber" />
        </div>
        <!-- agentName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="agentName"> اسم الوكيل <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput id="agentName" name="agentName" :size="'sm'" :required="true" v-model="state.agentName" />
        </div>
        <!-- agentNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="agentNumber"> رقم الوكيل </label>
          <UInput id="agentNumber" name="agentNumber" :size="'sm'" :required="false" v-model="state.agentNumber" />
        </div>
        <!-- electricBill -->
        <div class="col-span-6 sm:col-span-2">
          <label for="electricBill"> رقم اشتراك الكهرباء </label>
          <UInput id="electricBill" name="electricBill" :size="'sm'" :required="false" v-model="state.electricBill" />
        </div>
        <!-- waterSub -->
        <div class="col-span-6 sm:col-span-2">
          <label for="waterSub"> رقم اشتراك الماء </label>
          <UInput id="waterSub" name="waterSub" :size="'sm'" :required="false" v-model="state.waterSub" />
        </div>
        <!-- realLocation -->
        <div class="col-span-6 sm:col-span-4">
          <label for="realLocation"> موقع العقار الفعلي </label>
          <UInput id="realLocation" name="realLocation" :size="'sm'" :required="false" v-model="state.realLocation" />
        </div>
        <!-- isFurniture -->
        <div class="col-span-6 sm:col-span-2">
          <label for="isFurniture"> هل الشقة مفروشة ؟ </label>
          <USelectMenu
            id="isFurniture"
            name="isFurniture"
            :required="false"
            v-model="state.isFurniture"
            :options="isFurnitureOptions"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
        <!-- furnitureImage -->
        <div class="col-span-6 sm:col-span-2" v-if="state.isFurniture">
          <label for="furnitureImage"> صورة كشف الاثاث </label>
          <UInput id="furnitureImage" name="furnitureImage" @input="uploadImage()" type="file" size="sm" icon="i-heroicons-folder" />
        </div>
      </div>
    </div>

    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">معلومات الايجار</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-8 gap-x-6 gap-y-4">
        <!-- rentAmount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="rentAmount"> قيمة الإيجار <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput id="rentAmount" name="rentAmount" :type="'number'" :size="'sm'" :required="true" v-model="state.rentAmount" />
        </div>
        <!-- rentDate -->
        <div class="col-span-6 sm:col-span-2">
          <label for="rentDate"> تاريخ الإيجار <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UInput icon="i-heroicons-calendar-days-20-solid" nam="rentDate" :size="'sm'" class="w-full" :model-value="format(state.rentDate, 'dd/MM/yyyy')" />

            <template #panel="{ close }">
              <DatePicker v-model="state.rentDate" is-required @close="close" />
            </template>
          </UPopover>
          <!-- <UInput id="rentDate" name="rentDate" :size="'sm'" :required="true" v-model="state.rentDate" /> -->
        </div>
        <!-- rentDuration -->
        <div class="col-span-6 sm:col-span-2">
          <label for="rentDuration"> مدة الإيجار <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput id="rentDuration" name="rentDuration" :size="'sm'" :required="true" v-model="state.rentDuration" />
          <!-- <USelectMenu id="rentDuration" name="rentDuration" v-model="state.rentDuration" :options="rentDurationOptions" value-attribute="value" option-attribute="name" /> -->
        </div>
        <!-- rentPaymentWay -->
        <div class="col-span-6 sm:col-span-2">
          <label for="rentPaymentWay"> طريقة دفع الإيجار </label>
          <UInput id="rentPaymentWay" name="rentPaymentWay" :size="'sm'" :required="false" v-model="state.rentPaymentWay" />
        </div>
        <!-- isServiceIncluded -->
        <div class="col-span-6 sm:col-span-2">
          <label for="isServiceIncluded"> هل الايجار شامل الخدمات ؟ </label>
          <USelectMenu
            id="isServiceIncluded"
            name="isServiceIncluded"
            :required="false"
            v-model="state.isServiceIncluded"
            :options="isServiceIncludedOptions"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
        <!-- insurance  -->
        <div class="col-span-6 sm:col-span-2">
          <label for="insurance "> قيمة تأمين الشقة </label>
          <UInput id="insurance " name="insurance " :type="'text'" :size="'sm'" :required="false" v-model="state.insurance" />
        </div>
      </div>
    </div>

    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">معلومات المستأجرين</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-8 gap-x-6 gap-y-4">
        <!-- renterName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="renterName"> الاسم الكامل <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput id="renterName" name="renterName" :size="'sm'" :required="true" v-model="state.renterName" />
        </div>
        <!-- renterNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="renterNumber"> رقم الموبايل <span class="text-xs text-primary-500">(اجباري)</span> </label>
          <UInput id="renterNumber" name="renterNumber" :size="'sm'" :required="true" v-model="state.renterNumber" />
        </div>
        <!-- nationality -->
        <div class="col-span-6 sm:col-span-1">
          <label for="nationality"> الجنسية </label>
          <!-- <UInput id="nationality" name="nationality" :size="'sm'" :required="false" v-model="state.nationality" /> -->
          <USelectMenu
            id="nationality"
            name="nationality"
            :required="false"
            v-model="state.nationality"
            :options="nationalityOptions"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
        <!-- identification -->
        <div class="col-span-6 sm:col-span-2">
          <label for="identification" v-if="state.nationality === 'jordan'"> الرقم الوطني </label>
          <label for="identification" v-else> رقم جواز السفر </label>
          <UInput id="identification" name="identification" :size="'sm'" :required="false" v-model="state.identification" />
        </div>
        <!-- identificationImage -->
        <div class="col-span-6 sm:col-span-1">
          <label for="identificationImage"> صورة الاثبات </label>
          <UInput id="identificationImage" name="identificationImage" @input="uploadImage()" type="file" size="sm" :required="false" icon="i-heroicons-folder" />
        </div>
        <!-- contractImage -->
        <div class="col-span-6 sm:col-span-2">
          <label for="contractImage"> صورة العقد <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput id="contractImage" name="contractImage" @input="uploadImage()" type="file" size="sm" :required="true" icon="i-heroicons-folder" />
        </div>
      </div>
    </div>

    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">معلومات اضافية</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-8 gap-x-6 gap-y-4">
        <!-- commissionAmount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="commissionAmount"> العمولة </label>
          <UInput id="commissionAmount" name="commissionAmount" :type="'number'" :size="'sm'" :required="false" v-model="state.commissionAmount" />
        </div>
        <!-- maintenanceDiscount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="maintenanceDiscount"> خصم الصيانة </label>
          <UInput id="maintenanceDiscount" name="maintenanceDiscount" :type="'text'" :size="'sm'" :required="false" v-model="state.maintenanceDiscount" />
        </div>
        <!-- services -->
        <div class="col-span-6 sm:col-span-2">
          <label for="services"> الخدمات </label>
          <UInput id="services" name="services" :type="'number'" :size="'sm'" :required="false" v-model="state.services" />
        </div>
        <!-- contractFile -->
        <div class="col-span-6 sm:col-span-2" v-if="state.isFurniture">
          <label for="contractFile"> صورة كشف الاثاث </label>
          <UInput id="contractFile" name="contractFile" @input="uploadImage()" type="file" size="sm" icon="i-heroicons-folder" />
        </div>
      </div>
    </div>

    <!-- <SharedSaveButton v-if="_sharedStore.slideOver.action !== 'show-details'" /> -->
    <div class="float-left">
      <UButton :type="'submit'" :size="'md'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
      <UButton :type="'button'" to="/apartments/rents" :size="'md'" class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white">
        الغاء
      </UButton>
    </div>
  </form>
</template>
