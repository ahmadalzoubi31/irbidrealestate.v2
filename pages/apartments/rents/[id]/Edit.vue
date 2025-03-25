<script setup lang="ts">
import { format } from "date-fns";

const { getOneApartment, editApartment } = useApartmentActions();
const route = useRoute();

// Extract route parameter
const selectedApartmentId = ref(Number(route.params.id));

const { data: apartment } = await getOneApartment(selectedApartmentId.value);
const { handleFileInput: handle1, files: furnitureImages } = useFileStorage({
  clearOldFiles: true,
});
const { handleFileInput: handle2, files: renterIdentificationImage } =
  useFileStorage({ clearOldFiles: true });
const { handleFileInput: handle3, files: contractImage } = useFileStorage({
  clearOldFiles: true,
});

const state: IEditApartment = reactive({
  code: "",
  ownerName: "",
  ownerNumber: "",
  agentName: "",
  agentNumber: "",
  electricSub: "",
  waterSub: "",
  realLocation: "",
  rentDuration: "",
  rentAmount: 0,
  rentDate: new Date(),
  rentPaymentWay: "",
  isFurniture: "لا",
  rentStatus: 3,
  renterInfo: [],
  isServiceIncluded: "لا",
  insurance: 0,
  insuranceWithWho: "غير محدد",
  insuranceType: "عادي",
  commissionAmount: 0,
});
const isFurnitureOptions = [
  { id: 1, name: "لا", value: "لا" },
  { id: 2, name: "نعم", value: "نعم" },
  { id: 3, name: "نصف فرش", value: "نصف فرش" },
];
const isServiceIncludedOptions = [
  { id: 1, name: "لا", value: "لا" },
  { id: 2, name: "نعم", value: "نعم" },
];
const renterNationalityOptions = [
  {
    id: 1,
    name: "اردني",
    value: "اردني",
  },
  {
    id: 2,
    name: "غير اردني",
    value: "غير اردني",
  },
];
const isModalOpen = ref(false);
const selectedImage = ref("");

// Reactively update the form state when `apartment` becomes available
watchEffect(() => {
  if (apartment) {
    Object.assign(state, {
      code: apartment.code,
      ownerName: apartment.ownerName,
      ownerNumber: apartment.ownerNumber!,
      agentName: apartment.agentName,
      agentNumber: apartment.agentNumber!,
      electricSub: apartment.electricSub!,
      waterSub: apartment.waterSub!,
      realLocation: apartment.realLocation!,
      rentDuration: apartment.rentDuration,
      rentAmount: apartment.rentAmount,
      rentDate: apartment.rentDate,
      rentPaymentWay: apartment.rentPaymentWay!,
      isFurniture: apartment.isFurniture,
      rentStatus: apartment.rentStatus,
      renterInfo: apartment.renterInfo,
      isServiceIncluded: apartment.isServiceIncluded,
      insurance: apartment.insurance,
      insuranceWithWho: apartment.insuranceWithWho,
      insuranceType: apartment.insuranceType,
      commissionAmount: apartment.commissionAmount,
    });
  }
});

// Handle form submission
const submitForm = async () => {
  useLoadingIndicator().start();
  await editApartment(selectedApartmentId.value, state);
};
const removeFurnitureImages = (index: number) => {
  furnitureImages.value.splice(index, 1);
};
</script>

<template>
  <form
    @submit.prevent="submitForm()"
    class="relative mt-6 flex-1 px-4 sm:px-6"
  >
    <div
      class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary"
    >
      <h3 class="text-center font-semibold text-xl mb-1">معلومات العقار</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-10 gap-x-6 gap-y-4">
        <!-- buildingName -->
        <div class="col-span-10 sm:col-span-2">
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
            :modelValue="apartment?.building.name"
          />
        </div>
        <!-- apartmentNumber -->
        <div class="col-span-10 sm:col-span-2">
          <label for="apartmentNumber"> رقم الشقة </label>
          <UInput
            id="apartmentNumber"
            inputClass="bg-gray-200"
            name="apartmentNumber"
            :size="'sm'"
            :required="false"
            :disabled="true"
            :modelValue="apartment?.apartmentNumber"
          />
        </div>
        <!-- code -->
        <div class="col-span-10 sm:col-span-2">
          <label for="code"> ترميز الشقة </label>
          <UInput
            id="code"
            name="code"
            :type="'text'"
            :size="'sm'"
            :required="false"
            v-model="state.code"
          />
        </div>
        <!-- basinName -->
        <div class="col-span-10 sm:col-span-2">
          <label for="basinName"> اسم الحوض </label>
          <UInput
            id="basinName"
            name="basinName"
            :size="'sm'"
            :required="false"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="apartment?.building.basinName"
          />
        </div>
        <!-- basinNumber -->
        <div class="col-span-10 sm:col-span-2">
          <label for="basinNumber"> رقم الحوض </label>
          <UInput
            id="basinNumber"
            name="basinNumber"
            :size="'sm'"
            :required="false"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="apartment?.building.basinNumber"
          />
        </div>
        <!-- landNumber -->
        <div class="col-span-10 sm:col-span-2">
          <label for="landNumber"> رقم قطعة الأرض </label>
          <UInput
            id="landNumber"
            name="landNumber"
            :size="'sm'"
            :required="false"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="apartment?.building.landNumber"
          />
        </div>
        <!-- ownerName -->
        <div class="col-span-10 sm:col-span-2">
          <label for="ownerName">
            اسم المالك
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="ownerName"
            name="ownerName"
            :size="'sm'"
            :required="true"
            v-model="state.ownerName"
          />
        </div>
        <!-- ownerNumber -->
        <div class="col-span-10 sm:col-span-2">
          <label for="ownerNumber"> رقم المالك </label>
          <UInput
            id="ownerNumber"
            name="ownerNumber"
            :size="'sm'"
            :required="false"
            v-model="state.ownerNumber"
          />
        </div>
        <!-- agentName -->
        <div class="col-span-10 sm:col-span-2">
          <label for="agentName">
            اسم الوكيل
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="agentName"
            name="agentName"
            :size="'sm'"
            :required="true"
            v-model="state.agentName"
          />
        </div>
        <!-- agentNumber -->
        <div class="col-span-10 sm:col-span-2">
          <label for="agentNumber"> رقم الوكيل </label>
          <UInput
            id="agentNumber"
            name="agentNumber"
            :size="'sm'"
            :required="false"
            v-model="state.agentNumber"
          />
        </div>
        <!-- electricSub -->
        <div class="col-span-10 sm:col-span-2">
          <label for="electricSub"> رقم اشتراك الكهرباء </label>
          <UInput
            id="electricSub"
            name="electricSub"
            :size="'sm'"
            :required="false"
            v-model="state.electricSub"
          />
        </div>
        <!-- waterSub -->
        <div class="col-span-10 sm:col-span-2">
          <label for="waterSub"> رقم اشتراك الماء </label>
          <UInput
            id="waterSub"
            name="waterSub"
            :size="'sm'"
            :required="false"
            v-model="state.waterSub"
          />
        </div>
        <!-- realLocation -->
        <div class="col-span-10 sm:col-span-4">
          <label for="realLocation"> موقع العقار الفعلي </label>
          <UInput
            id="realLocation"
            name="realLocation"
            :size="'sm'"
            :required="false"
            v-model="state.realLocation"
          />
        </div>
        <!-- isFurniture -->
        <div class="col-span-10 sm:col-span-2">
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
        <!-- furnitureImages -->
        <!-- <div v-if="state.isFurniture == 'نعم'" class="col-span-10 sm:col-span-2">
          <label for="furnitureImages"> صورة كشف الاثاث </label>
          <UInput id="furnitureImages" name="furnitureImages" :type="'file'" :size="'sm'" :required="false" @input="handle1" multiple />
        </div>
        <div v-if="state.isFurniture == 'نعم'" class="col-span-6 sm:col-span-6 flex">
          <div v-for="(el, index) in apartment?.files" class="relative inline-block">
            <NuxtImg
              :src="el.fileContent.value"
              alt="file"
              class="rounded-lg shadow-md h-[100px] w-[100px] hover:shadow-lg cursor-pointer mr-3"
              @click="openFile(el.fileContent.value, false)"
              preload
            />
            <UButton
              icon="i-heroicons-minus-20-solid"
              @click="removeFurnitureImages(index)"
              class="absolute top-0 left-0 bg-gray-400 hover:bg-gray-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
              style="transform: translate(-40%, -40%)"
            >
            </UButton>
          </div>
          <div v-for="(el, index) in furnitureImages" class="relative inline-block">
            <NuxtImg
              :src="el.content?.toString()"
              alt="file"
              class="rounded-lg shadow-md h-[100px] w-[100px] hover:shadow-lg cursor-pointer mr-3"
              @click="openFile(el.content?.toString() as string, false)"
              preload
            />
            <UButton
              icon="i-heroicons-minus-20-solid"
              @click="removeFurnitureImages(index)"
              class="absolute top-0 left-0 bg-gray-400 hover:bg-gray-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
              style="transform: translate(-40%, -40%)"
            >
            </UButton>
          </div>
        </div> -->
      </div>
    </div>

    <div
      class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary"
    >
      <h3 class="text-center font-semibold text-xl mb-1">معلومات الايجار</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-10 gap-x-6 gap-y-4">
        <!-- rentAmount -->
        <div class="col-span-10 sm:col-span-2">
          <label for="rentAmount">
            قيمة الإيجار
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="rentAmount"
            name="rentAmount"
            :type="'number'"
            :size="'sm'"
            :required="true"
            v-model="state.rentAmount"
          />
        </div>
        <!-- rentDate -->
        <div class="col-span-10 sm:col-span-2">
          <label for="rentDate">
            تاريخ الإيجار
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UInput
              icon="i-heroicons-calendar-days-20-solid"
              nam="rentDate"
              :size="'sm'"
              class="w-full"
              :model-value="format(state.rentDate, 'dd/MM/yyyy')"
            />

            <template #panel="{ close }">
              <AppDatePicker
                v-model="state.rentDate"
                is-required
                @close="close"
              />
            </template>
          </UPopover>
          <!-- <UInput id="rentDate" name="rentDate" :size="'sm'" :required="true" v-model="state.rentDate" /> -->
        </div>
        <!-- rentDuration -->
        <div class="col-span-10 sm:col-span-2">
          <label for="rentDuration">
            مدة الإيجار
            <span class="text-xs text-primary-500">(اجباري)</span></label
          >
          <UInput
            id="rentDuration"
            name="rentDuration"
            :size="'sm'"
            :required="true"
            v-model="state.rentDuration"
          />
          <!-- <USelectMenu id="rentDuration" name="rentDuration" v-model="state.rentDuration" :options="rentDurationOptions" value-attribute="value" option-attribute="name" /> -->
        </div>
        <!-- rentPaymentWay -->
        <div class="col-span-10 sm:col-span-2">
          <label for="rentPaymentWay"> طريقة دفع الإيجار </label>
          <UInput
            id="rentPaymentWay"
            name="rentPaymentWay"
            :size="'sm'"
            :required="false"
            v-model="state.rentPaymentWay"
          />
        </div>
        <!-- isServiceIncluded -->
        <div class="col-span-10 sm:col-span-2">
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
        <div class="col-span-10 sm:col-span-2">
          <label for="insurance "> قيمة تأمين الشقة </label>
          <UInput
            id="insurance "
            name="insurance "
            :type="'number'"
            :size="'sm'"
            :required="false"
            v-model="state.insurance"
          />
        </div>
        <!-- insuranceWithWho  -->
        <div class="col-span-10 sm:col-span-2">
          <label for="insuranceWithWho "> التأمين مع ؟ </label>
          <USelectMenu
            id="insuranceWithWho"
            name="insuranceWithWho"
            :required="false"
            v-model="state.insuranceWithWho"
            :options="[
              { value: 'غير محدد', name: 'غير محدد' },
              { value: 'المؤسسة', name: 'المؤسسة' },
              { value: 'الوكيل', name: 'الوكيل' },
              { value: 'المالك', name: 'المالك' },
            ]"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
        <!-- insuranceType  -->
        <div class="col-span-10 sm:col-span-2">
          <label for="insuranceType "> نوع التأمين </label>
          <USelectMenu
            id="insuranceType"
            name="insuranceType"
            :required="false"
            v-model="state.insuranceType"
            :options="[
              { value: 'عادي', name: 'عادي' },
              { value: 'شيك', name: 'شيك' },
            ]"
            value-attribute="value"
            option-attribute="name"
          />
        </div>
      </div>
    </div>

    <div
      class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary"
    >
      <h3 class="text-center font-semibold text-xl mb-1">معلومات المستأجرين</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <ApartmentRenterInfo :renterDetails="state.renterInfo" />
    </div>

    <div
      class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary"
    >
      <h3 class="text-center font-semibold text-xl mb-1">معلومات اضافية</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-6 gap-x-6 gap-y-4">
        <!-- commissionAmount -->
        <div class="col-span-10 sm:col-span-2">
          <label for="commissionAmount"> العمولة </label>
          <UInput
            id="commissionAmount"
            name="commissionAmount"
            :type="'number'"
            :size="'sm'"
            :required="false"
            v-model="state.commissionAmount"
          />
        </div>
        <!-- maintenanceAmount -->
        <div class="col-span-10 sm:col-span-2">
          <label for="maintenanceAmount"> خصم الصيانة </label>
          <UInput
            id="maintenanceAmount"
            name="maintenanceAmount"
            :size="'sm'"
            :required="true"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="apartment?.building.maintenanceAmount"
          />
        </div>
        <!-- serviceAmount -->
        <div class="col-span-10 sm:col-span-2">
          <label for="serviceAmount"> الخدمات </label>
          <UInput
            id="serviceAmount"
            name="serviceAmount"
            :size="'sm'"
            :required="false"
            :disabled="true"
            inputClass="bg-gray-200"
            :model-value="apartment?.building.serviceAmount"
          />
        </div>
      </div>
    </div>

    <!-- <SharedSaveButton v-if="_sharedStore.slideOver.action !== 'show-details'" /> -->
    <div class="text-left mb-5">
      <UButton
        :type="'submit'"
        :size="'sm'"
        class="w-20 text-center place-content-center ml-3"
      >
        حفظ
      </UButton>
      <UButton
        :type="'button'"
        to="/apartments/rents"
        :size="'sm'"
        class="w-20 text-center place-content-center bg-gray-200 hover:bg-gray-500 text-black hover:text-white"
      >
        الغاء
      </UButton>
    </div>
  </form>
</template>
