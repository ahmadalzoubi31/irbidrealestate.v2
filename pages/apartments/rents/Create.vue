<script setup lang="ts">
// *** Dependencies ***
import { format } from "date-fns";
const toast = useToast();
const { createApartment } = useApartmentActions();

// *** Define Variables ***
const state: ICreateApartment = reactive({
  buildingId: "",
  apartmentNumber: "",
  ownerName: "",
  ownerNumber: "",
  agentName: "",
  agentNumber: "",
  electricSub: "",
  waterSub: "",
  realLocation: "",
  renterName: "",
  renterNumber: "",
  rentDuration: "",
  rentAmount: 0,
  rentDate: new Date(),
  rentPaymentWay: "",
  isFurniture: false,
  rentStatus: 3,
  renterNationality: "اردني",
  renterIdentification: "",
  isServiceIncluded: false,
  insurance: 0,
  commissionAmount: 0,
});
const { handleFileInput, files } = useFileStorage({ clearOldFiles: true });
const additionalState = reactive({
  buildingName: "",
  basinName: "",
  basinNumber: "",
  landNumber: "",
  maintenanceAmount: 0,
  serviceAmount: 0,
});
const isOutOfBuilding = ref(false);
const isFurnitureOptions = [
  { id: 0, name: "لا", value: false },
  { id: 1, name: "نعم", value: true },
];
const isServiceIncludedOptions = [
  { id: 0, name: "لا", value: false },
  { id: 1, name: "نعم", value: true },
];
const renterNationalityOptions = [
  { id: 0, name: "اردني", value: "اردني" },
  { id: 1, name: "غير اردني", value: "غير اردني" },
];
const rentDurationOptions = [
  { id: 0, name: "سنة", value: "سنة" },
  { id: 1, name: "سنتان", value: "سنتان" },
  { id: 2, name: "3 سنين", value: "3 سنين" },
];

// *** Define Methods ***
const submitForm = async () => {
  // Early validation for required fields before making the API call
  if (!state.apartmentNumber || !state.ownerName) {
    toast.add({
      description: "من فضلك أكمل جميع الحقول المطلوبة.",
      color: "yellow",
      timeout: 5000,
    });
    return;
  }
  useLoadingIndicator().start();
  await createApartment(state);
};

const uploadImage = (event: any) => console.log(event);

// Get the select menu data
const { buildings: availableBuildings } = useBuildings();
const computedBuildings = computed(() =>
  availableBuildings.value?.map((el) => {
    return { id: el.id, name: el.name };
  })
);

// Filling data
const fillBasinName = computed(() => availableBuildings.value?.find((b) => b.id == state.buildingId)?.basinName);
const fillBasinNumber = computed(() => availableBuildings.value?.find((b) => b.id == state.buildingId)?.basinNumber);
const fillLandNumber = computed(() => availableBuildings.value?.find((b) => b.id == state.buildingId)?.landNumber);
const fillServiceAmount = computed(() => availableBuildings.value?.find((b) => b.id == state.buildingId)?.serviceAmount);
const fillMaintenanceAmount = computed(() => availableBuildings.value?.find((b) => b.id == state.buildingId)?.maintenanceAmount);

watch(isOutOfBuilding, (newVal, oldVal) => {
  console.log("🚀 ~ watch ~ newVal:", newVal);
  if (newVal) {
    state.buildingId = "";
  }
});
</script>

<template>
  <form @submit.prevent="submitForm()" class="relative mt-6 flex-1 px-4 sm:px-6">
    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">معلومات العقار</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-10 gap-x-6 gap-y-4">
        <!-- buildingName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="buildingName" class="flex justify-between">
            <div>اسم البناية <span v-show="!isOutOfBuilding" class="text-xs text-primary-500">(اجباري) </span></div>
            <div><UToggle v-model="isOutOfBuilding" size="sm" /> <small> شقة خارجية </small></div>
          </label>
          <USelectMenu
            v-if="!isOutOfBuilding"
            id="buildingName"
            name="buildingName"
            v-model="state.buildingId"
            :autofocus="true"
            :required="!isOutOfBuilding"
            :options="computedBuildings"
            value-attribute="id"
            option-attribute="name"
          />
          <UInput v-else id="buildingName" name="buildingName" :autofocus="true" :disabled="true" />
        </div>
        <!-- apartmentNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="apartmentNumber">
            رقم الشقة
            <span class="text-xs text-primary-500">(اجباري)</span>
          </label>
          <UInput id="apartmentNumber" name="apartmentNumber" :type="'text'" :size="'sm'" :required="true" v-model="state.apartmentNumber" />
        </div>
        <!-- basinName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="basinName"> اسم الحوض <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput
            v-if="!isOutOfBuilding"
            id="basinName"
            name="basinName"
            :size="'sm'"
            :required="true"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="fillBasinName"
          />
          <UInput v-else id="basinName" name="basinName" :size="'sm'" :required="true" v-model="additionalState.basinName" />
        </div>
        <!-- basinNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="basinNumber"> رقم الحوض <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput
            v-if="!isOutOfBuilding"
            id="basinNumber"
            name="basinNumber"
            :size="'sm'"
            :required="true"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="fillBasinNumber"
          />
          <UInput v-else id="basinNumber" name="basinNumber" :size="'sm'" :required="true" v-model="additionalState.basinNumber" />
        </div>
        <!-- landNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="landNumber"> رقم قطعة الأرض <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput
            v-if="!isOutOfBuilding"
            id="landNumber"
            name="landNumber"
            :size="'sm'"
            :required="true"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="fillLandNumber"
          />
          <UInput v-else id="landNumber" name="landNumber" :size="'sm'" :required="true" v-model="additionalState.landNumber" />
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
        <!-- electricSub -->
        <div class="col-span-6 sm:col-span-2">
          <label for="electricSub"> رقم اشتراك الكهرباء </label>
          <UInput id="electricSub" name="electricSub" :size="'sm'" :required="false" v-model="state.electricSub" />
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
          <UInput id="furnitureImage" name="furnitureImage" @input="handleFileInput" type="file" size="sm" icon="i-heroicons-folder" />
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
            <UInput
              icon="i-heroicons-calendar-days-20-solid"
              nam="rentDate"
              :size="'sm'"
              class="w-full"
              :model-value="format(state.rentDate, 'dd/MM/yyyy')"
            />

            <template #panel="{ close }">
              <AppDatePicker v-model="state.rentDate" is-required @close="close" />
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
          <UInput id="insurance " name="insurance " :type="'number'" :size="'sm'" :required="false" v-model="state.insurance" />
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
        <!-- renterNationality -->
        <div class="col-span-6 sm:col-span-1">
          <label for="renterNationality"> الجنسية </label>
          <!-- <UInput id="renterNationality" name="renterNationality" :size="'sm'" :required="false" v-model="state.renterNationality" /> -->
          <USelectMenu
            id="renterNationality"
            name="renterNationality"
            :required="false"
            v-model="state.renterNationality"
            :options="renterNationalityOptions"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
        <!-- renterIdentification -->
        <div class="col-span-6 sm:col-span-2">
          <label for="renterIdentification" v-if="state.renterNationality == 'اردني'"> الرقم الوطني </label>
          <label for="renterIdentification" v-else> رقم جواز السفر </label>
          <UInput id="renterIdentification" name="renterIdentification" :size="'sm'" :required="false" v-model="state.renterIdentification" />
        </div>
        <!-- renterIdentificationImage -->
        <div class="col-span-6 sm:col-span-1">
          <label for="renterIdentificationImage"> صورة الاثبات </label>
          <UInput
            id="renterIdentificationImage"
            name="renterIdentificationImage"
            @input="handleFileInput"
            type="file"
            size="sm"
            :required="false"
            icon="i-heroicons-folder"
          />
        </div>
        <!-- contractImage -->
        <div class="col-span-6 sm:col-span-2">
          <label for="contractImage">
            صورة العقد
            <!-- <span class="text-xs text-primary-500">(اجباري)</span> -->
          </label>
          <UInput
            id="contractImage"
            name="contractImage"
            @input="handleFileInput"
            type="file"
            size="sm"
            :required="false"
            icon="i-heroicons-folder"
          />
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
        <!-- maintenanceAmount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="maintenanceAmount"> خصم الصيانة </label>
          <UInput
            v-if="!isOutOfBuilding"
            id="maintenanceAmount"
            name="maintenanceAmount"
            :size="'sm'"
            :required="true"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="fillMaintenanceAmount"
          />
          <UInput
            v-else
            id="maintenanceAmount"
            name="maintenanceAmount"
            :type="'number'"
            :size="'sm'"
            :required="false"
            v-model="additionalState.maintenanceAmount"
          />
        </div>
        <!-- serviceAmount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="serviceAmount"> الخدمات </label>
          <UInput
            v-if="!isOutOfBuilding"
            id="serviceAmount"
            name="serviceAmount"
            :size="'sm'"
            :required="true"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="fillServiceAmount"
          />
          <UInput
            v-else
            id="serviceAmount"
            name="serviceAmount"
            :type="'number'"
            :size="'sm'"
            :required="false"
            v-model="additionalState.serviceAmount"
          />
        </div>
      </div>
    </div>

    <!-- <SharedSaveButton v-if="_sharedStore.slideOver.action !== 'show-details'" /> -->
    <div class="text-left mb-5">
      <UButton :type="'submit'" :size="'md'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
      <UButton
        to="/apartments/rents"
        :size="'md'"
        class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white"
      >
        الغاء
      </UButton>
    </div>
  </form>
</template>
