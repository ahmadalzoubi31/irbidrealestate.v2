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
  rent: {
    renterName: "",
    renterNumber: "",
    rentDuration: "",
    rentAmount: 0,
    rentDate: new Date(),
    rentPaymentWay: "",
    isFurniture: false,
    rentStatus: 0,
  },
  commissionAmount: 0,
  maintenanceDiscount: 0,
  services: 0,
});
const isRegistered = ref(false);
const options = [
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

// Declare Stores
// const _buildingStore = useBuildingStore();
// const _apartmentStore = useBuildingStore();

// Define Computed
// const isLoading = computed(() => _buildingStore.loading);
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
    console.log(error.value);

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
console.log("🚀 ~ buildings:", buildings);
const fetchedBuildings = buildings.value.map((el) => {
  return { id: el.id, name: el.name };
});

const selected = ref();
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
      </div>
    </div>

    <div class="border-l-transparent border-r-transparent border-t-transparent rounded-sm border-2 border-b-primary">
      <h3 class="text-center font-semibold text-xl mb-1">معلومات الايجار</h3>
    </div>
    <div class="pt-6 pb-8 space-y-2">
      <div class="grid grid-cols-8 gap-x-6 gap-y-4">
        <!-- renterName -->
        <div class="col-span-6 sm:col-span-2">
          <label for="renterName"> اسم المستأجر <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput id="renterName" name="renterName" :size="'sm'" :required="true" v-model="state.rent.renterName" />
        </div>
        <!-- renterNumber -->
        <div class="col-span-6 sm:col-span-2">
          <label for="renterNumber">
            رقم المستأجر
            <span class="text-xs text-primary-500">(اجباري)</span>
          </label>
          <UInput id="renterNumber" name="renterNumber" :size="'sm'" :required="true" v-model="state.rent.renterNumber" />
        </div>
        <!-- rentAmount -->
        <div class="col-span-6 sm:col-span-2">
          <label for="rentAmount"> قيمة الإيجار <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput id="rentAmount" name="rentAmount" :type="'number'" :size="'sm'" :required="true" v-model="state.rent.rentAmount" />
        </div>
        <!-- rentDate -->
        <div class="col-span-6 sm:col-span-2">
          <label for="rentDate"> تاريخ الإيجار <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UInput icon="i-heroicons-calendar-days-20-solid" nam="rentDate" :size="'sm'" class="w-full" :model-value="format(state.rent.rentDate, 'dd/MM/yyyy')" />

            <template #panel="{ close }">
              <DatePicker v-model="state.rent.rentDate" is-required @close="close" />
            </template>
          </UPopover>
          <!-- <UInput id="rentDate" name="rentDate" :size="'sm'" :required="true" v-model="state.rent.rentDate" /> -->
        </div>
        <!-- rentDuration -->
        <div class="col-span-6 sm:col-span-2">
          <label for="rentDuration"> مدة الإيجار <span class="text-xs text-primary-500">(اجباري)</span></label>
          <UInput id="rentDuration" name="rentDuration" :size="'sm'" :required="true" v-model="state.rent.rentDuration" />
        </div>
        <!-- rentPaymentWay -->
        <div class="col-span-6 sm:col-span-2">
          <label for="rentPaymentWay"> طريقة دفع الإيجار </label>
          <UInput id="rentPaymentWay" name="rentPaymentWay" :size="'sm'" :required="false" v-model="state.rent.rentPaymentWay" />
        </div>
        <!-- isFurniture -->
        <div class="col-span-6 sm:col-span-2">
          <label for="isFurniture"> هل الشقة مفروشة ؟ </label>
          <USelectMenu id="isFurniture" name="isFurniture" v-model="state.rent.isFurniture" :options="options" value-attribute="value" option-attribute="name" />
        </div>
        <!-- furnitureImage -->
        <div class="col-span-6 sm:col-span-2" v-if="state.rent.isFurniture">
          <label for="furnitureImage"> صورة كشف الاثاث </label>
          <UInput id="furnitureImage" name="furnitureImage" @input="uploadImage()" type="file" size="sm" icon="i-heroicons-folder" />
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
        <div class="col-span-6 sm:col-span-2" v-if="state.rent.isFurniture">
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
