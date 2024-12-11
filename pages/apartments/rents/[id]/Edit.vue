<script setup lang="ts">
import { format } from "date-fns";
import type { Apartment } from "@prisma/client";

const { editApartment } = useApartmentActions();
const route = useRoute();

// Extract route parameter
const selectedApartmentId = ref(route.params.id as string);

// Access the shared state for apartments
const apartments = useState<Apartment[]>("apartmentList");
// Find the specific apartment reactively
const apartment: any = computed(() => apartments.value?.find((el) => el.id === Number(selectedApartmentId.value)));

if (!apartments.value || apartments.value.length === 0) {
  await navigateTo("/apartments/rents");
}

const state: IEditApartment = reactive({
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
const renterNationalityOptions = [
  {
    id: 0,
    name: "اردني",
    value: "اردني",
  },
  {
    id: 1,
    name: "غير اردني",
    value: "غير اردني",
  },
];
// Removed unused rentDurationOptions

// Reactively update the form state when `building` becomes available
watchEffect(() => {
  if (apartment.value) {
    state.ownerName = apartment.value.ownerName;
    state.ownerNumber = apartment.value.ownerNumber!;
    state.agentName = apartment.value.agentName;
    state.agentNumber = apartment.value.agentNumber!;
    state.electricSub = apartment.value.electricSub!;
    state.waterSub = apartment.value.waterSub!;
    state.realLocation = apartment.value.realLocation!;
    state.renterName = apartment.value.renterName;
    state.renterNumber = apartment.value.renterNumber;
    state.rentDuration = apartment.value.rentDuration;
    state.rentAmount = apartment.value.rentAmount;
    state.rentDate = apartment.value.rentDate;
    state.rentPaymentWay = apartment.value.rentPaymentWay!;
    state.isFurniture = apartment.value.isFurniture;
    state.rentStatus = apartment.value.rentStatus;
    state.renterNationality = apartment.value.renterNationality!;
    state.renterIdentification = apartment.value.renterIdentification!;
    state.isServiceIncluded = apartment.value.isServiceIncluded;
    state.insurance = apartment.value.insurance;
    state.commissionAmount = apartment.value.commissionAmount;
  }
});

// Handle form submission
const submitForm = async () => {
  useLoadingIndicator().start();
  await editApartment(selectedApartmentId.value, state);
};
const uploadImage = (event: any) => console.log(event);
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
            <div>اسم البناية</div>
          </label>
          <UInput
            id="buildingName"
            inputClass="bg-gray-200"
            name="buildingName"
            :size="'sm'"
            :required="false"
            :disabled="true"
            :modelValue="apartment!.buildingName"
          />
        </div>
        <!-- apartmentNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="apartmentNumber"> رقم الشقة </label>
          <UInput
            id="apartmentNumber"
            inputClass="bg-gray-200"
            name="apartmentNumber"
            :size="'sm'"
            :required="false"
            :disabled="true"
            :modelValue="apartment!.apartmentNumber"
          />
        </div>
        <!-- basinName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="basinName"> اسم الحوض </label>
          <UInput
            id="basinName"
            name="basinName"
            :size="'sm'"
            :required="false"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="apartment!.building.basinName"
          />
        </div>
        <!-- basinNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="basinNumber"> رقم الحوض </label>
          <UInput
            id="basinNumber"
            name="basinNumber"
            :size="'sm'"
            :required="false"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="apartment!.building.basinNumber"
          />
        </div>
        <!-- landNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="landNumber"> رقم قطعة الأرض </label>
          <UInput
            id="landNumber"
            name="landNumber"
            :size="'sm'"
            :required="false"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="apartment!.building.landNumber"
          />
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
          <UInput id="furnitureImage" name="furnitureImage" @input="uploadImage($event)" type="file" size="sm" icon="i-heroicons-folder" />
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
            @input="uploadImage($event)"
            type="file"
            size="sm"
            :required="false"
            icon="i-heroicons-folder"
          />
        </div>
        <!-- contractImage -->
        <div class="col-span-6 sm:col-span-2">
          <label for="contractImage"> صورة العقد <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput
            id="contractImage"
            name="contractImage"
            @input="uploadImage($event)"
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
            id="maintenanceAmount"
            name="maintenanceAmount"
            :size="'sm'"
            :required="true"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="apartment!.building.maintenanceAmount"
          />
        </div>
        <!-- serviceAmount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="serviceAmount"> الخدمات </label>
          <UInput
            id="serviceAmount"
            name="serviceAmount"
            :size="'sm'"
            :required="false"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="apartment!.building.serviceAmount"
          />
        </div>
      </div>
    </div>

    <!-- <SharedSaveButton v-if="_sharedStore.slideOver.action !== 'show-details'" /> -->
    <div class="text-left mb-5">
      <UButton :type="'submit'" :size="'md'" class="w-20 text-center place-content-center ml-3"> حفظ </UButton>
      <UButton
        :type="'button'"
        to="/apartments/rents"
        :size="'md'"
        class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white"
      >
        الغاء
      </UButton>
    </div>
  </form>
</template>
